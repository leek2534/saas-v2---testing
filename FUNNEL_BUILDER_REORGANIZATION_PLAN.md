# Funnel Builder Reorganization Plan
## Scaling to Full Website Templates + Checkout Forms

---

## 🎯 Goal
Reorganize the funnel builder to efficiently support:
- **Website Templates** (Hero, Navbar, Footer, Features, Testimonials, etc.)
- **Checkout Forms** (Multi-step checkout elements)
- **Marketing Elements** (CTAs, Forms, Countdown timers, etc.)
- **Content Elements** (Text, Images, Videos, etc.)

---

## 📊 Current Structure Analysis

### **Current LeftSidebar Organization:**
```
Builder
├── Add Section
├── Add Row
├── Add Column
├── Elements (flat list)
│   ├── Heading
│   ├── Subheading
│   ├── Paragraph
│   ├── Button
│   ├── Image
│   ├── Video
│   ├── Checkout
│   └── Offer
└── Checkout Elements (separate section)
    ├── Steps
    ├── Contact
    ├── Products
    ├── Summary
    ├── Payment
    ├── Bump
    └── Button
```

### **Problems with Current Structure:**
1. ❌ Flat element list will become overwhelming with 50+ elements
2. ❌ No clear categorization (mixing content, checkout, marketing)
3. ❌ No template/block system for quick page building
4. ❌ Hard to find specific elements as library grows
5. ❌ No distinction between basic elements and complex components

---

## 🏗️ Proposed New Structure

### **Option A: Tabbed Categories (Recommended)**

```
┌─────────────────────────────────────┐
│  Builder                      [?]   │
├─────────────────────────────────────┤
│  Tabs: [Blocks] [Elements] [Layout]│
├─────────────────────────────────────┤
│                                     │
│  📦 BLOCKS TAB                      │
│  ├─ 🌐 Website Templates            │
│  │   ├─ Hero Sections (5 variants) │
│  │   ├─ Navbars (3 variants)       │
│  │   ├─ Footers (3 variants)       │
│  │   ├─ Feature Sections (4)       │
│  │   ├─ Testimonials (3)           │
│  │   ├─ Pricing Tables (3)         │
│  │   └─ CTA Sections (4)           │
│  │                                  │
│  ├─ 💳 Checkout Templates           │
│  │   ├─ 1-Step Checkout (3)        │
│  │   ├─ 2-Step Checkout (3)        │
│  │   └─ 3-Step Checkout (2)        │
│  │                                  │
│  └─ 📄 Page Templates               │
│      ├─ Landing Page                │
│      ├─ Sales Page                  │
│      ├─ Thank You Page              │
│      └─ Webinar Registration        │
│                                     │
│  🧩 ELEMENTS TAB                    │
│  ├─ 📝 Content                      │
│  │   ├─ Heading                     │
│  │   ├─ Subheading                  │
│  │   ├─ Paragraph                   │
│  │   ├─ List                        │
│  │   └─ Quote                       │
│  │                                  │
│  ├─ 📸 Media                        │
│  │   ├─ Image                       │
│  │   ├─ Video                       │
│  │   ├─ Gallery                     │
│  │   └─ Icon                        │
│  │                                  │
│  ├─ 💳 Checkout                     │
│  │   ├─ Steps Indicator             │
│  │   ├─ Contact Form                │
│  │   ├─ Product Selector            │
│  │   ├─ Order Summary               │
│  │   ├─ Payment Method              │
│  │   ├─ Order Bump                  │
│  │   └─ Checkout Button             │
│  │                                  │
│  ├─ 🎯 Marketing                    │
│  │   ├─ CTA Button                  │
│  │   ├─ Lead Form                   │
│  │   ├─ Countdown Timer             │
│  │   ├─ Social Proof                │
│  │   ├─ Testimonial Card            │
│  │   └─ Trust Badges                │
│  │                                  │
│  └─ 🎨 Design                       │
│      ├─ Divider                     │
│      ├─ Spacer                      │
│      ├─ Shape                       │
│      └─ Background Video            │
│                                     │
│  🏗️ LAYOUT TAB                      │
│  ├─ Add Section                     │
│  ├─ Add Row                         │
│  ├─ Add Column                      │
│  └─ Layout Presets                  │
│      ├─ 2 Columns (50/50)          │
│      ├─ 2 Columns (70/30)          │
│      ├─ 3 Columns Equal             │
│      └─ Sidebar Layout              │
└─────────────────────────────────────┘
```

### **Option B: Collapsible Accordion (Alternative)**

