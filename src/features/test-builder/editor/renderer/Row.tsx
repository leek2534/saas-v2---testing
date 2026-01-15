"use client";

import React, { useCallback } from "react";
import { RowNode, AnyNode } from "../schema/nodes";
import { useEditor } from "../store/useEditorStore";
import { useDomRegistry } from "../overlays/domRegistry";

interface RowProps {
  node: RowNode;
  renderNode: (node: AnyNode) => React.ReactNode;
}

export function Row({ node, renderNode }: RowProps) {
  const { dispatch } = useEditor();
  const { register } = useDomRegistry();

  const refCallback = useCallback((el: HTMLElement | null) => register(node.id, el), [node.id, register]);

  return (
    <div
      ref={refCallback}
      data-node-id={node.id}
      data-node-type="row"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 0, // columns touch
        width: "100%",
        position: "relative",
        alignItems: "stretch",
        paddingTop: `${node.props.paddingY || 20}px`,
        paddingBottom: `${node.props.paddingY || 20}px`,
        // Section owns most horizontal padding; keep row paddingX minimal
        paddingLeft: `${node.props.paddingX || 0}px`,
        paddingRight: `${node.props.paddingX || 0}px`,
      }}
      onPointerEnter={() => dispatch({ type: "HOVER_ROW", rowId: node.id })}
      onPointerLeave={() => dispatch({ type: "HOVER_ROW", rowId: null })}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: "SELECT_NODE", nodeId: node.id });
      }}
    >
      {node.childrenIds.length === 0 ? (
        <div
          style={{
            flex: 1,
            padding: "40px",
            textAlign: "center",
            color: "#999",
            border: "2px dashed #ddd",
            borderRadius: "8px",
          }}
        >
          Empty row - add a column
        </div>
      ) : (
        node.childrenIds.map((childId) => (
          <React.Fragment key={childId}>{renderNode({ id: childId } as AnyNode)}</React.Fragment>
        ))
      )}
    </div>
  );
}
