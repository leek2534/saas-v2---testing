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

  // Row hover shows when row itself is hovered OR when any element inside it is hovered
  // This keeps the row border visible even when hovering elements
  const [localRowHovered, setLocalRowHovered] = useState(false);
  const isHovered = localRowHovered;
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(row.name);
  
  // Track when any column in this row is hovered
  const [anyColumnHovered, setAnyColumnHovered] = useState(false);
  
  // Drag resize state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragColumnIndex, setDragColumnIndex] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const isSelected = selectedRowId === row.id;

  const handleRename = () => {
    if (editName.trim()) {
      renameRow(sectionId, row.id, editName.trim());
    }
    setIsEditing(false);
  };

  // Handle drag resize
  useEffect(() => {
    if (!isDragging || dragColumnIndex === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!rowRef.current) return;

      const rowRect = rowRef.current.getBoundingClientRect();
      const rowWidth = rowRect.width - (row.paddingLeft || 16) - (row.paddingRight || 16);
      const mouseX = e.clientX - rowRect.left - (row.paddingLeft || 16);
      
      // Calculate which columns are being resized
      const leftColumn = row.columns[dragColumnIndex];
      const rightColumn = row.columns[dragColumnIndex + 1];
      
      // Calculate total ratio of the two columns being resized
      const totalRatio = leftColumn.ratio + rightColumn.ratio;
      
      // Calculate cumulative width of columns before the left column
      let cumulativeWidth = 0;
      for (let i = 0; i < dragColumnIndex; i++) {
        const col = row.columns[i];
        const totalRowRatio = row.columns.reduce((sum, c) => sum + c.ratio, 0);
        cumulativeWidth += (col.ratio / totalRowRatio) * rowWidth;
      }
      
      // Calculate new left column width based on mouse position
      const newLeftWidth = mouseX - cumulativeWidth;
      const totalWidth = (totalRatio / row.columns.reduce((sum, c) => sum + c.ratio, 0)) * rowWidth;
      
      // Calculate new ratios
      const newLeftRatio = (newLeftWidth / totalWidth) * totalRatio;
      const newRightRatio = totalRatio - newLeftRatio;
      
      // Apply constraints (minimum 10% of total)
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

  // Get row alignment class
  const getRowAlignmentClass = () => {
    const alignment = row.rowAlignment || 'center';
    if (alignment === 'left') return 'justify-start';
    if (alignment === 'right') return 'justify-end';
    return 'justify-center';
  };

  return (
    <div
      ref={rowRef}
      data-row-id={row.id}
      className={cn(
        'relative transition-all duration-300 ease-in-out flex',
        getRowAlignmentClass()
      )}
      style={{
        width: '100%',
        maxWidth: '100%',
        background: generateRowBackground(),
        paddingTop: `${row.paddingTop || 6}px`,
        paddingBottom: `${row.paddingBottom || 6}px`,
        paddingLeft: `${row.paddingLeft || 6}px`,
        paddingRight: `${row.paddingRight || 6}px`,
        boxSizing: 'border-box',
        minHeight: 'fit-content',
      }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        // Don't update hover if resize is active (resize handler sets it)
        if (!globalIsResizing) {
          setLocalRowHovered(true);
          setHover('row', row.id);
        }
      }}
      onMouseMove={(e) => {
        // Don't update hover if resize is active
        if (globalIsResizing) return;
        
        // Ensure localRowHovered is true when mouse is over row
        if (!localRowHovered) {
          setLocalRowHovered(true);
        }
        // If mouse is over row but not over an element, ensure row hover is active
        const target = e.target as HTMLElement;
        const isOverElement = target.closest('[data-element-id]');
        if (!isOverElement && hoveredType !== 'row') {
          setHover('row', row.id);
        }
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        // Don't clear hover state if we're actively dragging
        if (!isDragging) {
          setLocalRowHovered(false);
          setHover(null, null);
        }
      }}
      onClick={(e) => {
        // Don't select row if clicking on resize button
        const target = e.target as HTMLElement;
        if (target.closest('button[title="Click to resize columns"]')) {
          return;
        }
        e.stopPropagation();
        console.log('🟢 Row clicked:', row.id, row.name);
        selectRow(row.id);
      }}
    >
      {/* Row Border System - Unified border + background tint */}
      {isHovered && (
        <>
          {/* Outer border - wraps entire row */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              border: '2.5px solid rgba(59, 130, 246, 0.6)',
              transition: 'opacity 150ms ease-out',
              opacity: hoveredType === 'element' ? 0 : 1,
            }}
          />
          {/* Subtle background tint */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 0,
              backgroundColor: 'rgba(74, 222, 128, 0.02)',
              transition: 'opacity 150ms ease-out',
              opacity: hoveredType === 'element' ? 0 : 1,
            }}
          />
        </>
      )}
      {/* Row Header Bar - REMOVED */}
      {false && isHovered && (
        <div 
          data-header-bar="row"
          className="absolute flex items-center z-[110]"
          style={{ 
            pointerEvents: 'auto', 
            left: '0px', // Aligned with the green ring
            top: '0px', // At the top corner
          }}
        >
          {/* Name container - Left side */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-br-md shadow-xl border-r border-b border-blue-400/40 backdrop-blur-sm">
            {/* Drag Handle */}
            <button 
              className="cursor-move hover:bg-white/20 p-0.5 rounded transition-all duration-200 hover:scale-110 active:scale-95"
              title="Drag to reorder"
            >
              <GripVertical size={12} className="text-white drop-shadow-sm" />
            </button>

            {/* Row Name */}
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename();
                    if (e.key === 'Escape') {
                      setEditName(row.name);
                      setIsEditing(false);
                    }
                  }}
                  className="bg-white/25 text-white placeholder-white/70 px-1.5 py-0.5 rounded text-[10px] w-28 h-5 focus:outline-none focus:ring-1 focus:ring-white/50 focus:bg-white/35 border border-white/20"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  onBlur={handleRename}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRename();
                  }}
                  className="hover:bg-blue-500/30 p-0.5 rounded transition-colors"
                  title="Save"
                >
                  <Check size={10} className="text-blue-100" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditName(row.name);
                    setIsEditing(false);
                  }}
                  className="hover:bg-red-500/30 p-0.5 rounded transition-colors"
                  title="Cancel"
                >
                  <X size={10} className="text-red-100" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 group">
                <span className="text-[10px] font-bold tracking-wide uppercase text-white drop-shadow-sm">
                  {row.name}
                </span>
                <span className="text-[9px] opacity-75">({row.columns.length} col{row.columns.length > 1 ? 's' : ''})</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:bg-white/20 p-0.5 rounded transition-all duration-200"
                  title="Rename row"
                >
                  <Edit2 size={9} className="text-white/90" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Row Actions - REMOVED */}
      {false && isHovered && (
        <div 
          data-header-bar="row-actions"
          className="absolute flex items-center z-[110]"
          style={{ 
            pointerEvents: 'auto', 
            right: '0px', // Right corner
            top: '0px', // At the top corner
          }}
        >
          {/* Actions container - Right side */}
          <div className="flex items-center gap-0.5 px-1.5 py-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-bl-md shadow-xl border-l border-b border-blue-400/40 backdrop-blur-sm">
            {/* Move Up */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveRow(sectionId, row.id, 'up');
              }}
              disabled={index === 0}
              className="hover:bg-white/20 p-1 rounded transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent hover:scale-110 active:scale-95"
              title="Move Up"
            >
              <ChevronUp size={12} className="text-white drop-shadow-sm" />
            </button>

            {/* Move Down */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveRow(sectionId, row.id, 'down');
              }}
              disabled={index === totalRows - 1}
              className="hover:bg-white/20 p-1 rounded transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent hover:scale-110 active:scale-95"
              title="Move Down"
            >
              <ChevronDown size={12} className="text-white drop-shadow-sm" />
            </button>

            {/* Divider */}
            <div className="w-px h-3 bg-white/20 mx-0.5" />

            {/* Add Column */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                addColumn(sectionId, row.id);
              }}
              disabled={row.columns.length >= 6}
              className="hover:bg-white/20 p-1 rounded transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent hover:scale-110 active:scale-95"
              title="Add Column"
            >
              <Plus size={12} className="text-white drop-shadow-sm" />
            </button>

            {/* Divider */}
            <div className="w-px h-3 bg-white/20 mx-0.5" />

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete ${row.name}?`)) {
                  deleteRow(sectionId, row.id);
                }
              }}
              className="hover:bg-red-500/40 p-1 rounded transition-all duration-200 hover:scale-110 active:scale-95"
              title="Delete Row"
            >
              <Trash2 size={12} className="text-red-100 drop-shadow-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Row Content - Direct Grid Container (no wrapper) */}
      {/* Unified Columns Header - REMOVED */}
      {false && anyColumnHovered && (
          <div 
            className="absolute left-0 right-0 flex items-center justify-between z-[120]"
            style={{ 
              top: '-28px',
              pointerEvents: 'auto',
            }}
          >
            {/* Left side - Columns label */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 rounded-t-md shadow-xl border-t border-l border-r border-purple-400/40 backdrop-blur-sm">
              <GripVertical size={12} className="text-white drop-shadow-sm cursor-move" />
              <span className="text-[10px] font-bold tracking-wide uppercase text-white drop-shadow-sm">
                Columns
              </span>
              <span className="text-[9px] text-white/75">({row.columns.length})</span>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-0.5 px-1.5 py-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 rounded-t-md shadow-xl border-t border-l border-r border-purple-400/40 backdrop-blur-sm">
              {/* Equalize Columns */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  equalizeColumns(sectionId, row.id);
                }}
                className="hover:bg-white/20 p-1 rounded transition-all duration-200 hover:scale-110 active:scale-95"
                title="Make all columns equal width"
              >
                <Columns size={12} className="text-white drop-shadow-sm" />
              </button>
              
              {/* Divider */}
              <div className="w-px h-3 bg-white/20 mx-0.5" />
              
              {/* Add Column */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addColumn(sectionId, row.id);
                }}
                className="hover:bg-white/20 p-1 rounded transition-all duration-200 hover:scale-110 active:scale-95"
                title="Add Column"
              >
                <Plus size={12} className="text-white drop-shadow-sm" />
              </button>
            </div>
          </div>
        )}

        {/* Columns Container - Separated columns with gaps */}
        <div
          className="relative"
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'flex-start',
            height: 'auto',
            gap: '12px',
            padding: '8px',
          }}
        >
          {row.columns.map((column: Column, columnIndex: number) => {
            const totalRatio = row.columns.reduce((sum, col) => sum + col.ratio, 0);
            const widthPercent = (column.ratio / totalRatio) * 100;
            const isLastColumn = columnIndex === row.columns.length - 1;
            
            // Get alignment from column data
            const getHorizontalAlignment = () => {
              switch (column.horizontalAlign) {
                case 'start': return 'flex-start';
                case 'center': return 'center';
                case 'end': return 'flex-end';
                default: return 'center';
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
                key={column.id}
                className="relative"
                data-row-column={column.id}
                style={{ 
                  flex: `${column.ratio} 1 0`,
                  minWidth: 0,
                  height: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: getHorizontalAlignment(),
                  justifyContent: getVerticalAlignment(),
                  position: 'relative',
                  padding: '8px',
                  pointerEvents: 'auto',
                  overflow: 'visible',
                  // Column container with subtle styling
                  backgroundColor: 'transparent',
                  transition: 'background-color 150ms ease-out',
                }}
              >
                {/* Render ColumnComponent directly - no intermediate container */}
                <ColumnComponent
                  column={column}
                  sectionId={sectionId}
                  rowId={row.id}
                  index={columnIndex}
                  totalColumns={row.columns.length}
                />
              </div>
            );
          })}
          
          {/* Divider lines and resize handles - positioned relative to row, not columns */}
          {(isHovered || isDragging) && row.columns.length > 1 && row.columns.map((column, columnIndex) => {
            if (columnIndex === row.columns.length - 1) return null; // Skip last column
            
            // Calculate position based on accumulated ratios
            let accumulatedRatio = 0;
            for (let i = 0; i <= columnIndex; i++) {
              accumulatedRatio += row.columns[i].ratio;
            }
            const totalRatio = row.columns.reduce((sum, col) => sum + col.ratio, 0);
            const leftPercent = (accumulatedRatio / totalRatio) * 100;
            
            return (
              <div key={`divider-${column.id}`}>
                {/* Vertical divider line */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: `calc(${leftPercent}% + ${columnIndex * 12}px)`,
                    top: '0px',
                    bottom: '0px',
                    width: '2px',
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    transition: 'opacity 150ms ease-out',
                    opacity: hoveredType === 'element' ? 0 : 1,
                    zIndex: 10,
                  }}
                />
                
                {/* Resize handle button */}
                <div
                  className="absolute"
                  style={{
                    left: `calc(${leftPercent}% + ${columnIndex * 12}px - 10px)`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 100,
                    pointerEvents: 'auto',
                    opacity: hoveredType === 'element' ? 0 : 1,
                    transition: 'opacity 150ms ease-out',
                  }}
                >
                  <button
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setIsDragging(true);
                      setDragStartX(e.clientX);
                      setDragColumnIndex(columnIndex);
                      document.body.style.cursor = 'col-resize';
                      document.body.style.userSelect = 'none';
                    }}
                    className="p-1.5 rounded-full shadow-lg transition-all duration-200"
                    style={{
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'col-resize',
                      backgroundColor: 'rgba(59, 130, 246, 0.9)',
                      border: isDragging && dragColumnIndex === columnIndex ? '2px solid rgba(59, 130, 246, 1)' : '2px solid rgba(59, 130, 246, 0.6)',
                    }}
                    title="Drag to resize columns"
                  >
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 2L2 10M6 2L6 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
}

// Resize Handle Component - Positioned BETWEEN columns
function ResizeHandle({
  sectionId,
  rowId,
  leftColumnId,
  rightColumnId,
  isVisible = true,
}: {
  sectionId: string;
  rowId: string;
  leftColumnId: string;
  rightColumnId: string;
  isVisible?: boolean;
}) {
  const { resizeColumn, setIsResizing: setGlobalIsResizing, viewport, sections, hoveredType, hoveredId, setHover } = useTestBuilderV2Store();
  const [isResizing, setIsResizing] = useState(false);
  const handleRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef(viewport);

  // Use row's hover state instead of separate hover
  const isRowHovered = hoveredType === 'row' && hoveredId === rowId;

  // Track viewport changes
  useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);

  // Get current column ratios from store
  const getColumnRatios = () => {
    for (const section of sections) {
      if (section.id !== sectionId) continue;
      for (const row of section.rows) {
        if (row.id !== rowId) continue;
        const leftColumn = row.columns.find(c => c.id === leftColumnId);
        const rightColumn = row.columns.find(c => c.id === rightColumnId);
        return {
          leftRatio: leftColumn?.ratio || 1,
          rightRatio: rightColumn?.ratio || 1,
        };
      }
    }
    return { leftRatio: 1, rightRatio: 1 };
  };

  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setGlobalIsResizing(true);
    
    // Keep row hover state active during resize
    setHover('row', rowId);
    
    // Add class to body to disable all hover effects via CSS
    document.body.classList.add('resizing-columns');
    console.log('🔒 Resize started - hover blocking enabled');
    
    // Create a full-screen overlay to block hover events during resize
    const overlay = document.createElement('div');
    overlay.id = 'resize-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      cursor: col-resize;
      user-select: none;
    `;
    document.body.appendChild(overlay);

    const startX = e.clientX;
    // Navigate up to the grid container
    const container = handleRef.current?.parentElement?.parentElement;
    if (!container) return;

    // Get initial ratios from the store (flex values)
    const { leftRatio: startLeftRatio, rightRatio: startRightRatio } = getColumnRatios();
    const combinedRatio = startLeftRatio + startRightRatio;
    
    // Get the actual pixel widths of the two columns being resized
    const leftWrapper = container.querySelector(`[data-column-wrapper="${leftColumnId}"]`) as HTMLElement;
    const rightWrapper = container.querySelector(`[data-column-wrapper="${rightColumnId}"]`) as HTMLElement;
    if (!leftWrapper || !rightWrapper) return;
    
    const leftPixelWidth = leftWrapper.offsetWidth;
    const rightPixelWidth = rightWrapper.offsetWidth;
    const combinedPixelWidth = leftPixelWidth + rightPixelWidth;

    // Track last applied ratio to avoid unnecessary updates
    let lastLeftRatio = startLeftRatio;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      
      const deltaX = moveEvent.clientX - startX;
      
      // Calculate new pixel widths
      const newLeftPixelWidth = leftPixelWidth + deltaX;
      const newRightPixelWidth = rightPixelWidth - deltaX;
      
      // Convert to ratio units proportionally
      let newLeftRatio = (newLeftPixelWidth / combinedPixelWidth) * combinedRatio;
      let newRightRatio = (newRightPixelWidth / combinedPixelWidth) * combinedRatio;
      
      // Enforce minimum ratio of 0.5
      const minRatio = 0.5;
      if (newLeftRatio < minRatio) {
        newLeftRatio = minRatio;
        newRightRatio = combinedRatio - minRatio;
      }
      if (newRightRatio < minRatio) {
        newRightRatio = minRatio;
        newLeftRatio = combinedRatio - minRatio;
      }
      
      // Only update if values actually changed (reduces jitter)
      if (Math.abs(newLeftRatio - lastLeftRatio) > 0.01) {
        lastLeftRatio = newLeftRatio;
        resizeColumn(sectionId, rowId, leftColumnId, newLeftRatio);
        resizeColumn(sectionId, rowId, rightColumnId, newRightRatio);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setGlobalIsResizing(false);
      
      // Remove the body class
      document.body.classList.remove('resizing-columns');
      console.log('🔓 Resize ended - hover blocking disabled');
      
      // Remove the overlay
      const overlay = document.getElementById('resize-overlay');
      if (overlay) {
        document.body.removeChild(overlay);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Only render when visible (columns hovered) or when actively resizing
  if (!isVisible && !isResizing) {
    return null;
  }

  // Get row padding to extend resize handle
  const getRowPadding = () => {
    for (const section of sections) {
      if (section.id !== sectionId) continue;
      for (const row of section.rows) {
        if (row.id !== rowId) continue;
        return {
          paddingTop: row.paddingTop || 6,
          paddingBottom: row.paddingBottom || 6,
        };
      }
    }
    return { paddingTop: 6, paddingBottom: 6 };
  };

  const { paddingTop, paddingBottom } = getRowPadding();

  return (
    <div
      ref={handleRef}
      data-resize-handle="true"
      className={cn(
        "absolute flex items-center justify-center cursor-col-resize",
        isResizing && "bg-blue-100/10 dark:bg-blue-900/10"
      )}
      style={{ 
        width: '8px',
        top: `${-paddingTop - 2}px`, // Extend to row border, accounting for padding and ring-2
        bottom: `${-paddingBottom - 2}px`, // Extend to row border, accounting for padding and ring-2
        right: '-4px', // Position on right edge, centered on column boundary
        zIndex: 130,
        pointerEvents: 'auto',
        backgroundColor: 'transparent'
      }}
      onMouseDown={handleResize}
      onMouseEnter={(e) => {
        e.stopPropagation();
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
      }}
    >
      {/* Vertical line indicator - connects to row border */}
      <div 
        className={cn(
          "w-0.5 h-full bg-blue-400/60 transition-all duration-200 flex items-center justify-center",
          isResizing && "bg-blue-600"
        )}
      >
        {/* Drag button in center */}
        <div className="w-3 h-6 bg-blue-500 rounded-sm flex items-center justify-center cursor-col-resize hover:bg-blue-600 transition-colors">
          <div className="flex flex-col gap-0.5">
            <div className="w-0.5 h-0.5 bg-white rounded-full" />
            <div className="w-0.5 h-0.5 bg-white rounded-full" />
            <div className="w-0.5 h-0.5 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
