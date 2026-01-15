# Text Settings Inspector

A comprehensive, production-ready Text Settings Panel for the Funnel Builder v3, supporting Heading, Subheading, and Paragraph elements with full device responsiveness, presets, SEO/accessibility features, and advanced customization.

## Features

### 🎨 Complete Typography Controls
- Font family, weight, size, line height, letter spacing
- Text alignment, transform, and styling (bold, italic, underline, strike)
- Balance text for headings, hyphenation for paragraphs
- Wrap behavior controls

### 🎯 Device-Specific Overrides
- Desktop, Tablet, Mobile device toggle
- Per-device overrides for font size, line height, alignment, spacing
- Responsive font scaling for headings
- Mobile readability optimization for paragraphs

### 🎨 Color & Effects
- Text color with opacity control
- Highlight background for emphasis
- Text shadow with full controls (x, y, blur, color, opacity)
- Text stroke/outline for hero headings

### 📐 Spacing & Layout
- Visual box model for margin and padding
- Width modes (auto, full, custom)
- Max width with readability recommendations
- Block alignment
- Multi-column layout for paragraphs

### 🎭 Wrapper Styles
- Background color and border controls
- Corner radius slider
- Shadow presets (sm, md, lg, custom)
- "Use Site Styles" toggle for theme integration

### 👁️ Responsive & Visibility
- Hide on specific devices (Desktop/Tablet/Mobile)
- Responsive font scaling with viewport ranges
- Mobile readability suggestions

### 🔗 Actions & Links
- Block click actions (URL, scroll, popup, next step, form step)
- URL settings (new tab, nofollow, UTM passthrough)
- Inline link styling (color, underline, hover color)
- Click tracking integration

### ♿ SEO & Accessibility
- Semantic tag selection (H1-H6, P, Lead, Small)
- Heading structure warnings (multiple H1, skipped levels)
- ARIA label for clickable elements
- Language override support
- Best practices guidance

### ⚙️ Advanced Settings
- Custom CSS classes
- Data attributes editor
- Event tracking configuration
- Developer notes and helpers

### 🎁 Preset System
- Hero H1
- Section Title
- Eyebrow
- Lead Paragraph
- Body
- Quote

## File Structure

```
/src/features/funnel-builder-v3/inspector/text/
├── types.ts                          # TypeScript type definitions
├── defaults.ts                       # Default settings per subtype
├── presets.ts                        # Preset definitions
├── merge.ts                          # Device override merge logic
├── summaries.ts                      # Section summary generators
├── TextSettingsPanel.tsx             # Main orchestrator component
├── README.md                         # This file
├── components/
│   ├── InspectorHeader.tsx           # Header with device toggle, presets, actions
│   ├── PreviewStrip.tsx              # Live preview with edit button
│   ├── DeviceToggle.tsx              # Desktop/Tablet/Mobile toggle
│   ├── SectionHeaderSummary.tsx      # Compact section summaries
│   ├── SpacingPopover.tsx            # Visual box model editor
│   ├── ColorPicker.tsx               # Color picker component
│   └── DataAttrsEditor.tsx           # Key-value data attributes editor
├── sections/
│   ├── ContentSection.tsx            # Text content, semantic tag, line clamp
│   ├── TypographySection.tsx         # Font controls, alignment, styles
│   ├── ColorEffectsSection.tsx       # Colors, shadows, strokes
│   ├── SpacingLayoutSection.tsx      # Margin, padding, width, layout
│   ├── WrapperStyleSection.tsx       # Background, border, shadow
│   ├── ResponsiveVisibilitySection.tsx # Device visibility, responsive scaling
│   ├── ActionsLinksSection.tsx       # Click actions, link styles
│   ├── SeoAccessibilitySection.tsx   # SEO warnings, ARIA, best practices
│   └── AdvancedSection.tsx           # Classes, data attrs, tracking
├── adapter/
│   ├── useTextInspectorAdapter.ts    # Real store integration adapter
│   └── mockAdapter.ts                # Mock adapter for demos/testing
└── demo/
    └── TextInspectorDemoPage.tsx     # Standalone demo page
```

## Integration Guide

### Option 1: Use in Existing InspectorOpen

Replace the current TextPanel with the comprehensive TextSettingsPanel:

```tsx
// In InspectorOpen.tsx
import { TextSettingsPanel } from "../inspector/text/TextSettingsPanel";
import { useTextInspectorAdapter } from "../inspector/text/adapter/useTextInspectorAdapter";

// Inside the element panel rendering:
if (kind === "heading" || kind === "subheading" || kind === "paragraph") {
  const adapter = useTextInspectorAdapter(el);
  
  elementPanel = (
    <TextSettingsPanel
      {...adapter}
      breadcrumbs={breadcrumbs}
      seoWarnings={computeHeadingWarnings(tree, el)} // Optional
    />
  );
}
```

### Option 2: Standalone Usage

Use the TextSettingsPanel independently:

