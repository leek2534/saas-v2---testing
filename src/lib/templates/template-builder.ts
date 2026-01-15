import { Section, Row, Column, Element } from '../../stubs/store';

// Helper to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Build template sections based on template ID
export function buildTemplate(templateId: string): Section {
  const templates: Record<string, () => Section> = {
    'hero-centered': buildHeroCentered,
    'hero-split': buildHeroSplit,
    'hero-gradient': buildHeroGradient,
    'hero-video': buildHeroVideo,
    'features-3-column': buildFeatures3Column,
    'features-4-column': buildFeatures4Column,
    'features-alternating': buildFeaturesAlternating,
    'features-grid': buildFeaturesGrid,
    'testimonials-3-column': buildTestimonials3Column,
    'testimonials-carousel': buildTestimonialsCarousel,
    'testimonials-grid': buildTestimonialsGrid,
    'cta-centered': buildCTACentered,
    'cta-split': buildCTASplit,
    'cta-with-form': buildCTAWithForm,
    'cta-banner': buildCTABanner,
    'pricing-3-tier': buildPricing3Tier,
    'pricing-2-tier': buildPricing2Tier,
    'pricing-table': buildPricingTable,
    'faq-single-column': buildFAQSingleColumn,
    'faq-2-column': buildFAQ2Column,
    'faq-categorized': buildFAQCategorized,
    'footer-simple': buildFooterSimple,
    'footer-4-column': buildFooter4Column,
    'footer-newsletter': buildFooterNewsletter,
  };

  const builder = templates[templateId];
  if (!builder) {
    throw new Error(`Template ${templateId} not found`);
  }

  return builder();
}

// HERO TEMPLATES

function buildHeroCentered(): Section {
  return {
    id: generateId(),
    name: 'Hero Centered',
    rows: [
      {
        id: generateId(),
        name: 'Hero Row',
        columns: [
          {
            id: generateId(),
            width: 100,
            elements: [
              {
                id: generateId(),
                type: 'heading',
                props: {
                  content: 'Build Something Amazing Today',
                  fontSize: 48,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 16,
                },
              },
              {
                id: generateId(),
                type: 'text',
                props: {
                  content: 'Create beautiful, responsive websites with our powerful drag-and-drop builder. No coding required.',
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#6B7280',
                  marginBottom: 32,
                },
              },
              {
                id: generateId(),
                type: 'button',
                props: {
                  text: 'Get Started',
                  backgroundColor: '#3B82F6',
                  textColor: '#ffffff',
                  paddingX: 32,
                  paddingY: 16,
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 'semibold',
                },
              },
            ],
          },
        ],
        paddingTop: 80,
        paddingBottom: 80,
      },
    ],
    props: {
      backgroundColor: '#ffffff',
    },
  };
}

function buildHeroSplit(): Section {
  return {
    id: generateId(),
    name: 'Hero Split',
    rows: [
      {
        id: generateId(),
        name: 'Hero Split Row',
        columns: [
          {
            id: generateId(),
            width: 50,
            elements: [
              {
                id: generateId(),
                type: 'heading',
                props: {
                  content: 'Transform Your Business',
                  fontSize: 42,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  color: '#111827',
                  marginBottom: 16,
                },
              },
              {
                id: generateId(),
                type: 'text',
                props: {
                  content: 'Join thousands of companies using our platform to grow their business and reach new customers.',
                  fontSize: 16,
                  textAlign: 'left',
                  color: '#6B7280',
                  marginBottom: 24,
                },
              },
              {
                id: generateId(),
                type: 'button',
                props: {
                  text: 'Start Free Trial',
                  backgroundColor: '#10B981',
                  textColor: '#ffffff',
                  paddingX: 28,
                  paddingY: 14,
                  borderRadius: 8,
                  fontSize: 16,
                },
              },
            ],
          },
          {
            id: generateId(),
            width: 50,
            elements: [
              {
                id: generateId(),
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
                  alt: 'Hero Image',
                  width: 100,
                  borderRadius: 12,
                },
              },
            ],
          },
        ],
        paddingTop: 60,
        paddingBottom: 60,
      },
    ],
    props: {
      backgroundColor: '#F9FAFB',
    },
  };
}

