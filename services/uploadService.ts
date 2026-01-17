/**
 * cPanel Upload Service (via Proxy Server)
 * Uploads generated courses to bdnhost.net/Resources/ through a proxy to avoid CORS issues
 */

export interface UploadConfig {
  ftpHost: string;
  ftpUsername: string;
  ftpPassword: string;
  targetPath: string;
}

export interface UploadResult {
  success: boolean;
  message: string;
  url?: string;
  error?: string;
}

// Proxy server URL (local backend)
const PROXY_URL = process.env.PROXY_URL || 'http://localhost:3002';

/**
 * Upload a ZIP file to cPanel via proxy server
 * This avoids CORS issues by routing through a local Node.js backend
 */
export async function uploadToCPanel(
  zipBlob: Blob,
  courseName: string,
  config: UploadConfig
): Promise<UploadResult> {
  try {
    console.log(`[Upload] Starting upload of ${courseName} via proxy...`);

    // Convert Blob to Base64 for transmission
    const zipBase64 = await blobToBase64(zipBlob);

    // Call proxy server endpoint
    const response = await fetch(`${PROXY_URL}/api/upload-course`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zipBase64,
        courseName,
        config: {
          cpanelHost: config.cpanelHost,
          cpanelUsername: config.cpanelUsername,
          cpanelApiToken: config.cpanelApiToken,
          targetPath: config.targetPath
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Proxy server returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log(`[Upload] ✅ Success! Course available at: ${result.url}`);
      return {
        success: true,
        message: result.message,
        url: result.url
      };
    } else {
      console.error('[Upload] Failed:', result.error);
      return {
        success: false,
        message: result.message || 'העלאה נכשלה',
        error: result.error
      };
    }
  } catch (error: any) {
    console.error('[Upload] Error:', error);

    // Check if proxy server is running
    if (error.message.includes('Failed to fetch') || error.message.includes('ECONNREFUSED')) {
      return {
        success: false,
        message: 'שרת ה-Proxy לא רץ',
        error: 'הרץ את שרת ה-Proxy עם: npm run server'
      };
    }

    return {
      success: false,
      message: 'העלאה נכשלה',
      error: error.message || 'שגיאה לא ידועה'
    };
  }
}

/**
 * Test connection to cPanel via proxy
 */
export async function testCPanelConnection(config: UploadConfig): Promise<UploadResult> {
  try {
    console.log('[Test] Testing cPanel connection via proxy...');

    const response = await fetch(`${PROXY_URL}/api/test-cpanel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cpanelHost: config.cpanelHost,
        cpanelUsername: config.cpanelUsername,
        cpanelApiToken: config.cpanelApiToken,
        targetPath: config.targetPath
      }),
    });

    if (!response.ok) {
      throw new Error(`Proxy server returned ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('[Test] Error:', error);

    if (error.message.includes('Failed to fetch') || error.message.includes('ECONNREFUSED')) {
      return {
        success: false,
        message: 'שרת ה-Proxy לא רץ',
        error: 'הרץ את שרת ה-Proxy עם: npm run server'
      };
    }

    return {
      success: false,
      message: 'בדיקת חיבור נכשלה',
      error: error.message
    };
  }
}

/**
 * Helper: Convert Blob to Base64 string
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Remove data URL prefix (e.g., "data:application/zip;base64,")
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Get upload configuration from environment variables
 */
export function getUploadConfig(): UploadConfig | null {
  const host = process.env.CPANEL_HOST;
  const username = process.env.CPANEL_USERNAME;
  const token = process.env.CPANEL_API_TOKEN;
  const path = process.env.CPANEL_TARGET_PATH || 'public_html/Resources';

  if (!host || !username || !token) {
    console.warn('[Config] Missing cPanel credentials in environment variables');
    return null;
  }

  return {
    cpanelHost: host,
    cpanelUsername: username,
    cpanelApiToken: token,
    targetPath: path
  };
}

/**
 * Check if proxy server is running
 */
export async function isProxyRunning(): Promise<boolean> {
  try {
    const response = await fetch(`${PROXY_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000) // 2 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
