"use client";

import React, { useCallback } from "react";
import { ColumnNode, AnyNode } from "../schema/nodes";
import { useDomRegistry } from "../overlays/domRegistry";

interface ColumnProps {
  node: ColumnNode;
  renderNode: (node: AnyNode) => React.ReactNode;
}

export function Column({ node, renderNode }: ColumnProps) {
  const { register } = useDomRegistry();

  const refCallback = useCallback((el: HTMLElement | null) => register(node.id, el), [node.id, register]);

  return (
    <div
      ref={refCallback}
      data-node-id={node.id}
      data-node-type="column"
      style={{
        // predictable fractional sizing
        flexGrow: node.props.widthFraction,
        flexBasis: 0,
        minWidth: node.props.minWidth || 0,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {node.childrenIds.length === 0 ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#999",
            border: "2px dashed #ddd",
            borderRadius: "8px",
            minHeight: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Add element
        </div>
      ) : (
        node.childrenIds.map((childId) => (
          <React.Fragment key={childId}>{renderNode({ id: childId } as AnyNode)}</React.Fragment>
        ))
      )}
    </div>
  );
}
