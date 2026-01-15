
import React from 'react';
import { cn } from '@/lib/utils';

interface SortableElementProps {
  id: string;
  sectionId: string;
  rowId: string;
  columnId: string;
  index: number;
  children: React.ReactNode;
  isDragging?: boolean;
}

// Element container without drag-and-drop - elements are reordered via move up/down buttons
export function SortableElement({
  id,
  children,
}: SortableElementProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        flexShrink: 1,
        position: 'relative',
        overflow: 'visible',
      }}
      className="relative"
    >
      {children}
    </div>
  );
}
