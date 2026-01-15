# Premium Video Settings Panel

A comprehensive, conversion-focused video settings panel for the Funnel Builder with 8 organized sections, device overrides, provider-aware features, and built-in guardrails.

## 📁 File Structure

```
video/
├── types.ts                          # Complete TypeScript definitions
├── capabilities.ts                   # Provider feature support matrix
├── utils.ts                          # Utilities (time parsing, validation, merging)
├── VideoSettingsPanel.tsx           # Main panel composition
├── components/
│   ├── PreviewStrip.tsx             # Video preview with status indicators
│   ├── DeviceToggle.tsx             # Desktop/Tablet/Mobile switcher
│   ├── SectionHeaderSummary.tsx     # Compact accordion summaries
│   ├── SpacingPopover.tsx           # Margin/padding controls
│   └── pickers/
│       ├── ElementPicker.tsx        # Element selector (stub)
│       ├── SectionPicker.tsx        # Section selector (stub)
│       └── PopupPicker.tsx          # Popup selector (stub)
└── sections/
    ├── SourceSection.tsx            # Provider, URL, poster, aspect ratio
    ├── PlaybackSection.tsx          # Autoplay, muted, loop, timing
    ├── ControlsSection.tsx          # Controls, click behavior, UX
    ├── LayoutStyleSection.tsx       # Width, alignment, spacing, styling
    ├── ActionsSection.tsx           # On-end actions, overlay CTA
    ├── TrackingSection.tsx          # Milestones, analytics, anti-abuse
    ├── AdvancedSection.tsx          # Performance, sticky player, watch gating
    └── AccessibilitySection.tsx     # Labels, captions, reduced motion
```

## 🎯 Features

### 8 Organized Sections

1. **Source** - Provider selection, URL/upload/embed, poster, aspect ratio, fallback
2. **Playback** - Autoplay, muted, loop, timing, speed, reduced motion
3. **Controls & UX** - Show controls, click behavior, fullscreen, PiP
4. **Layout & Style** - Width, alignment, spacing, fit mode, border, shadow
5. **Actions** - On-end actions, overlay CTA, click actions
6. **Tracking** - Milestones (25/50/75/100%), labels, destinations, anti-abuse
7. **Advanced** - Performance, compliance, sticky mini-player, watch gating
8. **Accessibility** - Labels, captions, reduced motion preferences

### Provider Support

- **YouTube** - Full support with no-cookie mode
- **Vimeo** - Full support with DNT option
- **Wistia** - Full support with download protection
- **MP4 URL** - Native HTML5 with all features
- **Upload** - File upload with full control
- **Embed Code** - Custom embeds (limited settings)

### Smart Guardrails

- **Autoplay + Muted** - Automatically enforces muted when autoplay is enabled
- **Loop Conflict** - Warns when loop is enabled with on-end actions
- **Usability Check** - Alerts when controls are off and no click behavior
- **Mobile Recommendations** - Suggests disabling autoplay on mobile
- **Accessibility Warnings** - Prompts for labels when controls are hidden

### Device Overrides (Foundation)

- Device toggle with override indicators
- Desktop / Tablet / Mobile specific settings
- Merge function for effective settings per device

## 🚀 Integration

### Current Integration

The panel is already integrated into your funnel builder:

```typescript
// /shell/panels/VideoPanel.tsx
import { VideoSettingsPanel } from "./video/VideoSettingsPanel";

export function VideoPanel({ node }: { node: ElementNode }) {
  return <VideoSettingsPanel node={node} />;
}
```

### Settings Storage

Video settings are stored in `node.props.videoSettings` as a complete `VideoSettings` object:

```typescript
interface VideoSettings {
  source: VideoSource;
  playback: PlaybackSettings;
  controls: ControlsSettings;
  layout: LayoutStyleSettings;
  actions: ActionsSettings;
  tracking: TrackingSettings;
  advanced: AdvancedSettings;
  accessibility: AccessibilitySettings;
}
```

### Accessing Settings

```typescript
// Get settings from node
const settings = node.props.videoSettings as VideoSettings;

// Get effective settings for a device (with overrides)
import { getEffectiveVideoSettings } from './utils';
const effectiveSettings = getEffectiveVideoSettings(
  settings,
  node.props.deviceOverrides,
  'mobile'
);
```

## 📝 Usage Examples

### Basic Video Setup

