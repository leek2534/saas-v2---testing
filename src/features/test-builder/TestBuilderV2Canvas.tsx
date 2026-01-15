"use client";

/**
 * TestBuilderV2Canvas - Main canvas component for the page builder
 * 
 * Structure:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ [Left Sidebar]  │  [Main Canvas Area]  │  [Right Sidebar]  │
 * │                 │                      │                   │
 * │ - Elements      │  ┌─ Toolbar ───────┐ │  - Settings Panel │
 * │ - Templates     │  │ Device | Save   │ │  - Hierarchy      │
 * │ - Tools         │  └─────────────────┘ │                   │
 * │                 │  ┌─ Browser Frame ─┐ │                   │
 * │                 │  │ ┌─ Viewport ──┐ │ │                   │
 * │                 │  │ │  Sections   │ │ │                   │
 * │                 │  │ │  └─ Rows    │ │ │                   │
 * │                 │  │ │    └─ Cols  │ │ │                   │
 * │                 │  │ └─────────────┘ │ │                   │
 * │                 │  └─────────────────┘ │                   │
 * │                 │  [Funnel Navigator]  │                   │
 * └─────────────────────────────────────────────────────────────┘
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTestBuilderV2Store } from './store';
import type { Section } from './store';

// Layout Components
import { TestBuilderSidebar } from './TestBuilderSidebar';
import { SectionComponent } from './SectionComponent';
import { UnifiedSettingsPanel } from './UnifiedSettingsPanel';
import { ElementHierarchy } from './ElementHierarchy';
import { FunnelStepNavigator } from './FunnelStepNavigator';
import { DragDropProvider } from './DragDropProvider';

// Toolbar Components
import { ToolbarContextIndicator } from './ToolbarContextIndicator';
import { EnhancedSaveIndicator } from './EnhancedSaveIndicator';
import { DevicePreview, type DeviceType } from './DevicePreview';

// Canvas Components
import { ContentAreaMarker } from './ContentAreaMarker';
import { GSAPCanvasDrag } from './GSAPCanvasDrag';

// Modals & Popups
import { PopupEditor } from './PopupEditor';
import { PopupConfigurator } from './PopupConfigurator';
import { TemplateGallery } from './TemplateGallery';
import { SectionModal, type SectionConfig } from './SectionModal';
import { RowModal, type RowConfig } from './RowModal';
import { ColumnModal, type ColumnConfig } from './ColumnModal';

// Hooks & Utils
import { useTestBuilderPersistence } from '@/hooks/useTestBuilderPersistence';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { Button } from '@/components/ui/button';
import { Layers, Eye, Edit3, Sparkles, Menu, Monitor, Tablet, Smartphone, Layout, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type HoverableType = 'section' | 'row' | 'column' | 'element' | null;
type TemplateSelection = { name: string; sections: Section[] };

// Viewport sizes (2025 web design standards):
// Mobile: 375px (iPhone), Tablet: 768px (iPad), Desktop: 1440px (standard)

export function TestBuilderV2Canvas() {
  const {
    sections,
    addSection,
    addRow,
    addColumn,
    selectedSectionId,
    selectedRowId,
    selectedColumnId,
    selectedElementId,
    hoveredType,
    setHover,
    isResizing,
    viewport,
    setViewport,
    viewMode,
    setViewMode,
    showLeftSidebar,
    showRightSidebar,
    rightSidebarExpanded,
    toggleLeftSidebar,
    loadTemplate,
    funnel,
  } = useTestBuilderV2Store();

  // Safety check - ensure funnel exists
  if (!funnel) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <p className="text-primary/60">Initializing test builder...</p>
      </div>
    );
  }

  // Enhanced auto-save hook
  useTestBuilderPersistence(funnel?.id || undefined);
  
  // Keyboard shortcuts
  useKeyboardShortcuts();
  
  const [showPopupEditor, setShowPopupEditor] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showRowModal, setShowRowModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);
  const [targetRowId, setTargetRowId] = useState<string | null>(null);
  const [showPopupSettings, setShowPopupSettings] = useState(false);
  const [showHierarchy, setShowHierarchy] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  
  // Canvas ref for GSAP Draggable
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-responsive viewport detection based on window size
  const updateViewportFromWindowSize = useCallback(() => {
    const width = window.innerWidth;
    // Account for sidebars (left ~280px, right ~320px when open)
    const availableWidth = width - (showLeftSidebar ? 280 : 0) - (showRightSidebar ? 320 : 0);
    
    if (availableWidth < 500) {
      if (viewport !== 'mobile') setViewport('mobile');
    } else if (availableWidth < 900) {
      if (viewport !== 'tablet') setViewport('tablet');
    } else {
      if (viewport !== 'desktop') setViewport('desktop');
    }
  }, [viewport, setViewport, showLeftSidebar, showRightSidebar]);

  // Listen for window resize to auto-switch viewport
  useEffect(() => {
    // Only auto-switch if user hasn't manually selected a viewport recently
    const handleResize = () => {
      // Debounce the resize handler
      const timeoutId = setTimeout(updateViewportFromWindowSize, 150);
      return () => clearTimeout(timeoutId);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateViewportFromWindowSize]);

  // Global mouse move handler to detect hover from any direction
  useEffect(() => {
    let rafId: number | null = null;
    let lastHoverType: string | null = null;
    let lastHoverId: string | null = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for smooth performance
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        // Skip hover detection if currently resizing columns
        if (isResizing) return;
        
        const target = e.target as HTMLElement;
        
        // Skip if hovering over resize handle
        const resizeHandle = target.closest('[data-resize-handle]');
        if (resizeHandle) {
          setHover(null, null);
          lastHoverType = null;
          lastHoverId = null;
          return;
        }
        
        // Skip if hovering over header bar (keep current hover)
        const headerBar = target.closest('[data-header-bar]');
        if (headerBar) {
          return;
        }
        
        // Find ALL layout elements in hierarchy
        const columnEl = target.closest('[data-column-id]') as HTMLElement;
        const rowEl = target.closest('[data-row-id]') as HTMLElement;
        const sectionEl = target.closest('[data-section-id]') as HTMLElement;
        
        let newType: string | null = null;
        let newId: string | null = null;
        
        // CRITICAL: Row hover stays active when cursor is anywhere within row bounds
        // Priority: Always show row hover when inside row, regardless of nested elements
        if (rowEl) {
          // Always set row hover when inside a row
          newType = 'row';
          newId = rowEl.getAttribute('data-row-id');
        } else if (sectionEl) {
          newType = 'section';
          newId = sectionEl.getAttribute('data-section-id');
        }
        
        // Only update if it's different from current hover
        if (newType !== lastHoverType || newId !== lastHoverId) {
          const hoverType = (newType ?? null) as HoverableType;
          setHover(hoverType, newId);
          lastHoverType = newType;
          lastHoverId = newId;
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [setHover, isResizing]);


  const handleAddSection = () => {
    setShowSectionModal(true);
  };

  const handleCreateSection = (config: SectionConfig) => {
    addSection({
      containerType: config.containerType,
      maxWidth: config.maxWidth,
      rows: config.rows,
    });
    toast.success('Section created with layout!');
  };

  const handleAddRow = (sectionId: string) => {
    setTargetSectionId(sectionId);
    setShowRowModal(true);
  };

  const handleCreateRow = (config: RowConfig) => {
    if (!targetSectionId) return;
    
    // Extract column widths from config
    const columnWidths = config.columns.map(col => col.width);
    
    // Add row with columns and their widths
    addRow(targetSectionId, config.columnCount as 1 | 2 | 3 | 4 | 5 | 6, columnWidths);
    
    toast.success('Row added with layout!');
    setShowRowModal(false);
    setTargetSectionId(null);
  };

  const handleAddColumn = (sectionId: string, rowId: string) => {
    setTargetSectionId(sectionId);
    setTargetRowId(rowId);
    setShowColumnModal(true);
  };

  const handleCreateColumn = (config: ColumnConfig) => {
    if (!targetSectionId || !targetRowId) return;
    
    // Add column with specified width and position
    addColumn(targetSectionId, targetRowId, config.width, config.position);
    
    toast.success('Column added!');
    setShowColumnModal(false);
    setTargetSectionId(null);
    setTargetRowId(null);
  };


  const handleShowPopupSettings = () => {
    setShowPopupSettings(true);
  };

  const handleSelectTemplate = (template: TemplateSelection) => {
    loadTemplate(template.sections);
    toast.success(`Template "${template.name}" loaded successfully!`);
  };

  // Auto-hide sidebar on mobile viewport
  useEffect(() => {
    if (viewport === 'mobile' && showLeftSidebar) {
      toggleLeftSidebar();
    }
  }, [viewport, showLeftSidebar, toggleLeftSidebar]);

  return (
    <DragDropProvider>
      <div className="flex-1 flex overflow-hidden w-full h-full bg-muted/40 dark:bg-neutral-950" suppressHydrationWarning>
        {/* Left Sidebar - Conditionally Shown (hidden in preview mode) */}
        {showLeftSidebar && viewMode === 'edit' && (
          <TestBuilderSidebar 
            onAddSection={handleAddSection}
            onAddRow={handleAddRow}
            onAddColumn={handleAddColumn}
          />
        )}

        {/* Main Canvas - Flexible Width with Navigator */}
        <div className="flex-1 flex flex-col bg-muted/50 overflow-hidden relative z-0 min-w-0">
        {/* Clean Toolbar - Single Row (hidden in preview mode) */}
        {viewMode === 'edit' && (
        <div className="bg-card border-b border-border px-3 py-1.5 flex items-center gap-3">
          {/* Left: Context Indicator */}
          <ToolbarContextIndicator />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Center: Device Preview */}
          <DevicePreview
            selectedDevice={viewport as DeviceType}
            onDeviceChange={(device) => setViewport(device)}
            className="h-7"
          />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: Action Buttons - Compact */}
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowTemplateGallery(true)}
              title="Templates"
              className="h-8 px-2"
            >
              <Sparkles className="w-4 h-4" />
            </Button>

            <EnhancedSaveIndicator />

            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const currentMode = useTestBuilderV2Store.getState().viewMode;
                setViewMode(currentMode === 'preview' ? 'edit' : 'preview');
              }}
              title="Preview"
              className="h-8 px-2"
            >
              <Eye className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant={showHierarchy ? "secondary" : "ghost"}
              onClick={() => setShowHierarchy(!showHierarchy)}
              title="Layers"
              className="h-8 px-2"
            >
              <Layers className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPopupEditor(true)}
              title="Popup"
              className="h-8 px-2"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
        )}

        {/* Preview Mode Exit Button - Floating */}
        {viewMode === 'preview' && (
          <div className="absolute top-4 right-4 z-[9999]">
            <Button
              size="sm"
              variant="default"
              onClick={() => setViewMode('edit')}
              title="Exit Preview Mode"
              className="shadow-lg"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Exit Preview
            </Button>
          </div>
        )}

        {/* Canvas Area - Responsive Viewport */}
        <div className={cn(
          "flex-1 overflow-x-hidden overflow-y-auto w-full max-w-full relative",
          viewMode === 'preview' ? "bg-background p-0" : "bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-6 lg:p-8"
        )} suppressHydrationWarning>
          {/* Viewport Container with Width Constraints */}
          <div 
            ref={canvasRef}
            className={cn(
              "mx-auto transition-all duration-300 ease-in-out overflow-x-hidden relative",
              viewMode === 'edit' && "pb-8"
            )}
            style={{
              width: viewport === 'mobile' ? '375px' :
                     viewport === 'tablet' ? '768px' :
                     '100%',
              maxWidth: viewport === 'desktop' ? '1440px' : undefined,
              minWidth: viewport === 'mobile' ? '375px' :
                        viewport === 'tablet' ? '768px' :
                        '320px',
            }}
          >
            {/* Viewport Size Indicator (hidden in preview mode) */}
            {viewMode === 'edit' && (
              <div className="flex items-center justify-center mb-4">
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-medium text-xs shadow-sm border transition-all",
                  viewport === 'mobile' && "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
                  viewport === 'tablet' && "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
                  viewport === 'desktop' && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                )}>
                  {viewport === 'mobile' && <Smartphone size={14} />}
                  {viewport === 'tablet' && <Tablet size={14} />}
                  {viewport === 'desktop' && <Monitor size={14} />}
                  <span className="font-mono">
                    {viewport === 'mobile' && 'Mobile · 375px'}
                    {viewport === 'tablet' && 'Tablet · 768px'}
                    {viewport === 'desktop' && 'Desktop · 1440px'}
                  </span>
                </div>
              </div>
            )}

            {/* Content Area Marker - Shows webpage content boundaries */}
            <ContentAreaMarker />

            {/* Browser Chrome/Frame */}
            <div className={cn(
              "overflow-x-hidden w-full max-w-full transition-all flex-1",
              viewMode === 'edit' ? "rounded-xl border border-border/50 bg-card" : "bg-card"
            )}>
              {/* Browser Top Bar - Only in edit mode */}
              {viewMode === 'edit' && (
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-border/50 rounded-t-xl">
                  {/* Traffic Lights */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors" />
                  </div>
                  {/* URL Bar */}
                  <div className="flex-1 mx-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-700 rounded-md border border-border/50 text-xs text-muted-foreground">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="font-mono truncate">
                        {funnel?.name ? `https://yoursite.com/${funnel.name.toLowerCase().replace(/\s+/g, '-')}` : 'https://yoursite.com/page'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Webpage Content */}
              <div className={cn(
                "bg-white dark:bg-white text-neutral-900 overflow-x-hidden w-full max-w-full min-h-[calc(100vh-200px)]",
                viewMode === 'edit' && "rounded-b-xl"
              )}>
                {sections.length === 0 ? (
                  // Empty State
                  <div className="w-full h-full min-h-[calc(100vh-250px)] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-slate-50" suppressHydrationWarning>
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl" />
                      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200 rounded-full blur-3xl" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center max-w-md">
                      {/* Icon */}
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                        <Layout className="w-10 h-10 text-white" />
                      </div>
                      
                      {/* Title */}
                      <h2 className="text-2xl font-bold text-slate-800 mb-3">
                        Start Building Your Page
                      </h2>
                      
                      {/* Description */}
                      <p className="text-slate-500 mb-8 leading-relaxed">
                        Add sections, rows, and columns to create your perfect layout. 
                        Drag and drop elements to bring your vision to life.
                      </p>
                      
                      {/* CTA Button */}
                      <button
                        onClick={handleAddSection}
                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                      >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Add Your First Section
                      </button>
                      
                      {/* Helper Text */}
                      <p className="mt-6 text-xs text-slate-400">
                        Or use the sidebar to browse templates and elements
                      </p>
                    </div>
                  </div>
                ) : (
                  // Sections - Full Width with GSAP Drag Support
                  <GSAPCanvasDrag canvasRef={canvasRef} enabled={viewMode === 'edit'}>
                    <div className="w-full max-w-full overflow-x-hidden">
                      {sections.map((section, index) => (
                        <SectionComponent
                          key={section.id}
                          section={section}
                          index={index}
                          totalSections={sections.length}
                        />
                      ))}

                      {/* Add Section Button (Bottom) - Removed per user request */}
                    </div>
                  </GSAPCanvasDrag>
                )}
              </div>
            </div>
          </div>
          {/* End Viewport Container */}
        </div>
        
        {/* Funnel Step Navigator - Inside canvas area */}
        <FunnelStepNavigator />
      </div>

      {/* Hierarchy Panel - Conditionally Shown (hidden in preview mode) */}
      {showHierarchy && viewMode === 'edit' && (
        <div className="w-80 flex-shrink-0">
          <ElementHierarchy />
        </div>
      )}

      {/* Right Settings Panel - Conditionally Shown (hidden in preview mode) */}
      {showRightSidebar && viewMode === 'edit' && (
        showPopupSettings ? (
          <div className="w-96 bg-card border-l border-border overflow-hidden flex flex-col flex-shrink-0">
            <PopupConfigurator isOpen={true} onClose={() => setShowPopupSettings(false)} />
          </div>
        ) : (selectedSectionId || selectedRowId || selectedColumnId || selectedElementId) ? (
          <div className={`${rightSidebarExpanded ? 'w-[600px]' : 'w-80'} bg-card border-l border-border overflow-hidden flex flex-col flex-shrink-0 transition-all duration-300`}>
            <UnifiedSettingsPanel />
          </div>
        ) : null
      )}

      {/* Popup Editor */}
      <PopupEditor
        isOpen={showPopupEditor}
        onClose={() => {
          setShowPopupEditor(false);
          setShowPopupSettings(false);
        }}
        onShowSettings={handleShowPopupSettings}
      />

      {/* Template Gallery */}
      <TemplateGallery
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Section Modal */}
      <SectionModal
        isOpen={showSectionModal}
        onClose={() => setShowSectionModal(false)}
        onCreateSection={handleCreateSection}
      />

      {/* Row Modal */}
      {targetSectionId && (
        <RowModal
          isOpen={showRowModal}
          onClose={() => {
            setShowRowModal(false);
            setTargetSectionId(null);
          }}
          onCreateRow={handleCreateRow}
          sectionId={targetSectionId}
        />
      )}

      {/* Column Modal */}
      {targetSectionId && targetRowId && (
        <ColumnModal
          isOpen={showColumnModal}
          onClose={() => {
            setShowColumnModal(false);
            setTargetSectionId(null);
            setTargetRowId(null);
          }}
          onAddColumn={handleCreateColumn}
          rowId={targetRowId}
          currentColumnCount={sections
            .find(s => s.id === targetSectionId)
            ?.rows.find(r => r.id === targetRowId)
            ?.columns.length || 0}
        />
      )}

      {/* Mobile Sidebar Toggle Button */}
      {viewport === 'mobile' && !showLeftSidebar && (
        <button
          onClick={toggleLeftSidebar}
          className="fixed bottom-6 left-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
          title="Open Elements Panel"
          style={{ minWidth: '56px', minHeight: '56px' }}
        >
          <Menu size={24} />
        </button>
      )}
      </div>
    </DragDropProvider>
  );
}
