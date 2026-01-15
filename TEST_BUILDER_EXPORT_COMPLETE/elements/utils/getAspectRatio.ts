/**
 * Utility functions for detecting and calculating video aspect ratios
 */

export interface VideoDimensions {
  width: number;
  height: number;
}

/**
 * Calculate aspect ratio string from dimensions (e.g., "16/9", "4/3")
 */
export function calculateAspectRatio(width: number, height: number): string {
  if (!width || !height) return '16/9'; // Default to 16:9

  // Find greatest common divisor to simplify ratio
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(width, height);
  const simplifiedWidth = width / divisor;
  const simplifiedHeight = height / divisor;

  // Return simplified ratio
  return `${simplifiedWidth}/${simplifiedHeight}`;
}

/**
 * Detect aspect ratio from video element
 */
export function detectVideoAspectRatio(video: HTMLVideoElement): string | null {
  if (!video.videoWidth || !video.videoHeight) return null;
  return calculateAspectRatio(video.videoWidth, video.videoHeight);
}

/**
 * Detect aspect ratio from video URL (for YouTube, Vimeo, etc.)
 * Returns common aspect ratios based on platform
 */
export function detectAspectRatioFromUrl(url: string, source: 'youtube' | 'vimeo' | 'loom' | 'upload' | 'custom'): string {
  // Most YouTube/Vimeo videos are 16:9
  if (source === 'youtube' || source === 'vimeo' || source === 'loom') {
    return '16/9';
  }

  // For uploaded videos, we'll need to detect from the actual video
  // This will be handled by the video element's loadedmetadata event
  return '16/9'; // Default fallback
}

/**
 * Parse aspect ratio string to CSS aspect-ratio value
 * Handles formats: "16:9", "16/9", "16 9", "auto"
 */
export function parseAspectRatio(ratio: string): string {
  if (!ratio || ratio === 'auto') return '16/9'; // Default

  // Normalize separators (handle :, /, or space)
  const normalized = ratio.replace(/[: ]/g, '/');
  
  // Validate format (should be "width/height")
  const parts = normalized.split('/');
  if (parts.length !== 2) return '16/9';

  const width = parseFloat(parts[0]);
  const height = parseFloat(parts[1]);

  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    return '16/9'; // Invalid, return default
  }

  return `${width}/${height}`;
}

/**
 * Get padding-bottom percentage for aspect ratio (for older browser support)
 */
export function getAspectRatioPadding(ratio: string): string {
  const parsed = parseAspectRatio(ratio);
  const [width, height] = parsed.split('/').map(Number);
  
  if (!width || !height) return '56.25%'; // Default 16:9

  return `${(height / width) * 100}%`;
}

/**
 * Common aspect ratio presets
 */
export const ASPECT_RATIO_PRESETS = {
  '16:9': '16/9',
  '4:3': '4/3',
  '1:1': '1/1',
  '9:16': '9/16',
  '21:9': '21/9',
  'auto': 'auto',
} as const;

export type AspectRatioPreset = keyof typeof ASPECT_RATIO_PRESETS;




