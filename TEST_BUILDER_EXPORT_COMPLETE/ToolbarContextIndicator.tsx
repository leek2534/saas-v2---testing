"use client";



import React, { useState, useRef, useEffect } from 'react';
import { useTestBuilderV2Store } from './store';
import { Layout, Rows, Columns, ChevronRight, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToolbarContextIndicator() {
  const { sections, selectedSectionId, selectedRowId, selectedColumnId, selectedElementId, renameSection, renameRow, renameColumn, renameElement } = useTestBuilderV2Store();
  const [editingType, setEditingType] = useState<'section' | 'row' | 'column' | 'element' | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Find the selected section, row, column, and element
  const selectedSection = sections.find(s => s.id === selectedSectionId);
  const selectedRow = selectedSection?.rows.find(r => r.id === selectedRowId);
  const selectedColumn = selectedRow?.columns.find(c => c.id === selectedColumnId);
  const selectedElement = selectedColumn?.elements.find(e => e.id === selectedElementId);

  // Focus input when editing starts
  useEffect(() => {
    if (editingType && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingType]);

  const handleSectionDoubleClick = () => {
    if (selectedSection) {
      setEditingType('section');
      setEditValue(selectedSection.name);
    }
  };

  const handleRowDoubleClick = () => {
    if (selectedRow) {
      setEditingType('row');
      setEditValue(selectedRow.name);
    }
  };

  const handleColumnDoubleClick = () => {
    if (selectedColumn && selectedRow) {
      setEditingType('column');
      const columnIndex = selectedRow.columns.findIndex(c => c.id === selectedColumn.id);
      setEditValue(selectedColumn.name || `Column ${columnIndex + 1}`);
    }
  };

  const handleElementDoubleClick = () => {
    if (selectedElement) {
      setEditingType('element');
      setEditValue(selectedElement.name || selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1));
    }
  };

  const handleSave = () => {
    if (editingType === 'section' && selectedSection && editValue.trim()) {
      renameSection(selectedSection.id, editValue.trim());
    } else if (editingType === 'row' && selectedRow && selectedSection && editValue.trim()) {
      renameRow(selectedSection.id, selectedRow.id, editValue.trim());
    } else if (editingType === 'column' && selectedColumn && selectedRow && selectedSection && editValue.trim()) {
      renameColumn(selectedSection.id, selectedRow.id, selectedColumn.id, editValue.trim());
    } else if (editingType === 'element' && selectedElement && editValue.trim()) {
      renameElement(selectedElement.id, editValue.trim());
    }
    setEditingType(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditingType(null);
      setEditValue('');
    }
  };

  // If nothing is selected, show a subtle message
  if (!selectedSection) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700" suppressHydrationWarning>
        <Layout size={14} className="text-gray-400" />
        <span className="text-xs text-gray-500 dark:text-gray-400">
          No selection
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50" suppressHydrationWarning>
      {/* Section */}
      <div className="flex items-center gap-1.5" suppressHydrationWarning>
        <Layout size={14} className="text-blue-600 dark:text-blue-400" />
        {editingType === 'section' ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 border border-blue-500 rounded px-1 py-0.5 w-32"
          />
        ) : (
          <span
            onDoubleClick={handleSectionDoubleClick}
            className="text-xs font-medium text-blue-700 dark:text-blue-300 cursor-pointer hover:underline"
            title="Double-click to rename"
          >
            {selectedSection.name}
          </span>
        )}
      </div>

      {/* Row */}
      {selectedRow && (
        <>
          <ChevronRight size={12} className="text-gray-400" />
          <div className="flex items-center gap-1.5" suppressHydrationWarning>
            <Rows size={14} className="text-green-600 dark:text-green-400" />
            {editingType === 'row' ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="text-xs font-medium text-green-700 dark:text-green-300 bg-white dark:bg-gray-800 border border-green-500 rounded px-1 py-0.5 w-32"
              />
            ) : (
              <span
                onDoubleClick={handleRowDoubleClick}
                className="text-xs font-medium text-green-700 dark:text-green-300 cursor-pointer hover:underline"
                title="Double-click to rename"
              >
                {selectedRow.name}
              </span>
            )}
          </div>
        </>
      )}

      {/* Column */}
      {selectedColumn && (
        <>
          <ChevronRight size={12} className="text-gray-400" />
          <div className="flex items-center gap-1.5" suppressHydrationWarning>
            <Columns size={14} className="text-purple-600 dark:text-purple-400" />
            {editingType === 'column' ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="text-xs font-medium text-purple-700 dark:text-purple-300 bg-white dark:bg-gray-800 border border-purple-500 rounded px-1 py-0.5 w-32"
              />
            ) : (
              <span
                onDoubleClick={handleColumnDoubleClick}
                className="text-xs font-medium text-purple-700 dark:text-purple-300 cursor-pointer hover:underline"
                title="Double-click to rename"
              >
                {selectedColumn.name || `Column ${selectedRow?.columns.findIndex(c => c.id === selectedColumn.id)! + 1}`}
              </span>
            )}
          </div>
        </>
      )}

      {/* Element */}
      {selectedElement && (
        <>
          <ChevronRight size={12} className="text-gray-400" />
          <div className="flex items-center gap-1.5" suppressHydrationWarning>
            <Type size={14} className="text-orange-600 dark:text-orange-400" />
            {editingType === 'element' ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="text-xs font-medium text-orange-700 dark:text-orange-300 bg-white dark:bg-gray-800 border border-orange-500 rounded px-1 py-0.5 w-32"
              />
            ) : (
              <span
                onDoubleClick={handleElementDoubleClick}
                className="text-xs font-medium text-orange-700 dark:text-orange-300 cursor-pointer hover:underline"
                title="Double-click to rename"
              >
                {selectedElement.name || (selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1))}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
