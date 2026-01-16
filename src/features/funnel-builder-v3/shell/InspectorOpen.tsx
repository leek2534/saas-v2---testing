"use client";

import React, { useMemo } from "react";
import { useFunnelEditorStore } from "../store/store";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import type { ElementNode } from "../store/types";
import { VideoPanel } from "./panels/VideoPanel";
import { ImagePanel } from "./panels/ImagePanel";
import { ButtonPanel } from "./panels/ButtonPanel";
import { DividerPanel } from "./panels/DividerPanel";
import { SpacerPanel } from "./panels/SpacerPanel";
import { CouponCodePanel } from "./panels/CouponCodePanel";
import { CheckoutPanel } from "./panels/CheckoutPanel";
import { OfferPanel } from "./panels/OfferPanel";
import { NumberField, SelectField, ToggleField, TextField } from "./controls";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TextPanelSimple } from "./panels/TextPanelSimple";

export function InspectorOpen() {
  const tree = useFunnelEditorStore((s) => s.tree);
  const selectedId = useFunnelEditorStore((s) => s.selectedId);
  const selectedPopupId = useFunnelEditorStore((s) => s.selectedPopupId);
  const mode = useFunnelEditorStore((s) => s.mode);
  const updatePopup = useFunnelEditorStore((s) => s.updatePopup);
  const updatePopupTriggers = useFunnelEditorStore((s) => s.updatePopupTriggers);
  const updatePopupTargeting = useFunnelEditorStore((s) => s.updatePopupTargeting);
  const updatePopupFrequency = useFunnelEditorStore((s) => s.updatePopupFrequency);
  const updatePopupAnimation = useFunnelEditorStore((s) => s.updatePopupAnimation);
  const updatePopupStyle = useFunnelEditorStore((s) => s.updatePopupStyle);
  const deletePopup = useFunnelEditorStore((s) => s.deletePopup);
  const select = useFunnelEditorStore((s) => s.select);
  const selectPopup = useFunnelEditorStore((s) => s.selectPopup);
  const toggleInspector = useFunnelEditorStore((s) => s.toggleInspector);

  const node = useMemo(() => {
    if (!selectedId) return null;
    return tree.nodes[selectedId] || null;
  }, [selectedId, tree.nodes]);

  const selectedPopup = useMemo(() => {
    if (!selectedPopupId) return null;
    return tree.popups[selectedPopupId] || null;
  }, [selectedPopupId, tree.popups]);

  // Build breadcrumb path
  const breadcrumbs = useMemo(() => {
    if (!node) return [];
    const path: Array<{ id: string; type: string; label: string }> = [];
    let current = node;
    
    while (current) {
      const label = current.type === "element" 
        ? (current as ElementNode).props.kind || "element"
        : current.type;
      path.unshift({ id: current.id, type: current.type, label });
      
      if (current.parentId) {
        current = tree.nodes[current.parentId];
      } else {
        break;
      }
    }
    
    return path;
  }, [node, tree.nodes]);

  const handleClose = () => {
    select(null);
    selectPopup(null);
  };

  if (mode === "preview") {
    return (
      <div className="h-full flex flex-col pb-[60px]">
        <InspectorHeader
          title="Preview"
          subtitle="Editing is disabled in preview mode"
          onToggle={toggleInspector}
        />
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-sm text-slate-600">Exit preview to edit settings.</div>
        </div>
      </div>
    );
  }

  
// Popup settings
if (selectedPopup) {
  const p = selectedPopup;

  const triggers = p.triggers ?? [];

  const parseList = (raw: string) =>
    raw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const ensureTrigger = (t: any) => {
    // prevent duplicate on_page_load (common expectation)
    if (t.type === "on_page_load" && triggers.some((x) => x.type === "on_page_load")) return;
    updatePopupTriggers(p.id, [...triggers, t]);
  };

  const updateTriggerAt = (idx: number, next: any) => {
    const nextList = [...triggers];
    nextList[idx] = next;
    updatePopupTriggers(p.id, nextList);
  };

  const removeTriggerAt = (idx: number) => {
    const nextList = triggers.filter((_, i) => i !== idx);
    updatePopupTriggers(p.id, nextList);
  };

  return (
    <div className="h-full flex flex-col pb-[60px]">
      <InspectorHeader
        title="Popup"
        subtitle={p.name}
        onClose={handleClose}
        onToggle={toggleInspector}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Accordion type="multiple" defaultValue={["general", "triggers", "targeting", "frequency", "style"]}>
          <AccordionItem value="general">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <TextField
                  label="Name"
                  value={p.name}
                  onChange={(name) => updatePopup(p.id, { name })}
                />
                <ToggleField
                  label="Enabled"
                  checked={p.enabled}
                  onChange={(enabled) => updatePopup(p.id, { enabled })}
                />
                <div className="text-xs text-slate-500">
                  Editing a popup will <span className="font-medium">not</span> auto-open it. Popups only open in Preview/runtime.
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="triggers">
            <AccordionTrigger>Triggers</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => ensureTrigger({ type: "on_page_load" })}>
                    <Plus className="h-4 w-4 mr-1" /> Page load
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => ensureTrigger({ type: "after_seconds", seconds: 3 })}>
                    <Plus className="h-4 w-4 mr-1" /> After seconds
                  </Button>
                </div>

                {triggers.length === 0 ? (
                  <div className="text-sm text-slate-500">No triggers. Add one above.</div>
                ) : (
                  <div className="space-y-2">
                    {triggers.map((t: any, idx: number) => (
                      <div key={idx} className="rounded-lg border border-slate-200 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900">
                              {t.type === "on_page_load" ? "On page load" : t.type === "after_seconds" ? "After seconds" : t.type}
                            </div>
                            {t.type === "after_seconds" && (
                              <div className="mt-2">
                                <NumberField
                                  label="Seconds"
                                  value={typeof t.seconds === "number" ? t.seconds : 0}
                                  min={0}
                                  step={1}
                                  onChange={(seconds) => updateTriggerAt(idx, { ...t, seconds })}
                                />
                              </div>
                            )}
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeTriggerAt(idx)} title="Remove trigger">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="targeting">
            <AccordionTrigger>Targeting</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <SelectField
                  label="Mode"
                  value={p.targeting?.mode ?? "all"}
                  options={[
                    { value: "all", label: "All pages (use exclude to block)" },
                    { value: "include", label: "Only include matches" },
                    { value: "exclude", label: "Exclude matches" },
                  ]}
                  onChange={(mode) => updatePopupTargeting(p.id, { ...p.targeting, mode: mode as any })}
                />

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-700">Include patterns</div>
                  <Textarea
                    value={(p.targeting?.include ?? []).join("\n")}
                    onChange={(e) => updatePopupTargeting(p.id, { ...p.targeting, include: parseList(e.target.value) })}
                    placeholder={"/pricing\n/checkout\n/^\\/promo\\//"}
                  />
                  <div className="text-xs text-slate-500">One pattern per line. Use <code className="px-1 py-0.5 bg-slate-100 rounded">/regex/</code> for regex.</div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-700">Exclude patterns</div>
                  <Textarea
                    value={(p.targeting?.exclude ?? []).join("\n")}
                    onChange={(e) => updatePopupTargeting(p.id, { ...p.targeting, exclude: parseList(e.target.value) })}
                    placeholder={"/thank-you\n/admin"}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="frequency">
            <AccordionTrigger>Frequency</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <SelectField
                  label="Mode"
                  value={p.frequency?.mode ?? "every_visit"}
                  options={[
                    { value: "every_visit", label: "Every visit" },
                    { value: "once", label: "Once per visitor" },
                    { value: "cooldown", label: "Cooldown" },
                  ]}
                  onChange={(mode) => updatePopupFrequency(p.id, { ...p.frequency, mode: mode as any })}
                />

                {p.frequency?.mode === "cooldown" && (
                  <NumberField
                    label="Cooldown hours"
                    value={typeof p.frequency.cooldownHours === "number" ? p.frequency.cooldownHours : 24}
                    min={1}
                    step={1}
                    onChange={(cooldownHours) => updatePopupFrequency(p.id, { ...p.frequency, cooldownHours })}
                  />
                )}

                <NumberField
                  label="Max auto shows (0 = unlimited)"
                  value={typeof p.frequency?.maxShows === "number" ? p.frequency.maxShows : 0}
                  min={0}
                  step={1}
                  onChange={(maxShows) => updatePopupFrequency(p.id, { ...p.frequency, maxShows })}
                />

                <div className="text-xs text-slate-500">
                  Manual opens (CTA buttons) bypass frequency limits; auto triggers respect these rules.
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="animation">
            <AccordionTrigger>Animation</AccordionTrigger>
            <AccordionContent>
              <SelectField
                label="Animation"
                value={p.animation ?? "fade"}
                options={[
                  { value: "none", label: "None" },
                  { value: "fade", label: "Fade" },
                  { value: "slide", label: "Slide" },
                ]}
                onChange={(animation) => updatePopupAnimation(p.id, animation as any)}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="style">
            <AccordionTrigger>Style</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <TextField
                  label="Overlay color (rgba/hex)"
                  value={p.style?.overlayColor ?? "rgba(0,0,0,0.55)"}
                  onChange={(overlayColor) => updatePopupStyle(p.id, { overlayColor })}
                />
                <TextField
                  label="Background"
                  value={p.style?.background ?? "#ffffff"}
                  onChange={(background) => updatePopupStyle(p.id, { background })}
                />
                <NumberField
                  label="Max width (px)"
                  value={typeof p.style?.maxWidth === "number" ? p.style.maxWidth : 560}
                  min={240}
                  max={1200}
                  step={10}
                  onChange={(maxWidth) => updatePopupStyle(p.id, { maxWidth })}
                />
                <NumberField
                  label="Padding (px)"
                  value={typeof p.style?.padding === "number" ? p.style.padding : 24}
                  min={0}
                  max={120}
                  step={1}
                  onChange={(padding) => updatePopupStyle(p.id, { padding })}
                />
                <NumberField
                  label="Border radius (px)"
                  value={typeof p.style?.borderRadius === "number" ? p.style.borderRadius : 16}
                  min={0}
                  max={64}
                  step={1}
                  onChange={(borderRadius) => updatePopupStyle(p.id, { borderRadius })}
                />
                <ToggleField
                  label="Show close button"
                  checked={p.style?.showClose !== false}
                  onChange={(showClose) => updatePopupStyle(p.id, { showClose })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="pt-2 border-t border-slate-200">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              if (confirm("Delete this popup?")) {
                deletePopup(p.id);
                selectPopup(null);
              }
            }}
            className="w-full"
          >
            Delete Popup
          </Button>
        </div>
      </div>
    </div>
  );
}

// Page settings when nothing is selected  // Page settings when nothing is selected
  if (!node) {
    return (
      <div className="h-full flex flex-col">
        <InspectorHeader
          title="Page Settings"
          onToggle={toggleInspector}
        />
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-sm text-slate-600">
            Select an element to edit its properties, or add new elements from the left sidebar.
          </div>
        </div>
      </div>
    );
  }

  // Node settings
  const n = node;
  const nodeTitle = n.type === "element" ? (n as ElementNode).props.kind || "Element" : n.type;

  // For non-element nodes (section/row/column), show basic info
  if (n.type === "section" || n.type === "row" || n.type === "column") {
    return (
      <div className="h-full flex flex-col">
        <InspectorHeader
          title={n.type}
          breadcrumbs={breadcrumbs}
          onToggle={toggleInspector}
        />
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-sm text-slate-600">
            {n.type === "section" && "Section settings - use Alt+Click to select sections"}
            {n.type === "row" && "Row settings - use Alt+Click to select rows"}
            {n.type === "column" && "Column settings - use Alt+Click to select columns"}
          </div>
        </div>
      </div>
    );
  }

  // Element settings
  if (n.type === "element") {
    const el = n as ElementNode;
    const kind = el.props.kind;

    let elementPanel: React.ReactNode = null;

    switch (kind) {
      case "heading":
      case "subheading":
      case "paragraph":
      case "text":
        elementPanel = <TextPanelSimple node={el} />;
        break;
      case "video":
        elementPanel = <VideoPanel node={el} />;
        break;
      case "image":
        elementPanel = <ImagePanel node={el} />;
        break;
      case "button":
        elementPanel = <ButtonPanel node={el} />;
        break;
      case "divider":
        elementPanel = <DividerPanel node={el} />;
        break;
      case "spacer":
        elementPanel = <SpacerPanel node={el} />;
        break;
      case "coupon-code":
        elementPanel = <CouponCodePanel node={el} />;
        break;
      case "funnel.checkout":
        elementPanel = <CheckoutPanel node={el} />;
        break;
      case "funnel.offer":
        elementPanel = <OfferPanel node={el} />;
        break;
      default:
        elementPanel = (
          <div className="text-sm text-slate-600">
            No settings available for this element type.
          </div>
        );
    }

    return (
      <div className="h-full flex flex-col pb-[60px]">
        <InspectorHeader
          title={kind || "Element"}
          breadcrumbs={breadcrumbs}
          onClose={handleClose}
          onToggle={toggleInspector}
        />
        <div className="flex-1 overflow-y-auto p-4">
          {elementPanel}
        </div>
      </div>
    );
  }

  return null;
}

function InspectorHeader({
  title,
  subtitle,
  breadcrumbs,
  onClose,
  onToggle,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ id: string; type: string; label: string }>;
  onClose?: () => void;
  onToggle: () => void;
}) {
  const select = useFunnelEditorStore((s) => s.select);

  return (
    <div className="shrink-0 border-b border-slate-200 p-4 bg-white">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 capitalize truncate">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 truncate mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title="Collapse inspector"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-slate-500 overflow-x-auto">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.id}>
              {i > 0 && <span className="text-slate-300">›</span>}
              <button
                onClick={() => select(crumb.id)}
                className="hover:text-slate-700 capitalize truncate"
              >
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
