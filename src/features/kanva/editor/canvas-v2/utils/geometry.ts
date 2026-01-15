/**
 * Geometry Utilities
 * 
 * Pure functions for geometric calculations
 */

import type { Point, Bounds, Size, Transform } from '../types';

// ============================================
// POINT OPERATIONS
// ============================================

export function addPoints(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtractPoints(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scalePoint(p: Point, scale: number): Point {
  return { x: p.x * scale, y: p.y * scale };
}

export function distanceBetween(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function angleBetween(center: Point, point: Point): number {
  return Math.atan2(point.y - center.y, point.x - center.x) * (180 / Math.PI);
}

export function rotatePoint(point: Point, center: Point, angleDeg: number): Point {
  const angleRad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

// ============================================
// BOUNDS OPERATIONS
// ============================================

export function createBounds(x: number, y: number, width: number, height: number): Bounds {
  return {
    minX: x,
    minY: y,
    maxX: x + width,
    maxY: y + height,
  };
}

export function getBoundsSize(bounds: Bounds): Size {
  return {
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
  };
}

export function getBoundsCenter(bounds: Bounds): Point {
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
  };
}

export function expandBounds(bounds: Bounds, padding: number): Bounds {
  return {
    minX: bounds.minX - padding,
    minY: bounds.minY - padding,
    maxX: bounds.maxX + padding,
    maxY: bounds.maxY + padding,
  };
}

export function mergeBounds(boundsArray: Bounds[]): Bounds {
  if (boundsArray.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }
  
  return boundsArray.reduce((acc, bounds) => ({
    minX: Math.min(acc.minX, bounds.minX),
    minY: Math.min(acc.minY, bounds.minY),
    maxX: Math.max(acc.maxX, bounds.maxX),
    maxY: Math.max(acc.maxY, bounds.maxY),
  }));
}

export function boundsContainsPoint(bounds: Bounds, point: Point): boolean {
  return (
    point.x >= bounds.minX &&
    point.x <= bounds.maxX &&
    point.y >= bounds.minY &&
    point.y <= bounds.maxY
  );
}

export function boundsIntersect(a: Bounds, b: Bounds): boolean {
  return !(
    a.maxX < b.minX ||
    a.minX > b.maxX ||
    a.maxY < b.minY ||
    a.minY > b.maxY
  );
}

export function boundsContainsBounds(outer: Bounds, inner: Bounds): boolean {
  return (
    inner.minX >= outer.minX &&
    inner.maxX <= outer.maxX &&
    inner.minY >= outer.minY &&
    inner.maxY <= outer.maxY
  );
}

// ============================================
// TRANSFORM OPERATIONS
// ============================================

export function getTransformBounds(transform: Transform): Bounds {
  // For non-rotated elements
  if (!transform.rotation || transform.rotation === 0) {
    return createBounds(transform.x, transform.y, transform.width, transform.height);
  }
  
  // For rotated elements, calculate axis-aligned bounding box
  const center: Point = {
    x: transform.x + transform.width / 2,
    y: transform.y + transform.height / 2,
  };
  
  const corners: Point[] = [
    { x: transform.x, y: transform.y },
    { x: transform.x + transform.width, y: transform.y },
    { x: transform.x + transform.width, y: transform.y + transform.height },
    { x: transform.x, y: transform.y + transform.height },
  ];
  
  const rotatedCorners = corners.map(corner => 
    rotatePoint(corner, center, transform.rotation)
  );
  
  return {
    minX: Math.min(...rotatedCorners.map(c => c.x)),
    minY: Math.min(...rotatedCorners.map(c => c.y)),
    maxX: Math.max(...rotatedCorners.map(c => c.x)),
    maxY: Math.max(...rotatedCorners.map(c => c.y)),
  };
}

export function getTransformCenter(transform: Transform): Point {
  return {
    x: transform.x + transform.width / 2,
    y: transform.y + transform.height / 2,
  };
}

// ============================================
// RESIZE CALCULATIONS
// ============================================

export interface ResizeResult {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function calculateResize(
  original: { x: number; y: number; width: number; height: number },
  handle: string,
  deltaX: number,
  deltaY: number,
  preserveAspect: boolean = false,
  minSize: number = 10
): ResizeResult {
  let { x, y, width, height } = original;
  const aspectRatio = original.width / original.height;
  
  // Calculate new dimensions based on handle
  switch (handle) {
    case 'top-left':
      width = Math.max(original.width - deltaX, minSize);
      height = Math.max(original.height - deltaY, minSize);
      x = original.x + (original.width - width);
      y = original.y + (original.height - height);
      break;
      
    case 'top-center':
      height = Math.max(original.height - deltaY, minSize);
      y = original.y + (original.height - height);
      break;
      
    case 'top-right':
      width = Math.max(original.width + deltaX, minSize);
      height = Math.max(original.height - deltaY, minSize);
      y = original.y + (original.height - height);
      break;
      
    case 'middle-left':
      width = Math.max(original.width - deltaX, minSize);
      x = original.x + (original.width - width);
      break;
      
    case 'middle-right':
      width = Math.max(original.width + deltaX, minSize);
      break;
      
    case 'bottom-left':
      width = Math.max(original.width - deltaX, minSize);
      height = Math.max(original.height + deltaY, minSize);
      x = original.x + (original.width - width);
      break;
      
    case 'bottom-center':
      height = Math.max(original.height + deltaY, minSize);
      break;
      
    case 'bottom-right':
      width = Math.max(original.width + deltaX, minSize);
      height = Math.max(original.height + deltaY, minSize);
      break;
  }
  
  // Preserve aspect ratio if needed
  if (preserveAspect) {
    const isCorner = handle.includes('-') && !handle.includes('center');
    
    if (isCorner) {
      // Use the larger dimension change
      const scaleX = width / original.width;
      const scaleY = height / original.height;
      const scale = Math.max(scaleX, scaleY);
      
      const newWidth = Math.max(original.width * scale, minSize);
      const newHeight = Math.max(newWidth / aspectRatio, minSize);
      
      // Adjust position based on handle
      if (handle.includes('left')) {
        x = original.x + original.width - newWidth;
      }
      if (handle.includes('top')) {
        y = original.y + original.height - newHeight;
      }
      
      width = newWidth;
      height = newHeight;
    }
  }
  
  return { x, y, width, height };
}

// ============================================
// MULTI-ELEMENT RESIZE
// ============================================

export interface ElementTransform {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
}

export function calculateMultiResize(
  elements: ElementTransform[],
  originalBounds: Bounds,
  handle: string,
  deltaX: number,
  deltaY: number,
  preserveAspect: boolean = true
): ElementTransform[] {
  const boundsWidth = originalBounds.maxX - originalBounds.minX;
  const boundsHeight = originalBounds.maxY - originalBounds.minY;
  
  // Calculate scale factors
  let scaleX = 1;
  let scaleY = 1;
  let originX = originalBounds.minX;
  let originY = originalBounds.minY;
  
  switch (handle) {
    case 'bottom-right':
      scaleX = Math.max((boundsWidth + deltaX) / boundsWidth, 0.1);
      scaleY = Math.max((boundsHeight + deltaY) / boundsHeight, 0.1);
      break;
    case 'bottom-left':
      scaleX = Math.max((boundsWidth - deltaX) / boundsWidth, 0.1);
      scaleY = Math.max((boundsHeight + deltaY) / boundsHeight, 0.1);
      originX = originalBounds.maxX;
      break;
    case 'top-right':
      scaleX = Math.max((boundsWidth + deltaX) / boundsWidth, 0.1);
      scaleY = Math.max((boundsHeight - deltaY) / boundsHeight, 0.1);
      originY = originalBounds.maxY;
      break;
    case 'top-left':
      scaleX = Math.max((boundsWidth - deltaX) / boundsWidth, 0.1);
      scaleY = Math.max((boundsHeight - deltaY) / boundsHeight, 0.1);
      originX = originalBounds.maxX;
      originY = originalBounds.maxY;
      break;
  }
  
  // Use uniform scale for proportional scaling
  const scale = preserveAspect ? (scaleX + scaleY) / 2 : Math.max(scaleX, scaleY);
  
  return elements.map(el => {
    const relX = el.x - originX;
    const relY = el.y - originY;
    
    return {
      id: el.id,
      x: originX + relX * scale,
      y: originY + relY * scale,
      width: Math.max(el.width * scale, 10),
      height: Math.max(el.height * scale, 10),
      fontSize: el.fontSize ? Math.max(Math.round(el.fontSize * scale), 8) : undefined,
    };
  });
}

// ============================================
// HIT TESTING
// ============================================

export function isPointInRotatedRect(
  point: Point,
  rect: { x: number; y: number; width: number; height: number; rotation: number }
): boolean {
  if (!rect.rotation || rect.rotation === 0) {
    return boundsContainsPoint(createBounds(rect.x, rect.y, rect.width, rect.height), point);
  }
  
  // Rotate point back to axis-aligned space
  const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  const rotatedPoint = rotatePoint(point, center, -rect.rotation);
  
  return boundsContainsPoint(createBounds(rect.x, rect.y, rect.width, rect.height), rotatedPoint);
}

export function getHandleAtPoint(
  point: Point,
  elementBounds: Bounds,
  handleSize: number = 8
): string | null {
  const handles = [
    { name: 'top-left', x: elementBounds.minX, y: elementBounds.minY },
    { name: 'top-center', x: (elementBounds.minX + elementBounds.maxX) / 2, y: elementBounds.minY },
    { name: 'top-right', x: elementBounds.maxX, y: elementBounds.minY },
    { name: 'middle-left', x: elementBounds.minX, y: (elementBounds.minY + elementBounds.maxY) / 2 },
    { name: 'middle-right', x: elementBounds.maxX, y: (elementBounds.minY + elementBounds.maxY) / 2 },
    { name: 'bottom-left', x: elementBounds.minX, y: elementBounds.maxY },
    { name: 'bottom-center', x: (elementBounds.minX + elementBounds.maxX) / 2, y: elementBounds.maxY },
    { name: 'bottom-right', x: elementBounds.maxX, y: elementBounds.maxY },
  ];
  
  const halfSize = handleSize / 2;
  
  for (const handle of handles) {
    if (
      point.x >= handle.x - halfSize &&
      point.x <= handle.x + halfSize &&
      point.y >= handle.y - halfSize &&
      point.y <= handle.y + halfSize
    ) {
      return handle.name;
    }
  }
  
  return null;
}
