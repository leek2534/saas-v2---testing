"use client";

import React, { useCallback } from 'react';
import { ColumnNode, AnyNode } from '../schema/nodes';
import { useEditor } from '../store/useEditorStore';
import { useDomRegistry } from '../overlays/domRegistry';

interface ColumnProps {
  node: ColumnNode;
  renderNode: (node: AnyNode) => React.ReactNode;
}

export function Column({ node, renderNode }: ColumnProps) {
  const { dispatch } = useEditor();
  const { register } = useDomRegistry();

  const refCallback = useCallback(
    (el: HTMLElement | null) => {
      register(node.id, el);
    },
    [node.id, register]
  );

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'HOVER_NODE', nodeId: node.id });
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'HOVER_NODE', nodeId: null });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'SELECT_NODE', nodeId: node.id });
  };

  return (
    <div
      ref={refCallback}
      data-node-id={node.id}
      data-node-type="column"
      style={{
        flex: node.props.widthFraction,
        minWidth: node.props.minWidth || 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Column Label */}
      <div style={{
        position: 'absolute',
        top: '2px',
        left: '2px',
        padding: '2px 5px',
        background: 'rgba(168, 85, 247, 0.9)',
        color: 'white',
        fontSize: '9px',
        fontWeight: '600',
        borderRadius: '2px',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        COLUMN
      </div>

      {node.childrenIds.length === 0 ? (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          color: '#999',
          border: '2px dashed #ddd',
          borderRadius: '8px',
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Add element
        </div>
      ) : (
        node.childrenIds.map((childId) => {
          const childNode = renderNode({ id: childId } as AnyNode);
          return <React.Fragment key={childId}>{childNode}</React.Fragment>;
        })
      )}
    </div>
  );
}
