/**
 * Canvas Size Presets - Like Canva
 * Organized by category with popular social media, document, and print sizes
 */

export interface CanvasSize {
  id: string;
  name: string;
  width: number;
  height: number;
  category: string;
  description?: string;
  icon?: string;
}

export const CANVAS_SIZES: CanvasSize[] = [
  // Social Media - Instagram
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    width: 1080,
    height: 1080,
    category: 'Instagram',
    description: 'Square post',
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    width: 1080,
    height: 1920,
    category: 'Instagram',
    description: 'Vertical story',
  },
  {
    id: 'instagram-reel',
    name: 'Instagram Reel',
    width: 1080,
    height: 1920,
    category: 'Instagram',
    description: 'Vertical video',
  },
  {
    id: 'instagram-portrait',
    name: 'Instagram Portrait',
    width: 1080,
    height: 1350,
    category: 'Instagram',
    description: '4:5 ratio',
  },
  {
    id: 'instagram-landscape',
    name: 'Instagram Landscape',
    width: 1080,
    height: 566,
    category: 'Instagram',
    description: '1.91:1 ratio',
  },

  // Social Media - Facebook
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    width: 1200,
    height: 630,
    category: 'Facebook',
    description: 'Feed post',
  },
  {
    id: 'facebook-cover',
    name: 'Facebook Cover',
    width: 820,
    height: 312,
    category: 'Facebook',
    description: 'Profile cover',
  },
  {
    id: 'facebook-story',
    name: 'Facebook Story',
    width: 1080,
    height: 1920,
    category: 'Facebook',
    description: 'Vertical story',
  },
  {
    id: 'facebook-event',
    name: 'Facebook Event',
    width: 1920,
    height: 1005,
    category: 'Facebook',
    description: 'Event cover',
  },

  // Social Media - Twitter/X
  {
    id: 'twitter-post',
    name: 'Twitter Post',
    width: 1200,
    height: 675,
    category: 'Twitter',
    description: '16:9 ratio',
  },
  {
    id: 'twitter-header',
    name: 'Twitter Header',
    width: 1500,
    height: 500,
    category: 'Twitter',
    description: 'Profile header',
  },

  // Social Media - LinkedIn
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    width: 1200,
    height: 627,
    category: 'LinkedIn',
    description: 'Feed post',
  },
  {
    id: 'linkedin-cover',
    name: 'LinkedIn Cover',
    width: 1584,
    height: 396,
    category: 'LinkedIn',
    description: 'Profile cover',
  },

  // Social Media - YouTube
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    category: 'YouTube',
    description: '16:9 HD',
  },
  {
    id: 'youtube-banner',
    name: 'YouTube Banner',
    width: 2560,
    height: 1440,
    category: 'YouTube',
    description: 'Channel art',
  },

  // Social Media - TikTok
  {
    id: 'tiktok-video',
    name: 'TikTok Video',
    width: 1080,
    height: 1920,
    category: 'TikTok',
    description: 'Vertical video',
  },

  // Social Media - Pinterest
  {
    id: 'pinterest-pin',
    name: 'Pinterest Pin',
    width: 1000,
    height: 1500,
    category: 'Pinterest',
    description: '2:3 ratio',
  },

  // Documents
  {
    id: 'doc-letter',
    name: 'Letter',
    width: 816,
    height: 1056,
    category: 'Documents',
    description: '8.5 x 11 in',
  },
  {
    id: 'doc-a4',
    name: 'A4',
    width: 794,
    height: 1123,
    category: 'Documents',
    description: '210 x 297 mm',
  },
  {
    id: 'doc-legal',
    name: 'Legal',
    width: 816,
    height: 1344,
    category: 'Documents',
    description: '8.5 x 14 in',
  },

  // Presentations
  {
    id: 'presentation-16-9',
    name: 'Presentation (16:9)',
    width: 1920,
    height: 1080,
    category: 'Presentations',
    description: 'Widescreen',
  },
  {
    id: 'presentation-4-3',
    name: 'Presentation (4:3)',
    width: 1024,
    height: 768,
    category: 'Presentations',
    description: 'Standard',
  },

  // Print
  {
    id: 'print-flyer',
    name: 'Flyer',
    width: 816,
    height: 1056,
    category: 'Print',
    description: '8.5 x 11 in',
  },
  {
    id: 'print-poster-small',
    name: 'Poster (Small)',
    width: 1632,
    height: 2112,
    category: 'Print',
    description: '18 x 24 in',
  },
  {
    id: 'print-business-card',
    name: 'Business Card',
    width: 1050,
    height: 600,
    category: 'Print',
    description: '3.5 x 2 in',
  },

  // Web
  {
    id: 'web-banner',
    name: 'Web Banner',
    width: 1920,
    height: 1080,
    category: 'Web',
    description: 'Full HD',
  },
  {
    id: 'web-blog-graphic',
    name: 'Blog Graphic',
    width: 1200,
    height: 630,
    category: 'Web',
    description: 'Featured image',
  },

  // Custom
  {
    id: 'custom-square',
    name: 'Square',
    width: 1080,
    height: 1080,
    category: 'Custom',
    description: '1:1 ratio',
  },
  {
    id: 'custom-wide',
    name: 'Wide',
    width: 1920,
    height: 1080,
    category: 'Custom',
    description: '16:9 ratio',
  },
  {
    id: 'custom-portrait',
    name: 'Portrait',
    width: 1080,
    height: 1920,
    category: 'Custom',
    description: '9:16 ratio',
  },
];

export const CANVAS_CATEGORIES = [
  'Instagram',
  'Facebook',
  'Twitter',
  'LinkedIn',
  'YouTube',
  'TikTok',
  'Pinterest',
  'Documents',
  'Presentations',
  'Print',
  'Web',
  'Custom',
];

export function getCanvasSizesByCategory(category: string): CanvasSize[] {
  return CANVAS_SIZES.filter((size) => size.category === category);
}

export function getCanvasSizeById(id: string): CanvasSize | undefined {
  return CANVAS_SIZES.find((size) => size.id === id);
}
