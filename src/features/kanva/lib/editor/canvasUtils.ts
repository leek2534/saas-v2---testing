/**
 * Canvas Utilities - Inspired by Fabric.js patterns
 * MIT Licensed patterns adapted for Konva.js
 */

import type { EditorElement } from './types';

/**
 * Calculate distance between two points
 */
export function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Snap to grid
 */
export function snapToGrid(value: number, gridSize: number = 10): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snap to object edges (alignment guides)
 */
export interface SnapLine {
  x?: number;
  y?: number;
  type: 'vertical' | 'horizontal';
}

export function getSnapLines(
  movingElement: EditorElement,
  otherElements: EditorElement[],
  threshold: number = 5
): SnapLine[] {
  const snapLines: SnapLine[] = [];
  const movingBounds = {
    left: movingElement.x,
    right: movingElement.x + movingElement.width,
    top: movingElement.y,
    bottom: movingElement.y + movingElement.height,
    centerX: movingElement.x + movingElement.width / 2,
    centerY: movingElement.y + movingElement.height / 2,
  };

  otherElements.forEach((element) => {
    if (element.id === movingElement.id) return;

    const bounds = {
      left: element.x,
      right: element.x + element.width,
      top: element.y,
      bottom: element.y + element.height,
      centerX: element.x + element.width / 2,
      centerY: element.y + element.height / 2,
    };

    // Vertical snap lines
    const leftDiff = Math.abs(movingBounds.left - bounds.left);
    const rightDiff = Math.abs(movingBounds.right - bounds.right);
    const centerXDiff = Math.abs(movingBounds.centerX - bounds.centerX);
    const leftRightDiff = Math.abs(movingBounds.left - bounds.right);
    const rightLeftDiff = Math.abs(movingBounds.right - bounds.left);

    if (leftDiff < threshold) {
      snapLines.push({ x: bounds.left, type: 'vertical' });
    }
    if (rightDiff < threshold) {
      snapLines.push({ x: bounds.right, type: 'vertical' });
    }
    if (centerXDiff < threshold) {
      snapLines.push({ x: bounds.centerX, type: 'vertical' });
    }
    if (leftRightDiff < threshold) {
      snapLines.push({ x: bounds.right, type: 'vertical' });
    }
    if (rightLeftDiff < threshold) {
      snapLines.push({ x: bounds.left, type: 'vertical' });
    }

    // Horizontal snap lines
    const topDiff = Math.abs(movingBounds.top - bounds.top);
    const bottomDiff = Math.abs(movingBounds.bottom - bounds.bottom);
    const centerYDiff = Math.abs(movingBounds.centerY - bounds.centerY);
    const topBottomDiff = Math.abs(movingBounds.top - bounds.bottom);
    const bottomTopDiff = Math.abs(movingBounds.bottom - bounds.top);

    if (topDiff < threshold) {
      snapLines.push({ y: bounds.top, type: 'horizontal' });
    }
    if (bottomDiff < threshold) {
      snapLines.push({ y: bounds.bottom, type: 'horizontal' });
    }
    if (centerYDiff < threshold) {
      snapLines.push({ y: bounds.centerY, type: 'horizontal' });
    }
    if (topBottomDiff < threshold) {
      snapLines.push({ y: bounds.bottom, type: 'horizontal' });
    }
    if (bottomTopDiff < threshold) {
      snapLines.push({ y: bounds.top, type: 'horizontal' });
    }
  });

  return snapLines;
}

/**
 * Apply snapping to position
 */
export function applySnapping(
  x: number,
  y: number,
  snapLines: SnapLine[],
  threshold: number = 5
): { x: number; y: number; snapped: boolean } {
  let snappedX = x;
  let snappedY = y;
  let snapped = false;

  snapLines.forEach((line) => {
    if (line.type === 'vertical' && line.x !== undefined) {
      const diff = Math.abs(x - line.x);
      if (diff < threshold) {
        snappedX = line.x;
        snapped = true;
      }
    }
    if (line.type === 'horizontal' && line.y !== undefined) {
      const diff = Math.abs(y - line.y);
      if (diff < threshold) {
        snappedY = line.y;
        snapped = true;
      }
    }
  });

  return { x: snappedX, y: snappedY, snapped };
}

/**
 * Calculate bounding box for multiple elements
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
 * Check if point is inside element
 */
export function isPointInElement(
  point: { x: number; y: number },
  element: EditorElement
): boolean {
  return (
    point.x >= element.x &&
    point.x <= element.x + element.width &&
    point.y >= element.y &&
    point.y <= element.y + element.height
  );
}

/**
 * Get element at point (for click detection)
 */
export function getElementAtPoint(
  point: { x: number; y: number },
  elements: EditorElement[],
  reverseOrder: boolean = true
): EditorElement | null {
  const sorted = reverseOrder
    ? [...elements].sort((a, b) => b.zIndex - a.zIndex)
    : elements;

  for (const element of sorted) {
    if (!element.visible) continue;
    if (isPointInElement(point, element)) {
      return element;
    }
  }

  return null;
}

/**
 * Constrain value to bounds
 */
export function constrainToBounds(
  value: number,
  min: number,
  max: number
): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate zoom to fit
 */
export function calculateZoomToFit(
  canvasWidth: number,
  canvasHeight: number,
  containerWidth: number,
  containerHeight: number,
  padding: number = 40
): number {
  const scaleX = (containerWidth - padding * 2) / canvasWidth;
  const scaleY = (containerHeight - padding * 2) / canvasHeight;
  return Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%
}

/**
 * Transform point by rotation
 */
export function rotatePoint(
  point: { x: number; y: number },
  center: { x: number; y: number },
  angle: number
): { x: number; y: number } {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}



