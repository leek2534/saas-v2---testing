/**
 * Professional snapping utilities for Kanva editor
 * Enhanced guide system with Canva-style behavior
 */

export interface Guide {
  id: string;
  type: 'v' | 'h'; // vertical or horizontal
  pos: number;
  label?: string;
  source?: string; // 'canvas' or element id
}

export interface ElementBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

export interface SnapComputeResult {
  dx: number; // adjustment to apply to element x
  dy: number; // adjustment to apply to element y
  activeGuides: Guide[];
  badge?: { x: number; y: number; text: string } | null;
}

/**
 * Get element bounds with all edges and centers
 */
export function getElementBounds(element: {
  x: number;
  y: number;
  width: number;
  height: number;
}): ElementBounds {
  return {
    left: element.x,
    right: element.x + element.width,
    top: element.y,
    bottom: element.y + element.height,
    centerX: element.x + element.width / 2,
    centerY: element.y + element.height / 2,
    width: element.width,
    height: element.height,
  };
}

/**
 * Build comprehensive guide list from canvas and all elements
 * Note: All positions should be in canvas coordinate space (not viewport)
 */
export function buildGuides(
  canvasRect: { width: number; height: number; left: number; top: number },
  elements: Array<{ id: string; x: number; y: number; width: number; height: number }>,
  excludeIds: string[] = []
): Guide[] {
  const guides: Guide[] = [];

  // Canvas center X and Y (in canvas coordinate space)
  guides.push({
    id: 'canvas-cx',
    type: 'v',
    pos: canvasRect.width / 2,
    label: 'Canvas Center X',
    source: 'canvas',
  });
  guides.push({
    id: 'canvas-cy',
    type: 'h',
    pos: canvasRect.height / 2,
    label: 'Canvas Center Y',
    source: 'canvas',
  });

  // Canvas borders (in canvas coordinate space, origin at 0,0)
  guides.push({
    id: 'canvas-left',
    type: 'v',
    pos: 0,
    label: 'Canvas Left',
    source: 'canvas',
  });
  guides.push({
    id: 'canvas-right',
    type: 'v',
    pos: canvasRect.width,
    label: 'Canvas Right',
    source: 'canvas',
  });
  guides.push({
    id: 'canvas-top',
    type: 'h',
    pos: 0,
    label: 'Canvas Top',
    source: 'canvas',
  });
  guides.push({
    id: 'canvas-bottom',
    type: 'h',
    pos: canvasRect.height,
    label: 'Canvas Bottom',
    source: 'canvas',
  });

  // Inner canvas margin guides (safe zone)
  const margin = 40; // 40px margin from edges
  guides.push({
    id: 'canvas-margin-left',
    type: 'v',
    pos: margin,
    label: 'Safe Zone Left',
    source: 'canvas',
  });
  guides.push({
    id: 'canvas-margin-right',
    type: 'v',
    pos: canvasRect.width - margin,
    label: 'Safe Zone Right',
    source: 'canvas',
  });
  guides.push({
    id: 'canvas-margin-top',
    type: 'h',
    pos: margin,
    label: 'Safe Zone Top',
    source: 'canvas',
  });
  guides.push({
    id: 'canvas-margin-bottom',
    type: 'h',
    pos: canvasRect.height - margin,
    label: 'Safe Zone Bottom',
    source: 'canvas',
  });

  // Element edges and centers
  for (const el of elements) {
    if (excludeIds.includes(el.id)) continue;
    const bounds = getElementBounds(el);

    // Vertical guides (left, center, right)
    guides.push({
      id: `el-${el.id}-l`,
      type: 'v',
      pos: bounds.left,
      label: 'Left Edge',
      source: el.id,
    });
    guides.push({
      id: `el-${el.id}-r`,
      type: 'v',
      pos: bounds.right,
      label: 'Right Edge',
      source: el.id,
    });
    guides.push({
      id: `el-${el.id}-cx`,
      type: 'v',
      pos: bounds.centerX,
      label: 'Center X',
      source: el.id,
    });

    // Horizontal guides (top, center, bottom)
    guides.push({
      id: `el-${el.id}-t`,
      type: 'h',
      pos: bounds.top,
      label: 'Top Edge',
      source: el.id,
    });
    guides.push({
      id: `el-${el.id}-b`,
      type: 'h',
      pos: bounds.bottom,
      label: 'Bottom Edge',
      source: el.id,
    });
    guides.push({
      id: `el-${el.id}-cy`,
      type: 'h',
      pos: bounds.centerY,
      label: 'Center Y',
      source: el.id,
    });
  }

  return guides;
}

/**
 * Find nearest guide within threshold for a given position
 */