```typescript
const defaultSettings = getDefaultVideoSettings();
// Returns sensible defaults:
// - Provider: YouTube
// - Autoplay: OFF
// - Controls: ON
// - Lazy load: ON
// - Tracking: ON with all milestones
```

### Provider Detection

```typescript
import { detectProviderFromUrl } from './capabilities';

const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const provider = detectProviderFromUrl(url); // 'youtube'
```

### Validation

```typescript
import { validateVideoSettings } from './utils';

const validation = validateVideoSettings(settings, 'youtube');
if (!validation.valid) {
  console.error('Errors:', validation.errors);
}
if (validation.warnings.length > 0) {
  console.warn('Warnings:', validation.warnings);
}
```

### Time Parsing

```typescript
import { parseTime, formatTime } from './utils';

const seconds = parseTime("1:30"); // 90
const formatted = formatTime(90); // "1:30"
```

## 🎨 UI Components

### PreviewStrip

Shows video preview with provider badge and status:
- ✅ Loaded
- ⏳ Loading
- ⚠️ Blocked (consent/cookies)
- ❌ Error

### DeviceToggle

Switches between Desktop/Tablet/Mobile with override indicators (orange dots).

### SectionHeaderSummary

Displays compact summaries in accordion headers:
- Playback: "Autoplay off • Controls on • Loop off"
- Layout: "Full width • 16:9 • 12px radius"

### SpacingPopover

Popover with margin/padding controls for all sides.

## 🔧 Customization

### Adding New Providers

1. Add provider to `VideoProvider` type in `types.ts`
2. Add capabilities to `PROVIDER_CAPABILITIES` in `capabilities.ts`
3. Add detection logic to `detectProviderFromUrl` in `capabilities.ts`
4. Update `SourceSection` UI if needed

### Adding New Actions

1. Add action type to `ActionType` in `types.ts`
2. Update `ActionsSection` to handle new action
3. Add picker component if needed

### Extending Settings

1. Add new fields to appropriate interface in `types.ts`
2. Update corresponding section component
3. Update `getDefaultVideoSettings` in `utils.ts`
4. Update validation if needed

## 🎯 TODO / Future Enhancements

### High Priority
- [ ] Connect ElementPicker to actual element tree
- [ ] Connect SectionPicker to actual section tree
- [ ] Connect PopupPicker to actual popup tree
- [ ] Implement file upload for videos and captions
- [ ] Implement preset system (Standard Embed, Hero Background, etc.)
- [ ] Add consent manager integration

### Medium Priority
- [ ] Device override UI (currently foundation only)
- [ ] Custom shadow configuration
- [ ] Color picker component
- [ ] Video thumbnail generation
- [ ] Bulk settings copy/paste

### Low Priority
- [ ] A/B testing integration
- [ ] Advanced analytics dashboard
- [ ] Video heatmaps
- [ ] Engagement scoring

## 📊 Provider Capabilities Matrix

| Feature | YouTube | Vimeo | Wistia | MP4 | Upload | Embed |
|---------|---------|-------|--------|-----|--------|-------|
| Autoplay | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Start/End Time | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Speed Control | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Picture-in-Picture | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Captions Upload | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Privacy Mode | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Disable Download | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Requires Consent | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## 🐛 Known Issues

1. **Picker Components** - Currently use mock data. Need to connect to actual store.
2. **Upload Flow** - File upload UI is placeholder. Needs backend integration.
3. **Device Overrides** - Foundation is built but full UI not implemented.
4. **Preset System** - Types defined but application logic not implemented.

## 📚 Related Files

- `/renderer/nodes/Element.tsx` - Video element rendering
- `/store/store.ts` - Funnel editor state management
- `/shell/RightSettingsPanel.tsx` - Panel routing

## 💡 Best Practices

1. **Always validate settings** before saving
2. **Use provider capabilities** to show/hide features
3. **Provide clear warnings** for conflicts (autoplay+unmuted, loop+actions)
4. **Default to accessible** settings (controls on, reduced motion respected)
5. **Track everything** for conversion optimization

## 🎓 Learning Resources

- [YouTube Player API](https://developers.google.com/youtube/iframe_api_reference)
- [Vimeo Player API](https://developer.vimeo.com/player/sdk)
- [Wistia Player API](https://wistia.com/support/developers/player-api)
- [HTML5 Video](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [WCAG Video Guidelines](https://www.w3.org/WAI/media/av/)

---

**Built with ❤️ for conversion-focused funnel builders**
