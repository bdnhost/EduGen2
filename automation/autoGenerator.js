/**
 * EduGen2 Auto Course Generator
 * Automatically generates courses from queue.json
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUEUE_FILE = path.join(__dirname, 'queue.json');
const PROGRESS_FILE = path.join(__dirname, 'progress.json');
const CONFIG_FILE = path.join(__dirname, 'config.json');

/**
 * Load JSON file
 */
async function loadJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error loading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Save JSON file
 */
async function saveJSON(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`❌ Error saving ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Get next pending course from queue
 */
function getNextCourse(queue) {
  const pendingCourses = queue.courses
    .filter(c => c.status === 'pending')
    .sort((a, b) => a.priority - b.priority);

  return pendingCourses.length > 0 ? pendingCourses[0] : null;
}

/**
 * Update course status in queue
 */
function updateCourseStatus(queue, courseId, status, additionalData = {}) {
  const course = queue.courses.find(c => c.id === courseId);
  if (course) {
    course.status = status;
    Object.assign(course, additionalData);
  }

  // Update metadata
  queue.metadata.pending = queue.courses.filter(c => c.status === 'pending').length;
  queue.metadata.inProgress = queue.courses.filter(c => c.status === 'in-progress').length;
  queue.metadata.completed = queue.courses.filter(c => c.status === 'completed').length;
  queue.metadata.failed = queue.courses.filter(c => c.status === 'failed').length;
  queue.metadata.lastUpdated = new Date().toISOString();

  return queue;
}

/**
 * Add entry to progress log
 */
function addToProgress(progress, entry) {
  progress.history.push(entry);
  progress.stats.totalGenerated++;

  const today = new Date().toISOString().split('T')[0];
  if (progress.stats.currentDate !== today) {
    progress.stats.currentDate = today;
    progress.stats.coursesGeneratedToday = 0;
  }

  progress.stats.coursesGeneratedToday++;
  progress.stats.lastRunDate = new Date().toISOString();

  if (entry.uploaded) {
    progress.stats.totalUploaded++;
  }

  if (entry.error) {
    progress.stats.totalFailed++;
  }

  return progress;
}

/**
 * Check if daily limit reached
 */
function isDailyLimitReached(progress, config) {
  const today = new Date().toISOString().split('T')[0];

  if (progress.stats.currentDate !== today) {
    return false; // New day, reset counter
  }

  return progress.stats.coursesGeneratedToday >= config.limits.maxCoursesPerDay;
}

/**
 * Generate course using AI (placeholder - will be integrated with actual AI service)
 */
async function generateCourse(topic) {
  console.log(`📚 Generating course: "${topic}"...`);

  // TODO: Integrate with actual aiService.ts
  // For now, this is a placeholder that simulates course generation

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        courseName: topic,
        lessonCount: 3,
        zipBlob: null, // Would contain actual ZIP in production
        message: 'Course generated successfully (simulated)'
      });
    }, 2000);
  });
}

/**
 * Upload course to server (placeholder - will be integrated with uploadService)
 */
async function uploadCourse(courseData) {
  console.log(`📤 Uploading course: "${courseData.courseName}"...`);

  // TODO: Integrate with actual uploadService.ts
  // For now, this is a placeholder

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        url: `https://bdnhost.net/Resources/${courseData.courseName}/`,
        message: 'Course uploaded successfully (simulated)'
      });
    }, 1000);
  });
}

/**
 * Main generation function
 */
