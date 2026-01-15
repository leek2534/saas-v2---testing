"use client";

import React, { useState } from "react";
import {
  Type,
  Square,
  Image as ImageIcon,
  Video,
  CreditCard,
  Sparkles,
  User,
  Package,
  FileText,
  Wallet,
  Gift,
  ArrowRight,
  BarChart3,
  Search,
} from "lucide-react";
import { useFunnelEditorStore } from "../../store/store";
import { cn } from "@/lib/utils";
import { CategorySection } from "./CategorySection";
import type { AnyNode } from "../../store/types";

export function ElementsTab() {
  const addElement = useFunnelEditorStore((s) => s.addElement);
  const addElementBelow = useFunnelEditorStore((s) => s.addElementBelow);
  const tree = useFunnelEditorStore((s) => s.tree);
  const selectedId = useFunnelEditorStore((s) => s.selectedId);

  const [searchQuery, setSearchQuery] = useState("");

  const selectedNode = selectedId ? (tree.nodes[selectedId] as AnyNode | undefined) : undefined;
  const canAddElement = selectedNode?.type === "column" || selectedNode?.type === "element";
  const isElementSelected = selectedNode?.type === "element";

  const handleAddElement = (kind: string) => {
    if (!canAddElement) return;
    isElementSelected ? addElementBelow(kind) : addElement(kind);
  };

  const elementButton = (kind: string, label: string, icon: React.ReactNode) => {
    const matchesSearch = searchQuery === "" || 
      label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kind.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return null;

    return (
      <button
        key={kind}
        onClick={() => handleAddElement(kind)}
        disabled={!canAddElement}
        className={cn(
          "rounded-lg border border-slate-200 px-2 py-2 text-xs transition-colors",
          canAddElement ? "hover:bg-slate-50 hover:border-slate-300" : "opacity-40 cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
      </button>
    );
  };

  const contentElements = [
    { kind: "heading", label: "Heading", icon: <Type size={14} /> },
    { kind: "subheading", label: "Subheading", icon: <Type size={14} /> },
    { kind: "paragraph", label: "Paragraph", icon: <Type size={14} /> },
  ];

  const mediaElements = [
    { kind: "image", label: "Image", icon: <ImageIcon size={14} /> },
    { kind: "video", label: "Video", icon: <Video size={14} /> },
  ];

  const checkoutElements = [
    { kind: "checkout.steps", label: "Steps", icon: <BarChart3 size={14} /> },
    { kind: "checkout.contact", label: "Contact", icon: <User size={14} /> },
    { kind: "checkout.products", label: "Products", icon: <Package size={14} /> },
    { kind: "checkout.summary", label: "Summary", icon: <FileText size={14} /> },
    { kind: "checkout.payment", label: "Payment", icon: <Wallet size={14} /> },
    { kind: "checkout.bump", label: "Bump", icon: <Gift size={14} /> },
    { kind: "checkout.button", label: "Button", icon: <ArrowRight size={14} /> },
  ];

  const marketingElements = [
    { kind: "button", label: "Button", icon: <Square size={14} /> },
    { kind: "checkout", label: "Checkout", icon: <CreditCard size={14} /> },
    { kind: "offer", label: "Offer", icon: <Sparkles size={14} /> },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Elements List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!canAddElement && (
          <div className="text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-lg p-3">
            Select a column to add elements
          </div>
        )}

        {/* Content Elements */}
        <CategorySection
          id="content"
          label="Content"
          icon={Type}
          defaultOpen={true}
        >
          <div className="grid grid-cols-2 gap-2">
            {contentElements.map((el) => elementButton(el.kind, el.label, el.icon))}
          </div>
        </CategorySection>

        {/* Media Elements */}
        <CategorySection
          id="media"
          label="Media"
          icon={ImageIcon}
          defaultOpen={true}
        >
          <div className="grid grid-cols-2 gap-2">
            {mediaElements.map((el) => elementButton(el.kind, el.label, el.icon))}
          </div>
        </CategorySection>

        {/* Checkout Elements */}
        <CategorySection
          id="checkout"
          label="Checkout"
          icon={CreditCard}
          defaultOpen={true}
          highlight={true}
        >
          <div className="grid grid-cols-2 gap-2">
            {checkoutElements.map((el) => elementButton(el.kind, el.label, el.icon))}
          </div>
          <div className="mt-2 text-xs text-blue-600">
            Build custom checkout flows
          </div>
        </CategorySection>

        {/* Marketing Elements */}
        <CategorySection
          id="marketing"
          label="Marketing"
          icon={Sparkles}
          defaultOpen={true}
        >
          <div className="grid grid-cols-2 gap-2">
            {marketingElements.map((el) => elementButton(el.kind, el.label, el.icon))}
          </div>
        </CategorySection>
      </div>
    </div>
  );
}