function buildHeroGradient(): Section {
  return {
    id: generateId(),
    name: 'Hero Gradient',
    rows: [
      {
        id: generateId(),
        name: 'Hero Content',
        columns: [
          {
            id: generateId(),
            width: 100,
            elements: [
              {
                id: generateId(),
                type: 'heading',
                props: {
                  content: 'Welcome to the Future',
                  fontSize: 56,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#ffffff',
                  marginBottom: 20,
                },
              },
              {
                id: generateId(),
                type: 'text',
                props: {
                  content: 'Experience the next generation of web design and development',
                  fontSize: 20,
                  textAlign: 'center',
                  color: '#E5E7EB',
                  marginBottom: 36,
                },
              },
              {
                id: generateId(),
                type: 'button',
                props: {
                  text: 'Explore Now',
                  backgroundColor: '#ffffff',
                  textColor: '#667EEA',
                  paddingX: 36,
                  paddingY: 16,
                  borderRadius: 9999,
                  fontSize: 16,
                  fontWeight: 'semibold',
                },
              },
            ],
          },
        ],
        paddingTop: 100,
        paddingBottom: 100,
      },
    ],
    props: {
      backgroundGradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { color: '#667EEA', position: 0 },
          { color: '#764BA2', position: 100 },
        ],
      },
    },
  };
}

function buildHeroVideo(): Section {
  return {
    id: generateId(),
    name: 'Hero with Video',
    rows: [
      {
        id: generateId(),
        name: 'Video Hero',
        columns: [
          {
            id: generateId(),
            width: 100,
            elements: [
              {
                id: generateId(),
                type: 'heading',
                props: {
                  content: 'Watch Our Story',
                  fontSize: 48,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#ffffff',
                  marginBottom: 24,
                },
              },
              {
                id: generateId(),
                type: 'video',
                props: {
                  url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  width: 80,
                  aspectRatio: '16:9',
                },
              },
            ],
          },
        ],
        paddingTop: 80,
        paddingBottom: 80,
        backgroundColor: '#1F2937',
      },
    ],
    props: {},
  };
}

// FEATURES TEMPLATES

function buildFeatures3Column(): Section {
  return {
    id: generateId(),
    name: '3 Column Features',
    rows: [
      {
        id: generateId(),
        name: 'Features Header',
        columns: [
          {
            id: generateId(),
            width: 100,
            elements: [
              {
                id: generateId(),
                type: 'heading',
                props: {
                  content: 'Powerful Features',
                  fontSize: 36,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 12,
                },
              },
              {
                id: generateId(),
                type: 'text',
                props: {
                  content: 'Everything you need to build amazing products',
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#6B7280',
                  marginBottom: 48,
                },
              },
            ],
          },
        ],
      },
      {
        id: generateId(),
        name: 'Features Grid',
        columns: [
          {
            id: generateId(),
            width: 33.33,
            elements: [
              {
                id: generateId(),
                type: 'icon',
                props: {
                  icon: 'Zap',
                  size: 40,
                  color: '#3B82F6',
                  marginBottom: 16,
                },
              },
              {
                id: generateId(),
                type: 'heading',
                props: {
                  content: 'Lightning Fast',
                  fontSize: 20,
                  fontWeight: 'semibold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 8,
                },
              },
              {
                id: generateId(),
                type: 'text',
                props: {
                  content: 'Optimized for speed and performance',
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#6B7280',
                },
              },
            ],
          },
          {
            id: generateId(),
            width: 33.33,
            elements: [
              {
                id: generateId(),
                type: 'icon',
                props: {
                  icon: 'Shield',
                  size: 40,
                  color: '#10B981',
                  marginBottom: 16,
                },
              },
              {
                id: generateId(),
                type: 'heading',
                props: {
                  content: 'Secure by Default',
                  fontSize: 20,
                  fontWeight: 'semibold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 8,
                },
              },
              {
                id: generateId(),
                type: 'text',
                props: {
                  content: 'Enterprise-grade security built in',
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#6B7280',
                },
              },
            ],
          },
          {
            id: generateId(),
            width: 33.33,
            elements: [
              {
                id: generateId(),
                type: 'icon',
                props: {
                  icon: 'Users',
                  size: 40,
                  color: '#8B5CF6',
                  marginBottom: 16,
                },
              },
              {
                id: generateId(),
                type: 'heading',
                props: {
                  content: 'Team Collaboration',
                  fontSize: 20,
                  fontWeight: 'semibold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 8,
                },
              },
              {
                id: generateId(),
                type: 'text',
                props: {
                  content: 'Work together seamlessly',
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#6B7280',
                },
              },
            ],
          },
        ],
        paddingTop: 20,
        paddingBottom: 80,
      },
    ],
    props: {
      backgroundColor: '#ffffff',
    },
  };
}

