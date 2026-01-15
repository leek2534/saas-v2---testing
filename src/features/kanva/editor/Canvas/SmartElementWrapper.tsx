'use client';

import { useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { useEditorStore } from '../../lib/editor/store';
import type { EditorElement } from '../../lib/editor/types';
import type { AlignmentGuide } from '../../lib/editor/snapEngine';
import { EnhancedSelectionBox } from './EnhancedSelectionBox';
import { SmartAlignmentGuides } from './SmartAlignmentGuides';
import { buildSpatialIndex, snapPosition } from '../../lib/editor/snapEngine';
import { Lock } from 'lucide-react';

interface SmartElementWrapperProps {
  element: EditorElement;
  isSelected: boolean;
  children: ReactNode;
}

/**
 * SmartElementWrapper - Wraps elements with smart drag, resize, and snap functionality
 * Provides unified interaction layer for all element types
 */
export function SmartElementWrapper({ element, isSelected, children }: SmartElementWrapperProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [guides, setGuides] = useState<AlignmentGuide[]>([]);
  const [modifierKeys, setModifierKeys] = useState({ alt: false, ctrl: false });
  
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const rafIdRef = useRef<number | null>(null);

  const updateElement = useEditorStore((s) => s.updateElement);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);
  const elements = useEditorStore((s) => s.elements);
  const canvas = useEditorStore((s) => s.canvas);

  const isLocked = element.locked || false;

  // Track modifier keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setModifierKeys({ alt: e.altKey, ctrl: e.ctrlKey });
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setModifierKeys({ alt: e.altKey, ctrl: e.ctrlKey });
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

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds([element.id]);
    
    if (isLocked) return;
    
    setIsHovered(false);
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
    
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: element.x,
      elementY: element.y,
    };
  }, [element.id, element.x, element.y, isLocked, setSelectedIds]);

  // Handle drag move with snapping
  useEffect(() => {
    if (!isDragging) return;

    const disableSnap = modifierKeys.alt || modifierKeys.ctrl;
    const pendingUpdate = { x: 0, y: 0 };

    const updatePosition = () => {
      setDragOffset({ ...pendingUpdate });
      rafIdRef.current = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Get zoom on every move to handle screen size changes
      const zoom = getZoom();
      
      const deltaX = (e.clientX - dragStartRef.current.x) / zoom;
      const deltaY = (e.clientY - dragStartRef.current.y) / zoom;
      
      let newX = dragStartRef.current.elementX + deltaX;
      let newY = dragStartRef.current.elementY + deltaY;

      // Apply snapping
      if (!disableSnap) {
        const spatialIndex = buildSpatialIndex(elements, canvas.width, canvas.height, [element.id]);
        const snapResult = snapPosition(
          { id: element.id, x: newX, y: newY, width: element.width, height: element.height, rotation: element.rotation || 0 },
          spatialIndex,
          disableSnap
        );

        // Apply snap adjustments
        if (snapResult.x !== undefined) {
          newX = snapResult.x;
        }
        if (snapResult.y !== undefined) {
          newY = snapResult.y;
        }
        
        // Show guides whenever they exist (even if not snapped yet)
        // This provides visual feedback as you approach snap points
        setGuides(snapResult.guides || []);
      } else {
        setGuides([]);
      }

      pendingUpdate.x = newX - dragStartRef.current.elementX;
      pendingUpdate.y = newY - dragStartRef.current.elementY;

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updatePosition);
      }
    };

    const handleMouseUp = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      const finalX = dragStartRef.current.elementX + dragOffset.x;
      const finalY = dragStartRef.current.elementY + dragOffset.y;

      if (Math.abs(dragOffset.x) > 0.1 || Math.abs(dragOffset.y) > 0.1) {
        updateElement(element.id, { x: finalX, y: finalY });
        pushHistory(getStateSnapshot());
      }

      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      setGuides([]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isDragging, element, elements, canvas, modifierKeys, dragOffset, getZoom, updateElement, pushHistory]);

  // Handle resize
  const handleResize = useCallback((width: number, height: number, x?: number, y?: number) => {
    updateElement(element.id, {
      width,
      height,
      ...(x !== undefined && { x }),
      ...(y !== undefined && { y }),
    });
  }, [element.id, updateElement]);

  // Handle rotation
  const handleRotate = useCallback((rotation: number) => {
    updateElement(element.id, { rotation });
  }, [element.id, updateElement]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    pushHistory(getStateSnapshot());
  }, [pushHistory, getStateSnapshot]);

  const transformValue = dragOffset.x !== 0 || dragOffset.y !== 0
    ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${element.rotation || 0}deg)`
    : `rotate(${element.rotation || 0}deg)`;

  return (
    <>
      {/* Alignment guides - rendered at canvas level */}
      {isSelected && guides.length > 0 && (
        <SmartAlignmentGuides
          guides={guides}
          canvasWidth={canvas.width}
          canvasHeight={canvas.height}
        />
      )}

      {/* Element wrapper */}
      <div
        className={`absolute ${isLocked ? 'cursor-not-allowed' : 'cursor-move'} ${isHovered && !isLocked ? 'ring-2 ring-primary/30' : ''}`}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          transform: transformValue,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          zIndex: element.zIndex || 0,
          pointerEvents: 'auto',
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !isDragging && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Lock indicator */}
        {isLocked && (
          <div
            className="absolute top-2 right-2 bg-gray-500/90 text-white p-1.5 rounded-md shadow-lg z-10 pointer-events-none"
            title="Element is locked"
          >
            <Lock size={14} />
          </div>
        )}

        {/* Element content */}
        {children}

        {/* Selection box */}
        {isSelected && (
          <EnhancedSelectionBox
            element={element}
            allElements={elements}
            canvasWidth={canvas.width}
            canvasHeight={canvas.height}
            onResize={handleResize}
            onRotate={handleRotate}
            onResizeEnd={handleResizeEnd}
            onGuidesChange={setGuides}
            dragOffset={dragOffset}
            isLocked={isLocked}
          />
        )}
      </div>
    </>
  );
}
