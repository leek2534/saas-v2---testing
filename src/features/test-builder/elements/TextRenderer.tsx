"use client";

import React, { useRef, useCallback, KeyboardEvent, FocusEvent } from 'react';
import { TextContent, TextBlock, textToBlocks, blocksToText } from '../types/text.types';

// Zero-width space to prevent browser from injecting <br> or <div> on empty contentEditable
const ZERO_WIDTH_SPACE = '\u200B';

// Normalize blocks to ensure there's always content (prevents browser auto-injection)
function normalizeTextBlocks(blocks: TextBlock[]): TextBlock[] {
  if (!blocks || blocks.length === 0) {
    return [{ type: 'paragraph', text: '' }];
  }
  return blocks;
}

// Extract clean text from element, removing zero-width spaces and normalizing newlines
function extractCleanText(el: HTMLElement): string {
  return el.innerText
    .replace(/\u200B/g, '') // Remove zero-width spaces
    .replace(/\n{2,}/g, '\n') // Collapse multiple newlines
    .trim();
}

interface TextRendererProps {
  content: TextContent;
  onChange: (content: TextContent) => void;
  align: 'left' | 'center' | 'right';
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  style?: React.CSSProperties;
  maxWidth?: number;
  placeholder?: string;
}

/**
 * TextRenderer - Dumb renderer for structured text blocks
 * 
 * Features:
 * - No flex tricks
 * - No inherited column alignment
 * - Text controls alignment internally
 * - Simple contentEditable for editing
 * - Enter = new paragraph only
 * - Prevents extra newline on double-click (contentEditable trap fix)
 */
export function TextRenderer({
  content,
  onChange,
  align,
  isEditing,
  onStartEdit,
  onStopEdit,
  style,
  maxWidth = 800,
  placeholder = 'Click to edit text...'
}: TextRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const normalizedBlocks = normalizeTextBlocks(content.blocks);

  // Handle focus - prevent browser from injecting <br> or <div>
  const handleFocus = useCallback((e: FocusEvent<HTMLParagraphElement>) => {
    // If empty, insert zero-width space to prevent browser auto-injection
    if (e.currentTarget.innerText.replace(/\u200B/g, '').trim() === '') {
      e.currentTarget.innerHTML = ZERO_WIDTH_SPACE;
    }
  }, []);

  // Handle blur - save content with proper normalization
  const handleBlur = useCallback((e: FocusEvent<HTMLParagraphElement>, blockIndex: number) => {
    const text = extractCleanText(e.currentTarget);
    
    // Update the specific block
    const newBlocks = [...normalizedBlocks];
    newBlocks[blockIndex] = { ...newBlocks[blockIndex], text };
    
    // Filter out completely empty blocks (but keep at least one)
    const filteredBlocks = newBlocks.filter(b => b.text.trim() !== '');
    if (filteredBlocks.length === 0) {
      filteredBlocks.push({ type: 'paragraph', text: '' });
    }
    
    onChange({ blocks: filteredBlocks });
    onStopEdit();
  }, [normalizedBlocks, onChange, onStopEdit]);

  // Handle keydown - intercept Enter to prevent browser <div> injection
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLParagraphElement>, blockIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // For now, just blur on Enter (single paragraph editing)
      // TODO: Could insert new paragraph block here
      e.currentTarget.blur();
    }
    
    if (e.key === 'Escape') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }, []);

  // Click to start editing
  const handleClick = useCallback(() => {
    if (!isEditing) {
      onStartEdit();
    }
  }, [isEditing, onStartEdit]);

  // Container styles
  const containerStyle: React.CSSProperties = {
    textAlign: align,
    maxWidth: maxWidth,
    margin: align === 'center' ? '0 auto' : undefined,
    ...style,
  };

  // Get display text with zero-width space fallback
  const getDisplayText = (text: string) => {
    return text || ZERO_WIDTH_SPACE;
  };

  // Render blocks - contentEditable on each <p>, NOT on wrapper
  return (
    <div 
      ref={containerRef}
      style={containerStyle} 
      onClick={handleClick}
      className="cursor-text"
    >
      {normalizedBlocks.length === 0 || (normalizedBlocks.length === 1 && !normalizedBlocks[0].text) ? (
        isEditing ? (
          <p
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e, 0)}
            onKeyDown={(e) => handleKeyDown(e, 0)}
            className="outline-none focus:outline-none min-h-[1em] mb-0"
            style={{ margin: 0 }}
          >
            {ZERO_WIDTH_SPACE}
          </p>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )
      ) : (
        normalizedBlocks.map((block, i) => {
          if (block.type === 'heading') {
            // Headings use HeadingRenderer, but handle inline if needed
            return (
              <p key={i} className="mb-0" style={{ margin: 0 }}>
                {block.text || '\u00A0'}
              </p>
            );
          }
          
          // Paragraph blocks - contentEditable on the <p> itself
          if (isEditing) {
            return (
              <p
                key={i}
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                onFocus={handleFocus}
                onBlur={(e) => handleBlur(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="outline-none focus:outline-none min-h-[1em] mb-0"
                style={{ margin: 0 }}
              >
                {getDisplayText(block.text)}
              </p>
            );
          }
          
          return (
            <p key={i} className="mb-0" style={{ margin: 0 }}>
              {block.text || '\u00A0'}
            </p>
          );
        })
      )}
    </div>
  );
}

