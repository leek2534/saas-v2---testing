/**
 * HTML Template Parser for Test Builder
 * Converts ClickFunnels/HTML templates to Test Builder Sections/Rows/Columns/Elements
 */

import type { Section, Row, Column, Element } from '../../stubs/store';

// Stub type for ElementType
export type ElementType = string;

// Helper to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Parse HTML string and convert to Test Builder sections
 */
export async function parseHTMLToSections(html: string): Promise<Section[]> {
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
    const sections: Section[] = [];

    // Find major sections (divs with common section classes/IDs, or semantic HTML5 sections)
    const sectionSelectors = [
      'section',
      '.section',
      '#section',
      '.hero',
      '.header',
      '.footer',
      '.content',
      '.main',
      '[class*="section"]',
      '[id*="section"]',
    ];

    let sectionElements: HTMLElement[] = [];
    
    // Try to find explicit sections first
    for (const selector of sectionSelectors) {
      const found = Array.from(iframeDoc.querySelectorAll(selector)) as HTMLElement[];
      if (found.length > 0) {
        sectionElements = found;
        break;
      }
    }

    // If no explicit sections found, treat major divs as sections
    if (sectionElements.length === 0) {
      const majorDivs = Array.from(body.querySelectorAll('div')) as HTMLElement[];
      // Filter for divs that are direct children of body or have significant content
      sectionElements = majorDivs.filter(div => {
        const rect = div.getBoundingClientRect();
        return rect.height > 100 && (div.parentElement === body || div.offsetParent === body);
      });
    }

    // If still no sections, create one from the body
    if (sectionElements.length === 0) {
      sectionElements = [body];
    }

    // Convert each section element to a Section
    for (const sectionEl of sectionElements) {
      const section = await parseSection(sectionEl, iframeDoc);
      if (section) {
        sections.push(section);
      }
    }

    return sections;
  } finally {
    // Clean up temporary container
    document.body.removeChild(tempContainer);
  }
}

/**
 * Parse a section element into a Section
 */
async function parseSection(
  sectionEl: HTMLElement,
  doc: Document
): Promise<Section | null> {
  const styles = parseStyles(sectionEl, doc);
  
  // Skip invisible sections
  if (styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0') {
    return null;
  }

  const section: Section = {
    id: generateId(),
    name: sectionEl.getAttribute('data-name') || 
          sectionEl.className?.split(' ')[0] || 
          `Section ${generateId().substring(0, 6)}`,
    rows: [],
    props: {
      backgroundColor: extractBackgroundColor(sectionEl, styles),
      paddingTop: parseFloat(styles.paddingTop || '0'),
      paddingBottom: parseFloat(styles.paddingBottom || '0'),
      paddingLeft: parseFloat(styles.paddingLeft || '0'),
      paddingRight: parseFloat(styles.paddingRight || '0'),
      containerType: determineContainerType(sectionEl, styles),
      maxWidth: styles.maxWidth || undefined,
    },
  };

  // Parse rows (typically divs with row classes or direct children)
  const rowElements = findRowElements(sectionEl, doc);
  
  if (rowElements.length === 0) {
    // No explicit rows, create one row from the section's direct children
    const row = await parseRow(sectionEl, doc);
    if (row) {
      section.rows.push(row);
    }
  } else {
    // Parse each row
    for (const rowEl of rowElements) {
      const row = await parseRow(rowEl, doc);
      if (row) {
        section.rows.push(row);
      }
    }
  }

  return section;
}

/**
 * Find row elements within a section
 */
function findRowElements(sectionEl: HTMLElement, doc: Document): HTMLElement[] {
  const rowSelectors = [
    '.row',
    '[class*="row"]',
    '.container > *',
    '.wrapper > *',
  ];

  for (const selector of rowSelectors) {
    const found = Array.from(sectionEl.querySelectorAll(selector)) as HTMLElement[];
    if (found.length > 0) {
      return found.filter(el => el.parentElement === sectionEl || el.offsetParent === sectionEl);
    }
  }

  // Return direct children that are divs
  return Array.from(sectionEl.children).filter(
    child => child instanceof HTMLElement && child.tagName.toLowerCase() === 'div'
  ) as HTMLElement[];
}

/**
 * Parse a row element into a Row
 */
