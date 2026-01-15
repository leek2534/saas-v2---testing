"use client";



import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Element } from './store';
import { useTestBuilderV2Store } from './store';
import { InlineTextEditor } from './InlineTextEditor';
import { TipTapEditorSimple as TipTapEditor } from './TipTapEditorSimple';
import { renderIcon } from './IconPicker';
import { cn } from '@/lib/utils';
import { UnifiedPlaceholder } from '@/components/canvas/UnifiedPlaceholder';
import { GripVertical, Trash2, Play, Image as ImageIcon, Sparkles, Check, Users, ChevronDown, ArrowRight, ChevronRight, Download, ExternalLink, Mail, Phone, ChevronUp, Plus, Type, AlignLeft, MousePointer } from 'lucide-react';
import { AccordionElement } from './elements/AccordionElement';
import { TabsElement } from './elements/TabsElement';
import { ModalElement } from './elements/ModalElement';
import { AlertElement } from './elements/AlertElement';
import { BadgeElement } from './elements/BadgeElement';
import { VideoElement } from './elements/VideoElement';
import { CountdownTimer } from './elements/CountdownTimer';
import { CanvasMediaToolbar } from './CanvasMediaToolbar';
import { LetterHoverText } from './elements/LetterHoverText';
import { SimpleTextElement } from './elements/SimpleTextElement';
import { LogoShowcaseElement } from './elements/logo-showcase/LogoShowcaseElement';
import { defaultLogoShowcaseSettings } from './elements/logo-showcase/types';
import { GuaranteeBadgeElement } from './elements/GuaranteeBadgeElement';
import { FeatureBoxElement } from './elements/FeatureBoxElement';
import { ComparisonTableElement } from './elements/ComparisonTableElement';
import { StarRatingElement } from './elements/StarRatingElement';
import { FormFieldRenderer } from './elements/FormFieldRenderer';
import { getAlignmentClasses, normalizeAlignment, getAlignmentMarginClasses } from '@/src/lib/media-toolbar-utils';
// HyperUI Components
import {
  AnnouncementElement,
  ContactFormElement,
  CTABlockElement,
  NewsletterElement,
  HeaderBlockElement,
  FeatureGridElement,
  ButtonGroupElement,
  LogoCloudElement,
  BannerElement,
  PollElement,
  TeamSectionElement,
  StepsElement,
  ProductCollectionElement,
  AccordionElement as HyperUIAccordionElement,
} from './elements/hyperui';
import './resize-animations.css';
import './styles/animated-borders.css';

interface ElementRendererProps {
  element: Element;
  elementIndex: number;
  sectionId: string;
  rowId: string;
  columnId: string;
  totalElements?: number; // Total elements in the column
}

// Helper function to generate CSS gradient from gradient value
const generateCSSGradient = (gradient: any) => {
  if (!gradient || !gradient.stops) return null;
  
  const sortedStops = [...gradient.stops].sort((a, b) => a.position - b.position);
  const stopsString = sortedStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ');

  if (gradient.type === 'linear') {
    return `linear-gradient(${gradient.angle}deg, ${stopsString})`;
  } else {
    return `radial-gradient(circle, ${stopsString})`;
  }
};

