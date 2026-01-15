# Funnel Builder v3 – Improvements Drop-in Package

This folder contains a **drop-in implementation** of the improvements we discussed:

## What's included

### Hover model (hover path)
- Single hover path object: `{ sectionId, rowId, columnId, elementId }`
- Priority: **element > row > section** (see `resolveHoverLayer()`)

### Overlay system (no nested outlines)
- DOM registry maps `nodeId -> HTMLElement`
- A fixed overlay layer renders:
  - row outline (green)
  - element outline (orange)
  - selection outline (dark)

### Column resizing
- Resize handles render **between columns** of the active row.
- Active row = hovered row (preferred) OR selected row.
- Handles hide while an element is hovered (to avoid conflict).

### Rich text + inline editor UX
- TipTap used for heading/subheading/text.
- Double-click to enter edit mode; Escape exits.
- While editing, hover is disabled to prevent flicker.

### Basic persistence
- Save/Load to localStorage
- Export/Import JSON

### Popups (modal builder)
- Build popups using the **same nodes** (sections/rows/columns/elements) as the page.
- Triggers:
  - On page load
  - After X seconds
  - Manual open via **Button action → Open Popup**
- Targeting (simple path matching): include/exclude patterns (supports `/regex/` format)
- Frequency controls per visitor (localStorage): every visit / once / cooldown
- Uses `@radix-ui/react-dialog` for accessible modals (focus trap, Escape to close)
- Includes a **Coupon Popup** template + a `Coupon Code` element

## How to use in your Next.js app

1) Copy this folder into your codebase (e.g. `features/funnel-builder-v3/`).

2) Ensure you have these deps:
- `zustand`
- `@tiptap/react`, `@tiptap/core`
- `@tiptap/starter-kit`
- `@tiptap/extension-underline`
- `@tiptap/extension-link`
- `@tiptap/extension-text-align`
- `lucide-react`
- Tailwind (recommended)

3) Ensure you have `cn()` utility at `@/lib/utils` (shadcn default).
   - If your path differs, update imports in this package.

4) Render the app:
```tsx
import FunnelBuilderApp from "PATH_TO_THIS_FOLDER/FunnelBuilderApp";

export default function Page() {
  return <FunnelBuilderApp />;
}
```

## Notes
- This is intentionally **self-contained** and normalized-store based.
- The node schema is simple and meant to be extended (drag/drop, snapshots, undo/redo, multi-user, etc.).