async function parseRow(
  rowEl: HTMLElement,
  doc: Document
): Promise<Row | null> {
  const styles = parseStyles(rowEl, doc);
  
  if (styles.display === 'none' || styles.visibility === 'hidden') {
    return null;
  }

  // Find columns (typically divs with column classes or direct children)
  const columnElements = findColumnElements(rowEl, doc);
  
  const row: Row = {
    id: generateId(),
    name: rowEl.getAttribute('data-name') || 
          rowEl.className?.split(' ')[0] || 
          `Row ${generateId().substring(0, 6)}`,
    columns: [],
    backgroundColor: extractBackgroundColor(rowEl, styles),
    paddingTop: parseFloat(styles.paddingTop || '0'),
    paddingBottom: parseFloat(styles.paddingBottom || '0'),
    paddingLeft: parseFloat(styles.paddingLeft || '0'),
    paddingRight: parseFloat(styles.paddingRight || '0'),
    gap: parseFloat(styles.gap || '0'),
  };

  if (columnElements.length === 0) {
    // No explicit columns, create one column from the row's content
    const column = await parseColumn(rowEl, doc);
    if (column) {
      row.columns.push(column);
    }
  } else {
    // Calculate column widths
    const totalWidth = columnElements.reduce((sum, col) => {
      const rect = col.getBoundingClientRect();
      return sum + rect.width;
    }, 0);

    // Parse each column
    for (const colEl of columnElements) {
      const rect = colEl.getBoundingClientRect();
      const widthPercent = totalWidth > 0 ? (rect.width / totalWidth) * 100 : 100 / columnElements.length;
      
      const column = await parseColumn(colEl, doc, widthPercent);
      if (column) {
        row.columns.push(column);
      }
    }
  }

  return row;
}

/**
 * Find column elements within a row
 */
function findColumnElements(rowEl: HTMLElement, doc: Document): HTMLElement[] {
  const columnSelectors = [
    '.col',
    '.column',
    '[class*="col"]',
    '[class*="column"]',
  ];

  for (const selector of columnSelectors) {
    const found = Array.from(rowEl.querySelectorAll(selector)) as HTMLElement[];
    if (found.length > 0) {
      return found.filter(el => el.parentElement === rowEl || el.offsetParent === rowEl);
    }
  }

  // Return direct children that are divs
  return Array.from(rowEl.children).filter(
    child => child instanceof HTMLElement && child.tagName.toLowerCase() === 'div'
  ) as HTMLElement[];
}

/**
 * Parse a column element into a Column
 */
async function parseColumn(
  colEl: HTMLElement,
  doc: Document,
  widthPercent: number = 100
): Promise<Column | null> {
  const styles = parseStyles(colEl, doc);
  
  if (styles.display === 'none' || styles.visibility === 'hidden') {
    return null;
  }

  const column: Column = {
    id: generateId(),
    width: widthPercent,
    elements: [],
    backgroundColor: extractBackgroundColor(colEl, styles),
    paddingTop: parseFloat(styles.paddingTop || '0'),
    paddingBottom: parseFloat(styles.paddingBottom || '0'),
    paddingLeft: parseFloat(styles.paddingLeft || '0'),
    paddingRight: parseFloat(styles.paddingRight || '0'),
  };

  // Parse elements within the column
  const elements = await parseElements(colEl, doc);
  column.elements = elements;

  return column;
}

/**
 * Parse elements within a container
 */
async function parseElements(
  container: HTMLElement,
  doc: Document
): Promise<Element[]> {
  const elements: Element[] = [];
  const children = Array.from(container.children) as HTMLElement[];

  for (const child of children) {
    const element = await parseElement(child, doc);
    if (element) {
      elements.push(element);
    }
  }

  return elements;
}

/**
 * Parse a single element
 */
