import html2canvas from 'html2canvas';

/**
 * Export the artboard to PNG
 * Uses html2canvas to render the DOM to an image
 */
export async function exportToPNG(artboardElement: HTMLElement, filename: string = 'design.png') {
  try {
    const canvas = await html2canvas(artboardElement, {
      backgroundColor: null,
      scale: 2, // 2x for retina displays
      useCORS: true,
      allowTaint: true,
      logging: false,
    });

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('Failed to export:', error);
    throw error;
  }
}

/**
 * Export to JPEG
 */
export async function exportToJPEG(artboardElement: HTMLElement, filename: string = 'design.jpg', quality: number = 0.9) {
  try {
    const canvas = await html2canvas(artboardElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      
      URL.revokeObjectURL(url);
    }, 'image/jpeg', quality);
  } catch (error) {
    console.error('Failed to export:', error);
    throw error;
  }
}

/**
 * Get data URL for preview
 */
export async function getPreviewDataURL(artboardElement: HTMLElement): Promise<string> {
  const canvas = await html2canvas(artboardElement, {
    backgroundColor: null,
    scale: 1,
    useCORS: true,
    allowTaint: true,
    logging: false,
  });

  return canvas.toDataURL('image/png');
}

