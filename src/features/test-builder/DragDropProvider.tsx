"use client";



import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useTestBuilderV2Store } from './store';
import { 
  Type, Heading, AlignLeft, MousePointer, Image, Video, FileText, 
  Clock, MessageSquare, DollarSign, Star, Minus, List, HelpCircle, Users, TrendingUp,
  Square, AlertCircle, Tag, Columns as ColumnsIcon
} from 'lucide-react';

interface DragDropProviderProps {
  children: React.ReactNode;
}

export function DragDropProvider({ children }: DragDropProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    // Only allow sidebar elements to be dragged - ignore canvas element drags
    if (data?.type !== 'sidebar-element') {
      return; // Don't start drag for canvas elements
    }
    setActiveId(event.active.id as string);
    setActiveData(data);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // No-op - we don't track over state anymore since elements aren't draggable
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const activeData = active.data.current;
      const overData = over.data.current;

      // Only handle sidebar element drops - canvas elements are not draggable
      if (activeData && overData && activeData.type === 'sidebar-element') {
        // Add new element from sidebar
        const { addElement } = useTestBuilderV2Store.getState();
        addElement(
          overData.sectionId,
          overData.rowId,
          overData.columnId,
          activeData.elementType,
          overData.index
        );
      }
    }

    setActiveId(null);
    setActiveData(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveData(null);
  };

  // No sortable context needed - elements are not draggable
  // Only sidebar elements can be dragged onto the canvas

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}

      <DragOverlay>
        {activeId && activeData ? (
          <div className="bg-orange-500/20 border-2 border-orange-500 rounded-lg p-4 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                {(() => {
                  if (activeData.type === 'sidebar-element') {
                    const iconMap: Record<string, any> = {
                      'heading': Heading,
                      'subheading': Type,
                      'text': AlignLeft,
                      'button': MousePointer,
                      'image': Image,
                      'video': Video,
                      'gif': Image,
                      'form': FileText,
                      'countdown': Clock,
                      'testimonial': MessageSquare,
                      'pricing': DollarSign,
                      'socialproof': Users,
                      'progress': TrendingUp,
                      'list': List,
                      'faq': HelpCircle,
                      'spacer': Minus,
                      'divider': Minus,
                      'icon': Star,
                      'accordion': Square,
                      'tabs': ColumnsIcon,
                      'modal': Square,
                      'alert': AlertCircle,
                      'badge': Tag,
                    };
                    const Icon = iconMap[activeData.elementType] || Type;
                    return <Icon size={20} className="text-white" />;
                  }
                  return <Type size={20} className="text-white" />;
                })()}
              </div>
              <div className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                {activeData.type === 'sidebar-element' 
                  ? `Adding ${activeData.elementType}...` 
                  : 'Moving element...'}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
