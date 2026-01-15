/**
 * Responsive Element Sizing Utility
 * Calculates appropriate sizes for all element types based on canvas dimensions
 */

export interface ResponsiveFontSizes {
  heading: number;
  subheading: number;
  body: number;
  small: number;
}

export interface ResponsiveElementSizes {
  // Shape sizes
  shapeSmall: number;
  shapeMedium: number;
  shapeLarge: number;
  // Image sizes
  imageSmall: number;
  imageMedium: number;
  imageLarge: number;
  // Icon sizes
  iconSmall: number;
  iconMedium: number;
  iconLarge: number;
}

/**
 * Calculate responsive font sizes based on canvas dimensions
 * Uses a scaling factor relative to a base canvas size (1080x1080)
 * Font sizes match Canva's defaults for better visual hierarchy
 */
export function getResponsiveFontSizes(canvasWidth: number, canvasHeight: number): ResponsiveFontSizes {
  // Base canvas size (Instagram Post: 1080x1080)
  const BASE_SIZE = 1080;
  
  // Use the smaller dimension to ensure text fits
  const referenceDimension = Math.min(canvasWidth, canvasHeight);
  
  // Calculate scale factor (minimum 0.5x, maximum 2x)
  const scaleFactor = Math.max(0.5, Math.min(2, referenceDimension / BASE_SIZE));
  
  // Base font sizes (for 1080x1080 canvas) - matching Canva's proportions
  const BASE_HEADING = 92;      // Large, bold headings like Canva
  const BASE_SUBHEADING = 56;   // Medium headings
  const BASE_BODY = 32;         // Regular body text
  const BASE_SMALL = 24;        // Small text
  
  return {
    heading: Math.round(BASE_HEADING * scaleFactor),
    subheading: Math.round(BASE_SUBHEADING * scaleFactor),
    body: Math.round(BASE_BODY * scaleFactor),
    small: Math.round(BASE_SMALL * scaleFactor),
  };
}

/**
 * Get recommended default font size for new text elements
 */
export function getDefaultTextSize(canvasWidth: number, canvasHeight: number): number {
  const sizes = getResponsiveFontSizes(canvasWidth, canvasHeight);
  return sizes.body;
}

/**
 * Calculate responsive element sizes (shapes, images, icons)
 * Based on canvas dimensions
 */
export function getResponsiveElementSizes(canvasWidth: number, canvasHeight: number): ResponsiveElementSizes {
  const BASE_SIZE = 1080;
  const referenceDimension = Math.min(canvasWidth, canvasHeight);
  const scaleFactor = Math.max(0.5, Math.min(2, referenceDimension / BASE_SIZE));
  
  // Base sizes for 1080x1080 canvas
  return {
    // Shapes (squares, circles, etc.)
    shapeSmall: Math.round(80 * scaleFactor),      // 80px
    shapeMedium: Math.round(150 * scaleFactor),    // 150px
    shapeLarge: Math.round(250 * scaleFactor),     // 250px
    
    // Images
    imageSmall: Math.round(200 * scaleFactor),     // 200px
    imageMedium: Math.round(350 * scaleFactor),    // 350px
    imageLarge: Math.round(500 * scaleFactor),     // 500px
    
    // Icons
    iconSmall: Math.round(48 * scaleFactor),       // 48px
    iconMedium: Math.round(80 * scaleFactor),      // 80px
    iconLarge: Math.round(120 * scaleFactor),      // 120px
  };
}

/**
 * Get default size for shapes
 */
export function getDefaultShapeSize(canvasWidth: number, canvasHeight: number): number {
  const sizes = getResponsiveElementSizes(canvasWidth, canvasHeight);
  return sizes.shapeMedium;
}

/**
 * Get default size for images
 */
export function getDefaultImageSize(canvasWidth: number, canvasHeight: number): number {
  const sizes = getResponsiveElementSizes(canvasWidth, canvasHeight);
  return sizes.imageMedium;
}

/**
 * Get default size for icons
 */
export function getDefaultIconSize(canvasWidth: number, canvasHeight: number): number {
  const sizes = getResponsiveElementSizes(canvasWidth, canvasHeight);
  return sizes.iconMedium;
}

/**
 * Scale existing font size when canvas size changes
 */
export function scaleFontSize(
  currentSize: number,
  oldCanvasWidth: number,
  oldCanvasHeight: number,
  newCanvasWidth: number,
  newCanvasHeight: number
): number {
  const oldDimension = Math.min(oldCanvasWidth, oldCanvasHeight);
  const newDimension = Math.min(newCanvasWidth, newCanvasHeight);
  
  const scaleFactor = newDimension / oldDimension;
  
  return Math.round(currentSize * scaleFactor);
}
