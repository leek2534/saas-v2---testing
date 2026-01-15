/**
 * usePointerDrag - High-performance drag hook using Pointer Events + RAF
 * 
 * Benefits over mouse events:
 * - Works with mouse, touch, and pen
 * - Better mobile support
 * - Smooth 60fps with requestAnimationFrame
 * - Automatic pointer capture
 * 
 * Based on Canva blueprint best practices
 */

import { useRef, useCallback } from 'react';

interface PointerDragState {
  isDown: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  pointerId: number | null;
}

interface PointerDragHandlers {
  onDragStart?: (e: PointerEvent) => void;
  onDrag?: (dx: number, dy: number, e: PointerEvent) => void;
  onDragEnd?: (e: PointerEvent) => void;
}

export function usePointerDrag({
  onDragStart,
  onDrag,
  onDragEnd,
}: PointerDragHandlers) {
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef<PointerDragState>({
    isDown: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    pointerId: null,
  });

  // Cleanup RAF on unmount
  const cleanup = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const state = stateRef.current;
      
      // Only process if this is the captured pointer
      if (!state.isDown || state.pointerId !== e.pointerId) return;

      // Update current position
      state.currentX = e.clientX;
      state.currentY = e.clientY;

      // Cancel previous RAF if still pending
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      // Schedule update in next animation frame for smooth 60fps
      rafRef.current = requestAnimationFrame(() => {
        const dx = state.currentX - state.startX;
        const dy = state.currentY - state.startY;
        onDrag?.(dx, dy, e);
        rafRef.current = null;
      });
    },
    [onDrag]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      const state = stateRef.current;
      
      // Only process if this is the captured pointer
      if (!state.isDown || state.pointerId !== e.pointerId) return;

      // Cleanup
      cleanup();
      state.isDown = false;
      state.pointerId = null;

      // Remove listeners
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);

      // Call end handler
      onDragEnd?.(e);
    },
    [cleanup, handlePointerMove, onDragEnd]
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      const state = stateRef.current;

      // Initialize state
      state.isDown = true;
      state.startX = e.clientX;
      state.startY = e.clientY;
      state.currentX = e.clientX;
      state.currentY = e.clientY;
      state.pointerId = e.pointerId;

      // Capture pointer for this element
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);

      // Add listeners
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      document.addEventListener('pointercancel', handlePointerUp);

      // Call start handler
      onDragStart?.(e);
    },
    [handlePointerMove, handlePointerUp, onDragStart]
  );

  return {
    /**
     * Attach this to the element you want to make draggable
     * Example: <div onPointerDown={handlePointerDown}>Drag me</div>
     */
    handlePointerDown,
    
    /**
     * Current drag state (read-only)
     */
    isDragging: stateRef.current.isDown,
    
    /**
     * Manual cleanup (called automatically on unmount)
     */
    cleanup,
  };
}

/**
 * Example usage:
 * 
 * const { handlePointerDown } = usePointerDrag({
 *   onDragStart: (e) => {
 *     console.log('Drag started');
 *   },
 *   onDrag: (dx, dy, e) => {
 *     // Update element position
 *     setPosition({ x: initialX + dx, y: initialY + dy });
 *   },
 *   onDragEnd: (e) => {
 *     console.log('Drag ended');
 *     // Save final position
 *   },
 * });
 * 
 * return <div onPointerDown={handlePointerDown}>Drag me</div>;
 */
