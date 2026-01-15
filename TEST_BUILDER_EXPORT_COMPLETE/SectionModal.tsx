"use client";

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Layout, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSection: (config: SectionConfig) => void;
}

export interface SectionConfig {
  containerType: 'full-width' | 'wide' | 'standard' | 'medium' | 'small';
  maxWidth?: string;
  rows: RowConfig[];
}

interface RowConfig {
  columnCount: number;
  layout?: string;
  columns: ColumnConfig[];
}

interface ColumnConfig {
  width: number;
}

const CONTAINER_SIZES = [
  { id: 'full-width', name: 'Full Width', maxWidth: '100%', widthPercent: 100 },
  { id: 'wide', name: 'Wide', maxWidth: '1280px', widthPercent: 85 },
  { id: 'medium', name: 'Medium', maxWidth: '1024px', widthPercent: 70 },
  { id: 'standard', name: 'Standard', maxWidth: '960px', widthPercent: 65 },
  { id: 'small', name: 'Narrow', maxWidth: '768px', widthPercent: 50 },
];

const LAYOUT_TEMPLATES = {
  1: [{ id: 'full', name: 'Full', columns: [100] }],
  2: [
    { id: '50-50', name: '50 / 50', columns: [50, 50] },
    { id: '33-66', name: '33 / 66', columns: [33, 67] },
    { id: '66-33', name: '66 / 33', columns: [67, 33] },
    { id: '25-75', name: '25 / 75', columns: [25, 75] },
  ],
  3: [
    { id: '33-33-33', name: 'Equal thirds', columns: [33.33, 33.33, 33.34] },
    { id: '25-50-25', name: 'Wide center', columns: [25, 50, 25] },
    { id: '50-25-25', name: 'Wide left', columns: [50, 25, 25] },
  ],
  4: [
    { id: '25-25-25-25', name: 'Equal quarters', columns: [25, 25, 25, 25] },
  ],
};

export function SectionModal({ isOpen, onClose, onCreateSection }: SectionModalProps) {
  const [columnCount, setColumnCount] = useState(1);
  const [containerType, setContainerType] = useState<SectionConfig['containerType']>('standard');
  const [selectedLayout, setSelectedLayout] = useState<string>('full');

  useEffect(() => {
    if (isOpen) {
      setColumnCount(1);
      setContainerType('standard');
      setSelectedLayout('full');
    }
  }, [isOpen]);

  useEffect(() => {
    const templates = LAYOUT_TEMPLATES[columnCount as keyof typeof LAYOUT_TEMPLATES];
    if (templates?.length) setSelectedLayout(templates[0].id);
  }, [columnCount]);

  const selectedSize = useMemo(() => CONTAINER_SIZES.find(s => s.id === containerType), [containerType]);
  const currentTemplates = useMemo(() => LAYOUT_TEMPLATES[columnCount as keyof typeof LAYOUT_TEMPLATES] || [], [columnCount]);
  const selectedTemplate = useMemo(() => currentTemplates.find(t => t.id === selectedLayout), [currentTemplates, selectedLayout]);

  const handleCreate = () => {
    const template = selectedTemplate || currentTemplates[0];
    onCreateSection({
      containerType,
      maxWidth: selectedSize?.maxWidth,
      rows: [{
        columnCount,
        layout: selectedLayout,
        columns: template.columns.map(width => ({ width })),
      }],
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Layout className="w-5 h-5 text-primary" />
            Add Section
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Choose columns, layout, and width</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Columns */}
          <div>
            <label className="text-sm font-medium mb-3 block">Columns</label>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setColumnCount(n)}
                  className={cn(
                    "relative h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all",
                    columnCount === n
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex gap-1 h-10 px-4 w-full justify-center">
                    {Array(n).fill(0).map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex-1 rounded-md max-w-8",
                          columnCount === n ? "bg-primary" : "bg-muted-foreground/20"
                        )} 
                      />
                    ))}
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    columnCount === n ? "text-primary" : "text-muted-foreground"
                  )}>
                    {n} {n === 1 ? 'column' : 'columns'}
                  </span>
                  {columnCount === n && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Layout */}
          {columnCount > 1 && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-sm font-medium mb-3 block">Layout</label>
              <div className="grid grid-cols-4 gap-3">
                {currentTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedLayout(t.id)}
                    className={cn(
                      "relative h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all px-3",
                      selectedLayout === t.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex gap-1 h-8 w-full">
                      {t.columns.map((w, i) => (
                        <div
                          key={i}
                          className={cn(
                            "rounded-md",
                            selectedLayout === t.id ? "bg-primary" : "bg-muted-foreground/20"
                          )}
                          style={{ width: `${w}%` }}
                        />
                      ))}
                    </div>
                    <span className={cn(
                      "text-xs font-medium",
                      selectedLayout === t.id ? "text-primary" : "text-muted-foreground"
                    )}>
                      {t.name}
                    </span>
                    {selectedLayout === t.id && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Width */}
          <div>
            <label className="text-sm font-medium mb-3 block">Section Width</label>
            <div className="grid grid-cols-5 gap-2">
              {CONTAINER_SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setContainerType(s.id as SectionConfig['containerType'])}
                  className={cn(
                    "relative rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all",
                    containerType === s.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  {/* Width bar visualization */}
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full mx-auto",
                        containerType === s.id ? "bg-primary" : "bg-muted-foreground/30"
                      )}
                      style={{ width: `${s.widthPercent}%` }}
                    />
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    containerType === s.id ? "text-primary" : "text-muted-foreground"
                  )}>
                    {s.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {s.maxWidth}
                  </span>
                  {containerType === s.id && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
