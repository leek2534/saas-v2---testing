"use client";



import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Type, Image, Video, Square, Layout, List, 
  Star, Calendar, MessageSquare, Code, Zap, Download,
  Monitor, Tablet, Smartphone, Save, Undo2, Redo2,
  Copy, Trash2, Eye, Settings, FileText, Palette
} from 'lucide-react';
import { useTestBuilderV2Store } from './store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'element' | 'view' | 'edit' | 'export' | 'template';
  keywords: string[];
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const {
    addElement,
    setViewport,
    undo,
    redo,
    canUndo,
    canRedo,
    setZoom,
    setViewMode,
    selectedSectionId,
    selectedRowId,
    selectedColumnId
  } = useTestBuilderV2Store();

  // Define all commands
  const commands: Command[] = [
    // Elements
    {
      id: 'add-heading',
      label: 'Add Heading',
      description: 'Add a heading element',
      icon: <Type className="w-4 h-4" />,
      action: () => {
        if (!selectedSectionId || !selectedRowId || !selectedColumnId) {
          toast.error('Please select a column first');
          return;
        }
        addElement(selectedSectionId, selectedRowId, selectedColumnId, 'heading');
        toast.success('Heading added');
        onClose();
      },
      category: 'element',
      keywords: ['heading', 'title', 'h1', 'h2', 'text'],
    },
    {
      id: 'add-text',
      label: 'Add Text',
      description: 'Add a text paragraph',
      icon: <FileText className="w-4 h-4" />,
      action: () => {
        if (!selectedSectionId || !selectedRowId || !selectedColumnId) {
          toast.error('Please select a column first');
          return;
        }
        addElement(selectedSectionId, selectedRowId, selectedColumnId, 'text');
        toast.success('Text added');
        onClose();
      },
      category: 'element',
      keywords: ['text', 'paragraph', 'content', 'copy'],
    },
    {
      id: 'add-button',
      label: 'Add Button',
      description: 'Add a button element',
      icon: <Square className="w-4 h-4" />,
      action: () => {
        if (!selectedSectionId || !selectedRowId || !selectedColumnId) {
          toast.error('Please select a column first');
          return;
        }
        addElement(selectedSectionId, selectedRowId, selectedColumnId, 'button');
        toast.success('Button added');
        onClose();
      },
      category: 'element',
      keywords: ['button', 'cta', 'click', 'action'],
    },
    {
      id: 'add-image',
      label: 'Add Image',
      description: 'Add an image element',
      icon: <Image className="w-4 h-4" />,
      action: () => {
        if (!selectedSectionId || !selectedRowId || !selectedColumnId) {
          toast.error('Please select a column first');
          return;
        }
        addElement(selectedSectionId, selectedRowId, selectedColumnId, 'image');
        toast.success('Image added');
        onClose();
      },
      category: 'element',
      keywords: ['image', 'picture', 'photo', 'img'],
    },
    {
      id: 'add-video',
      label: 'Add Video',
      description: 'Add a video element',
      icon: <Video className="w-4 h-4" />,
      action: () => {
        if (!selectedSectionId || !selectedRowId || !selectedColumnId) {
          toast.error('Please select a column first');
          return;
        }
        addElement(selectedSectionId, selectedRowId, selectedColumnId, 'video');
        toast.success('Video added');
        onClose();
      },
      category: 'element',
      keywords: ['video', 'youtube', 'vimeo', 'media'],
    },
    {
      id: 'add-form',
      label: 'Add Form',
      description: 'Add a form element',
      icon: <Layout className="w-4 h-4" />,
      action: () => {
        if (!selectedSectionId || !selectedRowId || !selectedColumnId) {
          toast.error('Please select a column first');
          return;
        }
        addElement(selectedSectionId, selectedRowId, selectedColumnId, 'form');
        toast.success('Form added');
        onClose();
      },
      category: 'element',
      keywords: ['form', 'input', 'contact', 'lead'],
    },
    {
      id: 'add-countdown',
      label: 'Add Countdown',
      description: 'Add a countdown timer',
      icon: <Calendar className="w-4 h-4" />,
      action: () => {
        if (!selectedSectionId || !selectedRowId || !selectedColumnId) {
          toast.error('Please select a column first');
          return;
        }
        addElement(selectedSectionId, selectedRowId, selectedColumnId, 'countdown');
        toast.success('Countdown added');
        onClose();
      },
      category: 'element',
      keywords: ['countdown', 'timer', 'clock', 'urgency'],
    },
    {
      id: 'add-testimonial',
      label: 'Add Testimonial',
      description: 'Add a testimonial element',
      icon: <MessageSquare className="w-4 h-4" />,
      action: () => {
        if (!selectedSectionId || !selectedRowId || !selectedColumnId) {
          toast.error('Please select a column first');
          return;
        }
        addElement(selectedSectionId, selectedRowId, selectedColumnId, 'testimonial');
        toast.success('Testimonial added');
        onClose();
      },
      category: 'element',
      keywords: ['testimonial', 'review', 'quote', 'social proof'],
    },
    {
      id: 'add-pricing',
      label: 'Add Pricing',
      description: 'Add a pricing table',
      icon: <List className="w-4 h-4" />,
      action: () => {
        if (!selectedSectionId || !selectedRowId || !selectedColumnId) {
          toast.error('Please select a column first');
          return;
        }
        addElement(selectedSectionId, selectedRowId, selectedColumnId, 'pricing');
        toast.success('Pricing added');
        onClose();
      },
      category: 'element',
      keywords: ['pricing', 'price', 'table', 'plan'],
    },
    {
      id: 'add-icon',
      label: 'Add Icon',
      description: 'Add an icon element',
      icon: <Star className="w-4 h-4" />,
      action: () => {
        if (!selectedSectionId || !selectedRowId || !selectedColumnId) {
          toast.error('Please select a column first');
          return;
        }
        addElement(selectedSectionId, selectedRowId, selectedColumnId, 'icon');
        toast.success('Icon added');
        onClose();
      },
      category: 'element',
      keywords: ['icon', 'symbol', 'graphic'],
    },
    
    // View commands
    {
      id: 'view-desktop',
      label: 'Desktop View',
      description: 'Switch to desktop viewport',
      icon: <Monitor className="w-4 h-4" />,
      action: () => {
        setViewport('desktop');
        toast.success('Switched to desktop view');
        onClose();
      },
      category: 'view',
      keywords: ['desktop', 'view', 'viewport', 'screen'],
      shortcut: '⌘1',
    },
    {
      id: 'view-tablet',
      label: 'Tablet View',
      description: 'Switch to tablet viewport',
      icon: <Tablet className="w-4 h-4" />,
      action: () => {
        setViewport('tablet');
        toast.success('Switched to tablet view');
        onClose();
      },
      category: 'view',
      keywords: ['tablet', 'ipad', 'view', 'viewport'],
      shortcut: '⌘2',
    },
    {
      id: 'view-mobile',
      label: 'Mobile View',
      description: 'Switch to mobile viewport',
      icon: <Smartphone className="w-4 h-4" />,
      action: () => {
        setViewport('mobile');
        toast.success('Switched to mobile view');
        onClose();
      },
      category: 'view',
      keywords: ['mobile', 'phone', 'view', 'viewport'],
      shortcut: '⌘3',
    },
    {
      id: 'zoom-reset',
      label: 'Reset Zoom',
      description: 'Reset zoom to 100%',
      icon: <Eye className="w-4 h-4" />,
      action: () => {
        setZoom(100);
        toast.success('Zoom reset to 100%');
        onClose();
      },
      category: 'view',
      keywords: ['zoom', 'reset', '100%'],
      shortcut: '⌘0',
    },
    {
      id: 'preview-mode',
      label: 'Preview Mode',
      description: 'Toggle preview mode',
      icon: <Eye className="w-4 h-4" />,
      action: () => {
        setViewMode('preview');
        toast.success('Preview mode enabled');
        onClose();
      },
      category: 'view',
      keywords: ['preview', 'view', 'mode'],
      shortcut: '⌘P',
    },
    
    // Edit commands
    {
      id: 'undo',
      label: 'Undo',
      description: 'Undo last action',
      icon: <Undo2 className="w-4 h-4" />,
      action: () => {
        if (canUndo()) {
          undo();
          toast.success('Undone');
        } else {
          toast.error('Nothing to undo');
        }
        onClose();
      },
      category: 'edit',
      keywords: ['undo', 'revert', 'back'],
      shortcut: '⌘Z',
    },
    {
      id: 'redo',
      label: 'Redo',
      description: 'Redo last action',
      icon: <Redo2 className="w-4 h-4" />,
      action: () => {
        if (canRedo()) {
          redo();
          toast.success('Redone');
        } else {
          toast.error('Nothing to redo');
        }
        onClose();
      },
      category: 'edit',
      keywords: ['redo', 'forward', 'again'],
      shortcut: '⌘⇧Z',
    },
    
    // Export commands
    {
      id: 'save',
      label: 'Save Page',
      description: 'Save current page',
      icon: <Save className="w-4 h-4" />,
      action: () => {
        toast.success('Page saved!');
        onClose();
      },
      category: 'export',
      keywords: ['save', 'store', 'persist'],
      shortcut: '⌘S',
    },
    {
      id: 'export-html',
      label: 'Export HTML',
      description: 'Export page as HTML',
      icon: <Code className="w-4 h-4" />,
      action: () => {
        toast.info('HTML export coming soon!');
        onClose();
      },
      category: 'export',
      keywords: ['export', 'html', 'code', 'download'],
    },
    {
      id: 'export-json',
      label: 'Export JSON',
      description: 'Export page as JSON',
      icon: <Download className="w-4 h-4" />,
      action: () => {
        toast.info('JSON export coming soon!');
        onClose();
      },
      category: 'export',
      keywords: ['export', 'json', 'data', 'download'],
    },
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter(command => {
    const searchLower = search.toLowerCase();
    return (
      command.label.toLowerCase().includes(searchLower) ||
      command.description?.toLowerCase().includes(searchLower) ||
      command.keywords.some(keyword => keyword.includes(searchLower))
    );
  });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const categoryLabels: Record<string, string> = {
    element: 'Add Elements',
    view: 'View Options',
    edit: 'Edit Actions',
    export: 'Export & Save',
    template: 'Templates',
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center pt-[20vh]"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commands..."
              className="flex-1 bg-transparent border-none outline-none text-base text-gray-900 dark:text-gray-100 placeholder-gray-400"
              autoFocus
            />
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 rounded">
              ESC
            </kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-[60vh] overflow-y-auto">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                No commands found
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                <div key={category} className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {categoryLabels[category]}
                  </div>
                  {categoryCommands.map((command, index) => {
                    const globalIndex = filteredCommands.indexOf(command);
                    const isSelected = globalIndex === selectedIndex;
                    
                    return (
                      <button
                        key={command.id}
                        onClick={command.action}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                      >
                        <div className={cn(
                          'flex items-center justify-center w-8 h-8 rounded-md',
                          isSelected
                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        )}>
                          {command.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {command.label}
                          </div>
                          {command.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {command.description}
                            </div>
                          )}
                        </div>
                        {command.shortcut && (
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 rounded">
                            {command.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded">↵</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded">ESC</kbd>
                Close
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {filteredCommands.length} commands
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
