"use client";

import React, { useCallback } from "react";
import { SectionNode, AnyNode } from "../schema/nodes";
import { useEditor } from "../store/useEditorStore";
import { useDomRegistry } from "../overlays/domRegistry";

interface SectionProps {
  node: SectionNode;
  renderNode: (node: AnyNode) => React.ReactNode;
}

export function Section({ node, renderNode }: SectionProps) {
  const { dispatch } = useEditor();
  const { register } = useDomRegistry();

  const refCallback = useCallback((el: HTMLElement | null) => register(node.id, el), [node.id, register]);

  return (
    <section
      ref={refCallback}
      data-node-id={node.id}
      data-node-type="section"
      style={{
        width: "100%",
        background: node.props.background || "transparent",
        paddingTop: `${node.props.paddingY || 40}px`,
        paddingBottom: `${node.props.paddingY || 40}px`,
        paddingLeft: `${node.props.paddingX || 20}px`,
        paddingRight: `${node.props.paddingX || 20}px`,
        minHeight: node.props.minHeight ? `${node.props.minHeight}px` : undefined,
        position: "relative",
        marginBottom: "20px", // consistent spacing between sections
      }}
      onPointerEnter={() => dispatch({ type: "HOVER_SECTION", sectionId: node.id })}
      onPointerLeave={() => dispatch({ type: "HOVER_SECTION", sectionId: null })}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: "SELECT_NODE", nodeId: node.id });
      }}
    >
      {/* CanvasViewport owns max width; Section should not re-clamp */}
      {node.childrenIds.length === 0 ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#999",
            border: "2px dashed #ddd",
            borderRadius: "8px",
          }}
        >
          Empty section - add a row
        </div>
      ) : (
        node.childrenIds.map((childId) => (
          <React.Fragment key={childId}>{renderNode({ id: childId } as AnyNode)}</React.Fragment>
        ))
      )}
    </section>
  );
}
