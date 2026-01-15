"use client";

import React, { useCallback } from "react";
import { ElementNode } from "../schema/nodes";
import { useEditor } from "../store/useEditorStore";
import { useDomRegistry } from "../overlays/domRegistry";

interface ElementProps {
  node: ElementNode;
}

export function Element({ node }: ElementProps) {
  const { dispatch } = useEditor();
  const { register } = useDomRegistry();

  const refCallback = useCallback((el: HTMLElement | null) => register(node.id, el), [node.id, register]);

  const renderContent = () => {
    const { elementType } = node.props;

    switch (elementType) {
      case "text":
        return <p style={{ margin: 0, padding: "8px 0" }}>{node.props.content || "Text element"}</p>;

      case "heading":
        return <h2 style={{ margin: 0, padding: "8px 0" }}>{node.props.content || "Heading"}</h2>;

      case "button":
        return (
          <button
            style={{
              padding: "12px 24px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {node.props.content || "Button"}
          </button>
        );

      case "image":
        return (
          <img
            src={node.props.src || "https://via.placeholder.com/400x300"}
            alt={node.props.alt || "Image"}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        );

      case "video":
        return <video src={node.props.src} controls style={{ width: "100%", height: "auto", display: "block" }} />;

      case "divider":
        return <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "16px 0" }} />;

      default:
        return <div style={{ padding: "8px", color: "#999" }}>Unknown element type: {String(elementType)}</div>;
    }
  };

  return (
    <div
      ref={refCallback}
      data-node-id={node.id}
      data-node-type="element"
      style={{ position: "relative", width: "100%" }}
      onPointerEnter={() => dispatch({ type: "HOVER_ELEMENT", elementId: node.id })}
      onPointerLeave={() => dispatch({ type: "HOVER_ELEMENT", elementId: null })}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: "SELECT_NODE", nodeId: node.id });
      }}
    >
      {/* All hover/selection UI is handled by overlays */}
      {renderContent()}
    </div>
  );
}
