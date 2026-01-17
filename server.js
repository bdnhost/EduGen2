/**
 * EduGen2 Proxy Server with FTP Upload
 * Uploads courses via FTP instead of cPanel API (simpler and more reliable)
 */

import express from 'express';
import cors from 'cors';
import { Client } from 'basic-ftp';
import { config } from 'dotenv';
import { Readable } from 'stream';

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
    message: 'EduGen2 Proxy Server (FTP) is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Test FTP connection
 */
app.post('/api/test-ftp', async (req, res) => {
  const client = new Client();
  client.ftp.verbose = true;

  try {
    const { ftpHost, ftpUsername, ftpPassword, targetPath } = req.body;

    if (!ftpHost || !ftpUsername || !ftpPassword) {
      return res.status(400).json({
        success: false,
        message: 'Missing required FTP credentials'
      });
    }

    console.log(`[FTP Test] Connecting to ${ftpHost}...`);

    await client.access({
      host: ftpHost,
      user: ftpUsername,
      password: ftpPassword,
      secure: false // Most cPanel FTP uses port 21 (not secure FTP)
    });

    console.log('[FTP Test] Connected successfully');

    // Try to list files in target directory
    const targetDir = `/${targetPath}`;
    await client.ensureDir(targetDir);
    const files = await client.list(targetDir);

    console.log(`[FTP Test] Found ${files.length} files in ${targetDir}`);

    res.json({
      success: true,
      message: `חיבור FTP הצליח! נמצאו ${files.length} קבצים.`,
      filesCount: files.length
    });
  } catch (error) {
    console.error('[FTP Test] Error:', error);
    res.json({
      success: false,
      message: 'חיבור FTP נכשל',
      error: error.message
    });
  } finally {
    client.close();
  }
});

/**
 * Upload course via FTP (complete workflow)
 */
app.post('/api/upload-course-ftp', async (req, res) => {
  const client = new Client();
  client.ftp.verbose = true;

  try {
    const { zipBase64, courseName, config: ftpConfig } = req.body;

    if (!zipBase64 || !courseName || !ftpConfig) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    console.log(`[FTP Upload] Starting upload of ${courseName}...`);

    // Convert base64 to buffer
    const zipBuffer = Buffer.from(zipBase64, 'base64');
    console.log(`[FTP Upload] ZIP size: ${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Connect to FTP
    console.log(`[FTP Upload] Connecting to ${ftpConfig.ftpHost}...`);
    await client.access({
      host: ftpConfig.ftpHost,
      user: ftpConfig.ftpUsername,
      password: ftpConfig.ftpPassword,
      secure: false
    });
    console.log('[FTP Upload] Connected to FTP server');

    // Ensure target directory exists
    const targetDir = `/${ftpConfig.targetPath}`;
    await client.ensureDir(targetDir);
    console.log(`[FTP Upload] Target directory ready: ${targetDir}`);

    // Upload ZIP file
    const zipFileName = `${courseName}.zip`;
    const zipPath = `${targetDir}/${zipFileName}`;

    console.log(`[FTP Upload] Uploading ${zipFileName}...`);
    const readable = Readable.from(zipBuffer);
    await client.uploadFrom(readable, zipPath);
    console.log(`[FTP Upload] ✅ ZIP uploaded successfully to ${zipPath}`);

    // Create extraction directory
    const extractDir = `${targetDir}/${courseName}`;
    await client.ensureDir(extractDir);
    console.log(`[FTP Upload] Created directory: ${extractDir}`);

    // Note: We can't extract ZIP via FTP directly
    // User will need to extract via cPanel File Manager or use shell access
    console.log('[FTP Upload] ⚠️ Manual extraction required via cPanel File Manager');

    res.json({
      success: true,
      message: `קורס "${courseName}" הועלה בהצלחה!\n\nשלבים נוספים:\n1. התחבר ל-cPanel File Manager\n2. נווט ל-${targetDir}\n3. לחיצה ימנית על ${zipFileName} → Extract\n4. הקורס יהיה זמין ב-https://bdnhost.net/Resources/${courseName}/`,
      uploadPath: zipPath,
      manualExtractionRequired: true,
      extractionInstructions: [
        `התחבר ל-cPanel: https://shlomi.online:2083`,
        `File Manager → ${targetDir}`,
        `לחיצה ימנית על ${zipFileName} → Extract`,
        `בחר תיקייה: ${extractDir}`,
        `מחק את ה-ZIP לאחר חילוץ (אופציונלי)`
      ]
    });
  } catch (error) {
    console.error('[FTP Upload] Error:', error);
    res.json({
      success: false,
      message: 'העלאת FTP נכשלה',
      error: error.message
    });
  } finally {
    client.close();
  }
});

/**
 * Legacy endpoint for backward compatibility (now uses FTP)
 */
app.post('/api/upload-course', async (req, res) => {
  // Redirect to FTP upload
  return app.handle(
    { ...req, url: '/api/upload-course-ftp', originalUrl: '/api/upload-course-ftp' },
    res
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 EduGen2 Proxy Server (FTP Mode) running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Ready to upload via FTP!\n`);
  console.log(`   ℹ️  Note: ZIP files will be uploaded but require manual extraction via cPanel`);
  console.log(`   📖 See PROXY_SETUP.md for details\n`);
});
