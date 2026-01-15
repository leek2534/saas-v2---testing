"use client";

import React from "react";
import {
  LayoutTemplate,
  Rows3,
  Columns3,
  Type,
  Square,
  Image as ImageIcon,
  Video,
  X,
  HelpCircle,
  CreditCard,
  Sparkles,
  User,
  Package,
  FileText,
  Wallet,
  Gift,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { useFunnelEditorStore } from "../store/store";
import type { AnyNode } from "../store/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AddElementModal } from "./AddElementModal";

export function LeftSidebar() {
  const addSection = useFunnelEditorStore((s) => s.addSection);
  const addSectionToActivePopup = useFunnelEditorStore((s) => s.addSectionToActivePopup);
  const addRow = useFunnelEditorStore((s) => s.addRow);
  const addColumn = useFunnelEditorStore((s) => s.addColumn);
  const addElement = useFunnelEditorStore((s) => s.addElement);
  const addElementBelow = useFunnelEditorStore((s) => s.addElementBelow);

  const tree = useFunnelEditorStore((s) => s.tree);
  const selectedId = useFunnelEditorStore((s) => s.selectedId);
  const workspace = useFunnelEditorStore((s) => s.workspace);
  const activePopupId = useFunnelEditorStore((s) => s.activePopupId);
  const backToPage = useFunnelEditorStore((s) => s.backToPage);

  const selectedNode = selectedId ? (tree.nodes[selectedId] as AnyNode | undefined) : undefined;

  const canAddRow = selectedNode?.type === "section";
  const canAddColumn = selectedNode?.type === "row";
  const canAddElement = selectedNode?.type === "column" || selectedNode?.type === "element";
  const isElementSelected = selectedNode?.type === "element";

  const [showGuide, setShowGuide] = React.useState(false);

  return (
    <div className="flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">
            {workspace === "popup" ? "Popup Builder" : "Builder"}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGuide(true)}
            className="h-7 gap-1 px-2 text-xs text-slate-500 hover:text-slate-900"
          >
            <HelpCircle className="h-4 w-4" />
            Guide
          </Button>
        </div>

        {workspace === "popup" && (
          <button
            onClick={backToPage}
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <X size={16} />
              <span>Exit popup editing</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">Back to the page canvas</div>
          </button>
        )}
      </div>

      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-4 pt-3">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-500">Add</div>

            <button
              onClick={workspace === "popup" ? addSectionToActivePopup : addSection}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm hover:bg-slate-100"
            >
              <div className="flex items-center gap-2">
                <LayoutTemplate size={16} />
                <span>{workspace === "popup" ? "Add Popup Section" : "Add Section"}</span>
              </div>
            </button>

            <button
              onClick={() => canAddRow && addRow()}
              disabled={!canAddRow}
              className={cn(
                "w-full rounded-xl border border-slate-200 px-3 py-2 text-left text-sm",
                canAddRow ? "bg-slate-50 hover:bg-slate-100" : "bg-slate-50 opacity-40"
              )}
            >
              <div className="flex items-center gap-2">
                <Rows3 size={16} />
                <span>Add Row</span>
              </div>
            </button>

            <button
              onClick={() => canAddColumn && addColumn()}
              disabled={!canAddColumn}
              className={cn(
                "w-full rounded-xl border border-slate-200 px-3 py-2 text-left text-sm",
                canAddColumn ? "bg-slate-50 hover:bg-slate-100" : "bg-slate-50 opacity-40"
              )}
            >
              <div className="flex items-center gap-2">
                <Columns3 size={16} />
                <span>Add Column</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">Select a row first</div>
            </button>

            <div className="rounded-xl border border-slate-200 p-2">
              <div className="mb-2 text-xs font-semibold text-slate-500">Elements</div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("heading") : addElement("heading");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-slate-200 px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-slate-50" : "opacity-40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Type size={14} />
                    Heading
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("subheading") : addElement("subheading");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-slate-200 px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-slate-50" : "opacity-40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Type size={14} />
                    Subheading
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("paragraph") : addElement("paragraph");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-slate-200 px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-slate-50" : "opacity-40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Type size={14} />
                    Paragraph
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("button") : addElement("button");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-slate-200 px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-slate-50" : "opacity-40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Square size={14} />
                    Button
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("image") : addElement("image");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-slate-200 px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-slate-50" : "opacity-40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon size={14} />
                    Image
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("video") : addElement("video");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-slate-200 px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-slate-50" : "opacity-40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Video size={14} />
                    Video
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("checkout") : addElement("checkout");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-slate-200 px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-slate-50" : "opacity-40"
                  )}
                  title="Checkout block"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} />
                    Checkout
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("offer") : addElement("offer");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-slate-200 px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-slate-50" : "opacity-40"
                  )}
                  title="Offer block"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} />
                    Offer
                  </div>
                </button>
              </div>

              <div className="mt-2 text-xs text-slate-500">Select a column to enable</div>
            </div>

            {/* Checkout Elements Section */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-2">
              <div className="mb-2 text-xs font-semibold text-blue-700">Checkout Elements</div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("checkout.steps") : addElement("checkout.steps");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-blue-200 bg-white px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-blue-50" : "opacity-40"
                  )}
                  title="Step indicator"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 size={14} />
                    Steps
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("checkout.contact") : addElement("checkout.contact");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-blue-200 bg-white px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-blue-50" : "opacity-40"
                  )}
                  title="Contact form"
                >
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    Contact
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("checkout.products") : addElement("checkout.products");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-blue-200 bg-white px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-blue-50" : "opacity-40"
                  )}
                  title="Product selector"
                >
                  <div className="flex items-center gap-2">
                    <Package size={14} />
                    Products
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("checkout.summary") : addElement("checkout.summary");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-blue-200 bg-white px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-blue-50" : "opacity-40"
                  )}
                  title="Order summary"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={14} />
                    Summary
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("checkout.payment") : addElement("checkout.payment");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-blue-200 bg-white px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-blue-50" : "opacity-40"
                  )}
                  title="Payment method"
                >
                  <div className="flex items-center gap-2">
                    <Wallet size={14} />
                    Payment
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("checkout.bump") : addElement("checkout.bump");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-blue-200 bg-white px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-blue-50" : "opacity-40"
                  )}
                  title="Order bump"
                >
                  <div className="flex items-center gap-2">
                    <Gift size={14} />
                    Bump
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (!canAddElement) return;
                    isElementSelected ? addElementBelow("checkout.button") : addElement("checkout.button");
                  }}
                  disabled={!canAddElement}
                  className={cn(
                    "rounded-lg border border-blue-200 bg-white px-2 py-2 text-xs",
                    canAddElement ? "hover:bg-blue-50" : "opacity-40"
                  )}
                  title="Checkout button"
                >
                  <div className="flex items-center gap-2">
                    <ArrowRight size={14} />
                    Button
                  </div>
                </button>
              </div>

              <div className="mt-2 text-xs text-blue-600">Build custom checkout flows</div>
            </div>
          </div>
        </div>
      </div>

      <AddElementModal open={showGuide} onOpenChange={setShowGuide} />
    </div>
  );
}
