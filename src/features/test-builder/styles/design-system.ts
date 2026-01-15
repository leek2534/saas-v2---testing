/**
 * Test Builder Design System
 * Consistent with Kanva's UI patterns
 * 
 * Color coding for hierarchy:
 * - Section: Blue (primary)
 * - Row: Green (success)
 * - Column: Purple (accent)
 * - Element: Orange (warning)
 */

export const designSystem = {
  // Hierarchy colors - matching Kanva's approach
  colors: {
    section: {
      ring: 'ring-blue-500/60',
      bg: 'bg-blue-500',
      bgLight: 'bg-blue-500/10',
      text: 'text-blue-500',
      hover: 'hover:bg-blue-500/20',
    },
    row: {
      ring: 'ring-green-500/60',
      bg: 'bg-green-500',
      bgLight: 'bg-green-500/10',
      text: 'text-green-500',
      hover: 'hover:bg-green-500/20',
    },
    column: {
      ring: 'ring-purple-500/60',
      bg: 'bg-purple-500',
      bgLight: 'bg-purple-500/10',
      text: 'text-purple-500',
      hover: 'hover:bg-purple-500/20',
    },
    element: {
      ring: 'ring-orange-500/60',
      bg: 'bg-orange-500',
      bgLight: 'bg-orange-500/10',
      text: 'text-orange-500',
      hover: 'hover:bg-orange-500/20',
    },
  },
  
  // Consistent spacing
  spacing: {
    headerBar: 'px-2 py-1',
    panel: 'p-4',
    gap: 'gap-2',
  },
  
  // Typography
  typography: {
    label: 'text-[10px] font-semibold uppercase tracking-wide',
    body: 'text-sm',
    caption: 'text-xs text-muted-foreground',
  },
  
  // Transitions
  transitions: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-200',
    slow: 'transition-all duration-300',
  },
  
  // Shadows
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },
  
  // Border radius
  radius: {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  },
};

// Header bar styles for each hierarchy level
export const headerBarStyles = {
  section: 'bg-blue-500 text-white',
  row: 'bg-green-500 text-white',
  column: 'bg-purple-500 text-white',
  element: 'bg-orange-500 text-white',
};

// Ring styles for selection/hover
export const ringStyles = {
  section: {
    hover: 'ring-2 ring-blue-500/40 ring-inset',
    selected: 'ring-2 ring-blue-500 ring-inset',
  },
  row: {
    hover: 'ring-2 ring-green-500/40 ring-inset',
    selected: 'ring-2 ring-green-500 ring-inset',
  },
  column: {
    hover: 'ring-2 ring-purple-500/40 ring-inset',
    selected: 'ring-2 ring-purple-500 ring-inset',
  },
  element: {
    hover: 'ring-2 ring-orange-500/40 ring-inset',
    selected: 'ring-2 ring-orange-500 ring-inset',
  },
};

export default designSystem;
