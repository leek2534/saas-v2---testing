/**
 * TextStyleRenderer - Professional text rendering with layered effects
 * Supports both SVG (high-quality) and HTML (fallback) rendering
 */

import React from 'react';
import { TextStylePreset, Layer, Decoration } from '../lib/text/textStyleTypes';

interface TextStyleRendererProps {
  preset: TextStylePreset;
  text: string;
  subtext?: string;
  maxWidth?: number;
  fontSize?: number;
  className?: string;
}

export function TextStyleRenderer({
  preset,
  text,
  subtext,
  maxWidth = 800,
  fontSize = 48,
  className = '',
}: TextStyleRendererProps) {
  // Determine render mode
  const mode = preset.renderMode === 'auto' 
    ? (preset.layers.some(l => ['stroke', 'texture', 'shadow', 'glow'].includes(l.type)) ? 'svg' : 'html')
    : preset.renderMode;

  if (mode === 'html') {
    return (
      <HTMLTextRenderer
        preset={preset}
        text={text}
        subtext={subtext}
        maxWidth={maxWidth}
        fontSize={fontSize}
        className={className}
      />
    );
  }

  return (
    <SVGTextRenderer
      preset={preset}
      text={text}
      subtext={subtext}
      maxWidth={maxWidth}
      fontSize={fontSize}
      className={className}
    />
  );
}

// HTML Fallback Renderer (simple, editable, performant)
function HTMLTextRenderer({
  preset,
  text,
  subtext,
  maxWidth,
  fontSize,
  className,
}: TextStyleRendererProps) {
  const primaryFont = preset.fonts.primary;
  const fillLayer = preset.layers.find(l => l.type === 'fill');
  const shadowLayer = preset.layers.find(l => l.type === 'shadow');
  const strokeLayer = preset.layers.find(l => l.type === 'stroke');

  const textStyle: React.CSSProperties = {
    display: 'inline-block',
    maxWidth,
    fontFamily: primaryFont,
    fontSize,
    lineHeight: 1.2,
    color: fillLayer?.color || preset.palette[0] || '#000',
    fontWeight: 'bold',
  };

  // Add text shadow if present
  if (shadowLayer) {
    const offsetX = shadowLayer.offset?.x || 0;
    const offsetY = shadowLayer.offset?.y || 0;
    const blur = shadowLayer.blur || 0;
    const color = shadowLayer.color || '#000';
    textStyle.textShadow = `${offsetX}px ${offsetY}px ${blur}px ${color}`;
  }

  // Add text stroke if present (webkit only)
  if (strokeLayer) {
    textStyle.WebkitTextStroke = `${strokeLayer.strokeWidth || 2}px ${strokeLayer.color || '#000'}`;
    textStyle.WebkitTextFillColor = fillLayer?.color || 'transparent';
  }

  return (
    <div className={className} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Background decorations */}
      {preset.decorations?.filter(d => d.position === 'behind').map(renderHTMLDecoration)}
      
      {/* Main text */}
      <div style={textStyle}>
        <div>{text}</div>
        {subtext && (
          <div style={{ 
            fontSize: Math.round(fontSize * 0.45), 
            opacity: 0.8,
            fontFamily: preset.fonts.secondary || primaryFont,
          }}>
            {subtext}
          </div>
        )}
      </div>

      {/* Foreground decorations */}
      {preset.decorations?.filter(d => d.position === 'front').map(renderHTMLDecoration)}
    </div>
  );
}

// SVG Renderer (high-quality, layered effects)
function SVGTextRenderer({
  preset,
  text,
  subtext,
  maxWidth,
  fontSize,
  className,
}: TextStyleRendererProps) {
  const svgWidth = Math.min(maxWidth, Math.max(200, text.length * fontSize * 0.65));
  const svgHeight = subtext ? fontSize * 2.2 : fontSize * 1.6;
  const textY = fontSize * 0.85;
  const subtextY = fontSize * 1.5;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={text}
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Generate SVG filters for blur, glow, etc. */}
        {preset.layers.filter(l => l.blur || l.type === 'glow').map(layer => (
          <filter key={`filter-${layer.id}`} id={`filter-${layer.id}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={layer.blur || 4} />
          </filter>
        ))}

        {/* Generate gradients */}
        {preset.layers.filter(l => l.type === 'gradient' && l.gradientColors).map(layer => (
          <linearGradient key={`grad-${layer.id}`} id={`grad-${layer.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            {layer.gradientColors!.map((color, i) => (
              <stop key={i} offset={`${(i / (layer.gradientColors!.length - 1)) * 100}%`} stopColor={color} />
            ))}
          </linearGradient>
        ))}
      </defs>

      {/* Background decorations */}
      {preset.decorations?.filter(d => d.position === 'behind').map(d => 
        renderSVGDecoration(d, svgWidth, svgHeight, fontSize)
      )}

      {/* Render text layers (back to front) */}
      {preset.layers.map(layer => (
        <g key={layer.id}>
          {renderSVGTextLayer(layer, text, textY, fontSize, preset.fonts.primary)}
        </g>
      ))}

      {/* Subtext if present */}
      {subtext && (
        <text
          x={10}
          y={subtextY}
          fontFamily={preset.fonts.secondary || preset.fonts.primary}
          fontSize={Math.round(fontSize * 0.45)}
          fill={preset.layers.find(l => l.type === 'fill')?.color || preset.palette[0]}
          opacity={0.8}
        >
          {subtext}
        </text>
      )}

      {/* Foreground decorations */}
      {preset.decorations?.filter(d => d.position === 'front').map(d => 
        renderSVGDecoration(d, svgWidth, svgHeight, fontSize)
      )}
    </svg>
  );
}

