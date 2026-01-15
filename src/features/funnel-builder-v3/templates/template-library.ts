/**
 * Template Library for Funnel Builder
 * Pre-built templates for quick page building
 */

export interface Template {
  id: string;
  name: string;
  category: 'website' | 'checkout' | 'page';
  subcategory: string;
  thumbnail?: string;
  description: string;
  tags: string[];
  structure: any; // Will be the actual node structure
}

// Hero Section Templates
export const HERO_TEMPLATES: Template[] = [
  {
    id: 'hero-centered-1',
    name: 'Centered Hero with Image',
    category: 'website',
    subcategory: 'heroes',
    description: 'Clean centered hero with headline, description, and image below',
    tags: ['hero', 'centered', 'simple'],
    structure: {
      type: 'section',
      props: {
        background: '#ffffff',
        padding: { top: 80, bottom: 80, left: 20, right: 20 },
        maxWidth: 1200,
      },
      children: [{
        type: 'row',
        props: { gap: 16, verticalAlign: 'top' },
        children: [{
          type: 'column',
          props: { width: 'auto' },
          children: [
            {
              type: 'element',
              props: {
                kind: 'heading',
                content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Build Amazing Funnels That Convert' }] }] },
                fontSize: 48,
                textAlign: 'center',
                fontWeight: 700,
                color: '#111827',
              }
            },
            {
              type: 'element',
              props: {
                kind: 'paragraph',
                content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Create high-converting sales funnels, landing pages, and checkout experiences in minutes.' }] }] },
                fontSize: 18,
                textAlign: 'center',
                color: '#6B7280',
              }
            },
            {
              type: 'element',
              props: {
                kind: 'button',
                text: 'Get Started',
                href: '#',
                style: {
                  background: '#3B82F6',
                  color: '#ffffff',
                  paddingY: 14,
                  paddingX: 28,
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                },
              }
            }
          ]
        }]
      }]
    },
  },
  {
    id: 'hero-split-1',
    name: 'Split Hero with Image',
    category: 'website',
    subcategory: 'heroes',
    description: 'Two-column layout with content on left, image on right',
    tags: ['hero', 'split', 'two-column'],
    structure: {
      type: 'element',
      props: {
        kind: 'hero',
        layout: 'split',
        headline: 'Transform Your Business Today',
        description: 'The all-in-one platform for building high-converting funnels.',
        buttons: [
          { text: 'Start Free Trial', link: '#', style: 'primary' },
        ],
        image: {
          position: 'right',
        },
      },
    },
  },
  {
    id: 'hero-fullwidth-1',
    name: 'Full-Width Hero',
    category: 'website',
    subcategory: 'heroes',
    description: 'Full-screen hero with background video or image',
    tags: ['hero', 'fullwidth', 'video', 'dramatic'],
    structure: {
      type: 'element',
      props: {
        kind: 'hero',
        layout: 'full-width',
        headline: 'Welcome to the Future',
        description: 'Experience the next generation of funnel building.',
        buttons: [
          { text: 'Get Started', link: '#', style: 'primary' },
        ],
      },
    },
  },
];

// Navbar Templates
export const NAVBAR_TEMPLATES: Template[] = [
  {
    id: 'navbar-left-1',
    name: 'Left-Aligned Navbar',
    category: 'website',
    subcategory: 'navbars',
    description: 'Logo on left, menu in center, CTA on right',
    tags: ['navbar', 'left-aligned', 'standard'],
    structure: {
      type: 'element',
      props: {
        kind: 'navbar',
        layout: 'left-aligned',
        logo: { type: 'text', content: 'Brand' },
        menuItems: [
          { label: 'Home', link: '#', type: 'link' },
          { label: 'Features', link: '#', type: 'link' },
          { label: 'Pricing', link: '#', type: 'link' },
          { label: 'About', link: '#', type: 'link' },
        ],
        ctaButton: { text: 'Get Started', link: '#', style: 'primary' },
        sticky: true,
      },
    },
  },
  {
    id: 'navbar-centered-1',
    name: 'Centered Navbar',
    category: 'website',
    subcategory: 'navbars',
    description: 'Logo and menu centered, minimal design',
    tags: ['navbar', 'centered', 'minimal'],
    structure: {
      type: 'element',
      props: {
        kind: 'navbar',
        layout: 'centered',
        logo: { type: 'text', content: 'Brand' },
        menuItems: [
          { label: 'Home', link: '#', type: 'link' },
          { label: 'About', link: '#', type: 'link' },
          { label: 'Contact', link: '#', type: 'link' },
        ],
        sticky: true,
      },
    },
  },
];

