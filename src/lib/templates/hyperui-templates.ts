import { Section, Row, Column, Element } from '../../stubs/store';

export interface HyperUITemplate {
  id: string;
  name: string;
  category: 'hero' | 'features' | 'testimonials' | 'cta' | 'about' | 'footer' | 'pricing' | 'faq';
  description: string;
  section: Omit<Section, 'id' | 'props'> & {
    backgroundColor?: string;
    backgroundGradient?: {
      type: 'linear' | 'radial';
      angle: number;
      stops: Array<{ color: string; position: number }>;
    };
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
  };
}

// Helper to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const HYPERUI_TEMPLATES: HyperUITemplate[] = [
  // HERO TEMPLATES
  {
    id: 'hero-centered',
    name: 'Hero Centered',
    category: 'hero',
    description: 'Centered hero section with heading, description, and CTA buttons',
    section: {
      name: 'Hero Section',
      backgroundColor: '#ffffff',
      paddingTop: 80,
      paddingBottom: 80,
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
                  content: 'Build Something Amazing Today',
                  fontSize: 48,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 16,
                },
                {
                  id: generateId(),
                  type: 'text',
                  content: 'Create beautiful, responsive websites with our powerful drag-and-drop builder. No coding required.',
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#6B7280',
                  marginBottom: 32,
                },
                {
                  id: generateId(),
                  type: 'button',
                  text: 'Get Started',
                  backgroundColor: '#3B82F6',
                  textColor: '#ffffff',
                  paddingX: 32,
                  paddingY: 16,
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 'semibold',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'hero-split',
    name: 'Hero Split',
    category: 'hero',
    description: 'Split hero with content on left and image on right',
    section: {
      name: 'Hero Split Section',
      backgroundColor: '#F9FAFB',
      paddingTop: 60,
      paddingBottom: 60,
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
                  content: 'Transform Your Business',
                  fontSize: 42,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  color: '#111827',
                  marginBottom: 16,
                },
                {
                  id: generateId(),
                  type: 'text',
                  content: 'Join thousands of companies using our platform to grow their business and reach new customers.',
                  fontSize: 16,
                  textAlign: 'left',
                  color: '#6B7280',
                  marginBottom: 24,
                },
                {
                  id: generateId(),
                  type: 'button',
                  text: 'Start Free Trial',
                  backgroundColor: '#10B981',
                  textColor: '#ffffff',
                  paddingX: 28,
                  paddingY: 14,
                  borderRadius: 8,
                  fontSize: 16,
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
                  src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
                  alt: 'Hero Image',
                  width: 100,
                  borderRadius: 12,
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'hero-gradient',
    name: 'Hero with Gradient',
    category: 'hero',
    description: 'Hero section with gradient background and centered content',
    section: {
      name: 'Hero Gradient Section',
      backgroundGradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { color: '#667EEA', position: 0 },
          { color: '#764BA2', position: 100 },
        ],
      },
      paddingTop: 100,
      paddingBottom: 100,
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
                  content: 'Welcome to the Future',
                  fontSize: 56,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#ffffff',
                  marginBottom: 20,
                },
                {
                  id: generateId(),
                  type: 'text',
                  content: 'Experience the next generation of web design and development',
                  fontSize: 20,
                  textAlign: 'center',
                  color: '#E5E7EB',
                  marginBottom: 36,
                },
                {
                  id: generateId(),
                  type: 'button',
                  text: 'Explore Now',
                  backgroundColor: '#ffffff',
                  textColor: '#667EEA',
                  paddingX: 36,
                  paddingY: 16,
                  borderRadius: 9999,
                  fontSize: 16,
                  fontWeight: 'semibold',
                },
              ],
            },
          ],
        },
      ],
    },
  },

  // FEATURES TEMPLATES
  {
    id: 'features-3-column',
    name: '3 Column Features',
    category: 'features',
    description: 'Three column feature grid with icons',
    section: {
      name: 'Features Section',
      backgroundColor: '#ffffff',
      paddingTop: 80,
      paddingBottom: 80,
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
                  content: 'Powerful Features',
                  fontSize: 36,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 12,
                },
                {
                  id: generateId(),
                  type: 'text',
                  content: 'Everything you need to build amazing products',
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#6B7280',
                  marginBottom: 48,
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
                  icon: 'Zap',
                  size: 40,
                  color: '#3B82F6',
                  marginBottom: 16,
                },
                {
                  id: generateId(),
                  type: 'heading',
                  content: 'Lightning Fast',
                  fontSize: 20,
                  fontWeight: 'semibold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 8,
                },
                {
                  id: generateId(),
                  type: 'text',
                  content: 'Optimized for speed and performance',
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#6B7280',
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
                  icon: 'Shield',
                  size: 40,
                  color: '#10B981',
                  marginBottom: 16,
                },
                {
                  id: generateId(),
                  type: 'heading',
                  content: 'Secure by Default',
                  fontSize: 20,
                  fontWeight: 'semibold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 8,
                },
                {
                  id: generateId(),
                  type: 'text',
                  content: 'Enterprise-grade security built in',
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#6B7280',
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
                  icon: 'Users',
                  size: 40,
                  color: '#8B5CF6',
                  marginBottom: 16,
                },
                {
                  id: generateId(),
                  type: 'heading',
                  content: 'Team Collaboration',
                  fontSize: 20,
                  fontWeight: 'semibold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 8,
                },
                {
                  id: generateId(),
                  type: 'text',
                  content: 'Work together seamlessly',
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#6B7280',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'features-alternating',
    name: 'Alternating Features',
    category: 'features',
    description: 'Features with alternating image and text layout',
    section: {
      name: 'Alternating Features',
      backgroundColor: '#F9FAFB',
      paddingTop: 80,
      paddingBottom: 80,
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
                  src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
                  alt: 'Feature 1',
                  width: 100,
                  borderRadius: 12,
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
                  content: 'Advanced Analytics',
                  fontSize: 32,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  color: '#111827',
                  marginBottom: 16,
                },
                {
                  id: generateId(),
                  type: 'text',
                  content: 'Get deep insights into your business with our powerful analytics dashboard. Track metrics that matter and make data-driven decisions.',
                  fontSize: 16,
                  textAlign: 'left',
                  color: '#6B7280',
                  marginBottom: 20,
                },
                {
                  id: generateId(),
                  type: 'button',
                  text: 'Learn More',
                  backgroundColor: '#3B82F6',
                  textColor: '#ffffff',
                  paddingX: 24,
                  paddingY: 12,
                  borderRadius: 8,
                  fontSize: 14,
                },
              ],
            },
          ],
        },
      ],
    },
  },

  // TESTIMONIALS TEMPLATES
  {
    id: 'testimonials-grid',
    name: 'Testimonials Grid',
    category: 'testimonials',
    description: 'Grid layout with customer testimonials',
    section: {
      name: 'Testimonials Section',
      backgroundColor: '#ffffff',
      paddingTop: 80,
      paddingBottom: 80,
      rows: [
        {
          id: generateId(),
          name: 'Testimonials Header',
          columns: [
            {
              id: generateId(),
              width: 100,
              elements: [
                {
                  id: generateId(),
                  type: 'heading',
                  content: 'What Our Customers Say',
                  fontSize: 36,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 48,
                },
              ],
            },
          ],
        },
        {
          id: generateId(),
          name: 'Testimonials Grid',
          columns: [
            {
              id: generateId(),
              width: 33.33,
              elements: [
                {
                  id: generateId(),
                  type: 'testimonial',
                  quote: 'This product has completely transformed how we work. Highly recommended!',
                  author: 'Sarah Johnson',
                  role: 'CEO, TechCorp',
                  rating: 5,
                },
              ],
            },
            {
              id: generateId(),
              width: 33.33,
              elements: [
                {
                  id: generateId(),
                  type: 'testimonial',
                  quote: 'Amazing support team and incredible features. Worth every penny.',
                  author: 'Michael Chen',
                  role: 'Founder, StartupXYZ',
                  rating: 5,
                },
              ],
            },
            {
              id: generateId(),
              width: 33.33,
              elements: [
                {
                  id: generateId(),
                  type: 'testimonial',
                  quote: 'The best investment we made this year. Our productivity has doubled.',
                  author: 'Emily Davis',
                  role: 'Director, BigCompany',
                  rating: 5,
                },
              ],
            },
          ],
        },
      ],
    },
  },

  // CTA TEMPLATES
  {
    id: 'cta-centered',
    name: 'Centered CTA',
    category: 'cta',
    description: 'Centered call-to-action with gradient background',
    section: {
      name: 'CTA Section',
      backgroundGradient: {
        type: 'linear',
        angle: 90,
        stops: [
          { color: '#3B82F6', position: 0 },
          { color: '#8B5CF6', position: 100 },
        ],
      },
      paddingTop: 80,
      paddingBottom: 80,
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
                  content: 'Ready to Get Started?',
                  fontSize: 42,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#ffffff',
                  marginBottom: 16,
                },
                {
                  id: generateId(),
                  type: 'text',
                  content: 'Join thousands of satisfied customers today',
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#E5E7EB',
                  marginBottom: 32,
                },
                {
                  id: generateId(),
                  type: 'button',
                  text: 'Start Your Free Trial',
                  backgroundColor: '#ffffff',
                  textColor: '#3B82F6',
                  paddingX: 32,
                  paddingY: 16,
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 'semibold',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'cta-with-form',
    name: 'CTA with Form',
    category: 'cta',
    description: 'Call-to-action with email capture form',
    section: {
      name: 'CTA Form Section',
      backgroundColor: '#F9FAFB',
      paddingTop: 60,
      paddingBottom: 60,
      rows: [
        {
          id: generateId(),
          name: 'CTA Form Row',
          columns: [
            {
              id: generateId(),
              width: 100,
              elements: [
                {
                  id: generateId(),
                  type: 'heading',
                  content: 'Subscribe to Our Newsletter',
                  fontSize: 32,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 12,
                },
                {
                  id: generateId(),
                  type: 'text',
                  content: 'Get the latest updates and exclusive offers',
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#6B7280',
                  marginBottom: 28,
                },
                {
                  id: generateId(),
                  type: 'form',
                  fields: [
                    { type: 'email', label: 'Email Address', placeholder: 'you@example.com', required: true },
                  ],
                  submitButtonText: 'Subscribe',
                  submitButtonColor: '#10B981',
                },
              ],
            },
          ],
        },
      ],
    },
  },

  // PRICING TEMPLATES
  {
    id: 'pricing-3-tier',
    name: '3-Tier Pricing',
    category: 'pricing',
    description: 'Three pricing tiers with featured plan',
    section: {
      name: 'Pricing Section',
      backgroundColor: '#ffffff',
      paddingTop: 80,
      paddingBottom: 80,
      rows: [
        {
          id: generateId(),
          name: 'Pricing Header',
          columns: [
            {
              id: generateId(),
              width: 100,
              elements: [
                {
                  id: generateId(),
                  type: 'heading',
                  content: 'Simple, Transparent Pricing',
                  fontSize: 36,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 12,
                },
                {
                  id: generateId(),
                  type: 'text',
                  content: 'Choose the plan that fits your needs',
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#6B7280',
                  marginBottom: 48,
                },
              ],
            },
          ],
        },
        {
          id: generateId(),
          name: 'Pricing Cards',
          columns: [
            {
              id: generateId(),
              width: 33.33,
              elements: [
                {
                  id: generateId(),
                  type: 'pricing',
                  plan: 'Starter',
                  price: '$29',
                  period: '/month',
                  features: ['10 Projects', '5GB Storage', 'Email Support', 'Basic Analytics'],
                  buttonText: 'Get Started',
                  buttonColor: '#6B7280',
                },
              ],
            },
            {
              id: generateId(),
              width: 33.33,
              elements: [
                {
                  id: generateId(),
                  type: 'pricing',
                  plan: 'Professional',
                  price: '$79',
                  period: '/month',
                  features: ['Unlimited Projects', '50GB Storage', 'Priority Support', 'Advanced Analytics', 'Custom Domain'],
                  buttonText: 'Get Started',
                  buttonColor: '#3B82F6',
                  featured: true,
                },
              ],
            },
            {
              id: generateId(),
              width: 33.33,
              elements: [
                {
                  id: generateId(),
                  type: 'pricing',
                  plan: 'Enterprise',
                  price: '$199',
                  period: '/month',
                  features: ['Unlimited Everything', '500GB Storage', '24/7 Phone Support', 'Custom Analytics', 'Dedicated Manager', 'SLA'],
                  buttonText: 'Contact Sales',
                  buttonColor: '#6B7280',
                },
              ],
            },
          ],
        },
      ],
    },
  },

  // FAQ TEMPLATES
  {
    id: 'faq-2-column',
    name: '2 Column FAQ',
    category: 'faq',
    description: 'Frequently asked questions in two columns',
    section: {
      name: 'FAQ Section',
      backgroundColor: '#F9FAFB',
      paddingTop: 80,
      paddingBottom: 80,
      rows: [
        {
          id: generateId(),
          name: 'FAQ Header',
          columns: [
            {
              id: generateId(),
              width: 100,
              elements: [
                {
                  id: generateId(),
                  type: 'heading',
                  content: 'Frequently Asked Questions',
                  fontSize: 36,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#111827',
                  marginBottom: 48,
                },
              ],
            },
          ],
        },
        {
          id: generateId(),
          name: 'FAQ Grid',
          columns: [
            {
              id: generateId(),
              width: 50,
              elements: [
                {
                  id: generateId(),
                  type: 'faq',
                  question: 'How do I get started?',
                  answer: 'Simply sign up for an account and follow our quick start guide. You\'ll be up and running in minutes.',
                },
                {
                  id: generateId(),
                  type: 'faq',
                  question: 'What payment methods do you accept?',
                  answer: 'We accept all major credit cards, PayPal, and bank transfers for enterprise customers.',
                },
              ],
            },
            {
              id: generateId(),
              width: 50,
              elements: [
                {
                  id: generateId(),
                  type: 'faq',
                  question: 'Can I cancel anytime?',
                  answer: 'Yes, you can cancel your subscription at any time. No questions asked.',
                },
                {
                  id: generateId(),
                  type: 'faq',
                  question: 'Do you offer refunds?',
                  answer: 'We offer a 30-day money-back guarantee on all plans. If you\'re not satisfied, we\'ll refund you in full.',
                },
              ],
            },
          ],
        },
      ],
    },
  },

  // FOOTER TEMPLATE
  {
    id: 'footer-simple',
    name: 'Simple Footer',
    category: 'footer',
    description: 'Clean footer with links and social icons',
    section: {
      name: 'Footer Section',
      backgroundColor: '#111827',
      paddingTop: 60,
      paddingBottom: 40,
      rows: [
        {
          id: generateId(),
          name: 'Footer Content',
          columns: [
            {
              id: generateId(),
              width: 100,
              elements: [
                {
                  id: generateId(),
                  type: 'heading',
                  content: 'Your Company',
                  fontSize: 24,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#ffffff',
                  marginBottom: 24,
                },
                {
                  id: generateId(),
                  type: 'text',
                  content: '© 2024 Your Company. All rights reserved.',
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#9CA3AF',
                  marginBottom: 16,
                },
                {
                  id: generateId(),
                  type: 'text',
                  content: 'Privacy Policy | Terms of Service | Contact Us',
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#9CA3AF',
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

// Helper function to get templates by category
export function getTemplatesByCategory(category: string): HyperUITemplate[] {
  return HYPERUI_TEMPLATES.filter(t => t.category === category);
}

// Helper function to get template by ID
export function getTemplateById(id: string): HyperUITemplate | undefined {
  return HYPERUI_TEMPLATES.find(t => t.id === id);
}
