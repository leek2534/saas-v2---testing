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
        props: { gap: 24, verticalAlign: 'top' },
        children: [{
          type: 'column',
          props: { width: 'auto', padding: { top: 0, bottom: 0, left: 0, right: 0 } },
          children: [
            {
              type: 'element',
              props: {
                kind: 'subheading',
                content: { 
                  type: 'doc', 
                  content: [{ 
                    type: 'paragraph', 
                    content: [{ type: 'text', text: 'THE COMPLETE SOLUTION' }] 
                  }] 
                },
                fontSize: 12,
                textAlign: 'center',
                fontWeight: 700,
                color: '#3B82F6',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                gapToNext: 16,
              }
            },
            {
              type: 'element',
              props: {
                kind: 'heading',
                content: { 
                  type: 'doc', 
                  content: [{ 
                    type: 'paragraph', 
                    content: [{ type: 'text', text: 'Build Amazing Funnels That Convert' }] 
                  }] 
                },
                fontSize: 56,
                textAlign: 'center',
                fontWeight: 800,
                color: '#111827',
                lineHeight: 1.1,
                gapToNext: 24,
              }
            },
            {
              type: 'element',
              props: {
                kind: 'paragraph',
                content: { 
                  type: 'doc', 
                  content: [{ 
                    type: 'paragraph', 
                    content: [{ type: 'text', text: 'Create high-converting sales funnels, landing pages, and checkout experiences in minutes. No coding required.' }] 
                  }] 
                },
                fontSize: 20,
                textAlign: 'center',
                color: '#6B7280',
                lineHeight: 1.6,
                maxWidth: 700,
                gapToNext: 32,
              }
            },
            {
              type: 'element',
              props: {
                kind: 'button',
                text: 'Get Started Free',
                href: '#',
                align: 'center',
                style: {
                  background: '#3B82F6',
                  color: '#ffffff',
                  paddingY: 16,
                  paddingX: 32,
                  borderRadius: 10,
                  fontSize: 18,
                  fontWeight: 600,
                  boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
                },
                gapToNext: 16,
              }
            },
            {
              type: 'element',
              props: {
                kind: 'button',
                text: 'Watch Demo',
                href: '#',
                align: 'center',
                style: {
                  background: 'transparent',
                  color: '#3B82F6',
                  paddingY: 16,
                  paddingX: 32,
                  borderRadius: 10,
                  fontSize: 18,
                  fontWeight: 600,
                  border: '2px solid #3B82F6',
                },
                gapToNext: 48,
              }
            },
            {
              type: 'element',
              props: {
                kind: 'image',
                src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
                alt: 'Dashboard Preview',
                maxWidth: 900,
                borderRadius: 16,
                objectFit: 'cover',
                aspectRatio: '16/9',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
      type: 'section',
      props: {
        background: '#f9fafb',
        padding: { top: 80, bottom: 80, left: 20, right: 20 },
        maxWidth: 1200,
      },
      children: [{
        type: 'row',
        props: { gap: 48, verticalAlign: 'center' },
        children: [
          {
            type: 'column',
            props: { width: '50%', padding: { top: 0, bottom: 0, left: 0, right: 24 } },
            children: [
              {
                type: 'element',
                props: {
                  kind: 'subheading',
                  content: { 
                    type: 'doc', 
                    content: [{ 
                      type: 'paragraph', 
                      content: [{ type: 'text', text: 'POWERFUL & SIMPLE' }] 
                    }] 
                  },
                  fontSize: 12,
                  textAlign: 'left',
                  fontWeight: 700,
                  color: '#3B82F6',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  gapToNext: 16,
                }
              },
              {
                type: 'element',
                props: {
                  kind: 'heading',
                  content: { 
                    type: 'doc', 
                    content: [{ 
                      type: 'paragraph', 
                      content: [{ type: 'text', text: 'Transform Your Business Today' }] 
                    }] 
                  },
                  fontSize: 48,
                  textAlign: 'left',
                  fontWeight: 800,
                  color: '#111827',
                  lineHeight: 1.1,
                  gapToNext: 20,
                }
              },
              {
                type: 'element',
                props: {
                  kind: 'paragraph',
                  content: { 
                    type: 'doc', 
                    content: [{ 
                      type: 'paragraph', 
                      content: [{ type: 'text', text: 'The all-in-one platform for building high-converting funnels. Launch faster, convert better, and grow your business with ease.' }] 
                    }] 
                  },
                  fontSize: 18,
                  textAlign: 'left',
                  color: '#6B7280',
                  lineHeight: 1.6,
                  gapToNext: 32,
                }
              },
              {
                type: 'element',
                props: {
                  kind: 'button',
                  text: 'Start Free Trial',
                  href: '#',
                  align: 'left',
                  style: {
                    background: '#3B82F6',
                    color: '#ffffff',
                    paddingY: 16,
                    paddingX: 32,
                    borderRadius: 10,
                    fontSize: 18,
                    fontWeight: 600,
                    boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
                  },
                }
              }
            ]
          },
          {
            type: 'column',
            props: { width: '50%', padding: { top: 0, bottom: 0, left: 24, right: 0 } },
            children: [
              {
                type: 'element',
                props: {
                  kind: 'image',
                  src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                  alt: 'Product Dashboard',
                  maxWidth: 600,
                  borderRadius: 16,
                  objectFit: 'cover',
                  aspectRatio: '4/3',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }
              }
            ]
          }
        ]
      }]
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
      type: 'section',
      props: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: { top: 120, bottom: 120, left: 20, right: 20 },
        maxWidth: 1400,
      },
      children: [{
        type: 'row',
        props: { gap: 24, verticalAlign: 'center' },
        children: [{
          type: 'column',
          props: { width: 'auto', padding: { top: 0, bottom: 0, left: 0, right: 0 } },
          children: [
            {
              type: 'element',
              props: {
                kind: 'heading',
                content: { 
                  type: 'doc', 
                  content: [{ 
                    type: 'paragraph', 
                    content: [{ type: 'text', text: 'Welcome to the Future' }] 
                  }] 
                },
                fontSize: 64,
                textAlign: 'center',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
                gapToNext: 24,
              }
            },
            {
              type: 'element',
              props: {
                kind: 'paragraph',
                content: { 
                  type: 'doc', 
                  content: [{ 
                    type: 'paragraph', 
                    content: [{ type: 'text', text: 'Experience the next generation of funnel building. Create stunning pages that convert visitors into customers.' }] 
                  }] 
                },
                fontSize: 22,
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6,
                maxWidth: 800,
                gapToNext: 40,
              }
            },
            {
              type: 'element',
              props: {
                kind: 'button',
                text: 'Get Started',
                href: '#',
                align: 'center',
                style: {
                  background: '#ffffff',
                  color: '#667eea',
                  paddingY: 18,
                  paddingX: 36,
                  borderRadius: 12,
                  fontSize: 20,
                  fontWeight: 700,
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
                },
              }
            }
          ]
        }]
      }]
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
