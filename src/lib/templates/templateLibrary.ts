import type { Template, EditorElement, CanvasConfig } from '../editor/types';
import { CANVA_PRESETS } from '../editor/canvasPresets';

// Generate a template with elements
function createTemplate(
  id: string,
  name: string,
  presetId: string,
  elements: EditorElement[],
  thumbnail?: string,
  tags?: string[]
): Template {
  const preset = CANVA_PRESETS.find(p => p.id === presetId);
  if (!preset) {
    throw new Error(`Preset ${presetId} not found`);
  }

  const canvas: CanvasConfig = {
    width: preset.width,
    height: preset.height,
    background: {
      color: '#ffffff',
    },
  };

  return {
    id,
    name,
    canvas,
    elements,
    thumbnail,
    tags: tags || [preset.category, preset.name.toLowerCase()],
    category: preset.category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Instagram Post Templates (1080x1080)
const instagramPostTemplates: Template[] = [
  createTemplate(
    'ig-post-1',
    'Travel Adventure',
    'instagram-post',
    [
      {
        id: 'bg-1',
        type: 'shape',
        shapeType: 'rect',
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        rotation: 0,
        zIndex: 0,
        visible: true,
        fill: '#FF6B35',
      },
      {
        id: 'text-1',
        type: 'text',
        text: 'TIME TO TRAVEL',
        x: 540,
        y: 300,
        width: 900,
        height: 120,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 72,
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#FFFFFF',
        align: 'center',
        verticalAlign: 'middle',
      },
      {
        id: 'text-2',
        type: 'text',
        text: 'Travel with us',
        x: 540,
        y: 420,
        width: 900,
        height: 80,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 48,
        fontFamily: 'Montserrat',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fill: '#FFFFFF',
        align: 'center',
        verticalAlign: 'middle',
      },
      {
        id: 'shape-1',
        type: 'shape',
        shapeType: 'circle',
        x: 540,
        y: 700,
        width: 200,
        height: 200,
        rotation: 0,
        zIndex: 1,
        visible: true,
        fill: '#4ECDC4',
      },
    ],
    undefined,
    ['travel', 'adventure', 'social']
  ),
  createTemplate(
    'ig-post-2',
    'Food Recipe',
    'instagram-post',
    [
      {
        id: 'bg-1',
        type: 'shape',
        shapeType: 'rect',
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        rotation: 0,
        zIndex: 0,
        visible: true,
        fill: '#E8F5E9',
      },
      {
        id: 'text-1',
        type: 'text',
        text: 'Easy Salad Recipes',
        x: 540,
        y: 400,
        width: 1000,
        height: 120,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 64,
        fontFamily: 'Playfair Display',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#2E7D32',
        align: 'center',
        verticalAlign: 'middle',
      },
      {
        id: 'shape-1',
        type: 'shape',
        shapeType: 'rect',
        x: 140,
        y: 600,
        width: 800,
        height: 300,
        rotation: 0,
        zIndex: 1,
        visible: true,
        fill: '#81C784',
        cornerRadius: 20,
      },
    ],
    undefined,
    ['food', 'recipe', 'healthy']
  ),
  createTemplate(
    'ig-post-3',
    'Fitness Cardio',
    'instagram-post',
    [
      {
        id: 'bg-1',
        type: 'shape',
        shapeType: 'rect',
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        rotation: 0,
        zIndex: 0,
        visible: true,
        fill: '#FFD54F',
      },
      {
        id: 'bg-2',
        type: 'shape',
        shapeType: 'rect',
        x: 0,
        y: 540,
        width: 1080,
        height: 540,
        rotation: 0,
        zIndex: 0,
        visible: true,
        fill: '#212121',
      },
      {
        id: 'text-1',
        type: 'text',
        text: '10 MINUTES',
        x: 540,
        y: 300,
        width: 900,
        height: 100,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 72,
        fontFamily: 'Oswald',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#212121',
        align: 'center',
        verticalAlign: 'middle',
      },
      {
        id: 'text-2',
        type: 'text',
        text: 'FITNESS CARDIO',
        x: 540,
        y: 750,
        width: 900,
        height: 100,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 64,
        fontFamily: 'Oswald',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#FFD54F',
        align: 'center',
        verticalAlign: 'middle',
      },
    ],
    undefined,
    ['fitness', 'workout', 'health']
  ),
];

// Instagram Story Templates (1080x1920)
const instagramStoryTemplates: Template[] = [
  createTemplate(
    'ig-story-1',
    'Quote Story',
    'instagram-story',
    [
      {
        id: 'bg-1',
        type: 'shape',
        shapeType: 'rect',
        x: 0,
        y: 0,
        width: 1080,
        height: 1920,
        rotation: 0,
        zIndex: 0,
        visible: true,
        fill: '#6C5CE7',
      },
      {
        id: 'text-1',
        type: 'text',
        text: 'Dream Big',
        x: 540,
        y: 800,
        width: 1000,
        height: 150,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 96,
        fontFamily: 'Playfair Display',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#FFFFFF',
        align: 'center',
        verticalAlign: 'middle',
      },
      {
        id: 'text-2',
        type: 'text',
        text: 'Achieve More',
        x: 540,
        y: 1000,
        width: 1000,
        height: 150,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 96,
        fontFamily: 'Playfair Display',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#FFFFFF',
        align: 'center',
        verticalAlign: 'middle',
      },
    ],
    undefined,
    ['quote', 'inspiration', 'motivation']
  ),
];

// Facebook Post Templates (1200x630)
const facebookPostTemplates: Template[] = [
  createTemplate(
    'fb-post-1',
    'Business Announcement',
    'facebook-post',
    [
      {
        id: 'bg-1',
        type: 'shape',
        shapeType: 'rect',
        x: 0,
        y: 0,
        width: 1200,
        height: 630,
        rotation: 0,
        zIndex: 0,
        visible: true,
        fill: '#1877F2',
      },
      {
        id: 'text-1',
        type: 'text',
        text: 'NEW PRODUCT LAUNCH',
        x: 600,
        y: 250,
        width: 1100,
        height: 80,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 56,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#FFFFFF',
        align: 'center',
        verticalAlign: 'middle',
      },
      {
        id: 'text-2',
        type: 'text',
        text: 'Coming Soon',
        x: 600,
        y: 350,
        width: 1100,
        height: 60,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 42,
        fontFamily: 'Roboto',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fill: '#FFFFFF',
        align: 'center',
        verticalAlign: 'middle',
      },
    ],
    undefined,
    ['business', 'announcement', 'product']
  ),
  createTemplate(
    'fb-post-2',
    'Event Promotion',
    'facebook-post',
    [
      {
        id: 'bg-1',
        type: 'shape',
        shapeType: 'rect',
        x: 0,
        y: 0,
        width: 1200,
        height: 630,
        rotation: 0,
        zIndex: 0,
        visible: true,
        fill: '#E91E63',
      },
      {
        id: 'shape-1',
        type: 'shape',
        shapeType: 'circle',
        x: 300,
        y: 315,
        width: 200,
        height: 200,
        rotation: 0,
        zIndex: 1,
        visible: true,
        fill: '#FFFFFF',
      },
      {
        id: 'text-1',
        type: 'text',
        text: 'JOIN US',
        x: 750,
        y: 250,
        width: 400,
        height: 80,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 64,
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#FFFFFF',
        align: 'left',
        verticalAlign: 'middle',
      },
      {
        id: 'text-2',
        type: 'text',
        text: 'For an amazing event',
        x: 750,
        y: 350,
        width: 400,
        height: 60,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 36,
        fontFamily: 'Montserrat',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fill: '#FFFFFF',
        align: 'left',
        verticalAlign: 'middle',
      },
    ],
    undefined,
    ['event', 'promotion', 'social']
  ),
];

// Twitter Post Templates (1200x675)
const twitterPostTemplates: Template[] = [
  createTemplate(
    'tw-post-1',
    'Tech Update',
    'twitter-post',
    [
      {
        id: 'bg-1',
        type: 'shape',
        shapeType: 'rect',
        x: 0,
        y: 0,
        width: 1200,
        height: 675,
        rotation: 0,
        zIndex: 0,
        visible: true,
        fill: '#1DA1F2',
      },
      {
        id: 'text-1',
        type: 'text',
        text: 'Tech Update',
        x: 600,
        y: 300,
        width: 1100,
        height: 100,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 72,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#FFFFFF',
        align: 'center',
        verticalAlign: 'middle',
      },
      {
        id: 'shape-1',
        type: 'shape',
        shapeType: 'rect',
        x: 400,
        y: 450,
        width: 400,
        height: 100,
        rotation: 0,
        zIndex: 1,
        visible: true,
        fill: '#FFFFFF',
        cornerRadius: 10,
      },
    ],
    undefined,
    ['tech', 'update', 'news']
  ),
];

// LinkedIn Post Templates (1200x627)
const linkedinPostTemplates: Template[] = [
  createTemplate(
    'li-post-1',
    'Professional Tip',
    'linkedin-post',
    [
      {
        id: 'bg-1',
        type: 'shape',
        shapeType: 'rect',
        x: 0,
        y: 0,
        width: 1200,
        height: 627,
        rotation: 0,
        zIndex: 0,
        visible: true,
        fill: '#0077B5',
      },
      {
        id: 'text-1',
        type: 'text',
        text: 'PROFESSIONAL TIP',
        x: 600,
        y: 250,
        width: 1100,
        height: 80,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 56,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#FFFFFF',
        align: 'center',
        verticalAlign: 'middle',
      },
      {
        id: 'text-2',
        type: 'text',
        text: 'Grow your network',
        x: 600,
        y: 350,
        width: 1100,
        height: 60,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 36,
        fontFamily: 'Roboto',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fill: '#FFFFFF',
        align: 'center',
        verticalAlign: 'middle',
      },
    ],
    undefined,
    ['professional', 'tip', 'career']
  ),
];

// YouTube Thumbnail Templates (1280x720)
const youtubeThumbnailTemplates: Template[] = [
  createTemplate(
    'yt-thumb-1',
    'Video Title',
    'youtube-thumbnail',
    [
      {
        id: 'bg-1',
        type: 'shape',
        shapeType: 'rect',
        x: 0,
        y: 0,
        width: 1280,
        height: 720,
        rotation: 0,
        zIndex: 0,
        visible: true,
        fill: '#FF0000',
      },
      {
        id: 'text-1',
        type: 'text',
        text: 'VIDEO TITLE',
        x: 640,
        y: 300,
        width: 1200,
        height: 120,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 80,
        fontFamily: 'Oswald',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#FFFFFF',
        align: 'center',
        verticalAlign: 'middle',
      },
      {
        id: 'shape-1',
        type: 'shape',
        shapeType: 'circle',
        x: 640,
        y: 500,
        width: 100,
        height: 100,
        rotation: 0,
        zIndex: 1,
        visible: true,
        fill: '#FFFFFF',
      },
    ],
    undefined,
    ['video', 'youtube', 'thumbnail']
  ),
];

// Pinterest Pin Templates (1000x1500)
const pinterestPinTemplates: Template[] = [
  createTemplate(
    'pin-1',
    'Recipe Card',
    'pinterest-pin',
    [
      {
        id: 'bg-1',
        type: 'shape',
        shapeType: 'rect',
        x: 0,
        y: 0,
        width: 1000,
        height: 1500,
        rotation: 0,
        zIndex: 0,
        visible: true,
        fill: '#FFF9E6',
      },
      {
        id: 'text-1',
        type: 'text',
        text: 'DELICIOUS RECIPE',
        x: 500,
        y: 400,
        width: 900,
        height: 100,
        rotation: 0,
        zIndex: 2,
        visible: true,
        fontSize: 64,
        fontFamily: 'Playfair Display',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#8B4513',
        align: 'center',
        verticalAlign: 'middle',
      },
      {
        id: 'shape-1',
        type: 'shape',
        shapeType: 'rect',
        x: 100,
        y: 600,
        width: 800,
        height: 700,
        rotation: 0,
        zIndex: 1,
        visible: true,
        fill: '#F5DEB3',
        cornerRadius: 20,
      },
    ],
    undefined,
    ['recipe', 'food', 'pinterest']
  ),
];

// Combine all templates
export const TEMPLATE_LIBRARY: Template[] = [
  ...instagramPostTemplates,
  ...instagramStoryTemplates,
  ...facebookPostTemplates,
  ...twitterPostTemplates,
  ...linkedinPostTemplates,
  ...youtubeThumbnailTemplates,
  ...pinterestPinTemplates,
];

// Get templates by preset ID
export function getTemplatesByPreset(presetId: string): Template[] {
  return TEMPLATE_LIBRARY.filter(t => {
    const preset = CANVA_PRESETS.find(p => p.id === presetId);
    return preset && t.canvas.width === preset.width && t.canvas.height === preset.height;
  });
}

// Get templates by category
export function getTemplatesByCategory(category: string): Template[] {
  return TEMPLATE_LIBRARY.filter(t => t.category === category);
}

// Search templates
export function searchTemplates(query: string, presetId?: string): Template[] {
  const lowerQuery = query.toLowerCase();
  let templates = presetId ? getTemplatesByPreset(presetId) : TEMPLATE_LIBRARY;
  
  return templates.filter(template =>
    template.name.toLowerCase().includes(lowerQuery) ||
    template.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Get all unique preset IDs that have templates
export function getPresetIdsWithTemplates(): string[] {
  const presetIds = new Set<string>();
  TEMPLATE_LIBRARY.forEach(template => {
    const preset = CANVA_PRESETS.find(p => 
      p.width === template.canvas.width && p.height === template.canvas.height
    );
    if (preset) {
      presetIds.add(preset.id);
    }
  });
  return Array.from(presetIds);
}