// Placeholder functions for other templates (implement similarly)
function buildFeatures4Column(): Section {
  const section = buildFeatures3Column();
  section.name = '4 Column Features';
  // Add 4th column to the grid row
  const gridRow = section.rows[1];
  gridRow.columns.forEach(col => col.width = 25);
  gridRow.columns.push({
    id: generateId(),
    width: 25,
    elements: [
      {
        id: generateId(),
        type: 'icon',
        props: { icon: 'Star', size: 40, color: '#F59E0B', marginBottom: 16 },
      },
      {
        id: generateId(),
        type: 'heading',
        props: { content: 'Premium Quality', fontSize: 20, fontWeight: 'semibold', textAlign: 'center', color: '#111827', marginBottom: 8 },
      },
      {
        id: generateId(),
        type: 'text',
        props: { content: 'Top-tier quality guaranteed', fontSize: 14, textAlign: 'center', color: '#6B7280' },
      },
    ],
  });
  return section;
}

function buildFeaturesAlternating(): Section {
  return {
    id: generateId(),
    name: 'Alternating Features',
    rows: [
      {
        id: generateId(),
        name: 'Feature 1',
        columns: [
          {
            id: generateId(),
            width: 50,
            elements: [
              {
                id: generateId(),
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
                  alt: 'Feature',
                  width: 100,
                  borderRadius: 12,
                },
              },
            ],
          },
          {
            id: generateId(),
            width: 50,
            elements: [
              {
                id: generateId(),
                type: 'heading',
                props: {
                  content: 'Advanced Analytics',
                  fontSize: 32,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  color: '#111827',
                  marginBottom: 16,
                },
              },
              {
                id: generateId(),
                type: 'text',
                props: {
                  content: 'Get deep insights into your business with our powerful analytics dashboard.',
                  fontSize: 16,
                  textAlign: 'left',
                  color: '#6B7280',
                  marginBottom: 20,
                },
              },
              {
                id: generateId(),
                type: 'button',
                props: {
                  text: 'Learn More',
                  backgroundColor: '#3B82F6',
                  textColor: '#ffffff',
                  paddingX: 24,
                  paddingY: 12,
                  borderRadius: 8,
                },
              },
            ],
          },
        ],
        paddingTop: 60,
        paddingBottom: 60,
      },
    ],
    props: {
      backgroundColor: '#F9FAFB',
    },
  };
}

function buildFeaturesGrid(): Section {
  const section = buildFeatures3Column();
  section.name = 'Feature Grid';
  // Duplicate the grid row to create 2x3 grid
  const gridRow = { ...section.rows[1], id: generateId() };
  section.rows.push(gridRow);
  return section;
}

// CTA TEMPLATES

function buildCTACentered(): Section {
  return {
    id: generateId(),
    name: 'Centered CTA',
    rows: [
      {
        id: generateId(),
        name: 'CTA Content',
        columns: [
          {
            id: generateId(),
            width: 100,
            elements: [
              {
                id: generateId(),
                type: 'heading',
                props: {
                  content: 'Ready to Get Started?',
                  fontSize: 42,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#ffffff',
                  marginBottom: 16,
                },
              },
              {
                id: generateId(),
                type: 'text',
                props: {
                  content: 'Join thousands of satisfied customers today',
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#E5E7EB',
                  marginBottom: 32,
                },
              },
              {
                id: generateId(),
                type: 'button',
                props: {
                  text: 'Start Your Free Trial',
                  backgroundColor: '#ffffff',
                  textColor: '#3B82F6',
                  paddingX: 32,
                  paddingY: 16,
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 'semibold',
                },
              },
            ],
          },
        ],
        paddingTop: 80,
        paddingBottom: 80,
      },
    ],
    props: {
      backgroundGradient: {
        type: 'linear',
        angle: 90,
        stops: [
          { color: '#3B82F6', position: 0 },
          { color: '#8B5CF6', position: 100 },
        ],
      },
    },
  };
}

// Simplified placeholder implementations for remaining templates
function buildCTASplit(): Section { return buildHeroSplit(); }
function buildCTAWithForm(): Section { return buildCTACentered(); }
function buildCTABanner(): Section { return buildCTACentered(); }
function buildTestimonials3Column(): Section { return buildFeatures3Column(); }
function buildTestimonialsCarousel(): Section { return buildHeroCentered(); }
function buildTestimonialsGrid(): Section { return buildFeatures3Column(); }
function buildPricing3Tier(): Section { return buildFeatures3Column(); }
function buildPricing2Tier(): Section { return buildHeroSplit(); }
function buildPricingTable(): Section { return buildFeatures3Column(); }
function buildFAQSingleColumn(): Section { return buildHeroCentered(); }
function buildFAQ2Column(): Section { return buildHeroSplit(); }
function buildFAQCategorized(): Section { return buildFeatures3Column(); }
function buildFooterSimple(): Section { return buildHeroCentered(); }
function buildFooter4Column(): Section { return buildFeatures4Column(); }
function buildFooterNewsletter(): Section { return buildCTACentered(); }
