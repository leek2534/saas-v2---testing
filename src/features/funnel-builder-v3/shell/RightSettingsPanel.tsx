"use client";

import React, { useMemo } from "react";
import { useFunnelEditorStore } from "../store/store";
import { ColorField, NumberField, SelectField, ToggleField } from "./controls";
import { VideoPanel } from "./panels/VideoPanel";
import { ImagePanel } from "./panels/ImagePanel";
import { TextPanel } from "./panels/TextPanel";
import { ButtonPanel } from "./panels/ButtonPanel";
import { DividerPanel } from "./panels/DividerPanel";
import { SpacerPanel } from "./panels/SpacerPanel";
import { CouponCodePanel } from "./panels/CouponCodePanel";
import { CheckoutPanel } from "./panels/CheckoutPanel";
import { OfferPanel } from "./panels/OfferPanel";
import type { AnyNode, SectionNode, RowNode, ColumnNode, ElementNode } from "../store/types";

function PanelTitle({ title, subtitle, onClose, onCollapse }: { title: string; subtitle?: string; onClose?: () => void; onCollapse?: () => void }) {
  return (
    <div className="border-b border-slate-200 pb-3 flex items-start justify-between">
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {subtitle && <div className="mt-1 text-xs text-slate-500">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-1">
        {onCollapse && (
          <button
            onClick={onCollapse}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title="Collapse inspector"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 12L14 8L10 4M6 4L2 8L6 12" />
            </svg>
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title="Close panel"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 4L4 12M4 4l8 8" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function RightSettingsPanel() {
  const tree = useFunnelEditorStore((s) => s.tree);
  const selectedId = useFunnelEditorStore((s) => s.selectedId);
  const selectedPopupId = useFunnelEditorStore((s) => s.selectedPopupId);
  const mode = useFunnelEditorStore((s) => s.mode);
  const inspectorState = useFunnelEditorStore((s) => s.inspectorState);
  const updateNode = useFunnelEditorStore((s) => s.updateNode);
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);
  const deleteNode = useFunnelEditorStore((s) => s.deleteNode);
  const updatePopup = useFunnelEditorStore((s) => s.updatePopup);
  const deletePopup = useFunnelEditorStore((s) => s.deletePopup);
  const select = useFunnelEditorStore((s) => s.select);
  const selectPopup = useFunnelEditorStore((s) => s.selectPopup);
  const toggleInspector = useFunnelEditorStore((s) => s.toggleInspector);
  
  const handleClose = () => {
    select(null);
    selectPopup(null);
  };

  const node = useMemo(() => {
    if (!selectedId) return null;
    return tree.nodes[selectedId] || null;
  }, [selectedId, tree.nodes]);

  const selectedPopup = useMemo(() => {
    if (!selectedPopupId) return null;
    return tree.popups[selectedPopupId] || null;
  }, [selectedPopupId, tree.popups]);

  // Determine what to show in inspector
  const hasSelection = !!node || !!selectedPopup;

  if (mode === "preview") {
    return (
      <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4">
        <PanelTitle title="Preview" subtitle="Editing is disabled in preview mode." />
        <div className="mt-4 text-sm text-slate-600">Exit preview to edit settings.</div>
      </div>
    );
  }

  // Don't render collapsed state for now - keep it simple
  // if (inspectorState === "collapsed") {
  //   return null;
  // }

  // Popup settings
  if (selectedPopup) {
    const p = selectedPopup;
    return (
      <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
        <PanelTitle title="Popup" subtitle={`${p.name} • ${p.id}`} onClose={handleClose} onCollapse={toggleInspector} />

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-700">Name</label>
            <input
              type="text"
              value={p.name}
              onChange={(e) => updatePopup(p.id, { name: e.target.value })}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
            />
          </div>

          <ToggleField
            label="Enabled"
            value={p.enabled}
            onChange={(enabled) => updatePopup(p.id, { enabled })}
          />

          <div className="border-t border-slate-200 pt-4">
            <button
              onClick={() => {
                if (confirm("Delete this popup?")) {
                  deletePopup(p.id);
                  selectPopup(null);
                }
              }}
              className="w-full rounded bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Delete Popup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Page settings when nothing is selected
  if (!node) {
    return (
      <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4">
        <PanelTitle title="Page Settings" onCollapse={toggleInspector} />
        <div className="mt-4 space-y-4">
          <div className="text-sm text-slate-600">
            Select an element to edit its properties, or add new elements from the left sidebar.
          </div>
        </div>
      </div>
    );
  }

  const n = node;
  let panelContent: React.ReactNode = null;

  if (n.type === "section") {
    const section = n as SectionNode;
    panelContent = (
      <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
        <PanelTitle title="Section" subtitle={n.id} onClose={handleClose} onCollapse={toggleInspector} />
        <div className="mt-4 space-y-4">
          <ColorField
            label="Background"
            value={section.background || "#ffffff"}
            onChange={(background) => updateNode(section.id, { background })}
          />
          <NumberField
            label="Padding Top"
            value={section.paddingTop ?? 40}
            onChange={(paddingTop) => updateNode(section.id, { paddingTop })}
          />
          <NumberField
            label="Padding Bottom"
            value={section.paddingBottom ?? 40}
            onChange={(paddingBottom) => updateNode(section.id, { paddingBottom })}
          />
          <ToggleField
            label="Full Width"
            value={section.fullWidth ?? false}
            onChange={(fullWidth) => updateNode(section.id, { fullWidth })}
          />
        </div>
      </div>
    );
  } else if (n.type === "row") {
    const row = n as RowNode;
    panelContent = (
      <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
        <PanelTitle title="Row" subtitle={n.id} onClose={handleClose} onCollapse={toggleInspector} />
        <div className="mt-4 space-y-4">
          <ColorField
            label="Background"
            value={row.background || ""}
            onChange={(background) => updateNode(row.id, { background })}
          />
          <NumberField
            label="Gap"
            value={row.gap ?? 16}
            onChange={(gap) => updateNode(row.id, { gap })}
          />
          <NumberField
            label="Padding"
            value={row.padding ?? 0}
            onChange={(padding) => updateNode(row.id, { padding })}
          />
          <SelectField
            label="Vertical Align"
            value={row.verticalAlign || "top"}
            options={[
              { value: "top", label: "Top" },
              { value: "center", label: "Center" },
              { value: "bottom", label: "Bottom" },
            ]}
            onChange={(verticalAlign) => updateNode(row.id, { verticalAlign })}
          />
        </div>
      </div>
    );
  } else if (n.type === "column") {
    const col = n as ColumnNode;
    panelContent = (
      <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
        <PanelTitle title="Column" subtitle={n.id} onClose={handleClose} onCollapse={toggleInspector} />
        <div className="mt-4 space-y-4">
          <NumberField
            label="Width"
            value={col.width ?? 50}
            onChange={(width) => updateNode(col.id, { width })}
          />
          <ColorField
            label="Background"
            value={col.background || ""}
            onChange={(background) => updateNode(col.id, { background })}
          />
          <NumberField
            label="Padding"
            value={col.padding ?? 16}
            onChange={(padding) => updateNode(col.id, { padding })}
          />
          <SelectField
            label="Vertical Align"
            value={col.verticalAlign || "top"}
            options={[
              { value: "top", label: "Top" },
              { value: "center", label: "Center" },
              { value: "bottom", label: "Bottom" },
            ]}
            onChange={(verticalAlign) => updateNode(col.id, { verticalAlign })}
          />
        </div>
      </div>
    );
  } else if (n.type === "element") {
    const el = n as ElementNode;
    const kind = el.props?.kind;
    
    console.log("=== ELEMENT DEBUG ===");
    console.log("Element kind:", kind);
    console.log("Element props:", el.props);
    console.log("Element full:", el);
    console.log("===================");

    switch (kind) {
      case "video":
        return (
          <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
            <VideoPanel node={el} />
          </div>
        );
      case "image":
        return (
          <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
            <ImagePanel node={el} />
          </div>
        );
      case "heading":
      case "subheading":
      case "paragraph":
      case "text":
        return (
          <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
            <TextPanel node={el} />
          </div>
        );
      case "button":
        return (
          <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
            <ButtonPanel node={el} />
          </div>
        );
      case "divider":
        return (
          <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
            <DividerPanel node={el} />
          </div>
        );
      case "spacer":
        return (
          <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
            <SpacerPanel node={el} />
          </div>
        );
      case "coupon-code":
        return (
          <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
            <CouponCodePanel node={el} />
          </div>
        );
      case "funnel.checkout":
        return (
          <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
            <CheckoutPanel node={el} />
          </div>
        );
      case "funnel.offer":
        return (
          <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
            <OfferPanel node={el} />
          </div>
        );
      default:
        return (
          <div className="h-full w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 animate-in slide-in-from-right duration-300">
            <PanelTitle title="Element" subtitle={`${kind} • ${n.id}`} onClose={handleClose} />
            <div className="mt-4 text-sm text-slate-600">
              No settings available for this element type.
            </div>
          </div>
        );
    }
  }

  return panelContent;
}
