"use client";

import React, { useCallback } from 'react';
import { RowNode, AnyNode } from '../schema/nodes';
import { useEditor } from '../store/useEditorStore';
import { useDomRegistry } from '../overlays/domRegistry';

interface RowProps {
  node: RowNode;
  renderNode: (node: AnyNode) => React.ReactNode;
}

export function Row({ node, renderNode }: RowProps) {
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
      data-node-type="row"
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: `${node.props.gap || 16}px`,
        paddingTop: `${node.props.paddingY || 20}px`,
        paddingBottom: `${node.props.paddingY || 20}px`,
        paddingLeft: `${node.props.paddingX || 0}px`,
        paddingRight: `${node.props.paddingX || 0}px`,
        width: '100%',
        position: 'relative',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Row Label */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        padding: '3px 6px',
        background: 'rgba(16, 185, 129, 0.9)',
        color: 'white',
        fontSize: '10px',
        fontWeight: '600',
        borderRadius: '3px',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        ROW
      </div>

      {node.childrenIds.length === 0 ? (
        <div style={{ 
          flex: 1,
          padding: '40px', 
          textAlign: 'center', 
          color: '#999',
          border: '2px dashed #ddd',
          borderRadius: '8px'
        }}>
          Empty row - add a column
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
