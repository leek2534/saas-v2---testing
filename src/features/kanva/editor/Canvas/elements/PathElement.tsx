'use client';

import React, { useRef, useCallback } from 'react';
import { useEditorStore } from '../../../lib/editor/store';
import type { PathElement as PathElementType } from '../../../lib/editor/types';
import { SelectionBox } from '../SelectionBox';

interface PathElementProps {
  element: PathElementType;
}

/**
 * PathElement - Renders free-drawn paths
 */
export function PathElement({ element }: PathElementProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const updateElement = useEditorStore((s) => s.updateElement);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const isSelected = selectedIds.includes(element.id);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handlePositionChange = useCallback((x: number, y: number) => {
    updateElement(element.id, { x, y });
  }, [element.id, updateElement]);

  const handleResize = useCallback((width: number, height: number) => {
    updateElement(element.id, { width, height });
  }, [element.id, updateElement]);

  const handleRotate = useCallback((rotation: number) => {
    updateElement(element.id, { rotation });
  }, [element.id, updateElement]);

  if (!element.visible) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        transformOrigin: 'center center',
        pointerEvents: isSelected ? 'auto' : 'none',
      }}
      onMouseDown={handleDragStart}
    >
      {/* SVG Path */}
      <svg
        width={element.width}
        height={element.height}
        style={{
          display: 'block',
          pointerEvents: 'none',
        }}
      >
        <path
          d={element.pathData}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          fill={element.fill || 'none'}
          strokeLinecap={element.strokeLinecap || 'round'}
          strokeLinejoin={element.strokeLinejoin || 'round'}
        />
      </svg>

      {/* Selection Box */}
      {isSelected && (
        <SelectionBox
          element={element}
          dragOffset={{ x: 0, y: 0 }}
          onResize={(width, height, x, y) => {
            handleResize(width, height);
            if (x !== undefined && y !== undefined) {
              handlePositionChange(x, y);
            }
          }}
          onRotate={handleRotate}
          onResizeEnd={() => {}}
        />
      )}
    </div>
  );
}