// Render individual SVG text layer
function renderSVGTextLayer(layer: Layer, text: string, baseY: number, fontSize: number, fontFamily: string) {
  const x = 10 + (layer.offset?.x || 0);
  const y = baseY + (layer.offset?.y || 0);
  const opacity = layer.opacity ?? 1;
  const transform = layer.transform || '';
  const filter = layer.blur ? `url(#filter-${layer.id})` : undefined;

  const baseProps = {
    x,
    y,
    fontFamily,
    fontSize,
    opacity,
    transform,
    filter,
  };

  switch (layer.type) {
    case 'fill':
      return <text {...baseProps} fill={layer.color || '#000'}>{text}</text>;
    
    case 'stroke':
      return (
        <text
          {...baseProps}
          fill="none"
          stroke={layer.color || '#000'}
          strokeWidth={layer.strokeWidth || 6}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {text}
        </text>
      );
    
    case 'shadow':
      return <text {...baseProps} fill={layer.color || '#000'}>{text}</text>;
    
    case 'glow':
      return (
        <text
          {...baseProps}
          fill={layer.color || '#fff'}
          filter={`url(#filter-${layer.id})`}
        >
          {text}
        </text>
      );
    
    case 'gradient':
      return (
        <text key={layer.id} {...baseProps} fill={`url(#grad-${layer.id})`}>
          {text}
        </text>
      );
    
    default:
      return null;
  }
}

// Render SVG decoration
function renderSVGDecoration(decoration: Decoration, svgWidth: number, svgHeight: number, fontSize: number) {
  const { id, kind, color, opacity = 1, transform = '', borderRadius = 0 } = decoration;
  const width = decoration.width || svgWidth * 0.9;
  const height = decoration.height || fontSize * 0.3;

  switch (kind) {
    case 'bar':
      return (
        <rect
          key={id}
          x={(svgWidth - width) / 2}
          y={fontSize * 0.5}
          width={width}
          height={height}
          fill={color || '#000'}
          opacity={opacity}
          rx={borderRadius}
          transform={transform}
        />
      );
    
    case 'underline':
      return (
        <rect
          key={id}
          x={10}
          y={fontSize * 1.05}
          width={width}
          height={height || 4}
          fill={color || '#000'}
          opacity={opacity}
          rx={borderRadius}
          transform={transform}
        />
      );
    
    case 'highlight':
      return (
        <rect
          key={id}
          x={5}
          y={fontSize * 0.2}
          width={width}
          height={fontSize * 0.9}
          fill={color || '#ffeb3b'}
          opacity={opacity * 0.3}
          rx={borderRadius || 4}
          transform={transform}
        />
      );
    
    case 'blob':
      return (
        <ellipse
          key={id}
          cx={svgWidth / 2}
          cy={svgHeight / 2}
          rx={width / 2}
          ry={height}
          fill={color || '#000'}
          opacity={opacity * 0.2}
          transform={transform}
        />
      );
    
    case 'shape':
      return (
        <circle
          key={id}
          cx={svgWidth - 30}
          cy={20}
          r={15}
          fill={color || '#000'}
          opacity={opacity}
          transform={transform}
        />
      );
    
    default:
      return null;
  }
}

// Render HTML decoration
function renderHTMLDecoration(decoration: Decoration) {
  const { id, kind, color, opacity = 1, transform = '', width, height } = decoration;

  const style: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: color || '#000',
    opacity,
    transform,
    borderRadius: decoration.borderRadius || 0,
  };

  switch (kind) {
    case 'bar':
      return (
        <div
          key={id}
          style={{
            ...style,
            width: width || '100%',
            height: height || 20,
            top: '50%',
            left: 0,
            transform: `translateY(-50%) ${transform}`,
            zIndex: -1,
          }}
        />
      );
    
    case 'underline':
      return (
        <div
          key={id}
          style={{
            ...style,
            width: width || '100%',
            height: height || 4,
            bottom: 0,
            left: 0,
            zIndex: -1,
          }}
        />
      );
    
    case 'highlight':
      return (
        <div
          key={id}
          style={{
            ...style,
            width: width || '100%',
            height: height || '80%',
            top: '10%',
            left: 0,
            opacity: (opacity || 1) * 0.3,
            zIndex: -1,
          }}
        />
      );
    
    default:
      return null;
  }
}
