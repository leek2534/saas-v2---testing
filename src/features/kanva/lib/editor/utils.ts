import type { EditorElement, ID } from './types';

/**
 * Generate a unique ID for elements
 */
export function generateId(type: string): ID {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get the next z-index for a new element
 */
export function getNextZIndex(elements: EditorElement[]): number {
  // Ensure elements is an array
  const elementsArray = Array.isArray(elements) ? elements : [];
  if (elementsArray.length === 0) return 0;
  return Math.max(...elementsArray.map((e) => e.zIndex || 0), 0) + 1;
}

/**
 * Sort elements by z-index (bottom to top)
 */
export function sortElementsByZIndex(elements: EditorElement[]): EditorElement[] {
  return [...elements].sort((a, b) => a.zIndex - b.zIndex);
}

/**
 * Check if a point is inside a bounding box
 */
export function isPointInBounds(
  x: number,
  y: number,
  bounds: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    x >= bounds.x &&
    x <= bounds.x + bounds.width &&
    y >= bounds.y &&
    y <= bounds.y + bounds.height
  );
}

/**
 * Get bounding box for multiple elements
 */
export function getBoundingBox(elements: EditorElement[]): {
  x: number;
  y: number;
  width: number;
  height: number;
} | null {
  if (elements.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((el) => {
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.width);
    maxY = Math.max(maxY, el.y + el.height);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Snap value to grid
 */
export function snapToGrid(value: number, gridSize: number = 10): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snap position to nearby elements (simple edge snapping)
 */
export function snapToEdges(
  pos: { x: number; y: number },
  elementBounds: { x: number; y: number; width: number; height: number },
  otherElements: EditorElement[],
  threshold: number = 10,
  elementId?: ID
): { x: number; y: number } {
  let snappedX = pos.x;
  let snappedY = pos.y;

  const elementEdges = {
    left: elementBounds.x,
    right: elementBounds.x + elementBounds.width,
    top: elementBounds.y,
    bottom: elementBounds.y + elementBounds.height,
  };

  otherElements.forEach((other) => {
    if (elementId && other.id === elementId) return; // Skip self

    const otherEdges = {
      left: other.x,
      right: other.x + other.width,
      top: other.y,
      bottom: other.y + other.height,
    };

    // Horizontal snapping
    if (Math.abs(elementEdges.left - otherEdges.left) < threshold) {
      snappedX = other.x;
    } else if (Math.abs(elementEdges.left - otherEdges.right) < threshold) {
      snappedX = other.x + other.width;
    } else if (Math.abs(elementEdges.right - otherEdges.left) < threshold) {
      snappedX = other.x - elementBounds.width;
    } else if (Math.abs(elementEdges.right - otherEdges.right) < threshold) {
      snappedX = other.x + other.width - elementBounds.width;
    }

    // Vertical snapping
    if (Math.abs(elementEdges.top - otherEdges.top) < threshold) {
      snappedY = other.y;
    } else if (Math.abs(elementEdges.top - otherEdges.bottom) < threshold) {
      snappedY = other.y + other.height;
    } else if (Math.abs(elementEdges.bottom - otherEdges.top) < threshold) {
      snappedY = other.y - elementBounds.height;
    } else if (Math.abs(elementEdges.bottom - otherEdges.bottom) < threshold) {
      snappedY = other.y + other.height - elementBounds.height;
    }
  });

  return { x: snappedX, y: snappedY };
}

/**
 * Constrain value within bounds
 */
export function constrain(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate distance between two points
 */
export function distance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Load image and return HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Export canvas to data URL
 */
export function exportToDataURL(
  stage: any,
  options: {
    mimeType?: string;
    quality?: number;
    pixelRatio?: number;
  } = {}
): string {
  const { mimeType = 'image/png', quality = 1, pixelRatio = 2 } = options;
  return stage.toDataURL({
    mimeType,
    quality,
    pixelRatio,
  });
}

/**
 * Download data URL as file
 */
export function downloadDataURL(dataURL: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;
  link.click();
}

/**
 * Serialize editor state to JSON
 */
export function serializeState(state: {
  canvas: any;
  elements: EditorElement[];
  meta: any;
}): string {
  return JSON.stringify(
    {
      canvas: state.canvas,
      elements: state.elements,
      meta: state.meta,
      version: '1.0.0',
    },
    null,
    2
  );
}

/**
 * Deserialize JSON to editor state
 */
export function deserializeState(json: string): {
  canvas: any;
  elements: EditorElement[];
  meta: any;
} {
  const data = JSON.parse(json);
  return {
    canvas: data.canvas || { width: 1200, height: 800, background: { color: '#ffffff' } },
    elements: data.elements || [],
    meta: data.meta || {},
  };
}

