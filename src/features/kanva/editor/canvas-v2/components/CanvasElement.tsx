/**
 * Canvas Element Components
 * 
 * Memoized element renderers with:
 * - Custom comparison for optimal re-renders
 * - Consistent styling and transforms
 * - Accessibility attributes
 */

'use client';

import React, { memo, useCallback, useMemo } from 'react';
import type { 
  TextElement, 
  ImageElement, 
  ShapeElement, 
  EditorElement 
} from '../../../lib/editor/types';

// ============================================
// TYPES
// ============================================

export interface ElementProps {
  element: EditorElement;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onHover: (id: string | null) => void;
  onDragStart: (id: string, e: React.MouseEvent) => void;
  onDoubleClick?: (id: string) => void;
  measuredWidth?: number;
  measuredHeight?: number;
}

// ============================================
// SHARED STYLES
// ============================================

function getElementStyle(
  element: EditorElement,
  width: number,
  height: number,
  isSelected: boolean,
  isHovered: boolean
): React.CSSProperties {
  return {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width,
    height,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    transformOrigin: 'center center',
    opacity: element.opacity ?? 1,
    cursor: element.locked ? 'not-allowed' : 'move',
    outline: isSelected 
      ? '2px solid #3b82f6' 
      : isHovered 
        ? '1px solid #93c5fd' 
        : 'none',
    outlineOffset: isSelected ? -1 : 0,
    userSelect: 'none',
    pointerEvents: element.locked ? 'none' : 'auto',
  };
}

// ============================================
// TEXT ELEMENT
// ============================================

interface TextElementProps extends ElementProps {
  element: TextElement;
}

const TextElementComponent = memo<TextElementProps>(({
  element,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onDragStart,
  onDoubleClick,
  measuredWidth = 100,
  measuredHeight = 32,
}) => {
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (element.locked) return;
    e.stopPropagation();
    onSelect(element.id, e);
    onDragStart(element.id, e);
  }, [element.id, element.locked, onSelect, onDragStart]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick?.(element.id);
  }, [element.id, onDoubleClick]);

  const style = useMemo(() => ({
    ...getElementStyle(element, measuredWidth, measuredHeight, isSelected, isHovered),
    fontFamily: element.fontFamily,
    fontSize: element.fontSize,
    fontWeight: element.fontWeight,
    fontStyle: element.fontStyle,
    color: element.fill,
    textAlign: element.align,
    lineHeight: element.lineHeight || 1.2,
    letterSpacing: element.letterSpacing || 0,
    textDecoration: element.textDecoration || 'none',
    whiteSpace: element.autoWidth ? 'nowrap' : 'pre-wrap',
    wordBreak: 'break-word' as const,
    overflow: 'visible',
  }), [element, measuredWidth, measuredHeight, isSelected, isHovered]);

  return (
    <div
      style={style}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => onHover(element.id)}
      onMouseLeave={() => onHover(null)}
      onDoubleClick={handleDoubleClick}
      role="button"
      tabIndex={0}
      aria-label={`Text: ${element.text.substring(0, 50)}${element.text.length > 50 ? '...' : ''}`}
      aria-selected={isSelected}
      data-element-id={element.id}
      data-element-type="text"
    >
      {element.text}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for optimal re-renders
  return (
    prevProps.element === nextProps.element &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered &&
    prevProps.measuredWidth === nextProps.measuredWidth &&
    prevProps.measuredHeight === nextProps.measuredHeight
  );
});

TextElementComponent.displayName = 'TextElement';

// ============================================
// IMAGE ELEMENT
// ============================================

interface ImageElementProps extends ElementProps {
  element: ImageElement;
}

