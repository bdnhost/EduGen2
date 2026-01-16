/**
 * EduGen2 Proxy Server
 * Handles cPanel API requests to avoid CORS issues in browser
 */

import express from 'express';
import cors from 'cors';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const PORT = process.env.PROXY_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support large ZIP files

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'EduGen2 Proxy Server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Test cPanel connection
 */
app.post('/api/test-cpanel', async (req, res) => {
  try {
    const { cpanelHost, cpanelUsername, cpanelApiToken, targetPath } = req.body;

    if (!cpanelHost || !cpanelUsername || !cpanelApiToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing required cPanel credentials'
      });
    }

    const auth = Buffer.from(`${cpanelUsername}:${cpanelApiToken}`).toString('base64');
    const url = `https://${cpanelHost}:2083/execute/Fileman/list_files?dir=/${targetPath || 'public_html/Resources'}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

    if (!response.ok) {
      throw new Error(`cPanel API returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0]);
    }

    res.json({
      success: true,
      message: 'חיבור ל-cPanel הצליח! ✅',
      filesCount: result.data ? result.data.length : 0
    });
  } catch (error) {
    console.error('Test connection error:', error);
    res.json({
      success: false,
      message: 'חיבור ל-cPanel נכשל',
      error: error.message
    });
  }
});

/**
 * Upload ZIP to cPanel
 */
app.post('/api/upload-zip', async (req, res) => {
  try {
    const { zipBase64, courseName, cpanelHost, cpanelUsername, cpanelApiToken, targetPath } = req.body;

    if (!zipBase64 || !courseName || !cpanelHost || !cpanelUsername || !cpanelApiToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    console.log(`[Upload] Starting upload of ${courseName}...`);

    // Convert base64 to buffer
    const zipBuffer = Buffer.from(zipBase64, 'base64');

    // Create form data
    const formData = new FormData();
    formData.append('file-0', zipBuffer, {
      filename: `${courseName}.zip`,
      contentType: 'application/zip'
    });
    formData.append('dir', `/${targetPath}`);
    formData.append('overwrite', '1');

    const auth = Buffer.from(`${cpanelUsername}:${cpanelApiToken}`).toString('base64');
    const uploadUrl = `https://${cpanelHost}:2083/execute/Fileman/upload_files`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0]);
    }

    console.log(`[Upload] ✅ ZIP uploaded successfully`);

    res.json({
      success: true,
      message: 'ZIP uploaded successfully'
    });
  } catch (error) {
    console.error('[Upload] Error:', error);
    res.json({
      success: false,
      message: 'העלאת הקובץ נכשלה',
      error: error.message
    });
  }
});

/**
 * Extract ZIP on server
 */
app.post('/api/extract-zip', async (req, res) => {
  try {
    const { courseName, cpanelHost, cpanelUsername, cpanelApiToken, targetPath } = req.body;

    if (!courseName || !cpanelHost || !cpanelUsername || !cpanelApiToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    console.log(`[Extract] Extracting ${courseName}.zip...`);

    const auth = Buffer.from(`${cpanelUsername}:${cpanelApiToken}`).toString('base64');
    const params = new URLSearchParams({
      'file': `/${targetPath}/${courseName}.zip`,
      'dir': `/${targetPath}/${courseName}`,
      'overwrite': '1'
    });

    const extractUrl = `https://${cpanelHost}:2083/execute/Fileman/extract_files?${params.toString()}`;

    const response = await fetch(extractUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Extract failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0]);
    }

    console.log(`[Extract] ✅ ZIP extracted successfully`);

    res.json({
      success: true,
      message: 'ZIP extracted successfully'
    });
  } catch (error) {
    console.error('[Extract] Error:', error);
    res.json({
      success: false,
      message: 'חילוץ הקבצים נכשל',
      error: error.message
    });
  }
});

/**
 * Delete ZIP file after extraction
 */
