/**
 * Unified Snapping System
 * 
 * Consolidates all snapping logic into one performant module:
 * - Edge snapping (to canvas and other elements)
 * - Center snapping
 * - Distribution snapping (equal spacing)
 * - Rotation snapping
 */

import type { Bounds, SnapGuide, SnapResult, Point } from '../types';
import { SNAP_THRESHOLD, ROTATION_SNAP_THRESHOLD, ROTATION_SNAP_ANGLES } from '../types';

// ============================================
// TYPES
// ============================================

export interface SnapTarget {
  id: string;
  bounds: Bounds;
  isCanvas?: boolean;
}

export interface SnapConfig {
  threshold: number;
  snapToCanvas: boolean;
  snapToElements: boolean;
  snapToCenter: boolean;
  snapToDistribution: boolean;
}

const DEFAULT_CONFIG: SnapConfig = {
  threshold: SNAP_THRESHOLD,
  snapToCanvas: true,
  snapToElements: true,
  snapToCenter: true,
  snapToDistribution: true,
};

// ============================================
// GEOMETRY HELPERS
// ============================================

export function boundsToRect(bounds: Bounds) {
  return {
    x: bounds.minX,
    y: bounds.minY,
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
  };
}

export function rectToBounds(x: number, y: number, width: number, height: number): Bounds {
  return {
    minX: x,
    minY: y,
    maxX: x + width,
    maxY: y + height,
  };
}

export function getBoundsCenter(bounds: Bounds): Point {
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
  };
}

// ============================================
// SNAP CALCULATION
// ============================================

interface SnapCandidate {
  position: number;
  delta: number;
  guide: SnapGuide;
}

/**
 * Calculate snap position for a dragged element
 */
export function calculateSnap(
  draggedBounds: Bounds,
  targets: SnapTarget[],
  canvasSize: { width: number; height: number },
  config: Partial<SnapConfig> = {}
): SnapResult {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const guides: SnapGuide[] = [];
  
  const draggedWidth = draggedBounds.maxX - draggedBounds.minX;
  const draggedHeight = draggedBounds.maxY - draggedBounds.minY;
  const draggedCenterX = (draggedBounds.minX + draggedBounds.maxX) / 2;
  const draggedCenterY = (draggedBounds.minY + draggedBounds.maxY) / 2;
  
  // Collect snap candidates
  const xCandidates: SnapCandidate[] = [];
  const yCandidates: SnapCandidate[] = [];
  
  // Canvas snapping
  if (cfg.snapToCanvas) {
    // Left edge to canvas left
    addCandidate(xCandidates, draggedBounds.minX, 0, 'vertical', 'edge');
    // Right edge to canvas right
    addCandidate(xCandidates, draggedBounds.maxX, canvasSize.width, 'vertical', 'edge');
    // Center to canvas center X
    if (cfg.snapToCenter) {
      addCandidate(xCandidates, draggedCenterX, canvasSize.width / 2, 'vertical', 'center');
    }
    
    // Top edge to canvas top
    addCandidate(yCandidates, draggedBounds.minY, 0, 'horizontal', 'edge');
    // Bottom edge to canvas bottom
    addCandidate(yCandidates, draggedBounds.maxY, canvasSize.height, 'horizontal', 'edge');
    // Center to canvas center Y
    if (cfg.snapToCenter) {
      addCandidate(yCandidates, draggedCenterY, canvasSize.height / 2, 'horizontal', 'center');
    }
  }
  
  // Element snapping
  if (cfg.snapToElements) {
    for (const target of targets) {
      const targetCenterX = (target.bounds.minX + target.bounds.maxX) / 2;
      const targetCenterY = (target.bounds.minY + target.bounds.maxY) / 2;
      
      // X-axis snapping
      // Left to left
      addCandidate(xCandidates, draggedBounds.minX, target.bounds.minX, 'vertical', 'edge');
      // Left to right
      addCandidate(xCandidates, draggedBounds.minX, target.bounds.maxX, 'vertical', 'edge');
      // Right to left
      addCandidate(xCandidates, draggedBounds.maxX, target.bounds.minX, 'vertical', 'edge');
      // Right to right
      addCandidate(xCandidates, draggedBounds.maxX, target.bounds.maxX, 'vertical', 'edge');
      // Center to center
      if (cfg.snapToCenter) {
        addCandidate(xCandidates, draggedCenterX, targetCenterX, 'vertical', 'center');
      }
      
      // Y-axis snapping
      // Top to top
      addCandidate(yCandidates, draggedBounds.minY, target.bounds.minY, 'horizontal', 'edge');
      // Top to bottom
      addCandidate(yCandidates, draggedBounds.minY, target.bounds.maxY, 'horizontal', 'edge');
      // Bottom to top
      addCandidate(yCandidates, draggedBounds.maxY, target.bounds.minY, 'horizontal', 'edge');
      // Bottom to bottom
      addCandidate(yCandidates, draggedBounds.maxY, target.bounds.maxY, 'horizontal', 'edge');
      // Center to center
      if (cfg.snapToCenter) {
        addCandidate(yCandidates, draggedCenterY, targetCenterY, 'horizontal', 'center');
      }
    }
  }
  
  // Find best snap
  let snapX = draggedBounds.minX;
  let snapY = draggedBounds.minY;
  let snappedX = false;
  let snappedY = false;
  
  // Best X snap
  const bestX = findBestCandidate(xCandidates, cfg.threshold);
  if (bestX) {
    // Adjust position based on which edge snapped
    if (bestX.guide.type === 'center') {
      snapX = bestX.guide.position - draggedWidth / 2;
    } else {
      // Check if it was left or right edge
      const wasLeftEdge = Math.abs(draggedBounds.minX - (bestX.guide.position - bestX.delta)) < 0.1;
      snapX = wasLeftEdge ? bestX.guide.position : bestX.guide.position - draggedWidth;
    }
    guides.push(bestX.guide);
    snappedX = true;
  }
  
  // Best Y snap
  const bestY = findBestCandidate(yCandidates, cfg.threshold);
  if (bestY) {
    if (bestY.guide.type === 'center') {
      snapY = bestY.guide.position - draggedHeight / 2;
    } else {
      const wasTopEdge = Math.abs(draggedBounds.minY - (bestY.guide.position - bestY.delta)) < 0.1;
      snapY = wasTopEdge ? bestY.guide.position : bestY.guide.position - draggedHeight;
    }
    guides.push(bestY.guide);
    snappedY = true;
  }
  
  return {
    x: snapX,
    y: snapY,
    guides,
    snappedX,
    snappedY,
  };
}

