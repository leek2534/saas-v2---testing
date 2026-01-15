import type { FunnelTemplate } from './template-types';

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const templateLibrary: FunnelTemplate[] = [
  // 1. PRESSURE WASHING - Local Business
  {
    id: 'pressure-washing-pro',
    name: 'Pressure Washing Pro',
    description: 'Professional pressure washing service landing page with before/after gallery and instant quote form',
    category: 'local-business',
    thumbnail: '/templates/pressure-washing.png',
    previewImages: ['/templates/pressure-washing-1.png'],
    tags: ['local-business', 'home-services', 'cleaning'],
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#10b981',
    },
    featured: true,
    sections: [
      {
        id: generateId('section'),
        name: 'Hero Section',
        rows: [
          {
            id: generateId('row'),
            name: 'Hero Row',
            columns: [
              {
                id: generateId('column'),
                width: 100,
                elements: [
                  {
                    id: generateId('element'),
                    type: 'heading',
                    name: 'Main Headline',
                    props: {
                      text: '<h1>Transform Your Property with Professional Pressure Washing</h1>',
                      tag: 'h1',
                      fontSize: 48,
                      fontWeight: '700',
                      textColor: '#1e293b',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'text',
                    props: {
                      text: '<p>Get a sparkling clean exterior in hours, not days. Professional pressure washing services for homes and businesses.</p>',
                      fontSize: 18,
                      textColor: '#64748b',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'button',
                    props: {
                      text: 'Get Free Quote',
                      backgroundColor: '#10b981',
                      textColor: '#ffffff',
                      fontSize: 18,
                      paddingX: 32,
                      paddingY: 16,
                      borderRadius: 8,
                    },
                  },
                ],
              },
            ],
          },
        ],
        props: {
          backgroundColor: '#f8fafc',
          paddingTop: 80,
          paddingBottom: 80,
        },
      },
      {
        id: generateId('section'),
        name: 'Services Section',
        rows: [
          {
            id: generateId('row'),
            name: 'Services Row',
            columns: [
              {
                id: generateId('column'),
                width: 33.33,
                elements: [
                  {
                    id: generateId('element'),
                    type: 'icon',
                    props: {
                      icon: 'home',
                      size: 48,
                      color: '#3b82f6',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'heading',
                    props: {
                      text: '<h3>Residential</h3>',
                      tag: 'h3',
                      fontSize: 24,
                      fontWeight: '600',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'text',
                    props: {
                      text: '<p>Driveways, patios, siding, and more</p>',
                      fontSize: 16,
                      textColor: '#64748b',
                    },
                  },
                ],
              },
              {
                id: generateId('column'),
                width: 33.33,
                elements: [
                  {
                    id: generateId('element'),
                    type: 'icon',
                    props: {
                      icon: 'building',
                      size: 48,
                      color: '#3b82f6',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'heading',
                    props: {
                      text: '<h3>Commercial</h3>',
                      tag: 'h3',
                      fontSize: 24,
                      fontWeight: '600',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'text',
                    props: {
                      text: '<p>Storefronts, parking lots, buildings</p>',
                      fontSize: 16,
                      textColor: '#64748b',
                    },
                  },
                ],
              },
              {
                id: generateId('column'),
                width: 33.33,
                elements: [
                  {
                    id: generateId('element'),
                    type: 'icon',
                    props: {
                      icon: 'zap',
                      size: 48,
                      color: '#3b82f6',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'heading',
                    props: {
                      text: '<h3>Emergency</h3>',
                      tag: 'h3',
                      fontSize: 24,
                      fontWeight: '600',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'text',
                    props: {
                      text: '<p>24/7 emergency cleaning services</p>',
                      fontSize: 16,
                      textColor: '#64748b',
                    },
                  },
                ],
              },
            ],
          },
        ],
        props: {
          backgroundColor: '#ffffff',
          paddingTop: 60,
          paddingBottom: 60,
        },
      },
    ],
    createdAt: new Date(),
  },

  // 2. NUTRITION COACH - Health & Wellness
  {
    id: 'nutrition-coach',
    name: 'Nutrition Coach',
    description: 'Clean and modern nutrition coaching landing page with meal plans and transformation stories',
    category: 'health-wellness',
    thumbnail: '/templates/nutrition.png',
    previewImages: ['/templates/nutrition-1.png'],
    tags: ['health', 'wellness', 'coaching', 'nutrition'],
    colorScheme: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#f59e0b',
    },
    featured: true,
    sections: [
      {
        id: generateId('section'),
        name: 'Hero Section',
        rows: [
          {
            id: generateId('row'),
            name: 'Hero Row',
            columns: [
              {
                id: generateId('column'),
                width: 100,
                elements: [
                  {
                    id: generateId('element'),
                    type: 'heading',
                    props: {
                      text: '<h1>Transform Your Health with Personalized Nutrition</h1>',
                      tag: 'h1',
                      fontSize: 48,
                      fontWeight: '700',
                      textColor: '#065f46',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'text',
                    props: {
                      text: '<p>Get a custom meal plan designed for your goals, lifestyle, and preferences.</p>',
                      fontSize: 18,
                      textColor: '#047857',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'button',
                    props: {
                      text: 'Start Your Journey',
                      backgroundColor: '#10b981',
                      textColor: '#ffffff',
                      fontSize: 18,
                      paddingX: 32,
                      paddingY: 16,
                      borderRadius: 8,
                    },
                  },
                ],
              },
            ],
          },
        ],
        props: {
          backgroundColor: '#ecfdf5',
          paddingTop: 80,
          paddingBottom: 80,
        },
      },
    ],
    createdAt: new Date(),
  },

  // 3. VIDEO PRODUCER - Creative Services
  {
    id: 'video-producer-dark',
    name: 'Video Producer Dark',
    description: 'Sleek dark-themed portfolio for video producers and content creators',
    category: 'agency',
    thumbnail: '/templates/video-producer.png',
    previewImages: ['/templates/video-producer-1.png'],
    tags: ['video', 'production', 'creative', 'portfolio'],
    colorScheme: {
      primary: '#000000',
      secondary: '#1f2937',
      accent: '#f59e0b',
    },
    featured: true,
    sections: [
      {
        id: generateId('section'),
        name: 'Hero Section',
        rows: [
          {
            id: generateId('row'),
            name: 'Hero Row',
            columns: [
              {
                id: generateId('column'),
                width: 100,
                elements: [
                  {
                    id: generateId('element'),
                    type: 'heading',
                    props: {
                      text: '<h1>Cinematic Stories That Captivate</h1>',
                      tag: 'h1',
                      fontSize: 56,
                      fontWeight: '700',
                      textColor: '#ffffff',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'text',
                    props: {
                      text: '<p>Award-winning video production for brands that want to stand out.</p>',
                      fontSize: 20,
                      textColor: '#d1d5db',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'button',
                    props: {
                      text: 'View Portfolio',
                      backgroundColor: '#f59e0b',
                      textColor: '#000000',
                      fontSize: 18,
                      paddingX: 32,
                      paddingY: 16,
                      borderRadius: 8,
                    },
                  },
                ],
              },
            ],
          },
        ],
        props: {
          backgroundColor: '#000000',
          paddingTop: 100,
          paddingBottom: 100,
        },
      },
    ],
    createdAt: new Date(),
  },

  // 4. FINANCIAL CONSULTANT - Professional Services
  {
    id: 'financial-consultant',
    name: 'Financial Consultant',
    description: 'Professional and trustworthy financial consulting landing page',
    category: 'professional-services',
    thumbnail: '/templates/financial.png',
    previewImages: ['/templates/financial-1.png'],
    tags: ['finance', 'consulting', 'professional', 'business'],
    colorScheme: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#3b82f6',
    },
    sections: [
      {
        id: generateId('section'),
        name: 'Hero Section',
        rows: [
          {
            id: generateId('row'),
            name: 'Hero Row',
            columns: [
              {
                id: generateId('column'),
                width: 100,
                elements: [
                  {
                    id: generateId('element'),
                    type: 'heading',
                    props: {
                      text: '<h1>Secure Your Financial Future</h1>',
                      tag: 'h1',
                      fontSize: 48,
                      fontWeight: '700',
                      textColor: '#1e3a8a',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'text',
                    props: {
                      text: '<p>Expert financial planning and wealth management services tailored to your goals.</p>',
                      fontSize: 18,
                      textColor: '#475569',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'button',
                    props: {
                      text: 'Schedule Consultation',
                      backgroundColor: '#1e40af',
                      textColor: '#ffffff',
                      fontSize: 18,
                      paddingX: 32,
                      paddingY: 16,
                      borderRadius: 8,
                    },
                  },
                ],
              },
            ],
          },
        ],
        props: {
          backgroundColor: '#eff6ff',
          paddingTop: 80,
          paddingBottom: 80,
        },
      },
    ],
    createdAt: new Date(),
  },

  // 5. EYELASH SALON - Beauty Services
  {
    id: 'eyelash-salon-pink',
    name: 'Eyelash Salon',
    description: 'Elegant beauty salon landing page with booking system',
    category: 'beauty-salon',
    thumbnail: '/templates/eyelash.png',
    previewImages: ['/templates/eyelash-1.png'],
    tags: ['beauty', 'salon', 'eyelash', 'booking'],
    colorScheme: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#f472b6',
    },
    featured: true,
    sections: [
      {
        id: generateId('section'),
        name: 'Hero Section',
        rows: [
          {
            id: generateId('row'),
            name: 'Hero Row',
            columns: [
              {
                id: generateId('column'),
                width: 100,
                elements: [
                  {
                    id: generateId('element'),
                    type: 'heading',
                    props: {
                      text: '<h1>Enhance Your Natural Beauty</h1>',
                      tag: 'h1',
                      fontSize: 48,
                      fontWeight: '700',
                      textColor: '#831843',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'text',
                    props: {
                      text: '<p>Professional eyelash extensions and eyebrow services by certified specialists.</p>',
                      fontSize: 18,
                      textColor: '#9f1239',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'button',
                    props: {
                      text: 'Book Appointment',
                      backgroundColor: '#ec4899',
                      textColor: '#ffffff',
                      fontSize: 18,
                      paddingX: 32,
                      paddingY: 16,
                      borderRadius: 8,
                    },
                  },
                ],
              },
            ],
          },
        ],
        props: {
          backgroundColor: '#fdf2f8',
          paddingTop: 80,
          paddingBottom: 80,
        },
      },
    ],
    createdAt: new Date(),
  },

  // 6. SOCIAL MEDIA INFLUENCER - Personal Brand
  {
    id: 'social-media-influencer',
    name: 'Social Media Influencer',
    description: 'Modern influencer landing page with social proof and collaboration options',
    category: 'agency',
    thumbnail: '/templates/influencer.png',
    previewImages: ['/templates/influencer-1.png'],
    tags: ['influencer', 'social-media', 'personal-brand', 'marketing'],
    colorScheme: {
      primary: '#eab308',
      secondary: '#ca8a04',
      accent: '#365314',
    },
    sections: [
      {
        id: generateId('section'),
        name: 'Hero Section',
        rows: [
          {
            id: generateId('row'),
            name: 'Hero Row',
            columns: [
              {
                id: generateId('column'),
                width: 100,
                elements: [
                  {
                    id: generateId('element'),
                    type: 'heading',
                    props: {
                      text: '<h1>Your Partner for Social Media Success</h1>',
                      tag: 'h1',
                      fontSize: 48,
                      fontWeight: '700',
                      textColor: '#365314',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'text',
                    props: {
                      text: '<p>Helping brands reach millions through authentic content and strategic partnerships.</p>',
                      fontSize: 18,
                      textColor: '#4d7c0f',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'button',
                    props: {
                      text: 'Collaborate With Me',
                      backgroundColor: '#eab308',
                      textColor: '#000000',
                      fontSize: 18,
                      paddingX: 32,
                      paddingY: 16,
                      borderRadius: 8,
                    },
                  },
                ],
              },
            ],
          },
        ],
        props: {
          backgroundColor: '#fefce8',
          paddingTop: 80,
          paddingBottom: 80,
        },
      },
    ],
    createdAt: new Date(),
  },

  // 7. REAL ESTATE AGENT - Real Estate
  {
    id: 'real-estate-modern',
    name: 'Real Estate Modern',
    description: 'Contemporary real estate landing page with property listings',
    category: 'real-estate',
    thumbnail: '/templates/real-estate.png',
    previewImages: ['/templates/real-estate-1.png'],
    tags: ['real-estate', 'property', 'listings', 'agent'],
    colorScheme: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#3b82f6',
    },
    sections: [
      {
        id: generateId('section'),
        name: 'Hero Section',
        rows: [
          {
            id: generateId('row'),
            name: 'Hero Row',
            columns: [
              {
                id: generateId('column'),
                width: 100,
                elements: [
                  {
                    id: generateId('element'),
                    type: 'heading',
                    props: {
                      text: '<h1>Find Your Dream Home</h1>',
                      tag: 'h1',
                      fontSize: 48,
                      fontWeight: '700',
                      textColor: '#0f172a',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'text',
                    props: {
                      text: '<p>Expert real estate services for buyers and sellers in your area.</p>',
                      fontSize: 18,
                      textColor: '#475569',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'button',
                    props: {
                      text: 'View Properties',
                      backgroundColor: '#3b82f6',
                      textColor: '#ffffff',
                      fontSize: 18,
                      paddingX: 32,
                      paddingY: 16,
                      borderRadius: 8,
                    },
                  },
                ],
              },
            ],
          },
        ],
        props: {
          backgroundColor: '#f8fafc',
          paddingTop: 80,
          paddingBottom: 80,
        },
      },
    ],
    createdAt: new Date(),
  },

  // 8. SAAS PRODUCT - SaaS
  {
    id: 'saas-modern',
    name: 'Modern SaaS',
    description: 'Clean SaaS product landing page with feature highlights and pricing',
    category: 'saas',
    thumbnail: '/templates/saas.png',
    previewImages: ['/templates/saas-1.png'],
    tags: ['saas', 'software', 'product', 'tech'],
    colorScheme: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#8b5cf6',
    },
    featured: true,
    sections: [
      {
        id: generateId('section'),
        name: 'Hero Section',
        rows: [
          {
            id: generateId('row'),
            name: 'Hero Row',
            columns: [
              {
                id: generateId('column'),
                width: 100,
                elements: [
                  {
                    id: generateId('element'),
                    type: 'heading',
                    props: {
                      text: '<h1>Streamline Your Workflow</h1>',
                      tag: 'h1',
                      fontSize: 56,
                      fontWeight: '700',
                      textColor: '#312e81',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'text',
                    props: {
                      text: '<p>The all-in-one platform to manage your projects, team, and clients.</p>',
                      fontSize: 20,
                      textColor: '#4338ca',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'button',
                    props: {
                      text: 'Start Free Trial',
                      backgroundColor: '#6366f1',
                      textColor: '#ffffff',
                      fontSize: 18,
                      paddingX: 32,
                      paddingY: 16,
                      borderRadius: 8,
                    },
                  },
                ],
              },
            ],
          },
        ],
        props: {
          backgroundColor: '#eef2ff',
          paddingTop: 100,
          paddingBottom: 100,
        },
      },
    ],
    createdAt: new Date(),
  },

  // 9. E-COMMERCE STORE - E-commerce
  {
    id: 'ecommerce-minimal',
    name: 'E-commerce Minimal',
    description: 'Minimalist e-commerce product page with clean design',
    category: 'ecommerce',
    thumbnail: '/templates/ecommerce.png',
    previewImages: ['/templates/ecommerce-1.png'],
    tags: ['ecommerce', 'shop', 'product', 'store'],
    colorScheme: {
      primary: '#000000',
      secondary: '#404040',
      accent: '#10b981',
    },
    sections: [
      {
        id: generateId('section'),
        name: 'Hero Section',
        rows: [
          {
            id: generateId('row'),
            name: 'Hero Row',
            columns: [
              {
                id: generateId('column'),
                width: 100,
                elements: [
                  {
                    id: generateId('element'),
                    type: 'heading',
                    props: {
                      text: '<h1>Premium Quality, Everyday Prices</h1>',
                      tag: 'h1',
                      fontSize: 48,
                      fontWeight: '700',
                      textColor: '#000000',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'text',
                    props: {
                      text: '<p>Shop our curated collection of sustainable, high-quality products.</p>',
                      fontSize: 18,
                      textColor: '#404040',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'button',
                    props: {
                      text: 'Shop Now',
                      backgroundColor: '#000000',
                      textColor: '#ffffff',
                      fontSize: 18,
                      paddingX: 32,
                      paddingY: 16,
                      borderRadius: 8,
                    },
                  },
                ],
              },
            ],
          },
        ],
        props: {
          backgroundColor: '#ffffff',
          paddingTop: 80,
          paddingBottom: 80,
        },
      },
    ],
    createdAt: new Date(),
  },

  // 10. LIFE COACH - Coaching
  {
    id: 'life-coach-inspiring',
    name: 'Life Coach Inspiring',
    description: 'Inspiring life coaching landing page with transformation stories',
    category: 'coaching',
    thumbnail: '/templates/life-coach.png',
    previewImages: ['/templates/life-coach-1.png'],
    tags: ['coaching', 'life-coach', 'personal-development', 'transformation'],
    colorScheme: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#f59e0b',
    },
    sections: [
      {
        id: generateId('section'),
        name: 'Hero Section',
        rows: [
          {
            id: generateId('row'),
            name: 'Hero Row',
            columns: [
              {
                id: generateId('column'),
                width: 100,
                elements: [
                  {
                    id: generateId('element'),
                    type: 'heading',
                    props: {
                      text: '<h1>Unlock Your Full Potential</h1>',
                      tag: 'h1',
                      fontSize: 48,
                      fontWeight: '700',
                      textColor: '#581c87',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'text',
                    props: {
                      text: '<p>Transform your life with personalized coaching and proven strategies.</p>',
                      fontSize: 18,
                      textColor: '#6b21a8',
                      alignment: 'center',
                    },
                  },
                  {
                    id: generateId('element'),
                    type: 'button',
                    props: {
                      text: 'Start Your Transformation',
                      backgroundColor: '#8b5cf6',
                      textColor: '#ffffff',
                      fontSize: 18,
                      paddingX: 32,
                      paddingY: 16,
                      borderRadius: 8,
                    },
                  },
                ],
              },
            ],
          },
        ],
        props: {
          backgroundColor: '#faf5ff',
          paddingTop: 80,
          paddingBottom: 80,
        },
      },
    ],
    createdAt: new Date(),
  },
];

// Helper functions
export function getTemplateById(id: string): FunnelTemplate | undefined {
  return templateLibrary.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): FunnelTemplate[] {
  if (category === 'all') return templateLibrary;
  return templateLibrary.filter(t => t.category === category);
}

export function getFeaturedTemplates(): FunnelTemplate[] {
  return templateLibrary.filter(t => t.featured);
}

export function searchTemplates(query: string): FunnelTemplate[] {
  const lowerQuery = query.toLowerCase();
  return templateLibrary.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
