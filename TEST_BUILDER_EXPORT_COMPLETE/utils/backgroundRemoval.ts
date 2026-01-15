"use client";

/**
 * Background Removal Utility
 * 
 * Handles automatic background removal for images using @imgly/background-removal
 * Supports all image formats including SVG (auto-converts to PNG)
 */

/**
 * Convert SVG to PNG using HTML Canvas
 * Required because the AI model only works with raster images
 */
async function convertSvgToPng(imageSrc: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 800;
      canvas.height = img.height || 600;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert SVG to PNG'));
        }
      }, 'image/png');
    };
    
    img.onerror = () => reject(new Error('Failed to load image for conversion'));
    img.src = imageSrc;
  });
}

/**
 * Check if an image source is SVG format
 */
function isSvgImage(imageSrc: string): boolean {
  return imageSrc.includes('data:image/svg+xml') || imageSrc.includes('.svg');
}

/**
 * Convert a Blob to a data URL
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Remove background from an image
 * 
 * @param imageSrc - Data URL or URL of the image
 * @returns Promise<string> - Data URL of the processed image with transparent background
 * 
 * @example
 * const processedImage = await removeImageBackground(imageDataUrl);
 * setImageSrc(processedImage);
 */
export async function removeImageBackground(imageSrc: string): Promise<string> {
  try {
    console.log('[BG Removal] Starting background removal...');
    console.log('[BG Removal] Image type:', imageSrc.substring(0, 50));
    
    let blob: Blob;
    
    // Check if image is SVG and convert to PNG first
    if (isSvgImage(imageSrc)) {
      console.log('[BG Removal] SVG detected, converting to PNG...');
      blob = await convertSvgToPng(imageSrc);
      console.log('[BG Removal] Converted to PNG:', blob.size, 'bytes');
    } else {
      // For other formats, fetch and check blob type
      const response = await fetch(imageSrc);
      const originalBlob = await response.blob();
      console.log('[BG Removal] Original blob type:', originalBlob.type);
      
      // Double-check for SVG in blob type
      if (originalBlob.type === 'image/svg+xml' || originalBlob.type.includes('svg')) {
        console.log('[BG Removal] SVG detected in blob, converting to PNG...');
        blob = await convertSvgToPng(imageSrc);
        console.log('[BG Removal] Converted to PNG:', blob.size, 'bytes');
      } else {
        blob = originalBlob;
        console.log('[BG Removal] Using original blob:', blob.size, 'bytes');
      }
    }
    
    // Dynamically import the library (code splitting)
    console.log('[BG Removal] Loading AI model...');
    const bgRemoval = await import('@imgly/background-removal');
    console.log('[BG Removal] AI model loaded successfully');
    
    // Remove background (runs in browser with WebAssembly)
    console.log('[BG Removal] Processing image with AI...');
    const resultBlob = await bgRemoval.removeBackground(blob);
    console.log('[BG Removal] Background removed successfully:', resultBlob.size, 'bytes');
    
    // Convert result to data URL
    console.log('[BG Removal] Converting to data URL...');
    const dataUrl = await blobToDataUrl(resultBlob);
    console.log('[BG Removal] Complete!');
    
    return dataUrl;
  } catch (error) {
    console.error('[BG Removal] Failed:', error);
    throw error;
  }
}

/**
 * Check if background removal is supported for an image type
 * Currently supports all image types (SVG is auto-converted)
 */
export function isBackgroundRemovalSupported(imageSrc: string): boolean {
  // Support all image types
  return imageSrc.startsWith('data:image/') || imageSrc.startsWith('http');
}
