'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { FontFamily } from '@tiptap/extension-font-family';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Eraser, Heading, Minus, Highlighter, Smile
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Overline } from './extensions/Overline';
import { Highlight } from './extensions/Highlight';
import { createPortal } from 'react-dom';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import './tiptap-editor.css';

interface TipTapEditorSimpleProps {
  content: string;
  onChange: (html: string) => void;
  onTagChange?: (tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p') => void;
  onAlignmentChange?: (alignment: 'left' | 'center' | 'right' | 'justify') => void;
  onFontFamilyChange?: (fontFamily: string) => void;
  onFontSizeChange?: (fontSize: number) => void;
  onBoldChange?: (bold: boolean) => void;
  onItalicChange?: (italic: boolean) => void;
  onUnderlineChange?: (underline: boolean) => void;
  onStrikethroughChange?: (strikethrough: boolean) => void;
  className?: string;
  placeholder?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  isEditing?: boolean;
  onStartEdit?: () => void;
  onStopEdit?: () => void;
  externalStyles?: React.CSSProperties;
  singleLine?: boolean;
}

// Custom extension to handle Enter key properly for all text elements
// Creates line breaks within the same element instead of splitting into new paragraphs
const EnterHandling = Extension.create({
  name: 'enterHandling',
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { state, view } = this.editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Check if we're in a heading or paragraph
        const isInHeading = this.editor.isActive('heading');
        const isInParagraph = this.editor.isActive('paragraph');
        
        if (isInHeading || isInParagraph) {
          const pos = selection.from;
          const node = $from.parent;
          const nodeStart = $from.start();
          const nodeEnd = $from.end();
          
          // Check if cursor is at the end of the node
          const isAtEnd = pos === nodeEnd;
          
          // Insert hard break
          const hardBreak = state.schema.nodes.hardBreak.create();
          let tr = state.tr.replaceWith(pos, pos, hardBreak);
          
          // If at end, add an extra space or zero-width space after the break
          // This ensures the cursor has somewhere to go
          if (isAtEnd) {
            const textNode = state.schema.text('\u200B'); // Zero-width space
            tr = tr.insert(pos + 1, textNode);
          }
          
          view.dispatch(tr);
          
          return true;
        }
        
        // Return false for other node types
        return false;
      },
    };
  },
});

