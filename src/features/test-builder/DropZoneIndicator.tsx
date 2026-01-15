"use client";



import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Sparkles, Zap } from 'lucide-react';
import { useTestBuilderV2Store } from './store';

interface DropZoneIndicatorProps {
  id: string;
  sectionId: string;
  rowId: string;
  columnId: string;
  index: number;
  position: 'before' | 'after' | 'empty';
  className?: string;
}

export function DropZoneIndicator({
  id,
  sectionId,
  rowId,
  columnId,
  index,
  position,
  className,
}: DropZoneIndicatorProps) {
  const { selectSection, selectRow, selectColumn, showLeftSidebar, toggleLeftSidebar, setSidebarActiveTab } = useTestBuilderV2Store();
  
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      type: 'dropzone',
      sectionId,
      rowId,
      columnId,
      index,
      position,
    },
  });

  if (position === 'empty') {
    // Creative empty column with animated, inviting design
    return (
      <div
        ref={setNodeRef}
        className={cn(
          'relative w-full h-full flex flex-col items-center justify-center @container group/empty',
          'transition-all duration-500 ease-out',
          className
        )}
      >
        {/* Animated gradient background */}
        <div className={cn(
          'absolute inset-0 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500',
          'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]',
          isOver 
            ? 'from-orange-100/80 via-orange-50/40 to-transparent dark:from-orange-500/20 dark:via-orange-400/10 dark:to-transparent'
            : 'from-purple-100/60 via-purple-50/30 to-transparent dark:from-purple-500/15 dark:via-purple-400/5 dark:to-transparent'
        )} />
        
        {/* Floating particles effect (CSS only) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn(
            'absolute w-2 h-2 rounded-full opacity-0 group-hover/empty:opacity-60',
            'animate-pulse transition-opacity duration-700',
            isOver ? 'bg-orange-300' : 'bg-purple-300',
            'top-1/4 left-1/4'
          )} style={{ animationDelay: '0ms' }} />
          <div className={cn(
            'absolute w-1.5 h-1.5 rounded-full opacity-0 group-hover/empty:opacity-40',
            'animate-pulse transition-opacity duration-700',
            isOver ? 'bg-orange-400' : 'bg-purple-400',
            'top-1/3 right-1/3'
          )} style={{ animationDelay: '300ms' }} />
          <div className={cn(
            'absolute w-1 h-1 rounded-full opacity-0 group-hover/empty:opacity-50',
            'animate-pulse transition-opacity duration-700',
            isOver ? 'bg-orange-300' : 'bg-purple-300',
            'bottom-1/4 right-1/4'
          )} style={{ animationDelay: '600ms' }} />
        </div>

        {/* Main interactive button */}
        <button
          className={cn(
            'relative z-10 flex flex-col items-center justify-center gap-1.5',
            'transition-all duration-300 ease-out',
            'group/btn cursor-pointer',
            // Hover lift effect
            'hover:-translate-y-0.5',
            'active:translate-y-0 active:scale-95'
          )}
          onClick={(e) => {
            e.stopPropagation();
            // Select the column
            selectSection(sectionId);
            selectRow(rowId);
            selectColumn(columnId);
            // Switch to elements tab
            setSidebarActiveTab('elements');
            // Open the left sidebar if not already open
            if (!showLeftSidebar) {
              toggleLeftSidebar();
            }
          }}
        >
          {/* Icon container with glow */}
          <div className={cn(
            'relative flex items-center justify-center',
            'w-12 h-12 @[140px]:w-14 @[140px]:h-14',
            'rounded-2xl',
            'transition-all duration-300',
            // Glass morphism effect
            'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
            'border border-gray-200/60 dark:border-gray-700/60',
            'shadow-lg shadow-gray-200/50 dark:shadow-black/20',
            // Hover states
            'group-hover/btn:shadow-xl group-hover/btn:border-purple-300/60 dark:group-hover/btn:border-purple-500/40',
            'group-hover/btn:bg-gradient-to-br group-hover/btn:from-white group-hover/btn:to-purple-50 dark:group-hover/btn:from-gray-800 dark:group-hover/btn:to-purple-900/30',
            // Drag over
            isOver && 'border-orange-300 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/30 shadow-orange-200/50'
          )}>
            {/* Glow ring on hover */}
            <div className={cn(
              'absolute inset-0 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300',
              'ring-4 ring-purple-200/30 dark:ring-purple-500/20',
              isOver && 'ring-orange-200/40 dark:ring-orange-500/20'
            )} />
            
            {/* Icon */}
            <Sparkles 
              className={cn(
                'w-6 h-6 @[140px]:w-7 @[140px]:h-7',
                'transition-all duration-300',
                'text-gray-400 dark:text-gray-500',
                'group-hover/btn:text-purple-500 dark:group-hover/btn:text-purple-400',
                'group-hover/btn:rotate-12',
                isOver && 'text-orange-500 dark:text-orange-400 rotate-12'
              )} 
            />
          </div>
          
          {/* Text content - responsive */}
          <div className="flex flex-col items-center gap-0.5 mt-1">
            <span className={cn(
              'text-xs @[140px]:text-sm font-semibold tracking-tight',
              'transition-colors duration-300',
              'text-gray-500 dark:text-gray-400',
              'group-hover/btn:text-purple-600 dark:group-hover/btn:text-purple-300',
              isOver && 'text-orange-600 dark:text-orange-400',
              'whitespace-nowrap overflow-hidden text-ellipsis'
            )}>
              Add Element
            </span>
            
            {/* Subtext with icon - only on larger containers */}
            <span className={cn(
              'hidden @[140px]:flex items-center gap-1',
              'text-[10px] text-gray-400 dark:text-gray-500',
              'transition-colors duration-300',
              'group-hover/btn:text-purple-400 dark:group-hover/btn:text-purple-400/70',
              isOver && 'text-orange-400'
            )}>
              <Zap size={10} className="animate-pulse" />
              <span>Drag or click</span>
            </span>
          </div>
        </button>
        
        {/* Drop indicator ring */}
        {isOver && (
          <div className="absolute inset-3 border-2 border-dashed border-orange-400/60 rounded-xl animate-pulse pointer-events-none" />
        )}
      </div>
    );
  }

  // Between elements drop zone
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative h-2 -my-1 transition-all',
        isOver && 'h-4 -my-2',
        className
      )}
    >
      {isOver && (
        <>
          {/* Snap Guide Line */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-orange-500 shadow-lg z-[150]">
            {/* Left Indicator */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full" />
            
            {/* Center Label */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-6 bg-orange-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-lg font-medium">
              Drop {position === 'before' ? 'above' : 'below'}
            </div>
            
            {/* Right Indicator */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full" />
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-b from-orange-500/20 via-orange-500/10 to-transparent blur-sm" />
        </>
      )}
    </div>
  );
}
