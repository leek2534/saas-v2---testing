/**
 * Text Logo/Wordmark Template Library
 * 
 * How Canva likely implements text templates:
 * 1. Pre-designed font combinations (pairing algorithm)
 * 2. Layout presets (stacked, horizontal, angled)
 * 3. Color schemes and effects
 * 4. Stored as JSON configurations
 * 5. Rendered as multiple text elements grouped together
 * 
 * We'll create a similar system using:
 * - Font pairing from Google Fonts (open source)
 * - Pre-defined text element configurations
 * - Grouped elements that can be edited together
 */

import type { TextElement, EditorElement } from '../../editor/types';
import { generateId } from '../../editor/utils';

export interface TextLogoPart {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  fontStyle?: 'normal' | 'italic';
  color: string;
  x: number;
  y: number;
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
  opacity?: number;
  rotation?: number;
}

export interface TextLogoTemplate {
  id: string;
  name: string;
  category: 'bold' | 'elegant' | 'modern' | 'playful' | 'minimal' | 'decorative';
  description: string;
  width: number;
  height: number;
  parts: TextLogoPart[];
  thumbnail?: string;
  tags?: string[];
}

/**
 * Convert a text logo template into canvas elements
 * Each part becomes a separate TextElement that can be edited independently
 */
export function textLogoTemplateToElements(
  template: TextLogoTemplate,
  baseX: number = 0,
  baseY: number = 0,
  baseZIndex: number = 1
): TextElement[] {
  return template.parts.map((part, index) => ({
    id: generateId('text'),
    type: 'text',
    x: baseX + part.x,
    y: baseY + part.y,
    width: part.text.length * (part.fontSize * 0.6), // Approximate width
    height: part.fontSize * 1.2,
    rotation: part.rotation || 0,
    zIndex: baseZIndex + index,
    visible: true,
    text: part.text,
    fontSize: part.fontSize,
    fontFamily: part.fontFamily,
    fontWeight: part.fontWeight,
    fontStyle: part.fontStyle || 'normal',
    fill: part.color,
    letterSpacing: part.letterSpacing || 0,
    textDecoration: part.textDecoration || 'none',
    opacity: part.opacity ?? 1,
    align: 'left' as const,
    lineHeight: 1.2,
  }));
}

/**
 * Text Logo Templates Library
 * Inspired by Canva's text templates but with our own designs
 */
