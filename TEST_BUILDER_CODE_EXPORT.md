# Test Builder - Complete Code Export

This document contains the full source code for all core test builder components.

---

## 1. RowComponent.tsx

```typescript
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useTestBuilderV2Store, Row, Column } from './store';
import { ColumnComponent } from './ColumnComponent';
import { GripVertical, Trash2, ChevronUp, ChevronDown, Edit2, Check, X, Plus, Columns, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RowComponentProps {
  row: Row;
  sectionId: string;
  index: number;
  totalRows: number;
}

/**
 * CLEAN ROW COMPONENT ARCHITECTURE
 * 
 * Structure:
 * - Row Container (blue border, padding, background)
 *   - Columns Container (flex with gaps)
 *     - Column Wrapper (ratio-based width, padding)
 *       - ColumnComponent (content)
 *   - Dividers (positioned absolutely relative to row)
 *   - Resize Handles (positioned absolutely relative to row)
 */
export function RowComponent({ row, sectionId, index, totalRows }: RowComponentProps) {
  const {
    selectedRowId,
    selectRow,
    deleteRow,
    renameRow,
    moveRow,
    addColumn,
    addRow,
    equalizeColumns,
    resizeColumn,
    hoveredType,
    hoveredId,
    setHover,
    isResizing: globalIsResizing,
  } = useTestBuilderV2Store();

  // Local state
  const [localRowHovered, setLocalRowHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(row.name);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragColumnIndex, setDragColumnIndex] = useState<number | null>(null);
  const [initialDividerPosition, setInitialDividerPosition] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const columnsContainerRef = useRef<HTMLDivElement>(null);

  // STATE-DRIVEN HOVER: Row hover only shows when hoveredType is 'row' (not element, not column)
  // Element hover has ABSOLUTE PRIORITY and suppresses all row visuals
  const isHovered = (hoveredType === 'row' && hoveredId === row.id) && !isDragging;
  const isSelected = selectedRowId === row.id;

  const handleRename = () => {
    if (editName.trim()) {
      renameRow(sectionId, row.id, editName.trim());
    }
    setIsEditing(false);
  };

  // Resize logic
  useEffect(() => {
    if (!isDragging || dragColumnIndex === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!columnsContainerRef.current) return;

      const containerRect = columnsContainerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      
      const leftColumn = row.columns[dragColumnIndex];
      const rightColumn = row.columns[dragColumnIndex + 1];
      const totalRatio = leftColumn.ratio + rightColumn.ratio;
      const totalRowRatio = row.columns.reduce((sum, c) => sum + c.ratio, 0);
      
      // Account for gaps between columns
      const numColumns = row.columns.length;
      const gapTotal = 12 * (numColumns - 1);
      const availableWidth = containerWidth - gapTotal;
      
      // Calculate where the left column starts
      let accumulatedRatio = 0;
      for (let i = 0; i < dragColumnIndex; i++) {
        accumulatedRatio += row.columns[i].ratio;
      }
      
      // Left column start = (ratio × available width) + (gaps before)
      const leftColumnStart = (accumulatedRatio / totalRowRatio) * availableWidth + (dragColumnIndex * 12);
      
      // Calculate the new width of the left column based on mouse position
      const newLeftWidth = mouseX - leftColumnStart;
      
      // Total width available for the two columns being resized (excluding their overhead)
      const totalWidth = (totalRatio / totalRowRatio) * availableWidth;
      
      // Calculate new ratios
      const newLeftRatio = (newLeftWidth / totalWidth) * totalRatio;
      const newRightRatio = totalRatio - newLeftRatio;
      
      // Apply constraints (minimum 10% of combined ratio)
      const minRatio = totalRatio * 0.1;
      if (newLeftRatio >= minRatio && newRightRatio >= minRatio) {
        resizeColumn(sectionId, row.id, leftColumn.id, newLeftRatio);
        resizeColumn(sectionId, row.id, rightColumn.id, newRightRatio);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragColumnIndex(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragColumnIndex, row, sectionId, resizeColumn]);

  // Generate row background
  const generateRowBackground = () => {
    if (row.backgroundGradient) {
      const sortedStops = [...row.backgroundGradient.stops].sort((a, b) => a.position - b.position);
      const stopsString = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(', ');
      if (row.backgroundGradient.type === 'linear') {
        return `linear-gradient(${row.backgroundGradient.angle}deg, ${stopsString})`;
      } else {
        return `radial-gradient(circle, ${stopsString})`;
      }
    }
    return row.backgroundColor || 'transparent';
  };

  // Calculate divider pixel position based on column ratios
  const calculateDividerPixelPosition = (columnIndex: number, containerWidth: number): number => {
    const numColumns = row.columns.length;
    const gapSpace = (numColumns - 1) * 12; // Gaps between columns
    const availableWidth = containerWidth - gapSpace;
    
    // Calculate accumulated ratio up to and including this column
    let accumulatedRatio = 0;
    for (let i = 0; i <= columnIndex; i++) {
      accumulatedRatio += row.columns[i].ratio;
    }
    const totalRatio = row.columns.reduce((sum, col) => sum + col.ratio, 0);
    const ratioFraction = accumulatedRatio / totalRatio;
    
    // Position = (ratio × available width) + (gaps passed × 12px) + (half current gap)
    const gapsPassed = columnIndex;
    return (ratioFraction * availableWidth) + (gapsPassed * 12) + 6;
  };

  // Calculate divider CSS position
  const calculateDividerPosition = (columnIndex: number): string => {
    const numColumns = row.columns.length;
    const gapSpace = (numColumns - 1) * 12;
    
    let accumulatedRatio = 0;
    for (let i = 0; i <= columnIndex; i++) {
      accumulatedRatio += row.columns[i].ratio;
    }
    const totalRatio = row.columns.reduce((sum, col) => sum + col.ratio, 0);
    const ratioFraction = accumulatedRatio / totalRatio;
    const gapsPassed = columnIndex;
    
    return `calc((100% - ${gapSpace}px) * ${ratioFraction} + ${gapsPassed * 12 + 6}px)`;
  };

  return (
    <div
      ref={rowRef}
      data-row-id={row.id}
      className="relative w-full"
      style={{
        background: generateRowBackground(),
        paddingTop: `${row.paddingTop || 16}px`,
        paddingBottom: `${row.paddingBottom || 16}px`,
        paddingLeft: '8px',
        paddingRight: '8px',
        minHeight: 'fit-content',
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        // Only set row hover if not resizing, not dragging, and no element is hovered
        if (!globalIsResizing && !isDragging && hoveredType !== 'element') {
          setLocalRowHovered(true);
          setHover('row', row.id);
        }
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        if (!isDragging) {
          setLocalRowHovered(false);
          setHover(null, null);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectRow(row.id);
      }}
    >
      {/* Row Blue Border - STATE-DRIVEN: Only shows when hoveredType is 'row' */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            border: '2.5px solid rgba(59, 130, 246, 0.6)',
            transition: 'opacity 150ms ease-out',
          }}
        />
      )}

      {/* Row Header Bar - STATE-DRIVEN: Only shows when hoveredType is 'row' */}
      {isHovered && (
        <>
          {/* Left side - Name */}
          <div 
            className="absolute flex items-center z-[110]"
            style={{ 
              pointerEvents: 'auto', 
              left: '0px',
              top: '0px',
            }}
          >
            <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-br-md shadow-xl border-r border-b border-blue-400/40">
              <GripVertical size={12} className="text-white" />
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename();
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
                    className="bg-white/25 text-white px-1.5 py-0.5 rounded text-[10px] w-28 h-5"
                    autoFocus
                    onBlur={handleRename}
                  />
                  <Check size={10} className="text-white cursor-pointer" onClick={handleRename} />
                  <X size={10} className="text-white cursor-pointer" onClick={() => setIsEditing(false)} />
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-white text-[10px] font-medium">{row.name}</span>
                  <Edit2 
                    size={10} 
                    className="text-white/70 hover:text-white cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right side - Actions */}
          <div 
            className="absolute flex items-center z-[110]"
            style={{ 
              pointerEvents: 'auto', 
              right: '0px',
              top: '0px',
            }}
          >
            <div className="flex items-center gap-0.5 px-1.5 py-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-bl-md shadow-xl border-l border-b border-blue-400/40">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveRow(sectionId, row.id, 'up');
                }}
                disabled={index === 0}
                className="hover:bg-white/20 p-1 rounded transition-all disabled:opacity-30"
                title="Move Up"
              >
                <ArrowUp size={12} className="text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveRow(sectionId, row.id, 'down');
                }}
                disabled={index === totalRows - 1}
                className="hover:bg-white/20 p-1 rounded transition-all disabled:opacity-30"
                title="Move Down"
              >
                <ArrowDown size={12} className="text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  equalizeColumns(sectionId, row.id);
                }}
                className="hover:bg-white/20 p-1 rounded transition-all"
                title="Equalize Columns"
              >
                <Columns size={12} className="text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addColumn(sectionId, row.id);
                }}
                className="hover:bg-white/20 p-1 rounded transition-all"
                title="Add Column"
              >
                <Plus size={12} className="text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRow(sectionId, row.id);
                }}
                className="hover:bg-white/20 p-1 rounded transition-all hover:bg-red-500/30"
                title="Delete Row"
              >
                <Trash2 size={12} className="text-white" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Columns Container */}
      <div
        ref={columnsContainerRef}
        className="relative flex"
        style={{
          gap: '12px',
          width: '100%',
          alignItems: 'flex-start',
        }}
      >
        {row.columns.map((column, columnIndex) => (
          <div
            key={column.id}
            className="relative"
            style={{
              flex: `${column.ratio} 1 0`,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ColumnComponent
              column={column}
              sectionId={sectionId}
              rowId={row.id}
              index={columnIndex}
              totalColumns={row.columns.length}
            />
          </div>
        ))}

        {/* Dividers and Resize Handles - STATE-DRIVEN: Only show when hoveredType is 'row' */}
        {isHovered && row.columns.length > 1 && row.columns.map((column, columnIndex) => {
          if (columnIndex === row.columns.length - 1) return null;
          
          const dividerLeft = calculateDividerPosition(columnIndex);
          
          return (
            <React.Fragment key={`divider-${column.id}`}>
              {/* Vertical divider line */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: dividerLeft,
                  top: `${-(row.paddingTop || 16)}px`,
                  bottom: `${-(row.paddingBottom || 16)}px`,
                  width: '2px',
                  backgroundColor: 'rgba(59, 130, 246, 0.6)',
                  zIndex: 10,
                }}
              />
              
              {/* Resize handle */}
              <div
                className="absolute"
                style={{
                  left: `calc(${dividerLeft} - 10px)`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 100,
                  pointerEvents: 'auto',
                }}
              >
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    // Capture the initial divider position when drag starts
                    if (columnsContainerRef.current) {
                      const containerRect = columnsContainerRef.current.getBoundingClientRect();
                      const mouseX = e.clientX - containerRect.left;
                      setInitialDividerPosition(mouseX);
                    }
                    
                    setIsDragging(true);
                    setDragStartX(e.clientX);
                    setDragColumnIndex(columnIndex);
                    document.body.style.cursor = 'col-resize';
                    document.body.style.userSelect = 'none';
                  }}
                  className="rounded-full shadow-lg transition-all"
                  style={{
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'col-resize',
                    backgroundColor: 'rgba(59, 130, 246, 0.9)',
                    border: isDragging && dragColumnIndex === columnIndex 
                      ? '2px solid rgba(59, 130, 246, 1)' 
                      : '2px solid rgba(59, 130, 246, 0.6)',
                  }}
                  title="Drag to resize columns"
                >
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <path d="M2 2L2 10M6 2L6 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 2. ColumnComponent.tsx

```typescript
"use client";