function addCandidate(
  candidates: SnapCandidate[],
  draggedPos: number,
  targetPos: number,
  orientation: 'horizontal' | 'vertical',
  type: 'edge' | 'center'
): void {
  const delta = targetPos - draggedPos;
  candidates.push({
    position: targetPos,
    delta,
    guide: {
      orientation,
      position: targetPos,
      type,
    },
  });
}

function findBestCandidate(
  candidates: SnapCandidate[],
  threshold: number
): SnapCandidate | null {
  let best: SnapCandidate | null = null;
  let bestDistance = threshold;
  
  for (const candidate of candidates) {
    const distance = Math.abs(candidate.delta);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  }
  
  return best;
}

// ============================================
// ROTATION SNAPPING
// ============================================

/**
 * Snap rotation angle to common angles (0, 45, 90, etc.)
 */
export function snapRotation(
  angle: number,
  threshold: number = ROTATION_SNAP_THRESHOLD
): { angle: number; snapped: boolean } {
  // Normalize to 0-360
  const normalized = ((angle % 360) + 360) % 360;
  
  for (const snapAngle of ROTATION_SNAP_ANGLES) {
    const diff = Math.abs(normalized - snapAngle);
    if (diff <= threshold || diff >= 360 - threshold) {
      return {
        angle: snapAngle === 360 ? 0 : snapAngle,
        snapped: true,
      };
    }
  }
  
  return { angle, snapped: false };
}

// ============================================
// RESIZE SNAPPING
// ============================================

/**
 * Calculate snap for resize operations
 */
