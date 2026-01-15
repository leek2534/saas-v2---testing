"use client";

import React from 'react';
import { useEditor } from '../store/useEditorStore';
import { AnyNode } from '../schema/nodes';
import { Section } from './Section';
import { Row } from './Row';
import { Column } from './Column';
import { Element } from './Element';
import { createAddSectionAction } from '../actions/editorActions';
import { Plus, Layout } from 'lucide-react';

export function RuntimeRenderer() {
  const { state, dispatch } = useEditor();
  const { tree } = state;

  const renderNode = (nodeOrId: AnyNode | { id: string }): React.ReactNode => {
    // Handle both node objects and id-only objects
    const nodeId = 'id' in nodeOrId && typeof nodeOrId.id === 'string' ? nodeOrId.id : (nodeOrId as AnyNode).id;
    const node = tree.nodes[nodeId];
    
    if (!node) {
      console.warn('Node not found:', nodeId);
      return null;
    }

    switch (node.type) {
      case 'section':
        return <Section key={node.id} node={node} renderNode={renderNode} />;
      
      case 'row':
        return <Row key={node.id} node={node} renderNode={renderNode} />;
      
      case 'column':
        return <Column key={node.id} node={node} renderNode={renderNode} />;
      
      case 'element':
        return <Element key={node.id} node={node} />;
      
      default:
        console.warn('Unknown node type:', (node as any).type);
        return null;
    }
  };

  const handleAddSection = () => {
    const action = createAddSectionAction();
    dispatch(action);
  };

  if (!tree.rootId || !tree.nodes[tree.rootId]) {
    return (
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        padding: '80px 20px',
        background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)',
      }}>
        {/* Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
        }}>
          <Layout size={40} color="white" />
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '12px',
        }}>
          Start Building Your Page
        </h2>

        {/* Description */}
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          marginBottom: '32px',
          maxWidth: '400px',
          textAlign: 'center',
          lineHeight: '1.5',
        }}>
          Add your first section to begin creating your layout
        </p>

        {/* Add Section Button */}
        <button
          onClick={handleAddSection}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
          }}
        >
          <Plus size={20} />
          Add Your First Section
        </button>
      </div>
    );
  }

  return <>{renderNode({ id: tree.rootId })}</>;
}
