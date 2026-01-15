/**
 * Snap Engine - Professional snapping system for canvas elements
 * Provides Canva/Figma-style magnetic alignment with visual guides
 */

import type { EditorElement } from './types';

export const SNAP_THRESHOLD = 10; // pixels - increased for stronger magnetic snapping
export const ROTATION_SNAP_ANGLE = 15; // degrees
export const SNAP_MEMORY_DURATION = 100; // ms - prevents flicker

export interface AnchorPoint {
  x: number;
  y: number;
  type: 'left' | 'right' | 'top' | 'bottom' | 'centerX' | 'centerY';
  elementId?: string; // undefined for canvas edges
  label?: string;
}

export interface SnapResult {
  x?: number;
  y?: number;
  snappedX: boolean;
  snappedY: boolean;
  guides: AlignmentGuide[];
}

export interface AlignmentGuide {
  type: 'vertical' | 'horizontal';
  position: number; // x for vertical, y for horizontal
  start: number;
  end: number;
  label?: string;
}

export interface ElementBounds {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

/**
 * Calculate anchor points for an element
 */
export function getElementAnchors(element: EditorElement): AnchorPoint[] {
  const { x, y, width, height, id } = element;
  
  return [
    { x, y, type: 'left', elementId: id, label: 'Left edge' },
    { x: x + width, y, type: 'right', elementId: id, label: 'Right edge' },
    { x, y, type: 'top', elementId: id, label: 'Top edge' },
    { x, y: y + height, type: 'bottom', elementId: id, label: 'Bottom edge' },
    { x: x + width / 2, y, type: 'centerX', elementId: id, label: 'Center X' },
    { x, y: y + height / 2, type: 'centerY', elementId: id, label: 'Center Y' },
  ];
}

/**
 * Get canvas edge anchors
 */
export function getCanvasAnchors(canvasWidth: number, canvasHeight: number): AnchorPoint[] {
  return [
    { x: 0, y: 0, type: 'left', label: 'Canvas left' },
    { x: canvasWidth, y: 0, type: 'right', label: 'Canvas right' },
    { x: 0, y: 0, type: 'top', label: 'Canvas top' },
    { x: 0, y: canvasHeight, type: 'bottom', label: 'Canvas bottom' },
    { x: canvasWidth / 2, y: 0, type: 'centerX', label: 'Canvas center X' },
    { x: 0, y: canvasHeight / 2, type: 'centerY', label: 'Canvas center Y' },
  ];
}

/**
 * Simple spatial index using grid-based bucketing
 * Much faster than checking all elements for large canvases
 */
export class SpatialIndex {
  private gridSize: number;
  private grid: Map<string, AnchorPoint[]>;

  constructor(gridSize = 100) {
    this.gridSize = gridSize;
    this.grid = new Map();
  }

  private getGridKey(x: number, y: number): string {
    const gx = Math.floor(x / this.gridSize);
    const gy = Math.floor(y / this.gridSize);
    return `${gx},${gy}`;
  }

  clear() {
    this.grid.clear();
  }

  addAnchors(anchors: AnchorPoint[]) {
    anchors.forEach(anchor => {
      const key = this.getGridKey(anchor.x, anchor.y);
      if (!this.grid.has(key)) {
        this.grid.set(key, []);
      }
      this.grid.get(key)!.push(anchor);
    });
  }

