"use client";



import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import './tiptap-editor.css';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { FontFamily } from '@tiptap/extension-font-family';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Link2, Unlink, 
  Eraser, Heading, Type, Minus, Search, Filter, Highlighter,
  List, ListOrdered, Undo, Redo
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Overline } from './extensions/Overline';
import { Highlight } from './extensions/Highlight';
import { FONTS, FONT_CATEGORIES, type FontCategory, searchFonts, getFontsByCategory } from '@/src/lib/fonts';
import { InlineMediaToolbar } from './InlineMediaToolbar';

// Disabled - was too aggressive and prevented editing
// We rely on CSS hiding and HTML cleanup instead
const SingleHeadingOnly = Extension.create({
  name: 'singleHeadingOnly',
  addProseMirrorPlugins() {
    return [];
  },
});

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  onStyleChange?: (styles: any) => void;
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
  isSelected?: boolean;
  onStartEdit?: () => void;
  onStopEdit?: () => void;
  externalStyles?: React.CSSProperties;
  singleLine?: boolean; // Prevent multiple lines/paragraphs
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  onStyleChange,
  onTagChange,
  onAlignmentChange,
  onFontFamilyChange,
  onFontSizeChange,
  onBoldChange,
  onItalicChange,
  onUnderlineChange,
  onStrikethroughChange,
  className = '',
  placeholder = 'Double-click to edit...',
  tag = 'p',
  isEditing = false,
  isSelected = false,
  onStartEdit,
  onStopEdit,
  externalStyles = {},
  singleLine = true, // Default to single line for text elements
}) => {
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [showHeadingPicker, setShowHeadingPicker] = React.useState(false);
  const [showFontPicker, setShowFontPicker] = React.useState(false);
  const [showFontSizeSlider, setShowFontSizeSlider] = React.useState(false);
  const [fontSearchQuery, setFontSearchQuery] = React.useState('');
  const [fontCategory, setFontCategory] = React.useState<FontCategory>('All');
  const [currentFontSize, setCurrentFontSize] = React.useState(16);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showInlineToolbar, setShowInlineToolbar] = useState(false);
  const [inlineToolbarPosition, setInlineToolbarPosition] = useState({ top: 0, left: 0 });
  // Track formatting state for reactive button updates
  const [formattingState, setFormattingState] = React.useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    overline: false,
  });
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const SHOW_LEGACY_INLINE_TOOLBAR = true; // Enable inline toolbar for text editing

  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration mismatch
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        paragraph: {
          HTMLAttributes: {
            class: 'tiptap-paragraph',
          },
        },
        hardBreak: singleLine ? false : undefined, // Disable line breaks for single line
      }),
      SingleHeadingOnly, // ← Enforce single heading only
      Underline,
      Overline,
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      FontFamily,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
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
          class: 'border-collapse table-auto w-full border border-gray-300',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
        emptyNodeClass: 'is-empty',
      }),
    ],
    content,
    editable: true, // Always editable to allow text selection (we control actual editing via isEditing state)
    onUpdate: ({ editor }) => {
      // Clean up empty tags from the output HTML - AGGRESSIVE MODE
      let html = editor.getHTML();
      
      // If single line mode, remove all but the first paragraph/heading
      if (singleLine) {
        // Create a temporary div to parse HTML properly
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Find the first heading or paragraph element
        const firstElement = tempDiv.querySelector('h1, h2, h3, h4, h5, h6, p');
        if (firstElement) {
          // Get only the first element's HTML
          html = firstElement.outerHTML;
        } else {
          // If no element found, try to extract first tag manually
          const firstMatch = html.match(/<(h[1-6]|p)[^>]*>[\s\S]*?<\/(h[1-6]|p)>/i);
          if (firstMatch) {
            html = firstMatch[0];
          }
        }
        
        // Remove any line breaks
        html = html.replace(/<br\s*\/?>/gi, '');
        // Remove any newlines and extra whitespace
        html = html.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      }
      
      // Remove ALL empty tags in one pass using regex
      // This catches <h1></h1>, <h1> </h1>, <h1 class="foo"></h1>, etc.
      html = html.replace(/<h[1-6][^>]*>\s*<\/h[1-6]>/gi, '');
      html = html.replace(/<p[^>]*>\s*<\/p>/gi, '');
      
      // Remove multiple consecutive empty tags (in case of nesting)
      let previousHtml = '';
      while (previousHtml !== html) {
        previousHtml = html;
        html = html.replace(/<h[1-6][^>]*>\s*<\/h[1-6]>/gi, '');
        html = html.replace(/<p[^>]*>\s*<\/p>/gi, '');
      }
      
      onChange(html);
      
      // Detect and sync formatting changes
      // Use externalStyles.textAlign as fallback to maintain sync, not 'left'
      const currentAlignment = editor.getAttributes('textAlign').textAlign || externalStyles.textAlign || 'center';
      if (onAlignmentChange && currentAlignment !== externalStyles.textAlign) {
        onAlignmentChange(currentAlignment as 'left' | 'center' | 'right' | 'justify');
      }
      
      // Detect current heading level
      // IMPORTANT: Don't change tag when in a list - lists preserve their content type
      const isInList = editor.isActive('bulletList') || editor.isActive('orderedList');
      
      if (!isInList) {
        const currentHeading = editor.getAttributes('heading');
        if (currentHeading.level) {
          const currentTag = `h${currentHeading.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
          if (onTagChange && currentTag !== tag) {
            onTagChange(currentTag);
          }
        } else if (editor.isActive('paragraph')) {
          // IMPORTANT: If we have an external heading tag (h1-h6), don't let it revert to paragraph
          // This happens when user deletes all text - TipTap converts empty heading to paragraph
          // We need to re-apply the heading level to preserve the element type
          if (tag && tag.startsWith('h')) {
            const level = parseInt(tag.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6;
            // Re-apply heading level to prevent paragraph conversion
            requestAnimationFrame(() => {
              if (!editor.isDestroyed) {
                editor.commands.setHeading({ level });
              }
            });
          } else if (onTagChange && tag !== 'p') {
            onTagChange('p');
          }
        }
      }
      
      // Detect font family
      const currentFontFamily = editor.getAttributes('textStyle').fontFamily;
      if (onFontFamilyChange && currentFontFamily && currentFontFamily !== externalStyles.fontFamily) {
        onFontFamilyChange(currentFontFamily);
      }
      
      // Detect font size
      const currentFontSizeAttr = editor.getAttributes('textStyle').fontSize;
      if (currentFontSizeAttr) {
        const fontSizeNum = parseInt(currentFontSizeAttr.replace('px', ''));
        if (!isNaN(fontSizeNum) && fontSizeNum !== currentFontSize) {
          setCurrentFontSize(fontSizeNum);
          if (onFontSizeChange) {
            onFontSizeChange(fontSizeNum);
          }
        }
      }
      
      // Update formatting state for reactive button updates
      setFormattingState({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strikethrough: editor.isActive('strike'),
        overline: editor.isActive('overline'),
      });
      
      // Detect and sync text decorations
      if (onBoldChange) {
        const currentBold = editor.isActive('bold');
        onBoldChange(currentBold);
      }
      
      if (onItalicChange) {
        const currentItalic = editor.isActive('italic');
        onItalicChange(currentItalic);
      }
      
      if (onUnderlineChange) {
        const currentUnderline = editor.isActive('underline');
        onUnderlineChange(currentUnderline);
      }
      
      if (onStrikethroughChange) {
        const currentStrikethrough = editor.isActive('strike');
        onStrikethroughChange(currentStrikethrough);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Update formatting state for reactive button updates
      setFormattingState({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strikethrough: editor.isActive('strike'),
        overline: editor.isActive('overline'),
      });
      
      // Sync formatting state when selection changes (for toolbar highlighting)
      // This ensures the settings panel toolbar reflects current formatting
      if (onStyleChange) {
        const styles = {
          bold: editor.isActive('bold'),
          italic: editor.isActive('italic'),
          underline: editor.isActive('underline'),
          strike: editor.isActive('strike'),
          overline: editor.isActive('overline'),
          alignment: editor.getAttributes('textAlign').textAlign || 'left',
          fontFamily: editor.getAttributes('textStyle').fontFamily || '',
          fontSize: editor.getAttributes('textStyle').fontSize || '',
        };
        onStyleChange(styles);
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          'focus:outline-none',
          singleLine && 'single-line-editor',
          className
        ),
        // Only apply single-line styles if singleLine is true
        // For text elements, we want wrapping, so singleLine should be false
        // Text naturally wraps - no need to force it with CSS
        ...(singleLine && { style: 'white-space: nowrap; overflow: hidden;' }),
        // Allow text selection even when not editing
        ...(!isEditing && { style: 'user-select: text; -webkit-user-select: text; -moz-user-select: text; cursor: text;' }),
      },
      handleKeyDown: (view, event) => {
        // Prevent editing when not in edit mode (allow selection but not typing)
        if (!isEditing) {
          // Allow selection shortcuts (Ctrl+A, Ctrl+C, etc.) but prevent typing
          if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Enter') {
            event.preventDefault();
            return true;
          }
        }
        
        // Prevent Enter key from creating new lines in single line mode
        if (singleLine && event.key === 'Enter') {
          event.preventDefault();
          return true;
        }
        // Prevent Shift+Enter from creating line breaks
        if (singleLine && event.key === 'Enter' && event.shiftKey) {
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
  });

  // Don't show this toolbar - we use the one in the edit mode section instead
  // This prevents duplicate toolbars
  const shouldShowToolbar = false;

  // Update content when prop changes (but not when user is actively editing)
  useEffect(() => {
    if (!editor || isEditing) return;
    
    const currentContent = editor.getHTML();
    // Only update if content actually changed to avoid cursor jumps
    if (content && content !== currentContent) {
      // Clean content for single line mode before setting
      let cleanContent = content;
      if (singleLine) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const firstElement = tempDiv.querySelector('h1, h2, h3, h4, h5, h6, p');
        if (firstElement) {
          cleanContent = firstElement.outerHTML;
        }
      }
      
      // Use requestAnimationFrame to batch the update and prevent flashing
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          editor.commands.setContent(cleanContent, { emitUpdate: false }); // Don't emit update event
          // Note: Heading level sync is handled by the separate tag effect to prevent conflicts
        }
      });
    }
  }, [content, editor, isEditing, singleLine]); // Removed tag from deps to prevent double-update

  // Update heading level when tag prop changes (debounced to prevent flashing)
  useEffect(() => {
    if (!editor || !tag || !tag.startsWith('h')) return;
    
    const level = parseInt(tag.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6;
    const currentLevel = editor.getAttributes('heading').level;
    
    // Only update if level actually changed and we're not currently editing
    if (currentLevel !== level && !isEditing) {
      // Use requestAnimationFrame to batch the update
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          editor.commands.setHeading({ level });
        }
      });
    }
  }, [tag, editor, isEditing]); // Removed onChange to prevent re-render loop

  // Memoize external style values to ensure proper change detection
  const externalTextAlign = React.useMemo(() => externalStyles.textAlign, [externalStyles.textAlign]);
  const externalFontSize = React.useMemo(() => externalStyles.fontSize, [externalStyles.fontSize]);
  const externalFontFamily = React.useMemo(() => externalStyles.fontFamily, [externalStyles.fontFamily]);
  const externalTextColor = React.useMemo(() => externalStyles.color, [externalStyles.color]);

  // Sync alignment from external styles
  useEffect(() => {
    if (!editor || isEditing) return;
    
    // Use externalTextAlign if available, otherwise default to 'center'
    const newAlign = (externalTextAlign || 'center') as 'left' | 'center' | 'right' | 'justify';
    const currentAlign = editor.getAttributes('textAlign').textAlign || 'center';
    
    if (currentAlign !== newAlign) {
      // Use requestAnimationFrame to batch the update
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          editor.commands.setTextAlign(newAlign);
        }
      });
    }
  }, [editor, externalTextAlign, isEditing]);

  // Sync font size from external styles
  useEffect(() => {
    if (!editor || !externalFontSize || isEditing) return;
    
    const fontSizeStr = externalFontSize as string;
    const fontSizeNum = parseInt(fontSizeStr.replace('px', ''));
    
    if (!isNaN(fontSizeNum)) {
      const currentSizeAttr = editor.getAttributes('textStyle').fontSize;
      const currentSizeNum = currentSizeAttr ? parseInt(currentSizeAttr.replace('px', '')) : null;
      
      if (currentSizeNum !== fontSizeNum) {
        setCurrentFontSize(fontSizeNum);
        // Apply font size to ALL content, not just current selection
        requestAnimationFrame(() => {
          if (!editor.isDestroyed) {
            editor.chain().focus().selectAll().setMark('textStyle', { fontSize: `${fontSizeNum}px` }).run();
          }
        });
      }
    }
  }, [editor, externalFontSize, isEditing]);

  // Sync font family from external styles
  useEffect(() => {
    if (!editor || !externalFontFamily || isEditing) return;
    
    const currentFontFamily = editor.getAttributes('textStyle').fontFamily;
    
    if (currentFontFamily !== externalFontFamily) {
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          // Apply font family to ALL content, not just current selection
          editor.chain().focus().selectAll().setFontFamily(externalFontFamily).run();
        }
      });
    }
  }, [editor, externalFontFamily, isEditing]);

  // Sync text color from external styles
  useEffect(() => {
    if (!editor || !externalTextColor || isEditing) return;
    
    const currentColor = editor.getAttributes('textStyle').color;
    
    if (currentColor !== externalTextColor) {
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          // Apply color to ALL content, not just current selection
          editor.chain().focus().selectAll().setColor(externalTextColor).run();
        }
      });
    }
  }, [editor, externalTextColor, isEditing]);

  // NOTE: Bold, italic, underline, strikethrough formatting is stored in the HTML content
  // via TipTap marks (<strong>, <em>, <u>, <s>), NOT as CSS properties.
  // The content prop already contains the formatted HTML, so no sync effects needed.

  // Update editable state and handle click outside
  useEffect(() => {
    if (editor) {
      // Always allow text selection (editable: true)
      // But prevent actual text input when not in edit mode
      editor.setEditable(true);
      
      // Prevent text input when not editing by intercepting beforeinput
      const view = editor.view;
      if (!isEditing) {
        const handleBeforeInput = (event: Event) => {
          event.preventDefault();
          return false;
        };
        
        const handleKeyDown = (event: KeyboardEvent) => {
          // Allow selection shortcuts (Ctrl+A, etc.) but prevent typing
          if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Enter') {
            event.preventDefault();
            return false;
          }
        };
        
        view.dom.addEventListener('beforeinput', handleBeforeInput);
        view.dom.addEventListener('keydown', handleKeyDown);
        
        return () => {
          view.dom.removeEventListener('beforeinput', handleBeforeInput);
          view.dom.removeEventListener('keydown', handleKeyDown);
        };
      } else {
        // When editing, allow all input
        editor.commands.focus();
      }
    }
  }, [isEditing, editor]);
  
  // Handle click outside to stop editing
  useEffect(() => {
    if (!isEditing) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't stop editing if clicking on toolbar or editor
      if (target.closest('.bubble-menu-toolbar') || target.closest('.ProseMirror') || target.closest('[data-toolbar-popup]')) {
        return;
      }
      // Stop editing if clicking outside
      if (onStopEdit) {
        onStopEdit();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, onStopEdit]);
  
  // Update toolbar position - fixed at element center, aware of sidebar and screen edges
  const updateToolbarPosition = useCallback(() => {
    if (!editor || (!isEditing && !isSelected)) return;
    
    try {
      // Get the editor container's bounding rectangle for centering
      const editorRect = editorContainerRef.current?.getBoundingClientRect();
      
      if (editorRect) {
        // Detect sidebar and other potential blocking elements
        // Try multiple selectors to catch all sidebar variations
        const leftSidebar = document.querySelector(
          '.w-80, .w-12, .w-\\[600px\\], [data-sidebar="true"], [class*="z-\\[70\\]"].border-r'
        );
        const rightSidebar = document.querySelector('[data-right-sidebar="true"], [data-inspector="true"]');
        
        // Calculate safe boundaries
        const sidebarRight = leftSidebar ? leftSidebar.getBoundingClientRect().right : 0;
        const rightBoundary = rightSidebar ? rightSidebar.getBoundingClientRect().left : window.innerWidth;
        
        // Get actual toolbar width if ref is available, otherwise estimate
        const toolbarWidth = toolbarRef.current?.offsetWidth || 450; // Increased estimate
        const toolbarHalfWidth = toolbarWidth / 2;
        
        // Center toolbar horizontally above the text element
        const idealCenterX = editorRect.left + (editorRect.width / 2);
        
        // Calculate safe left boundary (sidebar right edge + padding + half toolbar width)
        const safeLeftBoundary = sidebarRight + 10 + toolbarHalfWidth;
        
        // Calculate safe right boundary (right boundary - padding - half toolbar width)
        const safeRightBoundary = rightBoundary - 10 - toolbarHalfWidth;
        
        // Clamp the toolbar position between safe boundaries
        const finalLeft = Math.max(safeLeftBoundary, Math.min(idealCenterX, safeRightBoundary));
        
        // Position toolbar above the text element (not at cursor)
        const toolbarTop = editorRect.top - 70; // 70px above element
        
        setToolbarPosition({ 
          top: Math.max(10, toolbarTop), 
          left: finalLeft
        });
      }
    } catch (e) {
      // Fallback to editor container position
      if (editorContainerRef.current) {
        const rect = editorContainerRef.current.getBoundingClientRect();
        setToolbarPosition({ 
          top: Math.max(10, rect.top - 70), 
          left: rect.left + rect.width / 2 
        });
      }
    }
  }, [editor, isEditing, isSelected]);
  
  // Update toolbar position only on initial mount - keep it fixed at element center
  useEffect(() => {
    if (!editor || (!isEditing && !isSelected)) return;
    
    // Set initial position and keep it fixed
    updateToolbarPosition();
    
    // Update on scroll/resize to keep toolbar aligned if element moves
    const handleScroll = () => {
      updateToolbarPosition();
    };
    
    const handleResize = () => {
      updateToolbarPosition();
    };
    
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [editor, isEditing, isSelected, updateToolbarPosition]);

  // Show inline toolbar when text is selected in display mode
  useEffect(() => {
    if (!editor || isEditing) return;

    const updateInlineToolbarPosition = () => {
      if (!showInlineToolbar) return;
      const rect = editorContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setInlineToolbarPosition({
          top: rect.top - 70, // 70px above element
          left: rect.left + rect.width / 2, // Center horizontally
        });
      }
    };

    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection) {
        setShowInlineToolbar(false);
        return;
      }

      const text = selection.toString();
      const hasText = text.trim().length > 0;

      const editorElement = editorContainerRef.current;
      const anchorNode = selection.anchorNode;
      const withinEditor =
        editorElement && anchorNode && editorElement.contains(anchorNode);

      if (hasText && withinEditor) {
        // Calculate fixed position based on element container
        const rect = editorContainerRef.current?.getBoundingClientRect();
        if (rect) {
          setInlineToolbarPosition({
            top: rect.top - 70, // 70px above element
            left: rect.left + rect.width / 2, // Center horizontally
          });
        }
        setShowInlineToolbar(true);
      } else {
        setShowInlineToolbar(false);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest('.bubble-menu-toolbar') &&
        !target.closest('.ProseMirror') &&
        !target.closest('[data-toolbar-popup]')
      ) {
        setShowInlineToolbar(false);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', updateInlineToolbarPosition, true);
    window.addEventListener('resize', updateInlineToolbarPosition);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', updateInlineToolbarPosition, true);
      window.removeEventListener('resize', updateInlineToolbarPosition);
    };
  }, [editor, isEditing, showInlineToolbar]);

  // Handle double-click to start editing - MUST be before early return
  const handleDoubleClick = useCallback(() => {
    if (!isEditing && onStartEdit) {
      onStartEdit();
      // Focus the editor after starting edit mode
      setTimeout(() => {
        editor?.commands.focus('end');
      }, 0);
    }
  }, [isEditing, onStartEdit, editor]);

  if (!editor) {
    return null;
  }

  // Handle link insertion
  const handleAddLink = () => {
    if (linkUrl && editor) {
      const { from, to } = editor.state.selection;
      // If there's a selection, use it; otherwise insert the URL as text
      if (from !== to) {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      } else {
        // Insert link at cursor position
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkUrl}</a>`).run();
      }
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  // Handle heading change
  const handleHeadingChange = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    console.log('🎯 Changing heading level to:', level);
    
    // Set the heading level in TipTap
    editor.chain().focus().setHeading({ level }).run();
    setShowHeadingPicker(false);
    
    // Notify parent component of tag change
    if (onTagChange) {
      onTagChange(`h${level}` as any);
    }
    
    // Force update the content to reflect the new heading level
    setTimeout(() => {
      const newContent = editor.getHTML();
      console.log('📝 New content after heading change:', newContent);
      onChange(newContent);
    }, 0);
  };

  // Clear all formatting (but preserve font size)
  const clearFormatting = () => {
    if (!editor) return;
    const currentFontSize = editor.getAttributes('textStyle').fontSize;
    editor.chain().focus().unsetAllMarks().run();
    // Restore font size if it existed
    if (currentFontSize) {
      setTimeout(() => {
        editor.chain().focus().setMark('textStyle', { fontSize: currentFontSize }).run();
      }, 0);
    }
  };
  
  // Highlight color presets
  const highlightColors = [
    '#FEF08A', '#FDE047', '#FACC15', '#FBBF24', '#F59E0B',
    '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444',
    '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6',
    '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED',
    '#FCE7F3', '#FBCFE8', '#F9A8D4', '#F472B6', '#EC4899',
  ];

  // Color presets
  const colorPresets = [
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB',
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#84CC16', '#06B6D4',
  ];

  // Render inline toolbar buttons (reusable for both BubbleMenu and edit mode toolbar)
  const renderInlineToolbar = () => (
    <div className="flex items-center gap-1 nowrap overflow-x-auto">
      {/* Heading Picker */}
      <div className="relative">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-xs"
          onClick={() => setShowHeadingPicker(!showHeadingPicker)}
          title="Heading Level"
        >
          <Heading size={16} className="mr-1" />
          {tag.toUpperCase()}
        </Button>
        {showHeadingPicker && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-[10000]" data-toolbar-popup>
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                onClick={() => handleHeadingChange(level as any)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
              >
                H{level}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

      {/* Text Formatting */}
      <Button
        size="sm"
        variant={formattingState.bold ? 'default' : 'ghost'}
        className="h-8 w-8 p-0"
        onClick={() => {
          const currentBold = formattingState.bold;
          setFormattingState(prev => ({ ...prev, bold: !currentBold }));
          editor.chain().focus().toggleBold().run();
          if (onBoldChange) {
            onBoldChange(!currentBold);
          }
        }}
        title="Bold (Ctrl+B)"
      >
        <Bold size={16} />
      </Button>
      <Button
        size="sm"
        variant={formattingState.italic ? 'default' : 'ghost'}
        className="h-8 w-8 p-0"
        onClick={() => {
          const currentItalic = formattingState.italic;
          setFormattingState(prev => ({ ...prev, italic: !currentItalic }));
          editor.chain().focus().toggleItalic().run();
          if (onItalicChange) {
            onItalicChange(!currentItalic);
          }
        }}
        title="Italic (Ctrl+I)"
      >
        <Italic size={16} />
      </Button>
      <Button
        size="sm"
        variant={formattingState.underline ? 'default' : 'ghost'}
        className="h-8 w-8 p-0"
        onClick={() => {
          const currentUnderline = formattingState.underline;
          setFormattingState(prev => ({ ...prev, underline: !currentUnderline }));
          editor.chain().focus().toggleUnderline().run();
          if (onUnderlineChange) {
            onUnderlineChange(!currentUnderline);
          }
        }}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon size={16} />
      </Button>
      <Button
        size="sm"
        variant={formattingState.strikethrough ? 'default' : 'ghost'}
        className="h-8 w-8 p-0"
        onClick={() => {
          const currentStrikethrough = formattingState.strikethrough;
          setFormattingState(prev => ({ ...prev, strikethrough: !currentStrikethrough }));
          editor.chain().focus().toggleStrike().run();
          if (onStrikethroughChange) {
            onStrikethroughChange(!currentStrikethrough);
          }
        }}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </Button>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

      {/* Alignment */}
      <Button
        size="sm"
        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
        className="h-8 w-8 p-0"
        onClick={() => {
          editor.chain().focus().setTextAlign('left').run();
          if (onAlignmentChange) onAlignmentChange('left');
        }}
        title="Align Left"
      >
        <AlignLeft size={16} />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
        className="h-8 w-8 p-0"
        onClick={() => {
          editor.chain().focus().setTextAlign('center').run();
          if (onAlignmentChange) onAlignmentChange('center');
        }}
        title="Align Center"
      >
        <AlignCenter size={16} />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
        className="h-8 w-8 p-0"
        onClick={() => {
          editor.chain().focus().setTextAlign('right').run();
          if (onAlignmentChange) onAlignmentChange('right');
        }}
        title="Align Right"
      >
        <AlignRight size={16} />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
        className="h-8 w-8 p-0"
        onClick={() => {
          editor.chain().focus().setTextAlign('justify').run();
          if (onAlignmentChange) onAlignmentChange('justify');
        }}
        title="Justify"
      >
        <AlignJustify size={16} />
      </Button>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

      {/* Link & Unlink */}
      <div className="relative flex items-center gap-1">
        <Button
          size="sm"
          variant={editor.isActive('link') ? 'default' : 'ghost'}
          className="h-8 w-8 p-0"
          onClick={() => setShowLinkInput(!showLinkInput)}
          title="Add Link (Ctrl+K)"
        >
          <Link2 size={16} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => {
            if (editor.isActive('link')) {
              editor.chain().focus().unsetLink().run();
            } else {
              const { from, to } = editor.state.selection;
              if (from !== to) {
                editor.chain().focus().unsetLink().run();
              }
            }
          }}
          disabled={!editor.isActive('link') && editor.state.selection.from === editor.state.selection.to}
          title="Remove Link"
        >
          <Unlink size={16} />
        </Button>
        {showLinkInput && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-[10000] w-64" data-toolbar-popup>
            <Input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddLink();
                }
              }}
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddLink}>
                Add Link
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  setShowLinkInput(false);
                }}
              >
                <Unlink size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

      {/* Highlighter */}
      <div className="relative">
        <Button
          size="sm"
          variant={editor.isActive('highlight') ? 'default' : 'ghost'}
          className="h-8 w-8 p-0"
          onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          title="Highlight"
        >
          <Highlighter size={16} />
        </Button>
        {showHighlightPicker && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-[10000]" data-toolbar-popup>
            <div className="grid grid-cols-5 gap-1 w-48">
              {highlightColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color }).run();
                    setShowHighlightPicker(false);
                  }}
                  className="w-8 h-8 rounded border-2 hover:border-blue-500 transition-all"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

      {/* Clear Formatting */}
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={clearFormatting}
        title="Clear Formatting"
      >
        <Eraser size={16} />
      </Button>
    </div>
  );

  return (
    <div 
      className="relative w-full" 
      ref={editorContainerRef}
      onDoubleClick={handleDoubleClick}
    >
      {shouldShowToolbar && (
        SHOW_LEGACY_INLINE_TOOLBAR ? (
          <div 
            ref={toolbarRef}
            className="bubble-menu-toolbar fixed bg-black/95 text-white border border-white/40 rounded-lg shadow-[0_12px_38px_rgba(0,0,0,0.65)] p-2 z-[2147483647] [&_button]:text-white [&_button:hover]:bg-white/15"
            style={{
              top: `${toolbarPosition.top}px`,
              left: `${toolbarPosition.left}px`,
              transform: 'translateX(-50%)',
              zIndex: 999999,
              pointerEvents: 'auto',
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-1 nowrap overflow-x-auto">
              {/* Heading Picker */}
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowHeadingPicker(!showHeadingPicker);
                  }}
                  title="Heading Level"
                >
                  <Heading size={16} className="mr-1" />
                  {tag.toUpperCase()}
                </Button>
                {showHeadingPicker && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-[10000]"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {[1, 2, 3, 4, 5, 6].map((level) => (
                      <button
                        key={level}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleHeadingChange(level as any);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                      >
                        H{level}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Text Formatting */}
              <Button
                size="sm"
                variant={formattingState.bold ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const currentBold = formattingState.bold;
                  setFormattingState(prev => ({ ...prev, bold: !currentBold }));
                  editor.chain().focus().toggleBold().run();
                  if (onBoldChange) {
                    onBoldChange(!currentBold);
                  }
                }}
                title="Bold (Ctrl+B)"
              >
                <Bold size={16} />
              </Button>
              <Button
                size="sm"
                variant={formattingState.italic ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const currentItalic = formattingState.italic;
                  setFormattingState(prev => ({ ...prev, italic: !currentItalic }));
                  editor.chain().focus().toggleItalic().run();
                  if (onItalicChange) {
                    onItalicChange(!currentItalic);
                  }
                }}
                title="Italic (Ctrl+I)"
              >
                <Italic size={16} />
              </Button>
              <Button
                size="sm"
                variant={formattingState.underline ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const currentUnderline = formattingState.underline;
                  setFormattingState(prev => ({ ...prev, underline: !currentUnderline }));
                  editor.chain().focus().toggleUnderline().run();
                  if (onUnderlineChange) {
                    onUnderlineChange(!currentUnderline);
                  }
                }}
                title="Underline (Ctrl+U)"
              >
                <UnderlineIcon size={16} />
              </Button>
              <Button
                size="sm"
                variant={formattingState.strikethrough ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const currentStrikethrough = formattingState.strikethrough;
                  setFormattingState(prev => ({ ...prev, strikethrough: !currentStrikethrough }));
                  editor.chain().focus().toggleStrike().run();
                  if (onStrikethroughChange) {
                    onStrikethroughChange(!currentStrikethrough);
                  }
                }}
                title="Strikethrough"
              >
                <Strikethrough size={16} />
              </Button>
              <Button
                size="sm"
                variant={formattingState.overline ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const currentOverline = formattingState.overline;
                  setFormattingState(prev => ({ ...prev, overline: !currentOverline }));
                  editor.chain().focus().toggleOverline().run();
                }}
                title="Overline"
              >
                <Minus size={16} />
              </Button>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Font Family Selector */}
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowFontPicker(!showFontPicker);
                  }}
                  title="Font Family"
                >
                  <Type size={16} className="mr-1" />
                  Font
                </Button>
                {showFontPicker && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-[10000] w-64 max-h-64 overflow-y-auto"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        value={fontSearchQuery}
                        onChange={(e) => setFontSearchQuery(e.target.value)}
                        placeholder="Search fonts..."
                        className="h-8 text-xs"
                        autoFocus
                      />
                      <Select value={fontCategory} onValueChange={(value: FontCategory) => setFontCategory(value)}>
                        <SelectTrigger className="h-8 w-24">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {FONT_CATEGORIES.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id}
                              disabled={category.count === 0}
                            >
                              {category.name} ({category.count})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      {displayFonts.map((font) => (
                        <button
                          key={font}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            editor.chain().focus().setFontFamily(font).run();
                            if (onFontFamilyChange) onFontFamilyChange(font);
                            setShowFontPicker(false);
                          }}
                          className={cn(
                            'w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover=bg-gray-700',
                            editor.isActive('textStyle', { fontFamily: font }) && 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-200'
                          )}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Font Size Slider */}
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowFontSizeSlider(!showFontSizeSlider);
                  }}
                  title="Font Size"
                >
                  <Type size={16} className="mr-1" />
                  {currentFontSize}px
                </Button>
                {showFontSizeSlider && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-[10000] w-64" 
                    data-toolbar-popup
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Slider
                      value={[currentFontSize]}
                      onValueChange={(value) => {
                        setCurrentFontSize(value[0]);
                      }}
                      onValueCommit={(value) => {
                        editor.chain().focus().setFontSize(`${value[0]}px`).run();
                        if (onFontSizeChange) onFontSizeChange(value[0]);
                      }}
                      min={8}
                      max={120}
                      step={1}
                    />
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Alignment Controls */}
              <Button
                size="sm"
                variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().setTextAlign('left').run();
                  if (onAlignmentChange) onAlignmentChange('left');
                }}
                title="Align Left"
              >
                <AlignLeft size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().setTextAlign('center').run();
                  if (onAlignmentChange) onAlignmentChange('center');
                }}
                title="Align Center"
              >
                <AlignCenter size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().setTextAlign('right').run();
                  if (onAlignmentChange) onAlignmentChange('right');
                }}
                title="Align Right"
              >
                <AlignRight size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().setTextAlign('justify').run();
                  if (onAlignmentChange) onAlignmentChange('justify');
                }}
                title="Justify"
              >
                <AlignJustify size={16} />
              </Button>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Link & Unlink */}
              <div className="relative flex items-center gap-1">
                <Button
                  size="sm"
                  variant={editor.isActive('link') ? 'default' : 'ghost'}
                  className="h-8 w-8 p-0"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowLinkInput(!showLinkInput);
                  }}
                  title="Add Link (Ctrl+K)"
                >
                  <Link2 size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (editor.isActive('link')) {
                      editor.chain().focus().unsetLink().run();
                    } else {
                      const { from, to } = editor.state.selection;
                      if (from !== to) {
                        editor.chain().focus().unsetLink().run();
                      }
                    }
                  }}
                  disabled={!editor.isActive('link') && editor.state.selection.from === editor.state.selection.to}
                  title="Remove Link"
                >
                  <Unlink size={16} />
                </Button>
                {showLinkInput && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white dark.bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-[10000] w-64 flex gap-2" 
                    data-toolbar-popup
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Input
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="Enter URL"
                      className="h-8 text-xs flex-1"
                    />
                    <Button
                      size="sm"
                      variant="default"
                      className="h-8 px-3"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddLink();
                      }}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* List Controls */}
              <Button
                size="sm"
                variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().toggleBulletList().run();
                }}
                title="Bullet List"
              >
                <List size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().toggleOrderedList().run();
                }}
                title="Numbered List"
              >
                <ListOrdered size={16} />
              </Button>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Highlighter */}
              <div className="relative">
                <Button
                  size="sm"
                  variant={editor.isActive('highlight') ? 'default' : 'ghost'}
                  className="h-8 w-8 p-0"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowHighlightPicker(!showHighlightPicker);
                  }}
                  title="Highlight"
                >
                  <Highlighter size={16} />
                </Button>
                {showHighlightPicker && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-[10000]" 
                    data-toolbar-popup
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="grid grid-cols-5 gap-1 w-48">
                      {highlightColors.map((color) => (
                        <button
                          key={color}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            editor.chain().focus().toggleHighlight({ color }).run();
                            setShowHighlightPicker(false);
                          }}
                          className="w-8 h-8 rounded border-2 hover:border-blue-500 transition-all"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Clear Formatting */}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearFormatting();
                }}
                title="Clear Formatting"
              >
                <Eraser size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <div 
            ref={toolbarRef}
            className="bubble-menu-toolbar fixed bg-black/95 text-white border border-white/40 rounded-lg shadow-[0_12px_38px_rgba(0,0,0,0.65)] p-2 z-[1000000] [&_button]:text-white [&_button:hover]:bg-white/15"
            style={{
              top: `${toolbarPosition.top}px`,
              left: `${toolbarPosition.left}px`,
              transform: 'translateX(-50%)',
              pointerEvents: 'auto',
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {renderInlineToolbar()}
          </div>
        )
      )}

      {/* Display mode - double-click to edit */}
      {!isEditing && editor && (
        <>
          {/* Inline Toolbar - Shows when text is selected/clicked in display mode, stays open until clicking off */}
          {showInlineToolbar && (
            <div
              className="bubble-menu-toolbar fixed bg-black/95 text-white border border-white/40 rounded-lg shadow-[0_12px_38px_rgba(0,0,0,0.65)] p-2 z-[2147483647] [&_button]:text-white [&_button:hover]:bg-white/15 whitespace-nowrap"
              style={{
                top: `${Math.max(10, inlineToolbarPosition.top)}px`,
                left: `${inlineToolbarPosition.left}px`,
                transform: 'translateX(-50%)',
                minWidth: 'max-content',
                maxWidth: '90vw',
              }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => e.stopPropagation()}
            >
              {renderInlineToolbar()}
            </div>
          )}

          <div
            onDoubleClick={(e) => {
              // Only start editing if not selecting text
              const selection = window.getSelection();
              if (!selection || selection.toString().length === 0) {
                if (onStartEdit) {
                  onStartEdit();
                }
              }
            }}
            onClick={(e) => {
              // Check if user is selecting text - if so, don't bubble
              const selection = window.getSelection();
              if (selection && selection.toString().length > 0) {
                e.stopPropagation();
              }
              // Otherwise, let click bubble to ElementRenderer for element selection
            }}
            className="cursor-text w-full break-words"
            style={{
              ...externalStyles, 
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              boxSizing: 'border-box',
              whiteSpace: 'normal',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              userSelect: 'text', // Allow text selection
              WebkitUserSelect: 'text', // Safari
              MozUserSelect: 'text', // Firefox
              pointerEvents: 'auto', // Ensure pointer events work
            }}
          >
            <div 
              className="relative" 
              style={{ 
                userSelect: 'text',
                WebkitUserSelect: 'text',
                MozUserSelect: 'text',
                pointerEvents: 'auto',
              }}
            >
              <EditorContent editor={editor} />
              {editor && <InlineMediaToolbar editor={editor} />}
            </div>
          </div>
        </>
      )}

      {/* Edit mode with toolbar */}
      {isEditing && (
        <div className="relative" ref={editorContainerRef}>
          {/* Floating Toolbar - Fixed position centered above text element */}
          {SHOW_LEGACY_INLINE_TOOLBAR ? (
            <div 
              ref={toolbarRef}
              className="bubble-menu-toolbar fixed bg-black/95 text-white border border-white/40 rounded-lg shadow-[0_12px_38px_rgba(0,0,0,0.65)] p-2 z-[2147483647] [&_button]:text-white [&_button:hover]:bg-white/15"
              style={{
                top: `${toolbarPosition.top}px`,
                left: `${toolbarPosition.left}px`,
                transform: 'translateX(-50%)', // Center toolbar horizontally
                zIndex: 999999, // Above everything on canvas - increased z-index
                pointerEvents: 'auto', // Ensure it's clickable
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="flex items-center gap-1 nowrap overflow-x-auto">
              {/* Heading Picker */}
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowHeadingPicker(!showHeadingPicker);
                  }}
                  title="Heading Level"
                >
                  <Heading size={16} className="mr-1" />
                  {tag.toUpperCase()}
                </Button>
                {showHeadingPicker && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-[10000]"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {[1, 2, 3, 4, 5, 6].map((level) => (
                      <button
                        key={level}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleHeadingChange(level as any);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                      >
                        H{level}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Text Formatting */}
              <Button
                size="sm"
                variant={formattingState.bold ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault(); // CRITICAL: Prevent focus loss
                  e.stopPropagation();
                  const currentBold = formattingState.bold;
                  // Optimistically update state for instant visual feedback
                  setFormattingState(prev => ({ ...prev, bold: !currentBold }));
                  editor.chain().focus().toggleBold().run();
                  // Immediately sync to settings panel
                  if (onBoldChange) {
                    onBoldChange(!currentBold);
                  }
                }}
                title="Bold (Ctrl+B)"
              >
                <Bold size={16} />
              </Button>
              <Button
                size="sm"
                variant={formattingState.italic ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault(); // CRITICAL: Prevent focus loss
                  e.stopPropagation();
                  const currentItalic = formattingState.italic;
                  // Optimistically update state for instant visual feedback
                  setFormattingState(prev => ({ ...prev, italic: !currentItalic }));
                  editor.chain().focus().toggleItalic().run();
                  // Immediately sync to settings panel
                  if (onItalicChange) {
                    onItalicChange(!currentItalic);
                  }
                }}
                title="Italic (Ctrl+I)"
              >
                <Italic size={16} />
              </Button>
              <Button
                size="sm"
                variant={formattingState.underline ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault(); // CRITICAL: Prevent focus loss
                  e.stopPropagation();
                  const currentUnderline = formattingState.underline;
                  // Optimistically update state for instant visual feedback
                  setFormattingState(prev => ({ ...prev, underline: !currentUnderline }));
                  editor.chain().focus().toggleUnderline().run();
                  // Immediately sync to settings panel with the NEW state (opposite of current)
                  if (onUnderlineChange) {
                    onUnderlineChange(!currentUnderline);
                  }
                }}
                title="Underline (Ctrl+U)"
              >
                <UnderlineIcon size={16} />
              </Button>
              <Button
                size="sm"
                variant={formattingState.strikethrough ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault(); // CRITICAL: Prevent focus loss
                  e.stopPropagation();
                  const currentStrikethrough = formattingState.strikethrough;
                  // Optimistically update state for instant visual feedback
                  setFormattingState(prev => ({ ...prev, strikethrough: !currentStrikethrough }));
                  editor.chain().focus().toggleStrike().run();
                  // Immediately sync to settings panel
                  if (onStrikethroughChange) {
                    onStrikethroughChange(!currentStrikethrough);
                  }
                }}
                title="Strikethrough"
              >
                <Strikethrough size={16} />
              </Button>
              <Button
                size="sm"
                variant={formattingState.overline ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault(); // CRITICAL: Prevent focus loss
                  e.stopPropagation();
                  const currentOverline = formattingState.overline;
                  // Optimistically update state for instant visual feedback
                  setFormattingState(prev => ({ ...prev, overline: !currentOverline }));
                  editor.chain().focus().toggleOverline().run();
                }}
                title="Overline"
              >
                <Minus size={16} />
              </Button>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Font Family Selector */}
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowFontPicker(!showFontPicker);
                  }}
                  title="Font Family"
                >
                  <Type size={14} className="mr-1" />
                  <span className="max-w-[60px] truncate">
                    {externalStyles.fontFamily || 'Inter'}
                  </span>
                </Button>
                {showFontPicker && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-[10000] w-80 max-h-96 overflow-y-auto"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Search fonts..."
                            value={fontSearchQuery}
                            onChange={(e) => setFontSearchQuery(e.target.value)}
                            className="pl-8 h-8 text-xs"
                          />
                        </div>
                        <Select value={fontCategory} onValueChange={(val) => setFontCategory(val as FontCategory)}>
                          <SelectTrigger className="h-8 w-32 text-xs">
                            <Filter size={12} className="mr-1" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONT_CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-1">
                        {(fontSearchQuery 
                          ? searchFonts(fontSearchQuery)
                          : getFontsByCategory(fontCategory)
                        ).map((font) => (
                          <button
                            key={font.name}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              editor.chain().focus().setFontFamily(font.name).run();
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
                    </div>
                  </div>
                )}
              </div>

              {/* Font Size Slider */}
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowFontSizeSlider(!showFontSizeSlider);
                  }}
                  title="Font Size"
                >
                  {currentFontSize}px
                </Button>
                {showFontSizeSlider && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-[10000] w-48"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Size</span>
                        <span className="text-xs font-medium">{currentFontSize}px</span>
                      </div>
                      <Slider
                        value={[currentFontSize]}
                        onValueChange={(vals) => {
                          const size = vals[0];
                          setCurrentFontSize(size);
                          editor.chain().focus().setMark('textStyle', { fontSize: `${size}px` }).run();
                          if (onFontSizeChange) onFontSizeChange(size);
                        }}
                        min={8}
                        max={120}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex gap-1">
                        {[12, 16, 20, 24, 32, 48].map((size) => (
                          <Button
                            key={size}
                            size="sm"
                            variant={currentFontSize === size ? 'default' : 'outline'}
                            className="h-6 px-2 text-xs flex-1"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentFontSize(size);
                              editor.chain().focus().setMark('textStyle', { fontSize: `${size}px` }).run();
                              if (onFontSizeChange) onFontSizeChange(size);
                            }}
                          >
                            {size}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Lists */}
              <Button
                size="sm"
                variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().toggleBulletList().run();
                }}
                title="Bullet List"
              >
                <List size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().toggleOrderedList().run();
                }}
                title="Numbered List"
              >
                <ListOrdered size={16} />
              </Button>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Alignment */}
              <Button
                size="sm"
                variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().setTextAlign('left').run();
                  if (onAlignmentChange) onAlignmentChange('left');
                }}
                title="Align Left"
              >
                <AlignLeft size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().setTextAlign('center').run();
                  if (onAlignmentChange) onAlignmentChange('center');
                }}
                title="Align Center"
              >
                <AlignCenter size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().setTextAlign('right').run();
                  if (onAlignmentChange) onAlignmentChange('right');
                }}
                title="Align Right"
              >
                <AlignRight size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().setTextAlign('justify').run();
                  if (onAlignmentChange) onAlignmentChange('justify');
                }}
                title="Justify"
              >
                <AlignJustify size={16} />
              </Button>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Link & Unlink */}
              <div className="relative flex items-center gap-1">
                <Button
                  size="sm"
                  variant={editor.isActive('link') ? 'default' : 'ghost'}
                  className="h-8 w-8 p-0"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowLinkInput(!showLinkInput);
                  }}
                  title="Add Link (Ctrl+K)"
                >
                  <Link2 size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (editor.isActive('link')) {
                      editor.chain().focus().unsetLink().run();
                    } else {
                      // Try to unlink even if not detected as active
                      const { from, to } = editor.state.selection;
                      if (from !== to) {
                        editor.chain().focus().unsetLink().run();
                      }
                    }
                  }}
                  disabled={!editor.isActive('link') && editor.state.selection.from === editor.state.selection.to}
                  title="Remove Link"
                >
                  <Unlink size={16} />
                </Button>
                {showLinkInput && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-[10000] w-64" 
                    data-toolbar-popup
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddLink();
                        }
                      }}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddLink();
                        }}
                      >
                        Add Link
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          editor.chain().focus().unsetLink().run();
                          setShowLinkInput(false);
                        }}
                      >
                        <Unlink size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Highlighter */}
              <div className="relative">
                <Button
                  size="sm"
                  variant={editor.isActive('highlight') ? 'default' : 'ghost'}
                  className="h-8 w-8 p-0"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowHighlightPicker(!showHighlightPicker);
                  }}
                  title="Highlight"
                >
                  <Highlighter size={16} />
                </Button>
                {showHighlightPicker && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-[10000]" 
                    data-toolbar-popup
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="grid grid-cols-5 gap-1 w-48">
                      {highlightColors.map((color) => (
                        <button
                          key={color}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            editor.chain().focus().toggleHighlight({ color }).run();
                            setShowHighlightPicker(false);
                          }}
                          className="w-8 h-8 rounded border-2 hover:border-blue-500 transition-all"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Clear Formatting */}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearFormatting();
                }}
                title="Clear Formatting"
              >
                <Eraser size={16} />
              </Button>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Undo/Redo */}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().undo().run();
                }}
                disabled={!editor.can().undo()}
                title="Undo (Cmd+Z)"
              >
                <Undo size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().redo().run();
                }}
                disabled={!editor.can().redo()}
                title="Redo (Cmd+Shift+Z)"
              >
                <Redo size={16} />
              </Button>
            </div>
          </div>
          ) : (
            <div 
              ref={toolbarRef}
              className="bubble-menu-toolbar fixed bg-black/95 text-white border border-white/40 rounded-lg shadow-[0_12px_38px_rgba(0,0,0,0.65)] p-2 z-[2147483647] [&_button]:text-white [&_button:hover]:bg-white/15"
              style={{
                top: `${toolbarPosition.top}px`,
                left: `${toolbarPosition.left}px`,
                transform: 'translateX(-50%)', // Center toolbar horizontally
                zIndex: 1000000,
                pointerEvents: 'auto',
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {renderInlineToolbar()}
            </div>
          )}

          {/* Editor Content */}
          <div
            className={singleLine ? "inline-block" : "w-full break-words"}
            style={{
              ...externalStyles,
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              boxSizing: 'border-box',
              whiteSpace: singleLine ? 'nowrap' : 'normal',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            <EditorContent editor={editor} />
            {editor && <InlineMediaToolbar editor={editor} />}
          </div>
        </div>
      )}
    </div>
  );
};
