/**
 * cPanel Upload Service
 * Automatically uploads generated course folders to bdnhost.net/Resources/
 */

export interface UploadConfig {
  cpanelHost: string;
  cpanelUsername: string;
  cpanelApiToken: string;
  targetPath: string; // Path relative to /home4/shlomion/ (e.g., "public_html/Resources")
}

export interface UploadResult {
  success: boolean;
  message: string;
  uploadedFiles?: string[];
  error?: string;
}

/**
 * Upload a ZIP file directly to cPanel using the File Manager API (UAPI)
 */
export async function uploadToCPanel(
  zipBlob: Blob,
  courseName: string,
  config: UploadConfig
): Promise<UploadResult> {
  try {
    console.log(`[Upload] Starting upload of ${courseName} to cPanel...`);

    // Step 1: Upload the ZIP file
    const uploadResult = await uploadZipFile(zipBlob, courseName, config);
    if (!uploadResult.success) {
      return uploadResult;
    }

    // Step 2: Extract the ZIP on the server
    const extractResult = await extractZipOnServer(courseName, config);
    if (!extractResult.success) {
      return extractResult;
    }

    // Step 3: Clean up the ZIP file (optional)
    await deleteZipFile(courseName, config);

    return {
      success: true,
      message: `קורס "${courseName}" הועלה בהצלחה ל-https://bdnhost.net/Resources/${courseName}/`,
      uploadedFiles: [`${courseName}.zip`]
    };
  } catch (error: any) {
    console.error('[Upload] Error:', error);
    return {
      success: false,
      message: 'העלאה נכשלה',
      error: error.message || 'שגיאה לא ידועה'
    };
  }
}

/**
 * Upload ZIP file using cPanel UAPI - Fileman::upload_files
 */
async function uploadZipFile(
  zipBlob: Blob,
  courseName: string,
  config: UploadConfig
): Promise<UploadResult> {
  try {
    const formData = new FormData();
    formData.append('file-0', zipBlob, `${courseName}.zip`);
    formData.append('dir', `/${config.targetPath}`);
    formData.append('overwrite', '1'); // Overwrite if exists

    const auth = btoa(`${config.cpanelUsername}:${config.cpanelApiToken}`);

    const response = await fetch(
      `https://${config.cpanelHost}:2083/execute/Fileman/upload_files`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0]);
    }

    console.log('[Upload] ZIP file uploaded successfully');
    return { success: true, message: 'ZIP uploaded' };
  } catch (error: any) {
    return {
      success: false,
      message: 'העלאת הקובץ נכשלה',
      error: error.message
    };
  }
}

/**
 * Extract ZIP file on server using cPanel UAPI - Fileman::extract_files
 */
async function extractZipOnServer(
  courseName: string,
  config: UploadConfig
): Promise<UploadResult> {
  try {
    const auth = btoa(`${config.cpanelUsername}:${config.cpanelApiToken}`);

    const params = new URLSearchParams({
      'file': `/${config.targetPath}/${courseName}.zip`,
      'dir': `/${config.targetPath}/${courseName}`,
      'overwrite': '1'
    });

    const response = await fetch(
      `https://${config.cpanelHost}:2083/execute/Fileman/extract_files?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Extract failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0]);
    }

    console.log('[Upload] ZIP file extracted successfully');
    return { success: true, message: 'ZIP extracted' };
  } catch (error: any) {
    return {
      success: false,
      message: 'חילוץ הקבצים נכשל',
      error: error.message
    };
  }
}

/**
 * Delete ZIP file after extraction using cPanel UAPI - Fileman::delete_files
 */
async function deleteZipFile(
  courseName: string,
  config: UploadConfig
): Promise<UploadResult> {
  try {
    const auth = btoa(`${config.cpanelUsername}:${config.cpanelApiToken}`);

    const params = new URLSearchParams({
      'file': `/${config.targetPath}/${courseName}.zip`,
    });

    const response = await fetch(
      `https://${config.cpanelHost}:2083/execute/Fileman/delete_files?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      console.warn('[Upload] Could not delete ZIP, but extraction succeeded');
      return { success: true, message: 'Cleanup skipped' };
    }

    console.log('[Upload] ZIP file deleted (cleanup)');
    return { success: true, message: 'ZIP deleted' };
  } catch (error: any) {
    // Non-critical error
    console.warn('[Upload] Cleanup failed, but upload succeeded:', error);
    return { success: true, message: 'Cleanup failed but upload OK' };
  }
}

/**
 * Test cPanel connection
 */
export async function testCPanelConnection(config: UploadConfig): Promise<UploadResult> {
  try {
    const auth = btoa(`${config.cpanelUsername}:${config.cpanelApiToken}`);

    const response = await fetch(
      `https://${config.cpanelHost}:2083/execute/Fileman/list_files?dir=/${config.targetPath}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Connection test failed: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0]);
    }

    return {
      success: true,
      message: 'חיבור ל-cPanel הצליח! ✅'
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'חיבור ל-cPanel נכשל',
      error: error.message
    };
  }
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
    return null;
  }

  return {
    cpanelHost: host,
    cpanelUsername: username,
    cpanelApiToken: token,
    targetPath: path
  };
}
