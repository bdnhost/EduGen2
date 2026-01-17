/**
 * Media Service - Image Generation
 * Generates images using Flux 1.1 Pro via OpenRouter
 */

import OpenAI from 'openai';

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: false, // Server-side only for image generation
});

/**
 * Generate image using Flux 1.1 Pro
 * Best model for quality/price ratio as of 2025
 */
export async function generateImageFlux(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    aspectRatio?: '1:1' | '16:9' | '9:16';
  } = {}
): Promise<string | null> {
  try {
    console.log('[Flux] Generating image...');
    console.log('[Flux] Prompt:', prompt);

    // Flux 1.1 Pro via OpenRouter
    const response = await openrouter.images.generate({
      model: "black-forest-labs/flux-1.1-pro",
      prompt: prompt,
      n: 1,
      size: options.aspectRatio === '16:9' ? '1792x1024'
            : options.aspectRatio === '9:16' ? '1024x1792'
            : '1024x1024' // Default square
    });

    if (response.data && response.data.length > 0) {
      const imageUrl = response.data[0].url;
      console.log('[Flux] ✅ Image generated:', imageUrl);
      return imageUrl;
    }

    console.error('[Flux] No image data returned');
    return null;

  } catch (error: any) {
    console.error('[Flux] Error:', error.message);
    return null;
  }
}

/**
 * Generate SVG placeholder as fallback
 * Returns base64 encoded SVG
 */
export function generateSVGPlaceholder(
  lessonNumber: number,
  title: string,
  color: string = '#4f46e5'
): string {
  const svg = `
    <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="400" fill="#f3f4f6"/>
      <circle cx="400" cy="200" r="80" fill="${color}" opacity="0.1"/>
      <text x="400" y="190" font-family="Arial" font-size="64" font-weight="bold" text-anchor="middle" fill="${color}">
        ${lessonNumber}
      </text>
      <text x="400" y="240" font-family="Arial" font-size="20" text-anchor="middle" fill="#64748b" style="max-width: 600px;">
        ${title}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Download image from URL and convert to base64
 * For embedding in course package
 */
export async function downloadImageAsBase64(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');

    return `data:image/png;base64,${base64}`;

  } catch (error: any) {
    console.error('[Download] Error downloading image:', error.message);
    return null;
  }
}
