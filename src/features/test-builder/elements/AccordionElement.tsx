"use client";



import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  isOpen?: boolean;
}

export interface AccordionElementProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  variant?: 'default' | 'bordered' | 'separated';
  size?: 'sm' | 'md' | 'lg';
  iconPosition?: 'left' | 'right';
  onUpdate?: (items: AccordionItem[]) => void;
  isEditing?: boolean;
}

export function AccordionElement({
  items = [],
  allowMultiple = false,
  variant = 'default',
  size = 'md',
  iconPosition = 'right',
  onUpdate,
  isEditing = false,
}: AccordionElementProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(items.filter(item => item.isOpen).map(item => item.id))
  );

  const toggleItem = (id: string) => {
    if (isEditing) return; // Don't toggle in edit mode
    
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  const addItem = () => {
    if (!onUpdate) return;
    const newItem: AccordionItem = {
      id: `item-${Date.now()}`,
      title: 'New Item',
      content: 'Add your content here...',
      isOpen: false,
    };
    onUpdate([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (!onUpdate) return;
    onUpdate(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<AccordionItem>) => {
    if (!onUpdate) return;
    onUpdate(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const variantClasses = {
    default: 'border-b border-gray-200 dark:border-gray-700',
    bordered: 'border border-gray-200 dark:border-gray-700 rounded-lg mb-2',
    separated: 'bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 p-1',
  };

  if (items.length === 0 && isEditing) {
    return (
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No accordion items yet</p>
        <Button onClick={addItem} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add First Item
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-0">
      {items.map((item, index) => {
        const isOpen = openItems.has(item.id);
        
        return (
          <div
            key={item.id}
            className={cn(
              'transition-all duration-200',
              variantClasses[variant]
            )}
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleItem(item.id)}
              className={cn(
                'w-full flex items-center justify-between gap-4 p-4 text-left',
                'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                sizeClasses[size],
                isOpen && 'bg-gray-50 dark:bg-gray-800'
              )}
              disabled={isEditing}
            >
              {/* Icon Left */}
              {iconPosition === 'left' && (
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              )}

              {/* Title */}
              {isEditing ? (
                <div className="flex-1 flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                    className="flex-1 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ) : (
                <span className="flex-1 font-medium text-gray-900 dark:text-gray-100">
                  {item.title}
                </span>
              )}

              {/* Icon Right */}
              {iconPosition === 'right' && !isEditing && (
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              )}
            </button>

            {/* Accordion Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 text-gray-600 dark:text-gray-300">
                    {isEditing ? (
                      <textarea
                        value={item.content}
                        onChange={(e) => updateItem(item.id, { content: e.target.value })}
                        className="w-full min-h-[100px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="prose dark:prose-invert max-w-none">
                        {item.content}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Add Item Button (Edit Mode) */}
      {isEditing && (
        <Button
          onClick={addItem}
          variant="outline"
          size="sm"
          className="w-full mt-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      )}
    </div>
  );
}

// Helper function for cn utility
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
