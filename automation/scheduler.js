/**
 * EduGen2 Scheduler
 * Runs auto course generation on a schedule
 */

import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateNextCourse, getStatus } from './autoGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILE = path.join(__dirname, 'config.json');

/**
 * Load configuration
 */
async function loadConfig() {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error loading config:', error.message);
    return null;
  }
}

/**
 * Get cron expression from config
 */
function getCronExpression(config) {
  if (config.schedule.customCron) {
    return config.schedule.customCron;
  }

  // Convert interval to cron expression
  const intervalMap = {
    'hourly': '0 * * * *',        // Every hour at minute 0
    'daily': '0 9 * * *',         // Every day at 9 AM
    'weekly': '0 9 * * 1',        // Every Monday at 9 AM
    'every-6-hours': '0 */6 * * *', // Every 6 hours
    'every-12-hours': '0 */12 * * *' // Every 12 hours
  };

  return intervalMap[config.schedule.interval] || '0 * * * *';
}

/**
 * Run generation task
 */
async function runTask() {
  const timestamp = new Date().toISOString();
  console.log(`\n⏰ [${timestamp}] Scheduler triggered`);

  const result = await generateNextCourse();

  if (result.success && result.course) {
    console.log(`✅ Successfully generated: "${result.course.topic}"`);
    if (result.uploaded) {
      console.log(`📤 Uploaded to: ${result.url}`);
    }
  } else if (result.error) {
    console.log(`⚠️  ${result.error}`);
  }

  return result;
}

/**
 * Start scheduler
 */
async function startScheduler() {
  console.log('\n🚀 === EduGen2 Scheduler Starting ===\n');

  const config = await loadConfig();

  if (!config) {
    console.error('❌ Failed to load configuration');
    process.exit(1);
  }

  if (!config.schedule.enabled) {
    console.log('⚠️  Scheduler is disabled in config.json');
    console.log('   Set schedule.enabled to true to activate');
    process.exit(0);
  }

  const cronExpression = getCronExpression(config);
  console.log(`📅 Schedule: ${config.schedule.interval}`);
  console.log(`⏱️  Cron: ${cronExpression}`);
  console.log(`📊 Daily Limit: ${config.limits.maxCoursesPerDay} courses`);
  console.log(`📤 Auto Upload: ${config.autoUpload.enabled ? 'Enabled' : 'Disabled'}\n`);

  // Show current status
  const status = await getStatus();
  if (status) {
    console.log('📋 Current Queue Status:');
    console.log(`   Pending: ${status.queue.pending}`);
    console.log(`   In Progress: ${status.queue.inProgress}`);
    console.log(`   Completed: ${status.queue.completed}`);
    console.log(`   Failed: ${status.queue.failed}`);
    console.log(`\n📈 Today's Progress: ${status.progress.coursesGeneratedToday}/${config.limits.maxCoursesPerDay}`);
    console.log('');
  }

  // Validate cron expression
  if (!cron.validate(cronExpression)) {
    console.error('❌ Invalid cron expression:', cronExpression);
    process.exit(1);
  }

  // Schedule the task
  const task = cron.schedule(cronExpression, async () => {
    await runTask();
  }, {
    timezone: 'Asia/Jerusalem' // Change to your timezone
  });

  console.log('✅ Scheduler is running');
  console.log('   Press Ctrl+C to stop\n');

  // Run immediately on start (optional)
  if (process.argv.includes('--run-now')) {
    console.log('🏃 Running initial task...');
    await runTask();
  }

  // Keep process alive
  process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping scheduler...');
    task.stop();
    process.exit(0);
  });
}

// Start if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startScheduler().catch(error => {
    console.error('❌ Scheduler error:', error);
    process.exit(1);
  });
}

export { startScheduler };
