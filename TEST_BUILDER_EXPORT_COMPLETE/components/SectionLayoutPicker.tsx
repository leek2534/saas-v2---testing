"use client";



import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionLayoutOption {
  id: string;
  name: string;
  description: string;
  containerType: 'full-width' | 'wide' | 'medium' | 'small';
  maxWidth: string;
  preview: React.ReactNode;
}

interface SectionLayoutPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (layout: SectionLayoutOption) => void;
}

const sectionLayouts: SectionLayoutOption[] = [
  {
    id: 'full-width',
    name: 'Full Width',
    description: 'Spans the entire container width',
    containerType: 'full-width',
    maxWidth: '100%',
    preview: (
      <div className="w-full h-8 bg-gray-300 rounded flex items-center justify-center">
        <div className="flex space-x-1">
          <div className="w-1 h-4 bg-blue-500 rounded" />
          <div className="w-1 h-4 bg-blue-500 rounded" />
          <div className="w-1 h-4 bg-blue-500 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'wide',
    name: 'Wide',
    description: 'Desktop width (1280px)',
    containerType: 'wide',
    maxWidth: '1280px',
    preview: (
      <div className="w-full h-8 flex items-center justify-center px-2">
        <div className="w-full h-6 bg-gray-300 rounded flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-blue-500 rounded" />
            <div className="w-1 h-3 bg-blue-500 rounded" />
            <div className="w-1 h-3 bg-blue-500 rounded" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'Tablet landscape (1024px)',
    containerType: 'medium',
    maxWidth: '1024px',
    preview: (
      <div className="w-full h-8 flex items-center justify-center px-4">
        <div className="w-3/4 h-6 bg-gray-300 rounded flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-blue-500 rounded" />
            <div className="w-1 h-3 bg-blue-500 rounded" />
            <div className="w-1 h-3 bg-blue-500 rounded" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'small',
    name: 'Small',
    description: 'Tablet portrait (768px)',
    containerType: 'small',
    maxWidth: '768px',
    preview: (
      <div className="w-full h-8 flex items-center justify-center px-6">
        <div className="w-1/2 h-6 bg-gray-300 rounded flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-blue-500 rounded" />
            <div className="w-1 h-3 bg-blue-500 rounded" />
            <div className="w-1 h-3 bg-blue-500 rounded" />
          </div>
        </div>
      </div>
    ),
  }
];

export function SectionLayoutPicker({ isOpen, onClose, onSelect }: SectionLayoutPickerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add A Section
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Layout Options */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {sectionLayouts.map((layout) => (
              <button
                key={layout.id}
                onClick={() => {
                  onSelect(layout);
                  onClose();
                }}
                className={cn(
                  "p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg",
                  "hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20",
                  "hover:shadow-md hover:scale-[1.02]",
                  "transition-all duration-200 text-left group cursor-pointer"
                )}
              >
                {/* Preview */}
                <div className="mb-3 h-12 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 p-2">
                  {layout.preview}
                </div>
                
                {/* Label */}
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {layout.name}
                </div>
                
                {/* Description */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {layout.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