export function calculateResizeSnap(
  newBounds: Bounds,
  handle: string,
  targets: SnapTarget[],
  canvasSize: { width: number; height: number },
  config: Partial<SnapConfig> = {}
): SnapResult {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const guides: SnapGuide[] = [];
  
  let snapX = newBounds.minX;
  let snapY = newBounds.minY;
  let snapMaxX = newBounds.maxX;
  let snapMaxY = newBounds.maxY;
  let snappedX = false;
  let snappedY = false;
  
  // Determine which edges to snap based on handle
  const snapLeft = handle.includes('left');
  const snapRight = handle.includes('right');
  const snapTop = handle.includes('top');
  const snapBottom = handle.includes('bottom');
  
  // Collect snap points
  const snapPointsX: { pos: number; target: number }[] = [];
  const snapPointsY: { pos: number; target: number }[] = [];
  
  // Canvas edges
  if (cfg.snapToCanvas) {
    if (snapLeft) snapPointsX.push({ pos: newBounds.minX, target: 0 });
    if (snapRight) snapPointsX.push({ pos: newBounds.maxX, target: canvasSize.width });
    if (snapTop) snapPointsY.push({ pos: newBounds.minY, target: 0 });
    if (snapBottom) snapPointsY.push({ pos: newBounds.maxY, target: canvasSize.height });
  }
  
  // Element edges
  if (cfg.snapToElements) {
    for (const target of targets) {
      if (snapLeft) {
        snapPointsX.push({ pos: newBounds.minX, target: target.bounds.minX });
        snapPointsX.push({ pos: newBounds.minX, target: target.bounds.maxX });
      }
      if (snapRight) {
        snapPointsX.push({ pos: newBounds.maxX, target: target.bounds.minX });
        snapPointsX.push({ pos: newBounds.maxX, target: target.bounds.maxX });
      }
      if (snapTop) {
        snapPointsY.push({ pos: newBounds.minY, target: target.bounds.minY });
        snapPointsY.push({ pos: newBounds.minY, target: target.bounds.maxY });
      }
      if (snapBottom) {
        snapPointsY.push({ pos: newBounds.maxY, target: target.bounds.minY });
        snapPointsY.push({ pos: newBounds.maxY, target: target.bounds.maxY });
      }
    }
  }
  
  // Find best snaps
  for (const point of snapPointsX) {
    if (Math.abs(point.pos - point.target) < cfg.threshold) {
      if (snapLeft && point.pos === newBounds.minX) {
        snapX = point.target;
        snappedX = true;
      } else if (snapRight && point.pos === newBounds.maxX) {
        snapMaxX = point.target;
        snappedX = true;
      }
      guides.push({
        orientation: 'vertical',
        position: point.target,
        type: 'edge',
      });
      break;
    }
  }
  
  for (const point of snapPointsY) {
    if (Math.abs(point.pos - point.target) < cfg.threshold) {
      if (snapTop && point.pos === newBounds.minY) {
        snapY = point.target;
        snappedY = true;
      } else if (snapBottom && point.pos === newBounds.maxY) {
        snapMaxY = point.target;
        snappedY = true;
      }
      guides.push({
        orientation: 'horizontal',
        position: point.target,
        type: 'edge',
      });
      break;
    }
  }
  
  return {
    x: snapX,
    y: snapY,
    guides,
    snappedX,
    snappedY,
  };
}

// ============================================
// DISTRIBUTION SNAPPING
// ============================================

/**
 * Calculate equal distribution between elements
 */
export function calculateDistributionSnap(
  draggedBounds: Bounds,
  targets: SnapTarget[],
  threshold: number = SNAP_THRESHOLD
): { guides: SnapGuide[]; adjustment: Point } {
  if (targets.length < 2) {
    return { guides: [], adjustment: { x: 0, y: 0 } };
  }
  
  const guides: SnapGuide[] = [];
  let adjustX = 0;
  let adjustY = 0;
  
  // Sort targets by position
  const sortedByX = [...targets].sort((a, b) => a.bounds.minX - b.bounds.minX);
  const sortedByY = [...targets].sort((a, b) => a.bounds.minY - b.bounds.minY);
  
  // Check horizontal distribution
  for (let i = 0; i < sortedByX.length - 1; i++) {
    const gap = sortedByX[i + 1].bounds.minX - sortedByX[i].bounds.maxX;
    
    // Check if dragged element could fit with equal spacing
    const leftGap = draggedBounds.minX - sortedByX[i].bounds.maxX;
    const rightGap = sortedByX[i + 1].bounds.minX - draggedBounds.maxX;
    
    if (Math.abs(leftGap - gap) < threshold) {
      adjustX = gap - leftGap;
      guides.push({
        orientation: 'vertical',
        position: sortedByX[i].bounds.maxX + gap / 2,
        type: 'distribution',
        label: `${Math.round(gap)}px`,
      });
    }
  }
  
  // Check vertical distribution (similar logic)
  for (let i = 0; i < sortedByY.length - 1; i++) {
    const gap = sortedByY[i + 1].bounds.minY - sortedByY[i].bounds.maxY;
    const topGap = draggedBounds.minY - sortedByY[i].bounds.maxY;
    
    if (Math.abs(topGap - gap) < threshold) {
      adjustY = gap - topGap;
      guides.push({
        orientation: 'horizontal',
        position: sortedByY[i].bounds.maxY + gap / 2,
        type: 'distribution',
        label: `${Math.round(gap)}px`,
      });
    }
  }
  
  return {
    guides,
    adjustment: { x: adjustX, y: adjustY },
  };
}
