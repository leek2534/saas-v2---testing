
import React from 'react';

interface GSAPDraggableWrapperProps {
  children: React.ReactNode;
  className?: string;
  onDragStart?: () => void;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  bounds?: string | HTMLElement;
  enabled?: boolean;
  dataId?: string;
}

/**
 * GSAP Draggable Wrapper Component
 * DISABLED: Element dragging is now handled via move up/down buttons only
 * Elements should not be draggable on the canvas
 */
export function GSAPDraggableWrapper({
  children,
  className = '',
  dataId,
}: GSAPDraggableWrapperProps) {
  // DISABLED: No dragging for elements - they use move up/down buttons instead
  return (
    <div className={className} data-draggable-id={dataId}>
      {children}
    </div>
  );
}

/**
 * Hook to manage multiple GSAP Draggable instances
 * DISABLED: Element dragging is disabled
 */
export function useGSAPDraggables(
  _selector: string,
  _options: {
    bounds?: string | HTMLElement;
    onDrag?: (id: string, x: number, y: number) => void;
    onDragEnd?: (id: string) => void;
    enabled?: boolean;
  } = {}
) {
  // DISABLED: No dragging for elements
  return { current: null };
}
