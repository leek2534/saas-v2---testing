# Test Builder Code Export

This document contains all the core files that make up the Test Builder for code review and feedback.

## Core Architecture Files

### 1. Store (State Management)
**File:** `src/features/test-builder/store.ts`
- Global state management using Zustand
- Manages sections, rows, columns, elements
- Handles hover states, selection, resizing
- Undo/redo functionality

### 2. Main Components

#### Row Component
**File:** `src/features/test-builder/RowComponent.tsx`
- Renders row containers with blue borders
- Manages column layout with flexbox and 12px gaps
- Handles column resizing with divider lines and resize handles
- State-driven hover with priority suppression (element > column > row)
- Pointer events for smooth hover transitions

**Key Features:**
- Divider positioning: `calc((100% - ${gapSpace}px) * ${ratioFraction} + ${gapsPassed * 12 + 6}px)`
- Resize logic accounts for gaps between columns
- Row hover only shows when `hoveredType === 'row'`
- All row visuals (border, header, resize handles) hide when element is hovered

#### Column Component
**File:** `src/features/test-builder/ColumnComponent.tsx`
- Renders individual column content
- Purple/pink hover border (only shows when `hoveredType === 'column'`)
- Manages column alignment (horizontal and vertical)
- State-driven hover suppression

**Key Features:**
- Hover only shows when not resizing and no element is hovered
- Uses pointer events for better hover handling
- Renders DropZoneIndicator when empty

#### Section Component
**File:** `src/features/test-builder/SectionComponent.tsx`
- Top-level container for rows
- Green borders (FG Funnels standard)
- Manages section backgrounds, padding, spacing
- Contains row management (add, delete, reorder)

#### Element Renderer
**File:** `src/features/test-builder/ElementRenderer.tsx`
- Renders all element types (text, button, image, video, etc.)
- Orange hover borders (FG Funnels standard)
- Handles element hover state with priority over row/column
- Smart hover restoration when leaving element

**Key Features:**
- `onPointerLeave` checks if pointer is still in row bounds
- If yes, restores row hover immediately
- Prevents hover dead zones and flicker

### 3. Supporting Components

#### Drop Zone Indicator
**File:** `src/features/test-builder/DropZoneIndicator.tsx`
- Shows "Add Element" placeholder in empty columns
- Drag-and-drop target for new elements
- Uses `whitespace-nowrap` to prevent text wrapping

#### Settings Panel
**File:** `src/features/test-builder/SettingsPanelV2.tsx`
- Right sidebar for editing properties
- Section, row, column, and element settings
- Background, padding, alignment controls

#### Canvas
**File:** `src/features/test-builder/NewEditorCanvas.tsx`
- Main canvas area where sections are rendered
- Handles zoom, pan, device preview modes
- Manages global resize state

## Key Architectural Decisions

### Hover State Management (State-Driven, Not CSS)

**Priority Hierarchy:**
1. Element hover (highest priority)
2. Column hover
3. Row hover (fallback)

**Implementation:**
```typescript
// Row hover only shows when hoveredType is 'row'
const isHovered = (hoveredType === 'row' && hoveredId === row.id) && !isDragging;

// Column hover only shows when hoveredType is 'column'
const isHovered = (hoveredType === 'column' && hoveredId === column.id) && !isResizing;

// Element hover suppresses all parent hovers
if (hoveredType === 'element') {
  // Row and column hovers are hidden
}
```

**Pointer Events:**
- Changed from `onMouseEnter/Leave` to `onPointerEnter/Leave`
- Better hover handling without dead zones
- Element `onPointerLeave` restores row hover if pointer still in row bounds

### Column Layout & Resizing

**Layout Model:**
- Flexbox with `gap: 12px` between columns
- Column ratios determine width: `flex: ${column.ratio} 1 0`
- No border/padding on wrapper (single container layer)

**Divider Positioning:**
```typescript
// Available width = container width - gaps
const availableWidth = containerWidth - gapSpace;

// Position = (ratio × available width) + (gaps passed × 12px) + (half current gap)
return (ratioFraction * availableWidth) + (gapsPassed * 12) + 6;
```

**Resize Logic:**
```typescript
// Left column start = (ratio × available width) + (gaps before)
const leftColumnStart = (accumulatedRatio / totalRowRatio) * availableWidth + (dragColumnIndex * 12);

// New width based on mouse position
const newLeftWidth = mouseX - leftColumnStart;
```

### Visual Hierarchy (FG Funnels Standard)

- **Sections:** Green borders (`rgba(34, 197, 94, 0.6)`)
- **Rows:** Blue borders (`rgba(59, 130, 246, 0.6)`)
- **Columns:** Purple borders (`rgba(192, 132, 252, 0.6)`)
- **Elements:** Orange borders (on hover/selection)

## Recent Changes & Fixes

### 1. Consolidated Container Structure
- Removed redundant visual styling from column wrapper div
- Single container layer (ColumnComponent only)
- Simplified divider and resize calculations

### 2. State-Driven Hover with Priority Suppression
- Element hover has absolute priority
- All row visuals (border, header, resize handles) hide when element is hovered
- Smooth transitions with no flicker or dead zones

### 3. Smart Hover Restoration
- When leaving element, checks if pointer still in row bounds
- If yes, immediately restores row hover
- Prevents hover state getting "stuck"

### 4. Row Padding Adjustment
- Set to 8px left/right (half of original 16px)
- Maintains some edge spacing without excessive gaps

## Files to Review

### Core Components (Most Important)
1. `RowComponent.tsx` - Row layout, column resizing, divider positioning
2. `ColumnComponent.tsx` - Column rendering, hover states
3. `ElementRenderer.tsx` - Element rendering, hover priority
4. `store.ts` - Global state management
5. `SectionComponent.tsx` - Section container

### Supporting Components
6. `DropZoneIndicator.tsx` - Empty column placeholder
7. `SettingsPanelV2.tsx` - Properties panel
8. `NewEditorCanvas.tsx` - Main canvas
9. `NewTestBuilder.tsx` - Top-level builder component

### Utilities
10. `styles/design-system.ts` - Design tokens
11. `utils/alignment.ts` - Alignment helpers

## Known Issues & Considerations

1. **TypeScript Errors:** Some false positive errors about `hoveredType` comparisons - the types are correct in the store
2. **Resize Performance:** Currently smooth, but may need optimization for many columns
3. **Mobile Support:** Currently desktop-focused, using mouse/pointer events

## Questions for Feedback

1. Is the hover state management approach correct?
2. Are the divider positioning calculations accurate?
3. Should we add visual debugging aids back for development?
4. Any performance concerns with the current resize implementation?
5. Is the single container layer approach better than nested containers?

---

**Export Date:** January 5, 2026
**Builder Version:** Test Builder V2
**State Management:** Zustand
**Framework:** React + TypeScript
