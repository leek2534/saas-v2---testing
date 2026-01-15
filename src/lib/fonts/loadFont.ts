/**
 * Dynamically load a Google Font
 */
export function loadGoogleFont(fontFamily: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if font is already loaded
    if (document.querySelector(`link[data-font="${fontFamily}"]`)) {
      resolve();
      return;
    }

    // System fonts don't need loading
    const systemFonts = ['Arial', 'Helvetica', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Monaco', 'Consolas'];
    if (systemFonts.includes(fontFamily)) {
      resolve();
      return;
    }

    // Create link element for Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@300;400;500;600;700;800;900&display=swap`;
    link.setAttribute('data-font', fontFamily);
    
    link.onload = () => resolve();
    link.onerror = () => {
      // Font might not exist or failed to load, but continue anyway
      console.warn(`Failed to load font: ${fontFamily}`);
      resolve(); // Resolve anyway to not block the UI
    };

    document.head.appendChild(link);
  });
}

/**
 * Preload commonly used fonts
 */
export function preloadCommonFonts() {
  const commonFonts = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Merriweather',
  ];

  commonFonts.forEach(font => {
    loadGoogleFont(font).catch(() => {
      // Silently fail for preloads
    });
  });
}



