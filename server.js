/**
 * EduGen2 Proxy Server with cPanel API
 * Bypasses CORS restrictions for browser-based cPanel API calls
 */

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const PORT = process.env.PROXY_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'EduGen2 Proxy Server (cPanel API) is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Test cPanel API connection
 */
app.post('/api/test-cpanel', async (req, res) => {
  try {
    const { cpanelHost, cpanelUsername, cpanelApiToken } = req.body;

    if (!cpanelHost || !cpanelUsername || !cpanelApiToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing required cPanel credentials'
      });
    }

    console.log(`[cPanel Test] Testing connection to ${cpanelHost}...`);

    const url = `https://${cpanelHost}:2083/execute/Filemgr/list_files?dir=/`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `cpanel ${cpanelUsername}:${cpanelApiToken}`
      }
    });

    const data = await response.json();

    if (response.ok && data.status === 1) {
      console.log('[cPanel Test] ✅ Connection successful');
      res.json({
        success: true,
        message: 'חיבור cPanel הצליח!',
        filesCount: data.data?.length || 0
      });
    } else {
      console.error('[cPanel Test] ❌ Connection failed:', data);
      res.json({
        success: false,
        message: 'חיבור cPanel נכשל',
        error: data.errors?.[0] || 'Unknown error'
      });
    }
  } catch (error) {
    console.error('[cPanel Test] Error:', error);
    res.json({
      success: false,
      message: 'שגיאת חיבור',
      error: error.message
    });
  }
});

/**
 * Upload course via cPanel API (complete workflow)
 */
app.post('/api/upload-course', async (req, res) => {
  try {
    const { zipBase64, courseName, config: uploadConfig } = req.body;

    if (!zipBase64 || !courseName || !uploadConfig) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    const { cpanelHost, cpanelUsername, cpanelApiToken, cpanelTargetPath } = uploadConfig;

    console.log(`[cPanel Upload] Starting upload of ${courseName}...`);

    // Step 1: Convert base64 to buffer
    const zipBuffer = Buffer.from(zipBase64, 'base64');
    console.log(`[cPanel Upload] ZIP size: ${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Step 2: Upload ZIP file
    const zipFileName = `${courseName}.zip`;
    const targetPath = `/${cpanelTargetPath}/${zipFileName}`;

    console.log(`[cPanel Upload] Uploading to ${targetPath}...`);

    const formData = new FormData();
    formData.append('dir', `/${cpanelTargetPath}`);
    formData.append('file-0', zipBuffer, zipFileName);

    const uploadUrl = `https://${cpanelHost}:2083/execute/Filemgr/upload_files`;

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `cpanel ${cpanelUsername}:${cpanelApiToken}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok || uploadData.status !== 1) {
      throw new Error(uploadData.errors?.[0] || 'Upload failed');
    }

    console.log('[cPanel Upload] ✅ ZIP uploaded successfully');

    // Step 3: Extract ZIP file
    console.log(`[cPanel Upload] Extracting ${zipFileName}...`);

    const extractUrl = `https://${cpanelHost}:2083/execute/Filemgr/extract_files`;

    const extractParams = new URLSearchParams({
      dir: `/${cpanelTargetPath}`,
      file: zipFileName,
      overwrite: '1'
    });

    const extractResponse = await fetch(`${extractUrl}?${extractParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `cpanel ${cpanelUsername}:${cpanelApiToken}`
      }
    });

    const extractData = await extractResponse.json();

    if (!extractResponse.ok || extractData.status !== 1) {
      throw new Error(extractData.errors?.[0] || 'Extraction failed');
    }

    console.log('[cPanel Upload] ✅ ZIP extracted successfully');

    // Step 4: Delete ZIP file (cleanup)
    console.log(`[cPanel Upload] Cleaning up ${zipFileName}...`);

    const deleteUrl = `https://${cpanelHost}:2083/execute/Filemgr/trash_files`;

    const deleteParams = new URLSearchParams({
      dir: `/${cpanelTargetPath}`,
      'file-0': zipFileName
    });

    const deleteResponse = await fetch(`${deleteUrl}?${deleteParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `cpanel ${cpanelUsername}:${cpanelApiToken}`
      }
    });

    const deleteData = await deleteResponse.json();

    if (deleteResponse.ok && deleteData.status === 1) {
      console.log('[cPanel Upload] ✅ ZIP file deleted');
    } else {
      console.log('[cPanel Upload] ⚠️ Could not delete ZIP file (non-critical)');
    }

    // Success!
    const resourceUrl = `https://bdnhost.net/Resources/${courseName}/`;

    res.json({
      success: true,
      message: `קורס "${courseName}" הועלה ונחלץ בהצלחה!`,
      url: resourceUrl,
      uploadPath: targetPath,
      steps: [
        '✅ קובץ ZIP הועלה',
        '✅ קובץ ZIP נחלץ',
        '✅ קובץ ZIP נמחק',
        `🌐 הקורס זמין ב: ${resourceUrl}`
      ]
    });

  } catch (error) {
    console.error('[cPanel Upload] Error:', error);
    res.json({
      success: false,
      message: 'העלאה נכשלה',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 EduGen2 Proxy Server (cPanel API Mode) running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Ready to upload via cPanel API!\n`);
});
