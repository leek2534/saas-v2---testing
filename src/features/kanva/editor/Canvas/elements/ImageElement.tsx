'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useEditorStore } from '../../../lib/editor/store';
import type { ImageElement as ImageElementType } from '../../../lib/editor/types';
import { SelectionBox } from '../SelectionBox';
import { Lock } from 'lucide-react';

interface ImageElementProps {
  element: ImageElementType;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onHover: (id: string | null) => void;
  onDragStart: (element: ImageElementType) => void;
}

/**
 * ImageElement - Draggable, resizable image
 * Uses CSS transforms for positioning and scaling
 */
export function ImageElement({ element, isSelected, isHovered, onSelect, onHover, onDragStart }: ImageElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Visual offset during drag
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  
  const updateElement = useEditorStore((s) => s.updateElement);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);

  // Debug: Log when element renders
  useEffect(() => {
    console.log('[ImageElement] Rendering element:', { id: element.id, x: element.x, y: element.y, width: element.width, height: element.height, src: element.src });
  }, [element.id]);

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
    const pendingUpdateRef = { x: 0, y: 0 };
    let zoom = 1;

    // Cache zoom calculation once
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
      setDragOffset({ ...pendingUpdateRef });
      rafId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      // Calculate offset accounting for zoom
      pendingUpdateRef.x = deltaX / zoom;
      pendingUpdateRef.y = deltaY / zoom;

      // Batch updates with requestAnimationFrame for smooth 60fps
      if (rafId === null) {
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    const handleMouseUp = () => {
      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      // Ensure final position is synced
      setDragOffset({ ...pendingUpdateRef });

      // Apply final position to store
      const finalX = dragStartRef.current.elementX + pendingUpdateRef.x;
      const finalY = dragStartRef.current.elementY + pendingUpdateRef.y;
      
      // Use setTimeout to ensure state update completes
      setTimeout(() => {
        updateElement(element.id, {
          x: finalX,
          y: finalY,
        });
        
        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });
        pushHistory(getStateSnapshot());
      }, 0);
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

  // Handle element click (for selection)
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      setSelectedIds([element.id]);
    }
  }, [element.id, isDragging, setSelectedIds]);

  // Apply filters
  const filterStyle: React.CSSProperties = {};
  if (element.filters) {
    const filters: string[] = [];
    if (element.filters.brightness !== undefined) {
      filters.push(`brightness(${element.filters.brightness})`);
    }
    if (element.filters.contrast !== undefined) {
      filters.push(`contrast(${element.filters.contrast})`);
    }
    if (element.filters.blur !== undefined) {
      filters.push(`blur(${element.filters.blur}px)`);
    }
    if (filters.length > 0) {
      filterStyle.filter = filters.join(' ');
    }
  }

  // Calculate position with drag offset for smooth visual feedback
  // Use transform instead of left/top for better performance during drag
  const displayX = element.x + (isDragging ? dragOffset.x : 0);
  const displayY = element.y + (isDragging ? dragOffset.y : 0);
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
        opacity: element.opacity ?? 1,
        cursor: element.metadata?.lock ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
        pointerEvents: 'auto',
        userSelect: 'none',
        willChange: isDragging ? 'transform' : 'auto',
        transition: isDragging ? 'none' : 'none',
        outline: isHovered && !isSelected ? '2.5px solid rgba(79, 70, 229, 0.6)' : 'none',
        outlineOffset: '-2.5px',
        boxShadow: isHovered && !isSelected ? '0 0 0 1px rgba(79, 70, 229, 0.3), 0 0 6px rgba(79, 70, 229, 0.2)' : 'none',
        zIndex: element.zIndex || 0,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
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
      <img
        src={element.src}
        alt=""
        draggable={false}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...filterStyle,
          transform: `scaleX(${element.flip?.x ? -1 : 1}) scaleY(${element.flip?.y ? -1 : 1})`,
          transition: 'opacity 0.2s',
          pointerEvents: 'none', // Allow hover events to pass through to parent
        }}
      />
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
      
      {/* Lock indicator overlay */}
      {element.metadata?.lock && isSelected && (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2002,
          }}
        >
          <div className="bg-gray-800 text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Locked</span>
          </div>
        </div>
      )}
    </div>
  );
}

