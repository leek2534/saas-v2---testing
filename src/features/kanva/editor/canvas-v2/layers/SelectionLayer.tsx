/**
 * Selection Layer
 * 
 * Renders selection UI:
 * - Selection boxes around selected elements
 * - Resize handles
 * - Rotation handle
 * - Multi-selection bounding box
 * - Group indicators
 */

'use client';

import React, { memo, useMemo } from 'react';
import type { EditorElement } from '../../../lib/editor/types';
import type { Bounds, HandlePosition } from '../types';
import { HANDLE_CURSORS, HANDLE_SIZE, ROTATION_HANDLE_OFFSET } from '../types';
import { createBounds, mergeBounds } from '../utils/geometry';

// ============================================
// TYPES
// ============================================

export interface SelectionLayerProps {
  selectedElements: EditorElement[];
  measureElement: (element: EditorElement) => { width: number; height: number };
  onResizeStart: (elementId: string | null, handle: HandlePosition, e: React.MouseEvent) => void;
  onRotateStart: (elementId: string, e: React.MouseEvent) => void;
  isGrouped: boolean;
  zoom: number;
}

// ============================================
// RESIZE HANDLE COMPONENT
// ============================================

interface ResizeHandleProps {
  position: HandlePosition;
  x: number;
  y: number;
  onMouseDown: (e: React.MouseEvent) => void;
  zoom: number;
}

const ResizeHandle = memo<ResizeHandleProps>(({ position, x, y, onMouseDown, zoom }) => {
  const size = HANDLE_SIZE / zoom;
  const halfSize = size / 2;
  
  return (
    <div
      className="absolute bg-white border-2 border-blue-500 rounded-sm"
      style={{
        left: x - halfSize,
        top: y - halfSize,
        width: size,
        height: size,
        cursor: HANDLE_CURSORS[position],
        pointerEvents: 'auto',
      }}
      onMouseDown={onMouseDown}
      role="slider"
      aria-label={`Resize ${position}`}
      tabIndex={0}
    />
  );
});

ResizeHandle.displayName = 'ResizeHandle';

// ============================================
// ROTATION HANDLE COMPONENT
// ============================================

interface RotationHandleProps {
  centerX: number;
  y: number;
  onMouseDown: (e: React.MouseEvent) => void;
  zoom: number;
}

const RotationHandle = memo<RotationHandleProps>(({ centerX, y, onMouseDown, zoom }) => {
  const size = HANDLE_SIZE / zoom;
  const halfSize = size / 2;
  const offset = ROTATION_HANDLE_OFFSET / zoom;
  
  return (
    <>
      {/* Line connecting to rotation handle */}
      <div
        className="absolute bg-blue-500"
        style={{
          left: centerX - 0.5,
          top: y - offset,
          width: 1,
          height: offset,
          pointerEvents: 'none',
        }}
      />
      {/* Rotation handle */}
      <div
        className="absolute bg-white border-2 border-blue-500 rounded-full"
        style={{
          left: centerX - halfSize,
          top: y - offset - size,
          width: size,
          height: size,
          cursor: 'grab',
          pointerEvents: 'auto',
        }}
        onMouseDown={onMouseDown}
        role="slider"
        aria-label="Rotate element"
        tabIndex={0}
      />
    </>
  );
});

RotationHandle.displayName = 'RotationHandle';

// ============================================
// SINGLE ELEMENT TRANSFORMER
// ============================================

interface TransformerProps {
  element: EditorElement;
  width: number;
  height: number;
  onResizeStart: (handle: HandlePosition, e: React.MouseEvent) => void;
  onRotateStart: (e: React.MouseEvent) => void;
  zoom: number;
  showRotation?: boolean;
}