export function ElementRenderer({ element, elementIndex, sectionId, rowId, columnId, totalElements }: ElementRendererProps) {
  const { selectedElementId, selectElement, deleteElement, updateElement, hoveredType, hoveredId, setHover, viewMode, moveElementUp, moveElementDown, sections, addElement, editingElementId, setEditingElement, isResizing: globalIsResizing } = useTestBuilderV2Store();
  
  // Get total elements if not provided
  const totalElementsInColumn = totalElements ?? (() => {
    const section = sections.find(s => s.id === sectionId);
    const row = section?.rows.find(r => r.id === rowId);
    const column = row?.columns.find(c => c.id === columnId);
    return column?.elements.length || 0;
  })();
  
  // Use global editing state instead of local state
  const isEditing = editingElementId === element.id;
  
  // Image/GIF resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  
  // Double-tap activation state for resize mode
  const [isResizeMode, setIsResizeMode] = useState(false);

  const isSelected = selectedElementId === element.id;
  const isHovered = hoveredType === 'element' && hoveredId === element.id;
  
  // Ref for auto-scroll functionality
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to element when it becomes selected
  useEffect(() => {
    if (isSelected && elementRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        elementRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [isSelected]);
  
  // Handle double-click for resize activation
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (element.type !== 'image' && element.type !== 'gif') return;
    
    console.log('Double-click detected on', element.type);
    e.preventDefault();
    e.stopPropagation();
    setIsResizeMode(true);
  };
  
  // Click outside to exit resize mode
  React.useEffect(() => {
    if (!isResizeMode) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`[data-element-id="${element.id}"]`)) {
        setIsResizeMode(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isResizeMode, element.id]);
  
  // Click outside to stop editing text elements
  React.useEffect(() => {
    if (!isEditing || (element.type !== 'heading' && element.type !== 'subheading' && element.type !== 'text' && element.type !== 'button')) return;
    
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
        target.closest('[data-radix-portal]')
      ) {
        return;
      }
      
      // Check if click is outside the element container
      const elementContainer = target.closest(`[data-element-id="${element.id}"]`);
      
      if (!elementContainer) {
        // Clicked outside element container - stop editing
        setEditingElement(null);
      }
    };
    
    // Use setTimeout to avoid closing immediately
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, element.id, element.type, setEditingElement]);

  const renderElement = () => {
    const props = element.props;

    switch (element.type) {
      case 'heading':
        const headingLevel = props.level || 'h1';
        const HeadingTag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(headingLevel) ? headingLevel : 'h1') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        
        // Default responsive font sizes for each heading level
        const defaultHeadingSizes: Record<string, string> = {
          h1: 'clamp(2rem, 5vw, 3rem)',      // 32px - 48px
          h2: 'clamp(1.5rem, 4vw, 2.25rem)', // 24px - 36px
          h3: 'clamp(1.25rem, 3vw, 1.875rem)', // 20px - 30px
          h4: 'clamp(1.125rem, 2.5vw, 1.5rem)', // 18px - 24px
          h5: 'clamp(1rem, 2vw, 1.25rem)',   // 16px - 20px
          h6: 'clamp(0.875rem, 1.5vw, 1rem)', // 14px - 16px
        };
        
        const headingTextShadow = props.useTextShadow 
          ? (props.textShadow || '2px 2px 4px rgba(0,0,0,0.3)')
          : 'none';

        // Use normalizeAlignment to get consistent alignment (defaults to 'center')
        const headingAlignment = normalizeAlignment(props);
        const headingTextAlign = headingAlignment === 'left' ? 'left' : 
                                 headingAlignment === 'right' ? 'right' : 
                                 headingAlignment === 'center' ? 'center' : 
                                 headingAlignment === 'justify' ? 'justify' :
                                 'center';

        // Memoize externalStyles to ensure TipTapEditor detects changes
        // NOTE: We DON'T include fontWeight, fontStyle, or textDecoration here
        // because TipTap handles those via HTML tags (<strong>, <em>, <u>)
        // and CSS overrides would break the formatting
        const headingExternalStyles = React.useMemo(() => ({
          width: props.alignment === 'justify' ? '100%' : 'auto',
          display: props.alignment === 'justify' ? 'block' : 'inline-block',
          textAlign: headingTextAlign as 'left' | 'center' | 'right' | 'justify',
          fontFamily: props.fontFamily || 'Inter',
          fontSize: props.fontSize ? `${props.fontSize}px` : defaultHeadingSizes[headingLevel],
          // fontWeight: removed - TipTap handles via <strong> tags
          // fontStyle: removed - TipTap handles via <em> tags
          lineHeight: props.lineHeight || 1.2,
          letterSpacing: `${props.letterSpacing || 0}px`,
          textTransform: props.textTransform || 'none',
          // textDecoration: removed - TipTap handles via <u>, <s> tags
          opacity: props.opacity !== undefined ? props.opacity : 1,
          textShadow: headingTextShadow,
          wordBreak: 'break-word' as const,
          overflowWrap: 'break-word' as const,
          hyphens: 'auto' as const,
          ...(props.useGradient ? {
            color: 'transparent',
            backgroundImage: `linear-gradient(${props.gradientAngle || 90}deg, ${props.gradientFrom || '#3b82f6'}, ${props.gradientTo || '#8b5cf6'})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          } : {
            color: props.textColor || '#1f2937',
          }),
          backgroundColor: props.highlightColor || 'transparent',
        }), [
          props.alignment,
          headingTextAlign,
          props.fontFamily,
          props.fontSize,
          // props.fontWeight, removed from deps
          // props.fontStyle, removed from deps
          props.lineHeight,
          props.letterSpacing,
          props.textTransform,
          // props.textDecoration, removed from deps
          props.opacity,
          headingTextShadow,
          props.useGradient,
          props.gradientAngle,
          props.gradientFrom,
          props.gradientTo,
          props.textColor,
          props.highlightColor,
          headingLevel,
        ]);

        return (
          <div className="w-full" style={{
            textAlign: headingTextAlign,
            display: 'flex',
            justifyContent: headingAlignment === 'left' ? 'flex-start' : 
                         headingAlignment === 'center' ? 'center' : 
                         headingAlignment === 'right' ? 'flex-end' : 
                         headingAlignment === 'justify' ? 'stretch' : 'center',
            width: '100%', // Fill entire column width for alignment
            minWidth: '100%',
            maxWidth: '100%',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
          }}>
            <LetterHoverText
              enabled={props.letterHoverAnimation || false}
              scaleAmount={props.letterHoverScale || 1.2}
              duration={props.letterHoverDuration || 0.3}
            >
              <TipTapEditor
                content={props.text || ''}
                onChange={(html) => updateElement(element.id, { text: html })}
                onTagChange={(newTag) => {
                  updateElement(element.id, { 
                    level: newTag,
                    fontSize: undefined
                  });
                }}
                onAlignmentChange={(alignment) => {
                  updateElement(element.id, { alignment });
                }}
                onFontFamilyChange={(fontFamily) => {
                  updateElement(element.id, { fontFamily });
                }}
                onFontSizeChange={(fontSize) => {
                  updateElement(element.id, { fontSize });
                }}
                // NOTE: We don't update fontWeight, fontStyle, or textDecoration here
                // because TipTap handles formatting via HTML tags in the content
                // Updating CSS properties would override the HTML formatting
                onBoldChange={undefined}
                onItalicChange={undefined}
                onUnderlineChange={undefined}
                onStrikethroughChange={undefined}
                tag={headingLevel}
                placeholder="Your Heading Here"
                isEditing={isEditing}
                onStartEdit={() => setEditingElement(element.id)}
                onStopEdit={() => setEditingElement(null)}
                singleLine={false}
                externalStyles={headingExternalStyles}
              />
            </LetterHoverText>
          </div>
        );
      
      case 'subheading':
        const subheadingLevel = props.level || 'h2';
        const SubheadingTag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(subheadingLevel) ? subheadingLevel : 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        
        // Default responsive font sizes for each subheading level
        const defaultSubheadingSizes: Record<string, string> = {
          h1: 'clamp(2rem, 5vw, 3rem)',      // 32px - 48px
          h2: 'clamp(1.5rem, 4vw, 2.25rem)', // 24px - 36px
          h3: 'clamp(1.25rem, 3vw, 1.875rem)', // 20px - 30px
          h4: 'clamp(1.125rem, 2.5vw, 1.5rem)', // 18px - 24px
          h5: 'clamp(1rem, 2vw, 1.25rem)',   // 16px - 20px
          h6: 'clamp(0.875rem, 1.5vw, 1rem)', // 14px - 16px
        };
        
        const subheadingTextShadow = props.useTextShadow 
          ? (props.textShadow || '2px 2px 4px rgba(0,0,0,0.3)')
          : 'none';

        // Use normalizeAlignment to get consistent alignment (defaults to 'center')
        const subheadingAlignment = normalizeAlignment(props);
        const subheadingTextAlign = subheadingAlignment === 'left' ? 'left' : 
                                    subheadingAlignment === 'right' ? 'right' : 
                                    subheadingAlignment === 'center' ? 'center' : 
                                    subheadingAlignment === 'justify' ? 'justify' :
                                    'center';

        // Ensure we have a valid default level
        const actualLevel = props.level || 'h2';
        const actualSubheadingLevel = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(actualLevel) ? actualLevel : 'h2';
        
        // Use fixed pixel sizes instead of clamp for more predictable initial rendering
        const fixedSubheadingSizes: Record<string, string> = {
          h1: '2rem',      // 32px
          h2: '1.5rem',    // 24px
          h3: '1.25rem',   // 20px
          h4: '1.125rem',  // 18px
          h5: '1rem',      // 16px
          h6: '0.875rem',  // 14px
        };

        // Memoize external styles for proper change detection (matching heading pattern)
        // NOTE: We DON'T include fontWeight, fontStyle, or textDecoration here
        // because TipTap handles those via HTML tags (<strong>, <em>, <u>)
        // and CSS overrides would break the formatting
        const subheadingExternalStyles = React.useMemo(() => ({
          width: props.alignment === 'justify' ? '100%' : 'auto',
          display: props.alignment === 'justify' ? 'block' : 'inline-block',
          textAlign: subheadingTextAlign as 'left' | 'center' | 'right' | 'justify',
          fontFamily: props.fontFamily || 'Inter',
          fontSize: props.fontSize ? `${props.fontSize}px` : fixedSubheadingSizes[actualSubheadingLevel],
          // fontWeight: removed - TipTap handles via <strong> tags
          // fontStyle: removed - TipTap handles via <em> tags
          lineHeight: props.lineHeight || 1.3,
          letterSpacing: `${props.letterSpacing || 0}px`,
          textTransform: props.textTransform || 'none',
          // textDecoration: removed - TipTap handles via <u>, <s> tags
          opacity: props.opacity !== undefined ? props.opacity : 1,
          textShadow: subheadingTextShadow,
          wordBreak: 'break-word' as const,
          overflowWrap: 'break-word' as const,
          hyphens: 'auto' as const,
          ...(props.useGradient ? {
            color: 'transparent',
            backgroundImage: `linear-gradient(${props.gradientAngle || 90}deg, ${props.gradientFrom || '#3b82f6'}, ${props.gradientTo || '#8b5cf6'})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          } : {
            color: props.textColor || '#374151',
          }),
          backgroundColor: props.highlightColor || 'transparent',
        }), [
          props.alignment,
          subheadingTextAlign,
          props.fontFamily,
          props.fontSize,
          // props.fontWeight, removed from deps
          // props.fontStyle, removed from deps
          props.lineHeight,
          props.letterSpacing,
          props.textTransform,
          // props.textDecoration, removed from deps
          props.opacity,
          subheadingTextShadow,
          props.useGradient,
          props.gradientAngle,
          props.gradientFrom,
          props.gradientTo,
          props.textColor,
          props.highlightColor,
          actualSubheadingLevel,
        ]);

        return (
          <div className="w-full" style={{
            textAlign: subheadingTextAlign,
            display: 'flex',
            justifyContent: subheadingAlignment === 'left' ? 'flex-start' : 
                         subheadingAlignment === 'center' ? 'center' : 
                         subheadingAlignment === 'right' ? 'flex-end' : 
                         subheadingAlignment === 'justify' ? 'stretch' : 'center',
            width: '100%', // Fill entire column width for alignment
            minWidth: '100%',
            maxWidth: '100%',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
          }}>
            <LetterHoverText
              enabled={props.letterHoverAnimation || false}
              scaleAmount={props.letterHoverScale || 1.2}
              duration={props.letterHoverDuration || 0.3}
            >
              <TipTapEditor
                content={props.text || `<${actualSubheadingLevel}></${actualSubheadingLevel}>`}
                onChange={(html) => updateElement(element.id, { text: html })}
                onTagChange={(newTag) => {
                  updateElement(element.id, { 
                    level: newTag,
                    fontSize: undefined
                  });
                }}
                onAlignmentChange={(alignment) => {
                  updateElement(element.id, { alignment });
                }}
                onFontFamilyChange={(fontFamily) => {
                  updateElement(element.id, { fontFamily });
                }}
                onFontSizeChange={(fontSize) => {
                  updateElement(element.id, { fontSize });
                }}
                onBoldChange={(bold) => {
                  if (bold) {
                    updateElement(element.id, { fontWeight: props.fontWeight && parseInt(props.fontWeight) > 600 ? props.fontWeight : '600' });
                  } else {
                    updateElement(element.id, { fontWeight: '400' });
                  }
                }}
                onItalicChange={(italic) => {
                  updateElement(element.id, { fontStyle: italic ? 'italic' : 'normal' });
                }}
                onUnderlineChange={(underline) => {
                  const currentDecorations = props.textDecoration?.split(' ').filter(Boolean) || [];
                  let newDecorations = currentDecorations.filter((d: string) => d !== 'underline' && d !== 'none');
                  if (underline) {
                    newDecorations.push('underline');
                  }
                  updateElement(element.id, { textDecoration: newDecorations.length > 0 ? newDecorations.join(' ') : 'none' });
                }}
                onStrikethroughChange={(strikethrough) => {
                  const currentDecorations = props.textDecoration?.split(' ').filter(Boolean) || [];
                  let newDecorations = currentDecorations.filter((d: string) => d !== 'line-through' && d !== 'none');
                  if (strikethrough) {
                    newDecorations.push('line-through');
                  }
                  updateElement(element.id, { textDecoration: newDecorations.length > 0 ? newDecorations.join(' ') : 'none' });
                }}
                tag={actualSubheadingLevel as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'}
                placeholder="Your Subheading Here"
                isEditing={isEditing}
                onStartEdit={() => setEditingElement(element.id)}
                onStopEdit={() => setEditingElement(null)}
                singleLine={false}
                externalStyles={subheadingExternalStyles}
              />
            </LetterHoverText>
          </div>
        );

      case 'text':
        // Feature flag: Use new structured text system (simpler, more predictable)
        // Set props.useStructuredText = true to enable
        const useStructuredText = props.useStructuredText || false;
        
        if (useStructuredText) {
          // NEW: Structured text system - text is blocks, not HTML
          return (
            <SimpleTextElement
              elementId={element.id}
              elementType="text"
              props={props}
              isEditing={isEditing}
              onStartEdit={() => setEditingElement(element.id)}
              onStopEdit={() => setEditingElement(null)}
              updateElement={updateElement}
            />
          );
        }
        
        // LEGACY: TipTap-based HTML text (default for backwards compatibility)
        const textTextShadow = props.useTextShadow 
          ? (props.textShadow || '2px 2px 4px rgba(0,0,0,0.3)')
          : 'none';

        // Use normalizeAlignment to get consistent alignment (defaults to 'center')
        const textAlignment = normalizeAlignment(props);
        const textTextAlign = textAlignment === 'left' ? 'left' : 
                              textAlignment === 'right' ? 'right' : 
                              textAlignment === 'center' ? 'center' : 
                              textAlignment === 'justify' ? 'justify' :
                              'center';

        // Memoize external styles for proper change detection (matching heading pattern)
        // NOTE: fontWeight, fontStyle, textDecoration are NOT included here because
        // formatting (bold, italic, underline, strikethrough) is stored in the HTML content
        // via TipTap marks (<strong>, <em>, <u>, <s>). CSS overrides would break this.
        const textExternalStyles = React.useMemo(() => ({
          width: props.alignment === 'justify' ? '100%' : 'auto',
          display: props.alignment === 'justify' ? 'block' : 'inline-block',
          textAlign: textTextAlign as 'left' | 'center' | 'right' | 'justify',
          fontFamily: props.fontFamily || 'Inter',
          fontSize: props.fontSize ? `${props.fontSize}px` : '16px',
          // fontWeight, fontStyle, textDecoration removed - formatting comes from HTML marks
          lineHeight: props.lineHeight || 1.6,
          letterSpacing: `${props.letterSpacing || 0}px`,
          textTransform: props.textTransform || 'none',
          opacity: props.opacity !== undefined ? props.opacity : 1,
          textShadow: textTextShadow,
          wordBreak: 'break-word' as const,
          overflowWrap: 'break-word' as const,
          hyphens: 'auto' as const,
          boxSizing: 'border-box' as const,
          paddingTop: props.paddingTop ? `${props.paddingTop}px` : undefined,
          paddingBottom: props.paddingBottom ? `${props.paddingBottom}px` : undefined,
          paddingLeft: props.paddingLeft ? `${props.paddingLeft}px` : undefined,
          paddingRight: props.paddingRight ? `${props.paddingRight}px` : undefined,
          ...(props.useGradient ? {
            color: 'transparent',
            backgroundImage: `linear-gradient(${props.gradientAngle || 90}deg, ${props.gradientFrom || '#3b82f6'}, ${props.gradientTo || '#8b5cf6'})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          } : {
            color: props.textColor || '#4b5563',
          }),
          backgroundColor: props.highlightColor || 'transparent',
        }), [
          props.alignment,
          textTextAlign,
          props.fontFamily,
          props.fontSize,
          props.lineHeight,
          props.letterSpacing,
          props.textTransform,
          props.opacity,
          textTextShadow,
          props.useGradient,
          props.gradientAngle,
          props.gradientFrom,
          props.gradientTo,
          props.textColor,
          props.highlightColor,
          props.paddingTop,
          props.paddingBottom,
          props.paddingLeft,
          props.paddingRight,
        ]);

        return (
          <div className="w-full" style={{
            textAlign: textTextAlign,
            display: 'flex',
            justifyContent: textAlignment === 'left' ? 'flex-start' : 
                         textAlignment === 'center' ? 'center' : 
                         textAlignment === 'right' ? 'flex-end' : 
                         textAlignment === 'justify' ? 'stretch' : 'center',
            width: '100%', // Fill entire column width for alignment
            minWidth: '100%',
            maxWidth: '100%',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
          }}>
            <LetterHoverText
              enabled={props.letterHoverAnimation || false}
              scaleAmount={props.letterHoverScale || 1.2}
              duration={props.letterHoverDuration || 0.3}
            >
              <TipTapEditor
                content={props.text || '<p>Your text content goes here...</p>'}
                onChange={(html) => updateElement(element.id, { text: html })}
                onAlignmentChange={(alignment) => {
                  updateElement(element.id, { alignment });
                }}
                onFontFamilyChange={(fontFamily) => {
                  updateElement(element.id, { fontFamily });
                }}
                onFontSizeChange={(fontSize) => {
                  updateElement(element.id, { fontSize });
                }}
                // NOTE: We don't update fontWeight, fontStyle, or textDecoration here
                // because TipTap handles formatting via HTML tags in the content
                // Updating CSS properties would override the HTML formatting
                onBoldChange={undefined}
                onItalicChange={undefined}
                onUnderlineChange={undefined}
                onStrikethroughChange={undefined}
                tag="p"
                placeholder="Your text content goes here..."
                isEditing={isEditing}
                onStartEdit={() => setEditingElement(element.id)}
                onStopEdit={() => setEditingElement(null)}
                singleLine={false} // Allow text wrapping for text elements
                externalStyles={textExternalStyles}
              />
            </LetterHoverText>
          </div>
        );
      
      case 'button':
        // Size presets
        const buttonSizePresets: Record<string, { padding: string; fontSize: string }> = {
          'small': { padding: 'py-2 px-4', fontSize: 'text-sm' },
          'medium': { padding: 'py-3 px-6', fontSize: 'text-base' },
          'large': { padding: 'py-4 px-8', fontSize: 'text-lg' },
          'xlarge': { padding: 'py-5 px-10', fontSize: 'text-xl' },
          'full': { padding: 'py-3 px-6', fontSize: 'text-base' },
          'custom': { padding: '', fontSize: 'text-base' },
        };

        const buttonSize = props.buttonSize || 'medium';
        const sizePreset = buttonSizePresets[buttonSize];
        
        // Style types - support both buttonStyle and buttonType
        const getButtonStyleClasses = () => {
          const style = props.buttonType || props.buttonStyle || 'solid';
          const bg = props.backgroundColor || '#3b82f6';
          const text = props.textColor || '#ffffff';
          
          if (style === 'solid' || style === 'filled') return '';
          if (style === 'outline') return 'bg-transparent';
          if (style === 'ghost') return 'bg-transparent';
          if (style === 'gradient') return '';
          if (style === 'glass') return 'backdrop-blur-lg bg-white/20';
          return '';
        };

        // Hover effects
        const getHoverClasses = () => {
          const effect = props.hoverEffect || 'scale';
          if (effect === 'none') return '';
          if (effect === 'scale') return 'hover:scale-105';
          if (effect === 'lift') return 'hover:-translate-y-1 hover:shadow-lg';
          if (effect === 'glow') return 'hover:shadow-xl';
          if (effect === 'shine') return 'relative overflow-hidden hover:shadow-md';
          if (effect === 'slide') return 'hover:translate-x-1';
          if (effect === 'bounce') return 'hover:animate-bounce';
          return 'hover:scale-105';
        };

        // Click animation
        const getClickClasses = () => {              
          const anim = props.clickAnimation || 'press';
          if (anim === 'none') return '';
          if (anim === 'press') return 'active:scale-95';
          if (anim === 'ripple') return 'relative overflow-hidden';
          if (anim === 'pulse') return 'active:animate-pulse';
          if (anim === 'shake') return 'active:animate-shake';
          return 'active:scale-95';
        };

        // Shadow
        const getShadowClass = () => {
          const shadow = props.shadow || 'none';
          if (shadow === 'none') return '';
          if (shadow === 'sm') return 'shadow-sm';
          if (shadow === 'md') return 'shadow-md';
          if (shadow === 'lg') return 'shadow-lg';
          if (shadow === 'xl') return 'shadow-xl';
          return '';
        };

        // Transition speed
        const getTransitionClass = () => {
          const speed = props.transitionSpeed || 'normal';
          if (speed === 'fast') return 'transition-all duration-150';
          if (speed === 'normal') return 'transition-all duration-300';
          if (speed === 'slow') return 'transition-all duration-500';
          return 'transition-all duration-300';
        };

        // Width - support both buttonSize full and fullWidth prop
        const buttonWidthClass = (buttonSize === 'full' || props.fullWidth) ? 'w-full' : 'w-auto';
        
        // Visibility controls
        const visibilityClasses = [
          props.visibleDesktop === false ? 'hidden md:hidden lg:hidden xl:hidden' : '',
          props.visibleTablet === false ? 'md:hidden' : '',
          props.visibleMobile === false ? 'hidden sm:hidden' : '',
        ].filter(Boolean).join(' ');

        // Container alignment - use normalizeAlignment for consistency
        const buttonAlignment = normalizeAlignment(props);
        
        // Text alignment
        const textAlignClass = buttonAlignment === 'left' ? 'text-left' :
                              buttonAlignment === 'right' ? 'text-right' :
                              'text-center';

        // Icon component - renders lucide-react icons
        const renderButtonIcon = () => {
          if (!props.showIcon) return null;
          
          const iconSize = props.iconSize || 16;
          const iconSpacing = props.iconSpacing || 8;
          const iconClass = props.iconPosition === 'left' ? `mr-[${iconSpacing}px]` : `ml-[${iconSpacing}px]`;
          
          // Map icon names to components
          const iconName = props.icon || 'Sparkles';
          const iconProps = { size: iconSize, className: iconClass };
          
          switch (iconName) {
            case 'ArrowRight': return <ArrowRight {...iconProps} />;
            case 'ChevronRight': return <ChevronRight {...iconProps} />;
            case 'Download': return <Download {...iconProps} />;
            case 'ExternalLink': return <ExternalLink {...iconProps} />;
            case 'Mail': return <Mail {...iconProps} />;
            case 'Phone': return <Phone {...iconProps} />;
            case 'Sparkles':
            default: return <Sparkles {...iconProps} />;
          }
        };

        // Container alignment - use normalizeAlignment for consistency (already declared above)
        const containerAlignClass = buttonAlignment === 'left' ? 'flex justify-start' :
                                   buttonAlignment === 'right' ? 'flex justify-end' :
                                   'flex justify-center';

        return (
          <div className={cn('w-full', containerAlignClass)}>
            <button
              className={cn(
                // Base styles
                'font-medium inline-flex items-center justify-center',
                // Size - only apply if not using custom padding
                buttonSize !== 'custom' && !props.paddingTop && !props.paddingRight && sizePreset.padding,
                sizePreset.fontSize,
                // Width
                buttonWidthClass,
                // Style
                getButtonStyleClasses(),
                // Effects
                getHoverClasses(),
                getClickClasses(),
                getShadowClass(),
                getTransitionClass(),
                // Text alignment
                textAlignClass,
                // Visibility
                visibilityClasses
              )}
              style={{
                // Background color based on button type
                backgroundColor: (props.buttonType === 'solid' || props.buttonType === 'filled' || props.buttonStyle === 'filled' || (!props.buttonType && !props.buttonStyle))
                  ? (props.backgroundColor || '#3b82f6')
                  : (props.buttonType === 'gradient' || props.buttonStyle === 'gradient')
                  ? props.backgroundColor || '#3b82f6'
                  : 'transparent',
                // Gradient background
                ...(props.buttonType === 'gradient' && {
                  backgroundImage: `linear-gradient(135deg, ${props.backgroundColor || '#3b82f6'}, ${props.hoverBackgroundColor || '#2563eb'})`,
                }),
                color: props.textColor || '#ffffff',
                borderRadius: `${props.borderRadius || 8}px`,
                borderWidth: props.borderWidth || ((props.buttonType === 'outline' || props.buttonStyle === 'outline') ? 2 : 0),
                borderColor: props.borderColor || props.backgroundColor || '#3b82f6',
                borderStyle: props.borderWidth > 0 || props.buttonType === 'outline' || props.buttonStyle === 'outline' ? 'solid' : 'none',
                // Typography
                fontFamily: props.fontFamily || 'Inter',
                fontSize: `${props.fontSize || 16}px`,
                fontWeight: props.fontWeight || '500',
                letterSpacing: `${props.letterSpacing || 0}px`,
                textTransform: props.textTransform || 'none',
                // Padding
                paddingTop: `${props.paddingTop || 12}px`,
                paddingRight: `${props.paddingRight || 24}px`,
                paddingBottom: `${props.paddingBottom || 12}px`,
                paddingLeft: `${props.paddingLeft || 24}px`,
                // Hover colors
                ...(props.useHoverColors && {
                  '--hover-bg': props.hoverBackgroundColor || '#2563eb',
                  '--hover-text': props.hoverTextColor || '#ffffff',
                } as any),
              }}
              onClick={(e) => {
                // Handle different action types
                if (props.actionType === 'link' && props.url) {
                  if (props.openInNewTab) {
                    window.open(props.url, '_blank');
                  } else {
                    window.location.href = props.url;
                  }
                } else if (props.actionType === 'download' && props.downloadUrl) {
                  const a = document.createElement('a');
                  a.href = props.downloadUrl;
                  a.download = '';
                  a.click();
                } else if (props.actionType === 'phone' && props.phoneNumber) {
                  window.location.href = `tel:${props.phoneNumber}`;
                } else if (props.actionType === 'email' && props.emailAddress) {
                  window.location.href = `mailto:${props.emailAddress}${props.emailSubject ? `?subject=${encodeURIComponent(props.emailSubject)}` : ''}`;
                } else if (props.actionType === 'scroll' && props.scrollTarget) {
                  const target = document.getElementById(props.scrollTarget);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              {props.showIcon && props.iconPosition === 'left' && renderButtonIcon()}
              <div className="flex flex-col items-center">
                <TipTapEditor
                  content={props.text || '<p>Click Here</p>'}
                  onChange={(html) => updateElement(element.id, { text: html })}
                  tag="p"
                  placeholder="Click Here"
                  className="inline-block m-0 p-0"
                  isEditing={isEditing}
                  onStartEdit={() => setEditingElement(element.id)}
                  onStopEdit={() => setEditingElement(null)}
                  externalStyles={{
                    color: props.textColor || '#ffffff',
                    margin: 0,
                    padding: 0,
                  }}
                />
                {props.subtext && (
                  <TipTapEditor
                    content={props.subtext || '<p>Subtext</p>'}
                    onChange={(html) => updateElement(element.id, { subtext: html })}
                    tag="p"
                    placeholder="Subtext"
                    className="text-xs mt-0.5 inline-block m-0 p-0"
                    isEditing={isEditing}
                    onStartEdit={() => setEditingElement(element.id)}
                    onStopEdit={() => setEditingElement(null)}
                    externalStyles={{
                      color: props.subtextColor || props.textColor || '#ffffff',
                      opacity: props.subtextColor ? 1 : 0.8,
                      margin: 0,
                      padding: 0,
                    }}
                  />
                )}
              </div>
              {props.showIcon && props.iconPosition === 'right' && renderButtonIcon()}
            </button>
          </div>
        );
      
      case 'image':
        // Calculate image dimensions
        const imageWidth = props.width === 'full' ? '100%' :
                          props.customWidth ? `${props.customWidth}px` :
                          props.width && typeof props.width === 'string' && props.width.includes('px') ? props.width :
                          '600px'; // Default width
        
        const imageHeight = props.height === 'auto' ? 'auto' :
                           props.customHeight ? `${props.customHeight}px` :
                           props.height && typeof props.height === 'string' && props.height.includes('px') ? props.height :
                           '400px'; // Default height
        
        // Use unified alignment utility
        const imageAlignment = normalizeAlignment(props);
        const imageAlignClass = getAlignmentClasses(imageAlignment);
        const imageMarginClass = getAlignmentMarginClasses(imageAlignment);

        const imageFilters = [
          props.grayscale ? 'grayscale(100%)' : '',
          props.brightness !== 100 ? `brightness(${props.brightness || 100}%)` : '',
          props.contrast !== 100 ? `contrast(${props.contrast || 100}%)` : '',
          props.saturation !== 100 ? `saturate(${props.saturation || 100}%)` : '',
          props.blur ? `blur(${props.blur}px)` : ''
        ].filter(Boolean).join(' ');

        // Get border class from borderStyle prop
        const borderClass = props.borderStyle ? `border-${props.borderStyle}` : '';
        
        const imageContent = props.url ? (
          <img
            src={props.url}
            alt={props.alt || 'Image'}
            title={props.title}
            loading={props.lazyLoad !== false ? 'lazy' : undefined}
            className={cn(
              imageMarginClass,
              props.shadowEnabled && 'shadow-lg',
              props.hoverEffect && 'transition-transform duration-300 hover:scale-105',
              borderClass,
              'cursor-pointer' // Make it clear the image is clickable
            )}
            style={{
              width: imageWidth,
              height: imageHeight === 'auto' ? undefined : imageHeight,
              objectFit: props.objectFit || 'cover',
              objectPosition: props.objectPosition || 'center',
              borderRadius: `${props.borderRadius || 0}px`,
              border: props.borderStyle ? undefined : (props.borderEnabled ? `${props.borderWidth || 1}px ${props.borderStyle || 'solid'} ${props.borderColor || '#e5e7eb'}` : 'none'),
              opacity: props.opacity || 1,
              marginTop: `${props.marginTop || 0}px`,
              marginBottom: `${props.marginBottom || 0}px`,
              filter: imageFilters || 'none',
              aspectRatio: props.aspectRatio !== 'none' ? props.aspectRatio : undefined,
              maxWidth: '100%',
              display: 'block',
              pointerEvents: 'auto', // Ensure image can receive clicks
            }}
            onDoubleClick={handleDoubleClick}
            onClick={(e) => {
              // If image has clickable link behavior, handle it
              if (props.clickable && props.clickUrl && !isResizeMode && viewMode !== 'edit') {
                // In preview mode, handle the link
                e.stopPropagation();
                if (props.openInNewTab) {
                  window.open(props.clickUrl, '_blank');
                } else {
                  window.location.href = props.clickUrl;
                }
              }
              // In edit mode or if not clickable, let click bubble up to parent for element selection
              // The parent ElementRenderer onClick will handle selecting the element
            }}
            draggable={false}
          />
        ) : (
          <div 
            className="relative mx-auto bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center overflow-hidden cursor-pointer"
            style={{
              width: imageWidth,
              height: imageHeight === 'auto' ? '400px' : imageHeight,
              borderRadius: `${props.borderRadius || 8}px`,
              pointerEvents: 'auto', // Ensure placeholder can receive clicks
            }}
          >
            {/* Sample placeholder image */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <ImageIcon size={64} className="text-gray-300 dark:text-gray-600" />
            </div>
            {/* Instructions overlay */}
            <div className="relative z-10 text-center p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg m-4">
              <ImageIcon size={32} className="mx-auto mb-3 text-gray-400 dark:text-gray-500" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                No Image Selected
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Configure image in settings panel →
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Upload, add URL, or select from media library
              </p>
            </div>
          </div>
        );

        // Handle resize for image elements
        const handleResizeStart = (e: React.MouseEvent) => {
          if (element.type !== 'image' || !isSelected || viewMode !== 'edit') return;
          e.preventDefault();
          e.stopPropagation();
          
          const currentWidth = props.customWidth || parseInt(props.width?.replace('px', '') || '600') || 600;
          const currentHeight = props.customHeight || parseInt(props.height?.replace('px', '') || '400') || 400;
          
          setIsResizing(true);
          setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: currentWidth,
            height: currentHeight,
          });
        };

        const handleResizeMove = (e: MouseEvent) => {
          if (!isResizing || !resizeStart) return;
          
          const deltaX = e.clientX - resizeStart.x;
          const deltaY = e.clientY - resizeStart.y;
          
          // Calculate new dimensions (maintain aspect ratio by default, or allow free resize with Shift)
          const aspectRatio = resizeStart.width / resizeStart.height;
          let newWidth = resizeStart.width + deltaX;
          let newHeight = resizeStart.height + deltaY;
          
          // If Shift is held, maintain aspect ratio
          if (e.shiftKey) {
            const scale = Math.max(deltaX / resizeStart.width, deltaY / resizeStart.height);
            newWidth = resizeStart.width + (resizeStart.width * scale);
            newHeight = resizeStart.height + (resizeStart.height * scale);
          }
          
          // Apply constraints
          newWidth = Math.max(50, Math.min(1200, newWidth));
          newHeight = Math.max(50, Math.min(800, newHeight));
          
          updateElement(element.id, {
            customWidth: Math.round(newWidth),
            customHeight: Math.round(newHeight),
            width: 'custom',
            height: 'custom',
          });
        };

        const handleResizeEnd = () => {
          setIsResizing(false);
          setResizeStart(null);
        };

        React.useEffect(() => {
          if (isResizing) {
            document.addEventListener('mousemove', handleResizeMove);
            document.addEventListener('mouseup', handleResizeEnd);
            return () => {
              document.removeEventListener('mousemove', handleResizeMove);
              document.removeEventListener('mouseup', handleResizeEnd);
            };
          }
        }, [isResizing, resizeStart]);

        return (
          <>
            {/* Canvas Media Toolbar - Shows when image is selected */}
            {isSelected && viewMode === 'edit' && (
              <CanvasMediaToolbar elementId={element.id} elementType="image" elementProps={props} />
            )}
            
            <div 
              className={`flex w-full ${imageAlignClass} relative`}
              data-element-id={element.id}
              onClick={(e) => {
                // Don't select element if we're in resize mode
                if (isResizeMode) {
                  e.stopPropagation();
                }
              }}
            >
            {/* Resize Mode Highlight Overlay - Animated */}
            {element.type === 'image' && isResizeMode && (
              <div 
                className="absolute inset-0 pointer-events-none z-40 rounded-lg transition-all duration-300 ease-out"
                style={{
                  boxShadow: '0 0 0 4px rgba(249, 115, 22, 0.4), 0 0 20px rgba(249, 115, 22, 0.2)',
                  animation: 'pulse-glow 2s ease-in-out infinite',
                }}
              />
            )}
            
            {props.clickable ? (
              <a
                href={props.clickUrl || '#'}
                target={props.openInNewTab ? '_blank' : '_self'}
                rel={props.openInNewTab ? 'noopener noreferrer' : undefined}
                style={{ display: 'block' }}
                onClick={(e) => {
                  if (isResizeMode) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDoubleClick(e as any);
                }}
              >
                {imageContent}
              </a>
            ) : (
              imageContent
            )}
            
            {/* Resize Handles - Only show when in resize mode */}
            {element.type === 'image' && isResizeMode && viewMode === 'edit' && (
              <>
                {/* Edge resize handles - positioned on edges with animation */}
                {['top', 'right', 'bottom', 'left'].map((position) => (
                  <div
                    key={position}
                    className="absolute bg-orange-500 border-2 border-white z-50 shadow-lg transition-all duration-300 ease-out"
                    style={{
                      [position]: '0px',
                      ...(position === 'top' || position === 'bottom'
                        ? { width: '100%', height: '4px', left: '0px', cursor: 'ns-resize', animation: 'fadeInWidth 0.3s ease-out' }
                        : { width: '4px', height: '100%', top: '0px', cursor: 'ew-resize', animation: 'fadeInHeight 0.3s ease-out' }),
                    }}
                    onMouseDown={handleResizeStart}
                    onMouseEnter={(e) => {
                      if (position === 'top' || position === 'bottom') {
                        e.currentTarget.style.height = '6px';
                      } else {
                        e.currentTarget.style.width = '6px';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (position === 'top' || position === 'bottom') {
                        e.currentTarget.style.height = '4px';
                      } else {
                        e.currentTarget.style.width = '4px';
                      }
                    }}
                  />
                ))}
              </>
            )}
          </div>
          </>
        );
      
      case 'video':
        // Use new VideoElement component with clean padding-bottom implementation
        return (
          <>
            {/* Canvas Media Toolbar - Shows when video is selected */}
            {isSelected && viewMode === 'edit' && (
              <CanvasMediaToolbar elementId={element.id} elementType="video" elementProps={props} />
            )}
            <VideoElement
              source={props.source || props.platform || 'youtube'}
              url={props.url || ''}
              thumbnail={props.thumbnail}
              autoplay={props.autoplay || false}
              loop={props.loop || false}
              muted={props.muted || false}
              controls={props.controls !== false}
              startTime={props.startTime}
              endTime={props.endTime}
              videoWidth={props.videoWidth || '100%'}
              videoWidthPercent={props.videoWidthPercent}
              customVideoWidth={props.customVideoWidth}
              alignment={(normalizeAlignment(props) === 'justify' ? 'center' : normalizeAlignment(props)) as 'left' | 'center' | 'right'}
              borderRadius={props.borderRadius || 0}
              boxShadow={props.boxShadow || props.shadowEnabled || false}
              padding={props.padding || 0}
              margin={props.margin || 0}
              backgroundColor={props.backgroundColor}
              overlay={props.overlay || false}
              overlayColor={props.overlayColor || '#000000'}
              overlayOpacity={props.overlayOpacity || 40}
              aspectRatio={props.aspectRatio || '16:9'}
              customAspectWidth={props.customAspectWidth}
              customAspectHeight={props.customAspectHeight}
              videoMask={props.videoMask}
              customMaskRadius={props.customMaskRadius}
              frameStyle={props.frameStyle}
              framePadding={props.framePadding}
              frameBackgroundColor={props.frameBackgroundColor}
              frameBorderEnabled={props.frameBorderEnabled}
              frameBorderWidth={props.frameBorderWidth}
              frameBorderColor={props.frameBorderColor}
              shadowPreset={props.shadowPreset}
              ambientGlow={props.ambientGlow}
              ambientGlowColor={props.ambientGlowColor}
              title={props.title}
              description={props.description}
              isEditMode={viewMode === 'edit'}
              playButtonStyle={props.playButtonStyle || 'default'}
              playButtonSize={props.playButtonSize || 'medium'}
              playButtonBackgroundColor={props.playButtonBackgroundColor || '#ffffff'}
              playButtonIconColor={props.playButtonIconColor || '#000000'}
              onPlay={() => {
                // Analytics tracking
                if (props.onPlayAction === 'analytics') {
                // Track play event
                console.log('Video play tracked');
              }
            }}
            onPause={() => {
              // Pause tracking
            }}
            onEnd={() => {
              // End tracking and actions
              if (props.onEndAction === 'redirect' && props.redirectUrl) {
                // Handle redirect
              }
            }}
          />
          </>
        );
      
      case 'gif':
        // Calculate GIF dimensions (same logic as image)
        const gifWidth = props.width === 'full' ? '100%' :
                        props.customWidth ? `${props.customWidth}px` :
                        props.width && typeof props.width === 'string' && props.width.includes('px') ? props.width :
                        '600px'; // Default width
        
        const gifHeight = props.height === 'auto' ? 'auto' :
                         props.customHeight ? `${props.customHeight}px` :
                         props.height && typeof props.height === 'string' && props.height.includes('px') ? props.height :
                         '400px'; // Default height
        
        // Use unified alignment utility
        const gifAlignment = normalizeAlignment(props);
        const gifAlignClass = getAlignmentClasses(gifAlignment);
        const gifMarginClass = getAlignmentMarginClasses(gifAlignment);

        // Handle resize for GIF elements (same as image)
        const handleGifResizeStart = (e: React.MouseEvent) => {
          if (element.type !== 'gif' || !isSelected || viewMode !== 'edit') return;
          e.preventDefault();
          e.stopPropagation();
          
          const currentWidth = props.customWidth || parseInt(props.width?.replace('px', '') || '600') || 600;
          const currentHeight = props.customHeight || parseInt(props.height?.replace('px', '') || '400') || 400;
          
          setIsResizing(true);
          setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: currentWidth,
            height: currentHeight,
          });
        };

        const handleGifResizeMove = (e: MouseEvent) => {
          if (!isResizing || !resizeStart || element.type !== 'gif') return;
          
          const deltaX = e.clientX - resizeStart.x;
          const deltaY = e.clientY - resizeStart.y;
          
          // Calculate new dimensions
          let newWidth = resizeStart.width + deltaX;
          let newHeight = resizeStart.height + deltaY;
          
          // If Shift is held, maintain aspect ratio
          if (e.shiftKey) {
            const scale = Math.max(deltaX / resizeStart.width, deltaY / resizeStart.height);
            newWidth = resizeStart.width + (resizeStart.width * scale);
            newHeight = resizeStart.height + (resizeStart.height * scale);
          }
          
          // Apply constraints
          newWidth = Math.max(50, Math.min(1200, newWidth));
          newHeight = Math.max(50, Math.min(800, newHeight));
          
          updateElement(element.id, {
            customWidth: Math.round(newWidth),
            customHeight: Math.round(newHeight),
            width: 'custom',
            height: 'custom',
          });
        };

        const handleGifResizeEnd = () => {
          if (element.type === 'gif') {
            setIsResizing(false);
            setResizeStart(null);
          }
        };

        React.useEffect(() => {
          if (isResizing && element.type === 'gif') {
            document.addEventListener('mousemove', handleGifResizeMove);
            document.addEventListener('mouseup', handleGifResizeEnd);
            return () => {
              document.removeEventListener('mousemove', handleGifResizeMove);
              document.removeEventListener('mouseup', handleGifResizeEnd);
            };
          }
        }, [isResizing, resizeStart, element.type]);

        // Get border class from borderStyle prop for GIF
        const gifBorderClass = props.borderStyle ? `border-${props.borderStyle}` : '';
        
        const gifContent = props.url ? (
          <img
            src={props.url}
            alt={props.alt || 'GIF'}
            className={cn(
              gifMarginClass,
              'object-cover rounded-lg',
              props.className,
              gifBorderClass
            )}
            style={{
              width: gifWidth,
              height: gifHeight === 'auto' ? undefined : gifHeight,
              borderRadius: `${props.borderRadius || 0}px`,
              display: 'block',
              maxWidth: '100%',
            }}
            onDoubleClick={handleDoubleClick}
            draggable={false}
          />
        ) : (
          <div 
            className="relative mx-auto bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center overflow-hidden"
            style={{
              width: gifWidth,
              height: gifHeight === 'auto' ? '400px' : gifHeight,
              borderRadius: `${props.borderRadius || 8}px`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <Play size={64} className="text-gray-300 dark:text-gray-600" />
            </div>
            <div className="relative z-10 text-center p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg m-4">
              <Play size={32} className="mx-auto mb-3 text-gray-400 dark:text-gray-500" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                No GIF Selected
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Configure GIF in settings panel →
              </p>
            </div>
          </div>
        );

        return (
          <>
            {/* Canvas Media Toolbar - Shows when GIF is selected */}
            {isSelected && viewMode === 'edit' && (
              <CanvasMediaToolbar elementId={element.id} elementType="gif" elementProps={props} />
            )}
            
            <div 
              className={`flex w-full ${gifAlignClass} relative`}
              data-element-id={element.id}
              onClick={(e) => {
                // Don't select element if we're in resize mode
                if (isResizeMode) {
                  e.stopPropagation();
                }
              }}
            >
            {/* Resize Mode Highlight Overlay - Animated */}
            {element.type === 'gif' && isResizeMode && (
              <div 
                className="absolute inset-0 pointer-events-none z-40 rounded-lg transition-all duration-300 ease-out"
                style={{
                  boxShadow: '0 0 0 4px rgba(249, 115, 22, 0.4), 0 0 20px rgba(249, 115, 22, 0.2)',
                  animation: 'pulse-glow 2s ease-in-out infinite',
                }}
              />
            )}
            
            {props.clickable && props.url ? (
              <a
                href={props.clickUrl || '#'}
                target={props.openInNewTab ? '_blank' : '_self'}
                rel={props.openInNewTab ? 'noopener noreferrer' : undefined}
                style={{ display: 'block' }}
                onClick={(e) => {
                  if (isResizeMode) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDoubleClick(e as any);
                }}
              >
                {gifContent}
              </a>
            ) : (
              gifContent
            )}
            
            {/* Resize Handles - Only show when in resize mode */}
            {element.type === 'gif' && isResizeMode && viewMode === 'edit' && (
              <>
                {/* Edge resize handles - positioned on edges with animation */}
                {['top', 'right', 'bottom', 'left'].map((position) => (
                  <div
                    key={position}
                    className="absolute bg-orange-500 border-2 border-white z-50 shadow-lg transition-all duration-300 ease-out"
                    style={{
                      [position]: '0px',
                      ...(position === 'top' || position === 'bottom'
                        ? { width: '100%', height: '4px', left: '0px', cursor: 'ns-resize', animation: 'fadeInWidth 0.3s ease-out' }
                        : { width: '4px', height: '100%', top: '0px', cursor: 'ew-resize', animation: 'fadeInHeight 0.3s ease-out' }),
                    }}
                    onMouseDown={handleGifResizeStart}
                    onMouseEnter={(e) => {
                      if (position === 'top' || position === 'bottom') {
                        e.currentTarget.style.height = '6px';
                      } else {
                        e.currentTarget.style.width = '6px';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (position === 'top' || position === 'bottom') {
                        e.currentTarget.style.height = '4px';
                      } else {
                        e.currentTarget.style.width = '4px';
                      }
                    }}
                  />
                ))}
              </>
            )}
          </div>
          </>
        );
      
      case 'form':
        const FormComponent = () => {
          const formFields = props.fields || [];
          const formType = props.formType || 'form';
          const [formData, setFormData] = React.useState<Record<string, any>>({});
          const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
          
          const handleFieldChange = (fieldId: string, value: any) => {
            setFormData(prev => ({ ...prev, [fieldId]: value }));
          };

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          
          // Basic validation
          const errors: Record<string, string> = {};
          formFields.forEach((field: any) => {
            if (field.required && !formData[field.id]) {
              errors[field.id] = field.validation?.errorMessage || `${field.label} is required`;
            }
          });
          
          if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
          }
          
          // Handle form submission
          console.log('Form submitted:', formData);
          
          // Show success message or redirect
          if (props.successMessage) {
            alert(props.successMessage);
          }
          
          if (props.redirectUrl) {
            window.location.href = props.redirectUrl;
          }
        };

          return (
            <div className="w-full max-w-2xl mx-auto">
              <form 
                className={cn(
                  "space-y-4 p-6 rounded-xl shadow-sm border",
                  props.backgroundColor ? '' : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                )}
                style={{
                  backgroundColor: props.backgroundColor || undefined,
                  borderColor: props.fieldBorderColor || undefined,
                }}
                onSubmit={handleSubmit}
              >
                {formFields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No fields added yet. Configure fields in the settings panel.</p>
                  </div>
                ) : (
                  <>
                    {formFields.map((field: any) => (
                      <FormFieldRenderer
                        key={field.id}
                        field={field}
                        value={formData[field.id]}
                        onChange={(value) => handleFieldChange(field.id, value)}
                        errors={formErrors}
                        viewMode={viewMode}
                      />
                    ))}
                    
                    <button
                      type="submit"
                      className={cn(
                        "w-full px-4 py-2 rounded-lg transition-colors font-medium",
                        viewMode === 'preview' && "opacity-50 cursor-not-allowed"
                      )}
                      style={{
                        backgroundColor: props.submitBackgroundColor || '#3b82f6',
                        color: props.submitTextColor || '#ffffff',
                      }}
                      disabled={viewMode === 'preview'}
                    >
                      {props.submitText || 'Submit'}
                    </button>
                  </>
                )}
              </form>
            </div>
          );
        };
        
        return <FormComponent />;
      
      case 'spacer':
        const spacerHeight = props.height || 50;
        return (
          <div 
            className="w-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center"
            style={{ height: `${spacerHeight}px` }}
          >
            <span className="text-xs text-gray-400">Spacer ({spacerHeight}px)</span>
          </div>
        );
      
      case 'divider':
        const dividerAlignClass = props.align === 'left' ? 'justify-start' :
                                 props.align === 'right' ? 'justify-end' :
                                 'justify-center';
        return (
          <div 
            className={`flex items-center ${dividerAlignClass}`}
            style={{
              marginTop: `${props.marginTop || 20}px`,
              marginBottom: `${props.marginBottom || 20}px`,
            }}
          >
            <div 
              className="w-full"
              style={{
                maxWidth: props.width || '100%',
                height: `${props.thickness || 1}px`,
                backgroundColor: props.color || '#e5e7eb',
              }}
            />
          </div>
        );
      
      case 'icon':
        const iconAlignClass = props.align === 'left' ? 'justify-start' :
                             props.align === 'right' ? 'justify-end' :
                             'justify-center';
        return (
          <div className={`flex ${iconAlignClass}`}>
            {props.clickable ? (
              <a
                href={props.clickUrl || '#'}
                target={props.openInNewTab ? '_blank' : '_self'}
                rel={props.openInNewTab ? 'noopener noreferrer' : undefined}
              >
                {renderIcon(props.icon || 'Sparkles', props.iconSize || 48, props.iconColor)}
              </a>
            ) : (
              renderIcon(props.icon || 'Sparkles', props.iconSize || 48, props.iconColor)
            )}
          </div>
        );
      
      case 'list':
        const listStyle = props.style || 'bullet';
        return (
          <div className="space-y-3 p-4 max-w-2xl">
            {listStyle === 'bullet' && (
              <ul className="space-y-2">
                {(props.items || ['First list item - edit in settings', 'Second list item - add more items', 'Third list item - customize style']).map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {listStyle === 'numbered' && (
              <ol className="space-y-2 list-decimal list-inside">
                {(props.items || ['First list item - edit in settings', 'Second list item - add more items', 'Third list item - customize style']).map((item: string, i: number) => (
                  <li key={i} className="text-gray-700 dark:text-gray-300">{item}</li>
                ))}
              </ol>
            )}
          </div>
        );
      
      case 'container':
        return (
          <div 
            className="w-full max-w-2xl mx-auto"
            style={{
              padding: `${props.paddingTop || 32}px ${props.paddingRight || 32}px ${props.paddingBottom || 32}px ${props.paddingLeft || 32}px`,
              backgroundColor: props.backgroundColor || '#ffffff',
              borderRadius: `${props.borderRadius || 0}px`,
              border: props.border ? `1px solid ${props.borderColor || '#e5e7eb'}` : 'none',
            }}
          >
            {props.children || <div className="text-sm text-gray-500">Container - Add elements inside</div>}
          </div>
        );
      
      case 'card':
        return (
          <div 
            className="max-w-sm mx-auto"
            style={{
              padding: `${props.paddingTop || 32}px ${props.paddingRight || 32}px ${props.paddingBottom || 32}px ${props.paddingLeft || 32}px`,
              backgroundColor: props.backgroundColor || '#ffffff',
              borderRadius: `${props.borderRadius || 12}px`,
              boxShadow: props.shadow ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
              border: props.border ? `1px solid ${props.borderColor || '#e5e7eb'}` : 'none',
            }}
          >
            {props.title && (
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {props.title}
              </h3>
            )}
            {props.content && (
              <p className="text-gray-600 dark:text-gray-400">
                {props.content}
              </p>
            )}
            {props.children || <div className="text-sm text-gray-500 mt-4">Card content</div>}
          </div>
        );
      
      case 'testimonial':
        return (
          <div className="space-y-3 p-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {props.title || 'Campaign Progress'}
              </span>
              <span className="text-xs text-gray-500">
                {props.subtitle || 'Optional subtitle'}
              </span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {props.content || 'Testimonial content goes here...'}
            </div>
            {props.author && (
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                — {props.author}
              </div>
            )}
          </div>
        );
      
      case 'faq':
        return (
          <div className="space-y-3 p-4 max-w-2xl mx-auto">
            {(props.questions || [
              {question: 'How do I configure this FAQ?', answer: 'Click on this element and configure your questions and answers in the settings panel.'},
              {question: 'Can I add more questions?', answer: 'Yes, add as many questions as you need in the settings.'},
              {question: 'Is it mobile responsive?', answer: 'Absolutely! All elements are fully responsive.'}
            ]).map((faq: any, i: number) => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {faq.question}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'social-proof':
      case 'socialproof':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm mx-auto border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {props.count ? `${props.count.toLocaleString()} ${props.label || 'Happy Customers'}` : props.text || '1,234 people viewing'}
                </div>
                <div className="text-xs text-gray-500">
                  {props.subtext || 'Right now'}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'pricing':
        return (
          <div className={cn(
            "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 transition-all",
            props.highlighted ? "border-blue-500 scale-105" : "border-gray-200 dark:border-gray-700"
          )}>
            {props.highlighted && (
              <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{props.title || 'Pro Plan'}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{props.description || 'Perfect for growing businesses'}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">{props.price || '$49'}</span>
              <span className="text-gray-500">{props.period || '/month'}</span>
            </div>
            <ul className="space-y-3 mb-6">
              {(props.features || ['Unlimited access', 'Priority support', 'Advanced analytics']).map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className={cn(
              "w-full py-3 px-4 rounded-lg font-semibold transition-colors",
              props.highlighted 
                ? "bg-blue-500 text-white hover:bg-blue-600" 
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
            )}>
              {props.buttonText || 'Get Started'}
            </button>
          </div>
        );
      
      case 'progress':
        const progressPercent = Math.min(100, Math.max(0, (props.value / props.max) * 100));
        return (
          <div className="w-full">
            {props.label && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{props.label}</span>
                {props.showPercentage && (
                  <span className="text-sm font-medium text-gray-500">{Math.round(progressPercent)}%</span>
                )}
              </div>
            )}
            <div 
              className="w-full rounded-full overflow-hidden"
              style={{ 
                backgroundColor: props.backgroundColor || '#e5e7eb',
                height: props.height || 8 
              }}
            >
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progressPercent}%`,
                  backgroundColor: props.color || '#3b82f6'
                }}
              />
            </div>
          </div>
        );
      
      case 'accordion':
        return (
          <AccordionElement
            items={props.items || [
              { id: '1', title: 'Item 1', content: 'Content for item 1' },
              { id: '2', title: 'Item 2', content: 'Content for item 2' },
            ]}
            variant={props.variant || 'default'}
            onUpdate={(updates) => updateElement(element.id, updates)}
            isEditing={isSelected}
          />
        );
      
      case 'tabs':
        return (
          <TabsElement
            tabs={props.tabs || [
              { id: '1', label: 'Tab 1', content: 'Content for tab 1' },
              { id: '2', label: 'Tab 2', content: 'Content for tab 2' },
            ]}
            variant={props.variant || 'default'}
            onUpdate={(updates) => updateElement(element.id, updates)}
            isEditing={isSelected}
          />
        );
      
      case 'modal':
        return (
          <ModalElement
            title={props.title || 'Modal Title'}
            content={props.content || 'Add your modal content here...'}
            size={props.size || 'md'}
            position={props.position || 'center'}
            onUpdate={(updates) => updateElement(element.id, updates)}
            isEditing={isSelected}
          />
        );
      
      case 'alert':
        return (
          <AlertElement
            title={props.title || 'Alert Title'}
            message={props.message || 'This is an alert message.'}
            variant={props.variant || 'info'}
            dismissible={props.dismissible ?? true}
            onUpdate={(updates) => updateElement(element.id, updates)}
            isEditing={isSelected}
          />
        );
      
      case 'badge':
        return (
          <BadgeElement
            text={props.text || 'Badge'}
            variant={props.variant || 'default'}
            size={props.size || 'md'}
            rounded={props.rounded || 'md'}
            icon={props.icon || 'none'}
            iconPosition={props.iconPosition || 'left'}
            removable={props.removable ?? false}
            animated={props.animated ?? false}
            onUpdate={(updates) => updateElement(element.id, updates)}
            isEditing={isSelected}
          />
        );
      
      case 'countdown':
        return (
          <CountdownTimer
            targetDate={props.targetDate}
            countdownType={props.countdownType || 'fixed'}
            evergreenDays={props.evergreenDays}
            evergreenHours={props.evergreenHours}
            recurringTime={props.recurringTime}
            displayFormat={props.displayFormat || 'full'}
            visualStyle={props.visualStyle || 'flip'}
            title={props.title}
            daysLabel={props.daysLabel}
            hoursLabel={props.hoursLabel}
            minutesLabel={props.minutesLabel}
            secondsLabel={props.secondsLabel}
            numberColor={props.numberColor}
            labelColor={props.labelColor}
            titleColor={props.titleColor}
            backgroundColor={props.backgroundColor}
            fontSize={props.fontSize}
            labelFontSize={props.labelFontSize}
            titleFontSize={props.titleFontSize}
            fontWeight={props.fontWeight}
            textDecoration={props.textDecoration}
            textTransform={props.textTransform}
            letterSpacing={props.letterSpacing}
            lineHeight={props.lineHeight}
            paddingTop={props.paddingTop}
            paddingBottom={props.paddingBottom}
            paddingLeft={props.paddingLeft}
            paddingRight={props.paddingRight}
            borderRadius={props.borderRadius}
            gap={props.gap}
            alignment={props.alignment}
            showSeparator={props.showSeparator}
            animateNumbers={props.animateNumbers}
            pulseOnLowTime={props.pulseOnLowTime}
            lowTimeThreshold={props.lowTimeThreshold}
            expiredMessage={props.expiredMessage}
            hideOnExpire={props.hideOnExpire}
            glowEffect={props.glowEffect}
            digitShape={props.digitShape}
            showProgress={props.showProgress}
            onUpdate={(updates) => updateElement(element.id, updates)}
            editable={isSelected && viewMode === 'edit'}
          />
        );
      
      case 'logo-showcase':
        return (
          <LogoShowcaseElement
            id={element.id}
            logos={props.logos || []}
            settings={props.settings || defaultLogoShowcaseSettings}
            darkMode={false}
            className={cn(
              'w-full',
              isSelected && 'ring-2 ring-primary ring-offset-2'
            )}
          />
        );

      case 'guarantee':
        return (
          <GuaranteeBadgeElement
            variant={props.variant || 'gold-seal'}
            days={props.days || 30}
            title={props.title || 'Money Back'}
            subtitle={props.subtitle || 'Guarantee'}
            primaryColor={props.primaryColor}
            secondaryColor={props.secondaryColor}
            textColor={props.textColor || '#ffffff'}
            size={props.size || 'md'}
            showDays={props.showDays ?? true}
            customText={props.customText}
          />
        );

      case 'feature-box':
        return (
          <FeatureBoxElement
            icon={props.icon || 'Zap'}
            title={props.title || 'Feature Title'}
            description={props.description || 'Describe your amazing feature here.'}
            layout={props.layout || 'vertical'}
            iconSize={props.iconSize || 'md'}
            iconColor={props.iconColor || '#3b82f6'}
            iconBackgroundColor={props.iconBackgroundColor || '#eff6ff'}
            iconStyle={props.iconStyle || 'filled'}
            titleColor={props.titleColor || '#111827'}
            descriptionColor={props.descriptionColor || '#6b7280'}
            backgroundColor={props.backgroundColor || 'transparent'}
            borderColor={props.borderColor || '#e5e7eb'}
            borderRadius={props.borderRadius || 12}
            padding={props.padding || 24}
            alignment={props.alignment || 'center'}
            showBorder={props.showBorder ?? false}
            showShadow={props.showShadow ?? false}
          />
        );

      case 'comparison':
        return (
          <ComparisonTableElement
            type={props.type || 'us-vs-them'}
            leftTitle={props.leftTitle || 'Others'}
            rightTitle={props.rightTitle || 'Us'}
            leftSubtitle={props.leftSubtitle}
            rightSubtitle={props.rightSubtitle}
            items={props.items}
            leftColor={props.leftColor || '#ef4444'}
            rightColor={props.rightColor || '#10b981'}
            leftBgColor={props.leftBgColor || '#fef2f2'}
            rightBgColor={props.rightBgColor || '#ecfdf5'}
            highlightRight={props.highlightRight ?? true}
            showIcons={props.showIcons ?? true}
            borderRadius={props.borderRadius || 12}
          />
        );

      case 'star-rating':
        return (
          <StarRatingElement
            rating={props.rating || 4.8}
            maxRating={props.maxRating || 5}
            size={props.size || 'md'}
            color={props.color || '#facc15'}
            emptyColor={props.emptyColor || '#e5e7eb'}
            showCount={props.showCount ?? true}
            count={props.count || 2847}
            countText={props.countText || 'reviews'}
            layout={props.layout || 'horizontal'}
            alignment={props.alignment || 'left'}
          />
        );

      // ============================================
      // HYPERUI COMPONENTS
      // ============================================
      case 'announcement':
        return (
          <AnnouncementElement
            variant={props.variant || 'base'}
            text={props.text || '🎉 New feature available! Check out our latest update.'}
            linkText={props.linkText}
            linkUrl={props.linkUrl}
            backgroundColor={props.backgroundColor || '#3b82f6'}
            textColor={props.textColor || '#ffffff'}
            showIcon={props.showIcon ?? true}
            dismissible={props.dismissible ?? false}
          />
        );

      case 'contact-form':
        return (
          <ContactFormElement
            variant={props.variant || 'simple'}
            title={props.title || 'Get in Touch'}
            subtitle={props.subtitle}
            showPhone={props.showPhone ?? false}
            showEmail={props.showEmail ?? false}
            showAddress={props.showAddress ?? false}
            buttonText={props.buttonText || 'Send Message'}
            buttonColor={props.buttonColor || '#3b82f6'}
            backgroundColor={props.backgroundColor || '#ffffff'}
          />
        );

      case 'cta-block':
        return (
          <CTABlockElement
            variant={props.variant || 'centered'}
            title={props.title || 'Ready to get started?'}
            subtitle={props.subtitle}
            primaryButtonText={props.primaryButtonText || 'Get Started'}
            secondaryButtonText={props.secondaryButtonText}
            primaryButtonColor={props.primaryButtonColor || '#3b82f6'}
            imageUrl={props.imageUrl}
            backgroundColor={props.backgroundColor || '#f9fafb'}
            gradientFrom={props.gradientFrom || '#667eea'}
            gradientTo={props.gradientTo || '#764ba2'}
          />
        );

      case 'newsletter':
        return (
          <NewsletterElement
            variant={props.variant || 'simple'}
            title={props.title || 'Subscribe to our newsletter'}
            subtitle={props.subtitle}
            buttonText={props.buttonText || 'Subscribe'}
            buttonColor={props.buttonColor || '#3b82f6'}
            backgroundColor={props.backgroundColor || '#f9fafb'}
            benefits={props.benefits || []}
          />
        );

      case 'header-block':
        return (
          <HeaderBlockElement
            variant={props.variant || 'centered'}
            title={props.title || 'Build Something Amazing'}
            subtitle={props.subtitle}
            eyebrow={props.eyebrow}
            badge={props.badge}
            alignment={props.alignment || 'center'}
            titleColor={props.titleColor || '#1f2937'}
            subtitleColor={props.subtitleColor || '#6b7280'}
          />
        );

      case 'feature-grid':
        return (
          <FeatureGridElement
            variant={props.variant || '3-column'}
            features={props.features || [
              { icon: 'Zap', title: 'Lightning Fast', description: 'Optimized for speed.' },
              { icon: 'Shield', title: 'Secure', description: 'Enterprise-grade security.' },
              { icon: 'Heart', title: 'Easy to Use', description: 'Intuitive interface.' },
            ]}
            backgroundColor={props.backgroundColor || '#ffffff'}
            iconColor={props.iconColor || '#3b82f6'}
          />
        );

      case 'button-group':
        return (
          <ButtonGroupElement
            variant={props.variant || 'horizontal'}
            buttons={props.buttons || [
              { text: 'Get Started', style: 'primary' },
              { text: 'Learn More', style: 'secondary' },
            ]}
            alignment={props.alignment || 'center'}
            size={props.size || 'md'}
            primaryColor={props.primaryColor || '#3b82f6'}
          />
        );

      case 'logo-cloud':
        return (
          <LogoCloudElement
            variant={props.variant || 'simple'}
            title={props.title}
            logos={props.logos || [
              { name: 'Company 1' },
              { name: 'Company 2' },
              { name: 'Company 3' },
              { name: 'Company 4' },
            ]}
            grayscale={props.grayscale ?? true}
            backgroundColor={props.backgroundColor || '#ffffff'}
          />
        );

      case 'banner':
        return (
          <BannerElement
            variant={props.variant || 'info'}
            text={props.text || 'New features are now available!'}
            linkText={props.linkText}
            linkUrl={props.linkUrl}
            dismissible={props.dismissible ?? true}
            icon={props.icon ?? true}
          />
        );

      case 'poll':
        return (
          <PollElement
            variant={props.variant || 'simple'}
            question={props.question || 'What feature would you like to see next?'}
            options={props.options || [
              { text: 'Dark mode', votes: 45 },
              { text: 'Mobile app', votes: 32 },
              { text: 'API access', votes: 23 },
            ]}
            showResults={props.showResults ?? false}
            totalVotes={props.totalVotes}
            backgroundColor={props.backgroundColor || '#ffffff'}
            accentColor={props.accentColor || '#3b82f6'}
          />
        );

      case 'team-section':
        return (
          <TeamSectionElement
            variant={props.variant || 'grid'}
            title={props.title || 'Meet Our Team'}
            subtitle={props.subtitle}
            members={props.members || [
              { name: 'John Doe', role: 'CEO & Founder' },
              { name: 'Jane Smith', role: 'CTO' },
              { name: 'Mike Johnson', role: 'Lead Designer' },
            ]}
            columns={props.columns || 3}
            backgroundColor={props.backgroundColor || '#ffffff'}
          />
        );

      case 'steps':
        return (
          <StepsElement
            variant={props.variant || 'numbered'}
            title={props.title || 'How It Works'}
            steps={props.steps || [
              { title: 'Sign Up', description: 'Create your free account.' },
              { title: 'Customize', description: 'Set up your preferences.' },
              { title: 'Launch', description: 'Go live and start growing.' },
            ]}
            accentColor={props.accentColor || '#3b82f6'}
            backgroundColor={props.backgroundColor || '#ffffff'}
          />
        );

      case 'product-collection':
        return (
          <ProductCollectionElement
            variant={props.variant || 'grid'}
            title={props.title || 'Featured Products'}
            products={props.products || [
              { name: 'Product One', price: '$49.99', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' },
              { name: 'Product Two', price: '$79.99', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop' },
            ]}
            columns={props.columns || 3}
            backgroundColor={props.backgroundColor || '#ffffff'}
          />
        );
      
      default:
        return (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-400">
            {element.type} element
          </div>
        );
    }
  };

  // Get element type icon
  const getElementIcon = () => {
    switch (element.type) {
      case 'heading':
      case 'text':
        return <Type size={10} className="text-white drop-shadow-sm" />;
      case 'image':
      case 'gif':
        return <ImageIcon size={10} className="text-white drop-shadow-sm" />;
      case 'button':
        return <MousePointer size={10} className="text-white drop-shadow-sm" />;
      default:
        return <AlignLeft size={10} className="text-white drop-shadow-sm" />;
    }
  };

  // Get element display name
  const getElementDisplayName = () => {
    const typeNames: Record<string, string> = {
      'heading': 'Heading',
      'text': 'Text',
      'button': 'Button',
      'image': 'Image',
      'gif': 'GIF',
      'video': 'Video',
      'divider': 'Divider',
      'spacer': 'Spacer',
    };
    return typeNames[element.type] || element.type.charAt(0).toUpperCase() + element.type.slice(1);
  };

  return (
    <div
      ref={elementRef}
      data-element-id={element.id}
      className="relative group"
      onPointerEnter={(e) => {
        e.stopPropagation();
        // Don't set hover if column resize is active
        if (!globalIsResizing) {
          setHover('element', element.id);
        }
      }}
      onPointerLeave={(e) => {
        // Clear element hover and restore row hover if pointer is still in row
        if (hoveredType === 'element' && hoveredId === element.id) {
          // Find the row container
          const rowElement = elementRef.current?.closest('[data-row-id]');
          if (rowElement) {
            const rowRect = rowElement.getBoundingClientRect();
            const { clientX, clientY } = e;
            
            // Check if pointer is still within row bounds
            const isInRow = clientX >= rowRect.left && clientX <= rowRect.right &&
                           clientY >= rowRect.top && clientY <= rowRect.bottom;
            
            if (isInRow) {
              // Restore row hover
              const rowId = rowElement.getAttribute('data-row-id');
              if (rowId) {
                setHover('row', rowId);
              }
            } else {
              setHover(null, null);
            }
          } else {
            setHover(null, null);
          }
        }
      }}
      onClick={(e) => {
        // Don't select if double-clicking or in resize mode
        if (isResizeMode) {
          e.stopPropagation();
          return;
        }
        
        // CRITICAL: Stop propagation FIRST to prevent column selection
        e.stopPropagation();
        
        // Don't interfere with text selection - check if user is selecting text
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          return;
        }
        
        selectElement(element.id);
      }}
    >
      {/* Outline Border - Shows on hover/selected */}
      {(isHovered || isSelected) && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-150 ease-in"
          style={{ 
            zIndex: 1,
            border: isSelected 
              ? '2.5px solid rgba(249, 115, 22, 0.8)' 
              : '2.5px solid rgba(251, 146, 60, 0.5)',
          }}
        />
      )}

      {/* Element Header Bar - Similar to Row header */}
      {isHovered && viewMode === 'edit' && (
        <div 
          data-header-bar="element"
          className="absolute flex items-center z-[130]"
          style={{ 
            pointerEvents: 'auto', 
            left: '0px',
            top: '0px',
          }}
        >
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-br-md shadow-lg border-r border-b border-orange-400/40 backdrop-blur-sm">
            {/* Element Icon */}
            {getElementIcon()}

            {/* Element Name */}
            <span className="text-[9px] font-semibold tracking-wide uppercase text-white drop-shadow-sm">
              {getElementDisplayName()}
            </span>
          </div>
        </div>
      )}

      {/* Element Actions - Right corner */}
      {isHovered && viewMode === 'edit' && (
        <div 
          data-header-bar="element-actions"
          className="absolute flex items-center z-[130]"
          style={{ 
            pointerEvents: 'auto', 
            right: '0px',
            top: '0px',
          }}
        >
          <div className="flex items-center gap-0.5 px-1 py-0.5 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-bl-md shadow-lg border-l border-b border-orange-400/40 backdrop-blur-sm">
            {/* Move Up */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveElementUp(element.id);
              }}
              disabled={elementIndex === 0}
              className="hover:bg-white/20 p-0.5 rounded transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
              title="Move Up"
            >
              <ChevronUp size={10} className="text-white drop-shadow-sm" />
            </button>

            {/* Move Down */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveElementDown(element.id);
              }}
              disabled={elementIndex >= (totalElements ?? 1) - 1}
              className="hover:bg-white/20 p-0.5 rounded transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
              title="Move Down"
            >
              <ChevronDown size={10} className="text-white drop-shadow-sm" />
            </button>

            {/* Divider */}
            <div className="w-px h-2.5 bg-white/20 mx-0.5" />

            {/* Delete Element */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this element?')) {
                  deleteElement(element.id);
                }
              }}
              className="hover:bg-red-500/40 p-0.5 rounded transition-all duration-200 hover:scale-110 active:scale-95"
              title="Delete Element"
            >
              <Trash2 size={10} className="text-red-100 drop-shadow-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Element Content */}
      <div 
        className="relative" 
        style={{ 
          zIndex: 0, 
          width: '100%', 
          maxWidth: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
        }}
      >
        {renderElement()}
      </div>
    </div>
  );
}
