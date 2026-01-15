'use client';

import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../../lib/editor/store';

/**
 * AlignmentGuides - Visual alignment guides that appear when dragging elements
 * Shows horizontal and vertical lines when elements align with canvas center/edges or other elements
 */
export function AlignmentGuides() {
  const showAlignmentGuides = useEditorStore((s) => s.showAlignmentGuides);
  const elements = useEditorStore((s) => s.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const canvas = useEditorStore((s) => s.canvas);
  const [guides, setGuides] = useState<Array<{ type: 'horizontal' | 'vertical'; position: number; label?: string }>>([]);

  // Update guides continuously during drag
  useEffect(() => {
    if (!showAlignmentGuides || selectedIds.length === 0) {
      setGuides([]);
      return;
    }

    const selectedElement = elements.find(el => el.id === selectedIds[0]);
    if (!selectedElement) {
      setGuides([]);
      return;
    }

    const updateGuides = () => {
      // Get current drag offset from the element's DOM (if dragging)
      let dragOffsetX = 0;
      let dragOffsetY = 0;
      
      // Try to get drag offset from element's transform
      const elementEl = document.querySelector(`[data-element-id="${selectedElement.id}"]`) as HTMLElement;
      if (elementEl) {
        const computedStyle = window.getComputedStyle(elementEl);
        const transform = computedStyle.transform;
        if (transform && transform !== 'none') {
          const matrix = new DOMMatrix(transform);
          // Extract translate values from transform matrix
          // matrix.e and matrix.f are translateX and translateY, but we need to account for rotation
          // For simplicity, check if there's a translate in the transform string
          const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
          if (translateMatch) {
            dragOffsetX = parseFloat(translateMatch[1]) || 0;
            dragOffsetY = parseFloat(translateMatch[2]) || 0;
          }
        }
      }

    const newGuides: Array<{ type: 'horizontal' | 'vertical'; position: number; label?: string }> = [];
    // Use element position + drag offset for real-time alignment during drag
    const currentX = selectedElement.x + dragOffsetX;
    const currentY = selectedElement.y + dragOffsetY;
    const elementCenterX = currentX + selectedElement.width / 2;
    const elementCenterY = currentY + selectedElement.height / 2;
    const elementTop = currentY;
    const elementBottom = currentY + selectedElement.height;
    const elementLeft = currentX;
    const elementRight = currentX + selectedElement.width;

    // Canvas alignment guides
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;
    const margin = 40; // Inner margin for safe zone
    const threshold = 8; // pixels - increased for better snapping

    // Check horizontal alignments
    if (Math.abs(elementCenterY - canvasCenterY) < threshold) {
      newGuides.push({ type: 'horizontal', position: canvasCenterY, label: 'Center' });
    }
    if (Math.abs(elementTop) < threshold) {
      newGuides.push({ type: 'horizontal', position: 0, label: 'Canvas Edge' });
    }
    if (Math.abs(elementBottom - canvas.height) < threshold) {
      newGuides.push({ type: 'horizontal', position: canvas.height, label: 'Canvas Edge' });
    }
    // Inner margin guides (safe zone)
    if (Math.abs(elementTop - margin) < threshold) {
      newGuides.push({ type: 'horizontal', position: margin, label: 'Safe Zone' });
    }
    if (Math.abs(elementBottom - (canvas.height - margin)) < threshold) {
      newGuides.push({ type: 'horizontal', position: canvas.height - margin, label: 'Safe Zone' });
    }

    // Check vertical alignments
    if (Math.abs(elementCenterX - canvasCenterX) < threshold) {
      newGuides.push({ type: 'vertical', position: canvasCenterX, label: 'Center' });
    }
    if (Math.abs(elementLeft) < threshold) {
      newGuides.push({ type: 'vertical', position: 0, label: 'Canvas Edge' });
    }
    if (Math.abs(elementRight - canvas.width) < threshold) {
      newGuides.push({ type: 'vertical', position: canvas.width, label: 'Canvas Edge' });
    }
    // Inner margin guides (safe zone)
    if (Math.abs(elementLeft - margin) < threshold) {
      newGuides.push({ type: 'vertical', position: margin, label: 'Safe Zone' });
    }
    if (Math.abs(elementRight - (canvas.width - margin)) < threshold) {
      newGuides.push({ type: 'vertical', position: canvas.width - margin, label: 'Safe Zone' });
    }

    // Check alignment with other elements
    elements.forEach((el) => {
      if (el.id === selectedElement.id || !el.visible) return;

      const otherCenterX = el.x + el.width / 2;
      const otherCenterY = el.y + el.height / 2;
      const otherTop = el.y;
      const otherBottom = el.y + el.height;
      const otherLeft = el.x;
      const otherRight = el.x + el.width;

      // Horizontal alignments
      if (Math.abs(elementCenterY - otherCenterY) < threshold) {
        newGuides.push({ type: 'horizontal', position: otherCenterY });
      }
      if (Math.abs(elementTop - otherTop) < threshold) {
        newGuides.push({ type: 'horizontal', position: otherTop });
      }
      if (Math.abs(elementBottom - otherBottom) < threshold) {
        newGuides.push({ type: 'horizontal', position: otherBottom });
      }

      // Vertical alignments
      if (Math.abs(elementCenterX - otherCenterX) < threshold) {
        newGuides.push({ type: 'vertical', position: otherCenterX });
      }
      if (Math.abs(elementLeft - otherLeft) < threshold) {
        newGuides.push({ type: 'vertical', position: otherLeft });
      }
      if (Math.abs(elementRight - otherRight) < threshold) {
        newGuides.push({ type: 'vertical', position: otherRight });
      }
    });

      setGuides(newGuides);
    };

    // Initial update
    updateGuides();

    // Update continuously during drag (check every frame)
    const rafId = requestAnimationFrame(function animate() {
      updateGuides();
      requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [showAlignmentGuides, selectedIds, elements, canvas]);

  if (!showAlignmentGuides || guides.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[1500]">
      {guides.map((guide, index) => (
        <React.Fragment key={index}>
          {guide.type === 'horizontal' ? (
            <div
              className="absolute left-0 right-0 border-t-2 border-blue-500"
              style={{
                top: `${guide.position}px`,
                boxShadow: '0 0 4px rgba(59, 130, 246, 0.5)',
              }}
            >
              {guide.label && (
                <div className="absolute left-2 top-0 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded -translate-y-1/2">
                  {guide.label}
                </div>
              )}
            </div>
          ) : (
            <div
              className="absolute top-0 bottom-0 border-l-2 border-blue-500"
              style={{
                left: `${guide.position}px`,
                boxShadow: '0 0 4px rgba(59, 130, 246, 0.5)',
              }}
            >
              {guide.label && (
                <div className="absolute top-2 left-0 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded -translate-x-1/2">
                  {guide.label}
                </div>
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

