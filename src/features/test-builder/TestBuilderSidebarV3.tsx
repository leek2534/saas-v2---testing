"use client";



import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTestBuilderV2Store, ElementType, Section } from './store';
import { 
  Type, Heading, AlignLeft, MousePointer, Image, Video, FileText, 
  Clock, MessageSquare, DollarSign, Star, Minus, List, HelpCircle, Users, TrendingUp,
  ChevronRight, ChevronDown, ChevronLeft, Layout, Layers, Box, Sparkles, Columns,
  Zap, Shield, Check, ChevronUp, Square, AlertCircle, Tag, FileCode, Grid3x3, Eraser
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HYPERUI_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory } from '@/src/lib/templates/hyperui-templates-simple';
import { buildTemplate } from '@/src/lib/templates/template-builder';
import { DraggableSidebarElement } from './DraggableSidebarElement';
import { parseHTMLToSections } from '@/src/lib/templates/testBuilderHtmlParser';
import { BackgroundRemoverTool } from './tools/BackgroundRemoverTool';

// Element definitions with categories
const ELEMENT_CATEGORIES = [
  {
    id: 'content',
    label: 'Content',
    icon: Type,
    elements: [
      { type: 'heading', icon: Type, label: 'Heading', description: 'Title or headline' },
      { type: 'subheading', icon: Type, label: 'Subheading', description: 'Subtitle' },
      { type: 'text', icon: AlignLeft, label: 'Text', description: 'Paragraph text' },
      { type: 'button', icon: MousePointer, label: 'Button', description: 'Call-to-action' },
      { type: 'image', icon: Image, label: 'Image', description: 'Picture or graphic' },
      { type: 'video', icon: Video, label: 'Video', description: 'Video player' },
      { type: 'gif', icon: Image, label: 'GIF', description: 'Animated GIF' },
      { type: 'form', icon: FileText, label: 'Form', description: 'Lead capture form' },
    ]
  },
  {
    id: 'conversion',
    label: 'Conversion',
    icon: TrendingUp,
    elements: [
      { type: 'countdown', icon: Clock, label: 'Countdown', description: 'Urgency timer' },
      { type: 'testimonial', icon: MessageSquare, label: 'Testimonial', description: 'Customer review' },
      { type: 'pricing', icon: DollarSign, label: 'Pricing', description: 'Price card' },
      { type: 'socialproof', icon: Users, label: 'Social Proof', description: 'Trust indicators' },
      { type: 'logo-showcase', icon: Grid3x3, label: 'Logo Showcase', description: 'Partner/client logos' },
      { type: 'progress', icon: TrendingUp, label: 'Progress', description: 'Progress bar' },
    ]
  },
  {
    id: 'utility',
    label: 'Utility',
    icon: Box,
    elements: [
      { type: 'list', icon: List, label: 'List', description: 'Bullet points' },
      { type: 'faq', icon: HelpCircle, label: 'FAQ', description: 'Q&A section' },
      { type: 'spacer', icon: Minus, label: 'Spacer', description: 'Vertical space' },
      { type: 'divider', icon: Minus, label: 'Divider', description: 'Horizontal line' },
      { type: 'icon', icon: Star, label: 'Icon', description: 'Icon element' },
    ]
  },
  {
    id: 'interactive',
    label: 'Interactive',
    icon: Zap,
    elements: [
      { type: 'accordion', icon: ChevronUp, label: 'Accordion', description: 'Expandable sections' },
      { type: 'tabs', icon: Columns, label: 'Tabs', description: 'Tabbed interface' },
      { type: 'modal', icon: Square, label: 'Modal', description: 'Popup dialog' },
      { type: 'alert', icon: AlertCircle, label: 'Alert', description: 'Notification banner' },
      { type: 'badge', icon: Tag, label: 'Badge', description: 'Label or tag' },
    ]
  }
];

// Template categories are imported from hyperui-templates-simple

