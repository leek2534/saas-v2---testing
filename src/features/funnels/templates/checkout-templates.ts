/**
 * Checkout Page Templates
 * Pre-designed page layouts for checkout steps
 */

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: 'checkout' | 'sales' | 'optin' | 'thankyou' | 'upsell';
  thumbnail?: string;
  tree: any; // EditorTree structure
}

export const checkoutTemplates: PageTemplate[] = [
  {
    id: 'checkout-classic',
    name: 'Classic Checkout',
    description: 'Traditional two-column layout with product summary',
    category: 'checkout',
    tree: {
      pageRootIds: ['section_1'],
      nodes: {
        section_1: {
          id: 'section_1',
          type: 'element',
          parentId: null,
          props: {
            kind: 'section',
            style: {
              backgroundColor: '#f9fafb',
              padding: '60px 20px',
            },
          },
        },
        container_1: {
          id: 'container_1',
          type: 'element',
          parentId: 'section_1',
          props: {
            kind: 'container',
            maxWidth: '1200px',
          },
        },
        row_1: {
          id: 'row_1',
          type: 'element',
          parentId: 'container_1',
          props: {
            kind: 'row',
          },
        },
        col_left: {
          id: 'col_left',
          type: 'element',
          parentId: 'row_1',
          props: {
            kind: 'column',
            width: '60%',
          },
        },
        col_right: {
          id: 'col_right',
          type: 'element',
          parentId: 'row_1',
          props: {
            kind: 'column',
            width: '40%',
          },
        },
        heading_1: {
          id: 'heading_1',
          type: 'element',
          parentId: 'col_left',
          props: {
            kind: 'heading',
            level: 1,
            text: 'Complete Your Order',
            style: {
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '24px',
            },
          },
        },
        checkout_block: {
          id: 'checkout_block',
          type: 'element',
          parentId: 'col_left',
          props: {
            kind: 'funnel.checkout',
          },
        },
        summary_heading: {
          id: 'summary_heading',
          type: 'element',
          parentId: 'col_right',
          props: {
            kind: 'heading',
            level: 2,
            text: 'Order Summary',
            style: {
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '16px',
            },
          },
        },
        trust_badges: {
          id: 'trust_badges',
          type: 'element',
          parentId: 'col_right',
          props: {
            kind: 'text',
            text: '🔒 Secure Checkout\n✓ 30-Day Money Back Guarantee\n✓ 24/7 Customer Support',
            style: {
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280',
            },
          },
        },
      },
      popups: {},
    },
  },
  {
    id: 'checkout-minimal',
    name: 'Minimal Checkout',
    description: 'Clean, centered single-column layout',
    category: 'checkout',
    tree: {
      pageRootIds: ['section_1'],
      nodes: {
        section_1: {
          id: 'section_1',
          type: 'element',
          parentId: null,
          props: {
            kind: 'section',
            style: {
              backgroundColor: '#ffffff',
              padding: '80px 20px',
            },
          },
        },
        container_1: {
          id: 'container_1',
          type: 'element',
          parentId: 'section_1',
          props: {
            kind: 'container',
            maxWidth: '600px',
          },
        },
        heading_1: {
          id: 'heading_1',
          type: 'element',
          parentId: 'container_1',
          props: {
            kind: 'heading',
            level: 1,
            text: 'Secure Checkout',
            style: {
              fontSize: '36px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '40px',
            },
          },
        },
        checkout_block: {
          id: 'checkout_block',
          type: 'element',
          parentId: 'container_1',
          props: {
            kind: 'funnel.checkout',
          },
        },
        guarantee: {
          id: 'guarantee',
          type: 'element',
          parentId: 'container_1',
          props: {
            kind: 'text',
            text: '✓ 100% Secure & Encrypted\n✓ 30-Day Money Back Guarantee',
            style: {
              fontSize: '14px',
              textAlign: 'center',
              color: '#6b7280',
              marginTop: '32px',
            },
          },
        },
      },
      popups: {},
    },
  },
  {
    id: 'checkout-premium',
    name: 'Premium Checkout',
    description: 'High-converting layout with social proof and urgency',
    category: 'checkout',
    tree: {
      pageRootIds: ['section_hero', 'section_checkout', 'section_guarantee'],
      nodes: {
        section_hero: {
          id: 'section_hero',
          type: 'element',
          parentId: null,
          props: {
            kind: 'section',
            style: {
              backgroundColor: '#1f2937',
              color: '#ffffff',
              padding: '40px 20px',
              textAlign: 'center',
            },
          },
        },
        hero_heading: {
          id: 'hero_heading',
          type: 'element',
          parentId: 'section_hero',
          props: {
            kind: 'heading',
            level: 1,
            text: 'You\'re One Step Away!',
            style: {
              fontSize: '40px',
              fontWeight: 'bold',
              marginBottom: '16px',
            },
          },
        },
        hero_subheading: {
          id: 'hero_subheading',
          type: 'element',
          parentId: 'section_hero',
          props: {
            kind: 'text',
            text: 'Join 10,000+ happy customers',
            style: {
              fontSize: '18px',
              opacity: '0.9',
            },
          },
        },
        section_checkout: {
          id: 'section_checkout',
          type: 'element',
          parentId: null,
          props: {
            kind: 'section',
            style: {
              backgroundColor: '#f9fafb',
              padding: '60px 20px',
            },
          },
        },
        checkout_container: {
          id: 'checkout_container',
          type: 'element',
          parentId: 'section_checkout',
          props: {
            kind: 'container',
            maxWidth: '800px',
          },
        },
        checkout_block: {
          id: 'checkout_block',
          type: 'element',
          parentId: 'checkout_container',
          props: {
            kind: 'funnel.checkout',
          },
        },
        section_guarantee: {
          id: 'section_guarantee',
          type: 'element',
          parentId: null,
          props: {
            kind: 'section',
            style: {
              backgroundColor: '#ffffff',
              padding: '40px 20px',
              textAlign: 'center',
            },
          },
        },
        guarantee_text: {
          id: 'guarantee_text',
          type: 'element',
          parentId: 'section_guarantee',
          props: {
            kind: 'text',
            text: '🔒 256-bit SSL Encryption\n✓ 30-Day Money Back Guarantee\n✓ 24/7 Priority Support',
            style: {
              fontSize: '16px',
              lineHeight: '2',
              color: '#374151',
            },
          },
        },
      },
      popups: {},
    },
  },
];
