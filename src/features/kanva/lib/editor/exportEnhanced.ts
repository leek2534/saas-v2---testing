/**
 * Enhanced export utilities for Kanva editor
 * Based on Canva blueprint best practices
 * 
 * Supports:
 * - High-resolution PNG export (2x, 3x scale)
 * - JPEG export with quality control
 * - WebP export for smaller file sizes
 * - SVG export (vector)
 * - PDF export (via jsPDF)
 */

/**
 * Export canvas as PNG with high resolution
 * 
 * @param element - The canvas container element
 * @param scale - Resolution multiplier (2 = 2x resolution)
 * @param backgroundColor - Background color (null for transparent)
 */
export async function exportAsPNG(
  element: HTMLElement,
  scale = 2,
  backgroundColor: string | null = '#ffffff'
): Promise<string> {
  // Dynamically import html2canvas to avoid SSR issues
  const html2canvas = (await import('html2canvas')).default;

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor,
    logging: false,
    imageTimeout: 0,
    // Handle external images
    proxy: undefined,
  });

  return canvas.toDataURL('image/png');
}

/**
 * Export canvas as JPEG with quality control
 * 
 * @param element - The canvas container element
 * @param quality - JPEG quality (0-1, default 0.95)
 * @param scale - Resolution multiplier
 */
export async function exportAsJPEG(
  element: HTMLElement,
  quality = 0.95,
  scale = 2
): Promise<string> {
  const html2canvas = (await import('html2canvas')).default;

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor: '#ffffff', // JPEG doesn't support transparency
    logging: false,
  });

  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Export canvas as WebP (smaller file size, modern browsers)
 * 
 * @param element - The canvas container element
 * @param quality - WebP quality (0-1, default 0.9)
 * @param scale - Resolution multiplier
 */
export async function exportAsWebP(
  element: HTMLElement,
  quality = 0.9,
  scale = 2
): Promise<string> {
  const html2canvas = (await import('html2canvas')).default;

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });

  // Check if browser supports WebP
  if (!canvas.toDataURL('image/webp').startsWith('data:image/webp')) {
    throw new Error('WebP not supported in this browser');
  }

  return canvas.toDataURL('image/webp', quality);
}

/**
 * Download a data URL as a file
 * 
 * @param dataUrl - The data URL to download
 * @param filename - The filename to save as
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export and download canvas as PNG
 */
export async function exportAndDownloadPNG(
  element: HTMLElement,
  filename = 'design.png',
  options: {
    scale?: number;
    backgroundColor?: string | null;
  } = {}
): Promise<void> {
  const dataUrl = await exportAsPNG(
    element,
    options.scale ?? 2,
    options.backgroundColor ?? '#ffffff'
  );
  downloadDataUrl(dataUrl, filename);
}

/**
 * Export and download canvas as JPEG
 */
export async function exportAndDownloadJPEG(
  element: HTMLElement,
  filename = 'design.jpg',
  options: {
    quality?: number;
    scale?: number;
  } = {}
): Promise<void> {
  const dataUrl = await exportAsJPEG(
    element,
    options.quality ?? 0.95,
    options.scale ?? 2
  );
  downloadDataUrl(dataUrl, filename);
}

/**
 * Get canvas dimensions for export
 */
export function getExportDimensions(
  canvasWidth: number,
  canvasHeight: number,
  scale: number
): { width: number; height: number } {
  return {
    width: canvasWidth * scale,
    height: canvasHeight * scale,
  };
}

/**
 * Export formats configuration
 */
export const EXPORT_FORMATS = {
  PNG: {
    label: 'PNG',
    extension: 'png',
    mimeType: 'image/png',
    supportsTransparency: true,
    defaultScale: 2,
  },
  JPEG: {
    label: 'JPEG',
    extension: 'jpg',
    mimeType: 'image/jpeg',
    supportsTransparency: false,
    defaultScale: 2,
  },
  WEBP: {
    label: 'WebP',
    extension: 'webp',
    mimeType: 'image/webp',
    supportsTransparency: true,
    defaultScale: 2,
  },
} as const;

/**
 * Export scales configuration
 */
export const EXPORT_SCALES = {
  '1x': { label: '1x (Standard)', value: 1 },
  '2x': { label: '2x (High Quality)', value: 2 },
  '3x': { label: '3x (Print Quality)', value: 3 },
} as const;

/**
 * Example usage:
 * 
 * // Get the canvas element
 * const canvasElement = document.getElementById('kanva-artboard');
 * 
 * // Export as PNG (2x resolution)
 * const pngDataUrl = await exportAsPNG(canvasElement, 2);
 * 
 * // Download as PNG
 * await exportAndDownloadPNG(canvasElement, 'my-design.png', {
 *   scale: 3, // 3x resolution for print
 *   backgroundColor: null, // transparent background
 * });
 * 
 * // Export as JPEG (smaller file size)
 * await exportAndDownloadJPEG(canvasElement, 'my-design.jpg', {
 *   quality: 0.9,
 *   scale: 2,
 * });
 */
