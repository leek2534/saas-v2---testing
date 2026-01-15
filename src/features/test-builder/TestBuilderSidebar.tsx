'use client';

/**
 * TestBuilderSidebar - Redesigned sidebar matching Kanva's UI patterns
 * 
 * Features:
 * - Clean icon-based navigation rail (like Kanva's Sidebar)
 * - Expandable content panel
 * - Consistent hover/active states
 * - Smooth animations
 */

import React, { useState, useCallback } from 'react';
import { useTestBuilderV2Store, ElementType } from './store';
import { 
  Type, Heading, AlignLeft, MousePointer, Image, Video, FileText, 
  Clock, MessageSquare, DollarSign, Star, Minus, List, HelpCircle, Users, TrendingUp,
  ChevronRight, ChevronDown, Layout, Layers, Box, Sparkles, Columns,
  Square, AlertCircle, Tag, FileCode, Grid3x3, Eraser,
  LayoutGrid, X, LucideIcon, Shield, Zap, GitCompare, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TEMPLATE_CATEGORIES, getTemplatesByCategory } from '@/src/lib/templates/hyperui-templates-simple';
import { buildTemplate } from '@/src/lib/templates/template-builder';
import { parseHTMLToSections } from '@/src/lib/templates/testBuilderHtmlParser';
import { BackgroundRemoverTool } from './tools/BackgroundRemoverTool';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Sidebar navigation items
interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'layout', icon: Layout, label: 'Layout' },
  { id: 'elements', icon: Box, label: 'Elements' },
  { id: 'templates', icon: LayoutGrid, label: 'Templates' },
  { id: 'tools', icon: Eraser, label: 'Tools' },
];