```tsx
import { TextSettingsPanel } from "./inspector/text/TextSettingsPanel";
import { getDefaultTextSettings } from "./inspector/text/defaults";

function MyComponent() {
  const [settings, setSettings] = useState(() => 
    getDefaultTextSettings("heading")
  );
  const [isEditing, setIsEditing] = useState(false);

  return (
    <TextSettingsPanel
      settings={settings}
      onChange={setSettings}
      onEditClick={() => setIsEditing(true)}
      isEditing={isEditing}
    />
  );
}
```

### Option 3: Demo Page

View the demo at `/funnel-builder-v3/inspector/text/demo`:

```tsx
import TextInspectorDemoPage from "./inspector/text/demo/TextInspectorDemoPage";

// Mount in your app router or pages
export default TextInspectorDemoPage;
```

## API Reference

### TextSettingsPanel Props

```typescript
interface TextSettingsPanelProps {
  settings: TextSettings;              // Current text settings
  onChange: (settings: TextSettings) => void;  // Settings change handler
  onEditClick: () => void;             // Edit button click handler
  isEditing: boolean;                  // Whether inline editing is active
  breadcrumbs?: Array<{ id: string; label: string }>;  // Navigation breadcrumbs
  onBreadcrumbClick?: (id: string) => void;  // Breadcrumb click handler
  onCollapse?: () => void;             // Collapse inspector handler
  seoWarnings?: string[];              // SEO/heading structure warnings
}
```

### TextSettings Type

See `types.ts` for the complete TextSettings interface. Key sections:

- `subtype`: "heading" | "subheading" | "paragraph"
- `semanticTag`: H1-H6, P, Lead, Small
- `content`: Text, placeholder, rich text mode, dynamic tokens
- `typography`: Font family, size, weight, line height, alignment, styles
- `colorEffects`: Color, opacity, highlight, shadow, stroke
- `layout`: Width, max width, margin, padding, display, overflow, columns, clamp
- `wrapper`: Background, border, radius, shadow, site styles
- `actions`: Block click action, link styles
- `responsive`: Hidden devices, responsive scaling, mobile readability
- `seoA11y`: ARIA label, language override
- `advanced`: Classes, data attributes, tracking
- `overrides`: Device-specific overrides (desktop/tablet/mobile)

### Utility Functions

```typescript
// Get effective settings for a device (merges overrides)
getEffectiveTextSettings(settings: TextSettings, device: Device): TextSettings

// Set a setting value (supports device overrides)
setTextSetting(settings: TextSettings, path: string, value: any, device?: Device): TextSettings

// Reset device overrides
resetDeviceOverride(settings: TextSettings, device: Device, pathPrefix?: string): TextSettings

// Check if a path has device override
hasDeviceOverride(settings: TextSettings, device: Device, path: string): boolean

// Compute section summaries
computeContentSummary(settings: TextSettings): string
computeTypographySummary(settings: TextSettings): string
// ... etc for all sections
```

## Customization

### Adding New Presets

Edit `presets.ts`:

```typescript
export const TEXT_PRESETS: PresetDefinition[] = [
  {
    id: "my-preset",
    name: "My Custom Preset",
    description: "Custom preset description",
    subtypes: ["heading", "subheading", "paragraph"],
    patch: {
      typography: {
        fontFamily: "Custom Font",
        fontSize: { value: 32, unit: "px" },
        // ... other settings
      },
    },
  },
  // ... existing presets
];
```

### Extending TextSettings

Add new properties to the TextSettings interface in `types.ts`, then update:
- `defaults.ts` - Add default values
- Relevant section component - Add UI controls
- `summaries.ts` - Update summary computation
- `merge.ts` - Ensure proper merging (if needed)

### Custom Validation

Add validation logic in section components or create a new `validation.ts` file:

```typescript
export function validateTextSettings(settings: TextSettings): string[] {
  const errors: string[] = [];
  
  if (settings.responsive.responsiveScale?.enabled) {
    if (settings.responsive.responsiveScale.minFontPx >= settings.responsive.responsiveScale.maxFontPx) {
      errors.push("Min font size must be less than max font size");
    }
  }
  
  return errors;
}
```

## Best Practices

1. **Always use device overrides for responsive design** - Don't create separate elements for different devices
2. **Use presets as starting points** - Apply a preset, then customize
3. **Follow heading hierarchy** - Use H1 once, don't skip levels
4. **Set max-width for paragraphs** - 640px is optimal for readability
5. **Provide ARIA labels for clickable text** - Improves accessibility
6. **Use semantic tags correctly** - H1-H6 for headings, P for paragraphs
7. **Test on all devices** - Use device toggle to verify responsive behavior

## TODOs / Future Enhancements

- [ ] Font family search/autocomplete with Google Fonts integration
- [ ] Advanced color picker with swatches and gradients
- [ ] Rich text editor integration (TipTap) for inline formatting
- [ ] Undo/redo support for settings changes
- [ ] Copy/paste styles between elements
- [ ] Export/import settings as JSON
- [ ] A/B testing variant support
- [ ] Animation/transition controls
- [ ] More preset templates
- [ ] Heading structure auto-fix suggestions

## License

Part of the Golden SaaS Funnel Builder v3 project.
