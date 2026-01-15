"use client";

import React, { useCallback } from "react";
import type { SectionNode } from "../../store/types";
import { useDomRegistry } from "../../overlays/DomRegistry";
import { useFunnelEditorStore } from "../../store/store";

const SHADOW: Record<string, string> = {
  none: "none",
  sm: "0 1px 2px rgba(2,6,23,0.08)",
  md: "0 8px 20px rgba(2,6,23,0.10)",
  lg: "0 18px 40px rgba(2,6,23,0.14)",
};

export function Section({ node, render }: { node: SectionNode; render: (id: string) => React.ReactNode }) {
  const register = useDomRegistry((s) => s.register);
  const select = useFunnelEditorStore((s) => s.select);
  const mode = useFunnelEditorStore((s) => s.mode);

  const isPreview = mode === "preview";

  const refCb = useCallback((el: HTMLElement | null) => register(node.id, el), [node.id, register]);

  const paddingY = node.props.paddingY ?? 40;
  const paddingX = node.props.paddingX ?? 20;
  const maxWidth = node.props.maxWidth ?? 1100;

  return (
    <section
      ref={refCb}
      data-node-id={isPreview ? undefined : node.id}
      data-node-type={isPreview ? undefined : "section"}
      className="relative w-full"
      style={{
        background: node.props.background ?? "transparent",
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        minHeight: node.props.minHeight || undefined,
        borderRadius: node.props.borderRadius ?? 0,
        border: node.props.borderWidth ? `${node.props.borderWidth}px solid ${node.props.borderColor ?? "#e2e8f0"}` : undefined,
        boxShadow: node.props.shadow ? SHADOW[node.props.shadow] : undefined,
      }}
      onMouseDown={(e) => {
        if (isPreview) return;
        e.stopPropagation();
        
        const target = e.target as HTMLElement;
        
        // Don't select section if clicking on a child node (row, column, element, or placeholder)
        const isChildNode = target.closest('[data-node-type="row"], [data-node-type="column"], [data-node-type="element"], [data-column-placeholder]');
        if (isChildNode) return;
        
        // Clear any editing state when clicking container
        const st = useFunnelEditorStore.getState();
        if (st.editingElementId) {
          useFunnelEditorStore.setState({ editingElementId: null });
        }
        select(node.id);
      }}
    >
      <div style={{ maxWidth, margin: "0 auto" }}>
        {node.children?.length ? (
          node.children.map((cid) => <React.Fragment key={cid}>{render(cid)}</React.Fragment>)
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            Empty section — add a row
          </div>
        )}
      </div>
    </section>
  );
}