export const TipTapEditorSimple: React.FC<TipTapEditorSimpleProps> = ({
  content,
  onChange,
  onTagChange,
  onAlignmentChange,
  onBoldChange,
  onItalicChange,
  onUnderlineChange,
  onStrikethroughChange,
  className = '',
  placeholder = 'Double-click to edit...',
  tag = 'p',
  isEditing = false,
  onStartEdit,
  onStopEdit,
  externalStyles = {},
  singleLine = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHeadingPicker, setShowHeadingPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [highlightColor, setHighlightColor] = useState('#FEF08A'); // Default yellow
  
  // Track if content change came from user typing (internal) vs external sync
  const isInternalUpdateRef = useRef(false);
  
  // Track formatting state for button visual feedback
  const [formattingState, setFormattingState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    overline: false,
    highlight: false,
  });
  
  // Highlight color presets (matching settings panel)
  const HIGHLIGHT_COLORS = [
    '#FEF08A', '#FDE047', '#FACC15', '#FBBF24', '#F59E0B',
    '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444',
    '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6',
    '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED',
    '#FCE7F3', '#FBCFE8', '#F9A8D4', '#F472B6', '#EC4899',
    '#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981',
  ];

  // Normalize content to prevent empty paragraph injection
  // This prevents the browser from adding <br> or empty <p> tags on focus
  const normalizeContent = useCallback((html: string) => {
    if (!html || html.trim() === '') {
      // Return a paragraph with zero-width space to prevent browser auto-injection
      return '<p>\u200B</p>';
    }

    let normalized = html;

    // Strip truly empty headings (no visible content)
    normalized = normalized.replace(/<h[1-6][^>]*>\s*<\/h[1-6]>/gi, '');

    // Strip paragraphs that contain only whitespace and/or <br> tags (including <br> with attributes)
    normalized = normalized.replace(/<p[^>]*>(?:\s|<br[^>]*>)*<\/p>/gi, '');

    // If content is just whitespace or empty tags after normalization, add zero-width space
    const stripped = normalized.replace(/<[^>]*>/g, '').trim();
    if (!stripped) {
      return '<p>\u200B</p>';
    }

    return normalized;
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        hardBreak: {}, // Enable hard breaks
        paragraph: {
          HTMLAttributes: {
            class: 'tiptap-paragraph',
          },
        },
      }),
      EnterHandling, // Custom Enter key handling
      Underline,
      Overline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      FontFamily,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-500 underline' },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
    ],
    content: normalizeContent(content),
    editable: isEditing,
    onUpdate: ({ editor }) => {
      let html = editor.getHTML();
      
      // Clean up zero-width spaces before saving (they're only for preventing browser injection)
      html = html.replace(/\u200B/g, '');
      
      // Allow natural text flow - preserve line breaks and paragraphs
      // Remove only truly empty tags (no visible content)
      html = html.replace(/<h[1-6][^>]*>\s*<\/h[1-6]>/gi, '');
      // Also strip paragraphs that contain only whitespace and/or <br> tags (including <br> with attributes)
      html = html.replace(/<p[^>]*>(?:\s|<br[^>]*>)*<\/p>/gi, '');
      
      // Mark this as an internal update (user typing)
      isInternalUpdateRef.current = true;
      onChange(html);
      
      // Check if ANY text in the document has the formatting mark
      const checkMarkInDocument = (markType: string) => {
        let foundMark = false;
        
        editor.state.doc.descendants((node) => {
          if (node.isText && node.text && node.text.trim()) {
            // Check if this text node has the mark
            const hasMark = node.marks.some(mark => mark.type.name === markType);
            if (hasMark) {
              foundMark = true;
            }
          }
        });
        
        return foundMark;
      };
      
      // Extract highlight color from document
      const extractHighlightColor = () => {
        let foundColor = '#FEF08A'; // Default
        
        editor.state.doc.descendants((node) => {
          if (node.isText && node.text && node.text.trim()) {
            const highlightMark = node.marks.find(mark => mark.type.name === 'highlight');
            if (highlightMark && highlightMark.attrs?.color) {
              foundColor = highlightMark.attrs.color;
              return false; // Stop traversing once we find a color
            }
          }
        });
        
        return foundColor;
      };
      
      // Update formatting state - show active if ANY text has the formatting
      const hasHighlight = checkMarkInDocument('highlight');
      const currentHighlightColor = hasHighlight ? extractHighlightColor() : highlightColor;
      
      setFormattingState({
        bold: checkMarkInDocument('bold'),
        italic: checkMarkInDocument('italic'),
        underline: checkMarkInDocument('underline'),
        strike: checkMarkInDocument('strike'),
        overline: checkMarkInDocument('overline'),
        highlight: hasHighlight,
      });
      
      // Sync highlight color from document
      if (hasHighlight && currentHighlightColor !== highlightColor) {
        setHighlightColor(currentHighlightColor);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Check if ANY text in the document has the formatting mark
      const checkMarkInDocument = (markType: string) => {
        let foundMark = false;
        
        editor.state.doc.descendants((node) => {
          if (node.isText && node.text && node.text.trim()) {
            // Check if this text node has the mark
            const hasMark = node.marks.some(mark => mark.type.name === markType);
            if (hasMark) {
              foundMark = true;
            }
          }
        });
        
        return foundMark;
      };
      
      // Extract highlight color from document
      const extractHighlightColor = () => {
        let foundColor = '#FEF08A'; // Default
        
        editor.state.doc.descendants((node) => {
          if (node.isText && node.text && node.text.trim()) {
            const highlightMark = node.marks.find(mark => mark.type.name === 'highlight');
            if (highlightMark && highlightMark.attrs?.color) {
              foundColor = highlightMark.attrs.color;
              return false; // Stop traversing once we find a color
            }
          }
        });
        
        return foundColor;
      };
      
      // Update formatting state - show active if ANY text has the formatting
      const hasHighlight = checkMarkInDocument('highlight');
      const currentHighlightColor = hasHighlight ? extractHighlightColor() : highlightColor;
      
      setFormattingState({
        bold: checkMarkInDocument('bold'),
        italic: checkMarkInDocument('italic'),
        underline: checkMarkInDocument('underline'),
        strike: checkMarkInDocument('strike'),
        overline: checkMarkInDocument('overline'),
        highlight: hasHighlight,
      });
      
      // Sync highlight color from document
      if (hasHighlight && currentHighlightColor !== highlightColor) {
        setHighlightColor(currentHighlightColor);
      }
    },
    editorProps: {
      attributes: {
        class: cn('focus:outline-none', className),
        style: '', // Allow natural text wrapping
      },
    },
  });

  // Update toolbar position when editing starts or element moves
  const updateToolbarPosition = useCallback(() => {
    if (!containerRef.current || !isEditing) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setToolbarPosition({
      top: Math.max(10, rect.top - 60), // 60px above element
      left: rect.left + rect.width / 2,
    });
  }, [isEditing]);

  // Update editable state when isEditing changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
      if (isEditing) {
        // Restore cursor position from double-click
        setTimeout(() => {
          if (clickPositionRef.current && editor.view) {
            const { x, y } = clickPositionRef.current;
            
            // Get the position in the document from the click coordinates
            const pos = editor.view.posAtCoords({ left: x, top: y });
            
            if (pos && pos.pos >= 0) {
              // Set cursor at the clicked position
              editor.commands.setTextSelection(pos.pos);
            }
            
            // Clear the stored position
            clickPositionRef.current = null;
          }
          
          // Focus the editor
          editor.commands.focus();
          updateToolbarPosition();
        }, 10);
      }
    }
  }, [isEditing, editor, updateToolbarPosition]);

  // Update toolbar position on scroll/resize
  useEffect(() => {
    if (!isEditing) return;
    
    updateToolbarPosition();
    
    window.addEventListener('scroll', updateToolbarPosition, true);
    window.addEventListener('resize', updateToolbarPosition);
    
    return () => {
      window.removeEventListener('scroll', updateToolbarPosition, true);
      window.removeEventListener('resize', updateToolbarPosition);
    };
  }, [isEditing, updateToolbarPosition]);

  // Update content when prop changes - sync from external sources (settings panel, etc.)
  useEffect(() => {
    if (!editor || !content) return;
    
    // If this update came from user typing (internal), skip sync to preserve cursor
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false; // Reset flag
      return;
    }
    
    const currentContent = editor.getHTML();
    
    // Normalize HTML for comparison (TipTap might format differently)
    // Also remove zero-width spaces for comparison
    const normalize = (html: string) => html.trim().replace(/\s+/g, ' ').replace(/\u200B/g, '');
    
    // Only sync if content actually changed (external change)
    if (normalize(content) !== normalize(currentContent)) {
      // Save cursor position before syncing
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;
      const savedFrom = from;
      const savedTo = to;
      
      // Use emitUpdate: false to prevent triggering onChange and creating a loop
      // Also normalize the content to prevent empty paragraph injection
      editor.commands.setContent(normalizeContent(content), { emitUpdate: false });
      
      // Restore cursor position after syncing (don't always move to end!)
      if (isEditing) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!editor.isDestroyed) {
              try {
                // Try to restore the exact selection position
                if (hasSelection && savedFrom >= 0 && savedTo >= 0) {
                  // Adjust positions if content length changed
                  const newDocSize = editor.state.doc.content.size;
                  const adjustedFrom = Math.min(savedFrom, newDocSize - 1);
                  const adjustedTo = Math.min(savedTo, newDocSize);
                  editor.commands.setTextSelection({ from: adjustedFrom, to: adjustedTo });
                } else {
                  // No selection, try to restore cursor at approximate position
                  const newDocSize = editor.state.doc.content.size;
                  const adjustedPos = Math.min(savedFrom, newDocSize - 1);
                  editor.commands.setTextSelection({ from: adjustedPos, to: adjustedPos });
                }
                editor.commands.focus();
              } catch (e) {
                // If restoration fails, at least keep focus
                editor.commands.focus();
              }
            }
          });
        });
      }
    }
  }, [content, editor, isEditing]);

  // Handle click outside to stop editing
  useEffect(() => {
    if (!isEditing) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't stop editing if clicking on toolbar or editor
      if (
        target.closest('.inline-text-toolbar') ||
        target.closest('.ProseMirror') ||
        target.closest('[data-toolbar-popup]') ||
        target.closest('#dynamic-element-toolbar-container') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('.popover-content') ||
        target.closest('[data-radix-portal]') ||
        containerRef.current?.contains(target)
      ) {
        return;
      }
      onStopEdit?.();
    };
    
    // Use setTimeout to avoid closing immediately
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, onStopEdit]);

  // Store click position for restoring after edit mode starts
  const clickPositionRef = useRef<{ x: number; y: number } | null>(null);

  // Handle double-click to start editing
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing && onStartEdit) {
      // Store the click position to restore cursor after editor becomes editable
      clickPositionRef.current = { x: e.clientX, y: e.clientY };
      onStartEdit();
    }
  }, [isEditing, onStartEdit]);

  // Handle heading change
  const handleHeadingChange = useCallback((level: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (!editor) return;
    editor.chain().focus().setHeading({ level }).run();
    setShowHeadingPicker(false);
    onTagChange?.(`h${level}` as any);
  }, [editor, onTagChange]);

  // Clear formatting
  const clearFormatting = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetAllMarks().run();
  }, [editor]);

  // Handle emoji insertion
  const onEmojiClick = useCallback((emojiData: EmojiClickData) => {
    if (editor) {
      editor.chain().focus().insertContent(emojiData.emoji).run();
      setShowEmojiPicker(false);
    }
  }, [editor]);

  // Memoized toolbar button component
  const ToolbarButton = useMemo(() => {
    return ({
      onClick,
      active,
      title,
      children,
    }: {
      onClick: () => void;
      active?: boolean;
      title: string;
      children: React.ReactNode;
    }) => (
      <button
        className={cn(
          'h-8 w-8 p-0 flex items-center justify-center rounded transition-colors',
          active ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/80'
        )}
        onMouseDown={(e) => {
          e.preventDefault(); // CRITICAL: Prevent focus loss from editor
          e.stopPropagation();
          onClick();
        }}
        title={title}
      >
        {children}
      </button>
    );
  }, []);

  if (!editor) return null;

  // Render toolbar
  const toolbar = isEditing && typeof document !== 'undefined' ? createPortal(
    <div
      className="inline-text-toolbar fixed flex items-center gap-1 bg-gray-900 text-white border border-gray-700 rounded-lg shadow-2xl px-2 py-1.5 z-[999999]"
      style={{
        top: `${toolbarPosition.top}px`,
        left: `${toolbarPosition.left}px`,
        transform: 'translateX(-50%)',
        pointerEvents: 'auto',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Heading Picker */}
      <div className="relative">
        <button
          className="h-8 px-2 text-xs flex items-center hover:bg-white/10 rounded"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowHeadingPicker(!showHeadingPicker);
          }}
          title="Heading Level"
        >
          <Heading size={14} className="mr-1" />
          {tag.toUpperCase()}
        </button>
        {showHeadingPicker && (
          <div
            className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-1 z-[10000]"
            data-toolbar-popup
            onMouseDown={(e) => e.stopPropagation()}
          >
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleHeadingChange(level as 1 | 2 | 3 | 4 | 5 | 6);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-gray-700 rounded text-sm text-white"
              >
                H{level}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-gray-600" />

      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => {
          const { from, to } = editor.state.selection;
          const hasSelection = from !== to;
          
          if (from === to) {
            // Apply to all text without selecting (preserves node types like headings)
            const newBoldState = !formattingState.bold;
            const tr = editor.state.tr;
            tr.doc.descendants((node, pos) => {
              if (node.isText) {
                if (newBoldState) {
                  tr.addMark(pos, pos + node.nodeSize, editor.schema.marks.bold.create());
                } else {
                  tr.removeMark(pos, pos + node.nodeSize, editor.schema.marks.bold);
                }
              }
            });
            editor.view.dispatch(tr);
            // Update state immediately for visual feedback
            setFormattingState(prev => ({ ...prev, bold: newBoldState }));
            // Force editor to update and check cursor position to refresh button states
            requestAnimationFrame(() => {
              editor.commands.focus();
            });
            onBoldChange?.(newBoldState);
          } else {
            // Save selection before applying formatting
            const savedFrom = from;
            const savedTo = to;
            
            // Apply formatting
            editor.chain().focus().toggleBold().run();
            
            // Restore selection after formatting
            if (hasSelection) {
              requestAnimationFrame(() => {
                editor.commands.setTextSelection({ from: savedFrom, to: savedTo });
                editor.commands.focus();
              });
            }
            
            onBoldChange?.(!editor.isActive('bold'));
          }
        }}
        active={formattingState.bold}
        title="Bold (Ctrl+B)"
      >
        <Bold size={14} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          const { from, to } = editor.state.selection;
          const hasSelection = from !== to;
          
          if (from === to) {
            // Apply to all text without selecting (preserves node types like headings)
            const newItalicState = !formattingState.italic;
            const tr = editor.state.tr;
            tr.doc.descendants((node, pos) => {
              if (node.isText) {
                if (newItalicState) {
                  tr.addMark(pos, pos + node.nodeSize, editor.schema.marks.italic.create());
                } else {
                  tr.removeMark(pos, pos + node.nodeSize, editor.schema.marks.italic);
                }
              }
            });
            editor.view.dispatch(tr);
            // Update state immediately for visual feedback
            setFormattingState(prev => ({ ...prev, italic: newItalicState }));
            // Force editor to update and check cursor position to refresh button states
            requestAnimationFrame(() => {
              editor.commands.focus();
            });
            onItalicChange?.(newItalicState);
          } else {
            // Save selection before applying formatting
            const savedFrom = from;
            const savedTo = to;
            
            // Apply formatting
            editor.chain().focus().toggleItalic().run();
            
            // Restore selection after formatting
            if (hasSelection) {
              requestAnimationFrame(() => {
                editor.commands.setTextSelection({ from: savedFrom, to: savedTo });
                editor.commands.focus();
              });
            }
            
            onItalicChange?.(!editor.isActive('italic'));
          }
        }}
        active={formattingState.italic}
        title="Italic (Ctrl+I)"
      >
        <Italic size={14} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          const { from, to } = editor.state.selection;
          const hasSelection = from !== to;
          
          if (from === to) {
            // Apply to all text without selecting (preserves node types like headings)
            const newUnderlineState = !formattingState.underline;
            const tr = editor.state.tr;
            tr.doc.descendants((node, pos) => {
              if (node.isText) {
                if (newUnderlineState) {
                  tr.addMark(pos, pos + node.nodeSize, editor.schema.marks.underline.create());
                } else {
                  tr.removeMark(pos, pos + node.nodeSize, editor.schema.marks.underline);
                }
              }
            });
            editor.view.dispatch(tr);
            // Update state immediately for visual feedback
            setFormattingState(prev => ({ ...prev, underline: newUnderlineState }));
            // Force editor to update and check cursor position to refresh button states
            requestAnimationFrame(() => {
              editor.commands.focus();
            });
            onUnderlineChange?.(newUnderlineState);
          } else {
            // Save selection before applying formatting
            const savedFrom = from;
            const savedTo = to;
            
            // Apply formatting
            editor.chain().focus().toggleUnderline().run();
            
            // Restore selection after formatting
            if (hasSelection) {
              requestAnimationFrame(() => {
                editor.commands.setTextSelection({ from: savedFrom, to: savedTo });
                editor.commands.focus();
              });
            }
            
            onUnderlineChange?.(!editor.isActive('underline'));
          }
        }}
        active={formattingState.underline}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon size={14} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          const { from, to } = editor.state.selection;
          const hasSelection = from !== to;
          
          if (from === to) {
            // Apply to all text without selecting (preserves node types like headings)
            const newStrikeState = !formattingState.strike;
            const tr = editor.state.tr;
            tr.doc.descendants((node, pos) => {
              if (node.isText) {
                if (newStrikeState) {
                  tr.addMark(pos, pos + node.nodeSize, editor.schema.marks.strike.create());
                } else {
                  tr.removeMark(pos, pos + node.nodeSize, editor.schema.marks.strike);
                }
              }
            });
            editor.view.dispatch(tr);
            // Update state immediately for visual feedback
            setFormattingState(prev => ({ ...prev, strike: newStrikeState }));
            // Force editor to update and check cursor position to refresh button states
            requestAnimationFrame(() => {
              editor.commands.focus();
            });
            onStrikethroughChange?.(newStrikeState);
          } else {
            // Save selection before applying formatting
            const savedFrom = from;
            const savedTo = to;
            
            // Apply formatting
            editor.chain().focus().toggleStrike().run();
            
            // Restore selection after formatting
            if (hasSelection) {
              requestAnimationFrame(() => {
                editor.commands.setTextSelection({ from: savedFrom, to: savedTo });
                editor.commands.focus();
              });
            }
            
            onStrikethroughChange?.(!editor.isActive('strike'));
          }
        }}
        active={formattingState.strike}
        title="Strikethrough"
      >
        <Strikethrough size={14} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          const { from, to } = editor.state.selection;
          const hasSelection = from !== to;
          
          if (from === to) {
            // Apply to all text without selecting (preserves node types like headings)
            const newOverlineState = !formattingState.overline;
            const tr = editor.state.tr;
            tr.doc.descendants((node, pos) => {
              if (node.isText) {
                if (newOverlineState) {
                  tr.addMark(pos, pos + node.nodeSize, editor.schema.marks.overline.create());
                } else {
                  tr.removeMark(pos, pos + node.nodeSize, editor.schema.marks.overline);
                }
              }
            });
            editor.view.dispatch(tr);
            // Update state immediately for visual feedback
            setFormattingState(prev => ({ ...prev, overline: newOverlineState }));
            // Force editor to update and check cursor position to refresh button states
            requestAnimationFrame(() => {
              editor.commands.focus();
            });
          } else {
            // Save selection before applying formatting
            const savedFrom = from;
            const savedTo = to;
            
            // Apply formatting
            editor.chain().focus().toggleOverline().run();
            
            // Restore selection after formatting
            if (hasSelection) {
              requestAnimationFrame(() => {
                editor.commands.setTextSelection({ from: savedFrom, to: savedTo });
                editor.commands.focus();
              });
            }
          }
        }}
        active={formattingState.overline}
        title="Overline"
      >
        <Minus size={14} />
      </ToolbarButton>

      {/* Highlighter with color picker */}
      <Popover open={showHighlightPicker} onOpenChange={setShowHighlightPicker}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'h-8 w-8 p-0 flex items-center justify-center rounded transition-colors relative',
              formattingState.highlight ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/80'
            )}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            title="Highlight"
          >
            <Highlighter size={14} />
            {/* Color indicator bar */}
            {formattingState.highlight && (
              <div
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b"
                style={{ backgroundColor: highlightColor }}
              />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-3 bg-gray-900 border-gray-700" 
          onOpenAutoFocus={(e) => e.preventDefault()}
          onMouseDown={(e) => e.stopPropagation()}
          data-toolbar-popup
        >
          <div className="space-y-2">
            <div className="text-xs text-white mb-2">Highlight Color</div>
            <div className="grid grid-cols-5 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setHighlightColor(color);
                    
                    const { from, to } = editor.state.selection;
                    if (from === to) {
                      // Apply to all text
                      const tr = editor.state.tr;
                      tr.doc.descendants((node, pos) => {
                        if (node.isText) {
                          tr.addMark(pos, pos + node.nodeSize, editor.schema.marks.highlight.create({ color }));
                        }
                      });
                      editor.view.dispatch(tr);
                      setFormattingState(prev => ({ ...prev, highlight: true }));
                    } else {
                      editor.chain().focus().setHighlight({ color }).run();
                    }
                    setShowHighlightPicker(false);
                  }}
                  className="w-8 h-8 rounded border-2 border-gray-600 hover:border-white transition-colors"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const { from, to } = editor.state.selection;
                if (from === to) {
                  // Remove from all text
                  const tr = editor.state.tr;
                  tr.doc.descendants((node, pos) => {
                    if (node.isText) {
                      tr.removeMark(pos, pos + node.nodeSize, editor.schema.marks.highlight);
                    }
                  });
                  editor.view.dispatch(tr);
                  setFormattingState(prev => ({ ...prev, highlight: false }));
                } else {
                  editor.chain().focus().unsetHighlight().run();
                }
                setShowHighlightPicker(false);
              }}
              className="w-full py-2 text-sm text-white border border-gray-600 rounded hover:bg-white/10"
            >
              Remove Highlight
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Emoji Picker - Compact */}
      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <button
            className="h-8 w-8 p-0 flex items-center justify-center rounded transition-colors hover:bg-white/10 text-white/80"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            title="Insert Emoji"
          >
            <Smile size={14} />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 border-0 bg-transparent" 
          onOpenAutoFocus={(e) => e.preventDefault()}
          onMouseDown={(e) => e.stopPropagation()}
          data-toolbar-popup
        >
          <EmojiPicker 
            onEmojiClick={onEmojiClick} 
            width={300} 
            height={350}
            searchDisabled={false}
            skinTonesDisabled={true}
            previewConfig={{ showPreview: false }}
          />
        </PopoverContent>
      </Popover>

      <div className="w-px h-5 bg-gray-600" />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => {
          editor.chain().focus().setTextAlign('left').run();
          onAlignmentChange?.('left');
        }}
        active={editor.isActive({ textAlign: 'left' })}
        title="Align Left"
      >
        <AlignLeft size={14} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          editor.chain().focus().setTextAlign('center').run();
          onAlignmentChange?.('center');
        }}
        active={editor.isActive({ textAlign: 'center' })}
        title="Align Center"
      >
        <AlignCenter size={14} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          editor.chain().focus().setTextAlign('right').run();
          onAlignmentChange?.('right');
        }}
        active={editor.isActive({ textAlign: 'right' })}
        title="Align Right"
      >
        <AlignRight size={14} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          editor.chain().focus().setTextAlign('justify').run();
          onAlignmentChange?.('justify');
        }}
        active={editor.isActive({ textAlign: 'justify' })}
        title="Justify"
      >
        <AlignJustify size={14} />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-600" />

      {/* Clear Formatting */}
      <ToolbarButton onClick={clearFormatting} title="Clear Formatting">
        <Eraser size={14} />
      </ToolbarButton>
    </div>,
    document.body
  ) : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onDoubleClick={handleDoubleClick}
    >
      {toolbar}

      {/* Editor Content */}
      <div
        className="w-full break-words"
        style={{
          ...externalStyles,
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          whiteSpace: 'normal', // Allow natural text wrapping and line breaks
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          cursor: isEditing ? 'text' : 'pointer',
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
