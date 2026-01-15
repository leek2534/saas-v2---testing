
import React from 'react';

interface GSAPCanvasDragProps {
  children: React.ReactNode;
  canvasRef?: React.RefObject<HTMLDivElement>;
  enabled?: boolean;
}

/**
 * GSAP Canvas Drag Manager
 * DISABLED: Element dragging is now handled via move up/down buttons only
 * Elements should not be draggable on the canvas
 */
export function GSAPCanvasDrag({ 
  children, 
}: GSAPCanvasDragProps) {
  // DISABLED: No dragging for elements - they use move up/down buttons instead
  return <>{children}</>;
}

/**
 * Hook to enable GSAP Draggable for a specific element
 * DISABLED: Element dragging is disabled
 */
export function useGSAPElementDrag(
  _elementRef: React.RefObject<HTMLElement>,
  _elementId: string,
  _options: {
    bounds?: string | HTMLElement;
    onDrag?: (x: number, y: number) => void;
    onDragEnd?: () => void;
    enabled?: boolean;
  } = {}
) {
  // DISABLED: No dragging for elements
  return { current: null };
}