import { Fragment, useState } from 'react';
import { Column, useTestBuilderV2Store } from './store';
import { ElementRenderer } from './ElementRenderer';
import { DropZoneIndicator } from './DropZoneIndicator';
import { SortableElement } from './SortableElement';

interface ColumnComponentProps {
  column: Column;
  sectionId: string;
  rowId: string;
  index: number;
  totalColumns: number;
}

/**
 * COLUMN COMPONENT - Shows purple/pink outline when hovered
 * 
 * Architecture Rules:
 * - Columns are REAL containers in the data model
 * - Columns own elements logically
 * - Columns store ratio for width calculation
 * - Columns enforce min/max constraints
 * 
 * Visual Rules (FG Funnels Standard):
 * - Purple/pink border when hovered or selected
 * - Matches FG Funnels hierarchy: Section (green) > Row (blue) > Column (purple) > Element (orange)
 */
export function ColumnComponent({ column, sectionId, rowId }: ColumnComponentProps) {
  const { hoveredType, hoveredId, setHover, isResizing } = useTestBuilderV2Store();
  const [localHovered, setLocalHovered] = useState(false);
  
  // STATE-DRIVEN HOVER: Column hover only shows when hoveredType is 'column'
  // Element hover has ABSOLUTE PRIORITY and suppresses column hover
  const isHovered = (hoveredType === 'column' && hoveredId === column.id) && !isResizing;
  // Convert alignment values to flexbox properties
  const getHorizontalAlignment = () => {
    switch (column.horizontalAlign) {
      case 'start': return 'flex-start';
      case 'center': return 'center';
      case 'end': return 'flex-end';
      default: return 'stretch';
    }
  };

  const getVerticalAlignment = () => {
    switch (column.verticalAlign) {
      case 'start': return 'flex-start';
      case 'center': return 'center';
      case 'end': return 'flex-end';
      case 'stretch': return 'stretch';
      default: return 'flex-start';
    }
  };

  return (
    <div
      className="relative w-full h-full"
      data-column-id={column.id}
      onPointerEnter={(e) => {
        e.stopPropagation();
        // Only set column hover if not resizing and no element is hovered
        if (!isResizing && hoveredType !== 'element') {
          setLocalHovered(true);
          setHover('column', column.id);
        }
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        if (!isResizing) {
          setLocalHovered(false);
          setHover(null, null);
        }
      }}
    >
      {/* Purple/Pink Column Outline - STATE-DRIVEN: Only shows when hoveredType is 'column' */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            border: '2px solid rgba(192, 132, 252, 0.6)', // Purple-400
            transition: 'opacity 150ms ease-out',
          }}
        />
      )}
      
      {column.elements.length === 0 ? (
        <DropZoneIndicator
          id={`dropzone-${column.id}-empty`}
          sectionId={sectionId}
          rowId={rowId}
          columnId={column.id}
          index={0}
          position="empty"
          className="flex-1"
        />
      ) : (
        <div className="w-full flex flex-col" style={{ gap: '0px', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
          <DropZoneIndicator
            id={`dropzone-${column.id}-0-before`}
            sectionId={sectionId}
            rowId={rowId}
            columnId={column.id}
            index={0}
            position="before"
          />
          
          {column.elements.map((element, index) => (
            <Fragment key={element.id}>
              {element.type === 'image' ? (
                <ElementRenderer
                  element={element}
                  elementIndex={index}
                  sectionId={sectionId}
                  rowId={rowId}
                  columnId={column.id}
                  totalElements={column.elements.length}
                />
              ) : (
                <SortableElement
                  id={element.id}
                  sectionId={sectionId}
                  rowId={rowId}
                  columnId={column.id}
                  index={index}
                >
                  <ElementRenderer
                    element={element}
                    elementIndex={index}
                    sectionId={sectionId}
                    rowId={rowId}
                    columnId={column.id}
                    totalElements={column.elements.length}
                  />
                </SortableElement>
              )}
              <DropZoneIndicator
                id={`dropzone-${column.id}-${index + 1}-after`}
                sectionId={sectionId}
                rowId={rowId}
                columnId={column.id}
                index={index + 1}
                position="after"
              />
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Key Implementation Notes

### Hover State Priority (CRITICAL)
```typescript
// Priority: Element > Column > Row
// Element hover suppresses ALL parent hovers
if (hoveredType === 'element') {
  // Row and column hovers are hidden
}
```

### Divider Positioning Formula
```typescript
// Available width = container width - gaps
const availableWidth = containerWidth - (numColumns - 1) * 12;

// Position = (ratio × available width) + (gaps passed × 12px) + 6px (half gap)
return `calc((100% - ${gapSpace}px) * ${ratioFraction} + ${gapsPassed * 12 + 6}px)`;
```

### Resize Calculation
```typescript
// Left column start = (accumulated ratio × available width) + (gaps before × 12px)
const leftColumnStart = (accumulatedRatio / totalRowRatio) * availableWidth + (dragColumnIndex * 12);

// New width = mouse position - left column start
const newLeftWidth = mouseX - leftColumnStart;
```

### Layout Structure
```
Row (8px padding left/right, 16px top/bottom)
  └─ Columns Container (flex, gap: 12px)
      ├─ Column Wrapper (flex: ratio, no visual styling)
      │   └─ ColumnComponent (purple border on hover)
      ├─ 12px gap
      └─ Column Wrapper (flex: ratio, no visual styling)
          └─ ColumnComponent (purple border on hover)
```

---

## 3. DropZoneIndicator.tsx

```typescript
"use client";

import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Sparkles, Zap } from 'lucide-react';
import { useTestBuilderV2Store } from './store';

interface DropZoneIndicatorProps {
  id: string;
  sectionId: string;
  rowId: string;
  columnId: string;
  index: number;
  position: 'before' | 'after' | 'empty';
  className?: string;
}

export function DropZoneIndicator({
  id,
  sectionId,
  rowId,
  columnId,
  index,
  position,
  className,
}: DropZoneIndicatorProps) {
  const { selectSection, selectRow, selectColumn, showLeftSidebar, toggleLeftSidebar, setSidebarActiveTab } = useTestBuilderV2Store();
  
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      type: 'dropzone',
      sectionId,
      rowId,
      columnId,
      index,
      position,
    },
  });

  if (position === 'empty') {
    // Creative empty column with animated, inviting design
    return (
      <div
        ref={setNodeRef}
        className={cn(
          'relative w-full h-full flex flex-col items-center justify-center @container group/empty',
          'transition-all duration-500 ease-out',
          className
        )}
      >
        {/* Animated gradient background */}
        <div className={cn(
          'absolute inset-0 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500',
          'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]',
          isOver 
            ? 'from-orange-100/80 via-orange-50/40 to-transparent dark:from-orange-500/20 dark:via-orange-400/10 dark:to-transparent'
            : 'from-purple-100/60 via-purple-50/30 to-transparent dark:from-purple-500/15 dark:via-purple-400/5 dark:to-transparent'
        )} />
        
        {/* Main interactive button */}
        <button
          className={cn(
            'relative z-10 flex flex-col items-center justify-center gap-1.5',
            'transition-all duration-300 ease-out',
            'group/btn cursor-pointer',
            'hover:-translate-y-0.5',
            'active:translate-y-0 active:scale-95'
          )}
          onClick={(e) => {
            e.stopPropagation();
            selectSection(sectionId);
            selectRow(rowId);
            selectColumn(columnId);
            setSidebarActiveTab('elements');
            if (!showLeftSidebar) {
              toggleLeftSidebar();
            }
          }}
        >
          {/* Icon container with glow */}
          <div className={cn(
            'relative flex items-center justify-center',
            'w-12 h-12 @[140px]:w-14 @[140px]:h-14',
            'rounded-2xl',
            'transition-all duration-300',
            'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
            'border border-gray-200/60 dark:border-gray-700/60',
            'shadow-lg shadow-gray-200/50 dark:shadow-black/20',
            'group-hover/btn:shadow-xl group-hover/btn:border-purple-300/60',
            isOver && 'border-orange-300 bg-gradient-to-br from-white to-orange-50'
          )}>
            <Sparkles 
              className={cn(
                'w-6 h-6 @[140px]:w-7 @[140px]:h-7',
                'transition-all duration-300',
                'text-gray-400 dark:text-gray-500',
                'group-hover/btn:text-purple-500 group-hover/btn:rotate-12',
                isOver && 'text-orange-500 rotate-12'
              )} 
            />
          </div>
          
          {/* Text content - responsive */}
          <div className="flex flex-col items-center gap-0.5 mt-1">
            <span className={cn(
              'text-xs @[140px]:text-sm font-semibold tracking-tight',
              'transition-colors duration-300',
              'text-gray-500 dark:text-gray-400',
              'group-hover/btn:text-purple-600',
              isOver && 'text-orange-600',
              'whitespace-nowrap overflow-hidden text-ellipsis'
            )}>
              Add Element
            </span>
            
            <span className={cn(
              'hidden @[140px]:flex items-center gap-1',
              'text-[10px] text-gray-400',
              'transition-colors duration-300',
              'group-hover/btn:text-purple-400',
              isOver && 'text-orange-400'
            )}>
              <Zap size={10} className="animate-pulse" />
              <span>Drag or click</span>
            </span>
          </div>
        </button>
        
        {/* Drop indicator ring */}
        {isOver && (
          <div className="absolute inset-3 border-2 border-dashed border-orange-400/60 rounded-xl animate-pulse pointer-events-none" />
        )}
      </div>
    );
  }

  // Between elements drop zone
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative h-2 -my-1 transition-all',
        isOver && 'h-4 -my-2',
        className
      )}
    >
      {isOver && (
        <>
          {/* Snap Guide Line */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-orange-500 shadow-lg z-[150]">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full" />
            <div className="absolute left-1/2 -translate-x-1/2 -top-6 bg-orange-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-lg font-medium">
              Drop {position === 'before' ? 'above' : 'below'}
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full" />
          </div>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-b from-orange-500/20 via-orange-500/10 to-transparent blur-sm" />
        </>
      )}
    </div>
  );
}
```

---

## 4. ElementRenderer.tsx (Hover Restoration Logic)

**Key Section: Smart Hover Restoration**

```typescript
// Element container with pointer events
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
    // Element click handling...
  }}
>
  {/* Element content */}
</div>
```

**How It Works:**
1. When pointer leaves element, check if it's still within row bounds
2. Use `getBoundingClientRect()` to get row dimensions
3. Compare pointer coordinates with row bounds
4. If still in row → restore row hover immediately
5. If outside row → clear hover state
6. This prevents hover "dead zones" and ensures smooth transitions

---

**Export Date:** January 5, 2026  
**Files Included:** RowComponent.tsx, ColumnComponent.tsx, DropZoneIndicator.tsx, ElementRenderer.tsx (hover logic)  
**Note:** This is the complete source code for the core components with all recent fixes applied, including state-driven hover with priority suppression.