const Transformer = memo<TransformerProps>(({
  element,
  width,
  height,
  onResizeStart,
  onRotateStart,
  zoom,
  showRotation = true,
}) => {
  const handles: { position: HandlePosition; x: number; y: number }[] = useMemo(() => [
    { position: 'top-left', x: 0, y: 0 },
    { position: 'top-center', x: width / 2, y: 0 },
    { position: 'top-right', x: width, y: 0 },
    { position: 'middle-left', x: 0, y: height / 2 },
    { position: 'middle-right', x: width, y: height / 2 },
    { position: 'bottom-left', x: 0, y: height },
    { position: 'bottom-center', x: width / 2, y: height },
    { position: 'bottom-right', x: width, y: height },
  ], [width, height]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: element.x,
        top: element.y,
        width,
        height,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        transformOrigin: 'center center',
      }}
    >
      {/* Selection border */}
      <div
        className="absolute inset-0 border-2 border-blue-500 rounded-sm"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Resize handles */}
      {handles.map(({ position, x, y }) => (
        <ResizeHandle
          key={position}
          position={position}
          x={x}
          y={y}
          zoom={zoom}
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(position, e);
          }}
        />
      ))}
      
      {/* Rotation handle */}
      {showRotation && (
        <RotationHandle
          centerX={width / 2}
          y={0}
          zoom={zoom}
          onMouseDown={(e) => {
            e.stopPropagation();
            onRotateStart(e);
          }}
        />
      )}
    </div>
  );
});

Transformer.displayName = 'Transformer';

// ============================================
// MULTI-SELECT TRANSFORMER
// ============================================

interface MultiSelectTransformerProps {
  bounds: Bounds;
  onResizeStart: (handle: HandlePosition, e: React.MouseEvent) => void;
  isGrouped: boolean;
  zoom: number;
}

const MultiSelectTransformer = memo<MultiSelectTransformerProps>(({
  bounds,
  onResizeStart,
  isGrouped,
  zoom,
}) => {
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const padding = 4;
  
  // Only corner handles for multi-select
  const handles: { position: HandlePosition; x: number; y: number }[] = useMemo(() => [
    { position: 'top-left', x: -padding, y: -padding },
    { position: 'top-right', x: width + padding, y: -padding },
    { position: 'bottom-left', x: -padding, y: height + padding },
    { position: 'bottom-right', x: width + padding, y: height + padding },
  ], [width, height, padding]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: bounds.minX - padding,
        top: bounds.minY - padding,
        width: width + padding * 2,
        height: height + padding * 2,
      }}
    >
      {/* Bounding box */}
      <div
        className="absolute inset-0 rounded-sm"
        style={{
          border: isGrouped ? '2px solid #3b82f6' : '1px dashed #94a3b8',
          pointerEvents: 'none',
        }}
      />
      
      {/* Corner resize handles */}
      {handles.map(({ position, x, y }) => (
        <ResizeHandle
          key={position}
          position={position}
          x={x + padding}
          y={y + padding}
          zoom={zoom}
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(position, e);
          }}
        />
      ))}
    </div>
  );
});

MultiSelectTransformer.displayName = 'MultiSelectTransformer';

// ============================================
// SELECTION LAYER
// ============================================

export const SelectionLayer = memo<SelectionLayerProps>(({
  selectedElements,
  measureElement,
  onResizeStart,
  onRotateStart,
  isGrouped,
  zoom,
}) => {
  if (selectedElements.length === 0) {
    return null;
  }

  // Single element selection
  if (selectedElements.length === 1) {
    const element = selectedElements[0];
    const measured = measureElement(element);
    
    return (
      <Transformer
        element={element}
        width={measured.width}
        height={measured.height}
        zoom={zoom}
        onResizeStart={(handle, e) => onResizeStart(element.id, handle, e)}
        onRotateStart={(e) => onRotateStart(element.id, e)}
      />
    );
  }

  // Multi-element selection
  const elementBounds = selectedElements.map(el => {
    const measured = measureElement(el);
    return createBounds(el.x, el.y, measured.width, measured.height);
  });
  
  const combinedBounds = mergeBounds(elementBounds);

  return (
    <>
      {/* Individual selection boxes (only for ungrouped) */}
      {!isGrouped && selectedElements.map(el => {
        const measured = measureElement(el);
        return (
          <div
            key={`selection-${el.id}`}
            className="absolute pointer-events-none border-2 border-blue-500 rounded-sm"
            style={{
              left: el.x - 1,
              top: el.y - 1,
              width: measured.width + 2,
              height: measured.height + 2,
              transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
              transformOrigin: 'center center',
            }}
          />
        );
      })}
      
      {/* Multi-select transformer */}
      <MultiSelectTransformer
        bounds={combinedBounds}
        onResizeStart={(handle, e) => onResizeStart(null, handle, e)}
        isGrouped={isGrouped}
        zoom={zoom}
      />
    </>
  );
});

SelectionLayer.displayName = 'SelectionLayer';