const ImageElementComponent = memo<ImageElementProps>(({
  element,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onDragStart,
}) => {
  const width = element.width || 200;
  const height = element.height || 200;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (element.locked) return;
    e.stopPropagation();
    onSelect(element.id, e);
    onDragStart(element.id, e);
  }, [element.id, element.locked, onSelect, onDragStart]);

  const containerStyle = useMemo(() => 
    getElementStyle(element, width, height, isSelected, isHovered),
    [element, width, height, isSelected, isHovered]
  );

  const imageStyle = useMemo((): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    pointerEvents: 'none',
    filter: element.filters ? [
      element.filters.brightness !== undefined && `brightness(${element.filters.brightness}%)`,
      element.filters.contrast !== undefined && `contrast(${element.filters.contrast}%)`,
      element.filters.saturation !== undefined && `saturate(${element.filters.saturation}%)`,
      element.filters.blur !== undefined && `blur(${element.filters.blur}px)`,
    ].filter(Boolean).join(' ') : undefined,
  }), [element.filters]);

  return (
    <div
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => onHover(element.id)}
      onMouseLeave={() => onHover(null)}
      role="img"
      tabIndex={0}
      aria-label="Image element"
      aria-selected={isSelected}
      data-element-id={element.id}
      data-element-type="image"
    >
      <img
        src={element.src}
        alt=""
        style={imageStyle}
        draggable={false}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.element === nextProps.element &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered
  );
});

ImageElementComponent.displayName = 'ImageElement';

// ============================================
// SHAPE ELEMENT
// ============================================

interface ShapeElementProps extends ElementProps {
  element: ShapeElement;
}

const ShapeElementComponent = memo<ShapeElementProps>(({
  element,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onDragStart,
}) => {
  const width = element.width || 100;
  const height = element.height || 100;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (element.locked) return;
    e.stopPropagation();
    onSelect(element.id, e);
    onDragStart(element.id, e);
  }, [element.id, element.locked, onSelect, onDragStart]);

  const containerStyle = useMemo(() => 
    getElementStyle(element, width, height, isSelected, isHovered),
    [element, width, height, isSelected, isHovered]
  );

  const renderShape = () => {
    const fill = element.fill || '#3b82f6';
    const stroke = element.stroke || 'transparent';
    const strokeWidth = element.strokeWidth || 0;

    switch (element.shapeType) {
      case 'rect':
        return (
          <svg width={width} height={height} style={{ overflow: 'visible' }}>
            <rect
              x={strokeWidth / 2}
              y={strokeWidth / 2}
              width={width - strokeWidth}
              height={height - strokeWidth}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              rx={element.cornerRadius || 0}
            />
          </svg>
        );
      
      case 'circle':
        const rx = (width - strokeWidth) / 2;
        const ry = (height - strokeWidth) / 2;
        return (
          <svg width={width} height={height} style={{ overflow: 'visible' }}>
            <ellipse
              cx={width / 2}
              cy={height / 2}
              rx={rx}
              ry={ry}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </svg>
        );
      
      case 'triangle':
        const points = `${width / 2},${strokeWidth / 2} ${width - strokeWidth / 2},${height - strokeWidth / 2} ${strokeWidth / 2},${height - strokeWidth / 2}`;
        return (
          <svg width={width} height={height} style={{ overflow: 'visible' }}>
            <polygon
              points={points}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </svg>
        );
      
      case 'line':
        return (
          <svg width={width} height={height} style={{ overflow: 'visible' }}>
            <line
              x1={0}
              y1={height / 2}
              x2={width}
              y2={height / 2}
              stroke={stroke || fill}
              strokeWidth={strokeWidth || 2}
            />
          </svg>
        );
      
      default:
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: fill,
              border: strokeWidth ? `${strokeWidth}px solid ${stroke}` : undefined,
              borderRadius: element.cornerRadius || 0,
            }}
          />
        );
    }
  };

  return (
    <div
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => onHover(element.id)}
      onMouseLeave={() => onHover(null)}
      role="img"
      tabIndex={0}
      aria-label={`${element.shapeType} shape`}
      aria-selected={isSelected}
      data-element-id={element.id}
      data-element-type="shape"
    >
      {renderShape()}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.element === nextProps.element &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered
  );
});

ShapeElementComponent.displayName = 'ShapeElement';

// ============================================
// ELEMENT FACTORY
// ============================================

export const CanvasElement = memo<ElementProps>(({
  element,
  ...props
}) => {
  switch (element.type) {
    case 'text':
      return <TextElementComponent element={element as TextElement} {...props} />;
    case 'image':
      return <ImageElementComponent element={element as ImageElement} {...props} />;
    case 'shape':
      return <ShapeElementComponent element={element as ShapeElement} {...props} />;
    default:
      console.warn(`Unknown element type: ${element.type}`);
      return null;
  }
});

CanvasElement.displayName = 'CanvasElement';

export { TextElementComponent, ImageElementComponent, ShapeElementComponent };
