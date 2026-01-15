"use client";



import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DraggableSidebarElementProps {
  type: string;
  label: string;
  description: string;
  icon: LucideIcon;
  disabled?: boolean;
  onClick?: () => void;
}

export function DraggableSidebarElement({
  type,
  label,
  description,
  icon: Icon,
  disabled = false,
  onClick,
}: DraggableSidebarElementProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: {
      type: 'sidebar-element',
      elementType: type,
    },
    disabled,
  });

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 relative group',
        isDragging && 'opacity-50 scale-95',
        !disabled
          ? 'border-border/50 bg-muted/50 hover:border-primary hover:bg-accent hover:scale-105 hover:shadow-xl hover:shadow-primary/20 cursor-grab active:cursor-grabbing'
          : 'border-border/30 bg-muted/30 opacity-40 cursor-not-allowed'
      )}
      title={disabled ? 'Select a column first' : `${description}\n\nClick to add or drag to position`}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300',
          !disabled
            ? 'bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110'
            : 'bg-muted/50 text-muted-foreground'
        )}
      >
        <Icon size={20} />
      </div>
      <div className="font-semibold text-xs text-center text-foreground">
        {label}
      </div>
      {!disabled && (
        <div className="text-[10px] text-muted-foreground text-center font-medium">
          Drag or click
        </div>
      )}
    </button>
  );
}
