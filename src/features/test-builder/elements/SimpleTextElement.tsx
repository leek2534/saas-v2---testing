"use client";

import React, { useMemo } from 'react';
import { TextRenderer, HeadingRenderer } from './TextRenderer';
import { TextContent, TextBlock, htmlToBlocks, createDefaultTextContent, createHeadingContent } from '../types/text.types';
import { LetterHoverText } from './LetterHoverText';

interface SimpleTextElementProps {
  elementId: string;
  elementType: 'heading' | 'subheading' | 'text';
  props: Record<string, any>;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  updateElement: (id: string, updates: Record<string, any>) => void;
}

/**
 * SimpleTextElement - Clean text element using structured blocks
 * 
 * This component:
 * - Uses structured TextContent (blocks) instead of raw HTML
 * - Controls alignment internally (not affected by column alignment)
 * - Supports maxWidth for proper text wrapping
 * - Provides simple contentEditable editing
 */
export function SimpleTextElement({
  elementId,
  elementType,
  props,
  isEditing,
  onStartEdit,
  onStopEdit,
  updateElement,
}: SimpleTextElementProps) {
  
  // Get or migrate content to structured format
  const content: TextContent = useMemo(() => {
    // If we already have structured content, use it
    if (props.content?.blocks) {
      return props.content;
    }
    
    // Migrate from legacy HTML format
    if (props.text) {
      const blocks = htmlToBlocks(props.text);
      return { blocks };
    }
    
    // Default content based on element type
    if (elementType === 'heading') {
      return createHeadingContent('Your Heading Here', (props.level || 1) as 1 | 2 | 3 | 4 | 5 | 6);
    }
    if (elementType === 'subheading') {
      return createHeadingContent('Your Subheading Here', (props.level || 2) as 1 | 2 | 3 | 4 | 5 | 6);
    }
    return createDefaultTextContent('Your text content goes here...');
  }, [props.content, props.text, props.level, elementType]);

  // Handle content changes
  const handleContentChange = (newContent: TextContent) => {
    updateElement(elementId, { 
      content: newContent,
      // Also update legacy text field for compatibility
      text: newContent.blocks.map(b => b.text).join('\n')
    });
  };

  // Normalize alignment
  const align = (props.alignment || props.textAlign || 'center') as 'left' | 'center' | 'right';

  // Build typography styles
  const typographyStyle: React.CSSProperties = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      fontFamily: props.fontFamily || 'Inter',
      fontSize: props.fontSize ? `${props.fontSize}px` : undefined,
      lineHeight: props.lineHeight || (elementType === 'text' ? 1.6 : 1.2),
      letterSpacing: props.letterSpacing ? `${props.letterSpacing}px` : undefined,
      textTransform: props.textTransform || 'none',
      opacity: props.opacity !== undefined ? props.opacity : 1,
    };

    // Text shadow
    if (props.useTextShadow) {
      baseStyle.textShadow = props.textShadow || '2px 2px 4px rgba(0,0,0,0.3)';
    }

    // Gradient text
    if (props.useGradient) {
      baseStyle.color = 'transparent';
      baseStyle.backgroundImage = `linear-gradient(${props.gradientAngle || 90}deg, ${props.gradientFrom || '#3b82f6'}, ${props.gradientTo || '#8b5cf6'})`;
      baseStyle.WebkitBackgroundClip = 'text';
      baseStyle.WebkitTextFillColor = 'transparent';
      (baseStyle as any).backgroundClip = 'text';
    } else {
      baseStyle.color = props.textColor || props.color || (elementType === 'text' ? '#4b5563' : '#1f2937');
    }

    // Highlight
    if (props.highlightColor) {
      baseStyle.backgroundColor = props.highlightColor;
    }

    return baseStyle;
  }, [
    props.fontFamily,
    props.fontSize,
    props.lineHeight,
    props.letterSpacing,
    props.textTransform,
    props.opacity,
    props.useTextShadow,
    props.textShadow,
    props.useGradient,
    props.gradientAngle,
    props.gradientFrom,
    props.gradientTo,
    props.textColor,
    props.color,
    props.highlightColor,
    elementType,
  ]);

  // Default font sizes for headings
  const getDefaultFontSize = () => {
    if (elementType === 'heading') {
      const sizes: Record<string, string> = {
        h1: '2.5rem', h2: '2rem', h3: '1.75rem',
        h4: '1.5rem', h5: '1.25rem', h6: '1rem',
      };
      return sizes[props.level || 'h1'] || '2.5rem';
    }
    if (elementType === 'subheading') {
      const sizes: Record<string, string> = {
        h1: '2rem', h2: '1.5rem', h3: '1.25rem',
        h4: '1.125rem', h5: '1rem', h6: '0.875rem',
      };
      return sizes[props.level || 'h2'] || '1.5rem';
    }
    return '1rem';
  };

  // Apply default font size if not set
  const finalStyle: React.CSSProperties = {
    ...typographyStyle,
    fontSize: typographyStyle.fontSize || getDefaultFontSize(),
    fontWeight: elementType === 'text' ? 400 : 700,
  };

  // Wrapper for letter hover animation
  const renderWithAnimation = (children: React.ReactNode) => {
    if (props.letterHoverAnimation) {
      return (
        <LetterHoverText
          enabled={true}
          scaleAmount={props.letterHoverScale || 1.2}
          duration={props.letterHoverDuration || 0.3}
        >
          {children}
        </LetterHoverText>
      );
    }
    return children;
  };

  // Render based on element type
  if (elementType === 'heading' || elementType === 'subheading') {
    const level = parseInt((props.level || (elementType === 'heading' ? 'h1' : 'h2')).replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6;
    
    return (
      <div className="w-full">
        {renderWithAnimation(
          <HeadingRenderer
            content={content}
            onChange={handleContentChange}
            level={level}
            align={align}
            isEditing={isEditing}
            onStartEdit={onStartEdit}
            onStopEdit={onStopEdit}
            style={finalStyle}
            maxWidth={props.maxWidth || 800}
            placeholder={elementType === 'heading' ? 'Your Heading Here' : 'Your Subheading Here'}
          />
        )}
      </div>
    );
  }

  // Text element
  return (
    <div className="w-full">
      {renderWithAnimation(
        <TextRenderer
          content={content}
          onChange={handleContentChange}
          align={align}
          isEditing={isEditing}
          onStartEdit={onStartEdit}
          onStopEdit={onStopEdit}
          style={finalStyle}
          maxWidth={props.maxWidth || 800}
          placeholder="Your text content goes here..."
        />
      )}
    </div>
  );
}
