"use client";



import { useMemo } from 'react';
import { useTestBuilderV2Store } from './store';
import { SectionSettings } from './element-settings/SectionSettings';
import { RowSettings } from './element-settings/RowSettings';
import { ColumnSettings } from './element-settings/ColumnSettings';
import { SettingsPanelV2 } from './SettingsPanelV2';
import { Trash2, Layout, Layers, Columns, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Design system colors for hierarchy
const HIERARCHY_COLORS = {
  section: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/20',
  },
  row: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-500/10',
    text: 'text-green-500',
    border: 'border-green-500/20',
  },
  column: {
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-500/10',
    text: 'text-purple-500',
    border: 'border-purple-500/20',
  },
  element: {
    bg: 'bg-orange-500',
    bgLight: 'bg-orange-500/10',
    text: 'text-orange-500',
    border: 'border-orange-500/20',
  },
};

export function UnifiedSettingsPanel() {
  const {
    sections,
    selectedSectionId,
    selectedRowId,
    selectedColumnId,
    selectedElementId,
    deleteSection,
    deleteRow,
    deleteColumn,
  } = useTestBuilderV2Store();

  // Memoize selected items to prevent recalculation on every render
  const selectedSection = useMemo(
    () => sections.find(s => s.id === selectedSectionId),
    [sections, selectedSectionId]
  );
  
  const selectedRow = useMemo(
    () => selectedSection?.rows.find(r => r.id === selectedRowId),
    [selectedSection, selectedRowId]
  );
  
  const selectedColumn = useMemo(
    () => selectedRow?.columns.find(c => c.id === selectedColumnId),
    [selectedRow, selectedColumnId]
  );
  
  const selectedElement = useMemo(
    () => selectedColumn?.elements.find(e => e.id === selectedElementId),
    [selectedColumn, selectedElementId]
  );

  // Debug logging (disabled for performance)
  // console.log('📊 UnifiedSettingsPanel state:', {
  //   selectedSectionId,
  //   selectedRowId,
  //   selectedColumnId,
  //   selectedElementId,
  //   hasSection: !!selectedSection,
  //   hasRow: !!selectedRow,
  //   hasColumn: !!selectedColumn,
  //   hasElement: !!selectedElement
  // });

  // Determine what to show - ORDER MATTERS!
  // Most specific to least specific
  if (selectedElementId && selectedElement && selectedColumn) {
    return (
      <div className="h-full flex flex-col bg-background border-l border-border overflow-hidden">
        <SettingsPanelV2 element={selectedElement} />
      </div>
    );
  }

  if (selectedColumnId && selectedColumn && selectedRow && selectedSection) {
    return (
      <div className="h-full flex flex-col bg-background border-l border-border overflow-hidden">
        {/* Header */}
        <div className={cn("px-4 py-3 border-b", HIERARCHY_COLORS.column.bgLight, HIERARCHY_COLORS.column.border)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", HIERARCHY_COLORS.column.bg)}>
                <Columns size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Column Settings</h3>
                <p className="text-xs text-muted-foreground">Customize column properties</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (selectedRow.columns.length > 1) {
                  if (confirm('Delete this column?')) {
                    deleteColumn(selectedSectionId!, selectedRowId!, selectedColumnId!);
                  }
                }
              }}
              disabled={selectedRow.columns.length <= 1}
              title={selectedRow.columns.length <= 1 ? "Can't delete last column" : "Delete Column"}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto">
          <ColumnSettings
            node={{ id: selectedColumn.id, type: 'column', props: selectedColumn as any }}
            updateProps={(updates) => {
              // Update column props
              const newSections = sections.map(section => {
                if (section.id === selectedSectionId) {
                  return {
                    ...section,
                    rows: section.rows.map(row => {
                      if (row.id === selectedRowId) {
                        return {
                          ...row,
                          columns: row.columns.map(col => {
                            if (col.id === selectedColumnId) {
                              return { ...col, ...updates };
                            }
                            return col;
                          })
                        };
                      }
                      return row;
                    })
                  };
                }
                return section;
              });
              useTestBuilderV2Store.setState({ sections: newSections });
            }}
          />
        </div>
      </div>
    );
  }

  if (selectedRowId && selectedRow && selectedSection) {
    return (
      <div className="h-full flex flex-col bg-background border-l border-border overflow-hidden">
        {/* Header */}
        <div className={cn("px-4 py-3 border-b", HIERARCHY_COLORS.row.bgLight, HIERARCHY_COLORS.row.border)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", HIERARCHY_COLORS.row.bg)}>
                <Layers size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Row Settings</h3>
                <p className="text-xs text-muted-foreground">{selectedRow.name}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (selectedSection.rows.length > 1) {
                  if (confirm('Delete this row?')) {
                    deleteRow(selectedSectionId!, selectedRowId!);
                  }
                }
              }}
              disabled={selectedSection.rows.length <= 1}
              title={selectedSection.rows.length <= 1 ? "Can't delete last row" : "Delete Row"}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto">
          <RowSettings
            node={{ 
              id: selectedRow.id,
              type: 'row',
              props: {
                width: selectedRow.width,
                rowAlignment: selectedRow.rowAlignment,
                alignment: selectedRow.alignment,
                gap: selectedRow.gap,
                backgroundColor: selectedRow.backgroundColor,
                backgroundGradient: selectedRow.backgroundGradient,
                paddingTop: selectedRow.paddingTop,
                paddingBottom: selectedRow.paddingBottom,
                paddingLeft: selectedRow.paddingLeft,
                paddingRight: selectedRow.paddingRight,
              }
            }}
            updateProps={(updates) => {
              console.log('🔄 Updating row props:', updates);
              // Update row props
              const newSections = sections.map(section => {
                if (section.id === selectedSectionId) {
                  return {
                    ...section,
                    rows: section.rows.map(row => {
                      if (row.id === selectedRowId) {
                        const updatedRow = { ...row, ...updates };
                        console.log('✅ Updated row:', updatedRow);
                        return updatedRow;
                      }
                      return row;
                    })
                  };
                }
                return section;
              });
              useTestBuilderV2Store.setState({ sections: newSections });
            }}
          />
        </div>
      </div>
    );
  }

  if (selectedSection) {
    return (
      <div className="h-full flex flex-col bg-background border-l border-border overflow-hidden">
        {/* Header */}
        <div className={cn("px-4 py-3 border-b", HIERARCHY_COLORS.section.bgLight, HIERARCHY_COLORS.section.border)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", HIERARCHY_COLORS.section.bg)}>
                <Layout size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Section Settings</h3>
                <p className="text-xs text-muted-foreground">{selectedSection.name}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (sections.length > 1) {
                  if (confirm('Delete this section?')) {
                    deleteSection(selectedSectionId!);
                  }
                }
              }}
              disabled={sections.length <= 1}
              title={sections.length <= 1 ? "Can't delete last section" : "Delete Section"}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto">
          <SectionSettings
            node={{ id: selectedSection.id, type: 'section', props: selectedSection.props }}
            updateProps={(updates) => {
              // Update section props
              const newSections = sections.map(section => {
                if (section.id === selectedSectionId) {
                  return {
                    ...section,
                    props: { ...section.props, ...updates }
                  };
                }
                return section;
              });
              useTestBuilderV2Store.setState({ sections: newSections });
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-8 text-center bg-background border-l border-border">
      <div className="max-w-[200px]">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
          <Box size={24} className="text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">No Selection</p>
        <p className="text-xs text-muted-foreground">
          Select a section, row, column, or element to edit its settings
        </p>
      </div>
    </div>
  );
}
