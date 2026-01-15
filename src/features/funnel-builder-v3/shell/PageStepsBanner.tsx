"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFunnelEditorStore } from "../store/store";
import { cn } from "@/lib/utils";

interface PageStep {
  _id: string;
  name: string;
  type: string;
  pageId?: string;
}

export function PageStepsBanner() {
  const router = useRouter();
  const stepContext = useFunnelEditorStore((s) => s.stepContext);
  const openStepSettings = useFunnelEditorStore((s) => s.openStepSettings);
  const [hoveredStepId, setHoveredStepId] = useState<string | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const previewRef = useRef<HTMLDivElement>(null);

  if (!stepContext || !stepContext.steps || stepContext.steps.length === 0) {
    return null;
  }

  const handleMouseEnter = (stepId: string) => {
    setHoveredStepId(stepId);
    
    // Get button position for portal positioning
    const button = buttonRefs.current.get(stepId);
    if (button) {
      setButtonRect(button.getBoundingClientRect());
    }
    
    // Start timer for showing actions after 500ms
    hoverTimerRef.current = setTimeout(() => {
      setShowActions(stepId);
    }, 500);
  };

  const handleMouseLeave = () => {
    // Don't immediately hide - wait a bit to allow moving to preview
    setTimeout(() => {
      // Check if mouse is over preview
      if (!previewRef.current?.matches(':hover')) {
        setHoveredStepId(null);
        setShowActions(null);
        setButtonRect(null);
      }
    }, 100);
    
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const handlePreviewMouseLeave = () => {
    setHoveredStepId(null);
    setShowActions(null);
    setButtonRect(null);
  };

  const handleGoToPage = (step: PageStep) => {
    if (step.pageId) {
      router.push(`/t/${stepContext.teamSlug}/pages/${step.pageId}/edit`);
    }
  };

  const handleSettings = (stepId: string) => {
    openStepSettings(stepId);
  };

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[200] bg-white border border-slate-200 rounded-t-lg px-4 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-lg transition-colors"
      >
        Show Pages
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] overflow-visible">
      <div className="flex items-center gap-2 overflow-x-auto overflow-y-visible px-4 py-2 relative">
        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            PAGES:
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            title="Hide page steps"
          >
            ✕
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {stepContext.steps.map((step: PageStep) => {
            const isCurrent = stepContext.currentStepId === step._id;
            const isHovered = hoveredStepId === step._id;
            const shouldShowActions = showActions === step._id;
            
            return (
              <div
                key={step._id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(step._id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Main Step Button */}
                <button
                  ref={(el) => {
                    if (el) buttonRefs.current.set(step._id, el);
                  }}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                    isCurrent
                      ? "border-blue-600 bg-blue-600 text-white shadow-md"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <span>{step.name}</span>
                  <span className={cn(
                    "rounded px-1.5 py-0.5 text-xs font-semibold",
                    isCurrent 
                      ? "bg-blue-500 text-blue-100" 
                      : "bg-slate-100 text-slate-600"
                  )}>
                    {step.type}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Portal-based hover preview to escape overflow clipping */}
      {hoveredStepId && buttonRect && typeof document !== 'undefined' && createPortal(
        <div
          ref={previewRef}
          className="fixed z-[300]"
          style={{
            left: buttonRect.left + buttonRect.width / 2,
            bottom: window.innerHeight - buttonRect.top + 8,
            transform: 'translateX(-50%)'
          }}
          onMouseEnter={() => handleMouseEnter(hoveredStepId)}
          onMouseLeave={handlePreviewMouseLeave}
        >
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="rounded-lg border border-slate-200 bg-white shadow-xl overflow-hidden">
              {/* Page Preview */}
              <div className="w-80 h-60 bg-white border-b border-slate-200 overflow-hidden relative">
                {(() => {
                  const currentStep = stepContext.steps.find((s: PageStep) => s._id === hoveredStepId);
                  const pageTree = currentStep?.pageId && stepContext.pageTreesById 
                    ? stepContext.pageTreesById[currentStep.pageId] 
                    : null;
                  
                  if (!currentStep?.pageId || !pageTree) {
                    return (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="text-sm font-semibold text-slate-900 mb-1">
                            {currentStep?.name}
                          </div>
                          <div className="text-xs text-slate-500 mb-2">
                            {currentStep?.type} page
                          </div>
                          <div className="mt-2 text-xs text-amber-600">
                            No page assigned
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="absolute inset-0">
                      {/* Scaled page preview with iframe-like rendering */}
                      <div 
                        className="absolute inset-0 origin-top-left bg-white"
                        style={{
                          transform: 'scale(0.25)',
                          width: '320%',
                          height: '240%',
                          pointerEvents: 'none'
                        }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
                          <div className="max-w-4xl mx-auto space-y-4">
                            {/* Simulated page content */}
                            <div className="h-12 bg-slate-200 rounded-lg animate-pulse" />
                            <div className="h-8 bg-slate-100 rounded w-3/4 animate-pulse" />
                            <div className="h-32 bg-slate-50 rounded-lg border-2 border-slate-200 animate-pulse" />
                            <div className="grid grid-cols-2 gap-4">
                              <div className="h-24 bg-slate-100 rounded animate-pulse" />
                              <div className="h-24 bg-slate-100 rounded animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Overlay with page info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pointer-events-none">
                        <div className="text-xs font-medium text-white">
                          {currentStep.name}
                        </div>
                        <div className="text-[10px] text-white/80">
                          {currentStep.type} • Click to edit
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Actions (shown after hover delay) */}
              {showActions === hoveredStepId && (
                <div className="p-2 flex items-center gap-2 bg-slate-50">
                  {stepContext.steps.find((s: PageStep) => s._id === hoveredStepId)?.pageId && (
                    <button
                      onClick={() => handleGoToPage(stepContext.steps.find((s: PageStep) => s._id === hoveredStepId)!)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Go To
                    </button>
                  )}
                  <button
                    onClick={() => handleSettings(hoveredStepId)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="h-3 w-3" />
                    Settings
                  </button>
                </div>
              )}
            </div>
            
            {/* Arrow pointer */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="border-8 border-transparent border-t-white" />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
