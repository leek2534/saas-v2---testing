"use client";

import React from "react";
import { Eye, Save, ArrowLeft } from "lucide-react";
import { DomRegistryProvider } from "./overlays/DomRegistry";
import { EditorOverlays } from "./overlays/EditorOverlays";
import { LeftSidebar } from "./shell/LeftSidebar";
import { PopupsSection } from "./shell/TopNav";
import { PageStepsBanner } from "./shell/PageStepsBanner";
import { InspectorRail } from "./shell/InspectorRail";
import { Canvas } from "./editor/Canvas";
import { ViewportBar } from "./editor/ViewportBar";
import { useFunnelEditorStore } from "./store/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FunnelBuilderAppProps {
  stepContext?: any;

  teamSlug?: string;
  teamName?: string;
  /** When true, initializes the editor with a demo document if the tree is empty. */
  autoInitDemo?: boolean;
}

export default function FunnelBuilderApp({ teamSlug, teamName, autoInitDemo = true, stepContext }: FunnelBuilderAppProps) {
  const init = useFunnelEditorStore((s) => s.init);
  const setStepContext = useFunnelEditorStore((s) => s.setStepContext);
  const mode = useFunnelEditorStore((s) => s.mode);
  const togglePreview = useFunnelEditorStore((s) => s.togglePreview);
  const saveToLocal = useFunnelEditorStore((s) => s.saveToLocal);
  const workspace = useFunnelEditorStore((s) => s.workspace);
  const activePopupId = useFunnelEditorStore((s) => s.activePopupId);
  const tree = useFunnelEditorStore((s) => s.tree);
  const backToPage = useFunnelEditorStore((s) => s.backToPage);

  const isInitialized = tree.pageRootIds.length > 0;

  React.useEffect(() => {
    if (!isInitialized && autoInitDemo) init();
  }, [isInitialized, init]);

  React.useEffect(() => {
    if (stepContext) {
      setStepContext(stepContext);
    }
  }, [stepContext, setStepContext]);


  const handleSave = () => {
    saveToLocal();
  };

  return (
    <DomRegistryProvider>
      <div className="relative h-full w-full overflow-hidden bg-slate-100">
        {/* top bar */}
        <div className="flex h-14 items-center border-b border-slate-200 bg-white px-4">
          {/* Left section - Back button when editing popup */}
          <div className="flex w-48 items-center gap-2">
            {workspace === "popup" && activePopupId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={backToPage}
                className="gap-1.5"
              >
                <ArrowLeft size={14} />
                Back to Page
              </Button>
            )}
          </div>

          {/* Center section - Viewport controls with popups */}
          <div className="flex flex-1 items-center justify-center gap-3">
            {workspace === "popup" && activePopupId && (
              <div className="mr-4 text-xs font-medium text-slate-500">
                Editing: <span className="text-slate-900">{tree.popups[activePopupId]?.name ?? "Popup"}</span>
              </div>
            )}
            <ViewportBar />
            <div className="h-6 w-px bg-slate-200" />
            <PopupsSection />
          </div>

          {/* Right section - Save and Preview buttons */}
          <div className="flex w-48 items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="gap-1.5"
            >
              <Save size={14} />
              Save
            </Button>
            <Button
              variant={mode === "preview" ? "default" : "outline"}
              size="sm"
              onClick={togglePreview}
              className="gap-1.5"
            >
              <Eye size={14} />
              {mode === "preview" ? "Exit Preview" : "Preview"}
            </Button>
          </div>
        </div>

        {/* main - extends to bottom to touch banner */}
        <div className="relative flex h-[calc(100%-56px)] overflow-hidden">
          <div className={cn(mode === "preview" ? "hidden" : "flex", "h-full relative z-10")}>
            <LeftSidebar />
          </div>

          <div className="relative flex-1 h-full overflow-hidden pb-[60px]">
            <Canvas />
          </div>

          {/* Inspector rail - 3-state panel */}
          <div className={cn(mode === "preview" ? "hidden" : "flex", "h-full")}>
            <InspectorRail />
          </div>
        </div>

        <EditorOverlays />
        
        {/* Page Steps Banner - Sticky bottom navigation, full width above all panels */}
        <PageStepsBanner />
      </div>
    </DomRegistryProvider>
  );
}
