// Simplified HyperUI templates that work with the test builder store structure

export interface TemplateData {
  id: string;
  name: string;
  category: 'hero' | 'features' | 'testimonials' | 'cta' | 'pricing' | 'faq' | 'footer';
  description: string;
  preview: string; // Preview description
}

export const HYPERUI_TEMPLATES: TemplateData[] = [
  // HERO TEMPLATES
  {
    id: 'hero-centered',
    name: 'Hero Centered',
    category: 'hero',
    description: 'Centered hero with heading, description, and CTA',
    preview: 'Large heading, subtitle, and call-to-action button centered on page',
  },
  {
    id: 'hero-split',
    name: 'Hero Split',
    category: 'hero',
    description: 'Content on left, image on right',
    preview: 'Two-column layout with text content and image side by side',
  },
  {
    id: 'hero-gradient',
    name: 'Hero Gradient Background',
    category: 'hero',
    description: 'Hero with colorful gradient background',
    preview: 'Eye-catching gradient background with white text overlay',
  },
  {
    id: 'hero-video',
    name: 'Hero with Video',
    category: 'hero',
    description: 'Full-width hero with background video',
    preview: 'Video background with overlay text and CTA',
  },

  // FEATURES TEMPLATES
  {
    id: 'features-3-column',
    name: '3 Column Features',
    category: 'features',
    description: 'Three feature cards with icons',
    preview: 'Grid of three features with icons, titles, and descriptions',
  },
  {
    id: 'features-4-column',
    name: '4 Column Features',
    category: 'features',
    description: 'Four feature cards in a row',
    preview: 'Four features displayed in a single row with icons',
  },
  {
    id: 'features-alternating',
    name: 'Alternating Features',
    category: 'features',
    description: 'Features with alternating image/text layout',
    preview: 'Image and text alternate sides for each feature',
  },
  {
    id: 'features-grid',
    name: 'Feature Grid',
    category: 'features',
    description: '2x3 grid of features',
    preview: 'Six features in a grid layout with icons',
  },

  // TESTIMONIALS TEMPLATES
  {
    id: 'testimonials-3-column',
    name: '3 Column Testimonials',
    category: 'testimonials',
    description: 'Three customer testimonials side by side',
    preview: 'Three testimonial cards with quotes and customer info',
  },
  {
    id: 'testimonials-carousel',
    name: 'Testimonial Carousel',
    category: 'testimonials',
    description: 'Rotating testimonial slider',
    preview: 'Single large testimonial with navigation arrows',
  },
  {
    id: 'testimonials-grid',
    name: 'Testimonial Grid',
    category: 'testimonials',
    description: '2x2 grid of testimonials',
    preview: 'Four testimonials in a grid layout',
  },

  // CTA TEMPLATES
  {
    id: 'cta-centered',
    name: 'Centered CTA',
    category: 'cta',
    description: 'Centered call-to-action with gradient',
    preview: 'Bold CTA with gradient background and large button',
  },
  {
    id: 'cta-split',
    name: 'Split CTA',
    category: 'cta',
    description: 'CTA with image on side',
    preview: 'Two-column CTA with text and image',
  },
  {
    id: 'cta-with-form',
    name: 'CTA with Email Form',
    category: 'cta',
    description: 'Newsletter signup CTA',
    preview: 'Email capture form with heading and description',
  },
  {
    id: 'cta-banner',
    name: 'CTA Banner',
    category: 'cta',
    description: 'Full-width banner CTA',
    preview: 'Thin banner with text and button',
  },

  // PRICING TEMPLATES
  {
    id: 'pricing-3-tier',
    name: '3-Tier Pricing',
    category: 'pricing',
    description: 'Three pricing plans with featured option',
    preview: 'Three pricing cards with features and CTA buttons',
  },
  {
    id: 'pricing-2-tier',
    name: '2-Tier Pricing',
    category: 'pricing',
    description: 'Two pricing options side by side',
    preview: 'Simple two-plan comparison',
  },
  {
    id: 'pricing-table',
    name: 'Pricing Comparison Table',
    category: 'pricing',
    description: 'Detailed feature comparison table',
    preview: 'Table comparing features across plans',
  },

  // FAQ TEMPLATES
  {
    id: 'faq-single-column',
    name: 'Single Column FAQ',
    category: 'faq',
    description: 'Stacked FAQ items',
    preview: 'Vertical list of expandable FAQ items',
  },
  {
    id: 'faq-2-column',
    name: '2 Column FAQ',
    category: 'faq',
    description: 'FAQs in two columns',
    preview: 'FAQ items split into two columns',
  },
  {
    id: 'faq-categorized',
    name: 'Categorized FAQ',
    category: 'faq',
    description: 'FAQs grouped by category',
    preview: 'FAQ sections with category headers',
  },

  // FOOTER TEMPLATES
  {
    id: 'footer-simple',
    name: 'Simple Footer',
    category: 'footer',
    description: 'Basic footer with links',
    preview: 'Company name, copyright, and links',
  },
  {
    id: 'footer-4-column',
    name: '4 Column Footer',
    category: 'footer',
    description: 'Footer with four link columns',
    preview: 'Four columns of footer links with social icons',
  },
  {
    id: 'footer-newsletter',
    name: 'Footer with Newsletter',
    category: 'footer',
    description: 'Footer with email signup',
    preview: 'Footer with newsletter subscription form',
  },
];

// Get templates by category
export function getTemplatesByCategory(category: string): TemplateData[] {
  return HYPERUI_TEMPLATES.filter(t => t.category === category);
}

// Get template by ID
export function getTemplateById(id: string): TemplateData | undefined {
  return HYPERUI_TEMPLATES.find(t => t.id === id);
}

// Template categories for navigation
export const TEMPLATE_CATEGORIES = [
  { id: 'hero', label: 'Hero Sections', icon: 'Layout', count: 4 },
  { id: 'features', label: 'Features', icon: 'Zap', count: 4 },
  { id: 'testimonials', label: 'Testimonials', icon: 'MessageSquare', count: 3 },
  { id: 'cta', label: 'Call to Action', icon: 'Target', count: 4 },
  { id: 'pricing', label: 'Pricing', icon: 'DollarSign', count: 3 },
  { id: 'faq', label: 'FAQ', icon: 'HelpCircle', count: 3 },
  { id: 'footer', label: 'Footer', icon: 'Layers', count: 3 },
];
