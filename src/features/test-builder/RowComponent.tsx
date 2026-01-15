"use client";

import React, { useState } from 'react';
import { useTestBuilderV2Store } from './store';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Row {
  id: string;
  columns: any[];
  [key: string]: any;
}

interface RowComponentProps {
  row: Row;
  sectionId: string;
  index: number;
  totalRows: number;
}

export function RowComponent({ row, sectionId, index, totalRows }: RowComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { selectedRowId, selectRow, deleteRow } = useTestBuilderV2Store();

  const isSelected = selectedRowId === row.id;

  return (
    <div
      className={cn(
        'relative transition-all duration-200 rounded-lg border-2',
        isSelected ? 'border-green-500 ring-2 ring-green-300' : 'border-gray-200',
        isHovered && !isSelected && 'border-green-300'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        selectRow?.(row.id);
      }}
    >
      {/* Row Header */}
      {(isHovered || isSelected) && (
        <div className="absolute -top-8 left-0 right-0 flex items-center justify-between bg-green-600 text-white px-2 py-1 rounded-t text-xs z-10">
          <div className="flex items-center gap-1">
            <button className="cursor-move hover:bg-green-700 p-0.5 rounded">
              <GripVertical size={14} />
            </button>
            <span className="font-medium">Row {index + 1}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this row?')) {
                  deleteRow?.(sectionId, row.id);
                }
              }}
              className="hover:bg-green-700 p-0.5 rounded"
              title="Delete Row"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Row Content - Columns */}
      <div className="flex gap-2 p-3 min-h-[60px]">
        {row.columns && row.columns.length > 0 ? (
          row.columns.map((column: any, colIndex: number) => (
            <div
              key={column.id || colIndex}
              className="flex-1 bg-gray-50 border border-dashed border-gray-300 rounded p-2 min-h-[40px] flex items-center justify-center text-xs text-gray-400"
            >
              Column {colIndex + 1}
            </div>
          ))
        ) : (
          <div className="flex-1 bg-gray-50 border border-dashed border-gray-300 rounded p-4 flex items-center justify-center text-sm text-gray-400">
            <Plus size={16} className="mr-1" />
            Add columns
          </div>
        )}
      </div>
    </div>
  );
}