app.post('/api/delete-zip', async (req, res) => {
  try {
    const { courseName, cpanelHost, cpanelUsername, cpanelApiToken, targetPath } = req.body;

    if (!courseName || !cpanelHost || !cpanelUsername || !cpanelApiToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    console.log(`[Delete] Cleaning up ${courseName}.zip...`);

    const auth = Buffer.from(`${cpanelUsername}:${cpanelApiToken}`).toString('base64');
    const params = new URLSearchParams({
      'file': `/${targetPath}/${courseName}.zip`
    });

    const deleteUrl = `https://${cpanelHost}:2083/execute/Fileman/delete_files?${params.toString()}`;

    const response = await fetch(deleteUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

    if (!response.ok) {
      console.warn('[Delete] Could not delete ZIP, but extraction succeeded');
      return res.json({
        success: true,
        message: 'Cleanup skipped (non-critical)'
      });
    }

    console.log(`[Delete] ✅ ZIP deleted (cleanup))`);

    res.json({
      success: true,
      message: 'ZIP deleted successfully'
    });
  } catch (error) {
    console.warn('[Delete] Cleanup failed, but upload succeeded:', error);
    res.json({
      success: true,
      message: 'Cleanup failed but upload OK'
    });
  }
});

/**
 * Complete upload workflow (upload → extract → cleanup)
 */
app.post('/api/upload-course', async (req, res) => {
  try {
    const { zipBase64, courseName, config } = req.body;

    if (!zipBase64 || !courseName || !config) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    console.log(`[Workflow] Starting complete upload for ${courseName}...`);

    // Step 1: Upload ZIP
    const uploadResult = await executeUpload(zipBase64, courseName, config);
    if (!uploadResult.success) {
      return res.json(uploadResult);
    }

    // Step 2: Extract ZIP
    const extractResult = await executeExtract(courseName, config);
    if (!extractResult.success) {
      return res.json(extractResult);
    }

    // Step 3: Delete ZIP (non-critical)
    await executeDelete(courseName, config);

    console.log(`[Workflow] ✅ Complete! Course available at: https://bdnhost.net/Resources/${courseName}/`);

    res.json({
      success: true,
      message: `קורס "${courseName}" הועלה בהצלחה ל-https://bdnhost.net/Resources/${courseName}/`,
      url: `https://bdnhost.net/Resources/${courseName}/`
    });
  } catch (error) {
    console.error('[Workflow] Error:', error);
    res.json({
      success: false,
      message: 'העלאה נכשלה',
      error: error.message
    });
  }
});

// Helper functions for workflow
async function executeUpload(zipBase64, courseName, config) {
  const zipBuffer = Buffer.from(zipBase64, 'base64');
  const formData = new FormData();
  formData.append('file-0', zipBuffer, {
    filename: `${courseName}.zip`,
    contentType: 'application/zip'
  });
  formData.append('dir', `/${config.targetPath}`);
  formData.append('overwrite', '1');

  const auth = Buffer.from(`${config.cpanelUsername}:${config.cpanelApiToken}`).toString('base64');
  const response = await fetch(`https://${config.cpanelHost}:2083/execute/Fileman/upload_files`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      ...formData.getHeaders()
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  const result = await response.json();
  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0]);
  }

  return { success: true };
}

async function executeExtract(courseName, config) {
  const auth = Buffer.from(`${config.cpanelUsername}:${config.cpanelApiToken}`).toString('base64');
  const params = new URLSearchParams({
    'file': `/${config.targetPath}/${courseName}.zip`,
    'dir': `/${config.targetPath}/${courseName}`,
    'overwrite': '1'
  });

  const response = await fetch(`https://${config.cpanelHost}:2083/execute/Fileman/extract_files?${params.toString()}`, {
    method: 'GET',
    headers: { 'Authorization': `Basic ${auth}` }
  });

  if (!response.ok) {
    throw new Error(`Extract failed: ${response.status}`);
  }

  const result = await response.json();
  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0]);
  }

  return { success: true };
}

async function executeDelete(courseName, config) {
  try {
    const auth = Buffer.from(`${config.cpanelUsername}:${config.cpanelApiToken}`).toString('base64');
    const params = new URLSearchParams({
      'file': `/${config.targetPath}/${courseName}.zip`
    });

    await fetch(`https://${config.cpanelHost}:2083/execute/Fileman/delete_files?${params.toString()}`, {
      method: 'GET',
      headers: { 'Authorization': `Basic ${auth}` }
    });
  } catch (error) {
    console.warn('[Delete] Non-critical cleanup error:', error);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 EduGen2 Proxy Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Ready to proxy cPanel uploads!\n`);
});