  getNearbyAnchors(x: number, y: number, radius: number): AnchorPoint[] {
    const nearby: AnchorPoint[] = [];
    const gridRadius = Math.ceil(radius / this.gridSize);
    const centerX = Math.floor(x / this.gridSize);
    const centerY = Math.floor(y / this.gridSize);

    // Check surrounding grid cells
    for (let gx = centerX - gridRadius; gx <= centerX + gridRadius; gx++) {
      for (let gy = centerY - gridRadius; gy <= centerY + gridRadius; gy++) {
        const key = `${gx},${gy}`;
        const anchors = this.grid.get(key);
        if (anchors) {
          nearby.push(...anchors);
        }
      }
    }

    return nearby;
  }
}

/**
 * Build spatial index from all elements
 */
export function buildSpatialIndex(
  elements: EditorElement[],
  canvasWidth: number,
  canvasHeight: number,
  excludeIds: string[] = []
): SpatialIndex {
  const index = new SpatialIndex();
  
  // Add canvas anchors
  index.addAnchors(getCanvasAnchors(canvasWidth, canvasHeight));
  
  // Add element anchors (excluding selected elements)
  elements
    .filter(el => !excludeIds.includes(el.id))
    .forEach(el => {
      index.addAnchors(getElementAnchors(el));
    });
  
  return index;
}

/**
 * Find snap targets for a position
 */
export function findSnapTargets(
  x: number,
  y: number,
  spatialIndex: SpatialIndex,
  threshold = SNAP_THRESHOLD
): { x: AnchorPoint | null; y: AnchorPoint | null } {
  const nearby = spatialIndex.getNearbyAnchors(x, y, threshold * 2);
  
  let closestX: AnchorPoint | null = null;
  let closestY: AnchorPoint | null = null;
  let minDistX = threshold;
  let minDistY = threshold;
  
  nearby.forEach(anchor => {
    const distX = Math.abs(anchor.x - x);
    const distY = Math.abs(anchor.y - y);
    
    // Check X alignment
    if (distX < minDistX && (anchor.type === 'left' || anchor.type === 'right' || anchor.type === 'centerX')) {
      minDistX = distX;
      closestX = anchor;
    }
    
    // Check Y alignment
    if (distY < minDistY && (anchor.type === 'top' || anchor.type === 'bottom' || anchor.type === 'centerY')) {
      minDistY = distY;
      closestY = anchor;
    }
  });
  
  return { x: closestX, y: closestY };
}

/**
 * Snap element position during drag
 */
export function snapPosition(
  element: ElementBounds,
  spatialIndex: SpatialIndex,
  disableSnap = false
): SnapResult {
  if (disableSnap) {
    return { snappedX: false, snappedY: false, guides: [] };
  }
  
  const anchors = getElementAnchors(element as EditorElement);
  const guides: AlignmentGuide[] = [];
  let snappedX = false;
  let snappedY = false;
  let snapX: number | undefined;
  let snapY: number | undefined;
  
  // Try to snap each anchor point
  for (const anchor of anchors) {
    const targets = findSnapTargets(anchor.x, anchor.y, spatialIndex);
    
    // Show guide and snap X when close
    if (!snappedX && targets.x) {
      const offset = targets.x.x - anchor.x;
      const distance = Math.abs(offset);
      
      // Always show guide when within threshold
      guides.push({
        type: 'vertical',
        position: targets.x.x,
        start: Math.min(anchor.y, targets.x.y) - 20,
        end: Math.max(anchor.y, targets.x.y) + 20,
        label: targets.x.label,
      });
      
      // Only snap if very close (within 5px for tighter snap)
      if (distance <= 5) {
        snapX = element.x + offset;
        snappedX = true;
      }
    }
    
    // Show guide and snap Y when close
    if (!snappedY && targets.y) {
      const offset = targets.y.y - anchor.y;
      const distance = Math.abs(offset);
      
      // Always show guide when within threshold
      guides.push({
        type: 'horizontal',
        position: targets.y.y,
        start: Math.min(anchor.x, targets.y.x) - 20,
        end: Math.max(anchor.x, targets.y.x) + 20,
        label: targets.y.label,
      });
      
      // Only snap if very close (within 5px for tighter snap)
      if (distance <= 5) {
        snapY = element.y + offset;
        snappedY = true;
      }
    }
    
    if (snappedX && snappedY) break;
  }
  
  return {
    x: snapX,
    y: snapY,
    snappedX,
    snappedY,
    guides,
  };
}

/**
 * Snap rotation to nearest angle increment
 */
export function snapRotation(
  rotation: number,
  disableSnap = false,
  snapAngle = ROTATION_SNAP_ANGLE
): { rotation: number; snapped: boolean } {
  if (disableSnap) {
    return { rotation, snapped: false };
  }
  
  const normalized = rotation % 360;
  const remainder = normalized % snapAngle;
  
  // Snap if within threshold
  if (Math.abs(remainder) < 3 || Math.abs(remainder - snapAngle) < 3) {
    const snapped = Math.round(normalized / snapAngle) * snapAngle;
    return { rotation: snapped, snapped: true };
  }
  
  return { rotation, snapped: false };
}

/**
 * Compute bounds for multiple selected elements
 */
export function computeGroupBounds(elements: EditorElement[]): ElementBounds | null {
  if (elements.length === 0) return null;
  if (elements.length === 1) {
    const el = elements[0];
    return { id: el.id, x: el.x, y: el.y, width: el.width, height: el.height, rotation: el.rotation || 0 };
  }
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  elements.forEach(el => {
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.width);
    maxY = Math.max(maxY, el.y + el.height);
  });
  
  return {
    id: 'group',
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    rotation: 0, // Groups don't have rotation
  };
}

/**
 * Detect equidistant spacing for 3+ elements
 */
export function detectEquidistantSpacing(
  elements: EditorElement[],
  axis: 'x' | 'y'
): { isEquidistant: boolean; spacing?: number } {
  if (elements.length < 3) return { isEquidistant: false };
  
  // Sort by position
  const sorted = [...elements].sort((a, b) => {
    const posA = axis === 'x' ? a.x : a.y;
    const posB = axis === 'x' ? b.x : b.y;
    return posA - posB;
  });
  
  // Calculate spacings
  const spacings: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const prevEnd = axis === 'x' ? prev.x + prev.width : prev.y + prev.height;
    const currStart = axis === 'x' ? curr.x : curr.y;
    spacings.push(currStart - prevEnd);
  }
  
  // Check if all spacings are similar (within 2px)
  const avgSpacing = spacings.reduce((a, b) => a + b, 0) / spacings.length;
  const isEquidistant = spacings.every(s => Math.abs(s - avgSpacing) < 2);
  
  return { isEquidistant, spacing: isEquidistant ? avgSpacing : undefined };
}
