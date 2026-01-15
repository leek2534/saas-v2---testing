'use client';

import React, { useEffect, useState, useRef } from "react";
import { CanvasArea } from "../editor/CanvasArea";
import { Toolbar } from "../editor/Toolbar";
import { Sidebar } from "./Sidebar";
import { ContentPanel } from "./ContentPanel";
import { TopBar } from "./TopBar";
import { BottomBar } from "./BottomBar";
import { PositionSidebarPanel } from "../editor/Canvas/PositionSidebarPanel";
import { LayersPanel } from "../editor/Canvas/LayersPanel";
import { SimpleVideoTimeline } from './SimpleVideoTimeline';
import { useEditorStore } from "../lib/editor/store";
import { serializeState } from "../lib/editor/utils";
import { preloadCommonFonts } from "../lib/fonts/loadFont";
import { useKanvaKeyboardShortcuts } from "../hooks/useKanvaKeyboardShortcuts";
import { cn } from "../lib/utils";

export function KanvaEditor() {
  const [mounted, setMounted] = useState(false);
  const [pinnedTab, setPinnedTab] = useState<string | null>(null);
  const [hoverTab, setHoverTab] = useState<string | null>(null);
  const [rightSidebarPanel, setRightSidebarPanel] = useState<'position' | 'layers' | null>(null);
  const [showVideoTimeline, setShowVideoTimeline] = useState(false);
  const activeTab = pinnedTab || hoverTab;
  const isPinned = pinnedTab !== null;
  
  // Use refs to track hover state for setTimeout callbacks
  const isPanelHoveredRef = useRef(false);
  const isSidebarHoveredRef = useRef(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle hover tab changes with delay to allow cursor movement to panel
  const handleTabHover = (tab: string | null) => {
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    if (tab) {
      // Immediately show when hovering over a tab
      setHoverTab(tab);
      isSidebarHoveredRef.current = true;
    } else {
      // Delay clearing to allow cursor to move to panel
      isSidebarHoveredRef.current = false;
      hoverTimeoutRef.current = setTimeout(() => {
        // Only clear if panel is not hovered
        if (!isPanelHoveredRef.current) {
          setHoverTab(null);
        }
      }, 150);
    }
  };
  
  const handlePanelMouseEnter = () => {
    isPanelHoveredRef.current = true;
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };
  
  const handlePanelMouseLeave = () => {
    isPanelHoveredRef.current = false;
    if (!isPinned) {
      hoverTimeoutRef.current = setTimeout(() => {
        // Only clear if sidebar is not hovered
        if (!isSidebarHoveredRef.current) {
          setHoverTab(null);
        }
      }, 150);
    }
  };
  // Note: stageRef removed - new canvas doesn't need it
  const getStateSnapshot = useEditorStore((state) => state.getStateSnapshot);
  const reset = useEditorStore((state) => state.reset);
  const canvas = useEditorStore((state) => state.canvas);
  const elements = useEditorStore((state) => state.elements);
  const videoEditorMode = useEditorStore((state) => state.videoEditorMode);
  
  // Show video timeline only when in video editor mode AND there are video elements
  useEffect(() => {
    setShowVideoTimeline(videoEditorMode && elements.some(el => el.type === 'video'));
  }, [elements, videoEditorMode]);
  
  // Enable keyboard shortcuts (arrow keys for moving elements)
  useKanvaKeyboardShortcuts();
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
  
  // Ensure canvas has white background and is clean on mount
  useEffect(() => {
    const store = useEditorStore.getState();
    
    // Fix background color if it's not white
    if (!canvas.background?.color || canvas.background.color !== '#ffffff') {
      store.setCanvas({
        background: { color: '#ffffff' },
      });
    }
    
    // Clear any unwanted elements on first load (optional - remove if you want to keep persisted elements)
    // Uncomment the line below if you want to always start with a clean canvas
    // if (elements.length > 0 && !localStorage.getItem('kanva-has-been-used')) {
    //   store.reset();
    //   localStorage.setItem('kanva-has-been-used', 'true');
    // }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true);
      // Preload common fonts for better performance
      preloadCommonFonts();
    }
  }, []);

  // Handle JSON export
  useEffect(() => {
    const handleExportJSON = () => {
      const state = getStateSnapshot();
      const json = serializeState(state);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'kanva-design.json';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    };

    window.addEventListener('kanva-export-json', handleExportJSON);

    return () => {
      window.removeEventListener('kanva-export-json', handleExportJSON);
    };
  }, [getStateSnapshot]);

  // Handle opening sidebar tabs (e.g., from font expand button)
  useEffect(() => {
    const handleOpenSidebarTab = (event: CustomEvent) => {
      const tab = event.detail;
      setPinnedTab(tab); // Pin the tab to keep it open
    };

    window.addEventListener('openSidebarTab', handleOpenSidebarTab as EventListener);

    return () => {
      window.removeEventListener('openSidebarTab', handleOpenSidebarTab as EventListener);
    };
  }, []);

  return (
    <div className="flex w-full h-full bg-background text-foreground flex-col overflow-hidden">
      {!mounted ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-3">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
            <p className="text-muted-foreground text-sm">
              Initializing Kanva editor…
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* TopBar 1: Main navigation */}
          <TopBar />
          
          {/* TopBar 2: Toolbar */}
          <div className="w-full border-b border-border bg-muted/20">
            <Toolbar
              activePanel={rightSidebarPanel}
              onTogglePanel={(panel) => {
                setRightSidebarPanel(panel === rightSidebarPanel ? null : panel);
              }}
            />
          </div>
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            <div className="flex-1 flex overflow-hidden min-h-0 relative" style={{ isolation: 'auto' }}>
              <Sidebar
                activeTab={activeTab}
                pinnedTab={pinnedTab}
                onTabHover={handleTabHover}
                onTabClick={(tab) => {
                  if (pinnedTab === tab) {
                    setPinnedTab(null);
                  } else {
                    setPinnedTab(tab);
                  }
                }}
              />
              
              {/* ContentPanel - absolute positioned when not pinned */}
              <div 
                className={cn(
                  isPinned ? "flex-shrink-0" : "absolute left-20 top-0 bottom-0 z-50",
                  !activeTab && "hidden"
                )}
                style={{
                  transition: isPinned ? 'none' : 'opacity 0.2s ease-in-out',
                }}
                onMouseEnter={handlePanelMouseEnter}
                onMouseLeave={handlePanelMouseLeave}
              >
                <ContentPanel
                  activeTab={activeTab || ''}
                />
              </div>
              
              {/* Canvas area */}
              <CanvasArea />
              
              {/* Right sidebar panel */}
              {rightSidebarPanel && (
                <div className="w-80 bg-card border-l border-border flex-shrink-0 overflow-hidden">
                  {rightSidebarPanel === "position" && <PositionSidebarPanel />}
                  {rightSidebarPanel === "layers" && <LayersPanel />}
                </div>
              )}
            </div>
            
            {/* Video Timeline - appears when working with videos */}
            {showVideoTimeline && <SimpleVideoTimeline />}
          </div>
          
          <BottomBar />
        </>
      )}
    </div>
  );
}