/**
 * HeadingRenderer - For heading elements specifically
 * 
 * Fixes applied:
 * - Zero-width space to prevent browser auto-injection
 * - contentEditable on heading element, not wrapper
 * - Enter key intercepted to prevent <div> injection
 * - Proper normalization on blur
 * - spellCheck disabled to prevent node injection
 */
interface HeadingRendererProps {
  content: TextContent;
  onChange: (content: TextContent) => void;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  align: 'left' | 'center' | 'right';
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  style?: React.CSSProperties;
  maxWidth?: number;
  placeholder?: string;
}

export function HeadingRenderer({
  content,
  onChange,
  level,
  align,
  isEditing,
  onStartEdit,
  onStopEdit,
  style,
  maxWidth = 800,
  placeholder = 'Click to edit heading...'
}: HeadingRendererProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  const text = content.blocks[0]?.text || '';

  // Handle focus - prevent browser from injecting <br> or <div>
  const handleFocus = useCallback((e: FocusEvent<HTMLHeadingElement>) => {
    if (e.currentTarget.innerText.replace(/\u200B/g, '').trim() === '') {
      e.currentTarget.innerHTML = ZERO_WIDTH_SPACE;
    }
  }, []);

  // Handle blur - save content (headings are single-line)
  const handleBlur = useCallback((e: FocusEvent<HTMLHeadingElement>) => {
    const cleanText = extractCleanText(e.currentTarget);
    
    onChange({
      blocks: [{ type: 'heading', level, text: cleanText }]
    });
    onStopEdit();
  }, [onChange, onStopEdit, level]);

  // Handle keydown - Enter submits for headings (no new lines allowed)
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
    
    if (e.key === 'Escape') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }, []);

  const handleClick = useCallback(() => {
    if (!isEditing) {
      onStartEdit();
    }
  }, [isEditing, onStartEdit]);

  const containerStyle: React.CSSProperties = {
    textAlign: align,
    maxWidth: maxWidth,
    margin: align === 'center' ? '0 auto' : undefined,
    ...style,
  };

  // Get display text with zero-width space fallback
  const displayText = text || ZERO_WIDTH_SPACE;

  // Render heading based on level - contentEditable directly on heading element
  const renderEditableHeading = () => {
    const props = {
      ref: headingRef,
      contentEditable: true,
      suppressContentEditableWarning: true,
      spellCheck: false,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      className: "outline-none focus:outline-none min-h-[1em] mb-0",
      style: { margin: 0 },
    };
    
    switch (level) {
      case 1: return <h1 {...props}>{displayText}</h1>;
      case 2: return <h2 {...props}>{displayText}</h2>;
      case 3: return <h3 {...props}>{displayText}</h3>;
      case 4: return <h4 {...props}>{displayText}</h4>;
      case 5: return <h5 {...props}>{displayText}</h5>;
      case 6: return <h6 {...props}>{displayText}</h6>;
      default: return <h2 {...props}>{displayText}</h2>;
    }
  };

  // Render static heading
  const renderStaticHeading = () => {
    const props = {
      className: "outline-none focus:outline-none min-h-[1em] mb-0",
      style: { margin: 0 },
    };
    
    const content = text || <span className="text-gray-400">{placeholder}</span>;
    
    switch (level) {
      case 1: return <h1 {...props}>{content}</h1>;
      case 2: return <h2 {...props}>{content}</h2>;
      case 3: return <h3 {...props}>{content}</h3>;
      case 4: return <h4 {...props}>{content}</h4>;
      case 5: return <h5 {...props}>{content}</h5>;
      case 6: return <h6 {...props}>{content}</h6>;
      default: return <h2 {...props}>{content}</h2>;
    }
  };

  if (isEditing) {
    return (
      <div style={containerStyle}>
        {renderEditableHeading()}
      </div>
    );
  }

  return (
    <div style={containerStyle} onClick={handleClick} className="cursor-text">
      {renderStaticHeading()}
    </div>
  );
}
