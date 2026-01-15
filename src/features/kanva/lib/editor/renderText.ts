import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Overline } from '../../extensions/Overline';

/**
 * Render TipTap JSON to HTML for display when not editing
 * This is how Canva shows read-only text
 */
export function renderHTMLFromJSON(json: any): string {
  if (!json) {
    return '';
  }

  // Handle legacy plain text format
  if (typeof json === 'string') {
    return json;
  }

  if (!json.content) {
    return '';
  }

  try {
    return generateHTML(json, [
      StarterKit,
      Underline,
      Overline,
      TextStyle,
      Color,
    ]);
  } catch (e) {
    console.error('Error rendering text JSON:', e);
    // Fallback: extract plain text
    const extractText = (node: any): string => {
      if (node.type === 'text') {
        return node.text || '';
      }
      if (node.content) {
        return node.content.map(extractText).join('');
      }
      return '';
    };
    const plainText = extractText(json);
    return plainText || '';
  }
}

/**
 * Convert plain text string to TipTap JSON format
 */
export function textToJSON(text: string): any {
  if (!text) {
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    };
  }

  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text }],
      },
    ],
  };
}

/**
 * Extract plain text from TipTap JSON
 */
export function extractTextFromJSON(json: any): string {
  if (!json) return '';
  
  // Handle legacy plain text format
  if (typeof json === 'string') {
    return json;
  }
  
  if (!json.content) return '';
  
  const extractText = (node: any): string => {
    if (node.type === 'text') {
      return node.text || '';
    }
    if (node.content) {
      return node.content.map(extractText).join('');
    }
    return '';
  };
  
  return extractText(json);
}

