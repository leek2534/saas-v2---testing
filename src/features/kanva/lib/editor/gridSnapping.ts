/**
 * Grid Snapping Utilities - Like Canva
 * Provides snap-to-grid functionality for element positioning
 */

export interface GridConfig {
  enabled: boolean;
  size: number; // Grid cell size in pixels
  showGrid: boolean; // Whether to show visual grid
  snapThreshold: number; // Distance in pixels to trigger snap
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
  enabled: true,
  size: 10, // 10px grid
  showGrid: false, // Hidden by default
  snapThreshold: 5, // Snap within 5px
};

/**
 * Snap a value to the nearest grid line
 */
export function snapToGrid(value: number, gridSize: number, threshold: number = 5): number {
  const remainder = value % gridSize;
  const snapDown = value - remainder;
  const snapUp = snapDown + gridSize;
  
  // Check if we're close enough to snap
  if (remainder <= threshold) {
    return snapDown;
  } else if (gridSize - remainder <= threshold) {
    return snapUp;
  }
  
  return value; // No snap
}

/**
 * Snap a position (x, y) to grid
 */
export function snapPositionToGrid(
  x: number,
  y: number,
  config: GridConfig
): { x: number; y: number } {
  if (!config.enabled) {
    return { x, y };
  }
  
  return {
    x: snapToGrid(x, config.size, config.snapThreshold),
    y: snapToGrid(y, config.size, config.snapThreshold),
  };
}

/**
 * Snap element dimensions to grid
 */
export function snapDimensionsToGrid(
  width: number,
  height: number,
  config: GridConfig
): { width: number; height: number } {
  if (!config.enabled) {
    return { width, height };
  }
  
  return {
    width: snapToGrid(width, config.size, config.snapThreshold),
    height: snapToGrid(height, config.size, config.snapThreshold),
  };
}

/**
 * Check if element should snap to another element's edge
 * Returns snap position if within threshold, null otherwise
 */
export interface SnapGuide {
  type: 'vertical' | 'horizontal';
  position: number;
  elementId: string;
}

export function findSnapGuides(
  elementX: number,
  elementY: number,
  elementWidth: number,
  elementHeight: number,
  otherElements: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>,
  threshold: number = 5
): SnapGuide[] {
  const guides: SnapGuide[] = [];
  
  const elementRight = elementX + elementWidth;
  const elementBottom = elementY + elementHeight;
  const elementCenterX = elementX + elementWidth / 2;
  const elementCenterY = elementY + elementHeight / 2;
  
  for (const other of otherElements) {
    const otherRight = other.x + other.width;
    const otherBottom = other.y + other.height;
    const otherCenterX = other.x + other.width / 2;
    const otherCenterY = other.y + other.height / 2;
    
    // Check vertical alignment (left, center, right)
    if (Math.abs(elementX - other.x) <= threshold) {
      guides.push({ type: 'vertical', position: other.x, elementId: other.id });
    }
    if (Math.abs(elementCenterX - otherCenterX) <= threshold) {
      guides.push({ type: 'vertical', position: otherCenterX, elementId: other.id });
    }
    if (Math.abs(elementRight - otherRight) <= threshold) {
      guides.push({ type: 'vertical', position: otherRight, elementId: other.id });
    }
    
    // Check horizontal alignment (top, middle, bottom)
    if (Math.abs(elementY - other.y) <= threshold) {
      guides.push({ type: 'horizontal', position: other.y, elementId: other.id });
    }
    if (Math.abs(elementCenterY - otherCenterY) <= threshold) {
      guides.push({ type: 'horizontal', position: otherCenterY, elementId: other.id });
    }
    if (Math.abs(elementBottom - otherBottom) <= threshold) {
      guides.push({ type: 'horizontal', position: otherBottom, elementId: other.id });
    }
  }
  
  return guides;
}

/**
 * Apply snap guides to element position
 */
export function applySnapGuides(
  x: number,
  y: number,
  width: number,
  height: number,
  guides: SnapGuide[]
): { x: number; y: number } {
  let snappedX = x;
  let snappedY = y;
  
  for (const guide of guides) {
    if (guide.type === 'vertical') {
      // Snap to vertical guide (affects x position)
      const centerX = x + width / 2;
      const right = x + width;
      
      // Check if left edge should snap
      if (Math.abs(x - guide.position) <= 5) {
        snappedX = guide.position;
      }
      // Check if center should snap
      else if (Math.abs(centerX - guide.position) <= 5) {
        snappedX = guide.position - width / 2;
      }
      // Check if right edge should snap
      else if (Math.abs(right - guide.position) <= 5) {
        snappedX = guide.position - width;
      }
    } else {
      // Snap to horizontal guide (affects y position)
      const centerY = y + height / 2;
      const bottom = y + height;
      
      // Check if top edge should snap
      if (Math.abs(y - guide.position) <= 5) {
        snappedY = guide.position;
      }
      // Check if middle should snap
      else if (Math.abs(centerY - guide.position) <= 5) {
        snappedY = guide.position - height / 2;
      }
      // Check if bottom edge should snap
      else if (Math.abs(bottom - guide.position) <= 5) {
        snappedY = guide.position - height;
      }
    }
  }
  
  return { x: snappedX, y: snappedY };
}

/**
 * Generate grid lines for visual display
 */
export function generateGridLines(
  canvasWidth: number,
  canvasHeight: number,
  gridSize: number
): { vertical: number[]; horizontal: number[] } {
  const vertical: number[] = [];
  const horizontal: number[] = [];
  
  // Generate vertical lines
  for (let x = 0; x <= canvasWidth; x += gridSize) {
    vertical.push(x);
  }
  
  // Generate horizontal lines
  for (let y = 0; y <= canvasHeight; y += gridSize) {
    horizontal.push(y);
  }
  
  return { vertical, horizontal };
}
