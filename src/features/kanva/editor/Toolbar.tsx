'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Undo, Redo, Layers, Move, ChevronDown } from "lucide-react";
import { useEditorStore } from "../lib/editor/store";
import { cn } from "../lib/utils";
import { ElementToolbar } from "./Canvas/ElementToolbar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PanelKey = "position" | "layers";

interface ToolbarProps {
  activePanel?: PanelKey | null;
  onTogglePanel?: (panel: PanelKey) => void;
}

/**
 * Toolbar - Secondary toolbar (TopBar 2)
 * Clean, modern design with clear visual hierarchy
 */
export function Toolbar({ activePanel, onTogglePanel }: ToolbarProps) {
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const canUndo = useEditorStore((state) => state.canUndo);
  const canRedo = useEditorStore((state) => state.canRedo);
  const canvas = useEditorStore((state) => state.canvas);
  const setCanvas = useEditorStore((state) => state.setCanvas);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const quickColors = [
    { color: '#ffffff', name: 'White' },
    { color: '#000000', name: 'Black' },
    { color: '#f8fafc', name: 'Slate 50' },
    { color: '#e2e8f0', name: 'Slate 200' },
    { color: '#3b82f6', name: 'Blue' },
    { color: '#8b5cf6', name: 'Purple' },
    { color: '#ec4899', name: 'Pink' },
    { color: '#10b981', name: 'Emerald' },
    { color: '#f59e0b', name: 'Amber' },
    { color: '#ef4444', name: 'Red' },
    { color: '#06b6d4', name: 'Cyan' },
    { color: '#84cc16', name: 'Lime' },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center h-12 px-3 bg-background/95 backdrop-blur-sm border-b border-border/40 shadow-sm">
        
        {/* Left Section: History + Canvas Background */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Undo/Redo Group */}
          <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={undo}
                  disabled={!canUndo}
                  className="h-8 w-8 rounded-md hover:bg-background disabled:opacity-40"
                >
                  <Undo size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Undo <kbd className="ml-1 px-1 py-0.5 bg-muted rounded text-[10px]">⌘Z</kbd>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={redo}
                  disabled={!canRedo}
                  className="h-8 w-8 rounded-md hover:bg-background disabled:opacity-40"
                >
                  <Redo size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Redo <kbd className="ml-1 px-1 py-0.5 bg-muted rounded text-[10px]">⌘⇧Z</kbd>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="w-px h-6 bg-border/50 mx-2" />
          
          {/* Background Color */}
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className={cn(
                    "flex items-center gap-2 h-8 px-2.5 rounded-lg transition-all",
                    "hover:bg-muted/80 active:scale-95",
                    showColorPicker && "bg-muted"
                  )}
                >
                  <div 
                    className="w-5 h-5 rounded-md border border-border/50 shadow-sm ring-1 ring-inset ring-white/10"
                    style={{ backgroundColor: canvas.background?.color || '#ffffff' }}
                  />
                  <span className="text-xs font-medium text-muted-foreground">BG</span>
                  <ChevronDown size={12} className="text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Canvas Background
              </TooltipContent>
            </Tooltip>
            
            {showColorPicker && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowColorPicker(false)}
                />
                <div className="absolute top-full left-0 mt-2 p-3 bg-popover border border-border rounded-xl shadow-xl z-50 w-[220px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                  <p className="text-xs font-medium text-foreground mb-2.5">Background Color</p>
                  <div className="grid grid-cols-6 gap-1.5 mb-3">
                    {quickColors.map((item) => (
                      <button
                        key={item.color}
                        onClick={() => {
                          setCanvas({ background: { color: item.color } });
                          setShowColorPicker(false);
                        }}
                        className={cn(
                          "w-7 h-7 rounded-lg border transition-all hover:scale-110 active:scale-95",
                          canvas.background?.color === item.color
                            ? "border-primary ring-2 ring-primary/30 scale-105"
                            : "border-border/50 hover:border-border"
                        )}
                        style={{ backgroundColor: item.color }}
                        title={item.name}
                      />
                    ))}
                  </div>
                  <div className="pt-2.5 border-t border-border/50">
                    <label className="text-xs text-muted-foreground mb-1.5 block">Custom</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={canvas.background?.color || '#ffffff'}
                        onChange={(e) => setCanvas({ background: { color: e.target.value } })}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                      />
                      <input
                        type="text"
                        value={canvas.background?.color || '#ffffff'}
                        onChange={(e) => setCanvas({ background: { color: e.target.value } })}
                        className="flex-1 h-8 px-2 text-xs font-mono bg-muted border border-border/50 rounded-md uppercase"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center Section: Element Toolbar */}
        <div className="flex-1 flex items-center justify-center mx-4 min-w-0">
          {selectedIds.length > 0 ? (
            <div 
              className="flex items-center gap-1 px-3 py-1 bg-muted/40 rounded-lg border border-border/30 max-w-full overflow-x-auto scrollbar-none"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              style={{ zIndex: 1000, position: 'relative' }}
            >
              <ElementToolbar />
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-1.5 text-muted-foreground/60">
              <span className="text-xs">Select an element to edit</span>
            </div>
          )}
        </div>

        {/* Right Section: View Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3 rounded-md gap-1.5 text-xs font-medium transition-all",
                    activePanel === "position" 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "hover:bg-background text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onTogglePanel?.("position")}
                >
                  <Move size={14} />
                  <span className="hidden sm:inline">Position</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Position & Size
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3 rounded-md gap-1.5 text-xs font-medium transition-all",
                    activePanel === "layers" 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "hover:bg-background text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onTogglePanel?.("layers")}
                >
                  <Layers size={14} />
                  <span className="hidden sm:inline">Layers</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Layer Panel
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
