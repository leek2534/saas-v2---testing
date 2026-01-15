"use client";



import React from 'react';
import { useTestBuilderV2Store } from './store';
import { Layout, Rows, Columns, Box } from 'lucide-react';

export function ContextIndicator() {
  const { sections, selectedSectionId, selectedRowId, selectedColumnId } = useTestBuilderV2Store();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Find the selected section, row, and column
  const selectedSection = sections.find(s => s.id === selectedSectionId);
  const selectedRow = selectedSection?.rows.find(r => r.id === selectedRowId);
  const selectedColumn = selectedRow?.columns.find(c => c.id === selectedColumnId);

  if (!mounted) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Box size={16} />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!selectedSection) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Box size={16} />
          <span className="text-sm">No section selected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600 dark:text-gray-400 font-medium">Adding elements to:</span>
        
        {/* Section */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md">
          <Layout size={14} />
          <span className="font-medium">{selectedSection.name}</span>
        </div>

        {/* Row */}
        {selectedRow && (
          <>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-md">
              <Rows size={14} />
              <span className="font-medium">{selectedRow.name}</span>
            </div>
          </>
        )}

        {/* Column */}
        {selectedColumn && (
          <>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-md">
              <Columns size={14} />
              <span className="font-medium">Column {selectedRow?.columns.findIndex(c => c.id === selectedColumn.id)! + 1}</span>
            </div>
          </>
        )}
      </div>

      {/* Helper Text */}
      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
        {!selectedRow && !selectedColumn && (
          <span>Add a row to this section to start building</span>
        )}
        {selectedRow && !selectedColumn && (
          <span>Select a column to add elements</span>
        )}
        {selectedColumn && (
          <span>Click any element below to add it to this column</span>
        )}
      </div>
    </div>
  );
}
