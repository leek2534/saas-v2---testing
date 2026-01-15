'use client';

import React from 'react';
import { useEditorStore } from '../../lib/editor/store';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '../../lib/utils';
import type { EditorElement } from '../../lib/editor/types';

/**
 * LayersPanel - Layer management panel
 * Shows all elements in z-index order with controls for visibility, lock, and layer operations
 */
export function LayersPanel() {
  const elements = useEditorStore((s) => s.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);
  const updateElement = useEditorStore((s) => s.updateElement);
  const deleteElements = useEditorStore((s) => s.deleteElements);
  const bringToFront = useEditorStore((s) => s.bringToFront);
  const sendToBack = useEditorStore((s) => s.sendToBack);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);

  // Ensure elements is always an array
  const elementsArray = Array.isArray(elements) ? elements : [];

  // Sort elements by z-index (top to bottom = highest to lowest z-index)
  const sortedElements = [...elementsArray].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  // Get element type icon
  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return 'T';
      case 'image':
        return '🖼️';
      case 'shape':
        return '⬜';
      case 'video':
        return '▶️';
      case 'icon':
        return '🎨';
      default:
        return '•';
    }
  };

  // Get element display name
  const getElementName = (element: EditorElement) => {
    if (element.type === 'text') {
      return (element as any).text || 'Text';
    }
    if (element.type === 'image') {
      return 'Image';
    }
    if (element.type === 'shape') {
      return (element as any).shapeType || 'Shape';
    }
    if (element.type === 'video') {
      return 'Video';
    }
    if (element.type === 'icon') {
      return (element as any).iconName || 'Icon';
    }
    return element.type;
  };

  // Handle layer operations (store methods already push history)
  const handleBringToFront = (id: string) => {
    bringToFront(id);
  };

  const handleSendToBack = (id: string) => {
    sendToBack(id);
  };

  const handleBringForward = (id: string) => {
    bringForward(id);
  };

  const handleSendBackward = (id: string) => {
    sendBackward(id);
  };

  // Handle visibility toggle
  const handleToggleVisibility = (id: string, currentVisible: boolean) => {
    updateElement(id, { visible: !currentVisible });
    pushHistory(getStateSnapshot());
  };

  // Handle lock toggle
  const handleToggleLock = (id: string, element: EditorElement) => {
    updateElement(id, {
      metadata: { ...element.metadata, lock: !element.metadata?.lock },
    });
    pushHistory(getStateSnapshot());
  };

  // Handle delete (deleteElements already pushes history)
  const handleDelete = (id: string) => {
    deleteElements([id]);
  };

  // Handle element selection
  const handleSelect = (id: string, e: React.MouseEvent) => {
    if (e.shiftKey) {
      // Multi-select with Shift
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      // Single select
      setSelectedIds([id]);
    }
  };

  return (
    <div className="w-80 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-primary" />
          <h3 className="text-foreground font-bold text-lg tracking-tight">Layers</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-2">Manage element stacking and visibility</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">{sortedElements.length} elements</span>
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto p-4">
        {sortedElements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
              <Layers className="text-muted-foreground/50 mb-4 relative" size={64} />
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-2">No layers yet</p>
            <p className="text-muted-foreground/70 text-xs">Add elements to see them here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedElements.map((element, index) => {
              const isSelected = selectedIds.includes(element.id);
              const isLocked = element.metadata?.lock || false;
              const isVisible = element.visible !== false;
              const isTop = index === 0;
              const isBottom = index === sortedElements.length - 1;

              return (
                <div
                  key={element.id}
                  className={cn(
                    'group flex items-center gap-2 p-3 rounded-xl transition-all duration-300 cursor-pointer',
                    isSelected
                      ? 'bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/50 shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'bg-muted/50 hover:bg-accent hover:scale-[1.01] hover:shadow-md border border-border/50'
                  )}
                  onClick={(e) => handleSelect(element.id, e)}
                >
                  {/* Drag Handle */}
                  <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />

                  {/* Element Icon */}
                  <div className="w-8 h-8 flex items-center justify-center text-xs bg-primary/10 rounded-lg flex-shrink-0 font-medium">
                    {getElementIcon(element.type)}
                  </div>

                  {/* Element Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium truncate capitalize">
                      {getElementName(element)}
                    </p>
                    <p className="text-muted-foreground text-xs">z-index: {element.zIndex || 0}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {/* Visibility Toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisibility(element.id, isVisible);
                      }}
                      title={isVisible ? 'Hide' : 'Show'}
                    >
                      {isVisible ? (
                        <Eye className="w-4 h-4 text-foreground" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>

                    {/* Lock Toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLock(element.id, element);
                      }}
                      title={isLocked ? 'Unlock' : 'Lock'}
                    >
                      {isLocked ? (
                        <Lock className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Unlock className="w-4 h-4 text-foreground" />
                      )}
                    </Button>

                    {/* Layer Operations */}
                    <div className="flex items-center gap-0.5 border-l border-border/50 pl-1 ml-1">
                      {/* Bring to Front */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 disabled:opacity-30"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBringToFront(element.id);
                        }}
                        disabled={isTop}
                        title="Bring to Front"
                      >
                        <ArrowUp className="w-4 h-4 text-foreground" />
                      </Button>

                      {/* Bring Forward */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 disabled:opacity-30"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBringForward(element.id);
                        }}
                        disabled={isTop}
                        title="Bring Forward"
                      >
                        <ChevronUp className="w-4 h-4 text-foreground" />
                      </Button>

                      {/* Send Backward */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 disabled:opacity-30"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendBackward(element.id);
                        }}
                        disabled={isBottom}
                        title="Send Backward"
                      >
                        <ChevronDown className="w-4 h-4 text-foreground" />
                      </Button>

                      {/* Send to Back */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 disabled:opacity-30"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendToBack(element.id);
                        }}
                        disabled={isBottom}
                        title="Send to Back"
                      >
                        <ArrowDown className="w-4 h-4 text-foreground" />
                      </Button>
                    </div>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive hover:scale-110 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(element.id);
                      }}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-gradient-to-br from-muted/30 to-background">
        <div className="text-xs text-muted-foreground space-y-1.5">
          <p className="flex items-center gap-2">• Click to select, Shift+Click for multi-select</p>
          <p className="flex items-center gap-2">• Use arrows to change layer order</p>
        </div>
      </div>
    </div>
  );
}

