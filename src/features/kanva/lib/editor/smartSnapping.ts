/**
 * Smart Snapping System - Like Canva
 * Provides grid snapping and alignment guides for elements
 */

export interface SnapPoint {
  value: number;
  type: 'grid' | 'element' | 'canvas';
  elementId?: string;
  alignment?: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';
}

export interface SnapResult {
  x: number;
  y: number;
  snappedX: boolean;
  snappedY: boolean;
  guides: SnapGuide[];
}

export interface SnapGuide {
  type: 'vertical' | 'horizontal';
  position: number;
  alignment: string;
  color?: string;
}

export interface Element {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Smart snapping configuration
 */
export const SNAP_CONFIG = {
  SNAP_THRESHOLD: 8, // Pixels within which snapping occurs
  GRID_SIZE: 10, // Grid cell size in pixels
  SHOW_GRID: false, // Whether to show grid lines
  SHOW_GUIDES: true, // Whether to show alignment guides
  GUIDE_COLOR: '#FF00FF', // Magenta guides like Canva
  GUIDE_WIDTH: 1,
};

/**
 * Calculate snap points for an element
 */
export function calculateSnapPoints(
  element: Element,
  otherElements: Element[],
  canvasWidth: number,
  canvasHeight: number
): { xPoints: SnapPoint[]; yPoints: SnapPoint[] } {
  const xPoints: SnapPoint[] = [];
  const yPoints: SnapPoint[] = [];

  // Canvas snap points
  xPoints.push(
    { value: 0, type: 'canvas', alignment: 'left' },
    { value: canvasWidth / 2, type: 'canvas', alignment: 'center' },
    { value: canvasWidth, type: 'canvas', alignment: 'right' }
  );

  yPoints.push(
    { value: 0, type: 'canvas', alignment: 'top' },
    { value: canvasHeight / 2, type: 'canvas', alignment: 'middle' },
    { value: canvasHeight, type: 'canvas', alignment: 'bottom' }
  );

  // Grid snap points (every GRID_SIZE pixels)
  for (let x = 0; x <= canvasWidth; x += SNAP_CONFIG.GRID_SIZE) {
    xPoints.push({ value: x, type: 'grid' });
  }
  for (let y = 0; y <= canvasHeight; y += SNAP_CONFIG.GRID_SIZE) {
    yPoints.push({ value: y, type: 'grid' });
  }

  // Element snap points (edges and centers of other elements)
  otherElements.forEach((other) => {
    if (other.id === element.id) return;

    // X points (left, center, right)
    xPoints.push(
      { value: other.x, type: 'element', elementId: other.id, alignment: 'left' },
      { value: other.x + other.width / 2, type: 'element', elementId: other.id, alignment: 'center' },
      { value: other.x + other.width, type: 'element', elementId: other.id, alignment: 'right' }
    );

    // Y points (top, middle, bottom)
    yPoints.push(
      { value: other.y, type: 'element', elementId: other.id, alignment: 'top' },
      { value: other.y + other.height / 2, type: 'element', elementId: other.id, alignment: 'middle' },
      { value: other.y + other.height, type: 'element', elementId: other.id, alignment: 'bottom' }
    );
  });

  return { xPoints, yPoints };
}

/**
 * Find the nearest snap point
 */
function findNearestSnap(value: number, snapPoints: SnapPoint[], threshold: number): SnapPoint | null {
  let nearest: SnapPoint | null = null;
  let minDistance = threshold;

  snapPoints.forEach((point) => {
    const distance = Math.abs(value - point.value);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = point;
    }
  });

  return nearest;
}

/**
 * Snap element position to grid and other elements
 */
export function snapElementPosition(
  element: Element,
  newX: number,
  newY: number,
  otherElements: Element[],
  canvasWidth: number,
  canvasHeight: number
): SnapResult {
  const { xPoints, yPoints } = calculateSnapPoints(element, otherElements, canvasWidth, canvasHeight);

  const guides: SnapGuide[] = [];
  let snappedX = false;
  let snappedY = false;
  let finalX = newX;
  let finalY = newY;

  // Calculate element edges and center
  const elementLeft = newX;
  const elementRight = newX + element.width;
  const elementCenterX = newX + element.width / 2;
  const elementTop = newY;
  const elementBottom = newY + element.height;
  const elementCenterY = newY + element.height / 2;

  // Try to snap left edge
  let snapX = findNearestSnap(elementLeft, xPoints, SNAP_CONFIG.SNAP_THRESHOLD);
  if (!snapX) {
    // Try center
    snapX = findNearestSnap(elementCenterX, xPoints, SNAP_CONFIG.SNAP_THRESHOLD);
    if (snapX) {
      finalX = snapX.value - element.width / 2;
      snappedX = true;
    }
  } else {
    finalX = snapX.value;
    snappedX = true;
  }

  // If no snap yet, try right edge
  if (!snapX) {
    snapX = findNearestSnap(elementRight, xPoints, SNAP_CONFIG.SNAP_THRESHOLD);
    if (snapX) {
      finalX = snapX.value - element.width;
      snappedX = true;
    }
  }

  // Try to snap top edge
  let snapY = findNearestSnap(elementTop, yPoints, SNAP_CONFIG.SNAP_THRESHOLD);
  if (!snapY) {
    // Try middle
    snapY = findNearestSnap(elementCenterY, yPoints, SNAP_CONFIG.SNAP_THRESHOLD);
    if (snapY) {
      finalY = snapY.value - element.height / 2;
      snappedY = true;
    }
  } else {
    finalY = snapY.value;
    snappedY = true;
  }

  // If no snap yet, try bottom edge
  if (!snapY) {
    snapY = findNearestSnap(elementBottom, yPoints, SNAP_CONFIG.SNAP_THRESHOLD);
    if (snapY) {
      finalY = snapY.value - element.height;
      snappedY = true;
    }
  }

  // Create guides for snapped positions
  if (snapX && snapX.type !== 'grid') {
    guides.push({
      type: 'vertical',
      position: snapX.value,
      alignment: snapX.alignment || 'unknown',
      color: SNAP_CONFIG.GUIDE_COLOR,
    });
  }

  if (snapY && snapY.type !== 'grid') {
    guides.push({
      type: 'horizontal',
      position: snapY.value,
      alignment: snapY.alignment || 'unknown',
      color: SNAP_CONFIG.GUIDE_COLOR,
    });
  }

  return {
    x: finalX,
    y: finalY,
    snappedX,
    snappedY,
    guides,
  };
}

/**
 * Check if two elements are aligned
 */
export function checkAlignment(element1: Element, element2: Element): string[] {
  const alignments: string[] = [];
  const threshold = 2; // Pixels

  // Horizontal alignments
  if (Math.abs(element1.x - element2.x) < threshold) {
    alignments.push('left');
  }
  if (Math.abs((element1.x + element1.width / 2) - (element2.x + element2.width / 2)) < threshold) {
    alignments.push('center-x');
  }
  if (Math.abs((element1.x + element1.width) - (element2.x + element2.width)) < threshold) {
    alignments.push('right');
  }

  // Vertical alignments
  if (Math.abs(element1.y - element2.y) < threshold) {
    alignments.push('top');
  }
  if (Math.abs((element1.y + element1.height / 2) - (element2.y + element2.height / 2)) < threshold) {
    alignments.push('center-y');
  }
  if (Math.abs((element1.y + element1.height) - (element2.y + element2.height)) < threshold) {
    alignments.push('bottom');
  }

  return alignments;
}
