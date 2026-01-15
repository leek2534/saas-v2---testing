/**
 * useSnapping hook - Professional snapping integration for Kanva
 * Computes snap adjustments during drag operations
 */

import { useCallback } from 'react';
import {
  computeSnap,
  type ElementBounds,
  type SnapComputeResult,
} from '../lib/editor/snapEnhanced';

export function useSnapping() {
  /**
   * Compute snap adjustments for moving element(s)
   * 
   * @param canvasRect - Canvas dimensions and position
   * @param allElements - All elements in the canvas
   * @param movingBounds - Bounds of the element(s) being moved
   * @param excludeIds - IDs to exclude from snapping (usually the moving element(s))
   * @param threshold - Snap threshold in pixels (default 8)
   * @returns Snap result with dx/dy adjustments and active guides
   */
  const computeSnapAdjustments = useCallback(
    (
      canvasRect: { left: number; top: number; width: number; height: number },
      allElements: Array<{ id: string; x: number; y: number; width: number; height: number }>,
      movingBounds: ElementBounds,
      excludeIds: string[],
      threshold = 8
    ): SnapComputeResult => {
      return computeSnap(canvasRect, allElements, movingBounds, excludeIds, threshold);
    },
    []
  );

  return computeSnapAdjustments;
}

/**
 * Example usage in a drag handler:
 * 
 * const computeSnapAdjustments = useSnapping();
 * 
 * function onDragMove(rawDx: number, rawDy: number) {
 *   const allElements = useEditorStore.getState().elements;
 *   const selectedIds = useEditorStore.getState().selectedIds;
 *   
 *   // Get current bounds
 *   const element = allElements.find(e => e.id === selectedIds[0]);
 *   if (!element) return;
 *   
 *   const movingBounds = {
 *     left: element.x + rawDx,
 *     right: element.x + element.width + rawDx,
 *     top: element.y + rawDy,
 *     bottom: element.y + element.height + rawDy,
 *     centerX: element.x + element.width / 2 + rawDx,
 *     centerY: element.y + element.height / 2 + rawDy,
 *     width: element.width,
 *     height: element.height,
 *   };
 *   
 *   // Compute snap
 *   const canvasRect = { left: 0, top: 0, width: 1080, height: 1080 };
 *   const snap = computeSnapAdjustments(
 *     canvasRect,
 *     allElements,
 *     movingBounds,
 *     selectedIds,
 *     8
 *   );
 *   
 *   // Apply snap adjustments
 *   const finalDx = rawDx + snap.dx;
 *   const finalDy = rawDy + snap.dy;
 *   
 *   // Update element position
 *   updateElement(element.id, {
 *     x: element.x + finalDx,
 *     y: element.y + finalDy,
 *   });
 *   
 *   // Update active guides for rendering
 *   setActiveGuides(snap.activeGuides);
 *   
 *   // Show alignment badge
 *   if (snap.badge) {
 *     setAlignmentBadge(snap.badge);
 *   }
 * }
 */
