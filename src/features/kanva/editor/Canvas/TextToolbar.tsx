'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useEditorStore } from "../../lib/editor/store";
import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, 
  AlignJustify, Type, Minus, Plus, ChevronDown, Maximize2
} from "lucide-react";
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
 * TextToolbar - Comprehensive text editing toolbar
 * Shows when a text element is selected
 * Provides: Font family, size, weight, style, alignment, color, spacing, etc.
 */
export function TextToolbar() {
  const [showFontSelector, setShowFontSelector] = useState(false);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const elements = useEditorStore((s) => s.elements);
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);
  // Ensure elements is always an array
  const elementsArray = Array.isArray(elements) ? elements : [];
  const selectedElements = elementsArray.filter(el => selectedIds.includes(el.id));
  
  // Check if any selected element is text OR if any text element is being edited
  let selectedText = selectedElements.find(el => el.type === 'text');
  
  // If no selected text, check if any text element is being edited (has active TipTap editor)
  if (!selectedText) {
    selectedText = elementsArray.find(el => {
      if (el.type !== 'text') return false;
      const editor = getEditor(el.id);
      return editor !== undefined;
    }) as any;
  }

  if (!selectedText) return null;

  const textElement = selectedText as any; // Type assertion for text properties
  
  // Get TipTap editor instance if available (when text is being edited)
  const editor = getEditor(selectedText.id);

  const handleUpdate = (updates: any) => {
    updateElement(selectedText.id, updates);
    pushHistory(getStateSnapshot());
  };

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
    triggerEditMode(selectedText.id);

    // Wait for editor to be available (poll with timeout)
    let attempts = 0;
    const maxAttempts = 30; // 300ms max wait (increased for reliability)
    const checkEditor = setInterval(() => {
      attempts++;
      const newEditor = getEditor(selectedText.id);
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

  // Get the dynamic toolbar container
  const toolbarContainer = typeof document !== 'undefined' 
    ? document.getElementById('dynamic-element-toolbar-container')
    : null;

  if (!toolbarContainer) return null;

  const toolbarContent = (
    <div 
      id="text-toolbar-content"
      className="flex items-center gap-2 animate-in fade-in duration-200 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-2 py-1.5 pointer-events-auto inline-text-toolbar"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
        
        {/* Font Family with Weight Variants + Expand */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Popover open={showFontSelector} onOpenChange={setShowFontSelector}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 w-28 justify-between text-xs font-normal"
                style={{ fontFamily: textElement.fontFamily || 'Inter' }}
                onMouseDown={(e) => {
                  e.preventDefault(); // CRITICAL: Prevent focus loss
                  e.stopPropagation();
                }}
              >
                <span className="truncate">{textElement.fontFamily || 'Inter'}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
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
          
          {/* Expand to content panel */}
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault(); // CRITICAL: Prevent focus loss
              e.stopPropagation();
              setShowFontSelector(false); // Close dropdown if open
              window.dispatchEvent(new CustomEvent('openSidebarTab', { detail: 'fonts' }));
            }}
            className="h-9 w-7 p-0"
            title="Expand font panel"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

        {/* Font Size */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault(); // CRITICAL: Prevent focus loss
              e.stopPropagation();
              handleFontSizeChange(-2);
            }}
            className="h-9 w-7 p-0"
            title="Decrease font size"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
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
            className="h-9 w-14 text-xs text-center"
            min="8"
            max="200"
          />
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault(); // CRITICAL: Prevent focus loss
              e.stopPropagation();
              handleFontSizeChange(2);
            }}
            className="h-9 w-7 p-0"
            title="Increase font size"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

        {/* Text Style */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={toggleBold}
            className={cn(
              "h-9 w-9 p-0",
              isBold && "bg-accent text-accent-foreground"
            )}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={toggleItalic}
            className={cn(
              "h-9 w-9 p-0",
              isItalic && "bg-accent text-accent-foreground"
            )}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleUnderline(e);
            }}
            className={cn(
              "h-9 w-9 p-0",
              isUnderlined && "bg-accent text-accent-foreground"
            )}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleStrikethrough(e);
            }}
            className={cn(
              "h-9 w-9 p-0",
              isStrikethrough && "bg-accent text-accent-foreground"
            )}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleOverline(e);
            }}
            className={cn(
              "h-9 w-9 p-0",
              isOverlined && "bg-accent text-accent-foreground"
            )}
            title="Overline"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

        {/* Text Alignment */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => setAlignment('left', e)}
            className={cn(
              "h-9 w-9 p-0",
              textElement.align === 'left' && "bg-accent text-accent-foreground"
            )}
            title="Align left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => setAlignment('center', e)}
            className={cn(
              "h-9 w-9 p-0",
              textElement.align === 'center' && "bg-accent text-accent-foreground"
            )}
            title="Align center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => setAlignment('right', e)}
            className={cn(
              "h-9 w-9 p-0",
              textElement.align === 'right' && "bg-accent text-accent-foreground"
            )}
            title="Align right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => setAlignment('justify', e)}
            className={cn(
              "h-9 w-9 p-0",
              textElement.align === 'justify' && "bg-accent text-accent-foreground"
            )}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              title="Text color"
              onMouseDown={(e) => {
                e.preventDefault(); // CRITICAL: Prevent focus loss
                e.stopPropagation();
              }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <Type className="h-4 w-4" />
                <div 
                  className="w-4 h-1 rounded-full"
                  style={{ backgroundColor: textElement.fill || '#000000' }}
                />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Text Color</Label>
              <Input
                type="color"
                value={textElement.fill || '#000000'}
                onChange={(e) => {
                  e.stopPropagation();
                  handleUpdate({ fill: e.target.value });
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="h-10 w-full"
              />
              <div className="grid grid-cols-8 gap-2">
                {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
                  '#800000', '#808080', '#800080', '#008000', '#000080', '#808000', '#008080', '#C0C0C0'].map(color => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border-2 border-gray-300 hover:border-primary transition-colors"
                    style={{ backgroundColor: color }}
                    onMouseDown={(e) => {
                      e.preventDefault(); // CRITICAL: Prevent focus loss
                      e.stopPropagation();
                      handleUpdate({ fill: color });
                    }}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Advanced Options */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-2 gap-1"
              title="More options"
              onMouseDown={(e) => {
                e.preventDefault(); // CRITICAL: Prevent focus loss
                e.stopPropagation();
              }}
            >
              <span className="text-xs">More</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            <div className="space-y-4">
              {/* Line Height */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Line Height</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[textElement.lineHeight || 1.2]}
                    onValueChange={([value]) => handleUpdate({ lineHeight: value })}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8">
                    {(textElement.lineHeight || 1.2).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Letter Spacing */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Letter Spacing</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[textElement.letterSpacing || 0]}
                    onValueChange={([value]) => handleUpdate({ letterSpacing: value })}
                    min={-5}
                    max={20}
                    step={0.5}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8">
                    {(textElement.letterSpacing || 0).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Opacity */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Opacity</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[(textElement.opacity ?? 1) * 100]}
                    onValueChange={([value]) => handleUpdate({ opacity: value / 100 })}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8">
                    {Math.round((textElement.opacity ?? 1) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
    </div>
  );

  return createPortal(toolbarContent, toolbarContainer);
}
