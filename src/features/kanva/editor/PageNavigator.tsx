'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, ChevronLeft, ChevronRight, MoreHorizontal, Copy, Trash2, Edit2, 
  Clipboard, ClipboardPaste, Grid3X3
} from 'lucide-react';
import { useEditorStore } from '../lib/editor/store';
import { cn } from '../lib/utils';
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
import { AddPageModal, AddPagePopup } from './AddPageModal';
import type { Page } from '../lib/editor/types';

/**
 * PageThumbnail - Premium page preview with hover effects
 * Inspired by Canva's filmstrip design
 */
function PageThumbnail({ 
  page, 
  isActive = false,
  index,
  thumbnailSize = 'md'
}: { 
  page: Page; 
  isActive?: boolean;
  index: number;
  thumbnailSize?: 'sm' | 'md' | 'lg';
}) {
  const canvasWidth = page.canvas?.width || 1080;
  const canvasHeight = page.canvas?.height || 1080;
  const aspectRatio = canvasWidth / canvasHeight;
  
  // Size presets based on zoom level
  const heights = { sm: 48, md: 64, lg: 88 };
  const thumbHeight = heights[thumbnailSize];
  const thumbWidth = thumbHeight * aspectRatio;
  const scale = thumbWidth / canvasWidth;
  
  return (
    <div className="relative group">
      {/* Main thumbnail container */}
      <div 
        className={cn(
          "relative rounded-lg overflow-hidden transition-all duration-200",
          "transform-gpu",
          isActive 
            ? "ring-2 ring-primary shadow-lg scale-105" 
            : "ring-1 ring-border shadow-sm hover:shadow-md hover:scale-[1.02] hover:ring-border/80"
        )}
        style={{ 
          width: Math.max(thumbWidth, 36), 
          height: thumbHeight,
        }}
      >
        {/* Canvas background */}
        <div 
          className="absolute inset-0 origin-top-left"
          style={{ 
            backgroundColor: page.canvas?.background?.color || '#ffffff',
            transform: `scale(${scale})`,
            width: canvasWidth,
            height: canvasHeight,
          }}
        >
          {/* Render mini elements */}
          {page.elements?.slice(0, 20).map((el) => (
            <div
              key={el.id}
              className="absolute"
              style={{
                left: el.x,
                top: el.y,
                width: el.width || 50,
                height: el.height || 50,
                backgroundColor: el.type === 'shape' ? (el.fill || '#3B82F6') : 
                                el.type === 'text' ? 'transparent' : '#e5e7eb',
                borderRadius: el.type === 'shape' && (el as any).shapeType === 'circle' ? '50%' : 
                             (el as any).cornerRadius || 0,
                transform: `rotate(${el.rotation || 0}deg)`,
                opacity: el.opacity ?? 1,
              }}
            >
              {el.type === 'text' && (
                <div 
                  className="truncate"
                  style={{ 
                    fontSize: Math.max(3, ((el as any).fontSize || 16) * 0.15),
                    color: el.fill || '#000',
                    fontWeight: (el as any).fontWeight || 'normal',
                  }}
                >
                  {(el as any).text?.substring(0, 20) || ''}
                </div>
              )}
              {el.type === 'image' && (el as any).src && (
                <img 
                  src={(el as any).src} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Page number badge */}
      <div 
        className={cn(
          "absolute -bottom-1 left-1/2 -translate-x-1/2 z-10",
          "min-w-[20px] h-5 px-1.5 rounded-full",
          "text-[10px] font-bold flex items-center justify-center",
          "transition-all duration-200 shadow-sm",
          isActive 
            ? "bg-primary text-primary-foreground scale-110" 
            : "bg-card text-muted-foreground border border-border group-hover:border-primary/50"
        )}
      >
        {index + 1}
      </div>
    </div>
  );
}

/**
 * PageNavigator - Compact filmstrip-style page navigation
 * Designed to integrate seamlessly with the BottomBar
 */
export function PageNavigator() {
  const pages = useEditorStore((state) => state.pages || []);
  const activePageId = useEditorStore((state) => state.activePageId);
  const setActivePage = useEditorStore((state) => state.setActivePage);
  const deletePage = useEditorStore((state) => state.deletePage);
  const duplicatePage = useEditorStore((state) => state.duplicatePage);
  const renamePage = useEditorStore((state) => state.renamePage);
  const reorderPages = useEditorStore((state) => state.reorderPages);
  
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [copiedElements, setCopiedElements] = useState<any[] | null>(null);
  const [thumbnailSize, setThumbnailSize] = useState<'sm' | 'md' | 'lg'>('md');
  
  // Drag state
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const activePageIndex = useMemo(() => 
    pages.findIndex(p => p.id === activePageId), 
    [pages, activePageId]
  );
  
  // Navigation
  const goToPreviousPage = useCallback(() => {
    if (activePageIndex > 0) {
      setActivePage(pages[activePageIndex - 1].id);
    }
  }, [activePageIndex, pages, setActivePage]);
  
  const goToNextPage = useCallback(() => {
    if (activePageIndex < pages.length - 1) {
      setActivePage(pages[activePageIndex + 1].id);
    }
  }, [activePageIndex, pages, setActivePage]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === 'PageUp' || (e.altKey && e.key === 'ArrowUp')) {
        e.preventDefault();
        goToPreviousPage();
      } else if (e.key === 'PageDown' || (e.altKey && e.key === 'ArrowDown')) {
        e.preventDefault();
        goToNextPage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPreviousPage, goToNextPage]);
  
  // Auto-scroll to active page
  useEffect(() => {
    if (scrollContainerRef.current && activePageId) {
      const activeElement = scrollContainerRef.current.querySelector(`[data-page-id="${activePageId}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activePageId]);
  
  const handleDuplicatePage = (pageId: string) => {
    const newPageId = duplicatePage(pageId);
    if (newPageId) setActivePage(newPageId);
  };
  
  const handleDeletePage = (pageId: string) => {
    if (pages.length > 1) deletePage(pageId);
  };
  
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
  
  // Drag handlers
  const handleDragStart = (e: React.DragEvent, pageId: string) => {
    setDraggedPageId(pageId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', pageId);
    // Add drag image
    const target = e.currentTarget as HTMLElement;
    e.dataTransfer.setDragImage(target, target.offsetWidth / 2, target.offsetHeight / 2);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };
  
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedPageId) {
      const draggedIndex = pages.findIndex(p => p.id === draggedPageId);
      if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
        const newOrder = [...pages.map(p => p.id)];
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedPageId);
        reorderPages(newOrder);
      }
    }
    setDraggedPageId(null);
    setDragOverIndex(null);
  };
  
  const handleDragEnd = () => {
    setDraggedPageId(null);
    setDragOverIndex(null);
  };
  
  // Copy/paste
  const handleCopyFromPage = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page?.elements?.length) {
      setCopiedElements(JSON.parse(JSON.stringify(page.elements)));
    }
  };
  
  const handlePasteToPage = () => {
    if (copiedElements?.length) {
      const addElement = useEditorStore.getState().addElement;
      const elements = useEditorStore.getState().elements;
      const maxZ = Math.max(...elements.map(e => e.zIndex || 0), 0);
      
      copiedElements.forEach((el, i) => {
        addElement({
          ...el,
          id: `${el.id}-copy-${Date.now()}-${i}`,
          x: el.x + 20,
          y: el.y + 20,
          zIndex: maxZ + i + 1,
        });
      });
    }
  };
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ 
        left: direction === 'left' ? -150 : 150, 
        behavior: 'smooth' 
      });
    }
  };
  
  // Cycle through thumbnail sizes
  const cycleThumbnailSize = () => {
    setThumbnailSize(prev => prev === 'sm' ? 'md' : prev === 'md' ? 'lg' : 'sm');
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center h-full">
        {/* Main filmstrip container - matches app design system */}
        <div className="flex items-center bg-card/80 backdrop-blur-md rounded-xl px-3 py-2 gap-2 border border-border shadow-lg">
          
          {/* Left scroll button */}
          {pages.length > 4 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('left')}
              className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <ChevronLeft size={16} />
            </Button>
          )}
          
          {/* Pages filmstrip */}
          <div 
            ref={scrollContainerRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-none max-w-[550px] px-1 py-2"
          >
            {pages.map((page, index) => (
              <div
                key={page.id}
                data-page-id={page.id}
                draggable
                onDragStart={(e) => handleDragStart(e, page.id)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => setActivePage(page.id)}
                onDoubleClick={() => startRename(page.id, page.name)}
                className={cn(
                  "relative cursor-pointer transition-all duration-200 shrink-0",
                  draggedPageId === page.id && "opacity-40 scale-90",
                  dragOverIndex === index && draggedPageId !== page.id && "translate-x-3"
                )}
              >
                {/* Thumbnail with integrated page number */}
                <PageThumbnail 
                  page={page} 
                  isActive={activePageId === page.id} 
                  index={index} 
                  thumbnailSize={thumbnailSize} 
                />
                
                {/* Rename input overlay */}
                {editingPageId === page.id && (
                  <div className="absolute inset-x-0 -bottom-7 z-20">
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
                      className="h-6 text-[10px] px-2 text-center bg-background border-primary"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
                
                {/* Context menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "absolute top-1 right-1 z-10 w-5 h-5 rounded-md",
                        "bg-background/90 backdrop-blur-sm border border-border",
                        "flex items-center justify-center",
                        "opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all",
                        "hover:bg-accent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <MoreHorizontal size={12} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" side="top" className="w-44">
                    <DropdownMenuItem onClick={() => startRename(page.id, page.name)}>
                      <Edit2 size={14} className="mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicatePage(page.id)}>
                      <Copy size={14} className="mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleCopyFromPage(page.id)}>
                      <Clipboard size={14} className="mr-2" />
                      Copy Elements
                    </DropdownMenuItem>
                    {copiedElements && activePageId === page.id && (
                      <DropdownMenuItem onClick={handlePasteToPage}>
                        <ClipboardPaste size={14} className="mr-2" />
                        Paste ({copiedElements.length})
                      </DropdownMenuItem>
                    )}
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
              </div>
            ))}
          </div>
          
          {/* Right scroll button */}
          {pages.length > 4 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('right')}
              className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <ChevronRight size={16} />
            </Button>
          )}
          
          {/* Divider */}
          <div className="w-px h-10 bg-border mx-1" />
          
          {/* Add page button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowAddPopup(true)}
                className={cn(
                  "relative flex items-center justify-center",
                  "w-12 h-16 rounded-lg",
                  "border-2 border-dashed border-border",
                  "bg-muted/50 hover:bg-accent",
                  "text-muted-foreground hover:text-foreground hover:border-primary/50",
                  "transition-all duration-200",
                  "hover:scale-105"
                )}
              >
                <Plus size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Add Page
            </TooltipContent>
          </Tooltip>
          
          {/* Thumbnail size toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={cycleThumbnailSize}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Grid3X3 size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Thumbnail Size ({thumbnailSize})
            </TooltipContent>
          </Tooltip>
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