export const TEXT_LOGO_TEMPLATES: TextLogoTemplate[] = [
  // Bold & Modern Styles
  {
    id: 'quick-win',
    name: 'Quick Win',
    category: 'bold',
    description: 'Bold statement with emphasis',
    width: 300,
    height: 120,
    parts: [
      {
        text: 'quick',
        fontSize: 24,
        fontFamily: 'Inter',
        fontWeight: 300,
        fontStyle: 'italic',
        color: '#1e40af',
        x: 0,
        y: 0,
      },
      {
        text: 'WIN',
        fontSize: 64,
        fontFamily: 'Inter',
        fontWeight: 700,
        color: '#2563eb',
        x: 0,
        y: 40,
        letterSpacing: 2,
      },
    ],
    tags: ['bold', 'modern', 'statement'],
  },
  {
    id: 'team-sync',
    name: 'Team Sync',
    category: 'modern',
    description: 'Modern tech style',
    width: 200,
    height: 100,
    parts: [
      {
        text: '>>',
        fontSize: 32,
        fontFamily: 'Inter',
        fontWeight: 600,
        color: '#0f766e',
        x: 0,
        y: 0,
        letterSpacing: -2,
      },
      {
        text: 'team',
        fontSize: 36,
        fontFamily: 'Inter',
        fontWeight: 700,
        color: '#134e4a',
        x: 0,
        y: 45,
        textTransform: 'lowercase',
      },
      {
        text: 'sync',
        fontSize: 36,
        fontFamily: 'Inter',
        fontWeight: 700,
        color: '#134e4a',
        x: 0,
        y: 75,
        textTransform: 'lowercase',
      },
    ],
    tags: ['tech', 'modern', 'minimal'],
  },
  {
    id: 'tech-stack',
    name: 'Tech Stack',
    category: 'bold',
    description: 'Angled bold style',
    width: 280,
    height: 100,
    parts: [
      {
        text: 'TECH',
        fontSize: 48,
        fontFamily: 'Inter',
        fontWeight: 700,
        fontStyle: 'italic',
        color: '#4b5563',
        x: 0,
        y: 0,
        rotation: 2,
      },
      {
        text: 'STACK',
        fontSize: 32,
        fontFamily: 'Georgia',
        fontWeight: 400,
        color: '#1e40af',
        x: 20,
        y: 55,
      },
    ],
    tags: ['bold', 'tech', 'angled'],
  },
  {
    id: 'big-strategy',
    name: 'Big Strategy',
    category: 'bold',
    description: 'Outlined bold with script',
    width: 250,
    height: 120,
    parts: [
      {
        text: 'BIG',
        fontSize: 56,
        fontFamily: 'Inter',
        fontWeight: 700,
        color: '#2563eb',
        x: 0,
        y: 0,
        textDecoration: 'none',
        // Note: Outlined text would need special handling or SVG
      },
      {
        text: 'strategy',
        fontSize: 28,
        fontFamily: 'Dancing Script',
        fontWeight: 400,
        fontStyle: 'italic',
        color: '#2563eb',
        x: 0,
        y: 70,
      },
    ],
    tags: ['bold', 'outline', 'script'],
  },
  {
    id: 'new-project',
    name: 'New Project',
    category: 'modern',
    description: 'Color contrast style',
    width: 220,
    height: 100,
    parts: [
      {
        text: 'new',
        fontSize: 48,
        fontFamily: 'Inter',
        fontWeight: 700,
        color: '#10b981',
        x: 0,
        y: 0,
        textTransform: 'lowercase',
      },
      {
        text: 'PROJECT',
        fontSize: 24,
        fontFamily: 'Inter',
        fontWeight: 600,
        color: '#374151',
        x: 0,
        y: 60,
      },
    ],
    tags: ['modern', 'color', 'contrast'],
  },
  {
    id: 'roll-out',
    name: 'Roll Out',
    category: 'bold',
    description: 'Tall bold with highlight',
    width: 200,
    height: 120,
    parts: [
      {
        text: 'ROLL',
        fontSize: 56,
        fontFamily: 'Inter',
        fontWeight: 700,
        color: '#1e40af',
        x: 0,
        y: 0,
      },
      {
        text: 'OUT',
        fontSize: 56,
        fontFamily: 'Inter',
        fontWeight: 700,
        color: '#1e40af',
        x: 0,
        y: 65,
        // Note: Highlight background would be a separate shape element
      },
    ],
    tags: ['bold', 'tall', 'highlight'],
  },
  {
    id: 'mood-board',
    name: 'Mood Board',
    category: 'playful',
    description: 'Size contrast style',
    width: 200,
    height: 100,
    parts: [
      {
        text: 'mood',
        fontSize: 20,
        fontFamily: 'Inter',
        fontWeight: 400,
        color: '#374151',
        x: 0,
        y: 0,
        textTransform: 'lowercase',
      },
      {
        text: 'board',
        fontSize: 48,
        fontFamily: 'Inter',
        fontWeight: 700,
        color: '#9333ea',
        x: 0,
        y: 35,
        textTransform: 'lowercase',
      },
    ],
    tags: ['playful', 'contrast', 'modern'],
  },
  {
    id: 'data-power',
    name: 'Data is Power',
    category: 'modern',
    description: 'Pixelated tech style',
    width: 220,
    height: 100,
    parts: [
      {
        text: 'data',
        fontSize: 36,
        fontFamily: 'Courier New',
        fontWeight: 400,
        color: '#60a5fa',
        x: 0,
        y: 0,
        textTransform: 'lowercase',
        letterSpacing: 2,
      },
      {
        text: 'is power',
        fontSize: 18,
        fontFamily: 'Georgia',
        fontWeight: 400,
        color: '#374151',
        x: 0,
        y: 50,
        textTransform: 'lowercase',
      },
    ],
    tags: ['tech', 'pixel', 'modern'],
  },
  {
    id: 'smart-move',
    name: 'Smart Move',
    category: 'elegant',
    description: 'Elegant contrast',
    width: 200,
    height: 100,
    parts: [
      {
        text: 'smart',
        fontSize: 44,
        fontFamily: 'Inter',
        fontWeight: 700,
        color: '#86efac',
        x: 0,
        y: 0,
        textTransform: 'lowercase',
      },
      {
        text: 'move',
        fontSize: 24,
        fontFamily: 'Georgia',
        fontWeight: 400,
        fontStyle: 'italic',
        color: '#374151',
        x: 0,
        y: 60,
        textTransform: 'lowercase',
      },
    ],
    tags: ['elegant', 'contrast', 'modern'],
  },
  {
    id: 'fashion-icon',
    name: 'Fashion Icon',
    category: 'elegant',
    description: 'Elegant script style',
    width: 220,
    height: 100,
    parts: [
      {
        text: 'Fashion',
        fontSize: 42,
        fontFamily: 'Dancing Script',
        fontWeight: 600,
        color: '#000000',
        x: 0,
        y: 0,
      },
      {
        text: 'ICON',
        fontSize: 20,
        fontFamily: 'Inter',
        fontWeight: 600,
        color: '#000000',
        x: 0,
        y: 65,
      },
    ],
    tags: ['elegant', 'script', 'fashion'],
  },
];

/**
 * Get templates by category
 */
export function getTextLogosByCategory(category: TextLogoTemplate['category']): TextLogoTemplate[] {
  return TEXT_LOGO_TEMPLATES.filter(t => t.category === category);
}

/**
 * Search text logos
 */
export function searchTextLogos(query: string): TextLogoTemplate[] {
  const lowerQuery = query.toLowerCase();
  return TEXT_LOGO_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get a template by ID
 */
export function getTextLogoTemplate(id: string): TextLogoTemplate | undefined {
  return TEXT_LOGO_TEMPLATES.find(t => t.id === id);
}



