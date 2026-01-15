'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useEditorStore } from '../../../lib/editor/store';
import type { IconElement as IconElementType } from '../../../lib/editor/types';
import { SelectionBox } from '../SelectionBox';

interface IconElementProps {
  element: IconElementType;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onHover: (id: string | null) => void;
  onDragStart: (element: IconElementType) => void;
}

/**
 * IconElement - SVG icons/graphics
 * Draggable, resizable with color control
 */
export function IconElement({ element, isSelected, isHovered, onSelect, onHover, onDragStart }: IconElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  
  const updateElement = useEditorStore((s) => s.updateElement);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id, e); // Use centralized selection logic
    
    if (element.metadata?.lock) return; // Prevent dragging when locked
    
    onHover(null); // Clear hover when starting interaction
    onDragStart(element); // Notify parent of drag start
    
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: element.x,
      elementY: element.y,
    };
  }, [element.id, element.x, element.y, element.metadata?.lock, onSelect, onHover, onDragStart]);

  // Handle drag move - optimized with requestAnimationFrame for smooth 60fps
  useEffect(() => {
    if (!isDragging) return;

    let rafId: number | null = null;
    let pendingUpdate = { x: 0, y: 0 };
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

    const updatePosition = () => {
      setDragOffset(pendingUpdate);
      rafId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      pendingUpdate = {
        x: deltaX / zoom,
        y: deltaY / zoom,
      };

      if (rafId === null) {
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    const handleMouseUp = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      const finalX = dragStartRef.current.elementX + pendingUpdate.x;
      const finalY = dragStartRef.current.elementY + pendingUpdate.y;
      
      updateElement(element.id, {
        x: finalX,
        y: finalY,
      });
      
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      pushHistory(getStateSnapshot());
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, element.id, updateElement, pushHistory, getStateSnapshot]);

  const transformValue = isDragging 
    ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${element.rotation || 0}deg)`
    : `rotate(${element.rotation || 0}deg)`;

  return (
    <>
      <div
        ref={elementRef}
        data-element-id={element.id}
        className="absolute flex items-center justify-center"
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          transform: transformValue,
          transition: isDragging ? 'none' : 'all 150ms',
          opacity: element.opacity ?? 1,
          cursor: element.metadata?.lock ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
          pointerEvents: 'auto', // Always allow pointer events so locked elements can be selected/unlocked
          userSelect: 'none',
          color: element.fill || '#000000',
          willChange: isDragging ? 'transform' : 'auto',
          outline: (isHovered || isSelected) ? '2px solid rgba(79, 70, 229, 0.5)' : 'none',
          outlineOffset: '-2px',
          boxShadow: (isHovered || isSelected) ? '0 0 0 2px rgba(79, 70, 229, 0.2)' : 'none',
          zIndex: (element.zIndex || 0) + (isSelected ? 1000 : 0), // Ensure selected elements are above SelectionBox
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => {
          e.stopPropagation();
          if (!isDragging) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsHovered(false);
        }}
      >
        {element.iconPath ? (
          <img 
            src={element.iconPath} 
            alt={element.iconName || 'icon'}
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'contain',
              filter: element.fill ? `brightness(0) saturate(100%)` : 'none',
              pointerEvents: 'none', // Allow hover events to pass through to parent
            }}
          />
        ) : (
          <span style={{ 
            fontSize: `${Math.min(element.width, element.height)}px`,
            pointerEvents: 'none', // Allow hover events to pass through to parent
          }}>
            {element.iconId || '🎨'}
          </span>
        )}
      </div>

      {/* Selection box - show even when locked (but handles disabled) */}
      {isSelected && (
        <SelectionBox
          element={element}
          dragOffset={isDragging ? dragOffset : { x: 0, y: 0 }}
          isLocked={element.metadata?.lock || false}
          onResize={(width, height, x, y) => {
            if (element.metadata?.lock) return; // Prevent resize when locked
            const updates: any = { width, height };
            if (x !== undefined) updates.x = x;
            if (y !== undefined) updates.y = y;
            updateElement(element.id, updates);
          }}
          onRotate={(rotation) => {
            if (element.metadata?.lock) return; // Prevent rotate when locked
            updateElement(element.id, { rotation });
          }}
          onResizeEnd={() => {
            pushHistory(getStateSnapshot());
          }}
        />
      )}
    </>
  );
}

