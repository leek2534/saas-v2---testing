"use client";



import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SimpleTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  placeholder?: string;
  className?: string;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onStopEdit?: () => void;
  externalStyles?: React.CSSProperties;
}

export function SimpleTextEditor({
  content,
  onChange,
  tag = 'h1',
  placeholder = 'Type here...',
  className = '',
  isEditing = false,
  onStartEdit,
  onStopEdit,
  externalStyles = {},
}: SimpleTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // Extract text content from HTML
  const getTextContent = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  };

  // Update content when prop changes (but not while editing)
  useEffect(() => {
    if (editorRef.current && !isEditing) {
      const textContent = getTextContent(content);
      editorRef.current.textContent = textContent;
      setIsEmpty(!textContent);
    }
  }, [content, isEditing]);

  // Handle input changes
  const handleInput = () => {
    if (!editorRef.current) return;
    
    const textContent = editorRef.current.textContent || '';
    setIsEmpty(!textContent);
    
    // Create clean HTML with just the tag and text
    const cleanHtml = textContent ? `<${tag}>${textContent}</${tag}>` : `<${tag}></${tag}>`;
    onChange(cleanHtml);
  };

  // Handle blur (stop editing)
  const handleBlur = () => {
    if (onStopEdit) {
      onStopEdit();
    }
  };

  // Handle double click (start editing)
  const handleDoubleClick = () => {
    if (onStartEdit) {
      onStartEdit();
    }
  };

  // Focus when editing starts
  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus();
      // Move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      if (editorRef.current.childNodes.length > 0) {
        range.setStart(editorRef.current.childNodes[0], editorRef.current.textContent?.length || 0);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }, [isEditing]);

  const Tag = tag as keyof JSX.IntrinsicElements;

  return (
    <Tag
      ref={editorRef as any}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleBlur}
      onDoubleClick={handleDoubleClick}
      className={cn(
        'outline-none',
        isEmpty && !isEditing && 'text-gray-400',
        className
      )}
      style={{
        ...externalStyles,
        cursor: isEditing ? 'text' : 'pointer',
      }}
      data-placeholder={isEmpty && !isEditing ? placeholder : undefined}
    >
      {!isEditing && isEmpty ? placeholder : null}
    </Tag>
  );
}
