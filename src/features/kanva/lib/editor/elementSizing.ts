/**
 * Element Sizing Utilities
 * 
 * Calculates appropriate element sizes based on canvas dimensions
 * to ensure elements are visible and usable across different canvas presets
 */

export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Calculate responsive dimensions for images while maintaining aspect ratio
 */
export function getResponsiveImageSize(
  canvas: CanvasDimensions,
  imageWidth: number,
  imageHeight: number,
  maxPercentage: number = 0.5 // Max 50% of canvas by default
): { width: number; height: number } {
  const aspectRatio = imageWidth / imageHeight;
  
  // Calculate max dimensions (percentage of canvas)
  const maxWidth = canvas.width * maxPercentage;
  const maxHeight = canvas.height * maxPercentage;
  
  let width = imageWidth;
  let height = imageHeight;
  
  // Scale down if image is too large
  if (width > maxWidth || height > maxHeight) {
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const ratio = Math.min(widthRatio, heightRatio);
    
    width = width * ratio;
    height = height * ratio;
  }
  
  // Ensure minimum size for usability
  const minSize = Math.min(canvas.width, canvas.height) * 0.15; // 15% of smaller dimension
  if (width < minSize && height < minSize) {
    if (aspectRatio > 1) {
      // Landscape
      width = minSize * aspectRatio;
      height = minSize;
    } else {
      // Portrait or square
      width = minSize;
      height = minSize / aspectRatio;
    }
  }
  
  return { width, height };
}

/**
 * Calculate responsive font size based on canvas dimensions
 * Uses Canva-style proportions for better visual hierarchy
 * 
 * Base sizes (for 1080x1080 canvas):
 * - Heading: 92px (large, bold titles)
 * - Subheading: 56px (medium headings)
 * - Body: 32px (regular text)
 * - Small: 24px (captions, labels)
 */
export function getResponsiveFontSize(
  canvas: CanvasDimensions,
  textType: 'heading' | 'subheading' | 'body' | 'small' = 'body'
): number {
  // Base canvas size (Instagram Post: 1080x1080)
  const BASE_SIZE = 1080;
  
  // Use the smaller dimension to ensure text fits
  const referenceDimension = Math.min(canvas.width, canvas.height);
  
  // Calculate scale factor (minimum 0.5x, maximum 2x)
  const scaleFactor = Math.max(0.5, Math.min(2, referenceDimension / BASE_SIZE));
  
  // Base font sizes (for 1080x1080 canvas) - matching Canva's proportions
  const baseSizes = {
    heading: 92,      // Large, bold headings
    subheading: 56,   // Medium headings
    body: 32,         // Regular body text
    small: 24,        // Small text, captions
  };
  
  // Calculate scaled size
  const calculatedSize = Math.round(baseSizes[textType] * scaleFactor);
  
  // Clamp font sizes for readability
  const minSizes = { heading: 36, subheading: 24, body: 16, small: 12 };
  const maxSizes = { heading: 184, subheading: 112, body: 64, small: 48 };
  
  return Math.max(
    minSizes[textType],
    Math.min(maxSizes[textType], calculatedSize)
  );
}

/**
 * Calculate responsive shape size
 */
export function getResponsiveShapeSize(
  canvas: CanvasDimensions,
  shapeType: 'small' | 'medium' | 'large' = 'medium'
): number {
  const referenceDimension = Math.min(canvas.width, canvas.height);
  
  const sizeMap = {
    small: 0.12,   // 12% of reference dimension
    medium: 0.18,  // 18% of reference dimension
    large: 0.30,   // 30% of reference dimension
  };
  
  const calculatedSize = referenceDimension * sizeMap[shapeType];
  
  // Clamp sizes
  const minSizes = { small: 50, medium: 100, large: 180 };
  const maxSizes = { small: 180, medium: 400, large: 700 };
  
  return Math.max(
    minSizes[shapeType],
    Math.min(maxSizes[shapeType], calculatedSize)
  );
}

/**
 * Calculate responsive icon size
 */
export function getResponsiveIconSize(
  canvas: CanvasDimensions
): number {
  const referenceDimension = Math.min(canvas.width, canvas.height);
  
  // Icons should be 10-12% of canvas
  const calculatedSize = referenceDimension * 0.11;
  
  // Clamp between 80px and 280px
  return Math.max(80, Math.min(280, calculatedSize));
}

/**
 * Calculate responsive video size (maintains 16:9 aspect ratio)
 */
export function getResponsiveVideoSize(
  canvas: CanvasDimensions,
  maxPercentage: number = 0.65 // Max 65% of canvas
): { width: number; height: number } {
  const aspectRatio = 16 / 9;
  
  const maxWidth = canvas.width * maxPercentage;
  const maxHeight = canvas.height * maxPercentage;
  
  let width = maxWidth;
  let height = width / aspectRatio;
  
  // If height exceeds max, scale by height instead
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  // Ensure minimum size
  const minWidth = Math.min(canvas.width, canvas.height) * 0.35;
  if (width < minWidth) {
    width = minWidth;
    height = width / aspectRatio;
  }
  
  return { width, height };
}

/**
 * Get center position for element on canvas
 */
export function getCenterPosition(
  canvas: CanvasDimensions,
  elementWidth: number,
  elementHeight: number
): { x: number; y: number } {
  return {
    x: Math.max(0, (canvas.width - elementWidth) / 2),
    y: Math.max(0, (canvas.height - elementHeight) / 2),
  };
}

/**
 * Calculate responsive text element dimensions
 */
export function getResponsiveTextSize(
  canvas: CanvasDimensions,
  textType: 'heading' | 'subheading' | 'body' | 'small' = 'body'
): { width: number; height: number } {
  // Text boxes should be proportional to canvas
  const widthPercentages = {
    heading: 0.7,     // 70% of canvas width for headings
    subheading: 0.6,  // 60% for subheadings
    body: 0.5,        // 50% for body text
    small: 0.4,       // 40% for small text
  };
  
  const width = canvas.width * widthPercentages[textType];
  
  // Height based on font size with some padding
  const fontSize = getResponsiveFontSize(canvas, textType);
  const lineHeight = textType === 'heading' ? 1.2 : 1.4; // Tighter line height for headings
  const height = fontSize * lineHeight * 1.5; // Allow for some padding
  
  return {
    width: Math.max(150, Math.min(width, canvas.width * 0.85)),
    height: Math.max(fontSize * 1.2, Math.min(height, canvas.height * 0.25))
  };
}
