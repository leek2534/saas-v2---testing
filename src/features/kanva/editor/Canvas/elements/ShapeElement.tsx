'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useEditorStore } from '../../../lib/editor/store';
import type { ShapeElement as ShapeElementType } from '../../../lib/editor/types';
import { SelectionBox } from '../SelectionBox';

interface ShapeElementProps {
  element: ShapeElementType;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onHover: (id: string | null) => void;
  onDragStart: (element: ShapeElementType) => void;
}

/**
 * ShapeElement - Rectangle, Circle, Triangle shapes
 * Uses SVG for crisp rendering at any size
 */
export function ShapeElement({ element, isSelected, isHovered, onSelect, onHover, onDragStart }: ShapeElementProps) {
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

  // Render different shape types
  const renderShape = () => {
    const fill = element.fill || '#000000';
    const stroke = element.stroke?.color || 'transparent';
    const strokeWidth = element.stroke?.width || 0;

    switch (element.shapeType) {
      case 'rectangle':
        return (
          <svg width="100%" height="100%" viewBox={`0 0 ${element.width} ${element.height}`}>
            <rect
              x={strokeWidth / 2}
              y={strokeWidth / 2}
              width={element.width - strokeWidth}
              height={element.height - strokeWidth}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              rx={element.cornerRadius || 0}
            />
          </svg>
        );
      
      case 'circle':
        return (
          <svg width="100%" height="100%" viewBox={`0 0 ${element.width} ${element.height}`}>
            <ellipse
              cx={element.width / 2}
              cy={element.height / 2}
              rx={(element.width - strokeWidth) / 2}
              ry={(element.height - strokeWidth) / 2}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </svg>
        );
      
      case 'triangle':
        const points = `${element.width / 2},${strokeWidth} ${element.width - strokeWidth},${element.height - strokeWidth} ${strokeWidth},${element.height - strokeWidth}`;
        return (
          <svg width="100%" height="100%" viewBox={`0 0 ${element.width} ${element.height}`}>
            <polygon
              points={points}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </svg>
        );
      
      default:
        return null;
    }
  };

  const transformValue = isDragging 
    ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${element.rotation || 0}deg)`
    : `rotate(${element.rotation || 0}deg)`;

  return (
    <div
      ref={elementRef}
      data-element-id={element.id}
      className="absolute"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: transformValue,
        transition: isDragging ? 'none' : 'none',
        opacity: element.opacity ?? 1,
        cursor: element.metadata?.lock ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
        pointerEvents: 'auto',
        userSelect: 'none',
        willChange: isDragging ? 'transform' : 'auto',
        outline: isHovered && !isSelected ? '2.5px solid rgba(79, 70, 229, 0.6)' : 'none',
        outlineOffset: '-2.5px',
        boxShadow: isHovered && !isSelected ? '0 0 0 1px rgba(79, 70, 229, 0.3), 0 0 6px rgba(79, 70, 229, 0.2)' : 'none',
        zIndex: element.zIndex || 0,
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
      {renderShape()}

      {/* Selection box - show even when locked (but handles disabled) */}
      {isSelected && (
        <SelectionBox
          element={element}
          dragOffset={{ x: 0, y: 0 }}
          isLocked={element.metadata?.lock || false}
          isHovered={isHovered}
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
    </div>
  );
}

