"use client";

import React, { useState, useCallback } from 'react';
import { useEditor } from '../store/useEditorStore';
import { useDomRegistry } from './domRegistry';
import { ColumnNode } from '../schema/nodes';

export function ResizeHandles() {
  const { state, dispatch } = useEditor();
  const { get } = useDomRegistry();
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(
    (
      e: React.MouseEvent,
      leftNode: ColumnNode,
      rightNode: ColumnNode,
      leftRect: DOMRect,
      rightRect: DOMRect
    ) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(true);

      const startX = e.clientX;
      const totalFraction = leftNode.props.widthFraction + rightNode.props.widthFraction;
      const totalWidth = leftRect.width + rightRect.width;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaFraction = totalWidth ? (deltaX / totalWidth) * totalFraction : 0;

        let newLeft = leftNode.props.widthFraction + deltaFraction;
        let newRight = rightNode.props.widthFraction - deltaFraction;

        // Enforce minimum fraction (5% of total)
        const minFraction = totalFraction * 0.05;
        if (newLeft < minFraction) {
          newLeft = minFraction;
          newRight = totalFraction - minFraction;
        }
        if (newRight < minFraction) {
          newRight = minFraction;
          newLeft = totalFraction - minFraction;
        }

        // Update both columns
        dispatch({
          type: 'UPDATE_NODE_PROPS',
          nodeId: leftNode.id,
          props: { widthFraction: newLeft },
        });
        dispatch({
          type: 'UPDATE_NODE_PROPS',
          nodeId: rightNode.id,
          props: { widthFraction: newRight },
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [dispatch]
  );

  // Find all rows and render resize handles between columns
  const rows = Object.values(state.tree.nodes).filter(node => node.type === 'row');

  return (
    <>
      {rows.map(row => {
        if (row.childrenIds.length < 2) return null;

        const handles = [];
        for (let i = 0; i < row.childrenIds.length - 1; i++) {
          const leftId = row.childrenIds[i];
          const rightId = row.childrenIds[i + 1];

          const leftNode = state.tree.nodes[leftId] as ColumnNode;
          const rightNode = state.tree.nodes[rightId] as ColumnNode;

          if (!leftNode || !rightNode) continue;

          const leftEl = get(leftId);
          const rightEl = get(rightId);

          if (!leftEl || !rightEl) continue;

          const leftRect = leftEl.getBoundingClientRect();
          const rightRect = rightEl.getBoundingClientRect();

          const handleLeft = leftRect.right - 3;
          const handleTop = Math.min(leftRect.top, rightRect.top);
          const handleHeight = Math.max(leftRect.bottom, rightRect.bottom) - handleTop;

          handles.push(
            <div
              key={`${leftId}-${rightId}`}
              style={{
                position: 'fixed',
                left: `${handleLeft}px`,
                top: `${handleTop}px`,
                width: '6px',
                height: `${handleHeight}px`,
                cursor: 'col-resize',
                pointerEvents: 'auto',
                zIndex: 10000,
                background: isDragging ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                transition: 'background 0.1s ease',
              }}
              onMouseDown={(e) => handleMouseDown(e, leftNode, rightNode, leftRect, rightRect)}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(59, 130, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                if (!isDragging) {
                  (e.target as HTMLElement).style.background = 'transparent';
                }
              }}
            />
          );
        }

        return handles;
      })}
    </>
  );
}