// Element categories with cleaner organization
const ELEMENT_CATEGORIES = [
  {
    id: 'text',
    label: 'Text',
    icon: Type,
    elements: [
      { type: 'heading', icon: Heading, label: 'Heading' },
      { type: 'subheading', icon: Type, label: 'Subheading' },
      { type: 'text', icon: AlignLeft, label: 'Paragraph' },
      { type: 'header-block', icon: Heading, label: 'Header Block' },
    ]
  },
  {
    id: 'media',
    label: 'Media',
    icon: Image,
    elements: [
      { type: 'image', icon: Image, label: 'Image' },
      { type: 'video', icon: Video, label: 'Video' },
      { type: 'gif', icon: Image, label: 'GIF' },
      { type: 'logo-cloud', icon: Grid3x3, label: 'Logo Cloud' },
    ]
  },
  {
    id: 'interactive',
    label: 'Interactive',
    icon: MousePointer,
    elements: [
      { type: 'button', icon: MousePointer, label: 'Button' },
      { type: 'button-group', icon: Columns, label: 'Button Group' },
      { type: 'form', icon: FileText, label: 'Form' },
      { type: 'contact-form', icon: FileText, label: 'Contact Form' },
      { type: 'accordion', icon: ChevronDown, label: 'Accordion' },
      { type: 'tabs', icon: Columns, label: 'Tabs' },
      { type: 'modal', icon: Square, label: 'Modal' },
      { type: 'poll', icon: List, label: 'Poll' },
    ]
  },
  {
    id: 'conversion',
    label: 'Conversion',
    icon: TrendingUp,
    elements: [
      { type: 'countdown', icon: Clock, label: 'Countdown' },
      { type: 'testimonial', icon: MessageSquare, label: 'Testimonial' },
      { type: 'pricing', icon: DollarSign, label: 'Pricing' },
      { type: 'socialproof', icon: Users, label: 'Social Proof' },
      { type: 'logo-showcase', icon: Grid3x3, label: 'Logo Showcase' },
      { type: 'progress', icon: TrendingUp, label: 'Progress' },
      { type: 'guarantee', icon: Shield, label: 'Guarantee' },
      { type: 'feature-box', icon: Zap, label: 'Feature Box' },
      { type: 'comparison', icon: GitCompare, label: 'Comparison' },
      { type: 'star-rating', icon: Award, label: 'Star Rating' },
      { type: 'newsletter', icon: FileText, label: 'Newsletter' },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: Sparkles,
    elements: [
      { type: 'announcement', icon: AlertCircle, label: 'Announcement' },
      { type: 'banner', icon: Layout, label: 'Banner' },
      { type: 'feature-grid', icon: Grid3x3, label: 'Feature Grid' },
      { type: 'team-section', icon: Users, label: 'Team Section' },
      { type: 'steps', icon: List, label: 'Steps' },
      { type: 'product-collection', icon: Box, label: 'Products' },
    ]
  },
  {
    id: 'utility',
    label: 'Utility',
    icon: Box,
    elements: [
      { type: 'list', icon: List, label: 'List' },
      { type: 'faq', icon: HelpCircle, label: 'FAQ' },
      { type: 'spacer', icon: Minus, label: 'Spacer' },
      { type: 'divider', icon: Minus, label: 'Divider' },
      { type: 'icon', icon: Star, label: 'Icon' },
      { type: 'alert', icon: AlertCircle, label: 'Alert' },
      { type: 'badge', icon: Tag, label: 'Badge' },
    ]
  },
];

interface TestBuilderSidebarProps {
  onAddSection?: () => void;
  onAddRow?: (sectionId: string) => void;
  onAddColumn?: (sectionId: string, rowId: string) => void;
}

export const TestBuilderSidebar = React.memo(function TestBuilderSidebar({ 
  onAddSection, 
  onAddRow, 
  onAddColumn 
}: TestBuilderSidebarProps = {}) {
  const { 
    selectedSectionId, 
    selectedRowId, 
    selectedColumnId, 
    selectedElementId, 
    addElement, 
    sections, 
    addSection 
  } = useTestBuilderV2Store();
  
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [pinnedNav, setPinnedNav] = useState<string | null>(null);
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string | null>(null);

  // Determine which nav to show
  const visibleNav = pinnedNav || activeNav;

  const handleNavHover = (navId: string | null) => {
    if (!pinnedNav) {
      setActiveNav(navId);
    }
  };

  const handleNavClick = (navId: string) => {
    if (pinnedNav === navId) {
      setPinnedNav(null);
      setActiveNav(null);
    } else {
      setPinnedNav(navId);
      setActiveNav(navId);
    }
  };

  const handleClosePanel = () => {
    setPinnedNav(null);
    setActiveNav(null);
  };

  const canAddElements = !!(selectedSectionId && selectedRowId && selectedColumnId);

  const handleAddElement = useCallback((type: ElementType) => {
    if (!selectedSectionId || !selectedRowId || !selectedColumnId) {
      return;
    }

    let insertIndex: number | undefined = undefined;
    
    if (selectedElementId) {
      const section = sections.find(s => s.id === selectedSectionId);
      const row = section?.rows.find(r => r.id === selectedRowId);
      const column = row?.columns.find(c => c.id === selectedColumnId);
      
      if (column) {
        const elementIndex = column.elements.findIndex(el => el.id === selectedElementId);
        if (elementIndex !== -1) {
          insertIndex = elementIndex + 1;
        }
      }
    }

    addElement(selectedSectionId, selectedRowId, selectedColumnId, type, insertIndex);
  }, [selectedSectionId, selectedRowId, selectedColumnId, selectedElementId, sections, addElement]);

  // Handle template insertion
  const handleInsertTemplate = useCallback((templateId: string) => {
    try {
      console.log('Inserting template:', templateId);
      const templateSection = buildTemplate(templateId);
      console.log('Built template section:', templateSection);
      
      // Directly add the complete template section to the store
      const currentSections = useTestBuilderV2Store.getState().sections;
      const newSections = [...currentSections, templateSection];
      
      // Get first row and column for selection
      const firstRow = templateSection.rows?.[0];
      const firstColumn = firstRow?.columns?.[0];
      
      useTestBuilderV2Store.setState({ 
        sections: newSections,
        selectedSectionId: templateSection.id,
        selectedRowId: firstRow?.id || null,
        selectedColumnId: firstColumn?.id || null,
        selectedElementId: null,
        hasUnsavedChanges: true,
        saveStatus: 'unsaved' as const,
        showRightSidebar: true,
      });
      
      console.log('Template inserted successfully');
    } catch (error) {
      console.error('Error inserting template:', error);
    }
  }, []);

  // Handle HTML import
  const handleImportHTML = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.htm';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const html = await file.text();
        const parsedSections = await parseHTMLToSections(html);
        
        if (parsedSections.length === 0) {
          alert('No sections found in HTML file.');
          return;
        }
        
        for (const section of parsedSections) {
          addSection({
            containerType: section.props.containerType,
            maxWidth: section.props.maxWidth,
            rows: section.rows.map(row => ({
              columns: row.columns.map(col => ({
                width: col.width,
              })),
            })),
          });
        }
        
        alert(`Successfully imported ${parsedSections.length} section(s)!`);
      } catch (error) {
        console.error('Error importing HTML:', error);
        alert('Failed to import HTML template.');
      }
    };
    input.click();
  }, [addSection]);

  return (
    <TooltipProvider delayDuration={300}>
      <div 
        className="flex h-full"
        onMouseLeave={() => !pinnedNav && handleNavHover(null)}
      >
        {/* Navigation Rail - Kanva Style */}
        <div className="w-20 bg-gradient-to-b from-background via-background to-muted/20 flex flex-col items-center py-6 gap-3 overflow-y-auto overflow-x-hidden flex-shrink-0 border-r border-border/30 backdrop-blur-sm">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = visibleNav === item.id;
            const isPinned = pinnedNav === item.id;
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onMouseEnter={() => handleNavHover(item.id)}
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      "group relative w-14 h-14 flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 flex-shrink-0 text-[9px] leading-tight font-medium",
                      isPinned
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                        : isActive
                        ? "bg-accent text-accent-foreground shadow-md scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:scale-110"
                    )}
                  >
                    {(isPinned || isActive) && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-transparent blur-xl -z-10 opacity-75" />
                    )}
                    
                    <Icon 
                      size={22} 
                      className={cn(
                        "transition-all duration-300",
                        isPinned || isActive ? "scale-110" : "group-hover:scale-110"
                      )} 
                    />
                    <span className="truncate w-full px-1 text-center">{item.label}</span>
                    
                    {isPinned && (
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-foreground rounded-full shadow-sm animate-pulse" />
                    )}
                    
                    {!isPinned && (
                      <div className={cn(
                        "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300",
                        isActive ? "w-8" : "w-0 group-hover:w-6"
                      )} />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Content Panel - Slides in when nav is active */}
        {visibleNav && (
          <div className="w-72 bg-background border-r border-border/50 flex flex-col animate-in slide-in-from-left-2 duration-200">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <h2 className="text-sm font-semibold text-foreground">
                {NAV_ITEMS.find(n => n.id === visibleNav)?.label}
              </h2>
              <button
                onClick={handleClosePanel}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>

            {/* Panel Content */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                {/* Layout Panel */}
                {visibleNav === 'layout' && (
                  <div className="space-y-3">
                    {/* Section */}
                    <button
                      onClick={() => onAddSection?.()}
                      className="w-full p-3 rounded-xl border border-border/50 bg-card hover:bg-accent hover:border-primary/30 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                          <Layout size={20} className="text-blue-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">Section</p>
                          <p className="text-xs text-muted-foreground">Full-width container</p>
                        </div>
                      </div>
                    </button>

                    {/* Row */}
                    <button
                      onClick={() => selectedSectionId && onAddRow?.(selectedSectionId)}
                      disabled={!selectedSectionId}
                      className={cn(
                        "w-full p-3 rounded-xl border transition-all duration-200 group",
                        selectedSectionId
                          ? "border-border/50 bg-card hover:bg-accent hover:border-primary/30"
                          : "border-border/30 bg-muted/30 opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          selectedSectionId ? "bg-green-500/10 group-hover:bg-green-500/20" : "bg-muted"
                        )}>
                          <Layers size={20} className={selectedSectionId ? "text-green-500" : "text-muted-foreground"} />
                        </div>
                        <div className="text-left">
                          <p className={cn("text-sm font-medium", selectedSectionId ? "text-foreground" : "text-muted-foreground")}>Row</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedSectionId ? "Horizontal layout" : "Select a section first"}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Column */}
                    <button
                      onClick={() => selectedSectionId && selectedRowId && onAddColumn?.(selectedSectionId, selectedRowId)}
                      disabled={!selectedSectionId || !selectedRowId}
                      className={cn(
                        "w-full p-3 rounded-xl border transition-all duration-200 group",
                        selectedSectionId && selectedRowId
                          ? "border-border/50 bg-card hover:bg-accent hover:border-primary/30"
                          : "border-border/30 bg-muted/30 opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          selectedSectionId && selectedRowId ? "bg-purple-500/10 group-hover:bg-purple-500/20" : "bg-muted"
                        )}>
                          <Columns size={20} className={selectedSectionId && selectedRowId ? "text-purple-500" : "text-muted-foreground"} />
                        </div>
                        <div className="text-left">
                          <p className={cn("text-sm font-medium", selectedSectionId && selectedRowId ? "text-foreground" : "text-muted-foreground")}>Column</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedSectionId && selectedRowId ? "Vertical space" : "Select a row first"}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Elements Panel */}
                {visibleNav === 'elements' && (
                  <div className="space-y-4">
                    {!canAddElements && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          Select a column to add elements
                        </p>
                      </div>
                    )}

                    {ELEMENT_CATEGORIES.map((category) => (
                      <div key={category.id}>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                          {category.label}
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {category.elements.map((element) => {
                            const Icon = element.icon;
                            return (
                              <button
                                key={element.type}
                                onClick={() => handleAddElement(element.type as ElementType)}
                                disabled={!canAddElements}
                                className={cn(
                                  "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all duration-200",
                                  canAddElements
                                    ? "border-border/50 bg-card hover:bg-accent hover:border-primary/30 hover:scale-105"
                                    : "border-border/30 bg-muted/30 opacity-50 cursor-not-allowed"
                                )}
                              >
                                <Icon size={18} className={canAddElements ? "text-foreground" : "text-muted-foreground"} />
                                <span className="text-[10px] font-medium text-muted-foreground">{element.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Templates Panel */}
                {visibleNav === 'templates' && (
                  <div className="space-y-4">
                    {/* Import HTML */}
                    <button
                      onClick={handleImportHTML}
                      className="w-full p-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FileCode size={18} />
                      <span className="text-sm font-medium">Import HTML</span>
                    </button>

                    {/* Template Categories */}
                    <div className="space-y-2">
                      {TEMPLATE_CATEGORIES.map((category) => {
                        const categoryTemplates = getTemplatesByCategory(category.id);
                        const isExpanded = selectedTemplateCategory === category.id;
                        
                        return (
                          <div key={category.id} className="border border-border/50 rounded-xl overflow-hidden">
                            <button
                              onClick={() => setSelectedTemplateCategory(isExpanded ? null : category.id)}
                              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors"
                            >
                              <span className="text-sm font-medium text-foreground">{category.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                  {categoryTemplates.length}
                                </span>
                                <ChevronRight size={16} className={cn(
                                  "text-muted-foreground transition-transform duration-200",
                                  isExpanded && "rotate-90"
                                )} />
                              </div>
                            </button>
                            
                            {isExpanded && (
                              <div className="p-2 border-t border-border/50 bg-muted/20 space-y-2">
                                {categoryTemplates.map((template) => (
                                  <button
                                    key={template.id}
                                    onClick={() => handleInsertTemplate(template.id)}
                                    className="w-full p-2 rounded-lg hover:bg-accent transition-colors text-left group"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Sparkles size={14} className="text-primary" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-foreground truncate">{template.name}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{template.description}</p>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tools Panel */}
                {visibleNav === 'tools' && (
                  <BackgroundRemoverTool />
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
});

export default TestBuilderSidebar;
