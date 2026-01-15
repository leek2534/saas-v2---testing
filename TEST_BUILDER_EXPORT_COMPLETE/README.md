# Test Builder - Complete Code Export

**Export Date:** January 5, 2026  
**Total Files:** 179 files (all test builder source code)

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14.1.0** - React framework with App Router
- **React 18.2.0** - UI library
- **TypeScript 5.3.3** - Type-safe JavaScript

### UI & Styling
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI components
- **Lucide React** - Icon library
- **Tailwind CSS Animate** - Animation utilities

### State Management
- **Zustand 5.0.9** - Lightweight state management
- **React Hook Form 7.70.0** - Form state management
- **Zod 3.25.76** - Schema validation

### Backend & Database
- **Convex 1.13.2** - Real-time database & backend
- **Convex-ents 0.9.5** - Entity framework for Convex

### Authentication
- **Clerk 4.29.3** - User authentication & management

### Rich Text & Content
- **Tiptap 3.14.0** - Rich text editor
- **React-Konva 18.2.10** - Canvas graphics

### Drag & Drop
- **@dnd-kit/core** - Modern drag and drop library
- **Liveblocks 3.12.1** - Real-time collaboration

### Image Processing
- **@imgly/background-removal 1.7.0** - AI background removal
- **React Image Crop 11.0.10** - Image cropping

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Sass 1.97.1** - CSS preprocessor

---

## 🎉 New Additions (January 2026)

### Enhanced Documentation & Organization

1. **`ARCHITECTURE.md`** - Comprehensive architecture documentation
   - Complete hierarchy explanation (Funnel > Steps > Sections > Rows > Columns > Elements)
   - Hover & selection system details
   - Column resizing algorithms
   - Best practices and code review questions

2. **`types/layout.ts`** - Clean type definitions
   - Better organized layout types
   - Hover, selection, and drag state interfaces
   - Alignment and container type definitions

3. **`utils/layoutCalculations.ts`** - Calculation utilities
   - `calculateAvailableWidth()` - Account for gaps
   - `calculateDividerPosition()` - Pixel-perfect divider placement
   - `calculateDividerCSS()` - CSS calc() expressions
   - `calculateNewRatios()` - Resize ratio calculations
   - `validateColumnRatios()` - Constraint validation
   - And 10+ more helper functions

These additions **complement** the existing codebase without replacing anything. All 179 original files remain intact.

---

## What's Included

This folder contains **ALL** source code files from the test builder:

- ✅ All TypeScript/TSX component files
- ✅ All utility files
- ✅ All type definitions
- ✅ All element renderers
- ✅ All modals and panels
- ✅ All hooks and helpers
- ✅ All styles and CSS
- ✅ **NEW:** Enhanced documentation and utilities

## Core Files to Review

### 📋 Documentation
- **`ARCHITECTURE.md`** - Complete architecture documentation (NEW!)
- **`README.md`** - This file with tech stack and overview

### 🎯 Type Definitions
- **`types/layout.ts`** - Clean type definitions for layout hierarchy (NEW!)
- `store.ts` - Zustand state management with all type definitions

### 🧮 Utilities
- **`utils/layoutCalculations.ts`** - Column width and divider calculation helpers (NEW!)

### 🏗️ Main Components
- `RowComponent.tsx` - Row layout with column resizing (447 lines)
- `ColumnComponent.tsx` - Column container (154 lines)
- `SectionComponent.tsx` - Section container (485 lines)
- `ElementRenderer.tsx` - Element rendering (2,364 lines)
- `DropZoneIndicator.tsx` - Drop zones (213 lines)

### 🎨 Builder Components
- `NewTestBuilder.tsx` - Main builder component
- `NewEditorCanvas.tsx` - Canvas component
- `SettingsPanelV2.tsx` - Settings panel

### 🔧 Supporting Components
- `DragDropProvider.tsx` - Drag and drop context
- `SortableElement.tsx` - Sortable element wrapper
- `CommandPalette.tsx` - Command palette
- `ElementHierarchy.tsx` - Element tree view
- And 160+ more files...

## Key Implementation Details

### Hover State Management (State-Driven)
**Priority:** Element > Column > Row

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

### Column Layout
- Flexbox with `gap: 12px` between columns
- Column ratios determine width: `flex: ${column.ratio} 1 0`
- No border/padding on wrapper (single container layer)

### Divider Positioning
```typescript
// Available width = container width - gaps
const availableWidth = containerWidth - (numColumns - 1) * 12;

// Position = (ratio × available width) + (gaps passed × 12px) + 6px (half gap)
return `calc((100% - ${gapSpace}px) * ${ratioFraction} + ${gapsPassed * 12 + 6}px)`;
```

### Resize Logic
```typescript
// Left column start = (accumulated ratio × available width) + (gaps before × 12px)
const leftColumnStart = (accumulatedRatio / totalRowRatio) * availableWidth + (dragColumnIndex * 12);

// New width = mouse position - left column start
const newLeftWidth = mouseX - leftColumnStart;
```

### Smart Hover Restoration
When pointer leaves an element, checks if still within row bounds:
```typescript
onPointerLeave={(e) => {
  const rowElement = elementRef.current?.closest('[data-row-id]');
  if (rowElement) {
    const rowRect = rowElement.getBoundingClientRect();
    const isInRow = clientX >= rowRect.left && clientX <= rowRect.right &&
                   clientY >= rowRect.top && clientY <= rowRect.bottom;
    if (isInRow) {
      setHover('row', rowId); // Restore row hover
    }
  }
}
```

## Recent Changes & Fixes

1. **Consolidated Container Structure** - Removed redundant visual styling from column wrapper
2. **State-Driven Hover** - Element hover has absolute priority, suppresses all parent hovers
3. **Smart Hover Restoration** - Row hover reappears when leaving element
4. **Row Padding** - Set to 8px left/right (half of original 16px)
5. **Pointer Events** - Changed from mouse events to pointer events for better hover handling

## Visual Hierarchy (FG Funnels Standard)

- **Sections:** Green borders (`rgba(34, 197, 94, 0.6)`)
- **Rows:** Blue borders (`rgba(59, 130, 246, 0.6)`)
- **Columns:** Purple borders (`rgba(192, 132, 252, 0.6)`)
- **Elements:** Orange borders (on hover/selection)

## How to Use This Export

1. **Review the core files** listed above first
2. **Check the hover implementation** in RowComponent, ColumnComponent, ElementRenderer
3. **Review the layout calculations** in RowComponent (divider positioning, resize logic)
4. **Explore supporting files** as needed

## Questions for Reviewers

1. Is the hover state management approach correct?
2. Are the divider positioning calculations accurate?
3. Should we add visual debugging aids back for development?
4. Any performance concerns with the current resize implementation?
5. Is the single container layer approach better than nested containers?

---

**To Share This Export:**

```bash
# From the parent directory
cd /Users/malikcantland/Developer/golden-saas
zip -r test-builder-export.zip TEST_BUILDER_EXPORT_COMPLETE/
```

This will create a `test-builder-export.zip` file you can share for code review.