// Navigation items (removed Sections and Rows per user request)
const NAV_ITEMS = [
  { id: 'elements', label: 'Elements', icon: Box },
  { id: 'templates', label: 'Templates', icon: Sparkles, badge: 'New' },
  { id: 'bg-remover', label: 'BG Remover', icon: Eraser },
];

interface TestBuilderSidebarV3Props {
  onAddSection?: () => void;
  onAddRow?: (sectionId: string) => void;
  onAddColumn?: (sectionId: string, rowId: string) => void;
}

export const TestBuilderSidebarV3 = React.memo(function TestBuilderSidebarV3({ 
  onAddSection, 
  onAddRow, 
  onAddColumn 
}: TestBuilderSidebarV3Props = {}) {
  const { selectedSectionId, selectedRowId, selectedColumnId, selectedElementId, addElement, sections, addSection, sidebarActiveTab, setSidebarActiveTab } = useTestBuilderV2Store();
  const activeNav = sidebarActiveTab;
  const setActiveNav = setSidebarActiveTab;
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['content', 'interactive']);
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);

  // Handle template insertion
  const handleInsertTemplate = (templateId: string) => {
    try {
      console.log('Inserting template:', templateId);
      const templateSection = buildTemplate(templateId);
      console.log('Built template section:', templateSection);
      console.log('Template rows:', templateSection.rows);
      console.log('Template elements:', templateSection.rows[0]?.columns[0]?.elements);
      
      // Directly add the complete template section to the store
      const currentSections = useTestBuilderV2Store.getState().sections;
      const newSections = [...currentSections, templateSection];
      
      console.log('New sections count:', newSections.length);
      
      useTestBuilderV2Store.setState({ 
        sections: newSections,
        selectedSectionId: templateSection.id,
        hasUnsavedChanges: true,
        saveStatus: 'unsaved' as const,
      });
      
      console.log('Template inserted successfully');
      
    } catch (error) {
      console.error('Error inserting template:', error);
      alert('Failed to insert template');
    }
  };

  // Handle HTML import
  const handleImportHTML = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.htm';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const html = await file.text();
        
        // Parse HTML to sections
        const parsedSections = await parseHTMLToSections(html);
        
        if (parsedSections.length === 0) {
          alert('No sections found in HTML file.');
          return;
        }

        // Batch all section updates to prevent rapid re-renders
        const store = useTestBuilderV2Store.getState();
        const newSections: Section[] = [];
        
        // Build all sections first
        for (const section of parsedSections) {
          // Create section with structure (will create empty columns)
          addSection({
            containerType: section.props.containerType,
            maxWidth: section.props.maxWidth,
            rows: section.rows.map(row => ({
              columns: row.columns.map(col => ({
                width: col.width,
              })),
            })),
          });
          
          // Get the newly created section
          const currentSections = useTestBuilderV2Store.getState().sections;
          const newSection = currentSections[currentSections.length - 1];
          
          // Build updated section with elements
          const updatedSection: Section = {
            ...newSection,
            name: section.name,
            props: {
              ...newSection.props,
              ...section.props,
            },
            rows: newSection.rows.map((row, rowIndex) => {
              const sourceRow = section.rows[rowIndex];
              if (!sourceRow) return row;
              
              return {
                ...row,
                name: sourceRow.name,
                backgroundColor: sourceRow.backgroundColor,
                paddingTop: sourceRow.paddingTop,
                paddingBottom: sourceRow.paddingBottom,
                paddingLeft: sourceRow.paddingLeft,
                paddingRight: sourceRow.paddingRight,
                gap: sourceRow.gap,
                columns: row.columns.map((col, colIndex) => {
                  const sourceCol = sourceRow.columns[colIndex];
                  if (!sourceCol) return col;
                  
                  return {
                    ...col,
                    width: sourceCol.width,
                    backgroundColor: sourceCol.backgroundColor,
                    paddingTop: sourceCol.paddingTop,
                    paddingBottom: sourceCol.paddingBottom,
                    paddingLeft: sourceCol.paddingLeft,
                    paddingRight: sourceCol.paddingRight,
                    elements: sourceCol.elements,
                  };
                }),
              };
            }),
          };
          
          newSections.push(updatedSection);
        }
        
        // Update all sections at once to prevent rapid re-renders
        const finalSections = [...store.sections];
        // Replace the last N sections (the ones we just added) with our updated versions
        const startIndex = finalSections.length - newSections.length;
        newSections.forEach((updatedSection, index) => {
          finalSections[startIndex + index] = updatedSection;
        });
        
        // Single state update for all sections
        useTestBuilderV2Store.setState({ sections: finalSections });
        
        alert(`Successfully imported ${parsedSections.length} section(s) from HTML template!`);
      } catch (error) {
        console.error('Error importing HTML template:', error);
        alert('Failed to import HTML template. Please check the console for details.');
      }
    };
    input.click();
  };

  // Auto-expand when column is selected
  useEffect(() => {
    if (selectedColumnId && !isManuallyExpanded) {
      setIsCollapsed(false);
    }
  }, [selectedColumnId, isManuallyExpanded]);

  const handleAddElement = (type: ElementType) => {
    // console.log('handleAddElement called', { type, selectedSectionId, selectedRowId, selectedColumnId, selectedElementId });
    
    if (!selectedSectionId || !selectedRowId || !selectedColumnId) {
      alert('Please select a column first by clicking on it in the canvas.');
      return;
    }

    // Find the selected element's index if one is selected
    let insertIndex: number | undefined = undefined;
    
    if (selectedElementId) {
      const section = sections.find(s => s.id === selectedSectionId);
      const row = section?.rows.find(r => r.id === selectedRowId);
      const column = row?.columns.find(c => c.id === selectedColumnId);
      
      if (column) {
        const elementIndex = column.elements.findIndex(el => el.id === selectedElementId);
        if (elementIndex !== -1) {
          // Insert right after the selected element
          insertIndex = elementIndex + 1;
        }
      }
    }

    addElement(selectedSectionId, selectedRowId, selectedColumnId, type, insertIndex);
  };

  const canAddElements = !!(selectedSectionId && selectedRowId && selectedColumnId);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Determine sidebar width based on active view and collapsed state
  const sidebarWidth = isCollapsed 
    ? 'w-12' 
    : (activeNav === 'templates' && selectedTemplateCategory ? 'w-[600px]' : 'w-80');

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    setIsManuallyExpanded(!isCollapsed);
  };

  return (
    <div className={cn(
      "bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full transition-all duration-300 shadow-2xl relative z-[70] backdrop-blur-sm",
      sidebarWidth
    )} suppressHydrationWarning>
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute -right-3 top-4 z-50 w-6 h-6 bg-card border border-border/50 rounded-full flex items-center justify-center hover:bg-accent hover:scale-110 shadow-lg hover:shadow-xl transition-all duration-200"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {!isCollapsed && (
        <>
      {/* Navigation Tabs */}
      <div className="border-b border-border/50 px-4 py-3 bg-gradient-to-br from-background to-muted/30">
        <div className="flex gap-2 justify-center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  if (item.id === 'templates') {
                    setSelectedTemplateCategory(null);
                  }
                }}
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 relative',
                  activeNav === item.id
                    ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:shadow-md'
                )}
              >
                {activeNav === item.id && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-transparent blur-xl -z-10 opacity-75" />
                )}
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-gradient-to-br from-yellow-400 to-yellow-500 text-black text-[10px] font-bold rounded shadow-md">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>


      {/* Content Area */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {/* Elements View */}
          {activeNav === 'elements' && (
            <div className="space-y-3">
              {/* Layout Section - Always Visible */}
              <div>
                <div className="mb-3 px-1">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full"></span>
                    Layout
                  </h4>
                </div>
                <div className="space-y-2">
                  {/* Section Button */}
                  <button
                    onClick={() => onAddSection?.()}
                    className="w-full h-12 rounded-xl border border-border/50 bg-muted/50 hover:bg-accent hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 flex items-center gap-3 px-3 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Layout size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-semibold text-foreground">Section</div>
                      <div className="text-xs text-muted-foreground">Container area</div>
                    </div>
                  </button>

                  {/* Row Button */}
                  <button
                    onClick={() => {
                      if (!selectedSectionId) {
                        alert('Please select a section first');
                        return;
                      }
                      onAddRow?.(selectedSectionId);
                    }}
                    disabled={!selectedSectionId}
                    className={cn(
                      'w-full h-12 rounded-xl border transition-all duration-300 flex items-center gap-3 px-3 group',
                      selectedSectionId
                        ? 'border-border/50 bg-muted/50 hover:bg-accent hover:scale-105 hover:shadow-xl hover:shadow-primary/20 cursor-pointer'
                        : 'border-border/30 bg-muted/30 opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      selectedSectionId ? 'bg-primary/10' : 'bg-muted-foreground/50'
                    )}>
                      <Layers size={20} className={selectedSectionId ? 'text-primary' : 'text-muted-foreground'} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={cn(
                        'text-sm font-semibold',
                        selectedSectionId ? 'text-foreground' : 'text-muted-foreground'
                      )}>Row</div>
                      <div className={cn(
                        'text-xs',
                        selectedSectionId ? 'text-muted-foreground' : 'text-muted-foreground/70'
                      )}>Horizontal layout</div>
                    </div>
                  </button>

                  {/* Column Button */}
                  <button
                    onClick={() => {
                      if (!selectedSectionId || !selectedRowId) {
                        alert('Please select a row first');
                        return;
                      }
                      onAddColumn?.(selectedSectionId, selectedRowId);
                    }}
                    disabled={!selectedSectionId || !selectedRowId}
                    className={cn(
                      'w-full h-12 rounded-xl border transition-all duration-300 flex items-center gap-3 px-3 group',
                      selectedSectionId && selectedRowId
                        ? 'border-border/50 bg-muted/50 hover:bg-accent hover:scale-105 hover:shadow-xl hover:shadow-primary/20 cursor-pointer'
                        : 'border-border/30 bg-muted/30 opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      selectedSectionId && selectedRowId ? 'bg-primary/10' : 'bg-muted-foreground/50'
                    )}>
                      <Columns size={20} className={selectedSectionId && selectedRowId ? 'text-primary' : 'text-muted-foreground'} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={cn(
                        'text-sm font-semibold',
                        selectedSectionId && selectedRowId ? 'text-foreground' : 'text-muted-foreground'
                      )}>Column</div>
                      <div className={cn(
                        'text-xs',
                        selectedSectionId && selectedRowId ? 'text-muted-foreground' : 'text-muted-foreground/70'
                      )}>Vertical space</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Elements Section */}
              {!canAddElements && (
                <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 rounded-xl shadow-sm">
                  <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    Select a column to add elements
                  </p>
                </div>
              )}

              {/* Expand All / Collapse All Toggle */}
              <div className="flex items-center justify-between px-1">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full"></span>
                  Elements
                </h4>
                <button
                  onClick={() => {
                    if (expandedCategories.length === ELEMENT_CATEGORIES.length) {
                      setExpandedCategories([]);
                    } else {
                      setExpandedCategories(ELEMENT_CATEGORIES.map(c => c.id));
                    }
                  }}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-all duration-200 hover:scale-105"
                >
                  {expandedCategories.length === ELEMENT_CATEGORIES.length ? 'Collapse All' : 'Expand All'}
                </button>
              </div>

              {ELEMENT_CATEGORIES.map((category) => {
                const CategoryIcon = category.icon;
                const isExpanded = expandedCategories.includes(category.id);

                return (
                  <div key={category.id} className="border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary transition-all duration-300"
                    >
                      <div className="flex items-center gap-2.5">
                        <CategoryIcon size={18} className="text-primary-foreground" />
                        <span className="text-sm font-bold text-primary-foreground">
                          {category.label}
                        </span>
                        <span className="text-xs text-primary-foreground/70 font-medium">
                          ({category.elements.length})
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={18} className="text-primary-foreground transition-transform duration-300" />
                      ) : (
                        <ChevronRight size={18} className="text-primary-foreground transition-transform duration-300" />
                      )}
                    </button>

                    {/* Category Elements */}
                    {isExpanded && (
                      <div className="p-3 grid grid-cols-2 gap-2 bg-gradient-to-br from-background to-muted/20">
                        {category.elements.map((element) => {
                          const Icon = element.icon;
                          return (
                            <DraggableSidebarElement
                              key={element.type}
                              type={element.type}
                              label={element.label}
                              description={element.description}
                              icon={Icon}
                              disabled={!canAddElements}
                              onClick={() => handleAddElement(element.type as ElementType)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Templates View */}
          {activeNav === 'templates' && (
            <div className="flex h-full">
              {/* Category List (Left Side) */}
              <div className={cn(
                "border-r border-border/50 overflow-auto transition-all duration-300 ease-in-out bg-gradient-to-b from-background to-muted/10",
                selectedTemplateCategory ? "w-48" : "w-full"
              )}>
                {/* Import HTML Button */}
                <div className="p-3 border-b border-border/50">
                  <button
                    onClick={handleImportHTML}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary hover:scale-105 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 text-sm font-bold"
                    title="Import HTML Template (ClickFunnels, etc.)"
                  >
                    <FileCode size={18} className="text-primary-foreground" />
                    <span>Import HTML</span>
                  </button>
                </div>
                <div className="p-3 space-y-2">
                  {TEMPLATE_CATEGORIES.map((category) => {
                    const categoryTemplates = getTemplatesByCategory(category.id);
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedTemplateCategory(
                          selectedTemplateCategory === category.id ? null : category.id
                        )}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium relative",
                          selectedTemplateCategory === category.id
                            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                            : "hover:bg-accent text-foreground hover:scale-105 hover:shadow-md"
                        )}
                      >
                        {selectedTemplateCategory === category.id && (
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-transparent blur-xl -z-10 opacity-75" />
                        )}
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <span className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            selectedTemplateCategory === category.id
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}>
                            {categoryTemplates.length}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Template Grid (Right Side) */}
              {selectedTemplateCategory && (
                <div className="flex-1 overflow-auto p-4 animate-in slide-in-from-right duration-300 bg-gradient-to-br from-background to-muted/10">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
                      <span className="w-1 h-5 bg-primary rounded-full"></span>
                      {TEMPLATE_CATEGORIES.find(c => c.id === selectedTemplateCategory)?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium ml-3">
                      Choose a template to add to your page
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {getTemplatesByCategory(selectedTemplateCategory).map((template) => (
                      <button
                        key={template.id}
                        className="group text-left"
                        onClick={() => handleInsertTemplate(template.id)}
                      >
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-border/50 group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-300 group-hover:scale-105">
                          {/* Placeholder for template preview */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex flex-col items-center justify-center p-4">
                            <Sparkles className="w-8 h-8 text-blue-500 mb-2" />
                            <p className="text-xs text-center text-muted-foreground">
                              {template.preview}
                            </p>
                          </div>
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-blue-600/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="text-center">
                              <Check className="w-8 h-8 text-white mx-auto mb-2" />
                              <span className="text-white text-sm font-medium">Insert Template</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-foreground">
                            {template.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Background Remover View */}
          {activeNav === 'bg-remover' && (
            <BackgroundRemoverTool />
          )}

          {/* Sections and Rows views removed per user request */}
        </div>
      </ScrollArea>
      </>
      )}
    </div>
  );
});
