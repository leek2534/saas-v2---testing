/**
 * HTML Template Parser
 * Converts ClickFunnels/HTML templates to Kanva canvas elements
 */

import type { EditorElement, CanvasConfig } from '../editor/types';
import { generateId } from '../editor/utils';

interface ParsedElement {
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  element: EditorElement;
}

/**
 * Parse HTML string and convert to Kanva elements
 */
export async function parseHTMLTemplate(
  html: string,
  canvasWidth: number = 1920,
  canvasHeight: number = 1080
): Promise<{ canvas: CanvasConfig; elements: EditorElement[] }> {
  // Create a temporary container to render HTML for measurement
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '10000px';
  tempContainer.style.height = '10000px';
  tempContainer.style.overflow = 'visible';
  document.body.appendChild(tempContainer);

  try {
    // Create a temporary iframe to parse HTML safely
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '1920px';
    iframe.style.height = '1080px';
    iframe.style.border = 'none';
    tempContainer.appendChild(iframe);

    // Wait for iframe to load
    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      iframe.srcdoc = html;
    });

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error('Could not access iframe document');
    }

    const body = iframeDoc.body;

    // Extract canvas dimensions
    const widthMatch = html.match(/width["\s:=]+(\d+)/i);
    const heightMatch = html.match(/height["\s:=]+(\d+)/i);
    
    // Try to get dimensions from common container classes/IDs
    const container = iframeDoc.querySelector('.container, #container, .wrapper, #wrapper, .page, #page') as HTMLElement;
    const containerRect = container?.getBoundingClientRect();
    
    const detectedWidth = widthMatch ? parseInt(widthMatch[1]) : (containerRect?.width || canvasWidth);
    const detectedHeight = heightMatch ? parseInt(heightMatch[1]) : (containerRect?.height || canvasHeight);

    const canvas: CanvasConfig = {
      width: detectedWidth,
      height: detectedHeight,
      background: {
        color: extractBackgroundColor(body) || '#ffffff',
      },
    };

    const elements: EditorElement[] = [];
    const zIndexCounter = { current: 0 };

    // Parse all elements recursively
    await parseElement(body, elements, { x: 0, y: 0 }, zIndexCounter, canvas, iframeDoc);

    return { canvas, elements };
  } finally {
    // Clean up temporary container
    document.body.removeChild(tempContainer);
  }
}

/**
 * Recursively parse DOM elements and convert to Kanva elements
 */
async function parseElement(
  element: Element | HTMLElement,
  elements: EditorElement[],
  parentOffset: { x: number; y: number },
  zIndexCounter: { current: number },
  canvas: CanvasConfig,
  doc: Document
): Promise<void> {
  if (!(element instanceof HTMLElement)) return;

  // Skip script, style, and other non-visual elements
  const tagName = element.tagName.toLowerCase();
  if (['script', 'style', 'meta', 'link', 'head', 'title'].includes(tagName)) {
    return;
  }

  // Get computed styles
  const styles = parseStyles(element, doc);
  
  // Skip invisible elements
  if (styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0') {
    return;
  }

  // Get bounding rect for accurate positioning
  const rect = element.getBoundingClientRect();
  
  // Calculate position relative to canvas
  const x = rect.left + parentOffset.x;
  const y = rect.top + parentOffset.y;
  const width = rect.width;
  const height = rect.height;

  // Skip elements outside canvas bounds or with zero dimensions
  if (width === 0 || height === 0) {
    // Still parse children
    const children = Array.from(element.children);
    for (const child of children) {
      await parseElement(child as HTMLElement, elements, { x, y }, zIndexCounter, canvas, doc);
    }
    return;
  }

  // Parse based on element type
  let parsedElement: EditorElement | null = null;

  if (tagName === 'img') {
    parsedElement = await parseImageElement(element as HTMLImageElement, x, y, width, height, styles, doc);
  } else if (tagName === 'button' || (tagName === 'a' && styles.display === 'inline-block')) {
    parsedElement = parseButtonElement(element, x, y, width, height, styles);
  } else if (hasTextContent(element) && !hasOnlyChildImages(element)) {
    parsedElement = parseTextElement(element, x, y, width, height, styles);
  } else if (hasBackgroundImage(styles) || hasBackgroundColor(styles)) {
    parsedElement = parseShapeElement(element, x, y, width, height, styles);
  }

  if (parsedElement) {
    parsedElement.zIndex = zIndexCounter.current++;
    parsedElement.visible = true;
    elements.push(parsedElement);
  }

  // Recursively parse children
  const children = Array.from(element.children);
  for (const child of children) {
    await parseElement(child as HTMLElement, elements, { x, y }, zIndexCounter, canvas, doc);
  }
}

/**
 * Parse image element
 */
async function parseImageElement(
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  styles: Record<string, string>,
  doc: Document
): Promise<EditorElement> {
  let src = img.src || img.getAttribute('src') || '';
  
  // Handle relative URLs - convert to absolute if needed
  if (src && !src.startsWith('data:') && !src.startsWith('http://') && !src.startsWith('https://')) {
    // Try to resolve relative URL
    try {
      const baseUrl = doc.location?.href || window.location.href;
      const url = new URL(src, baseUrl);
      src = url.href;
    } catch (error) {
      console.warn('Could not resolve relative image URL:', error);
    }
  }
  
  // Handle data URLs
  if (src.startsWith('data:')) {
    // Use data URL directly
  } else if (src.startsWith('http://') || src.startsWith('https://')) {
    // Try to convert external URL to data URL (CORS may prevent this)
    try {
      const response = await fetch(src, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        src = await blobToDataURL(blob);
      } else {
        console.warn('Could not fetch external image:', response.statusText);
        // Keep original URL - may need proxy in production
      }
    } catch (error) {
      console.warn('Could not convert external image to data URL (CORS):', error);
      // Keep original URL - will need to handle CORS in production (proxy or allow CORS)
    }
  }

  return {
    id: generateId(),
    type: 'image',
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: parseFloat(styles.opacity || '1'),
    src,
    visible: true,
    zIndex: 0,
  };
}

/**
 * Parse text/button element
 */
function parseTextElement(
  element: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
  styles: Record<string, string>
): EditorElement {
  const text = extractTextContent(element);
  if (!text.trim()) return null as any;

  const fontSize = parseFloat(styles.fontSize || '16');
  const fontFamily = styles.fontFamily?.replace(/['"]/g, '').split(',')[0] || 'Inter';
  const fontWeight = styles.fontWeight || 'normal';
  const fontStyle = styles.fontStyle || 'normal';
  const color = styles.color || '#000000';
  const textAlign = styles.textAlign || 'left';
  const lineHeight = parseFloat(styles.lineHeight || '1.5');

  return {
    id: generateId(),
    type: 'text',
    x,
    y,
    width,
    height: height || fontSize * lineHeight * (text.split('\n').length || 1),
    rotation: 0,
    opacity: parseFloat(styles.opacity || '1'),
    text,
    fontSize,
    fontFamily,
    fontWeight: fontWeight as any,
    fontStyle: fontStyle as any,
    fill: color,
    align: textAlign as any,
    verticalAlign: 'top',
    visible: true,
    zIndex: 0,
  };
}

/**
 * Parse button element (as text with background)
 */
function parseButtonElement(
  element: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
  styles: Record<string, string>
): EditorElement {
  const text = extractTextContent(element);
  
  // Create text element
  const textElement = parseTextElement(element, x, y, width, height, styles);
  
  // If there's a background color, create a shape behind it
  const bgColor = extractBackgroundColor(element);
  if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
    // Adjust text element to account for padding
    const paddingTop = parseFloat(styles.paddingTop || '0');
    const paddingLeft = parseFloat(styles.paddingLeft || '0');
    
    if (textElement) {
      textElement.x += paddingLeft;
      textElement.y += paddingTop;
      textElement.width -= paddingLeft + parseFloat(styles.paddingRight || '0');
      textElement.height -= paddingTop + parseFloat(styles.paddingBottom || '0');
    }
    
    // Create background shape
    const shapeElement: EditorElement = {
      id: generateId(),
      type: 'shape',
      shapeType: 'rectangle',
      x,
      y,
      width,
      height,
      rotation: 0,
      opacity: parseFloat(styles.opacity || '1'),
      fill: bgColor,
      stroke: {
        color: styles.borderColor || 'transparent',
        width: parseFloat(styles.borderWidth || '0'),
      },
      cornerRadius: parseFloat(styles.borderRadius || '0'),
      visible: true,
      zIndex: textElement ? textElement.zIndex - 1 : 0,
    };
    
    return shapeElement;
  }
  
  return textElement!;
}

/**
 * Parse shape element (div with background)
 */
function parseShapeElement(
  element: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
  styles: Record<string, string>
): EditorElement {
  const bgColor = extractBackgroundColor(element) || '#000000';
  const borderColor = styles.borderColor || 'transparent';
  const borderWidth = parseFloat(styles.borderWidth || '0');
  const borderRadius = parseFloat(styles.borderRadius || '0');

  // Determine shape type based on border-radius
  let shapeType: 'rectangle' | 'circle' = 'rectangle';
  if (borderRadius >= Math.min(width, height) / 2) {
    shapeType = 'circle';
  }

  return {
    id: generateId(),
    type: 'shape',
    shapeType,
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: parseFloat(styles.opacity || '1'),
    fill: bgColor,
    stroke: {
      color: borderColor,
      width: borderWidth,
    },
    cornerRadius: borderRadius,
    visible: true,
    zIndex: 0,
  };
}

/**
 * Parse inline styles and computed styles
 */
function parseStyles(element: HTMLElement, doc: Document): Record<string, string> {
  const styles: Record<string, string> = {};
  
  // Get inline styles
  const inlineStyle = element.getAttribute('style') || '';
  const inlineStyles = parseInlineStyles(inlineStyle);
  Object.assign(styles, inlineStyles);

  // Get computed styles from the document
  try {
    const computed = doc.defaultView?.getComputedStyle(element);
    if (computed) {
      Object.assign(styles, {
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        fontSize: computed.fontSize,
        fontFamily: computed.fontFamily,
        fontWeight: computed.fontWeight,
        fontStyle: computed.fontStyle,
        textAlign: computed.textAlign,
        lineHeight: computed.lineHeight,
        paddingTop: computed.paddingTop,
        paddingRight: computed.paddingRight,
        paddingBottom: computed.paddingBottom,
        paddingLeft: computed.paddingLeft,
        borderColor: computed.borderColor,
        borderWidth: computed.borderWidth,
        borderRadius: computed.borderRadius,
        width: computed.width,
        height: computed.height,
        left: computed.left,
        top: computed.top,
        position: computed.position,
      });
    }
  } catch (error) {
    // Silently fail - we'll use inline styles instead
  }
  
  // Also check for CSS classes and try to extract common patterns
  const classList = element.getAttribute('class') || '';
  if (classList.includes('hidden') || classList.includes('invisible')) {
    styles.display = 'none';
  }

  return styles;
}

/**
 * Parse inline style string
 */
function parseInlineStyles(styleString: string): Record<string, string> {
  const styles: Record<string, string> = {};
  if (!styleString) return styles;

  const declarations = styleString.split(';');
  for (const decl of declarations) {
    const [property, value] = decl.split(':').map(s => s.trim());
    if (property && value) {
      styles[property] = value;
    }
  }
  return styles;
}

/**
 * Extract text content from element
 */
function extractTextContent(element: HTMLElement): string {
  // Clone to avoid modifying original
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Remove script and style elements
  const scripts = clone.querySelectorAll('script, style');
  scripts.forEach(s => s.remove());
  
  return clone.textContent || clone.innerText || '';
}

/**
 * Check if element has text content
 */
function hasTextContent(element: HTMLElement): boolean {
  const text = extractTextContent(element);
  return text.trim().length > 0;
}

/**
 * Check if element only contains images
 */
function hasOnlyChildImages(element: HTMLElement): boolean {
  const children = Array.from(element.children);
  if (children.length === 0) return false;
  return children.every(child => child.tagName.toLowerCase() === 'img');
}

/**
 * Extract background color
 */
function extractBackgroundColor(element: HTMLElement | Element): string | null {
  const styles = parseStyles(element as HTMLElement);
  const bgColor = styles.backgroundColor || styles.background;
  
  if (!bgColor || bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') {
    return null;
  }
  
  return bgColor;
}

/**
 * Check if element has background image
 */
function hasBackgroundImage(styles: Record<string, string>): boolean {
  const bgImage = styles.backgroundImage || styles.background;
  return bgImage && bgImage !== 'none' && bgImage.includes('url(');
}

/**
 * Check if element has background color
 */
function hasBackgroundColor(styles: Record<string, string>): boolean {
  const bgColor = extractBackgroundColor({ getAttribute: () => null } as any);
  return !!bgColor;
}

/**
 * Convert blob to data URL
 */
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

