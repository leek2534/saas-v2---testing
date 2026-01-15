"use client";



import React, { useMemo, useCallback } from 'react';
import { useTestBuilderV2Store, ElementType } from './store';
import { ContextIndicator } from './ContextIndicator';
import { 
  Type, Heading, AlignLeft, MousePointer, Image, Video, FileText, 
  Clock, MessageSquare, DollarSign, Star, Minus, List, HelpCircle, Users, TrendingUp,
  Shield, Zap, GitCompare, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

// CONTENT ELEMENTS
const CONTENT_ELEMENTS: Array<{ type: ElementType; icon: any; label: string; description: string }> = [
  { type: 'heading', icon: Type, label: 'Heading', description: 'Title or headline' },
  { type: 'subheading', icon: Type, label: 'Subheading', description: 'Subtitle' },
  { type: 'text', icon: AlignLeft, label: 'Text', description: 'Paragraph text' },
  { type: 'button', icon: MousePointer, label: 'Button', description: 'Call-to-action' },
  { type: 'image', icon: Image, label: 'Image', description: 'Picture or graphic' },
  { type: 'video', icon: Video, label: 'Video', description: 'Video player' },
  { type: 'form', icon: FileText, label: 'Form', description: 'Lead capture form' },
];

// CONVERSION ELEMENTS
const CONVERSION_ELEMENTS: Array<{ type: ElementType; icon: any; label: string; description: string }> = [
  { type: 'countdown', icon: Clock, label: 'Countdown', description: 'Urgency timer' },
  { type: 'testimonial', icon: MessageSquare, label: 'Testimonial', description: 'Customer review' },
  { type: 'pricing', icon: DollarSign, label: 'Pricing', description: 'Price card' },
  { type: 'socialproof', icon: Users, label: 'Social Proof', description: 'Trust indicators' },
  { type: 'progress', icon: TrendingUp, label: 'Progress', description: 'Progress bar' },
  { type: 'list', icon: List, label: 'List', description: 'Bullet points' },
  { type: 'faq', icon: HelpCircle, label: 'FAQ', description: 'Q&A section' },
  { type: 'guarantee', icon: Shield, label: 'Guarantee', description: 'Trust badge' },
  { type: 'feature-box', icon: Zap, label: 'Feature Box', description: 'Icon + text' },
  { type: 'comparison', icon: GitCompare, label: 'Comparison', description: 'Us vs them' },
  { type: 'star-rating', icon: Award, label: 'Star Rating', description: 'Review stars' },
];

// UTILITY ELEMENTS
const UTILITY_ELEMENTS: Array<{ type: ElementType; icon: any; label: string; description: string }> = [
  { type: 'spacer', icon: Minus, label: 'Spacer', description: 'Vertical space' },
  { type: 'divider', icon: Minus, label: 'Divider', description: 'Horizontal line' },
  { type: 'icon', icon: Star, label: 'Icon', description: 'Icon element' },
];

export const TestBuilderV2Sidebar = React.memo(function TestBuilderV2Sidebar() {
  const { selectedSectionId, selectedRowId, selectedColumnId, addElement } = useTestBuilderV2Store();
  const [activeTab, setActiveTab] = React.useState<'content' | 'conversion' | 'utility'>('content');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize canAddElements to prevent recalculation
  const canAddElements = useMemo(
    () => !!(selectedSectionId && selectedRowId && selectedColumnId),
    [selectedSectionId, selectedRowId, selectedColumnId]
  );

  // Memoize handleAddElement with useCallback
  const handleAddElement = useCallback((type: ElementType) => {
    if (!selectedSectionId || !selectedRowId || !selectedColumnId) {
      alert('Please select a column first by clicking on it in the canvas.');
      return;
    }

    addElement(selectedSectionId, selectedRowId, selectedColumnId, type);
  }, [selectedSectionId, selectedRowId, selectedColumnId, addElement]);
  
  // console.log('Sidebar render', { canAddElements, selectedSectionId, selectedRowId, selectedColumnId });

  if (!mounted) {
    return (
      <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  // Memoize renderElementButton to prevent recreating on every render
  const renderElementButton = useCallback((element: { type: ElementType; icon: any; label: string; description: string }) => {
    const Icon = element.icon;
    return (
      <button
        key={element.type}
        onClick={() => handleAddElement(element.type)}
        disabled={!canAddElements}
        className={cn(
          'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
          canAddElements
            ? 'border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer'
            : 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
        )}
      >
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          canAddElements
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
        )}>
          <Icon size={20} />
        </div>
        <div className="font-medium text-xs text-center text-gray-900 dark:text-white">
          {element.label}
        </div>
      </button>
    );
  }, [canAddElements, handleAddElement]);

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Context Indicator */}
      <ContextIndicator />

      {/* Elements Library */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Elements</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {canAddElements 
              ? 'Click to add elements to the selected column'
              : 'Select a column to add elements'
            }
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('content')}
            className={cn(
              'px-3 py-2 text-xs font-medium transition-colors',
              activeTab === 'content'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('conversion')}
            className={cn(
              'px-3 py-2 text-xs font-medium transition-colors',
              activeTab === 'conversion'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Conversion
          </button>
          <button
            onClick={() => setActiveTab('utility')}
            className={cn(
              'px-3 py-2 text-xs font-medium transition-colors',
              activeTab === 'utility'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Utility
          </button>
        </div>

        {/* Elements Grid */}
        <div className="grid grid-cols-2 gap-2">
          {activeTab === 'content' && CONTENT_ELEMENTS.map(renderElementButton)}
          {activeTab === 'conversion' && CONVERSION_ELEMENTS.map(renderElementButton)}
          {activeTab === 'utility' && UTILITY_ELEMENTS.map(renderElementButton)}
        </div>

        {/* Help Text */}
        {!canAddElements && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              How to add elements:
            </h4>
            <ol className="text-xs text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside">
              <li>Add a section to the canvas</li>
              <li>Add a row to the section</li>
              <li>Click on a column in the row</li>
              <li>Click any element to add it</li>
            </ol>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Section</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Row</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Column</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Element</span>
          </div>
        </div>
      </div>
    </div>
  );
});
