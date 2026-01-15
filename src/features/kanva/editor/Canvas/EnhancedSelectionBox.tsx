'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { EditorElement } from '../../lib/editor/types';
import type { AlignmentGuide } from '../../lib/editor/snapEngine';
import {
  buildSpatialIndex,
  snapPosition,
  snapRotation,
  SNAP_THRESHOLD,
} from '../../lib/editor/snapEngine';

interface EnhancedSelectionBoxProps {
  element: EditorElement;
  allElements: EditorElement[];
  canvasWidth: number;
  canvasHeight: number;
  onResize: (width: number, height: number, x?: number, y?: number) => void;
  onRotate: (rotation: number) => void;
  onResizeEnd: () => void;
  onGuidesChange?: (guides: AlignmentGuide[]) => void;
  dragOffset?: { x: number; y: number };
  isLocked?: boolean;
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

/**
 * EnhancedSelectionBox - Professional selection UI with smart snapping
 * Features:
 * - 8 resize handles + rotation handle
 * - Shift: maintain aspect ratio
 * - Alt/Ctrl: disable snapping
 * - Option/Cmd: scale from center
 * - Smart snap to edges, centers, and other elements
 * - Visual alignment guides
 */
export function EnhancedSelectionBox({
  element,
  allElements,
  canvasWidth,
  canvasHeight,
  onResize,
  onRotate,
  onResizeEnd,
  onGuidesChange,
  dragOffset = { x: 0, y: 0 },
  isLocked = false,
}: EnhancedSelectionBoxProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [modifierKeys, setModifierKeys] = useState({
    shift: false,
    alt: false,
    ctrl: false,
    meta: false,
  });
  
  const resizeStartRef = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    elementX: 0,
    elementY: 0,
    rotation: 0,
    centerX: 0,
    centerY: 0,
  });

  // Track modifier keys globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setModifierKeys({
        shift: e.shiftKey,
        alt: e.altKey,
        ctrl: e.ctrlKey,
        meta: e.metaKey,
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setModifierKeys({
        shift: e.shiftKey,
        alt: e.altKey,
        ctrl: e.ctrlKey,
        meta: e.metaKey,
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Get viewport zoom
  const getZoom = useCallback(() => {
    const artboard = document.getElementById('kanva-artboard');
    const artboardParent = artboard?.parentElement;
    if (artboardParent) {
      const computedStyle = window.getComputedStyle(artboardParent);
      const transform = computedStyle.transform;
      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        return matrix.a;
      }
    }
    return 1;
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback((handle: ResizeHandle, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height,
      elementX: element.x,
      elementY: element.y,
      rotation: element.rotation || 0,
      centerX,
      centerY,
    };
  }, [element]);

  // Handle rotation start
  const handleRotationStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height,
      elementX: element.x,
      elementY: element.y,
      rotation: element.rotation || 0,
      centerX,
      centerY,
    };
  }, [element]);

  // Handle resize move
  useEffect(() => {
    if (!isResizing || !resizeHandle) return;

    const disableSnap = modifierKeys.alt || modifierKeys.ctrl;
    const maintainAspect = modifierKeys.shift;
    const scaleFromCenter = modifierKeys.meta; // Cmd/Option on Mac

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      // Get zoom on every move to handle screen size changes
      const zoom = getZoom();
      
      const deltaX = (e.clientX - resizeStartRef.current.x) / zoom;
      const deltaY = (e.clientY - resizeStartRef.current.y) / zoom;

      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;
      let newX = resizeStartRef.current.elementX;
      let newY = resizeStartRef.current.elementY;

      const aspectRatio = resizeStartRef.current.width / resizeStartRef.current.height;

      // Calculate new dimensions based on handle
      if (scaleFromCenter) {
        // Scale from center
        if (resizeHandle.includes('e')) {
          newWidth = Math.max(20, resizeStartRef.current.width + deltaX * 2);
          newX = resizeStartRef.current.centerX - newWidth / 2;
        }
        if (resizeHandle.includes('w')) {
          newWidth = Math.max(20, resizeStartRef.current.width - deltaX * 2);
          newX = resizeStartRef.current.centerX - newWidth / 2;
        }
        if (resizeHandle.includes('s')) {
          newHeight = Math.max(20, resizeStartRef.current.height + deltaY * 2);
          newY = resizeStartRef.current.centerY - newHeight / 2;
        }
        if (resizeHandle.includes('n')) {
          newHeight = Math.max(20, resizeStartRef.current.height - deltaY * 2);
          newY = resizeStartRef.current.centerY - newHeight / 2;
        }
      } else {
        // Scale from opposite edge
        if (resizeHandle.includes('e')) {
          newWidth = Math.max(20, resizeStartRef.current.width + deltaX);
        }
        if (resizeHandle.includes('w')) {
          newWidth = Math.max(20, resizeStartRef.current.width - deltaX);
          newX = resizeStartRef.current.elementX + deltaX;
        }
        if (resizeHandle.includes('s')) {
          newHeight = Math.max(20, resizeStartRef.current.height + deltaY);
        }
        if (resizeHandle.includes('n')) {
          newHeight = Math.max(20, resizeStartRef.current.height - deltaY);
          newY = resizeStartRef.current.elementY + deltaY;
        }
      }

      // Maintain aspect ratio if Shift is held
      if (maintainAspect) {
        if (resizeHandle.includes('e') || resizeHandle.includes('w')) {
          newHeight = newWidth / aspectRatio;
          if (resizeHandle.includes('n')) {
            newY = resizeStartRef.current.elementY + (resizeStartRef.current.height - newHeight);
          }
        } else {
          newWidth = newHeight * aspectRatio;
          if (resizeHandle.includes('w')) {
            newX = resizeStartRef.current.elementX + (resizeStartRef.current.width - newWidth);
          }
        }
      }

      // Apply snapping to position if not disabled
      if (!disableSnap) {
        const spatialIndex = buildSpatialIndex(allElements, canvasWidth, canvasHeight, [element.id]);
        const snapResult = snapPosition(
          { id: element.id, x: newX, y: newY, width: newWidth, height: newHeight, rotation: element.rotation || 0 },
          spatialIndex,
          disableSnap
        );

        if (snapResult.x !== undefined) newX = snapResult.x;
        if (snapResult.y !== undefined) newY = snapResult.y;

        // Only show guides when actually snapped
        if (onGuidesChange) {
          if (snapResult.snappedX || snapResult.snappedY) {
            onGuidesChange(snapResult.guides);
          } else {
            onGuidesChange([]);
          }
        }
      } else {
        if (onGuidesChange) {
          onGuidesChange([]);
        }
      }

      onResize(newWidth, newHeight, newX, newY);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
      onResizeEnd();
      if (onGuidesChange) {
        onGuidesChange([]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeHandle, modifierKeys, element, allElements, canvasWidth, canvasHeight, getZoom, onResize, onResizeEnd, onGuidesChange]);

  // Handle rotation move
  useEffect(() => {
    if (!isRotating) return;

    const disableSnap = modifierKeys.alt || modifierKeys.ctrl;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();

      // Get artboard and viewport info to convert canvas coords to screen coords
      const artboard = document.getElementById('kanva-artboard');
      const transformedContainer = artboard?.parentElement;
      const viewport = transformedContainer?.parentElement;
      
      if (!artboard || !transformedContainer || !viewport) return;

      // Get viewport bounds and transform
      const viewportRect = viewport.getBoundingClientRect();
      const transform = window.getComputedStyle(transformedContainer).transform;
      
      let panX = 0, panY = 0, zoom = 1;
      if (transform && transform !== 'none') {
        const matrix = transform.match(/matrix\(([^)]+)\)/);
        if (matrix) {
          const values = matrix[1].split(',').map(parseFloat);
          zoom = values[0];
          panX = values[4];
          panY = values[5];
        }
      }

      // Convert element center from canvas space to screen space
      const centerScreenX = viewportRect.left + (resizeStartRef.current.centerX * zoom) + panX;
      const centerScreenY = viewportRect.top + (resizeStartRef.current.centerY * zoom) + panY;

      // Calculate angle from center to mouse
      const angle = Math.atan2(
        e.clientY - centerScreenY,
        e.clientX - centerScreenX
      ) * (180 / Math.PI);

      let newRotation = angle + 90; // Adjust for handle position

      // Apply rotation snapping
      const snapResult = snapRotation(newRotation, disableSnap);
      newRotation = snapResult.rotation;

      onRotate(newRotation);
    };

    const handleMouseUp = () => {
      setIsRotating(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isRotating, modifierKeys, onRotate]);

  const handles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

  const getHandleStyle = (handle: ResizeHandle): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      width: '12px',
      height: '12px',
      backgroundColor: '#fff',
      border: '2.5px solid #4F46E5',
      borderRadius: '50%',
      cursor: `${handle}-resize`,
      zIndex: 2001,
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
      transition: 'transform 0.15s, box-shadow 0.15s',
    };

    // Position handles
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

  const transformValue = dragOffset.x !== 0 || dragOffset.y !== 0
    ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${element.rotation || 0}deg)`
    : `rotate(${element.rotation || 0}deg)`;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: transformValue,
        transformOrigin: 'center center',
        transition: 'none',
        zIndex: (element.zIndex || 0) + 2000,
        border: isLocked ? '1.5px dashed rgba(156, 163, 175, 0.6)' : '1.5px solid rgba(79, 70, 229, 0.9)',
        boxShadow: isLocked ? 'none' : '0 0 0 0.5px rgba(79, 70, 229, 0.3)',
        pointerEvents: 'none',
        boxSizing: 'border-box',
      }}
    >
      {/* Resize handles */}
      {!isLocked && handles.map((handle) => (
        <div
          key={handle}
          className="pointer-events-auto hover:scale-125 hover:shadow-xl active:scale-110"
          style={getHandleStyle(handle)}
          onMouseDown={(e) => handleResizeStart(handle, e)}
          title={`Resize ${handle.toUpperCase()} • Shift: aspect ratio • Alt: no snap • Cmd: from center`}
        />
      ))}

      {/* Locked handles */}
      {isLocked && handles.map((handle) => (
        <div
          key={handle}
          className="pointer-events-none"
          style={{
            ...getHandleStyle(handle),
            opacity: 0.3,
            cursor: 'not-allowed',
          }}
        />
      ))}

      {/* Rotation handle */}
      {!isLocked && (
        <div
          className="pointer-events-auto hover:scale-125 hover:shadow-xl active:scale-110 cursor-grab active:cursor-grabbing"
          style={{
            position: 'absolute',
            width: '14px',
            height: '14px',
            backgroundColor: '#fff',
            border: '2.5px solid #4F46E5',
            borderRadius: '50%',
            top: '-35px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2001,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseDown={handleRotationStart}
          title="Rotate • Snaps to 15° increments • Alt: disable snap"
        >
          {/* Rotation icon */}
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4F46E5"
            strokeWidth="3"
            style={{ position: 'absolute', top: '1px', left: '1px' }}
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          {/* Connection line */}
          <div
            style={{
              position: 'absolute',
              width: '2.5px',
              height: '27px',
              backgroundColor: '#4F46E5',
              left: '50%',
              top: '100%',
              transform: 'translateX(-50%)',
              opacity: 0.5,
            }}
          />
        </div>
      )}

      {/* Modifier key hints */}
      {(isResizing || isRotating) && (
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-45px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 3000,
          }}
        >
          {modifierKeys.shift && '⇧ Aspect Ratio'}
          {modifierKeys.meta && ' • ⌘ From Center'}
          {modifierKeys.alt && ' • ⌥ No Snap'}
          {!modifierKeys.shift && !modifierKeys.meta && !modifierKeys.alt && 'Hold Shift/Cmd/Alt for options'}
        </div>
      )}
    </div>
  );
}
