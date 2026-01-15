"use client";



import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TabItem {
  id: string;
  label: string;
  content: string;
  icon?: string;
}

export interface TabsElementProps {
  tabs: TabItem[];
  variant?: 'default' | 'pills' | 'underline' | 'enclosed';
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  defaultTab?: string;
  onUpdate?: (tabs: TabItem[]) => void;
  isEditing?: boolean;
}

export function TabsElement({
  tabs = [],
  variant = 'default',
  orientation = 'horizontal',
  size = 'md',
  defaultTab,
  onUpdate,
  isEditing = false,
}: TabsElementProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const addTab = () => {
    if (!onUpdate) return;
    const newTab: TabItem = {
      id: `tab-${Date.now()}`,
      label: 'New Tab',
      content: 'Add your content here...',
    };
    onUpdate([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const removeTab = (id: string) => {
    if (!onUpdate || tabs.length <= 1) return;
    const newTabs = tabs.filter(tab => tab.id !== id);
    onUpdate(newTabs);
    if (activeTab === id) {
      setActiveTab(newTabs[0]?.id);
    }
  };

  const updateTab = (id: string, updates: Partial<TabItem>) => {
    if (!onUpdate) return;
    onUpdate(tabs.map(tab => tab.id === id ? { ...tab, ...updates } : tab));
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-3',
  };

  const getTabButtonClasses = (isActive: boolean) => {
    const base = cn(
      'relative transition-all duration-200 font-medium',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      sizeClasses[size]
    );

    switch (variant) {
      case 'pills':
        return cn(
          base,
          'rounded-full',
          isActive
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        );
      case 'underline':
        return cn(
          base,
          'border-b-2',
          isActive
            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        );
      case 'enclosed':
        return cn(
          base,
          'border border-gray-300 dark:border-gray-600',
          isActive
            ? 'bg-white dark:bg-gray-900 border-b-transparent -mb-px z-10'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        );
      default:
        return cn(
          base,
          'rounded-t-lg',
          isActive
            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        );
    }
  };

  if (tabs.length === 0 && isEditing) {
    return (
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No tabs yet</p>
        <Button onClick={addTab} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add First Tab
        </Button>
      </div>
    );
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={cn(
      'w-full',
      orientation === 'vertical' && 'flex gap-4'
    )}>
      {/* Tab List */}
      <div className={cn(
        'flex gap-1',
        orientation === 'horizontal' ? 'border-b border-gray-200 dark:border-gray-700' : 'flex-col border-r border-gray-200 dark:border-gray-700 pr-4',
        variant === 'underline' && 'border-b-0'
      )}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => !isEditing && setActiveTab(tab.id)}
              className={getTabButtonClasses(isActive)}
              disabled={isEditing}
            >
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <input
                    type="text"
                    value={tab.label}
                    onChange={(e) => updateTab(tab.id, { label: e.target.value })}
                    className="bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 min-w-[100px]"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {tabs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTab(tab.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {tab.icon && <span className="mr-2">{tab.icon}</span>}
                  {tab.label}
                </>
              )}

              {/* Active Indicator for underline variant */}
              {variant === 'underline' && isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}

        {/* Add Tab Button (Edit Mode) */}
        {isEditing && (
          <Button
            onClick={addTab}
            variant="ghost"
            size="sm"
            className={cn(
              'shrink-0',
              orientation === 'vertical' && 'w-full'
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tab
          </Button>
        )}
      </div>

      {/* Tab Content */}
      <div className={cn(
        'flex-1',
        orientation === 'horizontal' ? 'mt-4' : 'mt-0'
      )}>
        {activeTabContent && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            {isEditing ? (
              <textarea
                value={activeTabContent.content}
                onChange={(e) => updateTab(activeTab, { content: e.target.value })}
                className="w-full min-h-[200px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {activeTabContent.content}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper function for cn utility
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