```
┌─────────────────────────────────────┐
│  Builder                      [?]   │
├─────────────────────────────────────┤
│                                     │
│  🏗️ Layout                      [▼] │
│  ├─ Add Section                     │
│  ├─ Add Row                         │
│  └─ Add Column                      │
│                                     │
│  📦 Templates & Blocks          [▼] │
│  ├─ 🌐 Website                      │
│  │   ├─ Hero Sections              │
│  │   ├─ Navbars                    │
│  │   └─ Footers                    │
│  ├─ 💳 Checkout                     │
│  │   ├─ 1-Step Checkout            │
│  │   ├─ 2-Step Checkout            │
│  │   └─ 3-Step Checkout            │
│  └─ 📄 Full Pages                   │
│                                     │
│  🧩 Elements                    [▼] │
│  ├─ 📝 Content                      │
│  ├─ 📸 Media                        │
│  ├─ 💳 Checkout                     │
│  ├─ 🎯 Marketing                    │
│  └─ 🎨 Design                       │
│                                     │
│  🔍 Search Elements...              │
└─────────────────────────────────────┘
```

---

## 🎨 Recommended Approach: **Hybrid System**

Combine the best of both:

```typescript
interface SidebarStructure {
  tabs: [
    {
      id: "blocks",
      label: "Blocks",
      icon: "Package",
      categories: [
        {
          id: "website",
          label: "Website",
          icon: "Globe",
          collapsible: true,
          defaultOpen: true,
          items: [
            { type: "template", id: "hero-1", preview: true },
            { type: "template", id: "navbar-1", preview: true },
            // ...
          ]
        },
        {
          id: "checkout",
          label: "Checkout",
          icon: "CreditCard",
          collapsible: true,
          items: [
            { type: "template", id: "checkout-1step", preview: true },
            // ...
          ]
        }
      ]
    },
    {
      id: "elements",
      label: "Elements",
      icon: "Blocks",
      searchable: true,
      categories: [
        {
          id: "content",
          label: "Content",
          collapsible: true,
          items: [
            { type: "element", kind: "heading" },
            { type: "element", kind: "paragraph" },
            // ...
          ]
        },
        // ...
      ]
    },
    {
      id: "layout",
      label: "Layout",
      icon: "Layout",
      items: [
        { type: "action", action: "addSection" },
        { type: "action", action: "addRow" },
        { type: "preset", id: "two-column-50-50" },
        // ...
      ]
    }
  ]
}
```

---

## 📁 File Structure Reorganization

### **Current:**
```
src/features/funnel-builder-v3/
├── elements/
│   ├── CheckoutFormMockup.tsx
│   ├── CheckoutPreview.tsx
│   └── checkout/
│       ├── CheckoutStepsMockup.tsx
│       ├── CheckoutContactMockup.tsx
│       └── ...
├── shell/
│   └── LeftSidebar.tsx
└── types/
    └── checkout-elements.ts
```

### **Proposed:**
```
src/features/funnel-builder-v3/
├── elements/
│   ├── content/          # Text, headings, paragraphs
│   │   ├── HeadingMockup.tsx
│   │   ├── HeadingRuntime.tsx
│   │   └── types.ts
│   │
│   ├── media/            # Images, videos, galleries
│   │   ├── ImageMockup.tsx
│   │   ├── ImageRuntime.tsx
│   │   └── types.ts
│   │
│   ├── checkout/         # Checkout elements
│   │   ├── mockups/
│   │   ├── runtime/
│   │   └── types.ts
│   │
│   ├── marketing/        # CTAs, forms, timers
│   │   ├── CTAButtonMockup.tsx
│   │   ├── LeadFormMockup.tsx
│   │   └── types.ts
│   │
│   └── design/           # Dividers, spacers, shapes
│       └── ...
│
├── templates/            # Pre-built blocks and pages
│   ├── website/
│   │   ├── heroes/
│   │   │   ├── Hero1.tsx
│   │   │   ├── Hero2.tsx
│   │   │   └── hero-configs.ts
│   │   ├── navbars/
│   │   ├── footers/
│   │   └── features/
│   │
│   ├── checkout/
│   │   ├── OneStepCheckout1.tsx
│   │   ├── TwoStepCheckout1.tsx
│   │   └── checkout-templates.ts
│   │
│   └── pages/
│       ├── LandingPage1.tsx
│       └── page-templates.ts
│
├── shell/
│   ├── LeftSidebar.tsx
│   ├── sidebar/
│   │   ├── BlocksTab.tsx
│   │   ├── ElementsTab.tsx
│   │   ├── LayoutTab.tsx
│   │   ├── CategorySection.tsx
│   │   └── ElementButton.tsx
│   └── ...
│
└── types/
    ├── elements.ts       # All element types
    ├── templates.ts      # Template definitions
    └── sidebar.ts        # Sidebar configuration types
```

