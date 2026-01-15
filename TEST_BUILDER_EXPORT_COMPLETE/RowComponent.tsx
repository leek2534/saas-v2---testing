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