export function findNearestGuide(
  position: number,
  guides: Guide[],
  threshold: number,
  type: 'v' | 'h'
): { guide?: Guide; delta: number } {
  let best: Guide | undefined;
  let bestDelta = threshold + 1;

  for (const guide of guides) {
    if (guide.type !== type) continue;
    const delta = guide.pos - position;
    if (Math.abs(delta) <= threshold && Math.abs(delta) < Math.abs(bestDelta)) {
      best = guide;
      bestDelta = delta;
    }
  }

  if (!best) return { guide: undefined, delta: 0 };
  return { guide: best, delta: bestDelta };
}

/**
 * Compute snap adjustments for moving bounds
 * Returns dx/dy to apply and active guides to render
 * 
 * IMPORTANT: All coordinates should be in canvas space (element.x, element.y)
 * NOT in viewport/screen space. The canvas origin is at (0, 0).
 */
export function computeSnap(
  canvasRect: { left: number; top: number; width: number; height: number },
  allElements: Array<{ id: string; x: number; y: number; width: number; height: number }>,
  movingBounds: ElementBounds,
  excludeIds: string[],
  threshold = 8
): SnapComputeResult {
  const guides = buildGuides(canvasRect, allElements, excludeIds);

  // Candidate positions for snapping
  const verticalCandidates = [
    { key: 'left', pos: movingBounds.left, type: 'v' as const },
    { key: 'right', pos: movingBounds.right, type: 'v' as const },
    { key: 'centerX', pos: movingBounds.centerX, type: 'v' as const },
  ];

  const horizontalCandidates = [
    { key: 'top', pos: movingBounds.top, type: 'h' as const },
    { key: 'bottom', pos: movingBounds.bottom, type: 'h' as const },
    { key: 'centerY', pos: movingBounds.centerY, type: 'h' as const },
  ];

  let dx = 0;
  let dy = 0;
  const activeGuides: Guide[] = [];
  let badge: { x: number; y: number; text: string } | null = null;

  // Vertical snapping: find best match
  let bestV: { guide?: Guide; deltaAbs: number; delta: number; key?: string } = {
    guide: undefined,
    deltaAbs: Infinity,
    delta: 0,
  };

  for (const candidate of verticalCandidates) {
    const result = findNearestGuide(candidate.pos, guides, threshold, 'v');
    if (result.guide && Math.abs(result.delta) < bestV.deltaAbs) {
      bestV = {
        guide: result.guide,
        deltaAbs: Math.abs(result.delta),
        delta: result.delta,
        key: candidate.key,
      };
    }
  }

  if (bestV.guide) {
    dx = -bestV.delta;
    activeGuides.push(bestV.guide);
    badge = { x: bestV.guide.pos, y: 0, text: bestV.key || 'x' };
  }

  // Horizontal snapping: find best match
  let bestH: { guide?: Guide; deltaAbs: number; delta: number; key?: string } = {
    guide: undefined,
    deltaAbs: Infinity,
    delta: 0,
  };

  for (const candidate of horizontalCandidates) {
    const result = findNearestGuide(candidate.pos, guides, threshold, 'h');
    if (result.guide && Math.abs(result.delta) < bestH.deltaAbs) {
      bestH = {
        guide: result.guide,
        deltaAbs: Math.abs(result.delta),
        delta: result.delta,
        key: candidate.key,
      };
    }
  }

  if (bestH.guide) {
    dy = -bestH.delta;
    activeGuides.push(bestH.guide);
    if (badge) {
      badge.text += ` + ${bestH.key}`;
    } else {
      badge = { x: 0, y: bestH.guide.pos, text: bestH.key || 'y' };
    }
  }

  return { dx, dy, activeGuides, badge };
}

/**
 * Compute bounding box for multiple elements (multi-select)
 */
export function computeSelectionBounds(
  elements: Array<{ x: number; y: number; width: number; height: number }>
): ElementBounds {
  if (elements.length === 0) {
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      centerX: 0,
      centerY: 0,
      width: 0,
      height: 0,
    };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const el of elements) {
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.width);
    maxY = Math.max(maxY, el.y + el.height);
  }

  const width = maxX - minX;
  const height = maxY - minY;

  return {
    left: minX,
    right: maxX,
    top: minY,
    bottom: maxY,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
    width,
    height,
  };
}

/**
 * Example usage:
 * 
 * // During drag:
 * const movingBounds = getElementBounds(element);
 * const canvasRect = { left: 0, top: 0, width: 1080, height: 1080 };
 * 
 * const snap = computeSnap(
 *   canvasRect,
 *   allElements,
 *   movingBounds,
 *   [element.id], // exclude self
 *   8 // threshold
 * );
 * 
 * // Apply snap adjustments
 * const finalX = element.x + snap.dx;
 * const finalY = element.y + snap.dy;
 * 
 * // Render guides
 * setActiveGuides(snap.activeGuides);
 * 
 * // Show badge
 * if (snap.badge) {
 *   showAlignmentBadge(snap.badge);
 * }
 */
