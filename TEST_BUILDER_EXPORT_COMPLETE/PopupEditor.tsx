"use client";



import React, { useState } from 'react';
import { useTestBuilderV2Store, Section } from './store';
import { SectionComponent } from './SectionComponent';
import { RowComponent } from './RowComponent';
import { X, Plus, Settings, GripVertical, ArrowUp, ArrowDown, Trash2, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PopupEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onShowSettings: () => void;
}

// Popup-specific Section Component that uses addPopupRow
function PopupSectionComponent({ section, index, totalSections }: { section: Section; index: number; totalSections: number }) {
  const {
    selectedSectionId,
    selectSection,
    deletePopupSection,
    addPopupRow,
  } = useTestBuilderV2Store();

  const [isHovered, setIsHovered] = useState(false);
  const [showRowModal, setShowRowModal] = useState(false);

  const isSelected = selectedSectionId === section.id;

  const handleAddRow = (columnCount: 1 | 2 | 3 | 4 | 5 | 6) => {
    addPopupRow(section.id, columnCount);
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
        selectSection(section.id);
      }}
    >
      {/* Section Header Bar */}
      {(isHovered || isSelected) && (
        <div className="absolute -top-10 left-0 right-0 flex items-center justify-between bg-blue-600 text-white px-3 py-1.5 rounded-t-lg shadow-lg z-10">
          <div className="flex items-center gap-2">
            <button className="cursor-move hover:bg-blue-700 p-1 rounded">
              <GripVertical size={16} />
            </button>
            <span className="text-sm font-medium">{section.name}</span>
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
                  deletePopupSection(section.id);
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
        {section.rows.length === 0 ? (
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
        ) : (
          /* Rows */
          <div className="space-y-4">
            {section.rows.map((row, rowIndex) => (
              <RowComponent
                key={row.id}
                row={row}
                sectionId={section.id}
                index={rowIndex}
                totalRows={section.rows.length}
              />
            ))}
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

export function PopupEditor({ isOpen, onClose, onShowSettings }: PopupEditorProps) {
  const { popup, addPopupSection } = useTestBuilderV2Store();

  if (!isOpen) return null;

  const handleAddSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    addPopupSection();
    toast.success('Section added to popup!');
  };

  const handleShowSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowSettings();
  };

  return (
    <>
      {/* Light Tinted Overlay - NO BLUR, BLOCKS CLICKS */}
      <div 
        className="fixed inset-0 z-[60] bg-black/20"
        onClick={onClose}
      />

      {/* Small Popup Canvas Box - Like in Image */}
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-8 pointer-events-none">
        <div 
          className="w-full max-w-3xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Edit Pop Up Settings Button (Blue, Above Canvas) */}
          <div className="flex justify-center mb-3">
            <button 
              onClick={handleShowSettings}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
            >
              <Settings size={16} />
              Edit Pop Up Settings
            </button>
          </div>

          {/* Popup Canvas Box (White) */}
          <div 
            className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button (Top Right) */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 bg-black text-white rounded-full p-1.5 hover:bg-gray-800 shadow-lg z-10"
            >
              <X size={18} />
            </button>

            {/* Canvas Content */}
            <div className="p-8 min-h-[500px] max-h-[70vh] overflow-auto">
              {popup.sections.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Build Your Popup
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
                    Add sections, rows, columns, and elements to create your popup content.
                  </p>
                  <Button
                    onClick={handleAddSection}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              ) : (
                /* Popup Sections */
                <div className="space-y-6">
                  {popup.sections.map((section, index) => (
                    <PopupSectionComponent
                      key={section.id}
                      section={section}
                      index={index}
                      totalSections={popup.sections.length}
                    />
                  ))}

                  {/* Add Section Button (Bottom) */}
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={handleAddSection}
                      className="w-10 h-10 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-full flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-lg"
                      title="Add Another Section"
                    >
                      <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
