# Column Layout Analysis

## Current Structure

### Row Component (Green Border)
```
Row Container
├─ Padding: 20px top/bottom, 16px left/right
├─ Border: 2.5px solid green (on hover)
└─ Grid Container
   ├─ display: grid
   ├─ gridTemplateColumns: Based on column ratios (e.g., "1fr 1fr 1fr 1fr")
   ├─ gap: 16px (creates space between grid cells)
   └─ Grid Cells (one per column)
      └─ Column Wrapper Div
         └─ ColumnComponent
```

### Dividers (Green Vertical Lines)
```
- Positioned absolutely within grid
- gridColumn: Places them in specific grid cell
- left: 100% (right edge of cell)
- marginLeft: -1.25px (centers 2.5px divider)
- Extends through row padding (top/bottom)
- Width: 2.5px
- Color: rgba(74, 222, 128, 0.6) - matches row border
```

### Column Component (Purple Dashed Border)
```
Column Container
├─ width: 100% (of grid cell)
├─ padding: 0 8px (creates 8px inset on left/right)
├─ alignItems: center
└─ Visual Border (purple dashed)
   ├─ position: absolute
   ├─ left: 8px (inset from grid cell edge)
   ├─ right: 8px (inset from grid cell edge)
   ├─ border: 1px dashed rgba(168, 85, 247, 0.2)
   └─ Content Wrapper
      └─ padding: 12px
```

## Visual Layout with 4 Equal Columns

```
Row Border (Green, 2.5px)
┌─────────────────────────────────────────────────────────────────┐
│ Row Padding (16px left/right)                                   │
│                                                                  │
│  Grid Cell 1    Gap   Grid Cell 2    Gap   Grid Cell 3    Gap  │
│  ┌──────────┐  16px  ┌──────────┐  16px  ┌──────────┐  16px   │
│  │          │   ┃    │          │   ┃    │          │   ┃      │
│  │ 8px inset│   ┃    │ 8px inset│   ┃    │ 8px inset│   ┃      │
│  │ ┌──────┐ │   ┃    │ ┌──────┐ │   ┃    │ ┌──────┐ │   ┃      │
│  │ │Purple│ │   ┃    │ │Purple│ │   ┃    │ │Purple│ │   ┃      │
│  │ │Border│ │   ┃    │ │Border│ │   ┃    │ │Border│ │   ┃      │
│  │ └──────┘ │   ┃    │ └──────┘ │   ┃    │ └──────┘ │   ┃      │
│  │ 8px inset│   ┃    │ 8px inset│   ┃    │ 8px inset│   ┃      │
│  │          │   ┃    │          │   ┃    │          │   ┃      │
│  └──────────┘   ┃    └──────────┘   ┃    └──────────┘   ┃      │
│                 ↑                   ↑                    ↑       │
│            Divider 2.5px       Divider 2.5px      Divider 2.5px │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Spacing Breakdown

For 4 equal columns (each with ratio = 1):

1. **Grid distributes width:**
   - Total available width = Row width - (Row padding left + right)
   - Grid cells = 4 equal parts
   - Gaps = 3 × 16px = 48px total
   - Each cell width = (Available width - 48px) / 4

2. **Column container within each cell:**
   - Container padding: 8px left + 8px right
   - Visual border inset: 8px from left edge, 8px from right edge
   - Content area: Cell width - 16px (8px × 2)

3. **Dividers:**
   - Positioned at right edge of each cell (except last)
   - Centered in the 16px gap
   - 8px space on left (from previous cell's content)
   - 8px space on right (to next cell's content)

## Expected Result

Each purple column container should:
- Be inset 8px from the left edge of its grid cell
- Be inset 8px from the right edge of its grid cell
- Have 8px of space between it and the divider on the left
- Have 8px of space between it and the divider on the right
- Appear visually centered within the "column space" defined by dividers

## Current Configuration

✅ Grid gap: 16px
✅ Column padding: 0 8px
✅ Column border inset: left 8px, right 8px
✅ Divider width: 2.5px
✅ Divider positioning: Centered in gap

This should result in columns being properly centered within their visual spaces.
