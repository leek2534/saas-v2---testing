"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Rows, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRow: (config: RowConfig) => void;
  sectionId: string;
}

export interface RowConfig {
  sectionId: string;
  columnCount: number;
  layout?: string;
  columns: ColumnConfig[];
}

interface ColumnConfig {
  width: number;
}

const ROW_LAYOUTS = {
  '1-column': [
    { id: '100', name: 'Full Width', columns: [100], desc: 'Single column' }
  ],
  '2-column': [
    { id: '50-50', name: 'Equal Split', columns: [50, 50], desc: 'Balanced' },
    { id: '60-40', name: 'Content + Side', columns: [60, 40], desc: 'Main with aside' },
    { id: '40-60', name: 'Side + Content', columns: [40, 60], desc: 'Aside with main' },
    { id: '70-30', name: 'Wide + Narrow', columns: [70, 30], desc: 'Hero layout' },
  ],
  '3-column': [
    { id: '33-33-33', name: 'Equal Thirds', columns: [33.33, 33.33, 33.33], desc: 'Feature cards' },
    { id: '25-50-25', name: 'Center Focus', columns: [25, 50, 25], desc: 'Spotlight' },
    { id: '50-25-25', name: 'Hero + Features', columns: [50, 25, 25], desc: 'Main with extras' },
  ],
  '4-column': [
    { id: '25-25-25-25', name: 'Equal Quarters', columns: [25, 25, 25, 25], desc: 'Grid layout' }
  ],
  '5-column': [
    { id: '20-20-20-20-20', name: 'Equal Fifths', columns: [20, 20, 20, 20, 20], desc: 'Icon row' }
  ],
  '6-column': [
    { id: '16-16-16-16-16-16', name: 'Equal Sixths', columns: [16.66, 16.66, 16.66, 16.66, 16.66, 16.66], desc: 'Dense grid' }
  ],
};

export function RowModal({ isOpen, onClose, onCreateRow, sectionId }: RowModalProps) {
  const [columnCount, setColumnCount] = useState(2);
  const [selectedLayout, setSelectedLayout] = useState<string | null>('50-50');

  useEffect(() => {
    if (isOpen) {
      setColumnCount(2);
      setSelectedLayout('50-50');
    }
  }, [isOpen]);

  useEffect(() => {
    const layoutKey = `${columnCount}-column` as keyof typeof ROW_LAYOUTS;
    const templates = ROW_LAYOUTS[layoutKey];
    if (templates?.length) setSelectedLayout(templates[0].id);
  }, [columnCount]);

  const handleClose = () => onClose();

  const handleCreate = () => {
    const layoutKey = `${columnCount}-column` as keyof typeof ROW_LAYOUTS;
    const templates = ROW_LAYOUTS[layoutKey];
    const template = templates?.find(t => t.id === selectedLayout) || templates?.[0];

    onCreateRow({
      sectionId,
      columnCount,
      layout: selectedLayout || undefined,
      columns: template ? template.columns.map(width => ({ width })) : Array(columnCount).fill({ width: 100 / columnCount }),
    });
    handleClose();
  };

  const getTemplates = () => {
    const layoutKey = `${columnCount}-column` as keyof typeof ROW_LAYOUTS;
    return ROW_LAYOUTS[layoutKey] || [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-white">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Rows className="w-4 h-4" />
              </div>
              Add Row
            </DialogTitle>
          </DialogHeader>
          <p className="text-emerald-100 text-sm mt-1">Add a new row to your section</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Column Count */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Number of Columns</Label>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setColumnCount(n)}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200",
                    columnCount === n
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-lg shadow-emerald-500/20"
                      : "border-border hover:border-emerald-300 hover:bg-muted/50"
                  )}
                >
                  {/* Visual column preview */}
                  <div className="flex gap-0.5 h-6 w-full justify-center">
                    {Array(n).fill(0).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-sm flex-1 max-w-3 transition-colors",
                          columnCount === n ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
                        )}
                      />
                    ))}
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    columnCount === n ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground"
                  )}>
                    {n}
                  </span>
                  {columnCount === n && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Templates */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <Label className="text-sm font-semibold mb-3 block">Layout Style</Label>
            <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto pr-1">
              {getTemplates().map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedLayout(t.id)}
                  className={cn(
                    "relative p-4 border-2 rounded-xl transition-all duration-200 text-left group",
                    selectedLayout === t.id
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-lg shadow-emerald-500/20"
                      : "border-border hover:border-emerald-300 hover:bg-muted/50"
                  )}
                >
                  {/* Visual preview */}
                  <div className="flex gap-1 h-8 mb-2">
                    {t.columns.map((w, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded transition-colors",
                          selectedLayout === t.id 
                            ? "bg-emerald-500" 
                            : "bg-gray-200 dark:bg-gray-700 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900"
                        )}
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.desc}</div>
                  {selectedLayout === t.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-t">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25">
            <Plus className="w-4 h-4 mr-2" />
            Add Row
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
