'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEditorStore } from '../../lib/editor/store';

/**
 * MarqueeSelection - Drag selection box for multi-select
 * 
 * Features:
 * - Drag on canvas background to draw selection box
 * - Automatically selects all elements within box
 * - Visual feedback with animated border
 * - Works with zoom and pan transforms
 */
export function MarqueeSelection() {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  
  const canvasElements = useEditorStore((s) => s.elements);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);

  // Calculate selection box dimensions
  const selectionBox = {
    left: Math.min(startPos.x, currentPos.x),
    top: Math.min(startPos.y, currentPos.y),
    width: Math.abs(currentPos.x - startPos.x),
    height: Math.abs(currentPos.y - startPos.y),
  };

  // Check if element intersects with selection box
  const isElementInSelection = (element: any, box: typeof selectionBox) => {
    const elementRight = element.x + element.width;
    const elementBottom = element.y + element.height;
    const selectionRight = box.left + box.width;
    const selectionBottom = box.top + box.height;

    // Check for intersection
    return !(
      element.x > selectionRight ||
      elementRight < box.left ||
      element.y > selectionBottom ||
      elementBottom < box.top
    );
  };

  // Update selected elements as marquee changes
  useEffect(() => {
    if (!isSelecting || !canvasElements) return;
    
    // Only select if box has minimum size (avoid accidental selections)
    if (selectionBox.width < 5 || selectionBox.height < 5) return;

    const selectedElements = canvasElements.filter((el: any) => isElementInSelection(el, selectionBox));
    const selectedIds = selectedElements.map((el: any) => el.id);
    
    setSelectedIds(selectedIds);
  }, [isSelecting, selectionBox.left, selectionBox.top, selectionBox.width, selectionBox.height, canvasElements, setSelectedIds]);

  // Handle mouse events on artboard
  useEffect(() => {
    const artboard = document.getElementById('kanva-artboard');
    if (!artboard) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Only start selection if clicking directly on artboard (not on elements)
      if (e.target !== artboard) return;
      
      // Get artboard position and zoom
      const artboardParent = artboard.parentElement;
      if (!artboardParent) return;

      const rect = artboard.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(artboardParent);
      const transform = computedStyle.transform;
      
      let zoom = 1;
      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        zoom = matrix.a;
      }

      // Calculate position in canvas space
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;

      setIsSelecting(true);
      setStartPos({ x, y });
      setCurrentPos({ x, y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isSelecting) return;

      const rect = artboard.getBoundingClientRect();
      const artboardParent = artboard.parentElement;
      if (!artboardParent) return;

      const computedStyle = window.getComputedStyle(artboardParent);
      const transform = computedStyle.transform;
      
      let zoom = 1;
      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        zoom = matrix.a;
      }

      // Calculate position in canvas space
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;

      setCurrentPos({ x, y });
    };

    const handleMouseUp = () => {
      setIsSelecting(false);
    };

    artboard.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      artboard.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelecting]);

  // Don't render if not selecting or box too small
  if (!isSelecting || selectionBox.width < 5 || selectionBox.height < 5) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes marquee-pulse {
          0%, 100% {
            border-color: #4F46E5;
            box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4);
          }
          50% {
            border-color: #6366F1;
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2);
          }
        }
      `}</style>
      <div
        className="absolute pointer-events-none z-[2000]"
        style={{
          left: selectionBox.left,
          top: selectionBox.top,
          width: selectionBox.width,
          height: selectionBox.height,
          border: '2px solid #4F46E5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          borderRadius: '4px',
          animation: 'marquee-pulse 1.5s ease-in-out infinite',
        }}
      />
    </>
  );
}