---

## 🎯 Implementation Strategy

### **Phase 1: Reorganize Sidebar (Week 1)**
1. Create tabbed interface (Blocks, Elements, Layout)
2. Add collapsible category sections
3. Implement search functionality
4. Migrate existing elements to new structure

### **Phase 2: Website Template Elements (Week 2)**
1. Define hero section element types
2. Create navbar element types
3. Create footer element types
4. Build mockup components for each
5. Add to "Website" category

### **Phase 3: Template Block System (Week 3)**
1. Create template definition system
2. Build template preview thumbnails
3. Implement "Insert Template" functionality
4. Create 3-5 hero templates
5. Create 2-3 navbar templates
6. Create 2-3 footer templates

### **Phase 4: Marketing Elements (Week 4)**
1. CTA button variants
2. Lead capture forms
3. Countdown timers
4. Social proof widgets
5. Trust badges

### **Phase 5: Full Page Templates (Week 5)**
1. Landing page templates
2. Sales page templates
3. Thank you page templates
4. Webinar registration templates

---

## 🔧 Technical Implementation

### **1. Sidebar Configuration System**

```typescript
// src/features/funnel-builder-v3/config/sidebar-config.ts

export const SIDEBAR_CONFIG = {
  tabs: [
    {
      id: 'blocks',
      label: 'Blocks',
      icon: Package,
      categories: [
        {
          id: 'website',
          label: 'Website',
          icon: Globe,
          defaultOpen: true,
          subcategories: [
            {
              id: 'heroes',
              label: 'Hero Sections',
              templates: [
                {
                  id: 'hero-1',
                  name: 'Hero with Image',
                  thumbnail: '/templates/hero-1.png',
                  config: { /* template structure */ }
                },
                // ...
              ]
            },
            {
              id: 'navbars',
              label: 'Navigation Bars',
              templates: [/* ... */]
            },
            {
              id: 'footers',
              label: 'Footers',
              templates: [/* ... */]
            }
          ]
        },
        {
          id: 'checkout',
          label: 'Checkout',
          icon: CreditCard,
          templates: [/* ... */]
        }
      ]
    },
    {
      id: 'elements',
      label: 'Elements',
      icon: Blocks,
      searchable: true,
      categories: [
        {
          id: 'content',
          label: 'Content',
          icon: Type,
          elements: [
            { kind: 'heading', label: 'Heading', icon: Type },
            { kind: 'paragraph', label: 'Paragraph', icon: Type },
            // ...
          ]
        },
        {
          id: 'checkout',
          label: 'Checkout',
          icon: CreditCard,
          highlight: true, // Special styling
          elements: [
            { kind: 'checkout.steps', label: 'Steps', icon: BarChart3 },
            { kind: 'checkout.contact', label: 'Contact', icon: User },
            // ...
          ]
        }
      ]
    },
    {
      id: 'layout',
      label: 'Layout',
      icon: Layout,
      actions: [
        { type: 'addSection', label: 'Add Section', icon: LayoutTemplate },
        { type: 'addRow', label: 'Add Row', icon: Rows3 },
        { type: 'addColumn', label: 'Add Column', icon: Columns3 }
      ],
      presets: [
        { id: 'two-col-50-50', label: '2 Columns (50/50)' },
        // ...
      ]
    }
  ]
};
```

### **2. Template System**

```typescript
// src/features/funnel-builder-v3/types/templates.ts

export interface Template {
  id: string;
  name: string;
  category: 'website' | 'checkout' | 'page';
  subcategory?: string;
  thumbnail: string;
  description?: string;
  tags: string[];
  structure: {
    sections: SectionNode[];
  };
}

export interface TemplateLibrary {
  website: {
    heroes: Template[];
    navbars: Template[];
    footers: Template[];
    features: Template[];
    testimonials: Template[];
    pricing: Template[];
    cta: Template[];
  };
  checkout: {
    oneStep: Template[];
    twoStep: Template[];
    threeStep: Template[];
  };
  pages: {
    landing: Template[];
    sales: Template[];
    thankYou: Template[];
    webinar: Template[];
  };
}
```

### **3. New Element Types for Website Templates**

