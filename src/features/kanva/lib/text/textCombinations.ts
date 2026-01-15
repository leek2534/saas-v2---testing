/**
 * Text Combinations Library
 * Professional text preset templates for quick canvas insertion
 */

export interface TextCombinationElement {
  id: string;
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight?: string | number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  position: { x: number; y: number };
  letterSpacing?: number;
  lineHeight?: number;
  rotation?: number;
}

export interface TextCombinationTemplate {
  id: string;
  name: string;
  category: 'business' | 'social' | 'minimal' | 'edgy';
  tags: string[];
  preview: string; // SVG data URL for thumbnail
  elements: TextCombinationElement[];
  grouping: boolean;
  width: number; // Bounding box width
  height: number; // Bounding box height
}

// Helper to generate SVG preview
const generatePreview = (elements: TextCombinationElement[], width: number, height: number): string => {
  const svgElements = elements.map(el => {
    const fontSize = el.fontSize;
    const fontWeight = el.fontWeight || 'normal';
    const textAnchor = el.textAlign === 'center' ? 'middle' : el.textAlign === 'right' ? 'end' : 'start';
    
    return `<text 
      x="${el.position.x}" 
      y="${el.position.y}" 
      font-family="${el.fontFamily}" 
      font-size="${fontSize}" 
      font-weight="${fontWeight}" 
      fill="${el.color}" 
      text-anchor="${textAnchor}"
      ${el.rotation ? `transform="rotate(${el.rotation} ${el.position.x} ${el.position.y})"` : ''}
      ${el.letterSpacing ? `letter-spacing="${el.letterSpacing}"` : ''}
    >${el.content}</text>`;
  }).join('\n');

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#ffffff"/>
    ${svgElements}
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// BUSINESS / TECH TEMPLATES - Enhanced with modern fonts & colors
const businessTemplates: TextCombinationTemplate[] = [
  {
    id: 'quick-win',
    name: 'Quick Win',
    category: 'business',
    tags: ['business', 'bold', 'modern'],
    grouping: true,
    width: 300,
    height: 100,
    elements: [
      {
        id: 'qw-1',
        type: 'text',
        content: 'QUICK WIN',
        fontFamily: 'Space Grotesk',
        fontSize: 48,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center',
        position: { x: 150, y: 45 },
        letterSpacing: 1,
      },
      {
        id: 'qw-2',
        type: 'text',
        content: 'Make it happen today',
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '400',
        color: '#64748B',
        textAlign: 'center',
        position: { x: 150, y: 75 },
        letterSpacing: 2,
      },
    ],
    preview: '',
  },
  {
    id: 'team-sync',
    name: 'Team Sync',
    category: 'business',
    tags: ['business', 'uppercase', 'stacked'],
    grouping: true,
    width: 280,
    height: 90,
    elements: [
      {
        id: 'ts-1',
        type: 'text',
        content: 'TEAM',
        fontFamily: 'Outfit',
        fontSize: 42,
        fontWeight: '800',
        color: '#6366F1',
        textAlign: 'center',
        position: { x: 140, y: 40 },
        letterSpacing: 8,
      },
      {
        id: 'ts-2',
        type: 'text',
        content: 'SYNC',
        fontFamily: 'Outfit',
        fontSize: 36,
        fontWeight: '600',
        color: '#0F172A',
        textAlign: 'center',
        position: { x: 140, y: 75 },
        letterSpacing: 12,
      },
    ],
    preview: '',
  },
  {
    id: 'tech-stack',
    name: 'Tech Stack',
    category: 'business',
    tags: ['tech', 'italic', 'modern'],
    grouping: true,
    width: 320,
    height: 100,
    elements: [
      {
        id: 'tech-1',
        type: 'text',
        content: 'Tech',
        fontFamily: 'Sora',
        fontSize: 52,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'left',
        position: { x: 20, y: 50 },
      },
      {
        id: 'tech-2',
        type: 'text',
        content: 'Stack',
        fontFamily: 'Sora',
        fontSize: 44,
        fontWeight: '400',
        color: '#3B82F6',
        textAlign: 'left',
        position: { x: 25, y: 85 },
        rotation: -2,
      },
    ],
    preview: '',
  },
  {
    id: 'big-strategy',
    name: 'Big Strategy',
    category: 'business',
    tags: ['serif', 'elegant', 'script'],
    grouping: true,
    width: 340,
    height: 110,
    elements: [
      {
        id: 'bs-1',
        type: 'text',
        content: 'Big Strategy',
        fontFamily: 'Playfair Display',
        fontSize: 56,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center',
        position: { x: 170, y: 55 },
      },
      {
        id: 'bs-2',
        type: 'text',
        content: 'for success',
        fontFamily: 'Caveat',
        fontSize: 32,
        fontWeight: '600',
        color: '#F59E0B',
        textAlign: 'center',
        position: { x: 170, y: 90 },
      },
    ],
    preview: '',
  },
];

// SOCIAL MEDIA TEMPLATES - Enhanced with trendy fonts & vibrant colors
const socialTemplates: TextCombinationTemplate[] = [
  {
    id: 'weekend-vibes',
    name: 'Weekend Vibes',
    category: 'social',
    tags: ['social', 'script', 'casual'],
    grouping: true,
    width: 300,
    height: 120,
    elements: [
      {
        id: 'wv-1',
        type: 'text',
        content: 'Weekend',
        fontFamily: 'Satisfy',
        fontSize: 52,
        fontWeight: '400',
        color: '#EC4899',
        textAlign: 'center',
        position: { x: 150, y: 50 },
        rotation: -3,
      },
      {
        id: 'wv-2',
        type: 'text',
        content: 'VIBES',
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 32,
        fontWeight: '800',
        color: '#06B6D4',
        textAlign: 'center',
        position: { x: 150, y: 90 },
        letterSpacing: 6,
      },
    ],
    preview: '',
  },
  {
    id: 'glow-up',
    name: 'Glow Up',
    category: 'social',
    tags: ['social', 'gradient', 'modern'],
    grouping: true,
    width: 280,
    height: 100,
    elements: [
      {
        id: 'gu-1',
        type: 'text',
        content: 'GLOW',
        fontFamily: 'Urbanist',
        fontSize: 52,
        fontWeight: '800',
        color: '#F97316',
        textAlign: 'center',
        position: { x: 140, y: 50 },
        letterSpacing: 4,
      },
      {
        id: 'gu-2',
        type: 'text',
        content: 'UP',
        fontFamily: 'Urbanist',
        fontSize: 52,
        fontWeight: '800',
        color: '#8B5CF6',
        textAlign: 'center',
        position: { x: 140, y: 90 },
        letterSpacing: 8,
      },
    ],
    preview: '',
  },
  {
    id: 'fresh-drop',
    name: 'Fresh Drop',
    category: 'social',
    tags: ['social', 'bold', 'impact'],
    grouping: true,
    width: 300,
    height: 90,
    elements: [
      {
        id: 'fd-1',
        type: 'text',
        content: 'FRESH',
        fontFamily: 'Bebas Neue',
        fontSize: 56,
        fontWeight: '400',
        color: '#0F172A',
        textAlign: 'center',
        position: { x: 150, y: 50 },
        letterSpacing: 2,
      },
      {
        id: 'fd-2',
        type: 'text',
        content: 'DROP',
        fontFamily: 'Bebas Neue',
        fontSize: 48,
        fontWeight: '400',
        color: '#10B981',
        textAlign: 'center',
        position: { x: 150, y: 85 },
        letterSpacing: 4,
      },
    ],
    preview: '',
  },
  {
    id: 'roll-out',
    name: 'Roll Out',
    category: 'social',
    tags: ['social', 'block', 'highlight'],
    grouping: true,
    width: 300,
    height: 100,
    elements: [
      {
        id: 'ro-1',
        type: 'text',
        content: 'ROLL OUT',
        fontFamily: 'Archivo Black',
        fontSize: 52,
        fontWeight: '400',
        color: '#FBBF24',
        textAlign: 'center',
        position: { x: 150, y: 50 },
        letterSpacing: 3,
      },
      {
        id: 'ro-2',
        type: 'text',
        content: 'the new collection',
        fontFamily: 'DM Sans',
        fontSize: 18,
        fontWeight: '500',
        color: '#475569',
        textAlign: 'center',
        position: { x: 150, y: 80 },
        letterSpacing: 1,
      },
    ],
    preview: '',
  },
];

// MINIMAL TEMPLATES - Enhanced with refined fonts & sophisticated colors
const minimalTemplates: TextCombinationTemplate[] = [
  {
    id: 'new-project',
    name: 'New Project',
    category: 'minimal',
    tags: ['minimal', 'clean', 'modern'],
    grouping: true,
    width: 280,
    height: 90,
    elements: [
      {
        id: 'np-1',
        type: 'text',
        content: 'New',
        fontFamily: 'Inter',
        fontSize: 38,
        fontWeight: '300',
        color: '#94A3B8',
        textAlign: 'left',
        position: { x: 20, y: 40 },
      },
      {
        id: 'np-2',
        type: 'text',
        content: 'Project',
        fontFamily: 'Inter',
        fontSize: 48,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'left',
        position: { x: 20, y: 80 },
      },
    ],
    preview: '',
  },
  {
    id: 'mood-board',
    name: 'Mood Board',
    category: 'minimal',
    tags: ['minimal', 'lowercase', 'aesthetic'],
    grouping: true,
    width: 260,
    height: 80,
    elements: [
      {
        id: 'mb-1',
        type: 'text',
        content: 'mood',
        fontFamily: 'Poppins',
        fontSize: 42,
        fontWeight: '300',
        color: '#64748B',
        textAlign: 'center',
        position: { x: 130, y: 40 },
        letterSpacing: 4,
      },
      {
        id: 'mb-2',
        type: 'text',
        content: 'board',
        fontFamily: 'Poppins',
        fontSize: 42,
        fontWeight: '600',
        color: '#1E293B',
        textAlign: 'center',
        position: { x: 130, y: 75 },
        letterSpacing: 2,
      },
    ],
    preview: '',
  },
  {
    id: 'data-power',
    name: 'Data is Power',
    category: 'minimal',
    tags: ['minimal', 'tech', 'grid'],
    grouping: true,
    width: 300,
    height: 100,
    elements: [
      {
        id: 'dp-1',
        type: 'text',
        content: 'DATA',
        fontFamily: 'JetBrains Mono',
        fontSize: 44,
        fontWeight: '700',
        color: '#3B82F6',
        textAlign: 'left',
        position: { x: 20, y: 45 },
        letterSpacing: 6,
      },
      {
        id: 'dp-2',
        type: 'text',
        content: 'is power',
        fontFamily: 'Inter',
        fontSize: 24,
        fontWeight: '400',
        color: '#475569',
        textAlign: 'left',
        position: { x: 20, y: 75 },
        letterSpacing: 1,
      },
    ],
    preview: '',
  },
  {
    id: 'think-clear',
    name: 'Think Clear',
    category: 'minimal',
    tags: ['minimal', 'thin', 'balanced'],
    grouping: true,
    width: 280,
    height: 90,
    elements: [
      {
        id: 'tc-1',
        type: 'text',
        content: 'Think',
        fontFamily: 'Raleway',
        fontSize: 46,
        fontWeight: '300',
        color: '#334155',
        textAlign: 'center',
        position: { x: 140, y: 45 },
      },
      {
        id: 'tc-2',
        type: 'text',
        content: 'Clear',
        fontFamily: 'Raleway',
        fontSize: 46,
        fontWeight: '800',
        color: '#0F172A',
        textAlign: 'center',
        position: { x: 140, y: 85 },
      },
    ],
    preview: '',
  },
];

// EDGY / BOLD TEMPLATES - Enhanced with bold fonts & high-impact colors
const edgyTemplates: TextCombinationTemplate[] = [
  {
    id: 'hustle-mode',
    name: 'Hustle Mode',
    category: 'edgy',
    tags: ['edgy', 'slanted', 'bold'],
    grouping: true,
    width: 320,
    height: 100,
    elements: [
      {
        id: 'hm-1',
        type: 'text',
        content: 'HUSTLE',
        fontFamily: 'Oswald',
        fontSize: 56,
        fontWeight: '700',
        color: '#EF4444',
        textAlign: 'center',
        position: { x: 160, y: 50 },
        rotation: -5,
        letterSpacing: 2,
      },
      {
        id: 'hm-2',
        type: 'text',
        content: 'MODE',
        fontFamily: 'Oswald',
        fontSize: 48,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center',
        position: { x: 160, y: 90 },
        rotation: 3,
        letterSpacing: 4,
      },
    ],
    preview: '',
  },
  {
    id: 'drop-heat',
    name: 'Drop Heat',
    category: 'edgy',
    tags: ['edgy', 'color-blocked', 'modern'],
    grouping: true,
    width: 300,
    height: 110,
    elements: [
      {
        id: 'dh-1',
        type: 'text',
        content: 'DROP',
        fontFamily: 'Anton',
        fontSize: 58,
        fontWeight: '400',
        color: '#DC2626',
        textAlign: 'center',
        position: { x: 150, y: 50 },
        letterSpacing: 3,
      },
      {
        id: 'dh-2',
        type: 'text',
        content: 'HEAT',
        fontFamily: 'Teko',
        fontSize: 52,
        fontWeight: '700',
        color: '#F59E0B',
        textAlign: 'center',
        position: { x: 150, y: 95 },
        letterSpacing: 8,
      },
    ],
    preview: '',
  },
  {
    id: 'make-noise',
    name: 'Make Noise',
    category: 'edgy',
    tags: ['edgy', 'wavy', 'bold'],
    grouping: true,
    width: 300,
    height: 100,
    elements: [
      {
        id: 'mn-1',
        type: 'text',
        content: 'MAKE',
        fontFamily: 'Barlow Condensed',
        fontSize: 52,
        fontWeight: '800',
        color: '#0F172A',
        textAlign: 'center',
        position: { x: 150, y: 45 },
        letterSpacing: 4,
      },
      {
        id: 'mn-2',
        type: 'text',
        content: 'NOISE',
        fontFamily: 'Barlow Condensed',
        fontSize: 48,
        fontWeight: '700',
        color: '#22C55E',
        textAlign: 'center',
        position: { x: 150, y: 85 },
        rotation: 2,
        letterSpacing: 6,
      },
    ],
    preview: '',
  },
  {
    id: 'loud-clear',
    name: 'Loud & Clear',
    category: 'edgy',
    tags: ['edgy', 'split-tone', 'modern'],
    grouping: true,
    width: 320,
    height: 100,
    elements: [
      {
        id: 'lc-1',
        type: 'text',
        content: 'LOUD',
        fontFamily: 'Archivo Black',
        fontSize: 54,
        fontWeight: '400',
        color: '#A855F7',
        textAlign: 'left',
        position: { x: 20, y: 50 },
        letterSpacing: 2,
      },
      {
        id: 'lc-2',
        type: 'text',
        content: '& CLEAR',
        fontFamily: 'Archivo Black',
        fontSize: 44,
        fontWeight: '400',
        color: '#06B6D4',
        textAlign: 'right',
        position: { x: 300, y: 85 },
        letterSpacing: 3,
      },
    ],
    preview: '',
  },
];

// Combine all templates
export const TEXT_COMBINATIONS: TextCombinationTemplate[] = [
  ...businessTemplates,
  ...socialTemplates,
  ...minimalTemplates,
  ...edgyTemplates,
];

// Generate previews for all templates
TEXT_COMBINATIONS.forEach(template => {
  template.preview = generatePreview(template.elements, template.width, template.height);
});

// Helper functions
export const getTemplatesByCategory = (category: TextCombinationTemplate['category']) => {
  return TEXT_COMBINATIONS.filter(t => t.category === category);
};

export const searchTemplates = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return TEXT_COMBINATIONS.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getTemplateById = (id: string) => {
  return TEXT_COMBINATIONS.find(t => t.id === id);
};

export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'business', label: 'Business' },
  { id: 'social', label: 'Social' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'edgy', label: 'Edgy' },
] as const;
