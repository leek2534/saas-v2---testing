'use client';

import React, { useRef, useEffect, useState } from 'react';
import Moveable from 'react-moveable';
import { useEditorStore } from '../../lib/editor/store';
import { useSnapping } from '../../hooks/useSnapping';
import { getElementBounds } from '../../lib/editor/snapEnhanced';
import { useKeyboardModifiers } from '../../hooks/useKeyboardModifiers';

interface MoveableSelectionBoxProps {
  elementId: string;
  isLocked?: boolean;
}

/**
 * MoveableSelectionBox - Professional element selection using React-Moveable
 * Features: Smooth drag, 8-point resize, rotation, guidelines, bounds
 */
export function MoveableSelectionBox({ elementId, isLocked = false }: MoveableSelectionBoxProps) {
  const targetRef = useRef<HTMLElement | null>(null);
  const [frame, setFrame] = useState({
    translate: [0, 0],
    rotate: 0,
    scale: [1, 1],
  });
  
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);
  const canvas = useEditorStore((s) => s.canvas);
  const elements = useEditorStore((s) => s.elements);
  const snapThreshold = useEditorStore((s) => s.snapThreshold);
  const showSnapGuides = useEditorStore((s) => s.showSnapGuides);
  const setActiveGuides = useEditorStore((s) => s.setActiveGuides);
  const setAlignmentBadge = useEditorStore((s) => s.setAlignmentBadge);
  
  // Enhanced snapping hook
  const computeSnapAdjustments = useSnapping();
  
  // Keyboard modifiers
  const modifiers = useKeyboardModifiers();

  // Get the target element
  useEffect(() => {
    const element = document.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement;
    if (element) {
      targetRef.current = element;
    }
  }, [elementId]);

  if (!targetRef.current || isLocked) return null;

  return (
    <Moveable
      target={targetRef.current}
      
      // Enable features
      draggable={true}
      resizable={true}
      rotatable={true}
      
      // Bounds - constrain to canvas
      bounds={{
        left: 0,
        top: 0,
        right: canvas.width,
        bottom: canvas.height,
      }}
      
      // Disable built-in snapping (we use our enhanced system)
      snappable={false}
      
      // Resize handles (8 points)
      renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
      edge={false}
      
      // Keep aspect ratio with Shift key
      keepRatio={false}
      
      // Styling - tight fit around content
      className="moveable-control-box"
      origin={false}
      padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      useMutationObserver={true}
      useResizeObserver={true}
      
      // Performance
      throttleDrag={0}
      throttleResize={0}
      throttleRotate={0}
      
      // Drag callback with enhanced snapping
      onDrag={({ target, beforeTranslate }) => {
        if (!showSnapGuides) {
          target.style.transform = 
            `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px) ` +
            `rotate(${frame.rotate}deg)`;
          return;
        }
        
        // Get element from store
        const element = elements.find(e => e.id === elementId);
        if (!element) return;
        
        // Calculate moving bounds in canvas space
        const movingBounds = getElementBounds({
          ...element,
          x: element.x + beforeTranslate[0],
          y: element.y + beforeTranslate[1],
        });
        
        // Compute snap adjustments
        const canvasRect = {
          left: 0,
          top: 0,
          width: canvas.width,
          height: canvas.height,
        };
        
        const snap = computeSnapAdjustments(
          canvasRect,
          elements,
          movingBounds,
          [elementId],
          snapThreshold
        );
        
        // Update guides and badge
        setActiveGuides(snap.activeGuides);
        if (snap.badge) {
          setAlignmentBadge(snap.badge);
        } else {
          setAlignmentBadge(null);
        }
        
        // Apply snap adjustments
        const finalX = beforeTranslate[0] + snap.dx;
        const finalY = beforeTranslate[1] + snap.dy;
        
        target.style.transform = 
          `translate(${finalX}px, ${finalY}px) ` +
          `rotate(${frame.rotate}deg)`;
      }}
      
      onDragEnd={({ target, lastEvent }) => {
        // Clear guides and badge
        setActiveGuides([]);
        setAlignmentBadge(null);
        
        if (!lastEvent) return;
        
        // Parse the transform to get new position
        const transform = target.style.transform;
        const translateMatch = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
        
        if (translateMatch) {
          const deltaX = parseFloat(translateMatch[1]);
          const deltaY = parseFloat(translateMatch[2]);
          
          // Get current position from element
          const currentX = parseFloat(target.style.left || '0');
          const currentY = parseFloat(target.style.top || '0');
          
          // Update element position
          updateElement(elementId, {
            x: currentX + deltaX,
            y: currentY + deltaY,
          });
          
          // Reset transform
          target.style.transform = `rotate(${frame.rotate}deg)`;
          
          pushHistory(getStateSnapshot());
        }
      }}
      
      // Resize callback
      onResize={({ target, width, height, drag }) => {
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        target.style.transform = 
          `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px) ` +
          `rotate(${frame.rotate}deg)`;
      }}
      
      onResizeEnd={({ target, lastEvent }) => {
        if (!lastEvent) return;
        
        const width = parseFloat(target.style.width);
        const height = parseFloat(target.style.height);
        
        // Parse translate from transform
        const transform = target.style.transform;
        const translateMatch = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
        
        if (translateMatch) {
          const deltaX = parseFloat(translateMatch[1]);
          const deltaY = parseFloat(translateMatch[2]);
          
          const currentX = parseFloat(target.style.left || '0');
          const currentY = parseFloat(target.style.top || '0');
          
          // Update element
          updateElement(elementId, {
            width,
            height,
            x: currentX + deltaX,
            y: currentY + deltaY,
          });
          
          // Reset transform
          target.style.transform = `rotate(${frame.rotate}deg)`;
          
          pushHistory(getStateSnapshot());
        }
      }}
      
      // Rotate callback with Shift snap
      onRotate={({ target, beforeRotate }) => {
        let rotation = beforeRotate;
        
        // Snap rotation to 15° increments when Shift is held
        if (modifiers.shift) {
          const snapAngle = 15;
          rotation = Math.round(rotation / snapAngle) * snapAngle;
        }
        
        target.style.transform = 
          `rotate(${rotation}deg)`;
        setFrame(prev => ({ ...prev, rotate: rotation }));
      }}
      
      onRotateEnd={({ target, lastEvent }) => {
        if (!lastEvent) return;
        
        const rotateMatch = target.style.transform.match(/rotate\(([^)]+)deg\)/);
        if (rotateMatch) {
          const rotation = parseFloat(rotateMatch[1]);
          
          updateElement(elementId, {
            rotation,
          });
          
          pushHistory(getStateSnapshot());
        }
      }}
    />
  );
}
