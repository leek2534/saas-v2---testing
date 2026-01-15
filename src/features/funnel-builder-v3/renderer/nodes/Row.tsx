"use client";

import React, { useCallback } from "react";
import type { RowNode } from "../../store/types";
import { useDomRegistry } from "../../overlays/DomRegistry";
import { useFunnelEditorStore } from "../../store/store";

export function Row({ node, render }: { node: RowNode; render: (id: string) => React.ReactNode }) {
  const register = useDomRegistry((s) => s.register);
  const select = useFunnelEditorStore((s) => s.select);
  const mode = useFunnelEditorStore((s) => s.mode);
  const viewport = useFunnelEditorStore((s) => s.viewport);

  const isPreview = mode === "preview";
  const isMobile = viewport === "mobile";

  const refCb = useCallback((el: HTMLElement | null) => register(node.id, el), [node.id, register]);

  const align = node.props.align ?? "start";
  const paddingY = node.props.paddingY ?? 16;
  const paddingX = node.props.paddingX ?? 16;
  const gap = node.props.gap ?? 16;

  const justifyContent = align === "center" ? "center" : align === "end" ? "flex-end" : "flex-start";

  const vAlign = node.props.vAlign ?? "stretch";
  const alignItems = vAlign === "center" ? "center" : vAlign === "end" ? "flex-end" : "stretch";

  return (
    <div
      ref={refCb}
      data-node-id={isPreview ? undefined : node.id}
      data-node-type={isPreview ? undefined : "row"}
      className="relative w-full"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap,
        justifyContent,
        alignItems: isMobile ? "stretch" : alignItems,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: paddingX,
        paddingRight: paddingX,
      }}
      onClick={(e) => {
        if (isPreview) return;
        e.stopPropagation();
        
        const target = e.target as HTMLElement;
        
        // Don't select row if clicking on an empty column placeholder
        const isColumnPlaceholder = target.closest('[data-column-placeholder]');
        if (isColumnPlaceholder) return;
        
        // Don't select row if clicking on an element
        const isElement = target.closest('[data-node-type="element"]');
        if (isElement) return;
        
        const st = useFunnelEditorStore.getState();
        if (st.editingElementId) useFunnelEditorStore.setState({ editingElementId: null });
        select(node.id);
      }}
    >
      {node.children?.length ? (
        node.children.map((cid) => <React.Fragment key={cid}>{render(cid)}</React.Fragment>)
      ) : (
        <div className="flex-1 rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
          Empty row — add a column
        </div>
      )}
    </div>
  );
}
