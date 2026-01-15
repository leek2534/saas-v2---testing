'use client';

/**
 * MultiPageCanvas - Canva-style vertical multi-page layout
 * 
 * Features:
 * - All pages rendered vertically in a scrollable container
 * - Click on a page to select it for editing
 * - Active page has a visual selection ring and is fully interactive
 * - Non-active pages show as static previews
 * - Page numbers shown on the left
 * - Add page button at the bottom
 */

import { useRef, useState, useEffect } from 'react';
import { useEditorStore } from '../../lib/editor/store';
import { DOMCanvas } from './DOMCanvas';
import { AddPageModal, AddPagePopup } from '../AddPageModal';
import { cn } from '../../lib/utils';
import { Plus, MoreHorizontal, Copy, Trash2, Edit2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import type { Page } from '../../lib/editor/types';

/**
 * PagePreview - Static preview of a non-active page
 * Shows a scaled-down version of the page content
 */
function PagePreview({ page }: { page: Page }) {
  const canvasWidth = page.canvas?.width || 1080;
  const canvasHeight = page.canvas?.height || 1080;
  
  // Scale to fit within a reasonable preview size
  const maxPreviewWidth = 600;
  const maxPreviewHeight = 400;
  const scaleX = maxPreviewWidth / canvasWidth;
  const scaleY = maxPreviewHeight / canvasHeight;
  const scale = Math.min(scaleX, scaleY, 1); // Don't scale up
  
  const previewWidth = canvasWidth * scale;
  const previewHeight = canvasHeight * scale;
  
  return (
    <div 
      className="relative overflow-hidden rounded-lg"
      style={{ 
        width: previewWidth, 
        height: previewHeight,
        backgroundColor: page.canvas?.background?.color || '#ffffff',
      }}
    >
      {/* Render elements at scale */}
      <div 
        className="absolute inset-0 origin-top-left"
        style={{ 
          transform: `scale(${scale})`,
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        {page.elements?.map((el) => (
          <div
            key={el.id}
            className="absolute"
            style={{
              left: el.x,
              top: el.y,
              width: el.width || 100,
              height: el.height || 100,
              transform: `rotate(${el.rotation || 0}deg)`,
              opacity: el.opacity ?? 1,
            }}
          >
            {el.type === 'shape' && (
              <div
                className="w-full h-full"
                style={{
                  backgroundColor: el.fill || '#3B82F6',
                  borderRadius: el.shapeType === 'circle' ? '50%' : (el as any).cornerRadius || 0,
                  border: el.stroke ? `${el.strokeWidth || 2}px solid ${el.stroke}` : 'none',
                }}
              />
            )}
            {el.type === 'text' && (
              <div
                style={{
                  fontSize: (el as any).fontSize || 32,
                  fontFamily: (el as any).fontFamily || 'Inter',
                  fontWeight: (el as any).fontWeight || 'normal',
                  fontStyle: (el as any).fontStyle || 'normal',
                  color: el.fill || '#000000',
                  lineHeight: (el as any).lineHeight || 1.2,
                  textAlign: (el as any).align || 'left',
                }}
              >
                {(el as any).text || 'Text'}
              </div>
            )}
            {el.type === 'image' && (el as any).src && (
              <img
                src={(el as any).src}
                alt=""
                className="w-full h-full object-cover"
                style={{ borderRadius: (el as any).borderRadius || 0 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MultiPageCanvas() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Store
  const pages = useEditorStore((state) => state.pages || []);
  const activePageId = useEditorStore((state) => state.activePageId);
  const setActivePage = useEditorStore((state) => state.setActivePage);
  const deletePage = useEditorStore((state) => state.deletePage);
  const duplicatePage = useEditorStore((state) => state.duplicatePage);
  const renamePage = useEditorStore((state) => state.renamePage);
  const canvas = useEditorStore((state) => state.canvas);
  
  // Local state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  // Track if user manually switched pages (to trigger scroll)
  const [shouldScrollToPage, setShouldScrollToPage] = useState(false);
  
  // Scroll to active page only when user explicitly switches pages
  useEffect(() => {
    if (shouldScrollToPage && activePageId && pageRefs.current.has(activePageId)) {
      const pageEl = pageRefs.current.get(activePageId);
      pageEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setShouldScrollToPage(false);
    }
  }, [activePageId, shouldScrollToPage]);
  
  // Handler to switch pages with scroll
  const switchToPage = (pageId: string) => {
    if (pageId !== activePageId) {
      setShouldScrollToPage(true);
      setActivePage(pageId);
    }
  };
  
  // Rename handlers
  const startRename = (pageId: string, currentName: string) => {
    setEditingPageId(pageId);
    setEditName(currentName);
  };
  
  const finishRename = () => {
    if (editingPageId && editName.trim()) {
      renamePage(editingPageId, editName.trim());
    }
    setEditingPageId(null);
    setEditName('');
  };
  
  // Delete handler
  const handleDeletePage = (pageId: string) => {
    if (pages.length > 1) {
      deletePage(pageId);
    }
  };
  
  // Duplicate handler
  const handleDuplicatePage = (pageId: string) => {
    const newPageId = duplicatePage(pageId);
    if (newPageId) {
      setActivePage(newPageId);
    }
  };

  // Get active page for dimensions
  const activePage = pages.find(p => p.id === activePageId);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex-1 flex flex-col bg-muted/20 min-h-0 overflow-hidden">
        {/* Scrollable pages container */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-auto"
          style={{ scrollbarWidth: 'thin' }}
        >
          <div className="flex flex-col items-center py-8 gap-12 min-h-full px-16">
            {pages.map((page, index) => {
              const isActive = page.id === activePageId;
              const pageWidth = page.canvas?.width || canvas.width || 1080;
              const pageHeight = page.canvas?.height || canvas.height || 1080;
              
              return (
                <div
                  key={page.id}
                  ref={(el) => {
                    if (el) pageRefs.current.set(page.id, el);
                    else pageRefs.current.delete(page.id);
                  }}
                  className="relative group flex items-start gap-4"
                >
                  {/* Page number and actions - left side */}
                  <div className="flex flex-col items-center gap-2 pt-2 w-10 shrink-0">
                    {/* Page number */}
                    <div 
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                        "transition-all duration-200 cursor-pointer",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-lg scale-110" 
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                      onClick={() => !isActive && switchToPage(page.id)}
                    >
                      {index + 1}
                    </div>
                    
                    {/* Page actions dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            "w-7 h-7 rounded-md flex items-center justify-center",
                            "bg-card border border-border shadow-sm",
                            "opacity-0 group-hover:opacity-100 transition-opacity",
                            "hover:bg-accent text-muted-foreground hover:text-foreground"
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" side="right" className="w-44">
                        <DropdownMenuItem onClick={() => startRename(page.id, page.name)}>
                          <Edit2 size={14} className="mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicatePage(page.id)}>
                          <Copy size={14} className="mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeletePage(page.id)}
                          disabled={pages.length === 1}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* Inline rename input */}
                    {editingPageId === page.id && (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={finishRename}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') finishRename();
                          if (e.key === 'Escape') {
                            setEditingPageId(null);
                            setEditName('');
                          }
                        }}
                        className="h-6 text-[10px] px-1 text-center w-20 mt-1"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                  
                  {/* Canvas area */}
                  <div className="relative">
                    {/* Selection ring wrapper */}
                    <div
                      className={cn(
                        "relative rounded-lg transition-all duration-200 overflow-hidden",
                        isActive 
                          ? "ring-4 ring-primary shadow-2xl" 
                          : "ring-1 ring-border shadow-lg hover:ring-2 hover:ring-primary/50 hover:shadow-xl cursor-pointer"
                      )}
                      style={{
                        // Give explicit dimensions for DOMCanvas container
                        width: isActive ? Math.min(pageWidth, 800) : undefined,
                        height: isActive ? Math.min(pageHeight, 600) : undefined,
                      }}
                    >
                      {isActive ? (
                        // Active page - render full interactive DOMCanvas with explicit container size
                        <div 
                          className="w-full h-full"
                          style={{ 
                            width: Math.min(pageWidth, 800), 
                            height: Math.min(pageHeight, 600),
                          }}
                        >
                          <DOMCanvas />
                        </div>
                      ) : (
                        // Non-active page - render static preview (clickable)
                        <div onClick={() => switchToPage(page.id)} className="cursor-pointer">
                          <PagePreview page={page} />
                          {/* Click to edit overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors rounded-lg">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                              Click to edit
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Page dimensions */}
                    <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-muted-foreground">
                      {pageWidth} × {pageHeight}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Add Page Button - below all pages */}
            <div className="flex flex-col items-center gap-4 py-8 ml-14">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowAddPopup(true)}
                    className={cn(
                      "flex items-center justify-center",
                      "rounded-xl",
                      "border-2 border-dashed border-border",
                      "bg-card/50 hover:bg-card",
                      "text-muted-foreground hover:text-foreground hover:border-primary/50",
                      "transition-all duration-200",
                      "hover:scale-[1.02] hover:shadow-lg"
                    )}
                    style={{
                      width: Math.min((activePage?.canvas?.width || canvas.width || 1080) * 0.3, 200),
                      height: Math.min((activePage?.canvas?.height || canvas.height || 1080) * 0.3, 150),
                    }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Plus size={28} />
                      <span className="text-sm font-medium">Add Page</span>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Add a new page to your design
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        
        {/* Add Page Popup Menu */}
        <AddPagePopup 
          isOpen={showAddPopup} 
          onClose={() => setShowAddPopup(false)}
          onOpenModal={() => setShowAddModal(true)}
        />
        
        {/* Add Page Modal */}
        <AddPageModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      </div>
    </TooltipProvider>
  );
}

export default MultiPageCanvas;