```typescript
// src/features/funnel-builder-v3/types/website-elements.ts

export type WebsiteElementKind =
  // Navigation
  | 'navbar'
  | 'navbar.logo'
  | 'navbar.menu'
  | 'navbar.cta'
  
  // Hero Sections
  | 'hero'
  | 'hero.headline'
  | 'hero.subheadline'
  | 'hero.cta'
  | 'hero.image'
  
  // Features
  | 'feature-grid'
  | 'feature-card'
  | 'feature-list'
  
  // Testimonials
  | 'testimonial'
  | 'testimonial-slider'
  | 'testimonial-grid'
  
  // Footer
  | 'footer'
  | 'footer.links'
  | 'footer.social'
  | 'footer.newsletter'
  
  // Pricing
  | 'pricing-table'
  | 'pricing-card'
  
  // CTA
  | 'cta-section'
  | 'cta-banner';

export interface NavbarProps {
  logo?: {
    type: 'text' | 'image';
    content: string;
    link?: string;
  };
  menuItems: Array<{
    label: string;
    link: string;
    type: 'link' | 'dropdown';
    children?: Array<{ label: string; link: string }>;
  }>;
  ctaButton?: {
    text: string;
    link: string;
    style: 'primary' | 'secondary' | 'outline';
  };
  sticky?: boolean;
  transparent?: boolean;
  appearance?: CheckoutAppearance;
}

export interface HeroProps {
  layout: 'centered' | 'left-aligned' | 'split' | 'full-width';
  headline: string;
  subheadline?: string;
  ctaButtons: Array<{
    text: string;
    link: string;
    style: 'primary' | 'secondary' | 'outline';
  }>;
  image?: {
    src: string;
    alt: string;
    position: 'right' | 'left' | 'background';
  };
  backgroundVideo?: string;
  appearance?: CheckoutAppearance;
}

// ... more element types
```

---

## 🎨 UI/UX Improvements

### **Search Functionality**
```typescript
// Add search bar at top of Elements tab
<Input 
  placeholder="Search elements..." 
  onChange={handleSearch}
  icon={<Search />}
/>
```

### **Template Preview Modal**
```typescript
// When clicking a template, show preview modal
<TemplatePreviewModal
  template={selectedTemplate}
  onInsert={handleInsertTemplate}
  onCustomize={handleCustomizeTemplate}
/>
```

### **Drag & Drop from Templates**
- Drag template thumbnail directly onto canvas
- Shows preview outline while dragging
- Inserts full template structure on drop

### **Favorites System**
- Star frequently used elements/templates
- "Favorites" category at top
- Persisted to user preferences

---

## 📊 Benefits of New Structure

### **For Users:**
✅ **Faster page building** - Insert full hero section in 1 click vs building from scratch
✅ **Better organization** - Find elements quickly with categories
✅ **Professional templates** - Pre-designed blocks that look great
✅ **Flexibility** - Still have granular control with individual elements
✅ **Learning curve** - Templates show best practices

### **For Development:**
✅ **Scalability** - Can add 100+ elements without cluttering UI
✅ **Maintainability** - Clear file structure and organization
✅ **Reusability** - Template system reduces code duplication
✅ **Extensibility** - Easy to add new categories and templates
✅ **Testing** - Isolated components are easier to test

---

## 🚀 Quick Start Implementation

### **Step 1: Create Tabbed Sidebar**
```bash
# New files to create:
src/features/funnel-builder-v3/shell/sidebar/
├── SidebarTabs.tsx
├── BlocksTab.tsx
├── ElementsTab.tsx
├── LayoutTab.tsx
└── CategorySection.tsx
```

### **Step 2: Define Configuration**
```bash
src/features/funnel-builder-v3/config/
├── sidebar-config.ts
├── element-categories.ts
└── template-library.ts
```

### **Step 3: Create First Templates**
```bash
src/features/funnel-builder-v3/templates/website/heroes/
├── Hero1.tsx          # Centered with image
├── Hero2.tsx          # Split layout
├── Hero3.tsx          # Full-width background
└── hero-configs.ts    # Template definitions
```

---

## 📝 Next Steps

1. **Review and approve** this reorganization plan
2. **Choose approach**: Tabbed (recommended) vs Accordion vs Hybrid
3. **Prioritize categories**: Which templates to build first?
4. **Design templates**: Create mockups for hero, navbar, footer variants
5. **Implement Phase 1**: Reorganize sidebar with tabs and categories

---

*This reorganization will transform the funnel builder into a powerful website builder while maintaining the specialized checkout functionality.*
