import type { CanvasConfig } from './types';

export interface CanvasPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  category: 'social' | 'print' | 'presentation' | 'video' | 'custom';
  description?: string;
}

export const CANVA_PRESETS: CanvasPreset[] = [
  // Social Media
  { id: 'instagram-post', name: 'Instagram Post', width: 1080, height: 1080, category: 'social', description: 'Square post' },
  { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920, category: 'social', description: 'Vertical story' },
  { id: 'instagram-reel', name: 'Instagram Reel', width: 1080, height: 1920, category: 'social', description: 'Vertical video' },
  { id: 'facebook-post', name: 'Facebook Post', width: 1200, height: 630, category: 'social', description: 'Landscape post' },
  { id: 'facebook-cover', name: 'Facebook Cover', width: 1640, height: 859, category: 'social', description: 'Cover photo' },
  { id: 'twitter-post', name: 'Twitter Post', width: 1200, height: 675, category: 'social', description: 'Landscape tweet' },
  { id: 'linkedin-post', name: 'LinkedIn Post', width: 1200, height: 627, category: 'social', description: 'Professional post' },
  { id: 'pinterest-pin', name: 'Pinterest Pin', width: 1000, height: 1500, category: 'social', description: 'Vertical pin' },
  { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', width: 1280, height: 720, category: 'social', description: '16:9 thumbnail' },
  { id: 'tiktok-video', name: 'TikTok Video', width: 1080, height: 1920, category: 'social', description: 'Vertical video' },
  
  // Print
  { id: 'a4', name: 'A4 Document', width: 2480, height: 3508, category: 'print', description: 'Standard document' },
  { id: 'us-letter', name: 'US Letter', width: 2550, height: 3300, category: 'print', description: '8.5" x 11"' },
  { id: 'business-card', name: 'Business Card', width: 1050, height: 600, category: 'print', description: 'Standard card' },
  { id: 'poster', name: 'Poster', width: 1800, height: 2400, category: 'print', description: 'Standard poster' },
  { id: 'flyer', name: 'Flyer', width: 1240, height: 1754, category: 'print', description: 'A5 flyer' },
  
  // Presentation
  { id: 'presentation-16-9', name: 'Presentation (16:9)', width: 1920, height: 1080, category: 'presentation', description: 'Widescreen' },
  { id: 'presentation-4-3', name: 'Presentation (4:3)', width: 1920, height: 1440, category: 'presentation', description: 'Standard' },
  
  // Video
  { id: 'video-16-9', name: 'Video (16:9)', width: 1920, height: 1080, category: 'video', description: 'HD video' },
  { id: 'video-9-16', name: 'Video (9:16)', width: 1080, height: 1920, category: 'video', description: 'Vertical video' },
  { id: 'video-square', name: 'Video (Square)', width: 1080, height: 1080, category: 'video', description: 'Square video' },
  
  // Common sizes
  { id: 'custom-1920x1080', name: '1920 x 1080', width: 1920, height: 1080, category: 'custom', description: 'Full HD' },
  { id: 'custom-1080x1080', name: '1080 x 1080', width: 1080, height: 1080, category: 'custom', description: 'Square' },
  { id: 'custom-1200x800', name: '1200 x 800', width: 1200, height: 800, category: 'custom', description: 'Landscape' },
];

export function getPresetById(id: string): CanvasPreset | undefined {
  return CANVA_PRESETS.find(p => p.id === id);
}

export function getPresetsByCategory(category: CanvasPreset['category']): CanvasPreset[] {
  return CANVA_PRESETS.filter(p => p.category === category);
}

export function applyPreset(preset: CanvasPreset): CanvasConfig {
  return {
    width: preset.width,
    height: preset.height,
    background: {
      color: '#ffffff',
    },
  };
}



