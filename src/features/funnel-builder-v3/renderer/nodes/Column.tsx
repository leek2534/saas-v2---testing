"use client";

import React, { useCallback, useState, useEffect } from "react";
import type { ColumnNode } from "../../store/types";
import { useDomRegistry } from "../../overlays/DomRegistry";
import { useFunnelEditorStore } from "../../store/store";
import { DropZone } from "./DropZone";

function EmptyColumnPlaceholder({ columnId, isDragging, onSelect }: { columnId: string; isDragging: boolean; onSelect: () => void }) {
  const [isOver, setIsOver] = useState(false);
  const moveNode = useFunnelEditorStore((s) => s.moveNode);
  const select = useFunnelEditorStore((s) => s.select);
  const selectedId = useFunnelEditorStore((s) => s.selectedId);
  const isPlaceholderMode = useFunnelEditorStore((s) => s.isPlaceholderMode);
  
  const isActive = selectedId === columnId && isPlaceholderMode;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);

    const elementId = e.dataTransfer.getData("elementId");
    if (elementId) {
      moveNode(elementId, { parentId: columnId, index: 0 });
    }
  };

  return (
    <div 
      data-column-placeholder="true"
      className="w-full rounded-lg border-2 border-dashed transition-all cursor-pointer flex items-center justify-center"
      style={{ 
        position: 'relative',
        flex: '1 1 auto',
        minHeight: '120px',
        borderColor: isActive ? '#3b82f6' : (isOver && isDragging ? '#3b82f6' : '#e2e8f0'),
        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : (isOver && isDragging ? 'rgba(59, 130, 246, 0.1)' : 'transparent'),
        boxShadow: isActive ? '0 0 0 3px rgba(59, 130, 246, 0.2)' : undefined
      }}
      onClick={(e) => {
        e.stopPropagation();
        select(columnId);
        onSelect();
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-sm text-center pointer-events-none" style={{ color: isActive ? '#3b82f6' : '#94a3b8' }}>
        <div className="font-medium mb-1">{isActive ? "✓ Ready to Add Elements" : "Empty Column"}</div>
        <div className="text-xs">
          {isDragging ? "Drop element here" : (isActive ? "Select an element from the sidebar" : "Click to select, then add elements from sidebar")}
        </div>
      </div>
    </div>
  );
}

export function Column({ node, render }: { node: ColumnNode; render: (id: string) => React.ReactNode }) {
  const register = useDomRegistry((s) => s.register);
  const select = useFunnelEditorStore((s) => s.select);
  const addElementBelow = useFunnelEditorStore((s) => s.addElementBelow);
  const mode = useFunnelEditorStore((s) => s.mode);
  const isDragging = useFunnelEditorStore((s) => s.isDraggingElement);
  const setPlaceholderMode = (enabled: boolean) => useFunnelEditorStore.setState({ isPlaceholderMode: enabled });

  const isPreview = mode === "preview";

  const refCb = useCallback((el: HTMLElement | null) => register(node.id, el), [node.id, register]);

  const widthPct = node.props.widthPct ?? 100;
  const paddingX = node.props.paddingX ?? 0;
  const paddingY = node.props.paddingY ?? 0;

  const vAlign = node.props.vAlign ?? "start";
  const justifyContent = vAlign === "center" ? "center" : vAlign === "end" ? "flex-end" : "flex-start";

  return (
    <div
      ref={refCb}
      data-node-id={isPreview ? undefined : node.id}
      data-node-type={isPreview ? undefined : "column"}
      style={{
        flex: widthPct >= 100 ? "1 1 100%" : `${widthPct} 1 0%`,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        background: "transparent",
        outline: "none",
        border: "none",
        boxShadow: "none",
      }}
      onClick={(e) => {
        if (isPreview) return;
        
        // Don't select column if clicking on an element
        const target = e.target as HTMLElement;
        const isElement = target.closest('[data-node-type="element"]');
        if (isElement) return;
        
        e.stopPropagation();
        // Clear any editing state when clicking container
        const st = useFunnelEditorStore.getState();
        if (st.editingElementId) {
          useFunnelEditorStore.setState({ editingElementId: null });
        }
        select(node.id);
      }}
    >
      {node.children?.length ? (
        <>
          {!isPreview && <DropZone parentId={node.id} index={0} isDragging={isDragging} />}
          {node.children.map((cid, idx) => (
            <React.Fragment key={cid}>
              {render(cid)}
              {!isPreview && <DropZone parentId={node.id} index={idx + 1} isDragging={isDragging} />}
            </React.Fragment>
          ))}
        </>
      ) : (
        !isPreview && <EmptyColumnPlaceholder columnId={node.id} isDragging={isDragging} onSelect={() => setPlaceholderMode(true)} />
      )}
    </div>
  );
}
