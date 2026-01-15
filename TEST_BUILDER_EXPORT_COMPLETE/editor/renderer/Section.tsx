"use client";

import React, { useCallback } from 'react';
import { SectionNode, AnyNode } from '../schema/nodes';
import { useEditor } from '../store/useEditorStore';
import { useDomRegistry } from '../overlays/domRegistry';

interface SectionProps {
  node: SectionNode;
  renderNode: (node: AnyNode) => React.ReactNode;
}

export function Section({ node, renderNode }: SectionProps) {
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
    <section
      ref={refCallback}
      data-node-id={node.id}
      data-node-type="section"
      style={{
        width: '100%',
        background: node.props.background || 'transparent',
        paddingTop: `${node.props.paddingY || 40}px`,
        paddingBottom: `${node.props.paddingY || 40}px`,
        paddingLeft: `${node.props.paddingX || 20}px`,
        paddingRight: `${node.props.paddingX || 20}px`,
        minHeight: node.props.minHeight ? `${node.props.minHeight}px` : undefined,
        position: 'relative',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Section Label */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        padding: '4px 8px',
        background: 'rgba(59, 130, 246, 0.9)',
        color: 'white',
        fontSize: '11px',
        fontWeight: '600',
        borderRadius: '4px',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        SECTION
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {node.childrenIds.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#999',
            border: '2px dashed #ddd',
            borderRadius: '8px'
          }}>
            Empty section - add a row
          </div>
        ) : (
          node.childrenIds.map((childId) => {
            const childNode = renderNode({ id: childId } as AnyNode);
            return <React.Fragment key={childId}>{childNode}</React.Fragment>;
          })
        )}
      </div>
    </section>
  );
}