async function generateNextCourse() {
  console.log('\n🤖 === EduGen2 Auto Generator ===\n');

  // Load configuration files
  const config = await loadJSON(CONFIG_FILE);
  const queue = await loadJSON(QUEUE_FILE);
  const progress = await loadJSON(PROGRESS_FILE);

  if (!config || !queue || !progress) {
    console.error('❌ Failed to load configuration files');
    return { success: false, error: 'Configuration error' };
  }

  // Check if scheduler is enabled
  if (!config.schedule.enabled) {
    console.log('⚠️  Auto generation is disabled in config.json');
    return { success: false, error: 'Scheduler disabled' };
  }

  // Check daily limit
  if (isDailyLimitReached(progress, config)) {
    console.log(`⚠️  Daily limit reached (${config.limits.maxCoursesPerDay} courses)`);
    return { success: false, error: 'Daily limit reached' };
  }

  // Get next course from queue
  const nextCourse = getNextCourse(queue);

  if (!nextCourse) {
    console.log('✅ Queue is empty - no more courses to generate');
    return { success: true, message: 'Queue empty' };
  }

  console.log(`📋 Next course: "${nextCourse.topic}" (Priority: ${nextCourse.priority})`);

  // Update status to in-progress
  updateCourseStatus(queue, nextCourse.id, 'in-progress', {
    createdAt: new Date().toISOString()
  });
  await saveJSON(QUEUE_FILE, queue);

  try {
    // Generate course
    const courseResult = await generateCourse(nextCourse.topic);

    if (!courseResult.success) {
      throw new Error(courseResult.error || 'Course generation failed');
    }

    console.log('✅ Course generated successfully');

    // Upload if enabled
    let uploadResult = null;
    if (config.autoUpload.enabled) {
      uploadResult = await uploadCourse(courseResult);

      if (uploadResult.success) {
        console.log(`✅ Course uploaded to: ${uploadResult.url}`);
      } else {
        console.warn('⚠️  Upload failed, but course was generated');
      }
    }

    // Update queue status to completed
    updateCourseStatus(queue, nextCourse.id, 'completed', {
      uploadedAt: uploadResult?.success ? new Date().toISOString() : null,
      url: uploadResult?.url || null
    });
    await saveJSON(QUEUE_FILE, queue);

    // Add to progress log
    const progressEntry = {
      id: nextCourse.id,
      topic: nextCourse.topic,
      timestamp: new Date().toISOString(),
      lessonCount: courseResult.lessonCount,
      uploaded: uploadResult?.success || false,
      url: uploadResult?.url || null,
      error: null
    };

    addToProgress(progress, progressEntry);
    await saveJSON(PROGRESS_FILE, progress);

    console.log('\n✅ === Generation Complete ===\n');

    return {
      success: true,
      course: nextCourse,
      uploaded: uploadResult?.success || false,
      url: uploadResult?.url
    };

  } catch (error) {
    console.error(`❌ Error generating course:`, error.message);

    // Update queue status to failed
    updateCourseStatus(queue, nextCourse.id, 'failed', {
      error: error.message
    });
    await saveJSON(QUEUE_FILE, queue);

    // Add to progress log
    const progressEntry = {
      id: nextCourse.id,
      topic: nextCourse.topic,
      timestamp: new Date().toISOString(),
      lessonCount: 0,
      uploaded: false,
      url: null,
      error: error.message
    };

    addToProgress(progress, progressEntry);
    await saveJSON(PROGRESS_FILE, progress);

    return {
      success: false,
      course: nextCourse,
      error: error.message
    };
  }
}

/**
 * Get status report
 */
async function getStatus() {
  const queue = await loadJSON(QUEUE_FILE);
  const progress = await loadJSON(PROGRESS_FILE);

  if (!queue || !progress) {
    return null;
  }

  return {
    queue: queue.metadata,
    progress: progress.stats,
    recentHistory: progress.history.slice(-5).reverse()
  };
}

// Export functions for use in scheduler
export { generateNextCourse, getStatus };

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];

  if (command === 'generate') {
    generateNextCourse().then(result => {
      process.exit(result.success ? 0 : 1);
    });
  } else if (command === 'status') {
    getStatus().then(status => {
      console.log(JSON.stringify(status, null, 2));
      process.exit(0);
    });
  } else {
    console.log('Usage:');
    console.log('  node autoGenerator.js generate  - Generate next course from queue');
    console.log('  node autoGenerator.js status    - Show current status');
    process.exit(1);
  }
}
