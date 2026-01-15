"use client";

import React, { useState } from 'react';
import { useTestBuilderV2Store } from './store';
import { RowComponent } from './RowComponent';
import { GripVertical, Plus, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Section {
  id: string;
  name: string;
  rows: any[];
  [key: string]: any;
}

interface SectionComponentProps {
  section: Section;
  index: number;
  totalSections: number;
}

export function SectionComponent({ section, index, totalSections }: SectionComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showRowModal, setShowRowModal] = useState(false);
  
  const { 
    selectedSectionId, 
    selectSection, 
    deleteSection,
    addRow 
  } = useTestBuilderV2Store();

  const isSelected = selectedSectionId === section.id;

  const handleAddRow = (columnCount: 1 | 2 | 3 | 4 | 5 | 6) => {
    addRow?.(section.id, columnCount);
    setShowRowModal(false);
    toast.success(`Row with ${columnCount} column(s) added!`);
  };

  return (
    <div
      className={cn(
        'relative transition-all duration-200 rounded-lg',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        isHovered && !isSelected && 'ring-2 ring-blue-300 ring-offset-1'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        selectSection?.(section.id);
      }}
    >
      {/* Section Header Bar */}
      {(isHovered || isSelected) && (
        <div className="absolute -top-10 left-0 right-0 flex items-center justify-between bg-blue-600 text-white px-3 py-1.5 rounded-t-lg shadow-lg z-10">
          <div className="flex items-center gap-2">
            <button className="cursor-move hover:bg-blue-700 p-1 rounded">
              <GripVertical size={16} />
            </button>
            <span className="text-sm font-medium">{section.name || `Section ${index + 1}`}</span>
          </div>
          <div className="flex items-center gap-1">
            {/* Add Row */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowRowModal(true);
              }}
              className="hover:bg-blue-700 p-1 rounded"
              title="Add Row"
            >
              <Plus size={16} />
            </button>

            {/* Delete Section */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this section?')) {
                  deleteSection?.(section.id);
                }
              }}
              className="hover:bg-blue-700 p-1 rounded"
              title="Delete Section"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Section Content */}
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[100px]">
        {section.rows && section.rows.length > 0 ? (
          <div className="space-y-4">
            {section.rows.map((row: any, rowIndex: number) => (
              <RowComponent
                key={row.id}
                row={row}
                sectionId={section.id}
                index={rowIndex}
                totalRows={section.rows.length}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              No rows yet. Add a row to start building.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowRowModal(true);
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Add Row
            </button>
          </div>
        )}
      </div>

      {/* Add Row Modal */}
      {showRowModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[70]"
            onClick={() => setShowRowModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Choose Column Layout</h3>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((count) => (
                  <button
                    key={count}
                    onClick={() => handleAddRow(count as 1 | 2 | 3 | 4 | 5 | 6)}
                    className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="flex-1 h-8 bg-blue-200 dark:bg-blue-800 rounded" />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-center">
                      {count} Column{count > 1 ? 's' : ''}
                    </p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowRowModal(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
