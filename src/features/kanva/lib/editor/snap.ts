/**
 * Snapping utilities for Kanva editor
 * Based on Canva blueprint best practices
 */

export interface SnapPoint {
  value: number;
  type: 'canvas' | 'element';
  elementId?: string;
}

export interface SnapResult {
  snapped: boolean;
  value: number;
  delta: number;
  snapPoint?: SnapPoint;
}

/**
 * Get snap delta for a position against snap points
 * Returns the delta to apply to snap to the nearest point within threshold
 */
export function getSnapDelta(
  pos: number,
  snapPoints: SnapPoint[],
  threshold = 6
): SnapResult {
  let closestDelta = Infinity;
  let closestPoint: SnapPoint | undefined;

  for (const point of snapPoints) {
    const delta = point.value - pos;
    if (Math.abs(delta) <= threshold && Math.abs(delta) < Math.abs(closestDelta)) {
      closestDelta = delta;
      closestPoint = point;
    }
  }

  if (closestPoint) {
    return {
      snapped: true,
      value: pos + closestDelta,
      delta: closestDelta,
      snapPoint: closestPoint,
    };
  }

  return {
    snapped: false,
    value: pos,
    delta: 0,
  };
}

/**
 * Snap position to grid
 */
export function snapToGrid(x: number, y: number, gridSize = 8): { x: number; y: number } {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize,
  };
}

/**
 * Generate snap points for canvas edges and center
 */
export function getCanvasSnapPoints(
  canvasWidth: number,
  canvasHeight: number
): { x: SnapPoint[]; y: SnapPoint[] } {
  return {
    x: [
      { value: 0, type: 'canvas' },
      { value: canvasWidth / 2, type: 'canvas' },
      { value: canvasWidth, type: 'canvas' },
    ],
    y: [
      { value: 0, type: 'canvas' },
      { value: canvasHeight / 2, type: 'canvas' },
      { value: canvasHeight, type: 'canvas' },
    ],
  };
}

/**
 * Generate snap points for an element's edges and center
 */
export function getElementSnapPoints(
  element: { id: string; x: number; y: number; width: number; height: number }
): { x: SnapPoint[]; y: SnapPoint[] } {
  return {
    x: [
      { value: element.x, type: 'element', elementId: element.id },
      { value: element.x + element.width / 2, type: 'element', elementId: element.id },
      { value: element.x + element.width, type: 'element', elementId: element.id },
    ],
    y: [
      { value: element.y, type: 'element', elementId: element.id },
      { value: element.y + element.height / 2, type: 'element', elementId: element.id },
      { value: element.y + element.height, type: 'element', elementId: element.id },
    ],
  };
}

/**
 * Get all snap points for a canvas and its elements
 */
export function getAllSnapPoints(
  canvasWidth: number,
  canvasHeight: number,
  elements: Array<{ id: string; x: number; y: number; width: number; height: number }>,
  excludeIds: string[] = []
): { x: SnapPoint[]; y: SnapPoint[] } {
  const canvas = getCanvasSnapPoints(canvasWidth, canvasHeight);
  
  const elementPoints = elements
    .filter(el => !excludeIds.includes(el.id))
    .reduce(
      (acc, el) => {
        const points = getElementSnapPoints(el);
        return {
          x: [...acc.x, ...points.x],
          y: [...acc.y, ...points.y],
        };
      },
      { x: [] as SnapPoint[], y: [] as SnapPoint[] }
    );

  return {
    x: [...canvas.x, ...elementPoints.x],
    y: [...canvas.y, ...elementPoints.y],
  };
}

/**
 * Snap an element's position to nearby snap points
 */
export function snapElementPosition(
  element: { x: number; y: number; width: number; height: number },
  snapPoints: { x: SnapPoint[]; y: SnapPoint[] },
  threshold = 6
): {
  x: number;
  y: number;
  snappedX: boolean;
  snappedY: boolean;
  snapLines: Array<{ axis: 'x' | 'y'; value: number }>;
} {
  // Get element's snap points (left, center, right / top, middle, bottom)
  const elementCenterX = element.x + element.width / 2;
  const elementRightX = element.x + element.width;
  const elementCenterY = element.y + element.height / 2;
  const elementBottomY = element.y + element.height;

  // Try snapping left, center, right
  const snapX = [
    getSnapDelta(element.x, snapPoints.x, threshold),
    getSnapDelta(elementCenterX, snapPoints.x, threshold),
    getSnapDelta(elementRightX, snapPoints.x, threshold),
  ].find(s => s.snapped);

  // Try snapping top, middle, bottom
  const snapY = [
    getSnapDelta(element.y, snapPoints.y, threshold),
    getSnapDelta(elementCenterY, snapPoints.y, threshold),
    getSnapDelta(elementBottomY, snapPoints.y, threshold),
  ].find(s => s.snapped);

  const snapLines: Array<{ axis: 'x' | 'y'; value: number }> = [];
  
  if (snapX?.snapPoint) {
    snapLines.push({ axis: 'x', value: snapX.snapPoint.value });
  }
  
  if (snapY?.snapPoint) {
    snapLines.push({ axis: 'y', value: snapY.snapPoint.value });
  }

  return {
    x: snapX ? element.x + snapX.delta : element.x,
    y: snapY ? element.y + snapY.delta : element.y,
    snappedX: snapX?.snapped ?? false,
    snappedY: snapY?.snapped ?? false,
    snapLines,
  };
}

/**
 * Example usage:
 * 
 * // During drag:
 * const snapPoints = getAllSnapPoints(
 *   canvas.width,
 *   canvas.height,
 *   elements,
 *   [draggedElement.id] // exclude self
 * );
 * 
 * const snapped = snapElementPosition(
 *   { x: newX, y: newY, width, height },
 *   snapPoints,
 *   6 // threshold in pixels
 * );
 * 
 * // Update element position
 * updateElement(id, { x: snapped.x, y: snapped.y });
 * 
 * // Show snap lines
 * setSnapLines(snapped.snapLines);
 */
