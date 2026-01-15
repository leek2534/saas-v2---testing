"use client";



import React, { useState, useRef, useEffect } from 'react';
import { useToggle, usePrevious } from '@/src/lib/utils/hooks';
import { cn } from '@/lib/utils';

interface InlineEditableTextProps {
  content: string;
  onChange: (newContent: string) => void;
  className?: string;
  placeholder?: string;
}

/**
 * InlineEditableText - Editable text component with keyboard shortcuts
 * 
 * @description
 * Allows users to click and edit text inline with support for:
 * - Enter to save
 * - Escape to cancel
 * - Shift+Enter for multiline
 * 
 * @example
 * ```tsx
 * <InlineEditableText
 *   content="Hello World"
 *   onChange={(newContent) => console.log(newContent)}
 *   placeholder="Enter text..."
 * />
 * ```
 * 
 * @param content - The text content to display and edit
 * @param onChange - Callback when content changes
 * @param className - Additional CSS classes
 * @param placeholder - Placeholder text when empty
 */
export function InlineEditableText({ 
  content, 
  onChange, 
  className = '', 
  placeholder = 'Enter text...' 
}: InlineEditableTextProps) {
  const [isEditing, toggleEditing, startEditing, stopEditing] = useToggle(false);
  const [value, setValue] = useState(content);
  const inputRef = useRef<HTMLDivElement>(null);
  const previousContent = usePrevious(content);

  // Update value when content prop changes
  useEffect(() => {
    if (content !== previousContent) {
      setValue(content);
    }
  }, [content, previousContent]);

  // Focus and place cursor at end when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      
      // Place cursor at end
      const range = document.createRange();
      const sel = window.getSelection();
      if (inputRef.current.childNodes.length > 0) {
        range.setStart(
          inputRef.current.childNodes[0], 
          inputRef.current.textContent?.length || 0
        );
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    const newContent = inputRef.current?.textContent || '';
    if (newContent !== content) {
      onChange(newContent);
    }
  };

  const handleBlur = () => {
    handleSave();
    stopEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setValue(content); // Revert to original
      inputRef.current?.blur();
    }
  };

  if (isEditing) {
    return (
      <div
        ref={inputRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'outline-none focus:ring-2 focus:ring-blue-500 rounded px-1',
          className
        )}
      >
        {value}
      </div>
    );
  }

  return (
    <div
      onClick={startEditing}
      className={cn(
        'cursor-text hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-1 transition-colors',
        className
      )}
    >
      {content || placeholder}
    </div>
  );
}