// Footer Templates
export const FOOTER_TEMPLATES: Template[] = [
  {
    id: 'footer-multicolumn-1',
    name: 'Multi-Column Footer',
    category: 'website',
    subcategory: 'footers',
    description: 'Comprehensive footer with multiple link sections',
    tags: ['footer', 'multi-column', 'complete'],
    structure: {
      type: 'element',
      props: {
        kind: 'footer',
        layout: 'multi-column',
        logo: { type: 'text', content: 'Brand' },
        tagline: 'Building amazing experiences',
        linkSections: [
          {
            title: 'Product',
            links: [
              { label: 'Features', link: '#' },
              { label: 'Pricing', link: '#' },
              { label: 'Templates', link: '#' },
            ],
          },
          {
            title: 'Company',
            links: [
              { label: 'About', link: '#' },
              { label: 'Blog', link: '#' },
              { label: 'Careers', link: '#' },
            ],
          },
          {
            title: 'Support',
            links: [
              { label: 'Help Center', link: '#' },
              { label: 'Contact', link: '#' },
              { label: 'Status', link: '#' },
            ],
          },
        ],
        socialLinks: [
          { platform: 'facebook', url: '#' },
          { platform: 'twitter', url: '#' },
          { platform: 'instagram', url: '#' },
        ],
      },
    },
  },
  {
    id: 'footer-simple-1',
    name: 'Simple Footer',
    category: 'website',
    subcategory: 'footers',
    description: 'Minimal footer with logo and links',
    tags: ['footer', 'simple', 'minimal'],
    structure: {
      type: 'element',
      props: {
        kind: 'footer',
        layout: 'simple',
        logo: { type: 'text', content: 'Brand' },
        linkSections: [
          {
            title: 'Links',
            links: [
              { label: 'Privacy', link: '#' },
              { label: 'Terms', link: '#' },
              { label: 'Contact', link: '#' },
            ],
          },
        ],
      },
    },
  },
];

// Feature Section Templates
export const FEATURE_TEMPLATES: Template[] = [
  {
    id: 'features-grid-3col',
    name: '3-Column Feature Grid',
    category: 'website',
    subcategory: 'features',
    description: 'Three-column grid with icons and descriptions',
    tags: ['features', 'grid', '3-column'],
    structure: {
      type: 'element',
      props: {
        kind: 'feature-grid',
        title: 'Powerful Features',
        subtitle: 'Everything you need',
        columns: 3,
        iconStyle: 'solid',
        features: [
          { id: '1', icon: 'zap', title: 'Lightning Fast', description: 'Optimized for speed' },
          { id: '2', icon: 'shield', title: 'Secure', description: 'Bank-level security' },
          { id: '3', icon: 'rocket', title: 'Scalable', description: 'Grows with you' },
        ],
      },
    },
  },
];

// CTA Section Templates
export const CTA_TEMPLATES: Template[] = [
  {
    id: 'cta-centered-1',
    name: 'Centered CTA',
    category: 'website',
    subcategory: 'cta',
    description: 'Centered call-to-action with gradient background',
    tags: ['cta', 'centered', 'gradient'],
    structure: {
      type: 'element',
      props: {
        kind: 'cta-section',
        layout: 'centered',
        headline: 'Ready to Get Started?',
        description: 'Join thousands of satisfied customers today.',
        buttons: [
          { text: 'Start Free Trial', link: '#', style: 'primary' },
          { text: 'Contact Sales', link: '#', style: 'secondary' },
        ],
      },
    },
  },
];

// Checkout Flow Templates
export const CHECKOUT_TEMPLATES: Template[] = [
  {
    id: 'checkout-1step-simple',
    name: 'Simple 1-Step Checkout',
    category: 'checkout',
    subcategory: 'one-step',
    description: 'All checkout elements on one page',
    tags: ['checkout', '1-step', 'simple'],
    structure: {
      // This would be a full section with all checkout elements
      type: 'section',
      children: [
        // Contact, Products, Payment, Summary all in one section
      ],
    },
  },
  {
    id: 'checkout-2step-standard',
    name: 'Standard 2-Step Checkout',
    category: 'checkout',
    subcategory: 'two-step',
    description: 'Contact/Products on step 1, Payment on step 2',
    tags: ['checkout', '2-step', 'standard'],
    structure: {
      // Multi-step structure
    },
  },
];

// Export all templates
export const ALL_TEMPLATES = {
  website: {
    heroes: HERO_TEMPLATES,
    navbars: NAVBAR_TEMPLATES,
    footers: FOOTER_TEMPLATES,
    features: FEATURE_TEMPLATES,
    cta: CTA_TEMPLATES,
  },
  checkout: {
    oneStep: CHECKOUT_TEMPLATES.filter(t => t.subcategory === 'one-step'),
    twoStep: CHECKOUT_TEMPLATES.filter(t => t.subcategory === 'two-step'),
    threeStep: CHECKOUT_TEMPLATES.filter(t => t.subcategory === 'three-step'),
  },
};

export function getTemplateById(id: string): Template | undefined {
  const allTemplates = [
    ...HERO_TEMPLATES,
    ...NAVBAR_TEMPLATES,
    ...FOOTER_TEMPLATES,
    ...FEATURE_TEMPLATES,
    ...CTA_TEMPLATES,
    ...CHECKOUT_TEMPLATES,
  ];
  return allTemplates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string, subcategory?: string): Template[] {
  const allTemplates = [
    ...HERO_TEMPLATES,
    ...NAVBAR_TEMPLATES,
    ...FOOTER_TEMPLATES,
    ...FEATURE_TEMPLATES,
    ...CTA_TEMPLATES,
    ...CHECKOUT_TEMPLATES,
  ];
  
  return allTemplates.filter(t => {
    if (subcategory) {
      return t.category === category && t.subcategory === subcategory;
    }
    return t.category === category;
  });
}
