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
