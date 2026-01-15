"use client";



import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, BaseEditor, Text } from 'slate';
import { Slate, Editable, withReact, ReactEditor, RenderLeafProps, RenderElementProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Link2, Unlink, Heading, Palette, Type as TypeIcon,
  RemoveFormatting
} from 'lucide-react';

// Extend Slate types
type CustomElement = {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  align?: 'left' | 'center' | 'right' | 'justify';
  children: CustomText[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  color?: string;
  fontFamily?: string;
  link?: string;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface SlateTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onTagChange?: (tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p') => void;
  onAlignmentChange?: (alignment: 'left' | 'center' | 'right' | 'justify') => void;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  placeholder?: string;
  className?: string;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onStopEdit?: () => void;
  externalStyles?: React.CSSProperties;
}

// Convert HTML to Slate value (preserving formatting)
const htmlToSlate = (html: string, tag: string): Descendant[] => {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Handle paragraph vs heading tags
  const level = tag === 'p' ? 1 : (parseInt(tag.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6);
  
  // Parse HTML and preserve formatting
  const parseNode = (node: Node): CustomText[] => {
    if (node.nodeType === Node.TEXT_NODE) {
      return [{ text: node.textContent || '' }];
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const children: CustomText[] = [];
      
      Array.from(node.childNodes).forEach(child => {
        const parsed = parseNode(child);
        parsed.forEach(textNode => {
          const formatted: CustomText = { ...textNode };
          
          // Apply formatting based on parent tags
          if (element.tagName === 'STRONG' || element.tagName === 'B') {
            formatted.bold = true;
          }
          if (element.tagName === 'EM' || element.tagName === 'I') {
            formatted.italic = true;
          }
          if (element.tagName === 'U') {
            formatted.underline = true;
          }
          if (element.tagName === 'S' || element.tagName === 'STRIKE') {
            formatted.strikethrough = true;
          }
          if (element.tagName === 'SPAN' && element.style.color) {
            formatted.color = element.style.color;
          }
          if (element.tagName === 'A' && element.getAttribute('href')) {
            formatted.link = element.getAttribute('href') || undefined;
          }
          if (element.style.fontFamily) {
            formatted.fontFamily = element.style.fontFamily;
          }
          
          children.push(formatted);
        });
      });
      
      return children.length > 0 ? children : [{ text: '' }];
    }
    
    return [{ text: '' }];
  };
  
  const children = parseNode(div);
  
  return [
    {
      type: 'heading',
      level,
      children: children.length > 0 ? children : [{ text: '' }],
    },
  ];
};

// Convert Slate value to HTML
const slateToHtml = (value: Descendant[], tag: string): string => {
  const element = value[0] as CustomElement;
  if (!element || !element.children) return `<${tag}></${tag}>`;
  
  const text = element.children.map(child => {
    let content = child.text;
    if (child.bold) content = `<strong>${content}</strong>`;
    if (child.italic) content = `<em>${content}</em>`;
    if (child.underline) content = `<u>${content}</u>`;
    if (child.strikethrough) content = `<s>${content}</s>`;
    if (child.color) content = `<span style="color: ${child.color}">${content}</span>`;
    return content;
  }).join('');
  
  return `<${tag}>${text}</${tag}>`;
};

export function SlateTextEditor({
  content,
  onChange,
  onTagChange,
  onAlignmentChange,
  tag = 'h1',
  placeholder = 'Type here...',
  className = '',
  isEditing = false,
  onStartEdit,
  onStopEdit,
  externalStyles = {},
}: SlateTextEditorProps) {
  const [value, setValue] = useState<Descendant[]>(() => htmlToSlate(content, tag));
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showHeadingPicker, setShowHeadingPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ left: 0 });

  // Update value when content prop changes (but not while editing)
  useEffect(() => {
    if (!isEditing) {
      setValue(htmlToSlate(content, tag));
    }
  }, [content, tag, isEditing]);

  // Update toolbar position based on cursor/selection
  useEffect(() => {
    if (!isEditing) return;

    let timeoutId: NodeJS.Timeout;

    const updateToolbarPosition = () => {
      // Debounce to avoid interfering with text selection
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          if (editorRef.current) {
            const editorRect = editorRef.current.getBoundingClientRect();
            const left = rect.left - editorRect.left;
            setToolbarPosition({ left: Math.max(0, left) });
          }
        }
      }, 150); // Debounce by 150ms to not interfere with selection
    };

    // Update position on selection change
    document.addEventListener('selectionchange', updateToolbarPosition);
    
    // Initial position
    setTimeout(updateToolbarPosition, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('selectionchange', updateToolbarPosition);
    };
  }, [isEditing]);

  // Custom rendering for heading/paragraph element
  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props;
    const customElement = element as CustomElement;
    
    // Use paragraph tag if tag prop is 'p', otherwise use heading tag
    const ElementTag = tag === 'p' ? 'p' : (`h${customElement.level}` as keyof JSX.IntrinsicElements);
    
    return (
      <ElementTag {...attributes} style={externalStyles}>
        {children}
      </ElementTag>
    );
  }, [externalStyles, tag]);

  // Custom rendering for text with formatting
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let { attributes, children, leaf } = props;
    const customLeaf = leaf as CustomText;
    
    if (customLeaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (customLeaf.italic) {
      children = <em>{children}</em>;
    }
    if (customLeaf.underline) {
      children = <u>{children}</u>;
    }
    if (customLeaf.strikethrough) {
      children = <s>{children}</s>;
    }
    if (customLeaf.link) {
      children = (
        <a
          href={customLeaf.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-700"
        >
          {children}
        </a>
      );
    }
    
    return (
      <span
        {...attributes}
        style={{
          color: customLeaf.color,
          fontFamily: customLeaf.fontFamily,
        }}
      >
        {children}
      </span>
    );
  }, []);

  // Handle value changes
  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    const html = slateToHtml(newValue, tag);
    onChange(html);
  };

  // Toggle formatting
  const toggleFormat = (format: 'bold' | 'italic' | 'underline' | 'strikethrough') => {
    const marks = Editor.marks(editor);
    const isActive = marks ? marks[format] === true : false;
    
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  // Check if format is active
  const isFormatActive = (format: 'bold' | 'italic' | 'underline' | 'strikethrough') => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  // Display mode - double-click to edit
  if (!isEditing) {
    return (
      <div
        onDoubleClick={onStartEdit}
        className={cn('cursor-pointer', className)}
        style={externalStyles}
      >
        <Slate editor={editor} initialValue={value}>
          <Editable
            readOnly
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
          />
        </Slate>
      </div>
    );
  }

  // Heading level change handler
  const handleHeadingChange = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    const newTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    setShowHeadingPicker(false);
    if (onTagChange) {
      onTagChange(newTag);
    }
  };

  // Alignment change handler
  const handleAlignmentChange = (align: 'left' | 'center' | 'right' | 'justify') => {
    // Call the parent handler to update the element's alignment in the store
    if (onAlignmentChange) {
      onAlignmentChange(align);
    }
  };

  // Link handlers
  const addLink = () => {
    if (linkUrl) {
      Editor.addMark(editor, 'link', linkUrl);
      setShowLinkInput(false);
      setLinkUrl('');
    }
  };

  const removeLink = () => {
    Editor.removeMark(editor, 'link');
  };

  const isLinkActive = () => {
    const marks = Editor.marks(editor);
    return marks ? !!marks.link : false;
  };

  // Color handlers
  const applyColor = (color: string) => {
    Editor.addMark(editor, 'color', color);
    setShowColorPicker(false);
  };

  const getCurrentColor = () => {
    const marks = Editor.marks(editor);
    return marks?.color as string | undefined;
  };

  // Font family handlers
  const applyFontFamily = (font: string) => {
    Editor.addMark(editor, 'fontFamily', font);
    setShowFontPicker(false);
  };

  const getCurrentFont = () => {
    const marks = Editor.marks(editor);
    return marks?.fontFamily as string | undefined;
  };

  // Color presets
  const colorPresets = [
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB',
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#84CC16', '#06B6D4',
  ];

  // Font families
  const fontFamilies = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Verdana',
    'Trebuchet MS',
    'Impact',
    'Comic Sans MS',
    'Palatino',
  ];

  // Font sizes
  const fontSizes = [
    '12px', '14px', '16px', '18px', '20px', '24px', 
    '28px', '32px', '36px', '40px', '48px', '56px', '64px'
  ];

  // Font size handlers
  const applyFontSize = (size: string) => {
    Editor.addMark(editor, 'fontSize', size);
    setShowFontSizePicker(false);
  };

  const getCurrentFontSize = () => {
    const marks = Editor.marks(editor);
    return marks?.fontSize as string | undefined;
  };

  // Clear all formatting
  const clearFormatting = () => {
    Editor.removeMark(editor, 'bold');
    Editor.removeMark(editor, 'italic');
    Editor.removeMark(editor, 'underline');
    Editor.removeMark(editor, 'strikethrough');
    Editor.removeMark(editor, 'color');
    Editor.removeMark(editor, 'fontFamily');
    Editor.removeMark(editor, 'fontSize');
    Editor.removeMark(editor, 'link');
  };

  // Prevent toolbar from closing when clicking inside it
  const handleToolbarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Edit mode with floating toolbar
  return (
    <div className="relative">
      {/* Floating Toolbar - Positioned absolutely OUTSIDE container, overlapping above */}
      <div 
        data-toolbar="true"
        className="absolute -top-20 z-[1000000] flex items-center gap-2 p-2.5 bg-black/95 text-white rounded-lg border border-white/40 shadow-[0_12px_38px_rgba(0,0,0,0.65)] overflow-visible animate-in fade-in slide-in-from-top-4 duration-200 transition-all [&_button]:text-white [&_button:hover]:bg-white/10"
        style={{ left: `${toolbarPosition.left}px` }}
        onMouseDown={handleToolbarMouseDown}
      >
        {/* Heading Level Picker */}
        <div className="relative">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowHeadingPicker(!showHeadingPicker)}
            type="button"
            className="min-w-[60px]"
          >
            <Heading className="w-4 h-4 mr-1" />
            {tag.toUpperCase()}
          </Button>
          {showHeadingPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2 z-[10001] animate-in fade-in slide-in-from-top-2 duration-150">
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <button
                  key={level}
                  onClick={() => handleHeadingChange(level as any)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm transition-colors whitespace-nowrap"
                >
                  Heading {level}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Family Picker */}
        <div className="relative">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowFontPicker(!showFontPicker)}
            type="button"
            className="min-w-[100px] justify-start"
          >
            <div className="flex items-center gap-2 w-full">
              <TypeIcon className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 text-left overflow-hidden">
                <div className="text-xs truncate" style={{ fontFamily: getCurrentFont() || 'inherit' }}>
                  {getCurrentFont() || 'Default'}
                </div>
              </div>
            </div>
          </Button>
          {showFontPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3 z-[10001] max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 min-w-[200px]">
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 px-1">
                  Font Family
                </div>
                {fontFamilies.map((font) => (
                  <button
                    key={font}
                    onClick={() => applyFontFamily(font)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded text-sm transition-colors",
                      getCurrentFont() === font
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
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

        {/* Font Size Picker */}
        <div className="relative">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowFontSizePicker(!showFontSizePicker)}
            type="button"
            className="min-w-[70px] justify-start"
          >
            <div className="flex items-center gap-2 w-full">
              <TypeIcon className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="text-xs">
                  {getCurrentFontSize() || '16px'}
                </div>
              </div>
            </div>
          </Button>
          {showFontSizePicker && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2 z-[10001] max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 min-w-[120px]">
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 px-1">
                  Font Size
                </div>
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => applyFontSize(size)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded text-sm transition-colors",
                      getCurrentFontSize() === size
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        {/* Text Color */}
        <div className="relative">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowColorPicker(!showColorPicker)}
            type="button"
            className="px-2"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: getCurrentColor() || '#000000' }}
                title={getCurrentColor() || 'Default'}
              />
            </div>
          </Button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 z-[10001] animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Text Color
                </div>
                <div className="grid grid-cols-5 gap-2.5">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      onClick={() => applyColor(color)}
                      className={cn(
                        "w-8 h-8 rounded border-2 transition-all hover:scale-110",
                        getCurrentColor() === color 
                          ? "border-blue-500 ring-2 ring-blue-200" 
                          : "border-gray-300 hover:border-gray-500"
                      )}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        {/* Text Formatting */}
        <div className="flex items-center gap-0.5">
          <Button
          size="sm"
          variant={isFormatActive('bold') ? 'default' : 'ghost'}
          onClick={() => toggleFormat('bold')}
          type="button"
        >
          <Bold className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant={isFormatActive('italic') ? 'default' : 'ghost'}
          onClick={() => toggleFormat('italic')}
          type="button"
        >
          <Italic className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant={isFormatActive('underline') ? 'default' : 'ghost'}
          onClick={() => toggleFormat('underline')}
          type="button"
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant={isFormatActive('strikethrough') ? 'default' : 'ghost'}
          onClick={() => toggleFormat('strikethrough')}
          type="button"
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        
        {/* Clear Formatting */}
        <Button
          size="sm"
          variant="ghost"
          onClick={clearFormatting}
          type="button"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:border-gray-600" />

        {/* Alignment */}
        <div className="flex items-center gap-0.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleAlignmentChange('left')}
            type="button"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleAlignmentChange('center')}
            type="button"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleAlignmentChange('right')}
            type="button"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleAlignmentChange('justify')}
            type="button"
          >
            <AlignJustify className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

        {/* Link */}
        {!showLinkInput ? (
          <>
            <Button
              size="sm"
              variant={isLinkActive() ? 'default' : 'ghost'}
              onClick={() => setShowLinkInput(true)}
              type="button"
            >
              <Link2 className="w-4 h-4" />
            </Button>
            {isLinkActive() && (
              <Button
                size="sm"
                variant="ghost"
                onClick={removeLink}
                type="button"
              >
                <Unlink className="w-4 h-4" />
              </Button>
            )}
          </>
        ) : (
          <div className="flex items-center gap-1">
            <Input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="h-8 w-48 text-sm"
              autoFocus
            />
            <Button size="sm" onClick={addLink} type="button">
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowLinkInput(false)} type="button">
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Editor - No border, uses externalStyles */}
      <div
        className={cn('pt-2', className)}
        style={externalStyles}
      >
        <Slate editor={editor} initialValue={value} onChange={handleChange}>
          <Editable
            ref={editorRef as any}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            autoFocus
            onBlur={(e) => {
              // Delay blur check to allow toolbar clicks to register
              setTimeout(() => {
                const activeElement = document.activeElement;
                const toolbarElement = document.querySelector('[data-toolbar="true"]');
                
                // Only close if focus is truly outside editor and toolbar
                if (activeElement && 
                    !editorRef.current?.contains(activeElement) && 
                    !toolbarElement?.contains(activeElement)) {
                  onStopEdit?.();
                }
              }, 100);
            }}
            className="outline-none"
          />
        </Slate>
      </div>
    </div>
  );
}
