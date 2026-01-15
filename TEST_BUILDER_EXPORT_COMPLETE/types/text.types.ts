/**
 * Structured Text Types
 * Text is structured content, not HTML
 * 
 * This provides a clean, predictable data model for text elements
 * that avoids the chaos of storing raw HTML with dangerouslySetInnerHTML
 */

// Block types - simple and predictable
export type TextBlock =
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: 'paragraph'; text: string };

// Content container - just an array of blocks
export interface TextContent {
  blocks: TextBlock[];
}

// Text element props - clean and focused
export interface TextElementProps {
  // Content
  content: TextContent;
  
  // Alignment (controlled internally by text, not by column)
  align: 'left' | 'center' | 'right';
  
  // Typography
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  
  // Colors
  color?: string;
  highlightColor?: string;
  
  // Gradient text
  useGradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: number;
  
  // Layout constraints
  maxWidth?: number;
  
  // Effects
  opacity?: number;
  useTextShadow?: boolean;
  textShadow?: string;
  
  // Animation
  letterHoverAnimation?: boolean;
  letterHoverScale?: number;
  letterHoverDuration?: number;
}

// Helper to create default text content
export function createDefaultTextContent(text: string = 'Your text here'): TextContent {
  return {
    blocks: [{ type: 'paragraph', text }]
  };
}

// Helper to create heading content
export function createHeadingContent(text: string, level: 1 | 2 | 3 | 4 | 5 | 6 = 1): TextContent {
  return {
    blocks: [{ type: 'heading', level, text }]
  };
}

// Convert plain text (with newlines) to blocks
export function textToBlocks(text: string): TextBlock[] {
  const lines = text.split('\n');
  return lines.map(line => ({
    type: 'paragraph' as const,
    text: line
  }));
}

// Convert blocks to plain text
export function blocksToText(blocks: TextBlock[]): string {
  return blocks.map(block => block.text).join('\n');
}

// Legacy HTML to blocks converter (for migration)
export function htmlToBlocks(html: string): TextBlock[] {
  // Simple conversion - strip tags and split by block elements
  const div = typeof document !== 'undefined' ? document.createElement('div') : null;
  
  if (!div) {
    // Server-side fallback - basic regex stripping
    const text = html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .trim();
    return textToBlocks(text);
  }
  
  div.innerHTML = html;
  const blocks: TextBlock[] = [];
  
  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push({ type: 'paragraph', text });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toLowerCase();
      
      // Handle heading tags
      if (/^h[1-6]$/.test(tagName)) {
        const level = parseInt(tagName[1]) as 1 | 2 | 3 | 4 | 5 | 6;
        const text = el.textContent?.trim() || '';
        if (text) {
          blocks.push({ type: 'heading', level, text });
        }
      }
      // Handle paragraph tags
      else if (tagName === 'p') {
        const text = el.textContent?.trim() || '';
        if (text) {
          blocks.push({ type: 'paragraph', text });
        }
      }
      // Handle div/other block elements
      else if (['div', 'section', 'article'].includes(tagName)) {
        el.childNodes.forEach(processNode);
      }
      // Handle inline elements - get text content
      else {
        const text = el.textContent?.trim() || '';
        if (text && blocks.length === 0) {
          blocks.push({ type: 'paragraph', text });
        }
      }
    }
  };
  
  div.childNodes.forEach(processNode);
  
  // If no blocks were created, create one from all text
  if (blocks.length === 0) {
    const text = div.textContent?.trim() || '';
    if (text) {
      blocks.push({ type: 'paragraph', text });
    }
  }
  
  return blocks;
}
