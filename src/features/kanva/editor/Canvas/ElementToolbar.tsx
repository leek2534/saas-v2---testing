'use client';

import { useState } from 'react';
import { useEditorStore } from "../../lib/editor/store";
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Minus, Plus, ChevronDown,
  Palette, Image as ImageIcon, Square, Circle as CircleIcon,
  Play, Sparkles, RotateCw, FlipHorizontal, FlipVertical, RotateCcw,
  Strikethrough, CaseSensitive, Contrast, Sun, Droplets,
  RectangleHorizontal, SlidersHorizontal, CircleDot, Volume2, VolumeX
} from "lucide-react";
import { useBackgroundRemoval } from "../../stubs/useBackgroundRemoval";
import { BackgroundRemovalModal } from "../../stubs/BackgroundRemovalModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { FontSelector } from "../../components/FontSelector";
import { getEditor, triggerEditMode } from "../../lib/editor/editorRegistry";

/**
 * ElementToolbar - Unified toolbar for all element types
 * Shows in the top bar when elements are selected
 * Provides element-specific controls based on selection type
 */
export function ElementToolbar() {
  const [showFontSelector, setShowFontSelector] = useState(false);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const elements = useEditorStore((s) => s.elements);
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);
  
  const elementsArray = Array.isArray(elements) ? elements : [];
  const selectedElements = elementsArray.filter(el => selectedIds.includes(el.id));
  
  // Determine what type of elements are selected
  const selectedTypes = [...new Set(selectedElements.map(el => el.type))];
  const isSingleType = selectedTypes.length === 1;
  const primaryType = selectedTypes[0];
  
  // Get the first selected element for property display
  const primaryElement = selectedElements[0] as any;
  
  if (selectedIds.length === 0) {
    return null; // No placeholder - just hide when nothing selected
  }
  
  // Handle updates
  const handleUpdate = (updates: any) => {
    selectedElements.forEach(el => {
      updateElement(el.id, updates);
    });
    pushHistory(getStateSnapshot());
  };

  // ============================================
  // TEXT TOOLBAR
  // ============================================
  if (isSingleType && primaryType === 'text') {
    const textElement = primaryElement;
    
    // Get TipTap editor instance if available (when text is being edited)
    const editor = getEditor(textElement.id);
    
    const handleFontSizeChange = (delta: number) => {
      const currentSize = textElement.fontSize || 16;
      const newSize = Math.max(8, Math.min(200, currentSize + delta));
      handleUpdate({ fontSize: newSize });
    };

    // Helper to ensure editor is available, entering edit mode if needed
    const ensureEditorAndApply = (applyFn: (editor: any) => void) => {
      // If editor is already available, apply immediately
      if (editor) {
        applyFn(editor);
        return;
      }

      // Trigger edit mode directly using the registry
      triggerEditMode(textElement.id);

      // Wait for editor to be available (poll with timeout)
      let attempts = 0;
      const maxAttempts = 30; // 300ms max wait (increased for reliability)
      const checkEditor = setInterval(() => {
        attempts++;
        const newEditor = getEditor(textElement.id);
        if (newEditor) {
          clearInterval(checkEditor);
          // Small delay to ensure editor is fully ready
          setTimeout(() => {
            applyFn(newEditor);
          }, 10);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkEditor);
          // Fallback to element-level formatting if editor doesn't become available
          console.warn('Editor not available after entering edit mode');
        }
      }, 10);
    };

    // Helper to preserve selection when applying formatting
    const applyFormattingWithSelectionPreserved = (
      ed: any, 
      command: () => void
    ) => {
      // Save current selection BEFORE any operations
      const { from, to } = ed.state.selection;
      const hasSelection = from !== to;
      
      // Apply the formatting command (this might change selection)
      command();
      
      // If there was a selection, restore it immediately after the command
      if (hasSelection) {
        // Use double requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Restore the exact selection range
            try {
              ed.commands.setTextSelection({ from, to });
              // Keep editor focused to maintain selection visibility
              if (!ed.isFocused) {
                ed.commands.focus();
              }
            } catch (e) {
              // If selection restoration fails, at least keep focus
              if (!ed.isFocused) {
                ed.commands.focus();
              }
            }
          });
        });
      } else {
        // No selection, just ensure focus
        requestAnimationFrame(() => {
          if (!ed.isFocused) {
            ed.commands.focus();
          }
        });
      }
    };

    const toggleBold = (e: React.MouseEvent) => {
      e.preventDefault(); // CRITICAL: Prevent focus loss
      e.stopPropagation();
      
      ensureEditorAndApply((ed) => {
        applyFormattingWithSelectionPreserved(ed, () => {
          ed.chain().focus().toggleBold().run();
        });
      });
    };

    const toggleItalic = (e: React.MouseEvent) => {
      e.preventDefault(); // CRITICAL: Prevent focus loss
      e.stopPropagation();
      
      ensureEditorAndApply((ed) => {
        applyFormattingWithSelectionPreserved(ed, () => {
          ed.chain().focus().toggleItalic().run();
        });
      });
    };

    const toggleUnderline = (e: React.MouseEvent) => {
      e.preventDefault(); // CRITICAL: Prevent focus loss
      e.stopPropagation();
      
      ensureEditorAndApply((ed) => {
        applyFormattingWithSelectionPreserved(ed, () => {
          ed.chain().focus().toggleUnderline().run();
        });
      });
    };

    const toggleStrikethrough = (e: React.MouseEvent) => {
      e.preventDefault(); // CRITICAL: Prevent focus loss
      e.stopPropagation();
      
      ensureEditorAndApply((ed) => {
        applyFormattingWithSelectionPreserved(ed, () => {
          ed.chain().focus().toggleStrike().run();
        });
      });
    };

    const toggleOverline = (e: React.MouseEvent) => {
      e.preventDefault(); // CRITICAL: Prevent focus loss
      e.stopPropagation();
      
      ensureEditorAndApply((ed) => {
        applyFormattingWithSelectionPreserved(ed, () => {
          ed.chain().focus().toggleOverline().run();
        });
      });
    };

    const cycleTextTransform = (e: React.MouseEvent) => {
      e.preventDefault(); // CRITICAL: Prevent focus loss
      e.stopPropagation();
      const transforms = ['none', 'uppercase', 'lowercase', 'capitalize'];
      const current = textElement.textTransform || 'none';
      const nextIndex = (transforms.indexOf(current) + 1) % transforms.length;
      handleUpdate({ textTransform: transforms[nextIndex] });
    };

    const setAlignment = (align: string, e: React.MouseEvent) => {
      e.preventDefault(); // CRITICAL: Prevent focus loss
      e.stopPropagation();
      handleUpdate({ align });
    };

    // Check formatting state from TipTap editor if available, otherwise from element
    const isBold = editor
      ? editor.isActive('bold')
      : (textElement.fontWeight || 400) >= 600;
    const isItalic = editor
      ? editor.isActive('italic')
      : textElement.fontStyle === 'italic';
    const isUnderlined = editor
      ? editor.isActive('underline')
      : textElement.textDecoration === 'underline';
    const isStrikethrough = editor
      ? editor.isActive('strike')
      : textElement.textDecoration === 'line-through';
    const isOverlined = editor
      ? editor.isActive('overline')
      : textElement.textDecoration === 'overline';
    const textTransform = textElement.textTransform || 'none';

    return (
      <div 
        className="flex items-center gap-1.5 animate-in fade-in duration-150"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Font Family */}
        <Popover open={showFontSelector} onOpenChange={setShowFontSelector}>
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-1.5 h-7 px-2 rounded-md bg-background/80 border border-border/50 hover:border-border hover:bg-background transition-all text-xs"
              style={{ fontFamily: textElement.fontFamily || 'Inter' }}
              onMouseDown={(e) => {
                e.preventDefault(); // CRITICAL: Prevent focus loss
                e.stopPropagation();
              }}
            >
              <span className="truncate max-w-[80px]">{textElement.fontFamily || 'Inter'}</span>
              <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto" align="start" side="bottom" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            <FontSelector
              selectedFont={textElement.fontFamily || 'Inter'}
              selectedWeight={String(textElement.fontWeight || '400')}
              onFontSelect={(font, weight) => {
                handleUpdate({ 
                  fontFamily: font,
                  fontWeight: weight ? parseInt(weight) : 400
                });
                setShowFontSelector(false);
              }}
              onClose={() => setShowFontSelector(false)}
            />
          </PopoverContent>
        </Popover>

        {/* Font Size */}
        <div className="flex items-center h-7 bg-background/80 border border-border/50 rounded-md overflow-hidden">
          <button 
            onMouseDown={(e) => {
              e.preventDefault(); // CRITICAL: Prevent focus loss
              e.stopPropagation();
              handleFontSizeChange(-2);
            }}
            className="h-full w-6 flex items-center justify-center hover:bg-muted/80 transition-colors border-r border-border/30"
          >
            <Minus className="h-3 w-3" />
          </button>
          <input
            type="number"
            value={textElement.fontSize || 16}
            onChange={(e) => {
              e.stopPropagation();
              handleUpdate({ fontSize: parseInt(e.target.value) || 16 });
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              // Allow focus on input for editing
            }}
            className="w-10 h-full text-xs text-center bg-transparent border-0 focus:outline-none focus:ring-0"
            min="8"
            max="200"
          />
          <button 
            onMouseDown={(e) => {
              e.preventDefault(); // CRITICAL: Prevent focus loss
              e.stopPropagation();
              handleFontSizeChange(2);
            }}
            className="h-full w-6 flex items-center justify-center hover:bg-muted/80 transition-colors border-l border-border/30"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        <div className="w-px h-5 bg-border/40 mx-0.5" />

        {/* Text Style Group */}
        <div className="flex items-center h-7 bg-background/80 border border-border/50 rounded-md overflow-hidden">
          <button 
            onMouseDown={toggleBold}
            className={cn(
              "h-full w-7 flex items-center justify-center transition-colors",
              isBold ? "bg-primary/15 text-primary" : "hover:bg-muted/80"
            )}
            title="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button 
            onMouseDown={toggleItalic}
            className={cn(
              "h-full w-7 flex items-center justify-center transition-colors border-l border-border/30",
              isItalic ? "bg-primary/15 text-primary" : "hover:bg-muted/80"
            )}
            title="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleUnderline(e);
            }}
            className={cn(
              "h-full w-7 flex items-center justify-center transition-colors border-l border-border/30",
              isUnderlined ? "bg-primary/15 text-primary" : "hover:bg-muted/80"
            )}
            title="Underline"
          >
            <Underline className="h-3.5 w-3.5" />
          </button>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleStrikethrough(e);
            }}
            className={cn(
              "h-full w-7 flex items-center justify-center transition-colors border-l border-border/30",
              isStrikethrough ? "bg-primary/15 text-primary" : "hover:bg-muted/80"
            )}
            title="Strikethrough"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </button>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleOverline(e);
            }}
            className={cn(
              "h-full w-7 flex items-center justify-center transition-colors border-l border-border/30",
              isOverlined ? "bg-primary/15 text-primary" : "hover:bg-muted/80"
            )}
            title="Overline"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Text Transform */}
        <button 
          onMouseDown={cycleTextTransform}
          className="h-7 px-2 flex items-center gap-1 rounded-md bg-background/80 border border-border/50 hover:border-border hover:bg-background transition-all text-xs"
          title={`Text Transform: ${textTransform}`}
        >
          <CaseSensitive className="h-3.5 w-3.5" />
          <span className="text-[10px] uppercase">{textTransform === 'none' ? 'Aa' : textTransform === 'uppercase' ? 'AA' : textTransform === 'lowercase' ? 'aa' : 'Aa'}</span>
        </button>

        {/* Alignment Group */}
        <div className="flex items-center h-7 bg-background/80 border border-border/50 rounded-md overflow-hidden">
          <button 
            onMouseDown={(e) => setAlignment('left', e)}
            className={cn(
              "h-full w-7 flex items-center justify-center transition-colors",
              textElement.align === 'left' ? "bg-primary/15 text-primary" : "hover:bg-muted/80"
            )}
            title="Align Left"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </button>
          <button 
            onMouseDown={(e) => setAlignment('center', e)}
            className={cn(
              "h-full w-7 flex items-center justify-center transition-colors border-l border-border/30",
              textElement.align === 'center' ? "bg-primary/15 text-primary" : "hover:bg-muted/80"
            )}
            title="Align Center"
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </button>
          <button 
            onMouseDown={(e) => setAlignment('right', e)}
            className={cn(
              "h-full w-7 flex items-center justify-center transition-colors border-l border-border/30",
              textElement.align === 'right' ? "bg-primary/15 text-primary" : "hover:bg-muted/80"
            )}
            title="Align Right"
          >
            <AlignRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="w-px h-5 bg-border/40 mx-0.5" />

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <button 
              className="flex items-center gap-1.5 h-7 px-2 rounded-md bg-background/80 border border-border/50 hover:border-border hover:bg-background transition-all"
              title="Text Color"
              onMouseDown={(e) => {
                e.preventDefault(); // CRITICAL: Prevent focus loss
                e.stopPropagation();
              }}
            >
              <div 
                className="w-4 h-4 rounded border border-border/50 shadow-sm" 
                style={{ backgroundColor: textElement.fill || '#000000' }} 
              />
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Text Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textElement.fill || '#000000'}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleUpdate({ fill: e.target.value });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={textElement.fill || '#000000'}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleUpdate({ fill: e.target.value });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="flex-1 h-8 px-2 text-xs font-mono bg-muted border border-border/50 rounded-md uppercase"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // ============================================
  // IMAGE TOOLBAR
  // ============================================
  if (isSingleType && primaryType === 'image') {
    return <ImageToolbarContent element={primaryElement} onUpdate={handleUpdate} />;
  }

  // ============================================
  // SHAPE TOOLBAR
  // ============================================
  if (isSingleType && primaryType === 'shape') {
    return (
      <div className="flex items-center gap-2 animate-in fade-in duration-200">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {primaryElement.shapeType === 'circle' ? <CircleIcon className="h-4 w-4" /> : <Square className="h-4 w-4" />}
          <span className="capitalize">{primaryElement.shapeType || 'Shape'}</span>
        </div>
        
        <div className="w-px h-5 bg-border" />
        
        {/* Fill Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5">
              <div className="w-4 h-4 rounded border" style={{ backgroundColor: primaryElement.fill || '#4F46E5' }} />
              <span className="text-xs">Fill</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label className="text-xs">Fill Color</Label>
              <Input
                type="color"
                value={primaryElement.fill || '#4F46E5'}
                onChange={(e) => handleUpdate({ fill: e.target.value })}
                className="h-8 w-full"
              />
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Stroke Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5">
              <div className="w-4 h-4 rounded border-2" style={{ borderColor: primaryElement.stroke || '#000000' }} />
              <span className="text-xs">Stroke</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">Stroke Color</Label>
                <Input
                  type="color"
                  value={primaryElement.stroke || '#000000'}
                  onChange={(e) => handleUpdate({ stroke: e.target.value })}
                  className="h-8 w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Stroke Width</Label>
                <Slider
                  value={[primaryElement.strokeWidth || 0]}
                  onValueChange={([value]) => handleUpdate({ strokeWidth: value })}
                  min={0}
                  max={20}
                  step={1}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Corner Radius (for rectangles) */}
        {primaryElement.shapeType !== 'circle' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5">
                <CircleDot className="h-3.5 w-3.5" />
                <span className="text-xs">{primaryElement.cornerRadius || 0}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <Label className="text-xs">Corner Radius</Label>
                <Slider
                  value={[primaryElement.cornerRadius || 0]}
                  onValueChange={([value]) => handleUpdate({ cornerRadius: value })}
                  min={0}
                  max={Math.min(primaryElement.width || 100, primaryElement.height || 100) / 2}
                  step={1}
                />
                <span className="text-xs text-muted-foreground">{primaryElement.cornerRadius || 0}px</span>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Opacity */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
              <span className="text-xs">Opacity</span>
              <span className="text-xs text-muted-foreground">{Math.round((primaryElement.opacity ?? 1) * 100)}%</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label className="text-xs">Opacity</Label>
              <Slider
                value={[(primaryElement.opacity ?? 1) * 100]}
                onValueChange={([value]) => handleUpdate({ opacity: value / 100 })}
                min={0}
                max={100}
                step={1}
              />
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="w-px h-5 bg-border" />
        
        {/* Size */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">W:</span>
          <Input
            type="number"
            value={Math.round(primaryElement.width || 100)}
            onChange={(e) => handleUpdate({ width: parseInt(e.target.value) || 100 })}
            className="h-8 w-14 text-xs"
          />
          <span className="text-xs text-muted-foreground">H:</span>
          <Input
            type="number"
            value={Math.round(primaryElement.height || 100)}
            onChange={(e) => handleUpdate({ height: parseInt(e.target.value) || 100 })}
            className="h-8 w-14 text-xs"
          />
        </div>

        <div className="w-px h-5 bg-border" />

        {/* Rotation Control */}
        <div className="flex items-center gap-1">
          <RotateCcw className="h-3 w-3 text-muted-foreground" />
          <Input
            type="number"
            value={Math.round(primaryElement.rotation || 0)}
            onChange={(e) => handleUpdate({ rotation: parseInt(e.target.value) || 0 })}
            className="h-8 w-12 text-xs text-center"
            min="-360"
            max="360"
            step="15"
            title="Rotation (degrees)"
          />
          <span className="text-xs text-muted-foreground">°</span>
        </div>
      </div>
    );
  }

  // ============================================
  // ICON TOOLBAR
  // ============================================
  if (isSingleType && primaryType === 'icon') {
    return (
      <div className="flex items-center gap-2 animate-in fade-in duration-200">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>Icon</span>
        </div>
        
        <div className="w-px h-5 bg-border" />
        
        {/* Icon Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: primaryElement.fill || '#000000' }} />
              <span className="text-xs">Color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label className="text-xs">Icon Color</Label>
              <Input
                type="color"
                value={primaryElement.fill || '#000000'}
                onChange={(e) => handleUpdate({ fill: e.target.value })}
                className="h-8 w-full"
              />
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="w-px h-5 bg-border" />
        
        {/* Size */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Size:</span>
          <Input
            type="number"
            value={Math.round(primaryElement.width || 100)}
            onChange={(e) => {
              const size = parseInt(e.target.value) || 100;
              handleUpdate({ width: size, height: size });
            }}
            className="h-8 w-14 text-xs"
          />
        </div>

        <div className="w-px h-5 bg-border" />

        {/* Rotation Control */}
        <div className="flex items-center gap-1">
          <RotateCcw className="h-3 w-3 text-muted-foreground" />
          <Input
            type="number"
            value={Math.round(primaryElement.rotation || 0)}
            onChange={(e) => handleUpdate({ rotation: parseInt(e.target.value) || 0 })}
            className="h-8 w-12 text-xs text-center"
            min="-360"
            max="360"
            step="15"
            title="Rotation (degrees)"
          />
          <span className="text-xs text-muted-foreground">°</span>
        </div>
      </div>
    );
  }

  // ============================================
  // VIDEO TOOLBAR
  // ============================================
  if (isSingleType && primaryType === 'video') {
    return (
      <div className="flex items-center gap-2 animate-in fade-in duration-200">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Play className="h-4 w-4" />
          <span>Video</span>
        </div>
        
        <div className="w-px h-5 bg-border" />
        
        {/* Size */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">W:</span>
          <Input
            type="number"
            value={Math.round(primaryElement.width || 400)}
            onChange={(e) => handleUpdate({ width: parseInt(e.target.value) || 400 })}
            className="h-8 w-16 text-xs"
          />
          <span className="text-xs text-muted-foreground">H:</span>
          <Input
            type="number"
            value={Math.round(primaryElement.height || 300)}
            onChange={(e) => handleUpdate({ height: parseInt(e.target.value) || 300 })}
            className="h-8 w-16 text-xs"
          />
        </div>

        <div className="w-px h-5 bg-border" />

        {/* Rotation Control */}
        <div className="flex items-center gap-1">
          <RotateCcw className="h-3 w-3 text-muted-foreground" />
          <Input
            type="number"
            value={Math.round(primaryElement.rotation || 0)}
            onChange={(e) => handleUpdate({ rotation: parseInt(e.target.value) || 0 })}
            className="h-8 w-12 text-xs text-center"
            min="-360"
            max="360"
            step="15"
            title="Rotation (degrees)"
          />
          <span className="text-xs text-muted-foreground">°</span>
        </div>

        <div className="w-px h-5 bg-border" />

        {/* Volume Control */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
              {(primaryElement.volume ?? 1) === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span className="text-xs">{Math.round((primaryElement.volume ?? 1) * 100)}%</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label className="text-xs">Volume</Label>
              <Slider
                value={[(primaryElement.volume ?? 1) * 100]}
                onValueChange={([value]) => handleUpdate({ volume: value / 100 })}
                min={0}
                max={100}
                step={5}
              />
              <div className="flex justify-between">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleUpdate({ volume: 0 })}>
                  Mute
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleUpdate({ volume: 1 })}>
                  100%
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Opacity */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
              <span className="text-xs">Opacity</span>
              <span className="text-xs text-muted-foreground">{Math.round((primaryElement.opacity ?? 1) * 100)}%</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label className="text-xs">Opacity</Label>
              <Slider
                value={[(primaryElement.opacity ?? 1) * 100]}
                onValueChange={([value]) => handleUpdate({ opacity: value / 100 })}
                min={0}
                max={100}
                step={1}
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Border Radius */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
              <RectangleHorizontal className="h-3.5 w-3.5" />
              <span className="text-xs">Radius</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label className="text-xs">Corner Radius</Label>
              <Slider
                value={[primaryElement.borderRadius || 0]}
                onValueChange={([value]) => handleUpdate({ borderRadius: value })}
                min={0}
                max={50}
                step={1}
              />
              <span className="text-xs text-muted-foreground">{primaryElement.borderRadius || 0}px</span>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // ============================================
  // MULTIPLE TYPES SELECTED
  // ============================================
  return (
    <div className="flex items-center gap-2 animate-in fade-in duration-200">
      <span className="text-xs text-muted-foreground">
        {selectedIds.length} elements selected
      </span>
      
      <div className="w-px h-5 bg-border" />
      
      {/* Common opacity control */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
            <Palette className="h-4 w-4" />
            <span className="text-xs">Opacity</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="space-y-2">
            <Label className="text-xs">Opacity (all selected)</Label>
            <Slider
              value={[(primaryElement?.opacity ?? 1) * 100]}
              onValueChange={([value]) => handleUpdate({ opacity: value / 100 })}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ============================================
// IMAGE TOOLBAR COMPONENT (with background removal)
// ============================================
function ImageToolbarContent({ element, onUpdate }: { element: any; onUpdate: (updates: any) => void }) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);
  
  const bgRemoval = useBackgroundRemoval({
    onSuccess: (processedSrc) => {
      updateElement(element.id, { src: processedSrc });
      pushHistory(getStateSnapshot());
    },
  });
  
  const handleRemoveBackground = () => {
    if (element.src) {
      bgRemoval.showModal(element.src);
    }
  };
  
  const handleFlipHorizontal = () => {
    const currentScaleX = element.scaleX ?? 1;
    onUpdate({ scaleX: currentScaleX * -1 });
  };
  
  const handleFlipVertical = () => {
    const currentScaleY = element.scaleY ?? 1;
    onUpdate({ scaleY: currentScaleY * -1 });
  };
  
  const handleRotate = () => {
    const currentRotation = element.rotation ?? 0;
    onUpdate({ rotation: (currentRotation + 90) % 360 });
  };

  return (
    <>
      <div className="flex items-center gap-2 animate-in fade-in duration-200">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
          <span>Image</span>
        </div>
        
        <div className="w-px h-5 bg-border" />
        
        {/* Remove Background - AI Feature */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 gap-1.5 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:text-purple-600"
          onClick={handleRemoveBackground}
          title="Remove Background (AI)"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-xs">Remove BG</span>
        </Button>
        
        <div className="w-px h-5 bg-border" />
        
        {/* Transform Tools */}
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleFlipHorizontal} title="Flip Horizontal">
            <FlipHorizontal className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleFlipVertical} title="Flip Vertical">
            <FlipVertical className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleRotate} title="Rotate 90°">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-5 bg-border" />

        {/* Rotation Control */}
        <div className="flex items-center gap-1">
          <RotateCcw className="h-3 w-3 text-muted-foreground" />
          <Input
            type="number"
            value={Math.round(element.rotation || 0)}
            onChange={(e) => onUpdate({ rotation: parseInt(e.target.value) || 0 })}
            className="h-8 w-12 text-xs text-center"
            min="-360"
            max="360"
            step="15"
            title="Rotation (degrees)"
          />
          <span className="text-xs text-muted-foreground">°</span>
        </div>
        
        <div className="w-px h-5 bg-border" />
        
        {/* Size */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">W:</span>
          <Input
            type="number"
            value={Math.round(element.width || 100)}
            onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 100 })}
            className="h-8 w-14 text-xs"
          />
          <span className="text-xs text-muted-foreground">H:</span>
          <Input
            type="number"
            value={Math.round(element.height || 100)}
            onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 100 })}
            className="h-8 w-14 text-xs"
          />
        </div>
        
        <div className="w-px h-5 bg-border" />
        
        {/* Border Radius */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
              <RectangleHorizontal className="h-3.5 w-3.5" />
              <span className="text-xs">Radius</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label className="text-xs">Corner Radius</Label>
              <Slider
                value={[element.borderRadius || 0]}
                onValueChange={([value]) => onUpdate({ borderRadius: value })}
                min={0}
                max={100}
                step={1}
              />
              <span className="text-xs text-muted-foreground">{element.borderRadius || 0}px</span>
            </div>
          </PopoverContent>
        </Popover>

        {/* Image Adjustments */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="text-xs">Adjust</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs flex items-center gap-1"><Sun className="h-3 w-3" /> Brightness</Label>
                  <span className="text-xs text-muted-foreground">{element.brightness || 100}%</span>
                </div>
                <Slider
                  value={[element.brightness || 100]}
                  onValueChange={([value]) => onUpdate({ brightness: value })}
                  min={0}
                  max={200}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs flex items-center gap-1"><Contrast className="h-3 w-3" /> Contrast</Label>
                  <span className="text-xs text-muted-foreground">{element.contrast || 100}%</span>
                </div>
                <Slider
                  value={[element.contrast || 100]}
                  onValueChange={([value]) => onUpdate({ contrast: value })}
                  min={0}
                  max={200}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs flex items-center gap-1"><Droplets className="h-3 w-3" /> Saturation</Label>
                  <span className="text-xs text-muted-foreground">{element.saturation || 100}%</span>
                </div>
                <Slider
                  value={[element.saturation || 100]}
                  onValueChange={([value]) => onUpdate({ saturation: value })}
                  min={0}
                  max={200}
                  step={5}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => onUpdate({ brightness: 100, contrast: 100, saturation: 100 })}
              >
                Reset Adjustments
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Opacity */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
              <span className="text-xs">Opacity</span>
              <span className="text-xs text-muted-foreground">{Math.round((element.opacity ?? 1) * 100)}%</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label className="text-xs">Opacity</Label>
              <Slider
                value={[(element.opacity ?? 1) * 100]}
                onValueChange={([value]) => onUpdate({ opacity: value / 100 })}
                min={0}
                max={100}
                step={1}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Background Removal Modal */}
      <BackgroundRemovalModal
        open={bgRemoval.isOpen}
        onOpenChange={bgRemoval.closeModal}
        onConfirm={bgRemoval.processImage}
        onSkip={bgRemoval.skipRemoval}
        isProcessing={bgRemoval.isProcessing}
        error={bgRemoval.error}
      />
    </>
  );
}
