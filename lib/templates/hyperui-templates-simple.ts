// Template system for pre-built sections

export interface TemplateData {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
}

// CTA Templates based on HyperUI and Mamba UI presets
export const HYPERUI_TEMPLATES: TemplateData[] = [
  // HyperUI CTA Templates
  {
    id: 'cta-centered',
    name: 'CTA Centered',
    category: 'cta',
    description: 'Centered call-to-action with primary and secondary buttons',
    preview: 'Ready to get started? Join thousands of satisfied customers.',
  },
  {
    id: 'cta-gradient',
    name: 'CTA Gradient',
    category: 'cta',
    description: 'Eye-catching gradient background CTA',
    preview: 'Transform Your Business Today with gradient styling.',
  },
  {
    id: 'cta-split',
    name: 'CTA Split',
    category: 'cta',
    description: 'Split layout with text and image',
    preview: 'Build Something Amazing with side-by-side content.',
  },
  {
    id: 'cta-minimal',
    name: 'CTA Minimal',
    category: 'cta',
    description: 'Clean, minimal newsletter-style CTA',
    preview: 'Simple subscribe call-to-action.',
  },
  {
    id: 'cta-urgent',
    name: 'CTA Urgent',
    category: 'cta',
    description: 'Urgent offer with red/orange gradient',
    preview: 'Limited Time Offer! Get 50% off.',
  },
  // Mamba UI CTA Templates
  {
    id: 'mamba-cta-simple',
    name: 'Mamba Simple CTA',
    category: 'cta',
    description: 'Clean centered CTA with violet accent',
    preview: 'Build your next idea even faster.',
  },
  {
    id: 'mamba-cta-dark',
    name: 'Mamba Dark CTA',
    category: 'cta',
    description: 'Dark themed CTA with contrast buttons',
    preview: 'Figma ipsum component variant main layer.',
  },
  {
    id: 'mamba-cta-split-image',
    name: 'Mamba Split Image',
    category: 'cta',
    description: 'Two column layout with image and CTA',
    preview: 'Seize the opportunity with side image.',
  },
  {
    id: 'mamba-cta-banner',
    name: 'Mamba Banner CTA',
    category: 'cta',
    description: 'Full-width banner with inline button',
    preview: 'Get notified when we launch.',
  },
  {
    id: 'mamba-cta-card',
    name: 'Mamba Card CTA',
    category: 'cta',
    description: 'Elevated card style CTA with shadow',
    preview: 'Start your free trial today.',
  },
  {
    id: 'mamba-cta-gradient-border',
    name: 'Mamba Gradient Border',
    category: 'cta',
    description: 'CTA with gradient border accent',
    preview: 'Join thousands of developers.',
  },
];

// Template categories
export const TEMPLATE_CATEGORIES = [
  { id: 'cta', name: 'Call to Action', count: HYPERUI_TEMPLATES.filter(t => t.category === 'cta').length },
];

export function getTemplatesByCategory(category: string): TemplateData[] {
  if (category === 'all') {
    return HYPERUI_TEMPLATES;
  }
  return HYPERUI_TEMPLATES.filter(t => t.category === category);
}





