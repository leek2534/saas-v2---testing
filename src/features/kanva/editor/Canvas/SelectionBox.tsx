'use client';

import React, { useState, useCallback, useEffect } from 'react';
import type { EditorElement } from '../../lib/editor/types';

interface SelectionBoxProps {
  element: EditorElement;
  onResize: (width: number, height: number, x?: number, y?: number) => void;
  onRotate: (rotation: number) => void;
  onResizeEnd: () => void;
  dragOffset?: { x: number; y: number }; // Optional drag offset for real-time following
  isLocked?: boolean; // Whether the element is locked
  isHovered?: boolean; // Whether the element is hovered
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rotate';

/**
 * SelectionBox - Visual selection indicator with resize handles
 * Allows resizing and rotating selected elements
 */
export function SelectionBox({ element, onResize, onRotate, onResizeEnd, dragOffset = { x: 0, y: 0 }, isLocked = false, isHovered = false }: SelectionBoxProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [resizeStart, setResizeStart] = useState({ 
    x: 0, 
    y: 0, 
    width: 0, 
    height: 0,
    elementX: 0,
    elementY: 0,
  });
  const [rotationStart, setRotationStart] = useState({
    angle: 0,
    mouseX: 0,
    mouseY: 0,
    centerX: 0,
    centerY: 0,
  });

  // Handle resize start
  const handleResizeStart = useCallback((handle: ResizeHandle, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height,
      elementX: element.x,
      elementY: element.y,
    });
  }, [element.width, element.height, element.x, element.y]);

  // Handle rotation start
  const handleRotateStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) return;
    
    setIsRotating(true);
    
    // Get element center in screen coordinates
    const elementRect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!elementRect) return;
    
    const centerX = elementRect.left + elementRect.width / 2;
    const centerY = elementRect.top + elementRect.height / 2;
    
    setRotationStart({
      angle: element.rotation || 0,
      mouseX: e.clientX,
      mouseY: e.clientY,
      centerX,
      centerY,
    });
  }, [element.rotation, isLocked]);

  // Handle resize move
  useEffect(() => {
    if (!isResizing || !resizeHandle) return;

    // Get zoom from canvas viewport
    let zoom = 1;
    const artboard = document.getElementById('kanva-artboard');
    const artboardParent = artboard?.parentElement;
    if (artboardParent) {
      const computedStyle = window.getComputedStyle(artboardParent);
      const transform = computedStyle.transform;
      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        zoom = matrix.a;
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = resizeStart.elementX;
      let newY = resizeStart.elementY;
      let needsPositionUpdate = false;

      // Calculate new dimensions based on handle
      if (resizeHandle.includes('e')) {
        newWidth = Math.max(20, resizeStart.width + deltaX / zoom);
      }
      if (resizeHandle.includes('w')) {
        const widthChange = deltaX / zoom;
        newWidth = Math.max(20, resizeStart.width - widthChange);
        newX = resizeStart.elementX + widthChange;
        needsPositionUpdate = true;
      }
      if (resizeHandle.includes('s')) {
        newHeight = Math.max(20, resizeStart.height + deltaY / zoom);
      }
      if (resizeHandle.includes('n')) {
        const heightChange = deltaY / zoom;
        newHeight = Math.max(20, resizeStart.height - heightChange);
        newY = resizeStart.elementY + heightChange;
        needsPositionUpdate = true;
      }

      // Update size and position (for handles that move the element: w, n, nw, ne, sw)
      if (needsPositionUpdate) {
        onResize(newWidth, newHeight, newX, newY);
      } else {
        onResize(newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
      onResizeEnd();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeHandle, resizeStart, onResize, onResizeEnd]);

  // Handle rotation move
  useEffect(() => {
    if (!isRotating) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      // Calculate angle from center to current mouse position
      const deltaX = e.clientX - rotationStart.centerX;
      const deltaY = e.clientY - rotationStart.centerY;
      const angleRad = Math.atan2(deltaY, deltaX);
      const angleDeg = angleRad * (180 / Math.PI);
      
      // Calculate angle from center to start mouse position
      const startDeltaX = rotationStart.mouseX - rotationStart.centerX;
      const startDeltaY = rotationStart.mouseY - rotationStart.centerY;
      const startAngleRad = Math.atan2(startDeltaY, startDeltaX);
      const startAngleDeg = startAngleRad * (180 / Math.PI);
      
      // Calculate rotation delta
      let rotationDelta = angleDeg - startAngleDeg;
      let newRotation = rotationStart.angle + rotationDelta;
      
      // Snap to 15-degree increments when Shift is held
      if (e.shiftKey) {
        newRotation = Math.round(newRotation / 15) * 15;
      }
      
      // Normalize to 0-360 range
      newRotation = ((newRotation % 360) + 360) % 360;
      
      onRotate(newRotation);
    };

    const handleMouseUp = () => {
      setIsRotating(false);
      onResizeEnd(); // Reuse for history
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isRotating, rotationStart, onRotate, onResizeEnd]);

  const handles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  const showRotateHandle = true; // Can be made conditional based on element type

  const getHandleStyle = (handle: ResizeHandle): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      width: '12px',
      height: '12px',
      backgroundColor: '#fff',
      border: '2.5px solid #4F46E5',
      borderRadius: '2px',
      cursor: `${handle}-resize`,
      zIndex: 2001,
      boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)',
      transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    // Position handles (outside the element bounds)
    if (handle.includes('n')) baseStyle.top = '-6px';
    if (handle.includes('s')) baseStyle.bottom = '-6px';
    if (handle.includes('e')) baseStyle.right = '-6px';
    if (handle.includes('w')) baseStyle.left = '-6px';
    if (!handle.includes('n') && !handle.includes('s')) baseStyle.top = '50%';
    if (!handle.includes('e') && !handle.includes('w')) baseStyle.left = '50%';
    if (baseStyle.top === '50%') baseStyle.transform = 'translateY(-50%)';
    if (baseStyle.left === '50%') baseStyle.transform = baseStyle.transform ? `${baseStyle.transform} translateX(-50%)` : 'translateX(-50%)';

    return baseStyle;
  };

  // Calculate transform accounting for drag offset (follows element in real-time)
  const transformValue = dragOffset.x !== 0 || dragOffset.y !== 0
    ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${element.rotation || 0}deg)`
    : `rotate(${element.rotation || 0}deg)`;

  // Determine border style based on state
  const getBorderStyle = () => {
    if (isLocked) {
      return {
        border: '2.5px dashed rgba(156, 163, 175, 0.7)',
        boxShadow: '0 0 0 1px rgba(156, 163, 175, 0.3)',
      };
    }
    // Selected state - vibrant blue border with strong glow
    return {
      border: '2.5px solid #4F46E5',
      boxShadow: '0 0 0 1px rgba(79, 70, 229, 0.4), 0 0 8px rgba(79, 70, 229, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
    };
  };

  const borderStyle = getBorderStyle();
  const showHandles = !isLocked; // Only show handles when selected and not locked

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        inset: 0,
        transform: dragOffset.x !== 0 || dragOffset.y !== 0 ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : 'none',
        transition: 'border 0.15s ease, box-shadow 0.15s ease',
        zIndex: 2000,
        ...borderStyle,
        pointerEvents: 'none',
        boxSizing: 'border-box',
      }}
    >
      {/* Resize handles - only show when selected (not just hovered) */}
      {showHandles && handles.map((handle) => (
        <div
          key={handle}
          className="pointer-events-auto hover:scale-110 active:scale-95"
          style={getHandleStyle(handle)}
          onMouseDown={(e) => handleResizeStart(handle, e)}
        />
      ))}

      {/* Rotation handle - only show when selected */}
      {showRotateHandle && showHandles && (
        <div
          className="pointer-events-auto hover:scale-110 active:scale-95"
          style={{
            position: 'absolute',
            width: '32px',
            height: '32px',
            backgroundColor: '#fff',
            border: '2.5px solid #4F46E5',
            borderRadius: '50%',
            cursor: isRotating ? 'grabbing' : 'grab',
            top: '-48px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2001,
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseDown={handleRotateStart}
          title="Rotate (Shift+drag to snap to 15°)"
        >
          {/* Circular arrow rotation icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6" />
            <path d="M21 12a9 9 0 1 1-2.636-6.364L21.5 8" />
          </svg>
          {/* Connection line to element */}
          <div 
            style={{
              position: 'absolute',
              width: '2px',
              height: '16px',
              background: 'linear-gradient(to bottom, rgba(79, 70, 229, 0.6), rgba(79, 70, 229, 0.2))',
              left: '50%',
              top: '100%',
              transform: 'translateX(-50%)',
              borderRadius: '1px',
            }}
          />
        </div>
      )}
    </div>
  );
}

