'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { FontFamily } from '@tiptap/extension-font-family';
import { Overline } from '../../extensions/Overline';
import { Highlight } from '../../extensions/Highlight';
import { FONTS, FONT_CATEGORIES, type FontCategory, searchFonts, getFontsByCategory } from '@/src/lib/fonts';
import { Slider } from '@/components/ui/slider';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link2, Unlink, Undo, Redo, Smile, Type, Palette,
  RemoveFormatting, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Code, Quote,
  Image as ImageIcon, Table as TableIcon, Plus, Save, Check, X,
  Maximize2, Minimize2, Minus, Search, Filter, Highlighter
} from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  label?: string;
  showSaveButton?: boolean;
  onSave?: () => void;
  minHeight?: string;
  autoSave?: boolean;
  autoSaveDelay?: number; // milliseconds
  onAutoSave?: (content: string) => void;
  // Bidirectional sync props
  externalAlignment?: 'left' | 'center' | 'right' | 'justify';
  externalFontFamily?: string;
  externalFontSize?: number;
  externalTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  externalBold?: boolean;
  externalItalic?: boolean;
  externalUnderline?: boolean;
  externalStrikethrough?: boolean;
  onAlignmentChange?: (alignment: 'left' | 'center' | 'right' | 'justify') => void;
  onFontFamilyChange?: (fontFamily: string) => void;
  onFontSizeChange?: (fontSize: number) => void;
  onTagChange?: (tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p') => void;
  onBoldChange?: (bold: boolean) => void;
  onItalicChange?: (italic: boolean) => void;
  onUnderlineChange?: (underline: boolean) => void;
  onStrikethroughChange?: (strikethrough: boolean) => void;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start typing...',
  label = 'Content',
  showSaveButton = false,
  onSave,
  minHeight = '200px',
  autoSave = true,
  autoSaveDelay = 2000,
  onAutoSave,
  externalAlignment,
  externalFontFamily,
  externalFontSize,
  externalTag,
  externalBold,
  externalItalic,
  externalUnderline,
  externalStrikethrough,
  onAlignmentChange,
  onFontFamilyChange,
  onFontSizeChange,
  onTagChange,
  onBoldChange,
  onItalicChange,
  onUnderlineChange,
  onStrikethroughChange,
}: RichTextEditorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [highlightColor, setHighlightColor] = useState('#FEF08A'); // Default yellow
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);
  const [customTagName, setCustomTagName] = useState('');
  const [fontSize, setFontSize] = useState('16');
  const [currentFontSize, setCurrentFontSize] = useState(16);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showFontSizeSlider, setShowFontSizeSlider] = useState(false);
  const [fontSearchQuery, setFontSearchQuery] = useState('');
  const [fontCategory, setFontCategory] = useState<FontCategory>('All');
  const [currentFontFamily, setCurrentFontFamily] = useState<string>('');
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedPosition, setExpandedPosition] = useState({ x: 0, y: 0 });
  const [expandedSize, setExpandedSize] = useState({ width: 800, height: 600 });
  
  // Real-time toolbar state tracking for instant updates
  const [toolbarState, setToolbarState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    overline: false,
    alignment: 'center' as 'left' | 'center' | 'right' | 'justify',
    heading: null as number | null,
    fontFamily: '',
    fontSize: 16,
    link: false,
    highlight: false,
    blockquote: false,
    codeBlock: false,
    bulletList: false,
    orderedList: false,
  });

  // Initialize expanded position to center of screen
  useEffect(() => {
    if (isExpanded && expandedPosition.x === 0 && expandedPosition.y === 0) {
      const centerX = (window.innerWidth - expandedSize.width) / 2;
      const centerY = (window.innerHeight - expandedSize.height) / 2;
      setExpandedPosition({ x: centerX, y: centerY });
    }
  }, [isExpanded, expandedSize]);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const expandedRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use refs to store latest external values for onUpdate callback
  const externalAlignmentRef = useRef(externalAlignment);
  const externalFontFamilyRef = useRef(externalFontFamily);
  const externalFontSizeRef = useRef(externalFontSize);
  const externalTagRef = useRef(externalTag);
  const externalBoldRef = useRef(externalBold);
  const externalItalicRef = useRef(externalItalic);
  const externalUnderlineRef = useRef(externalUnderline);
  const externalStrikethroughRef = useRef(externalStrikethrough);
  
  // Update refs when props change
  useEffect(() => {
    externalAlignmentRef.current = externalAlignment;
    externalFontFamilyRef.current = externalFontFamily;
    externalFontSizeRef.current = externalFontSize;
    externalTagRef.current = externalTag;
    externalBoldRef.current = externalBold;
    externalItalicRef.current = externalItalic;
    externalUnderlineRef.current = externalUnderline;
    externalStrikethroughRef.current = externalStrikethrough;
  }, [externalAlignment, externalFontFamily, externalFontSize, externalTag, externalBold, externalItalic, externalUnderline, externalStrikethrough]);

  // Memoize external values for useEffects
  const memoizedExternalAlignment = React.useMemo(() => externalAlignment, [externalAlignment]);
  const memoizedExternalFontFamily = React.useMemo(() => externalFontFamily, [externalFontFamily]);
  const memoizedExternalFontSize = React.useMemo(() => externalFontSize, [externalFontSize]);
  const memoizedExternalTag = React.useMemo(() => externalTag, [externalTag]);
  const memoizedExternalBold = React.useMemo(() => externalBold, [externalBold]);
  const memoizedExternalItalic = React.useMemo(() => externalItalic, [externalItalic]);
  const memoizedExternalUnderline = React.useMemo(() => externalUnderline, [externalUnderline]);
  const memoizedExternalStrikethrough = React.useMemo(() => externalStrikethrough, [externalStrikethrough]);

  // Function to update toolbar state from editor - called on every change
  // Must be defined after memoized values
  const updateToolbarState = useCallback((editorInstance: any) => {
    if (!editorInstance) return;
    
    // Check if ANY text in the document has the formatting mark
    const checkMarkInDocument = (markType: string) => {
      let foundMark = false;
      editorInstance.state.doc.descendants((node: any) => {
        if (node.isText && node.text && node.text.trim()) {
          const hasMark = node.marks.some((mark: any) => mark.type.name === markType);
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
      editorInstance.state.doc.descendants((node: any) => {
        if (node.isText && node.text && node.text.trim()) {
          const highlightMark = node.marks.find((mark: any) => mark.type.name === 'highlight');
          if (highlightMark && highlightMark.attrs?.color) {
            foundColor = highlightMark.attrs.color;
            return false; // Stop traversing once we find a color
          }
        }
      });
      return foundColor;
    };
    
    const hasHighlight = checkMarkInDocument('highlight');
    const currentHighlightColor = hasHighlight ? extractHighlightColor() : highlightColor;
    
    setToolbarState({
      bold: checkMarkInDocument('bold'),
      italic: checkMarkInDocument('italic'),
      underline: checkMarkInDocument('underline'),
      strike: checkMarkInDocument('strike'),
      overline: checkMarkInDocument('overline'),
      alignment: (editorInstance.getAttributes('textAlign').textAlign || memoizedExternalAlignment || 'center') as 'left' | 'center' | 'right' | 'justify',
      heading: editorInstance.getAttributes('heading').level || null,
      fontFamily: editorInstance.getAttributes('textStyle').fontFamily || memoizedExternalFontFamily || '',
      fontSize: (() => {
        const sizeAttr = editorInstance.getAttributes('textStyle').fontSize;
        if (sizeAttr) {
          const num = parseInt(sizeAttr.replace('px', ''));
          return isNaN(num) ? (memoizedExternalFontSize || 16) : num;
        }
        return memoizedExternalFontSize || 16;
      })(),
      link: editorInstance.isActive('link'),
      highlight: hasHighlight,
      blockquote: editorInstance.isActive('blockquote'),
      codeBlock: editorInstance.isActive('codeBlock'),
      bulletList: editorInstance.isActive('bulletList'),
      orderedList: editorInstance.isActive('orderedList'),
    });
    
    // Sync highlight color from document
    if (hasHighlight && currentHighlightColor !== highlightColor) {
      setHighlightColor(currentHighlightColor);
    }
  }, [memoizedExternalAlignment, memoizedExternalFontFamily, memoizedExternalFontSize, highlightColor]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Overline,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontFamily,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      
      // Mark this as an internal update (user typing)
      isInternalUpdateRef.current = true;
      onChange(html);
      
      // Sync formatting changes back to parent (to update canvas TipTapEditor)
      // Use refs to get latest values
      // Default to 'center' instead of 'left' to match our new default
      const currentAlignment = editor.getAttributes('textAlign').textAlign || externalAlignmentRef.current || 'center';
      if (onAlignmentChange && currentAlignment !== externalAlignmentRef.current) {
        onAlignmentChange(currentAlignment as 'left' | 'center' | 'right' | 'justify');
      }
      
      // Sync heading level - only if actually changed
      // IMPORTANT: Don't change tag when in a list - lists preserve their content type
      const isInList = editor.isActive('bulletList') || editor.isActive('orderedList');
      
      if (!isInList) {
        // Check what the actual document contains (not just what isActive reports)
        let actualNodeType: string | null = null;
        let actualHeadingLevel: number | null = null;
        
        editor.state.doc.descendants((node: any) => {
          if (node.type.name === 'heading') {
            actualNodeType = 'heading';
            actualHeadingLevel = node.attrs.level;
            return false; // Stop traversing
          } else if (node.type.name === 'paragraph') {
            actualNodeType = 'paragraph';
            return false; // Stop traversing
          }
        });
        
        if (actualNodeType === 'heading' && actualHeadingLevel) {
          const currentTag = `h${actualHeadingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
          if (onTagChange && currentTag !== externalTagRef.current) {
            onTagChange(currentTag);
          }
        } else if (actualNodeType === 'paragraph') {
          // IMPORTANT: If we have an external heading tag (h1-h6), don't let it revert to paragraph
          // This happens when user deletes all text - TipTap converts empty heading to paragraph
          // We need to re-apply the heading level to preserve the element type
          const externalTag = externalTagRef.current;
          if (externalTag && externalTag.startsWith('h')) {
            const level = parseInt(externalTag.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6;
            // Re-apply heading level to prevent paragraph conversion
            requestAnimationFrame(() => {
              if (!editor.isDestroyed) {
                editor.commands.setHeading({ level });
              }
            });
          } else if (onTagChange && externalTagRef.current !== 'p') {
            onTagChange('p');
          }
        }
      }
      
      // Sync font family (to update canvas TipTapEditor)
      const currentFontFamily = editor.getAttributes('textStyle').fontFamily;
      if (onFontFamilyChange && currentFontFamily && currentFontFamily !== externalFontFamilyRef.current) {
        onFontFamilyChange(currentFontFamily);
      }
      
      // Sync font size (to update canvas TipTapEditor)
      const currentFontSizeAttr = editor.getAttributes('textStyle').fontSize;
      if (currentFontSizeAttr) {
        const fontSizeNum = parseInt(currentFontSizeAttr.replace('px', ''));
        if (!isNaN(fontSizeNum) && fontSizeNum !== externalFontSizeRef.current) {
          setCurrentFontSize(fontSizeNum);
          if (onFontSizeChange) {
            onFontSizeChange(fontSizeNum);
          }
        }
      }
      
      // Sync text decorations (to update canvas TipTapEditor)
      const currentBold = editor.isActive('bold');
      if (onBoldChange && currentBold !== externalBoldRef.current) {
        onBoldChange(currentBold);
      }
      
      const currentItalic = editor.isActive('italic');
      if (onItalicChange && currentItalic !== externalItalicRef.current) {
        onItalicChange(currentItalic);
      }
      
      const currentUnderline = editor.isActive('underline');
      if (onUnderlineChange && currentUnderline !== externalUnderlineRef.current) {
        onUnderlineChange(currentUnderline);
      }
      
      const currentStrikethrough = editor.isActive('strike');
      if (onStrikethroughChange && currentStrikethrough !== externalStrikethroughRef.current) {
        onStrikethroughChange(currentStrikethrough);
      }
      
      // Auto-save functionality
      if (autoSave) {
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current);
        }
        autoSaveTimerRef.current = setTimeout(() => {
          setIsSaving(true);
          if (onAutoSave) {
            onAutoSave(html);
          }
          setLastSaved(new Date());
          setTimeout(() => setIsSaving(false), 500);
        }, autoSaveDelay);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Update toolbar state on selection change for instant feedback
      updateToolbarState(editor);
    },
    onFocus: () => {
      setIsEditing(true);
    },
    onBlur: () => {
      setIsEditing(false);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  // Cleanup auto-save timer
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Track if user is actively editing to prevent sync conflicts
  const [isEditing, setIsEditing] = useState(false);
  
  // Track if content change came from user typing (internal) vs external sync
  const isInternalUpdateRef = useRef(false);

  // Sync content from props - sync from external sources (canvas, etc.)
  useEffect(() => {
    if (!editor || !content) return;
    
    // If this update came from user typing (internal), skip sync to preserve cursor
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false; // Reset flag
      return;
    }
    
    const currentContent = editor.getHTML();
    
    // Normalize HTML for comparison (TipTap might format differently)
    const normalize = (html: string) => html.trim().replace(/\s+/g, ' ');
    
    // Only update if content actually changed (external change)
    if (normalize(content) !== normalize(currentContent)) {
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          // Save cursor position before syncing
          const { from, to } = editor.state.selection;
          const hasSelection = from !== to;
          const savedFrom = from;
          const savedTo = to;
          
          // Use emitUpdate: false to prevent triggering onChange and creating a loop
          editor.commands.setContent(content, { emitUpdate: false });
          // Update toolbar state to reflect new content
          updateToolbarState(editor);
          
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
      });
    }
  }, [editor, content, isEditing, updateToolbarState]);
  
  // Sync external alignment (from canvas TipTapEditor)
  useEffect(() => {
    if (!editor) return; // Always sync for bidirectional updates
    
    // Use memoizedExternalAlignment if available, otherwise default to 'center'
    const newAlign = (memoizedExternalAlignment || 'center') as 'left' | 'center' | 'right' | 'justify';
    const currentAlign = editor.getAttributes('textAlign').textAlign || 'center';
    
    if (currentAlign !== newAlign) {
      // Optimistically update toolbar state immediately for instant visual feedback
      setToolbarState(prev => ({ ...prev, alignment: newAlign }));
      
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          editor.commands.setTextAlign(newAlign);
          // Verify toolbar state matches editor state
          updateToolbarState(editor);
        }
      });
    }
  }, [editor, memoizedExternalAlignment, updateToolbarState]);

  // Sync external font family (from canvas TipTapEditor)
  useEffect(() => {
    if (!editor || !memoizedExternalFontFamily) return; // Always sync for bidirectional updates
    
    const currentFontFamily = editor.getAttributes('textStyle').fontFamily;
    
    if (currentFontFamily !== memoizedExternalFontFamily) {
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          editor.chain().focus().setFontFamily(memoizedExternalFontFamily).run();
          setCurrentFontFamily(memoizedExternalFontFamily);
          // Update toolbar state instantly after font family change
          updateToolbarState(editor);
        }
      });
    }
  }, [editor, memoizedExternalFontFamily, updateToolbarState]);
  
  // Update current font family from editor (for toolbar display)
  useEffect(() => {
    if (!editor) return;
    
    const updateFontFamily = () => {
      const fontFamily = editor.getAttributes('textStyle').fontFamily || memoizedExternalFontFamily || '';
      if (fontFamily && fontFamily !== currentFontFamily) {
        setCurrentFontFamily(fontFamily);
      }
    };
    
    editor.on('selectionUpdate', updateFontFamily);
    editor.on('update', updateFontFamily);
    updateFontFamily();
    
    return () => {
      editor.off('selectionUpdate', updateFontFamily);
      editor.off('update', updateFontFamily);
    };
  }, [editor, memoizedExternalFontFamily, currentFontFamily]);

  // Sync external font size (from canvas TipTapEditor)
  useEffect(() => {
    if (!editor || !memoizedExternalFontSize) return; // Always sync for bidirectional updates
    
    const currentSizeAttr = editor.getAttributes('textStyle').fontSize;
    const currentSizeNum = currentSizeAttr ? parseInt(currentSizeAttr.replace('px', '')) : null;
    
    if (currentSizeNum !== memoizedExternalFontSize) {
      setCurrentFontSize(memoizedExternalFontSize);
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          editor.chain().focus().setMark('textStyle', { fontSize: `${memoizedExternalFontSize}px` }).run();
          // Update toolbar state instantly after font size change
          updateToolbarState(editor);
        }
      });
    }
  }, [editor, memoizedExternalFontSize, updateToolbarState]);

  // Sync external tag/heading level (from canvas TipTapEditor)
  useEffect(() => {
    if (!editor || !memoizedExternalTag) return; // Always sync for bidirectional updates
    
    // Check current heading level
    const currentHeading = editor.getAttributes('heading');
    const isParagraph = editor.isActive('paragraph');
    
    if (memoizedExternalTag === 'p') {
      if (!isParagraph) {
        // Only change if not already paragraph
        requestAnimationFrame(() => {
          if (!editor.isDestroyed) {
            editor.chain().focus().setParagraph().run();
            // Update toolbar state instantly after tag change
            updateToolbarState(editor);
          }
        });
      }
    } else {
      const level = parseInt(memoizedExternalTag.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6;
      if (!currentHeading.level || currentHeading.level !== level) {
        // Only change if level is different
        requestAnimationFrame(() => {
          if (!editor.isDestroyed) {
            editor.chain().focus().setHeading({ level }).run();
            // Update toolbar state instantly after tag change
            updateToolbarState(editor);
          }
        });
      }
    }
  }, [editor, memoizedExternalTag, updateToolbarState]);

  // Sync external bold (from canvas TipTapEditor)
  useEffect(() => {
    if (!editor || memoizedExternalBold === undefined) return; // Always sync for bidirectional updates
    
    const currentBold = editor.isActive('bold');
    
    if (currentBold !== memoizedExternalBold) {
      // Optimistically update toolbar state immediately for instant visual feedback
      setToolbarState(prev => ({ ...prev, bold: memoizedExternalBold }));
      
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          if (memoizedExternalBold) {
            editor.chain().focus().setBold().run();
          } else {
            editor.chain().focus().unsetBold().run();
          }
          // Verify toolbar state matches editor state
          updateToolbarState(editor);
        }
      });
    }
  }, [editor, memoizedExternalBold, updateToolbarState]);

  // Sync external italic (from canvas TipTapEditor)
  useEffect(() => {
    if (!editor || memoizedExternalItalic === undefined) return; // Always sync for bidirectional updates
    
    const currentItalic = editor.isActive('italic');
    
    if (currentItalic !== memoizedExternalItalic) {
      // Optimistically update toolbar state immediately for instant visual feedback
      setToolbarState(prev => ({ ...prev, italic: memoizedExternalItalic }));
      
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          if (memoizedExternalItalic) {
            editor.chain().focus().setItalic().run();
          } else {
            editor.chain().focus().unsetItalic().run();
          }
          // Verify toolbar state matches editor state
          updateToolbarState(editor);
        }
      });
    }
  }, [editor, memoizedExternalItalic, updateToolbarState]);

  // Sync external underline (from canvas TipTapEditor)
  useEffect(() => {
    if (!editor || memoizedExternalUnderline === undefined) return; // Always sync for bidirectional updates
    
    const currentUnderline = editor.isActive('underline');
    
    if (currentUnderline !== memoizedExternalUnderline) {
      // Optimistically update toolbar state immediately for instant visual feedback
      setToolbarState(prev => ({ ...prev, underline: memoizedExternalUnderline }));
      
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          if (memoizedExternalUnderline) {
            editor.chain().focus().setUnderline().run();
          } else {
            editor.chain().focus().unsetUnderline().run();
          }
          // Verify toolbar state matches editor state
          updateToolbarState(editor);
        }
      });
    }
  }, [editor, memoizedExternalUnderline, updateToolbarState]);

  // Sync external strikethrough (from canvas TipTapEditor)
  useEffect(() => {
    if (!editor || memoizedExternalStrikethrough === undefined) return; // Always sync for bidirectional updates
    
    const currentStrikethrough = editor.isActive('strike');
    
    if (currentStrikethrough !== memoizedExternalStrikethrough) {
      // Optimistically update toolbar state immediately for instant visual feedback
      setToolbarState(prev => ({ ...prev, strike: memoizedExternalStrikethrough }));
      
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          if (memoizedExternalStrikethrough) {
            editor.chain().focus().setStrike().run();
          } else {
            editor.chain().focus().unsetStrike().run();
          }
          // Verify toolbar state matches editor state
          updateToolbarState(editor);
        }
      });
    }
  }, [editor, memoizedExternalStrikethrough, updateToolbarState]);
  
  // Initialize toolbar state when editor is ready
  useEffect(() => {
    if (editor) {
      updateToolbarState(editor);
    }
  }, [editor, updateToolbarState]);

  const onEmojiClick = useCallback((emojiData: EmojiClickData) => {
    if (editor) {
      // Get current font size from toolbar state or editor attributes
      const currentFontSize = toolbarState.fontSize || editor.getAttributes('textStyle').fontSize;
      const fontSizeValue = currentFontSize ? (typeof currentFontSize === 'number' ? `${currentFontSize}px` : currentFontSize) : null;
      
      // Insert emoji and then apply font size to ALL content to maintain consistency
      editor.chain().focus().insertContent(emojiData.emoji).run();
      
      // Re-apply font size to all content after emoji insertion
      if (fontSizeValue) {
        requestAnimationFrame(() => {
          if (!editor.isDestroyed) {
            editor.chain().focus().selectAll().setMark('textStyle', { fontSize: fontSizeValue }).run();
          }
        });
      }
      
      setShowEmojiPicker(false);
    }
  }, [editor, toolbarState.fontSize]);

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    setLinkUrl('');
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const insertVariable = useCallback((variable: string) => {
    if (editor) {
      // Get current font size from toolbar state or editor attributes
      const currentFontSize = toolbarState.fontSize || editor.getAttributes('textStyle').fontSize;
      const fontSizeValue = currentFontSize ? (typeof currentFontSize === 'number' ? `${currentFontSize}px` : currentFontSize) : null;
      
      editor.chain().focus().insertContent(`{{${variable}}}`).run();
      
      // Re-apply font size to all content after insertion
      if (fontSizeValue) {
        requestAnimationFrame(() => {
          if (!editor.isDestroyed) {
            editor.chain().focus().selectAll().setMark('textStyle', { fontSize: fontSizeValue }).run();
          }
        });
      }
    }
  }, [editor, toolbarState.fontSize]);

  const insertImage = useCallback(() => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
    setShowImageInput(false);
  }, [editor, imageUrl]);

  const insertCustomTag = useCallback(() => {
    if (!editor || !customTagName) return;
    
    // Get current font size from toolbar state or editor attributes
    const currentFontSize = toolbarState.fontSize || editor.getAttributes('textStyle').fontSize;
    const fontSizeValue = currentFontSize ? (typeof currentFontSize === 'number' ? `${currentFontSize}px` : currentFontSize) : null;
    
    editor.chain().focus().insertContent(`{{${customTagName}}}`).run();
    
    // Re-apply font size to all content after insertion
    if (fontSizeValue) {
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          editor.chain().focus().selectAll().setMark('textStyle', { fontSize: fontSizeValue }).run();
        }
      });
    }
    
    setCustomTagName('');
    setShowCustomTagInput(false);
  }, [editor, customTagName, toolbarState.fontSize]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const setFontSizeInEditor = useCallback((size: string) => {
    if (!editor) return;
    setFontSize(size);
    const sizeNum = parseInt(size);
    setCurrentFontSize(sizeNum);
    // Apply font size via inline style
    editor.chain().focus().setMark('textStyle', { fontSize: `${size}px` }).run();
    // Notify parent of font size change
    if (onFontSizeChange) {
      onFontSizeChange(sizeNum);
    }
  }, [editor, onFontSizeChange]);

  // Get current heading level or paragraph
  const getCurrentHeading = () => {
    if (!editor) return 'Paragraph';
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i as 1 | 2 | 3 | 4 | 5 | 6 })) {
        return `H${i}`;
      }
    }
    return 'Paragraph';
  };

  // Handle heading change
  const handleHeadingChange = (value: string) => {
    if (!editor) return;
    
    // Get current content before change
    const currentContent = editor.getHTML();
    
    if (value === 'paragraph') {
      // Convert to paragraph - preserve content
      editor.chain().focus().setParagraph().run();
      if (onTagChange) {
        onTagChange('p');
      }
    } else {
      const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6;
      // Set heading level - preserve content
      editor.chain().focus().setHeading({ level }).run();
      if (onTagChange) {
        onTagChange(`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
      }
    }
    
    // Update toolbar state immediately to reflect change
    updateToolbarState(editor);
    
    setShowHeadingDropdown(false);
    
    // Force content update to reflect heading change
    setTimeout(() => {
      const newContent = editor.getHTML();
      // Only update if content actually changed
      if (newContent !== currentContent) {
        onChange(newContent);
      }
      // Update toolbar state again to ensure it's accurate
      updateToolbarState(editor);
    }, 50);
  };

  // Insert table with custom rows/cols
  const insertTableWithSize = useCallback(() => {
    if (!editor) return;
    try {
      editor.chain().focus().insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true }).run();
      // Force update to ensure table is rendered
      setTimeout(() => {
        const html = editor.getHTML();
        onChange(html);
        updateToolbarState(editor);
      }, 100);
      setShowTableModal(false);
    } catch (error) {
      console.error('Error inserting table:', error);
      // Fallback: try inserting a simple table
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      setTimeout(() => {
        const html = editor.getHTML();
        onChange(html);
        updateToolbarState(editor);
      }, 100);
      setShowTableModal(false);
    }
  }, [editor, tableRows, tableCols, onChange, updateToolbarState]);

  // Highlight color presets
  const HIGHLIGHT_COLORS = [
    '#FEF08A', '#FDE047', '#FACC15', '#FBBF24', '#F59E0B',
    '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444',
    '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6',
    '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED',
    '#FCE7F3', '#FBCFE8', '#F9A8D4', '#F472B6', '#EC4899',
    '#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981',
  ];

  if (!editor) {
    return null;
  }

  // Render toolbar function - compact layout for settings panel
  const renderToolbar = () => (
    <div className="space-y-1.5">
      {/* Row 1: Heading + Font Size + Font Family + Color (all on one line, scrollable) */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide min-w-0">
        {/* Heading Dropdown */}
        <Popover open={showHeadingDropdown} onOpenChange={setShowHeadingDropdown}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "h-7 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium border border-gray-200 dark:border-gray-700",
                (toolbarState.heading !== null || editor.isActive('paragraph')) && "bg-blue-50 dark:bg-blue-900/30 text-blue-600 border-blue-300"
              )}
              title="Heading Level"
              onMouseDown={(e) => e.preventDefault()}
            >
              {toolbarState.heading ? `H${toolbarState.heading}` : 'P'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-28 p-1" onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="space-y-0.5">
              <button
                onClick={() => { handleHeadingChange('paragraph'); setShowHeadingDropdown(false); }}
                className={cn("w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs", toolbarState.heading === null && "bg-blue-50 dark:bg-blue-900/30")}
              >
                Paragraph
              </button>
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <button
                  key={level}
                  onClick={() => { handleHeadingChange(`h${level}`); setShowHeadingDropdown(false); }}
                  className={cn("w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs", toolbarState.heading === level && "bg-blue-50 dark:bg-blue-900/30")}
                >
                  H{level}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Font Size */}
        <Popover open={showFontSizeSlider} onOpenChange={setShowFontSizeSlider}>
          <PopoverTrigger asChild>
            <button 
              className="h-7 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-xs border border-gray-200 dark:border-gray-700 min-w-[48px]" 
              title="Font Size"
              onMouseDown={(e) => e.preventDefault()}
            >
              {toolbarState.fontSize}px
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" onOpenAutoFocus={(e) => e.preventDefault()}>
            <Slider
              value={[toolbarState.fontSize]}
              onValueChange={(vals) => {
                const size = vals[0];
                setCurrentFontSize(size);
                setFontSize(size.toString());
                editor.chain().focus().selectAll().setMark('textStyle', { fontSize: `${size}px` }).run();
                updateToolbarState(editor);
                if (onFontSizeChange) onFontSizeChange(size);
              }}
              min={8}
              max={120}
              step={1}
            />
            <div className="flex gap-0.5 mt-2">
              {[12, 16, 24, 32, 48, 64].map((size) => (
                <Button
                  key={size}
                  size="sm"
                  variant={toolbarState.fontSize === size ? 'default' : 'outline'}
                  className="h-6 px-1 text-[9px] flex-1"
                  onClick={() => {
                    setCurrentFontSize(size);
                    setFontSize(size.toString());
                    editor.chain().focus().selectAll().setMark('textStyle', { fontSize: `${size}px` }).run();
                    updateToolbarState(editor);
                    if (onFontSizeChange) onFontSizeChange(size);
                    setShowFontSizeSlider(false);
                  }}
                >
                  {size}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Font Family */}
        <Popover open={showFontPicker} onOpenChange={setShowFontPicker}>
          <PopoverTrigger asChild>
            <button
              className="h-7 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-xs flex items-center gap-1 flex-1 border border-gray-200 dark:border-gray-700"
              title="Font Family"
              style={{ fontFamily: toolbarState.fontFamily || currentFontFamily || 'inherit' }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <Type size={12} className="shrink-0" />
              <span className="truncate">{toolbarState.fontFamily || currentFontFamily || 'Select Font...'}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="flex items-center gap-1 mb-2">
              <div className="relative flex-1">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search fonts..."
                  value={fontSearchQuery}
                  onChange={(e) => setFontSearchQuery(e.target.value)}
                  className="pl-7 h-7 text-xs"
                />
              </div>
              <button
                className="h-7 px-2 text-[10px] border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 min-w-[60px]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const currentIndex = FONT_CATEGORIES.indexOf(fontCategory);
                  const nextIndex = (currentIndex + 1) % FONT_CATEGORIES.length;
                  setFontCategory(FONT_CATEGORIES[nextIndex] as FontCategory);
                }}
                title="Click to cycle categories"
              >
                {fontCategory}
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {(fontSearchQuery ? searchFonts(fontSearchQuery) : getFontsByCategory(fontCategory)).map((font) => (
                <button
                  key={font.name}
                  onClick={() => {
                    editor.chain().focus().selectAll().setFontFamily(font.name).run();
                    updateToolbarState(editor);
                    setCurrentFontFamily(font.name);
                    if (onFontFamilyChange) onFontFamilyChange(font.name);
                    setShowFontPicker(false);
                  }}
                  className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xs"
                  style={{ fontFamily: font.name }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Color Picker - moved next to font dropdown */}
        <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
          <PopoverTrigger asChild>
            <button 
              className="h-7 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700" 
              title="Text Color"
              onMouseDown={(e) => e.preventDefault()}
            >
              <Palette size={14} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="grid grid-cols-8 gap-1">
              {['#000000', '#374151', '#6B7280', '#FFFFFF', '#DC2626', '#EA580C', '#EAB308', '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899', '#991B1B', '#C2410C', '#A16207', '#166534', '#0D9488', '#1D4ED8', '#6B21A8', '#9F1239', '#FEE2E2', '#FFEDD5', '#FEF08A', '#DCFCE7', '#CCFBF1', '#DBEAFE', '#EDE9FE', '#FCE7F3'].map((color) => (
                <button 
                  key={color} 
                  onClick={() => { editor.chain().focus().selectAll().setColor(color).run(); setShowColorPicker(false); }} 
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform" 
                  style={{ backgroundColor: color }} 
                  title={color}
                  onMouseDown={(e) => e.preventDefault()}
                />
              ))}
            </div>
            <button 
              onClick={() => { editor.chain().focus().selectAll().unsetColor().run(); setShowColorPicker(false); }} 
              className="w-full mt-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              onMouseDown={(e) => e.preventDefault()}
            >
              Reset
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Row 2: Formatting + Alignment (all on one line, scrollable) */}
      <div className="flex items-center gap-0.5 flex-nowrap overflow-x-auto scrollbar-hide min-w-0">
            <ToolbarButton
              onClick={() => {
                // Optimistically update toolbar state first for instant visual feedback
                const newBoldState = !toolbarState.bold;
                setToolbarState(prev => ({ ...prev, bold: newBoldState }));
                // Sync to parent immediately BEFORE toggling editor
                if (onBoldChange) onBoldChange(newBoldState);
                // If no text is selected, apply to all content without selecting (preserves node types)
                const { from, to } = editor.state.selection;
                const hasSelection = from !== to;
                
                if (from === to) {
                  // Use setMark/unsetMark to apply to entire document without changing node types
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
                } else {
                  // Save selection before applying formatting
                  const savedFrom = from;
                  const savedTo = to;
                  
                  // Apply formatting
                  editor.chain().focus()[newBoldState ? 'setBold' : 'unsetBold']().run();
                  
                  // Restore selection after formatting
                  if (hasSelection) {
                    requestAnimationFrame(() => {
                      editor.commands.setTextSelection({ from: savedFrom, to: savedTo });
                      editor.commands.focus();
                    });
                  }
                }
                // Update toolbar state from editor to ensure accuracy
                updateToolbarState(editor);
              }}
              active={toolbarState.bold}
              title="Bold (Cmd+B)"
            >
              <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                // Optimistically update toolbar state first for instant visual feedback
                const newItalicState = !toolbarState.italic;
                setToolbarState(prev => ({ ...prev, italic: newItalicState }));
                // Sync to parent immediately BEFORE toggling editor
                if (onItalicChange) onItalicChange(newItalicState);
                // If no text is selected, apply to all content without selecting (preserves node types)
                const { from, to } = editor.state.selection;
                const hasSelection = from !== to;
                
                if (from === to) {
                  // Use setMark/unsetMark to apply to entire document without changing node types
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
                } else {
                  // Save selection before applying formatting
                  const savedFrom = from;
                  const savedTo = to;
                  
                  // Apply formatting
                  editor.chain().focus()[newItalicState ? 'setItalic' : 'unsetItalic']().run();
                  
                  // Restore selection after formatting
                  if (hasSelection) {
                    requestAnimationFrame(() => {
                      editor.commands.setTextSelection({ from: savedFrom, to: savedTo });
                      editor.commands.focus();
                    });
                  }
                }
                // Update toolbar state from editor to ensure accuracy
                updateToolbarState(editor);
              }}
              active={toolbarState.italic}
              title="Italic (Cmd+I)"
            >
              <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                // Optimistically update toolbar state first for instant visual feedback
                const newUnderlineState = !toolbarState.underline;
                setToolbarState(prev => ({ ...prev, underline: newUnderlineState }));
                // Sync to parent immediately BEFORE toggling editor
                if (onUnderlineChange) onUnderlineChange(newUnderlineState);
                // If no text is selected, apply to all content without selecting (preserves node types)
                const { from, to } = editor.state.selection;
                const hasSelection = from !== to;
                
                if (from === to) {
                  // Use setMark/unsetMark to apply to entire document without changing node types
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
                } else {
                  // Save selection before applying formatting
                  const savedFrom = from;
                  const savedTo = to;
                  
                  // Apply formatting
                  editor.chain().focus()[newUnderlineState ? 'setUnderline' : 'unsetUnderline']().run();
                  
                  // Restore selection after formatting
                  if (hasSelection) {
                    requestAnimationFrame(() => {
                      editor.commands.setTextSelection({ from: savedFrom, to: savedTo });
                      editor.commands.focus();
                    });
                  }
                }
                // Update toolbar state from editor to ensure accuracy
                updateToolbarState(editor);
              }}
              active={toolbarState.underline}
              title="Underline (Cmd+U)"
            >
              <UnderlineIcon size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                // Optimistically update toolbar state first for instant visual feedback
                const newStrikethroughState = !toolbarState.strike;
                setToolbarState(prev => ({ ...prev, strike: newStrikethroughState }));
                // Sync to parent immediately BEFORE toggling editor
                if (onStrikethroughChange) onStrikethroughChange(newStrikethroughState);
                // If no text is selected, apply to all content without selecting (preserves node types)
                const { from, to } = editor.state.selection;
                const hasSelection = from !== to;
                
                if (from === to) {
                  // Use setMark/unsetMark to apply to entire document without changing node types
                  const tr = editor.state.tr;
                  tr.doc.descendants((node, pos) => {
                    if (node.isText) {
                      if (newStrikethroughState) {
                        tr.addMark(pos, pos + node.nodeSize, editor.schema.marks.strike.create());
                      } else {
                        tr.removeMark(pos, pos + node.nodeSize, editor.schema.marks.strike);
                      }
                    }
                  });
                  editor.view.dispatch(tr);
                } else {
                  // Save selection before applying formatting
                  const savedFrom = from;
                  const savedTo = to;
                  
                  // Apply formatting
                  editor.chain().focus()[newStrikethroughState ? 'setStrike' : 'unsetStrike']().run();
                  
                  // Restore selection after formatting
                  if (hasSelection) {
                    requestAnimationFrame(() => {
                      editor.commands.setTextSelection({ from: savedFrom, to: savedTo });
                      editor.commands.focus();
                    });
                  }
                }
                // Update toolbar state from editor to ensure accuracy
                updateToolbarState(editor);
              }}
              active={toolbarState.strike}
              title="Strikethrough"
            >
              <Strikethrough size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                // Optimistically update toolbar state first for instant visual feedback
                const newOverlineState = !toolbarState.overline;
                setToolbarState(prev => ({ ...prev, overline: newOverlineState }));
                // If no text is selected, apply to all content without selecting (preserves node types)
                const { from, to } = editor.state.selection;
                const hasSelection = from !== to;
                
                if (from === to) {
                  // Use setMark/unsetMark to apply to entire document without changing node types
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
                } else {
                  // Save selection before applying formatting
                  const savedFrom = from;
                  const savedTo = to;
                  
                  // Apply formatting
                  editor.chain().focus()[newOverlineState ? 'setOverline' : 'unsetOverline']().run();
                  
                  // Restore selection after formatting
                  if (hasSelection) {
                    requestAnimationFrame(() => {
                      editor.commands.setTextSelection({ from: savedFrom, to: savedTo });
                      editor.commands.focus();
                    });
                  }
                }
                // Update toolbar state from editor to ensure accuracy
                requestAnimationFrame(() => updateToolbarState(editor));
              }}
              active={toolbarState.overline}
              title="Overline"
            >
              <Minus size={16} />
            </ToolbarButton>
            {/* Highlighter with color picker - inline in toolbar */}
            <Popover open={showHighlightPicker} onOpenChange={setShowHighlightPicker}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative",
                    toolbarState.highlight && "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  title="Highlight"
                >
                  <Highlighter size={16} />
                  {/* Color indicator bar */}
                  {toolbarState.highlight && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1 rounded-b"
                      style={{ backgroundColor: highlightColor }}
                    />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-3" 
                onOpenAutoFocus={(e) => e.preventDefault()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="space-y-2">
                  <div className="text-xs font-medium mb-2">Highlight Color</div>
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
                            setToolbarState(prev => ({ ...prev, highlight: true }));
                          } else {
                            editor.chain().focus().setHighlight({ color }).run();
                          }
                          setShowHighlightPicker(false);
                        }}
                        className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
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
                        setToolbarState(prev => ({ ...prev, highlight: false }));
                      } else {
                        editor.chain().focus().unsetHighlight().run();
                      }
                      setShowHighlightPicker(false);
                    }}
                    className="w-full py-2 text-sm border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Remove Highlight
                  </button>
                </div>
              </PopoverContent>
            </Popover>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5" />

        {/* Alignment - inline with formatting */}
        <ToolbarButton onClick={() => { setToolbarState(prev => ({ ...prev, alignment: 'left' })); editor.chain().focus().setTextAlign('left').run(); updateToolbarState(editor); if (onAlignmentChange) onAlignmentChange('left'); }} active={toolbarState.alignment === 'left'} title="Align Left"><AlignLeft size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => { setToolbarState(prev => ({ ...prev, alignment: 'center' })); editor.chain().focus().setTextAlign('center').run(); updateToolbarState(editor); if (onAlignmentChange) onAlignmentChange('center'); }} active={toolbarState.alignment === 'center'} title="Align Center"><AlignCenter size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => { setToolbarState(prev => ({ ...prev, alignment: 'right' })); editor.chain().focus().setTextAlign('right').run(); updateToolbarState(editor); if (onAlignmentChange) onAlignmentChange('right'); }} active={toolbarState.alignment === 'right'} title="Align Right"><AlignRight size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => { setToolbarState(prev => ({ ...prev, alignment: 'justify' })); editor.chain().focus().setTextAlign('justify').run(); updateToolbarState(editor); if (onAlignmentChange) onAlignmentChange('justify'); }} active={toolbarState.alignment === 'justify'} title="Justify"><AlignJustify size={16} /></ToolbarButton>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5" />

        {/* Lists */}
        <ToolbarButton onClick={() => { editor.chain().focus().toggleBulletList().run(); updateToolbarState(editor); }} active={toolbarState.bulletList} title="Bullet List"><List size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => { editor.chain().focus().toggleOrderedList().run(); updateToolbarState(editor); }} active={toolbarState.orderedList} title="Numbered List"><ListOrdered size={16} /></ToolbarButton>
      </div>

      {/* Row 3: Utilities (compact, scrollable) */}
      <div className="flex items-center gap-0.5 flex-nowrap overflow-x-auto scrollbar-hide min-w-0">
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo size={14} /></ToolbarButton>
        
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5" />

        {/* Link */}
        <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
          <PopoverTrigger asChild>
            <button className={cn("p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors", toolbarState.link && "bg-blue-50 dark:bg-blue-900/30 text-blue-600")} title="Insert Link"><Link2 size={14} /></button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" className="w-full px-2 py-1.5 border rounded text-sm" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setLink(); } }} />
              <div className="flex gap-1">
                <Button onClick={setLink} size="sm" className="flex-1 h-7 text-xs">Insert</Button>
                <Button onClick={() => { setShowLinkInput(false); setLinkUrl(''); }} size="sm" variant="outline" className="flex-1 h-7 text-xs">Cancel</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <ToolbarButton onClick={() => { if (editor.isActive('link')) { editor.chain().focus().unsetLink().run(); } else { const { from, to } = editor.state.selection; if (from !== to) { editor.chain().focus().unsetLink().run(); } } updateToolbarState(editor); }} disabled={!toolbarState.link && editor.state.selection.from === editor.state.selection.to} title="Remove Link"><Unlink size={14} /></ToolbarButton>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5" />

        {/* Emoji */}
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker} modal={true}>
          <PopoverTrigger asChild>
            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Insert Emoji"><Smile size={14} /></button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-0" onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()} sideOffset={5}>
            <EmojiPicker onEmojiClick={onEmojiClick} width={280} height={320} searchDisabled={false} skinTonesDisabled previewConfig={{ showPreview: false }} />
          </PopoverContent>
        </Popover>

        {/* Clear Formatting */}
        <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting"><RemoveFormatting size={14} /></ToolbarButton>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5" />

        {/* Variables - moved to dropdown for compactness */}
        <Popover modal={true}>
          <PopoverTrigger asChild>
            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Insert Variable"><Plus size={14} /></button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1" onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="text-[10px] text-gray-500 px-2 py-1">Variables</div>
            {['FirstName', 'LastName', 'Email', 'Company', 'Phone'].map((v) => (
              <button key={v} onClick={() => insertVariable(v)} className="w-full px-2 py-1 text-left text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700">{'{{' + v + '}}'}</button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Expand */}
        <ToolbarButton onClick={() => setIsExpanded(true)} title="Expand Editor"><Maximize2 size={14} /></ToolbarButton>
      </div>
    </div>
  );

  // Render expanded toolbar - spacious layout for expanded view
  const renderExpandedToolbar = () => (
    <div className="space-y-3">
      {/* Row 1: Heading, Font Size, Font Family, Color */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Heading Dropdown */}
        <Popover open={showHeadingDropdown} onOpenChange={setShowHeadingDropdown}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "h-9 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium border border-gray-200 dark:border-gray-700",
                (toolbarState.heading !== null || editor.isActive('paragraph')) && "bg-blue-50 dark:bg-blue-900/30 text-blue-600 border-blue-300"
              )}
              title="Heading Level"
              onMouseDown={(e) => e.preventDefault()}
            >
              {toolbarState.heading ? `H${toolbarState.heading}` : 'Paragraph'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="space-y-1">
              <button
                onClick={() => { handleHeadingChange('paragraph'); setShowHeadingDropdown(false); }}
                className={cn("w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm", toolbarState.heading === null && "bg-blue-50 dark:bg-blue-900/30")}
              >
                Paragraph
              </button>
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <button
                  key={level}
                  onClick={() => { handleHeadingChange(`h${level}`); setShowHeadingDropdown(false); }}
                  className={cn("w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm", toolbarState.heading === level && "bg-blue-50 dark:bg-blue-900/30")}
                >
                  Heading {level}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Font Size */}
        <Popover open={showFontSizeSlider} onOpenChange={setShowFontSizeSlider}>
          <PopoverTrigger asChild>
            <button 
              className="h-9 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm border border-gray-200 dark:border-gray-700 min-w-[70px]" 
              title="Font Size"
              onMouseDown={(e) => e.preventDefault()}
            >
              {toolbarState.fontSize}px
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="space-y-3">
              <Slider
                value={[toolbarState.fontSize]}
                onValueChange={(vals) => {
                  const size = vals[0];
                  setCurrentFontSize(size);
                  setFontSize(size.toString());
                  editor.chain().focus().selectAll().setMark('textStyle', { fontSize: `${size}px` }).run();
                  updateToolbarState(editor);
                  if (onFontSizeChange) onFontSizeChange(size);
                }}
                min={8}
                max={120}
                step={1}
              />
              <div className="flex gap-2">
                {[12, 16, 20, 24, 32, 48, 64].map((size) => (
                  <Button
                    key={size}
                    size="sm"
                    variant={toolbarState.fontSize === size ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setCurrentFontSize(size);
                      setFontSize(size.toString());
                      editor.chain().focus().selectAll().setMark('textStyle', { fontSize: `${size}px` }).run();
                      updateToolbarState(editor);
                      if (onFontSizeChange) onFontSizeChange(size);
                      setShowFontSizeSlider(false);
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Font Family */}
        <Popover open={showFontPicker} onOpenChange={setShowFontPicker}>
          <PopoverTrigger asChild>
            <button
              className="h-9 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center gap-2 border border-gray-200 dark:border-gray-700 min-w-[180px]"
              title="Font Family"
              style={{ fontFamily: toolbarState.fontFamily || currentFontFamily || 'inherit' }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <Type size={14} className="shrink-0" />
              <span className="truncate">{toolbarState.fontFamily || currentFontFamily || 'Select Font...'}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search fonts..."
                  value={fontSearchQuery}
                  onChange={(e) => setFontSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <button
                className="h-9 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 min-w-[80px]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const currentIndex = FONT_CATEGORIES.indexOf(fontCategory);
                  const nextIndex = (currentIndex + 1) % FONT_CATEGORIES.length;
                  setFontCategory(FONT_CATEGORIES[nextIndex] as FontCategory);
                }}
                title="Click to cycle categories"
              >
                {fontCategory}
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {(fontSearchQuery ? searchFonts(fontSearchQuery) : getFontsByCategory(fontCategory)).map((font) => (
                <button
                  key={font.name}
                  onClick={() => {
                    editor.chain().focus().selectAll().setFontFamily(font.name).run();
                    updateToolbarState(editor);
                    setCurrentFontFamily(font.name);
                    if (onFontFamilyChange) onFontFamilyChange(font.name);
                    setShowFontPicker(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                  style={{ fontFamily: font.name }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Color Picker */}
        <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
          <PopoverTrigger asChild>
            <button 
              className="h-9 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-2" 
              title="Text Color"
              onMouseDown={(e) => e.preventDefault()}
            >
              <Palette size={16} />
              <span className="text-sm">Color</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Text Color</Label>
              <div className="grid grid-cols-8 gap-2">
                {['#000000', '#374151', '#6B7280', '#FFFFFF', '#DC2626', '#EA580C', '#EAB308', '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899', '#991B1B', '#C2410C', '#A16207', '#166534', '#0D9488', '#1D4ED8', '#6B21A8', '#9F1239', '#FEE2E2', '#FFEDD5', '#FEF08A', '#DCFCE7', '#CCFBF1', '#DBEAFE', '#EDE9FE', '#FCE7F3'].map((color) => (
                  <button 
                    key={color} 
                    onClick={() => { editor.chain().focus().selectAll().setColor(color).run(); setShowColorPicker(false); }} 
                    className="w-8 h-8 rounded-md border-2 border-gray-300 hover:scale-110 transition-transform" 
                    style={{ backgroundColor: color }} 
                    title={color}
                    onMouseDown={(e) => e.preventDefault()}
                  />
                ))}
              </div>
              <button 
                onClick={() => { editor.chain().focus().selectAll().unsetColor().run(); setShowColorPicker(false); }} 
                className="w-full py-2 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                onMouseDown={(e) => e.preventDefault()}
              >
                Reset Color
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Row 2: Formatting */}
      <div className="flex items-center gap-2 flex-wrap">
        <ToolbarButton
          onClick={() => {
            const newBoldState = !toolbarState.bold;
            setToolbarState(prev => ({ ...prev, bold: newBoldState }));
            if (onBoldChange) onBoldChange(newBoldState);
            const { from, to } = editor.state.selection;
            if (from === to) {
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
            } else {
              editor.chain().focus()[newBoldState ? 'setBold' : 'unsetBold']().run();
            }
            updateToolbarState(editor);
          }}
          active={toolbarState.bold}
          title="Bold (Cmd+B)"
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const newItalicState = !toolbarState.italic;
            setToolbarState(prev => ({ ...prev, italic: newItalicState }));
            if (onItalicChange) onItalicChange(newItalicState);
            const { from, to } = editor.state.selection;
            if (from === to) {
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
            } else {
              editor.chain().focus()[newItalicState ? 'setItalic' : 'unsetItalic']().run();
            }
            updateToolbarState(editor);
          }}
          active={toolbarState.italic}
          title="Italic (Cmd+I)"
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const newUnderlineState = !toolbarState.underline;
            setToolbarState(prev => ({ ...prev, underline: newUnderlineState }));
            if (onUnderlineChange) onUnderlineChange(newUnderlineState);
            const { from, to } = editor.state.selection;
            if (from === to) {
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
            } else {
              editor.chain().focus()[newUnderlineState ? 'setUnderline' : 'unsetUnderline']().run();
            }
            updateToolbarState(editor);
          }}
          active={toolbarState.underline}
          title="Underline (Cmd+U)"
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const newStrikeState = !toolbarState.strike;
            setToolbarState(prev => ({ ...prev, strike: newStrikeState }));
            if (onStrikethroughChange) onStrikethroughChange(newStrikeState);
            const { from, to } = editor.state.selection;
            if (from === to) {
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
            } else {
              editor.chain().focus()[newStrikeState ? 'setStrike' : 'unsetStrike']().run();
            }
            updateToolbarState(editor);
          }}
          active={toolbarState.strike}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const newOverlineState = !toolbarState.overline;
            setToolbarState(prev => ({ ...prev, overline: newOverlineState }));
            const { from, to } = editor.state.selection;
            if (from === to) {
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
            } else {
              editor.chain().focus()[newOverlineState ? 'setOverline' : 'unsetOverline']().run();
            }
            updateToolbarState(editor);
          }}
          active={toolbarState.overline}
          title="Overline"
        >
          <Minus size={18} />
        </ToolbarButton>

        {/* Highlight */}
        <Popover open={showHighlightPicker} onOpenChange={setShowHighlightPicker}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "h-9 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative border border-gray-200 dark:border-gray-700",
                toolbarState.highlight && "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
              )}
              title="Highlight"
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <Highlighter size={18} />
              {toolbarState.highlight && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-md"
                  style={{ backgroundColor: highlightColor }}
                />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" onOpenAutoFocus={(e) => e.preventDefault()} onMouseDown={(e) => e.stopPropagation()}>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Highlight Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    key={color}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setHighlightColor(color);
                      const { from, to } = editor.state.selection;
                      if (from === to) {
                        const tr = editor.state.tr;
                        tr.doc.descendants((node, pos) => {
                          if (node.isText) {
                            tr.addMark(pos, pos + node.nodeSize, editor.schema.marks.highlight.create({ color }));
                          }
                        });
                        editor.view.dispatch(tr);
                      } else {
                        editor.chain().focus().setHighlight({ color }).run();
                      }
                      requestAnimationFrame(() => updateToolbarState(editor));
                      setShowHighlightPicker(false);
                    }}
                    className="w-10 h-10 rounded-md border-2 border-gray-300 hover:border-gray-500 transition-colors"
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
                    const tr = editor.state.tr;
                    tr.doc.descendants((node, pos) => {
                      if (node.isText) {
                        tr.removeMark(pos, pos + node.nodeSize, editor.schema.marks.highlight);
                      }
                    });
                    editor.view.dispatch(tr);
                  } else {
                    editor.chain().focus().unsetHighlight().run();
                  }
                  requestAnimationFrame(() => updateToolbarState(editor));
                  setShowHighlightPicker(false);
                }}
                className="w-full py-2 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Remove Highlight
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Alignment */}
        <ToolbarButton onClick={() => { setToolbarState(prev => ({ ...prev, alignment: 'left' })); editor.chain().focus().setTextAlign('left').run(); updateToolbarState(editor); if (onAlignmentChange) onAlignmentChange('left'); }} active={toolbarState.alignment === 'left'} title="Align Left"><AlignLeft size={18} /></ToolbarButton>
        <ToolbarButton onClick={() => { setToolbarState(prev => ({ ...prev, alignment: 'center' })); editor.chain().focus().setTextAlign('center').run(); updateToolbarState(editor); if (onAlignmentChange) onAlignmentChange('center'); }} active={toolbarState.alignment === 'center'} title="Align Center"><AlignCenter size={18} /></ToolbarButton>
        <ToolbarButton onClick={() => { setToolbarState(prev => ({ ...prev, alignment: 'right' })); editor.chain().focus().setTextAlign('right').run(); updateToolbarState(editor); if (onAlignmentChange) onAlignmentChange('right'); }} active={toolbarState.alignment === 'right'} title="Align Right"><AlignRight size={18} /></ToolbarButton>
        <ToolbarButton onClick={() => { setToolbarState(prev => ({ ...prev, alignment: 'justify' })); editor.chain().focus().setTextAlign('justify').run(); updateToolbarState(editor); if (onAlignmentChange) onAlignmentChange('justify'); }} active={toolbarState.alignment === 'justify'} title="Justify"><AlignJustify size={18} /></ToolbarButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Lists */}
        <ToolbarButton onClick={() => { editor.chain().focus().toggleBulletList().run(); updateToolbarState(editor); }} active={toolbarState.bulletList} title="Bullet List"><List size={18} /></ToolbarButton>
        <ToolbarButton onClick={() => { editor.chain().focus().toggleOrderedList().run(); updateToolbarState(editor); }} active={toolbarState.orderedList} title="Numbered List"><ListOrdered size={18} /></ToolbarButton>
      </div>

      {/* Row 3: Utilities */}
      <div className="flex items-center gap-2 flex-wrap">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo size={16} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo size={16} /></ToolbarButton>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
          <PopoverTrigger asChild>
            <button className={cn("h-9 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700 flex items-center gap-2", toolbarState.link && "bg-blue-50 dark:bg-blue-900/30 text-blue-600")} title="Insert Link"><Link2 size={16} /><span className="text-sm">Link</span></button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="space-y-3">
              <Label>Link URL</Label>
              <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" className="w-full px-3 py-2 border rounded-md text-sm" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setLink(); } }} />
              <div className="flex gap-2">
                <Button onClick={setLink} size="sm" className="flex-1">Insert</Button>
                <Button onClick={() => { setShowLinkInput(false); setLinkUrl(''); }} size="sm" variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <ToolbarButton onClick={() => { if (editor.isActive('link')) { editor.chain().focus().unsetLink().run(); } else { const { from, to } = editor.state.selection; if (from !== to) { editor.chain().focus().unsetLink().run(); } } updateToolbarState(editor); }} disabled={!toolbarState.link && editor.state.selection.from === editor.state.selection.to} title="Remove Link"><Unlink size={16} /></ToolbarButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker} modal={true}>
          <PopoverTrigger asChild>
            <button className="h-9 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700 flex items-center gap-2" title="Insert Emoji"><Smile size={16} /><span className="text-sm">Emoji</span></button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-0" onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()} sideOffset={5}>
            <EmojiPicker onEmojiClick={onEmojiClick} width={350} height={400} searchDisabled={false} skinTonesDisabled previewConfig={{ showPreview: false }} />
          </PopoverContent>
        </Popover>

        <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting"><RemoveFormatting size={16} /></ToolbarButton>
      </div>
    </div>
  );

  const ToolbarButton = ({ 
    onClick, 
    active, 
    disabled, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    active?: boolean; 
    disabled?: boolean; 
    children: React.ReactNode; 
    title: string;
  }) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault(); // CRITICAL: Prevent focus loss
        e.stopPropagation();
        if (!disabled) {
          onClick();
        }
      }}
      disabled={disabled}
      title={title}
      className={cn(
        "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        active && "bg-blue-50 dark:bg-blue-900/30 text-blue-600",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );

  return (
    <>
      {/* Expanded Overlay - Draggable and Resizable, No Blur */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 pointer-events-none"
          onMouseUp={() => {
            setIsDragging(false);
            setIsResizing(false);
          }}
          onMouseMove={(e) => {
            if (isDragging) {
              const newX = e.clientX - dragStart.x;
              const newY = e.clientY - dragStart.y;
              setExpandedPosition({
                x: Math.max(0, Math.min(newX, window.innerWidth - expandedSize.width)),
                y: Math.max(0, Math.min(newY, window.innerHeight - expandedSize.height)),
              });
            } else if (isResizing) {
              const deltaX = e.clientX - dragStart.x;
              const deltaY = e.clientY - dragStart.y;
              
              const newWidth = Math.max(400, Math.min(expandedSize.width + deltaX, window.innerWidth - expandedPosition.x));
              const newHeight = Math.max(300, Math.min(expandedSize.height + deltaY, window.innerHeight - expandedPosition.y));
              
              setExpandedSize({
                width: newWidth,
                height: newHeight,
              });
              
              setDragStart({
                x: e.clientX,
                y: e.clientY,
              });
            }
          }}
        >
          <div
            ref={expandedRef}
            className="absolute bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col border-2 border-gray-200 dark:border-gray-700 pointer-events-auto"
            style={{
              left: `${expandedPosition.x}px`,
              top: `${expandedPosition.y}px`,
              width: `${expandedSize.width}px`,
              height: `${expandedSize.height}px`,
            }}
          >
            {/* Draggable Header */}
            <div 
              className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-move"
              onMouseDown={(e) => {
                setIsDragging(true);
                setDragStart({
                  x: e.clientX - expandedPosition.x,
                  y: e.clientY - expandedPosition.y,
                });
              }}
            >
              <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                Expanded View
              </Label>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Minimize"
              >
                <Minimize2 size={20} />
              </button>
            </div>
            
            {/* Expanded Editor - Full toolbar and content */}
            <div className="flex-1 overflow-auto p-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white dark:bg-gray-900">
                {/* Full Toolbar - Expanded layout */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  {renderExpandedToolbar()}
                </div>
                
                {/* Editor Content - Expanded */}
                <EditorContent 
                  editor={editor} 
                  className="prose prose-sm max-w-none dark:prose-invert p-4"
                  style={{ minHeight: '400px' }}
                />
              </div>
              
              {/* Auto-save Indicator */}
              {autoSave && (
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
                  <div className="flex items-center gap-2">
                    {isSaving ? (
                      <>
                        <Save className="h-3 w-3 animate-pulse" />
                        <span>Saving...</span>
                      </>
                    ) : lastSaved ? (
                      <>
                        <Check className="h-3 w-3 text-green-500" />
                        <span>Saved at {lastSaved.toLocaleTimeString()}</span>
                      </>
                    ) : (
                      <span>Auto-save enabled</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Resize Handle - Thin line around edges */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                border: '1px solid transparent',
                borderRight: '1px solid #9CA3AF',
                borderBottom: '1px solid #9CA3AF',
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize pointer-events-auto hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsResizing(true);
                setDragStart({
                  x: e.clientX,
                  y: e.clientY,
                });
              }}
              style={{
                borderRight: '2px solid #6B7280',
                borderBottom: '2px solid #6B7280',
              }}
            />
          </div>
        </div>
      )}

      {/* Normal View */}
      <div className={cn("space-y-3", isExpanded && "hidden")}>
        {label && (
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {label}
            </Label>
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Expand Editor"
            >
              <Maximize2 size={16} className="text-gray-500" />
            </button>
          </div>
        )}

      {/* Toolbar */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white dark:bg-gray-900">
        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
          {renderToolbar()}
        </div>

        {/* Editor Content with Resize Handle */}
        <div className="relative">
          <EditorContent 
            editor={editor} 
            className="prose prose-sm max-w-none dark:prose-invert"
            style={{ minHeight }}
          />
          {/* Resize Handle */}
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize opacity-50 hover:opacity-100 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, transparent 50%, currentColor 50%)',
              color: '#9CA3AF'
            }}
            title="Drag to resize"
          />
        </div>
      </div>

      {/* Auto-save Indicator */}
      {autoSave && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            {isSaving ? (
              <>
                <Save className="h-3 w-3 animate-pulse" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Check className="h-3 w-3 text-green-500" />
                <span>Saved at {lastSaved.toLocaleTimeString()}</span>
              </>
            ) : (
              <span>Auto-save enabled</span>
            )}
          </div>
          <span className="text-[10px]">Changes save automatically</span>
        </div>
      )}

      {/* Save Button */}
      {showSaveButton && onSave && (
        <Button 
          onClick={onSave}
          className="w-full"
        >
          Save Changes
        </Button>
      )}
      </div>
    </>
  );
}
