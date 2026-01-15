/**
 * Alignment Utilities - Like Figma/Canva
 * Functions for aligning and distributing elements
 */

export interface AlignmentOptions {
  canvasWidth: number;
  canvasHeight: number;
}

export interface ElementBounds {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

/**
 * Align elements to the left edge of the canvas
 */
export function alignLeft(elements: ElementBounds[]): Partial<ElementBounds>[] {
  return elements.map((el) => ({
    id: el.id,
    x: 0,
  }));
}

/**
 * Align elements to horizontal center of canvas
 */
export function alignCenterHorizontal(
  elements: ElementBounds[],
  options: AlignmentOptions
): Partial<ElementBounds>[] {
  return elements.map((el) => ({
    id: el.id,
    x: (options.canvasWidth - el.width) / 2,
  }));
}

/**
 * Align elements to the right edge of the canvas
 */
export function alignRight(
  elements: ElementBounds[],
  options: AlignmentOptions
): Partial<ElementBounds>[] {
  return elements.map((el) => ({
    id: el.id,
    x: options.canvasWidth - el.width,
  }));
}

/**
 * Align elements to the top edge of the canvas
 */
export function alignTop(elements: ElementBounds[]): Partial<ElementBounds>[] {
  return elements.map((el) => ({
    id: el.id,
    y: 0,
  }));
}

/**
 * Align elements to vertical middle of canvas
 */
export function alignMiddleVertical(
  elements: ElementBounds[],
  options: AlignmentOptions
): Partial<ElementBounds>[] {
  return elements.map((el) => ({
    id: el.id,
    y: (options.canvasHeight - el.height) / 2,
  }));
}

/**
 * Align elements to the bottom edge of the canvas
 */
export function alignBottom(
  elements: ElementBounds[],
  options: AlignmentOptions
): Partial<ElementBounds>[] {
  return elements.map((el) => ({
    id: el.id,
    y: options.canvasHeight - el.height,
  }));
}

/**
 * Bring element forward (increase z-index by 1)
 */
export function bringForward(
  elementId: string,
  allElements: Array<{ id: string; zIndex: number }>
): number | null {
  const element = allElements.find((el) => el.id === elementId);
  if (!element) return null;
  
  const higherElements = allElements.filter((el) => el.zIndex > element.zIndex);
  if (higherElements.length === 0) return null; // Already at top
  
  const nextZIndex = Math.min(...higherElements.map((el) => el.zIndex));
  return nextZIndex + 0.5; // Place between current and next
}

/**
 * Send element backward (decrease z-index by 1)
 */
export function sendBackward(
  elementId: string,
  allElements: Array<{ id: string; zIndex: number }>
): number | null {
  const element = allElements.find((el) => el.id === elementId);
  if (!element) return null;
  
  const lowerElements = allElements.filter((el) => el.zIndex < element.zIndex);
  if (lowerElements.length === 0) return null; // Already at bottom
  
  const prevZIndex = Math.max(...lowerElements.map((el) => el.zIndex));
  return prevZIndex - 0.5; // Place between previous and current
}

/**
 * Bring element to front (highest z-index)
 */
export function bringToFront(
  allElements: Array<{ id: string; zIndex: number }>
): number {
  const maxZIndex = Math.max(...allElements.map((el) => el.zIndex), 0);
  return maxZIndex + 1;
}

/**
 * Send element to back (lowest z-index)
 */
export function sendToBack(
  allElements: Array<{ id: string; zIndex: number }>
): number {
  const minZIndex = Math.min(...allElements.map((el) => el.zIndex), 0);
  return minZIndex - 1;
}

/**
 * Normalize z-indices to sequential integers
 * Call this after multiple z-index operations to clean up
 */
export function normalizeZIndices(
  elements: Array<{ id: string; zIndex: number }>
): Array<{ id: string; zIndex: number }> {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  return sorted.map((el, index) => ({
    id: el.id,
    zIndex: index,
  }));
}

/**
 * Distribute elements horizontally with equal spacing
 */
export function distributeHorizontally(elements: ElementBounds[]): Partial<ElementBounds>[] {
  if (elements.length < 3) return [];
  
  const sorted = [...elements].sort((a, b) => a.x - b.x);
  const leftmost = sorted[0];
  const rightmost = sorted[sorted.length - 1];
  
  const totalWidth = rightmost.x + rightmost.width - leftmost.x;
  const totalElementWidth = sorted.reduce((sum, el) => sum + el.width, 0);
  const spacing = (totalWidth - totalElementWidth) / (sorted.length - 1);
  
  let currentX = leftmost.x;
  return sorted.map((el) => {
    const result = { id: el.id, x: currentX };
    currentX += el.width + spacing;
    return result;
  });
}

/**
 * Distribute elements vertically with equal spacing
 */
export function distributeVertically(elements: ElementBounds[]): Partial<ElementBounds>[] {
  if (elements.length < 3) return [];
  
  const sorted = [...elements].sort((a, b) => a.y - b.y);
  const topmost = sorted[0];
  const bottommost = sorted[sorted.length - 1];
  
  const totalHeight = bottommost.y + bottommost.height - topmost.y;
  const totalElementHeight = sorted.reduce((sum, el) => sum + el.height, 0);
  const spacing = (totalHeight - totalElementHeight) / (sorted.length - 1);
  
  let currentY = topmost.y;
  return sorted.map((el) => {
    const result = { id: el.id, y: currentY };
    currentY += el.height + spacing;
    return result;
  });
}