async function parseElement(
  element: HTMLElement,
  doc: Document
): Promise<Element | null> {
  const tagName = element.tagName.toLowerCase();
  const styles = parseStyles(element, doc);

  // Skip invisible elements
  if (styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0') {
    return null;
  }

  // Skip script, style, and other non-visual elements
  if (['script', 'style', 'meta', 'link', 'head', 'title'].includes(tagName)) {
    return null;
  }

  let elementType: ElementType | null = null;
  let props: Record<string, any> = {};

  // Determine element type based on tag and content
  if (tagName === 'img') {
    elementType = 'image';
    const img = element as HTMLImageElement;
    props = {
      src: await resolveImageSrc(img.src || img.getAttribute('src') || '', doc),
      alt: img.alt || '',
      width: img.width || parseFloat(styles.width || '0'),
      height: img.height || parseFloat(styles.height || '0'),
    };
  } else if (tagName === 'h1' || tagName === 'h2') {
    elementType = 'heading';
    props = {
      text: element.textContent || '',
      level: tagName as 'h1' | 'h2', // Preserve the heading level
      fontSize: parseFloat(styles.fontSize || '32'),
      fontFamily: styles.fontFamily?.replace(/['"]/g, '').split(',')[0] || 'Inter',
      fontWeight: styles.fontWeight || 'bold',
      textColor: styles.color || '#000000', // Use textColor instead of color
      alignment: styles.textAlign || 'left', // Use alignment instead of align
    };
  } else if (tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6') {
    elementType = 'subheading';
    props = {
      text: element.textContent || '',
      level: tagName as 'h3' | 'h4' | 'h5' | 'h6', // Preserve the heading level
      fontSize: parseFloat(styles.fontSize || '24'),
      fontFamily: styles.fontFamily?.replace(/['"]/g, '').split(',')[0] || 'Inter',
      fontWeight: styles.fontWeight || '600',
      textColor: styles.color || '#000000', // Use textColor instead of color
      alignment: styles.textAlign || 'left', // Use alignment instead of align
    };
  } else if (tagName === 'p' || tagName === 'span' || tagName === 'div') {
    // Check if it's a button
    if (tagName === 'button' || styles.display === 'inline-block' || 
        element.classList.contains('button') || element.classList.contains('btn')) {
      elementType = 'button';
      props = {
        text: element.textContent || '',
        fontSize: parseFloat(styles.fontSize || '16'),
        fontFamily: styles.fontFamily?.replace(/['"]/g, '').split(',')[0] || 'Inter',
        color: styles.color || '#ffffff',
        backgroundColor: extractBackgroundColor(element, styles) || '#007bff',
        align: styles.textAlign || 'center',
        borderRadius: parseFloat(styles.borderRadius || '4'),
        padding: {
          top: parseFloat(styles.paddingTop || '12'),
          bottom: parseFloat(styles.paddingBottom || '12'),
          left: parseFloat(styles.paddingLeft || '24'),
          right: parseFloat(styles.paddingRight || '24'),
        },
      };
    } else {
      // Regular text
      const text = extractTextContent(element);
      if (text.trim()) {
        elementType = 'text';
        props = {
          text,
          fontSize: parseFloat(styles.fontSize || '16'),
          fontFamily: styles.fontFamily?.replace(/['"]/g, '').split(',')[0] || 'Inter',
          color: styles.color || '#000000',
          align: styles.textAlign || 'left',
          lineHeight: parseFloat(styles.lineHeight || '1.5'),
        };
      } else {
        return null; // Empty div, skip
      }
    }
  } else if (tagName === 'button' || tagName === 'a') {
    elementType = 'button';
    props = {
      text: element.textContent || '',
      fontSize: parseFloat(styles.fontSize || '16'),
      fontFamily: styles.fontFamily?.replace(/['"]/g, '').split(',')[0] || 'Inter',
      color: styles.color || '#ffffff',
      backgroundColor: extractBackgroundColor(element, styles) || '#007bff',
      align: styles.textAlign || 'center',
      borderRadius: parseFloat(styles.borderRadius || '4'),
      href: tagName === 'a' ? (element as HTMLAnchorElement).href : undefined,
    };
  } else if (tagName === 'video') {
    elementType = 'video';
    const video = element as HTMLVideoElement;
    props = {
      src: video.src || video.getAttribute('src') || '',
      autoplay: video.autoplay,
      loop: video.loop,
      muted: video.muted,
      controls: video.controls,
    };
  }

  if (!elementType) {
    return null;
  }

  return {
    id: generateId(),
    type: elementType,
    props,
  };
}

/**
 * Parse styles from element
 */
function parseStyles(element: HTMLElement, doc: Document): Record<string, string> {
  const styles: Record<string, string> = {};
  
  // Get inline styles
  const inlineStyle = element.getAttribute('style') || '';
  const inlineStyles = parseInlineStyles(inlineStyle);
  Object.assign(styles, inlineStyles);

  // Get computed styles
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
        textAlign: computed.textAlign,
        lineHeight: computed.lineHeight,
        paddingTop: computed.paddingTop,
        paddingRight: computed.paddingRight,
        paddingBottom: computed.paddingBottom,
        paddingLeft: computed.paddingLeft,
        borderRadius: computed.borderRadius,
        gap: computed.gap,
        maxWidth: computed.maxWidth,
      });
    }
  } catch (error) {
    // Silently fail
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
  const clone = element.cloneNode(true) as HTMLElement;
  const scripts = clone.querySelectorAll('script, style');
  scripts.forEach(s => s.remove());
  return clone.textContent || clone.innerText || '';
}

/**
 * Extract background color
 */
function extractBackgroundColor(element: HTMLElement, styles: Record<string, string>): string | undefined {
  const bgColor = styles.backgroundColor || styles.background;
  if (!bgColor || bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') {
    return undefined;
  }
  return bgColor;
}

/**
 * Determine container type from element
 */
function determineContainerType(element: HTMLElement, styles: Record<string, string>): 'full-width' | 'wide' | 'standard' | 'medium' | 'small' {
  const maxWidth = styles.maxWidth;
  if (!maxWidth) return 'standard';
  
  const width = parseFloat(maxWidth);
  if (isNaN(width)) {
    if (maxWidth === '100%') return 'full-width';
    return 'standard';
  }

  if (width >= 1280) return 'wide';
  if (width >= 1024) return 'medium';
  if (width >= 768) return 'small';
  return 'standard';
}

/**
 * Resolve image source (handle relative URLs, data URLs, etc.)
 */
async function resolveImageSrc(src: string, doc: Document): Promise<string> {
  // Handle data URLs
  if (src.startsWith('data:')) {
    return src;
  }

  // Handle relative URLs
  if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
    try {
      const baseUrl = doc.location?.href || window.location.href;
      const url = new URL(src, baseUrl);
      src = url.href;
    } catch (error) {
      console.warn('Could not resolve relative image URL:', error);
    }
  }

  // Try to convert external URL to data URL (CORS may prevent this)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    try {
      const response = await fetch(src, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        return await blobToDataURL(blob);
      }
    } catch (error) {
      console.warn('Could not convert external image to data URL (CORS):', error);
    }
  }

  return src;
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

