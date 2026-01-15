"use client";



import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { useToggle, useClickOutside } from '@/src/lib/utils/hooks';
import { cn } from '@/lib/utils';
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  Link2, Unlink, Type, Sparkles, Check, X, Eraser, Heading
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InlineTextEditorProps {
  content: string;
  onChange: (newContent: string) => void;
  onStyleChange?: (styles: TextStyles) => void;
  onTagChange?: (tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div') => void;
  className?: string;
  placeholder?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  initialStyles?: TextStyles;
  externalStyles?: React.CSSProperties; // Styles from HeadingSettings
}

interface TextStyles {
  bold?: boolean; // Deprecated - use fontWeight instead
  fontWeight?: number; // 100-900 in increments of 100
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  alignment?: 'left' | 'center' | 'right';
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  link?: string;
}

interface ToolbarPosition {
  top: number;
  left: number;
}

/**
 * InlineTextEditor - Enterprise-grade inline text editor with floating toolbar
 * 
 * @description
 * Advanced inline text editing with:
 * - Double-click to edit
 * - Floating toolbar for formatting
 * - Bold, italic, underline, strikethrough
 * - Text alignment
 * - Color picker
 * - Link insertion
 * - Keyboard shortcuts (Ctrl+B, Ctrl+I, etc.)
 * 
 * @example
 * ```tsx
 * <InlineTextEditor
 *   content="Hello World"
 *   onChange={(text) => console.log(text)}
 *   onStyleChange={(styles) => console.log(styles)}
 *   tag="h1"
 * />
 * ```
 */
export const InlineTextEditor = React.memo(function InlineTextEditor({
  content,
  onChange,
  onStyleChange,
  onTagChange,
  className = '',
  placeholder = 'Double-click to edit...',
  tag = 'div',
  initialStyles = {},
  externalStyles = {},
}: InlineTextEditorProps) {
  const [isEditing, , startEditingInternal, stopEditing] = useToggle(false);
  const [value, setValue] = useState(content);
  
  // Set default styles: fontWeight 700, center alignment
  const defaultStyles: TextStyles = {
    fontWeight: 700,
    alignment: 'center',
    ...initialStyles, // Allow initialStyles to override defaults
  };
  
  const [styles, setStyles] = useState<TextStyles>(defaultStyles);
  const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition>({ top: 0, left: 0 });
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showHeadingPicker, setShowHeadingPicker] = useState(false);
  const [currentTag, setCurrentTag] = useState(tag);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });
  
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const toolbarAnimationFrame = useRef<number>();
  const editorIdRef = useRef<string>(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `inline-editor-${Math.random().toString(36).slice(2)}`
  );
  const Tag = currentTag;

  const sanitizeHtml = useCallback((html: string) => {
    if (!html) return '';
    if (typeof document === 'undefined') {
      return html.replace(/(&nbsp;|\s)+$/gi, '').trim();
    }

    const temp = document.createElement('div');
    temp.innerHTML = html;

    const blockTags = new Set(['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
    let changed = true;

    const isElementEffectivelyEmpty = (el: HTMLElement) => {
      const textContent = el.textContent?.replace(/\u00a0/g, '').trim() ?? '';
      if (textContent) return false;
      const htmlContent = el.innerHTML
        .replace(/<br\s*\/?>/gi, '')
        .replace(/&nbsp;/gi, '')
        .trim();
      return htmlContent.length === 0;
    };

    const isNodeEmpty = (node: ChildNode) => {
      if (!node) return true;
      if (node.nodeType === Node.TEXT_NODE) {
        return !(node.textContent?.replace(/\u00a0/g, '').trim());
      }
      if (node.nodeName === 'BR') return true;
      if (node instanceof HTMLElement) {
        return isElementEffectivelyEmpty(node);
      }
      return false;
    };

    while (changed) {
      changed = false;
      if (temp.childNodes.length === 1) {
        const firstChild = temp.firstChild;
        if (firstChild instanceof HTMLElement && blockTags.has(firstChild.tagName)) {
          temp.innerHTML = firstChild.innerHTML;
          changed = true;
        } else if (isNodeEmpty(firstChild!)) {
          temp.removeChild(firstChild!);
          changed = true;
        }
      }
    }

    const trimEdges = (node: HTMLElement) => {
      while (node.firstChild && isNodeEmpty(node.firstChild)) {
        node.removeChild(node.firstChild);
      }
      while (node.lastChild && isNodeEmpty(node.lastChild)) {
        node.removeChild(node.lastChild);
      }
    };

    trimEdges(temp);

    const cleaned = temp.innerHTML
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+$/g, '')
      .trim();

    return cleaned;
  }, []);

  const startEditing = useCallback(() => {
    window.dispatchEvent(new CustomEvent('inline-editor-activate', { detail: editorIdRef.current }));
    startEditingInternal();
  }, [startEditingInternal]);
  
  // Update currentTag when tag prop changes
  useEffect(() => {
    console.log('📝 Tag prop changed:', tag, '→ Updating currentTag');
    const oldTag = currentTag;
    setCurrentTag(tag);
    
    // If tag changed while editing, restore content
    if (isEditing && oldTag !== tag && editorRef.current) {
      const currentContent = editorRef.current.innerHTML || value;
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = currentContent;
          editorRef.current.focus();
        }
      }, 0);
    }
  }, [tag, isEditing, currentTag, value]);

  // Update value when content prop changes
  useEffect(() => {
    const cleaned = sanitizeHtml(content);
    setValue(cleaned);
  }, [content, sanitizeHtml]);

  // Set initial HTML content when entering edit mode
  useEffect(() => {
    if (isEditing && editorRef.current) {
      // Set innerHTML only once when entering edit mode
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
      // Focus the editor
      editorRef.current.focus();
      // Move cursor to end
      const range = document.createRange();
      const selection = window.getSelection();
      if (editorRef.current.childNodes.length > 0) {
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [isEditing, value]);

  // Sync styles with initialStyles when props change (e.g., from settings panel)
  // This allows toolbar to reflect settings panel changes in real-time
  useEffect(() => {
    console.log('🔄 Syncing styles from initialStyles:', initialStyles);
    console.log('📊 Current styles:', styles);
    console.log('📊 External styles color:', externalStyles.color);
    
    setStyles(prev => {
      // Only update if values actually changed to prevent unnecessary re-renders
      const hasChanged = 
        prev.bold !== initialStyles.bold ||
        prev.italic !== initialStyles.italic ||
        prev.underline !== initialStyles.underline ||
        prev.strikethrough !== initialStyles.strikethrough ||
        prev.alignment !== initialStyles.alignment ||
        prev.color !== initialStyles.color;
      
      console.log('🔍 Comparison:', {
        'prev.color': prev.color,
        'initialStyles.color': initialStyles.color,
        'hasChanged': hasChanged
      });
      
      if (hasChanged) {
        console.log('✅ Styles changed, updating to:', initialStyles);
        return initialStyles;
      }
      console.log('⏭️ Styles unchanged, skipping update');
      return prev;
    });
  }, [initialStyles.bold, initialStyles.italic, initialStyles.underline, initialStyles.strikethrough, initialStyles.alignment, initialStyles.color, styles, externalStyles.color]);

  const getSelectionRect = useCallback((): DOMRect | null => {
    if (!editorRef.current) return null;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const ancestor =
        range.commonAncestorContainer instanceof Element
          ? range.commonAncestorContainer
          : range.commonAncestorContainer.parentElement;
      if (ancestor && editorRef.current.contains(ancestor)) {
        const rects = range.getClientRects();
        if (rects.length > 0) {
          return rects[rects.length - 1];
        }
        const rect = range.getBoundingClientRect();
        if (rect && (rect.width !== 0 || rect.height !== 0)) {
          return rect;
        }
      }
    }
    return editorRef.current.getBoundingClientRect();
  }, []);

  // Calculate toolbar position
  const updateToolbarPosition = useCallback(() => {
    if (!editorRef.current) return;
    const targetRect = getSelectionRect();
    if (!targetRect) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const toolbarWidth = toolbarRef.current?.offsetWidth ?? 320;
    const toolbarHeight = toolbarRef.current?.offsetHeight ?? 48;

    setToolbarPosition({
      top: Math.max(scrollTop + targetRect.top - toolbarHeight - 12, scrollTop + 12),
      left: scrollLeft + targetRect.left + (targetRect.width || 0) / 2 - toolbarWidth / 2,
    });
  }, [getSelectionRect]);

  const scheduleToolbarPosition = useCallback(() => {
    if (!isEditing) return;
    if (toolbarAnimationFrame.current) {
      cancelAnimationFrame(toolbarAnimationFrame.current);
    }
    toolbarAnimationFrame.current = window.requestAnimationFrame(() => {
      updateToolbarPosition();
    });
  }, [isEditing, updateToolbarPosition]);

  // Handle double-click to start editing
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    console.log('🖱️ Double-click detected!');
    e.preventDefault();
    e.stopPropagation();
    startEditing();
    console.log('✏️ Editing mode started');
  }, [startEditing]);

  // Save changes (preserves HTML for rich text formatting)
  const handleSave = useCallback(() => {
    // Use innerHTML to preserve rich text formatting (bold, italic, colors, etc.)
    const rawContent = editorRef.current?.innerHTML || '';
    const cleanedContent = sanitizeHtml(rawContent);

    if (editorRef.current && cleanedContent !== rawContent) {
      editorRef.current.innerHTML = cleanedContent;
    }

    if (cleanedContent !== content) {
      console.log('💾 Saving rich text content:', cleanedContent);
      onChange(cleanedContent);
    }

    setValue(cleanedContent);
    // Note: Styles are already saved in real-time via onStyleChange in toggle/set functions
  }, [content, onChange, sanitizeHtml]);

  // Close editor when clicking outside (but not on toolbar)
  useClickOutside(editorRef as React.RefObject<HTMLElement>, useCallback((event: MouseEvent | TouchEvent) => {
    if (isEditing) {
      // Don't close if clicking on toolbar
      if (toolbarRef.current?.contains(event.target as Node)) {
        return;
      }
      handleSave();
      stopEditing();
    }
  }, [isEditing, handleSave, stopEditing]));

  useEffect(() => {
    const handleActivation = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail !== editorIdRef.current && isEditing) {
        handleSave();
        stopEditing();
      }
    };

    window.addEventListener('inline-editor-activate', handleActivation as EventListener);
    return () => {
      window.removeEventListener('inline-editor-activate', handleActivation as EventListener);
    };
  }, [handleSave, isEditing, stopEditing]);

  // Focus and select all when editing starts
  useEffect(() => {
    if (isEditing && editorRef.current) {
      // Detect active formats when entering edit mode
      setTimeout(() => detectActiveFormats(), 50);
      editorRef.current.focus();
      scheduleToolbarPosition();
      
      // Select all text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing, scheduleToolbarPosition]); // detectActiveFormats called in setTimeout, not needed in deps

  useLayoutEffect(() => {
    if (!isEditing) return;
    const handleDynamicPosition = () => scheduleToolbarPosition();
    document.addEventListener('selectionchange', handleDynamicPosition);
    window.addEventListener('scroll', handleDynamicPosition, true);
    window.addEventListener('resize', handleDynamicPosition);
    return () => {
      document.removeEventListener('selectionchange', handleDynamicPosition);
      window.removeEventListener('scroll', handleDynamicPosition, true);
      window.removeEventListener('resize', handleDynamicPosition);
    };
  }, [isEditing, scheduleToolbarPosition]);

  useEffect(() => {
    return () => {
      if (toolbarAnimationFrame.current) {
        cancelAnimationFrame(toolbarAnimationFrame.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!isEditing) return;
    scheduleToolbarPosition();
  }, [
    isEditing,
    scheduleToolbarPosition,
    styles.fontWeight,
    styles.bold,
    styles.italic,
    styles.underline,
    styles.strikethrough,
    styles.alignment,
    showFontPicker,
    showColorPicker,
    showHeadingPicker,
    showLinkInput,
  ]);

  // Save and restore selection
  const savedSelection = useRef<Range | null>(null);

  // Detect active formatting from current selection
  const detectActiveFormats = useCallback(() => {
    if (!isEditing) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    let parentElement = range.commonAncestorContainer.parentElement;
    
    // Walk up the DOM tree to check for formatting (same logic as toggle)
    let hasBold = false;
    let hasItalic = false;
    let hasUnderline = false;
    let hasStrikethrough = false;
    
    let currentElement = parentElement;
    while (currentElement && currentElement !== editorRef.current) {
      const style = window.getComputedStyle(currentElement);
      const tagName = currentElement.tagName.toLowerCase();
      
      // Check for bold
      if (style.fontWeight === 'bold' || style.fontWeight === '700' || parseInt(style.fontWeight) >= 700 || tagName === 'strong' || tagName === 'b') {
        hasBold = true;
      }
      
      // Check for italic
      if (style.fontStyle === 'italic' || tagName === 'em' || tagName === 'i') {
        hasItalic = true;
      }
      
      // Check for underline
      if (style.textDecoration.includes('underline') || tagName === 'u') {
        hasUnderline = true;
      }
      
      // Check for strikethrough
      if (style.textDecoration.includes('line-through') || tagName === 's' || tagName === 'strike') {
        hasStrikethrough = true;
      }
      
      currentElement = currentElement.parentElement;
    }
    
    setActiveFormats({
      bold: hasBold,
      italic: hasItalic,
      underline: hasUnderline,
      strikethrough: hasStrikethrough,
    });
  }, [isEditing]);

  // Save selection
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0).cloneRange();
      console.log('💾 Saved selection:', savedSelection.current);
    }
  }, []);

  const restoreSelection = useCallback(() => {
    if (savedSelection.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedSelection.current);
      console.log('🔄 Restored selection:', savedSelection.current);
    }
  }, []);

  // Apply rich text formatting to selected text with proper color handling
  const applyRichTextFormat = useCallback((command: string, value?: string) => {
    if (!isEditing) return;
    
    console.log('📝 Applying rich text format:', command, value);
    
    // Restore selection if we have one saved
    restoreSelection();
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // For color changes, we need special handling to preserve text-decoration colors
    if (command === 'foreColor' && value) {
      const selectedContent = range.extractContents();
      
      // Create a span with inline styles for color and text-decoration-color
      const span = document.createElement('span');
      span.style.color = value;
      span.style.textDecorationColor = value; // Underline matches text color
      span.appendChild(selectedContent);
      
      range.insertNode(span);
      
      // Update the range to select the new span
      range.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (command === 'bold') {
      // Handle bold with proper toggle
      let parentElement = range.commonAncestorContainer.parentElement;
      
      // Check if we're inside a bold element
      let boldElement: HTMLElement | null = null;
      let currentElement = parentElement;
      
      while (currentElement && currentElement !== editorRef.current) {
        const style = window.getComputedStyle(currentElement);
        const tagName = currentElement.tagName.toLowerCase();
        if (style.fontWeight === 'bold' || style.fontWeight === '700' || parseInt(style.fontWeight) >= 700 || tagName === 'strong' || tagName === 'b') {
          boldElement = currentElement;
          break;
        }
        currentElement = currentElement.parentElement;
      }
      
      if (boldElement) {
        // Remove bold by unwrapping
        const parent = boldElement.parentNode;
        const textContent = boldElement.textContent || '';
        
        // Create a text node to replace the element
        const textNode = document.createTextNode(textContent);
        parent?.replaceChild(textNode, boldElement);
        
        // Re-select the text node
        const newRange = document.createRange();
        newRange.selectNodeContents(textNode);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        // Save the new selection
        saveSelection();
      } else {
        // Add bold using <strong> tag
        const selectedContent = range.extractContents();
        const strong = document.createElement('strong');
        strong.appendChild(selectedContent);
        
        range.insertNode(strong);
        
        // Update the range to select the new element
        range.selectNodeContents(strong);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else if (command === 'underline') {
      // Handle underline with proper toggle using <u> tag
      let parentElement = range.commonAncestorContainer.parentElement;
      
      // Check if we're inside an underline element
      let underlineElement: HTMLElement | null = null;
      let currentElement = parentElement;
      
      while (currentElement && currentElement !== editorRef.current) {
        const style = window.getComputedStyle(currentElement);
        const tagName = currentElement.tagName.toLowerCase();
        if (style.textDecoration.includes('underline') || tagName === 'u') {
          underlineElement = currentElement;
          break;
        }
        currentElement = currentElement.parentElement;
      }
      
      if (underlineElement) {
        // Remove underline by unwrapping
        const parent = underlineElement.parentNode;
        const textContent = underlineElement.textContent || '';
        
        // Create a text node to replace the element
        const textNode = document.createTextNode(textContent);
        parent?.replaceChild(textNode, underlineElement);
        
        // Re-select the text node
        const newRange = document.createRange();
        newRange.selectNodeContents(textNode);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        // Save the new selection
        saveSelection();
      } else {
        // Add underline using <u> tag
        const selectedContent = range.extractContents();
        const u = document.createElement('u');
        u.appendChild(selectedContent);
        
        range.insertNode(u);
        
        // Update the range to select the new element
        range.selectNodeContents(u);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else if (command === 'strikeThrough') {
      // Handle strikethrough with proper toggle using <s> tag
      let parentElement = range.commonAncestorContainer.parentElement;
      
      // Check if we're inside a strikethrough element
      let strikeElement: HTMLElement | null = null;
      let currentElement = parentElement;
      
      while (currentElement && currentElement !== editorRef.current) {
        const style = window.getComputedStyle(currentElement);
        const tagName = currentElement.tagName.toLowerCase();
        if (style.textDecoration.includes('line-through') || tagName === 's' || tagName === 'strike') {
          strikeElement = currentElement;
          break;
        }
        currentElement = currentElement.parentElement;
      }
      
      if (strikeElement) {
        // Remove strikethrough by unwrapping
        const parent = strikeElement.parentNode;
        const textContent = strikeElement.textContent || '';
        
        // Create a text node to replace the element
        const textNode = document.createTextNode(textContent);
        parent?.replaceChild(textNode, strikeElement);
        
        // Re-select the text node
        const newRange = document.createRange();
        newRange.selectNodeContents(textNode);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        // Save the new selection
        saveSelection();
      } else {
        // Add strikethrough using <s> tag
        const selectedContent = range.extractContents();
        const s = document.createElement('s');
        s.appendChild(selectedContent);
        
        range.insertNode(s);
        
        // Update the range to select the new element
        range.selectNodeContents(s);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else if (command === 'italic') {
      // Handle italic with proper toggle
      let parentElement = range.commonAncestorContainer.parentElement;
      
      // Check if we're inside an italic element
      let italicElement: HTMLElement | null = null;
      let currentElement = parentElement;
      
      while (currentElement && currentElement !== editorRef.current) {
        const style = window.getComputedStyle(currentElement);
        const tagName = currentElement.tagName.toLowerCase();
        if (style.fontStyle === 'italic' || tagName === 'em' || tagName === 'i') {
          italicElement = currentElement;
          break;
        }
        currentElement = currentElement.parentElement;
      }
      
      if (italicElement) {
        // Remove italic by unwrapping
        const parent = italicElement.parentNode;
        const textContent = italicElement.textContent || '';
        
        // Create a text node to replace the element
        const textNode = document.createTextNode(textContent);
        parent?.replaceChild(textNode, italicElement);
        
        // Re-select the text node
        const newRange = document.createRange();
        newRange.selectNodeContents(textNode);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        // Save the new selection
        saveSelection();
      } else {
        // Add italic using <em> tag
        const selectedContent = range.extractContents();
        const em = document.createElement('em');
        em.appendChild(selectedContent);
        
        range.insertNode(em);
        
        // Update the range to select the new element
        range.selectNodeContents(em);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      // For other commands, use execCommand (deprecated but still works for some cases)
      document.execCommand(command, false, value);
    }
    
    // Save the new selection
    saveSelection();
    
    // Restore focus to editor and ensure selection is visible
    if (editorRef.current) {
      editorRef.current.focus();
      
      // Re-apply the selection to make it visible
      setTimeout(() => {
        if (savedSelection.current) {
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(savedSelection.current);
        }
      }, 0);
      
      // Save the updated HTML content immediately
      const newContent = editorRef.current.innerHTML;
      setValue(newContent);
      onChange(newContent);
      console.log('💾 Rich text content updated:', newContent);
      
      // Update active format indicators
      setTimeout(() => detectActiveFormats(), 0);
    }
    scheduleToolbarPosition();
  }, [isEditing, restoreSelection, saveSelection, onChange]); // detectActiveFormats called in setTimeout

  // Toggle text style (for rich text, applies to selection)
  const toggleStyle = useCallback((style: keyof TextStyles) => {
    console.log('🎨 Toggling style:', style);
    
    // If editing, apply to selected text (rich text mode)
    if (isEditing) {
      const selection = window.getSelection();
      const hasSelection = selection && selection.toString().length > 0;
      
      if (hasSelection) {
        // Save selection before applying
        saveSelection();
        
        // Apply to selection only
        switch (style) {
          case 'bold':
            applyRichTextFormat('bold');
            break;
          case 'italic':
            applyRichTextFormat('italic');
            break;
          case 'underline':
            applyRichTextFormat('underline');
            break;
          case 'strikethrough':
            applyRichTextFormat('strikeThrough');
            break;
        }
        
        // Immediately detect active formats after applying
        setTimeout(() => detectActiveFormats(), 0);
        scheduleToolbarPosition();
        return;
      }
    }
    
    // Otherwise, apply to entire element (global style)
    const newStyles = {
      ...styles,
      [style]: !styles[style],
    };
    console.log('📝 New styles:', newStyles);
    
    setStyles(newStyles);
    
    // Update the store after state update
    if (onStyleChange) {
      setTimeout(() => onStyleChange(newStyles), 0);
    }
    
    // Detect active formats after style change
    setTimeout(() => detectActiveFormats(), 0);
    scheduleToolbarPosition();
  }, [isEditing, onStyleChange, applyRichTextFormat, styles]); // detectActiveFormats called in setTimeout, not needed in deps

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Ctrl/Cmd + B = Bold
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      toggleStyle('bold');
    }
    // Ctrl/Cmd + I = Italic
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      toggleStyle('italic');
    }
    // Ctrl/Cmd + U = Underline
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
      toggleStyle('underline');
    }
    // Ctrl/Cmd + K = Link
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setShowLinkInput(true);
    }
    // Enter = Save and exit
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
      stopEditing();
    }
    // Escape = Cancel
    if (e.key === 'Escape') {
      e.preventDefault();
      setValue(content);
      stopEditing();
    }
  }, [toggleStyle, handleSave, stopEditing, content]);

  // Set alignment
  const setAlignment = useCallback((alignment: 'left' | 'center' | 'right') => {
    console.log('📐 Setting alignment:', alignment);
    setStyles(prev => {
      const newStyles = {
        ...prev,
        alignment,
      };
      console.log('📝 New styles with alignment:', newStyles);
      
      // Immediately update the store
      if (onStyleChange) {
        onStyleChange(newStyles);
      }
      
      return newStyles;
    });
    scheduleToolbarPosition();
  }, [onStyleChange]);

  // Update global text color (affects only text without inline color styles)
  const updateGlobalColor = useCallback((color: string) => {
    console.log('🌍 Updating global color:', color);
    
    if (editorRef.current) {
      // Update the base color style
      editorRef.current.style.color = color;
      
      // Update textDecorationColor for strikethrough
      editorRef.current.style.textDecorationColor = color;
      
      // Note: This won't affect spans with inline color styles
      // Those will keep their own colors
    }
    
    setStyles(prev => {
      const newStyles = {
        ...prev,
        color,
      };
      
      if (onStyleChange) {
        onStyleChange(newStyles);
      }
      
      return newStyles;
    });
    scheduleToolbarPosition();
  }, [onStyleChange]);

  // Apply link
  const applyLink = useCallback(() => {
    if (linkUrl) {
      setStyles(prev => ({
        ...prev,
        link: linkUrl,
      }));
    }
    setShowLinkInput(false);
    setLinkUrl('');
    scheduleToolbarPosition();
  }, [linkUrl]);

  // Remove link
  const removeLink = useCallback(() => {
    setStyles(prev => {
      const newStyles = { ...prev };
      delete newStyles.link;
      return newStyles;
    });
    scheduleToolbarPosition();
  }, []);

  // Clear all formatting from selected text OR reset entire element to defaults
  const clearFormatting = useCallback(() => {
    console.log('🧹 Clearing formatting');
    
    if (isEditing) {
      // First check if we have a saved selection
      if (savedSelection.current) {
        restoreSelection();
      }
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        if (selectedText) {
          console.log('🧹 Clearing formatting from selection:', selectedText);
          
          // Replace selected content with plain text
          const textNode = document.createTextNode(selectedText);
          range.deleteContents();
          range.insertNode(textNode);
          
          // Re-select the text node
          range.selectNodeContents(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
          
          // Save selection
          saveSelection();
          
          // Save the updated content
          if (editorRef.current) {
            const newContent = editorRef.current.innerHTML;
            setValue(newContent);
            onChange(newContent);
            console.log('✅ Formatting cleared from selection, content updated');
          }
          
          scheduleToolbarPosition();
          return;
        }
      }
    }
    
    // If no selection, reset EVERYTHING to default state
    if (editorRef.current) {
      const plainText = editorRef.current.textContent || '';
      editorRef.current.innerHTML = plainText;
      
      // Save the updated content
      setValue(plainText);
      onChange(plainText);
      
      // Reset ALL styles to default
      const defaultStyles: TextStyles = {
        fontWeight: 700,
        alignment: 'center',
      };
      setStyles(defaultStyles);
      
      // Notify parent to reset ALL element props to defaults
      if (onStyleChange) {
        onStyleChange(defaultStyles);
      }
      
      console.log('✅ All formatting cleared, element reset to defaults');
    }
    scheduleToolbarPosition();
  }, [isEditing, restoreSelection, saveSelection, onChange, onStyleChange]);

  // Apply font family
  const applyFontFamily = useCallback((fontFamily: string) => {
    console.log('🔤 Setting font family:', fontFamily);
    
    // If editing and has selection, apply to selected text only
    if (isEditing) {
      const selection = window.getSelection();
      const hasSelection = (selection && selection.toString().length > 0) || savedSelection.current;
      
      if (hasSelection) {
        if (selection && selection.toString().length > 0) {
          saveSelection();
        }
        
        // Apply font family to selection
        restoreSelection();
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          const selectedContent = range.extractContents();
          
          const span = document.createElement('span');
          span.style.fontFamily = fontFamily;
          span.appendChild(selectedContent);
          
          range.insertNode(span);
          
          range.selectNodeContents(span);
          sel.removeAllRanges();
          sel.addRange(range);
        }
        
        saveSelection();
        editorRef.current?.focus();
        
        // Save the updated content
        if (editorRef.current) {
          const newContent = editorRef.current.innerHTML;
          setValue(newContent);
          onChange(newContent);
        }
        
        scheduleToolbarPosition();
        return;
      }
    }
    
    // Otherwise, apply to entire element
    setStyles(prev => {
      const newStyles = {
        ...prev,
        fontFamily,
      };
      
      if (onStyleChange) {
        onStyleChange(newStyles);
      }
      
      return newStyles;
    });
    scheduleToolbarPosition();
  }, [isEditing, saveSelection, restoreSelection, onStyleChange, onChange]);

  // Apply color (supports rich text for selected text)
  const applyColor = useCallback((color: string) => {
    console.log('🎨 Setting color:', color);
    
    // If editing and has selection, apply to selected text only (rich text mode)
    if (isEditing) {
      // Check if we have a saved selection or current selection
      const selection = window.getSelection();
      const hasSelection = (selection && selection.toString().length > 0) || savedSelection.current;
      
      if (hasSelection) {
        // Save selection if we have one
        if (selection && selection.toString().length > 0) {
          saveSelection();
        }
        
        // Apply color to selection only (with text-decoration-color matching)
        applyRichTextFormat('foreColor', color);
        
        // DON'T close color picker - keep it open for multiple color changes
        // setShowColorPicker(false);
        scheduleToolbarPosition();
        return;
      }
    }
    
    // Otherwise, apply to entire element (global style - won't affect rich text spans)
    updateGlobalColor(color);
    setShowColorPicker(false);
    scheduleToolbarPosition();
  }, [isEditing, applyRichTextFormat, saveSelection, updateGlobalColor]);

  // Popular Google Fonts
  const popularFonts = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Raleway',
    'Nunito',
    'Playfair Display',
    'Merriweather',
  ];

  // Render floating toolbar
  const renderToolbar = () => {
    if (!isEditing) return null;

    return (
      <div
        ref={toolbarRef}
        className="fixed z-[1000000] bg-black/95 text-white shadow-[0_15px_45px_rgba(0,0,0,0.65)] rounded-lg border border-white/40 p-2 flex items-center gap-1 flex-wrap max-w-4xl [&_button]:text-white [&_button:hover]:bg-white/10"
        style={{
          top: `${toolbarPosition.top}px`,
          left: `${toolbarPosition.left}px`,
        }}
      >
        {/* Heading Level (if tag is heading) */}
        {(currentTag === 'h1' || currentTag === 'h2' || currentTag === 'h3' || currentTag === 'h4' || currentTag === 'h5' || currentTag === 'h6') && (
          <div className="relative pr-2 border-r border-gray-200 dark:border-gray-700">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                console.log('🎯 Toolbar showing currentTag:', currentTag, 'tag prop:', tag);
                setShowHeadingPicker(!showHeadingPicker);
              scheduleToolbarPosition();
              }}
              title="Heading Level"
            >
              <Heading size={14} className="mr-1" />
              {currentTag.toUpperCase()}
            </Button>
            
            {showHeadingPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowHeadingPicker(false)} />
                <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 w-32">
                  {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((level) => (
                    <button
                      key={level}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        console.log('Change heading to:', level);
                        const newTag = level as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                        
                        // Save current content and selection
                        const currentContent = editorRef.current?.innerHTML || value;
                        saveSelection();
                        
                        // Update tag
                        setCurrentTag(newTag);
                        if (onTagChange) {
                          onTagChange(newTag);
                        }
                        setShowHeadingPicker(false);
                        
                        // Restore content and focus after React updates
                        setTimeout(() => {
                          if (editorRef.current) {
                            editorRef.current.innerHTML = currentContent;
                            editorRef.current.focus();
                            restoreSelection();
                          }
                        }, 0);
                      }}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Font Family Picker */}
        <div className="relative pr-2 border-r border-gray-200 dark:border-gray-700">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-xs max-w-[140px]"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setShowFontPicker(!showFontPicker);
              scheduleToolbarPosition();
            }}
            title="Font Family"
          >
            <Type size={14} className="mr-1 flex-shrink-0" />
            <span 
              className="truncate"
              style={{ fontFamily: styles.fontFamily || (externalStyles.fontFamily as string) || 'inherit' }}
            >
              {styles.fontFamily || (externalStyles.fontFamily as string) || 'Default'}
            </span>
          </Button>
          
          {showFontPicker && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => {
                  setShowFontPicker(false);
                  scheduleToolbarPosition();
                }}
              />
              <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 w-48 max-h-64 overflow-y-auto">
                {popularFonts.map((font) => (
                  <button
                    key={font}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                    style={{ fontFamily: font }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      applyFontFamily(font);
                      setShowFontPicker(false);
                      scheduleToolbarPosition();
                    }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Clear Formatting */}
        <div className="pr-2 border-r border-gray-200 dark:border-gray-700">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onMouseDown={(e) => e.preventDefault()}
            onClick={clearFormatting}
            title="Clear Formatting"
          >
            <Eraser size={16} />
          </Button>
        </div>

        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
          <Button
            size="sm"
            variant={activeFormats.bold ? 'default' : 'ghost'}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleStyle('bold');
            }}
            title="Bold (Ctrl+B)"
          >
            <Bold size={16} />
          </Button>
          <Button
            size="sm"
            variant={activeFormats.italic ? 'default' : 'ghost'}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleStyle('italic');
            }}
            title="Italic (Ctrl+I)"
          >
            <Italic size={16} />
          </Button>
          <Button
            size="sm"
            variant={activeFormats.underline ? 'default' : 'ghost'}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleStyle('underline');
            }}
            title="Underline (Ctrl+U)"
          >
            <Underline size={16} />
          </Button>
          <Button
            size="sm"
            variant={activeFormats.strikethrough ? 'default' : 'ghost'}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleStyle('strikethrough');
            }}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
          <Button
            size="sm"
            variant={styles.alignment === 'left' ? 'default' : 'ghost'}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAlignment('left');
            }}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </Button>
          <Button
            size="sm"
            variant={styles.alignment === 'center' ? 'default' : 'ghost'}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAlignment('center');
            }}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </Button>
          <Button
            size="sm"
            variant={styles.alignment === 'right' ? 'default' : 'ghost'}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAlignment('right');
            }}
            title="Align Right"
          >
            <AlignRight size={16} />
          </Button>
        </div>

        {/* Color Picker - Simple button that shows current color */}
        <div className="relative">
          <Button
            size="sm"
            variant={showColorPicker ? 'default' : 'ghost'}
            className="h-8 w-8 p-0 relative"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
              scheduleToolbarPosition();
            }}
            title="Text Color"
          >
            <Type size={16} />
            {/* Show current color indicator */}
            <div 
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white dark:border-gray-800"
              style={{ backgroundColor: styles.color || externalStyles.color || '#000000' }}
            />
          </Button>
          
          {/* Inline color picker dropdown */}
          {showColorPicker && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => {
                  setShowColorPicker(false);
                  scheduleToolbarPosition();
                }}
              />
              
              {/* Color picker panel */}
              <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 w-64">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Text Color</p>
                
                {/* Quick Colors Grid */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#6366f1', '#f43f5e', '#000000', '#ffffff', '#64748b', '#94a3b8'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🎨 Preset color clicked:', preset);
                        applyColor(preset);
                      }}
                      className="w-full h-8 rounded-md border-2 hover:border-blue-500 transition-all hover:scale-110"
                      style={{ 
                        backgroundColor: preset,
                        borderColor: preset === (styles.color || externalStyles.color) ? '#3b82f6' : '#d1d5db'
                      }}
                      title={preset}
                    />
                  ))}
                </div>
                
                {/* Custom color input */}
                <Input 
                  type="color" 
                  value={styles.color || externalStyles.color || '#000000'} 
                  onChange={(e) => {
                    e.stopPropagation();
                    applyColor(e.target.value);
                  }}
                  className="w-full h-10 cursor-pointer" 
                />
              </div>
            </>
          )}
        </div>

        {/* Link */}
        {!showLinkInput ? (
          <div className="flex items-center gap-1 pl-2 border-l border-gray-200 dark:border-gray-700">
            <Button
              size="sm"
              variant={styles.link ? 'default' : 'ghost'}
              className="h-8 w-8 p-0"
              onClick={() => {
                setShowLinkInput(true);
                scheduleToolbarPosition();
              }}
              title="Add Link (Ctrl+K)"
            >
              <Link2 size={16} />
            </Button>
            {styles.link && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={removeLink}
                title="Remove Link"
              >
                <Unlink size={16} />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 pl-2 border-l border-gray-200 dark:border-gray-700">
            <Input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="h-8 w-48 text-xs"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  applyLink();
                }
                if (e.key === 'Escape') {
                  setShowLinkInput(false);
                  setLinkUrl('');
                  scheduleToolbarPosition();
                }
              }}
            />
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={applyLink}
              title="Apply Link"
            >
              <Check size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
                scheduleToolbarPosition();
              }}
              title="Cancel"
            >
              <X size={16} />
            </Button>
          </div>
        )}

        {/* AI Enhance (Future) */}
        <div className="pl-2 border-l border-gray-200 dark:border-gray-700">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-xs"
            title="AI Enhance (Coming Soon)"
            disabled
          >
            <Sparkles size={14} className="mr-1" />
            AI
          </Button>
        </div>
      </div>
    );
  };

  // Calculate applied styles (merge external styles with inline editor styles)
  const appliedStyles: React.CSSProperties = useMemo(() => {
    const decorations = [
      styles.underline && 'underline',
      styles.strikethrough && 'line-through',
    ].filter(Boolean).join(' ');

    const baseColor = styles.color || externalStyles.color || '#000000';
    
    // Use fontWeight if available, otherwise fall back to bold flag or external fontWeight
    const fontWeight = styles.fontWeight || 
                      (styles.bold ? 700 : undefined) || 
                      externalStyles.fontWeight;

    // Default font sizes for heading levels
    const headingSizes: Record<string, string> = {
      h1: '2.5rem',   // 40px
      h2: '2rem',     // 32px
      h3: '1.75rem',  // 28px
      h4: '1.5rem',   // 24px
      h5: '1.25rem',  // 20px
      h6: '1rem',     // 16px
    };

    // Get font size: styles.fontSize > externalStyles.fontSize > heading default > undefined
    const fontSize = styles.fontSize 
                    ? `${styles.fontSize}px` 
                    : externalStyles.fontSize 
                    ? externalStyles.fontSize 
                    : headingSizes[currentTag] 
                    ? headingSizes[currentTag] 
                    : undefined;

    return {
      ...externalStyles, // Apply external styles first
      fontWeight: fontWeight,
      fontSize: fontSize,
      fontStyle: styles.italic ? 'italic' : externalStyles.fontStyle,
      textDecoration: decorations || externalStyles.textDecoration || undefined,
      textDecorationColor: baseColor, // Strikethrough uses base text color
      textAlign: styles.alignment || externalStyles.textAlign,
      color: baseColor,
      margin: 0,
    };
  }, [styles, externalStyles, currentTag]);

  const plainTextValue = useMemo(() => {
    if (!value) return '';
    return value
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }, [value]);

  const hasVisibleContent = plainTextValue.length > 0;

  // Log style changes for debugging
  useEffect(() => {
    console.log('🎨 Applied styles updated:', appliedStyles);
  }, [appliedStyles]);

  if (isEditing) {
    return (
      <>
        {renderToolbar()}
        <Tag
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onKeyDown={handleKeyDown}
          onInput={(e) => {
            // Update value with sanitized HTML content for rich text support
            const newContent = sanitizeHtml(e.currentTarget.innerHTML);
            setValue(newContent);
          }}
          onBlur={(e) => {
            // Capture final sanitized HTML on blur
            const newContent = sanitizeHtml(e.currentTarget.innerHTML);
            setValue(newContent);
          }}
          onMouseUp={() => {
            // Save selection whenever user selects text
            saveSelection();
            detectActiveFormats();
            scheduleToolbarPosition();
          }}
          onKeyUp={() => {
            // Save selection when using keyboard to select
            saveSelection();
            detectActiveFormats();
            scheduleToolbarPosition();
          }}
          className={cn(
            'outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 transition-all',
            hasVisibleContent ? 'py-0 min-h-0' : 'py-1 min-h-[1.5em]',
            'bg-blue-50 dark:bg-blue-900/20',
            className
          )}
          style={appliedStyles}
        />
      </>
    );
  }

  // Render view mode
  if (!hasVisibleContent) {
    return (
      <Tag
        onDoubleClick={handleDoubleClick}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={cn(
          'cursor-text hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded px-2 py-1 transition-colors min-h-[1.5em]',
          'border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800',
          className
        )}
        style={appliedStyles}
        title="Double-click to edit"
      >
        <span className="text-gray-400 dark:text-gray-600">{placeholder}</span>
      </Tag>
    );
  }

  return (
    <Tag
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={cn(
        'cursor-text hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded px-2 transition-colors py-0 min-h-0',
        'border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800',
        className
      )}
      style={appliedStyles}
      title="Double-click to edit"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
});
