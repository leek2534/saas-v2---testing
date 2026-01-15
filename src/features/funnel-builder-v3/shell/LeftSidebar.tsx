"use client";

import React from "react";
import { X, HelpCircle } from "lucide-react";
import { useFunnelEditorStore } from "../store/store";
import { Button } from "@/components/ui/button";
import { AddElementModal } from "./AddElementModal";
import { SidebarTabs, SidebarTab } from "./sidebar/SidebarTabs";
import { BlocksTab } from "./sidebar/BlocksTab";
import { ElementsTab } from "./sidebar/ElementsTab";
import { LayoutTab } from "./sidebar/LayoutTab";

export function LeftSidebar() {
  const workspace = useFunnelEditorStore((s) => s.workspace);
  const backToPage = useFunnelEditorStore((s) => s.backToPage);

  const [showGuide, setShowGuide] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<SidebarTab>("elements");

  return (
    <div className="flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      {/* Header */}
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

      {/* Tabs */}
      <SidebarTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "blocks" && <BlocksTab />}
        {activeTab === "elements" && <ElementsTab />}
        {activeTab === "layout" && <LayoutTab />}
      </div>

      <AddElementModal open={showGuide} onOpenChange={setShowGuide} />
    </div>
  );
}
