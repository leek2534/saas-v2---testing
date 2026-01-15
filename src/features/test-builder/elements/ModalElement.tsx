"use client";



import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ModalElementProps {
  title?: string;
  content?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'top' | 'bottom';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<ModalElementProps>) => void;
}

export function ModalElement({
  title = 'Modal Title',
  content = 'Add your modal content here...',
  size = 'md',
  position = 'center',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  primaryButtonText = 'Confirm',
  secondaryButtonText = 'Cancel',
  onPrimaryClick,
  onSecondaryClick,
  onClose,
  isOpen = false,
  isEditing = false,
  onUpdate,
}: ModalElementProps) {
  const [internalOpen, setInternalOpen] = useState(isOpen);

  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!closeOnEscape || !internalOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, internalOpen]);

  const handleClose = () => {
    setInternalOpen(false);
    onClose?.();
  };

  const handleOverlayClick = () => {
    if (closeOnOverlayClick && !isEditing) {
      handleClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  const positionClasses = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-20',
    bottom: 'items-end justify-center pb-20',
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: position === 'top' ? -20 : position === 'bottom' ? 20 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  // Preview mode when editing
  if (isEditing) {
    return (
      <div className="border-2 border-dashed border-blue-500 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Modal Settings
          </h3>
        </div>
        
        <div className="space-y-3 text-sm">
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-300">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => onUpdate?.({ title: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            />
          </div>
          
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-300">Content:</label>
            <textarea
              value={content}
              onChange={(e) => onUpdate?.({ content: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Size:</label>
              <select
                value={size}
                onChange={(e) => onUpdate?.({ size: e.target.value as any })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
                <option value="full">Full Width</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Position:</label>
              <select
                value={position}
                onChange={(e) => onUpdate?.({ position: e.target.value as any })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Primary Button:</label>
              <input
                type="text"
                value={primaryButtonText}
                onChange={(e) => onUpdate?.({ primaryButtonText: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Secondary Button:</label>
              <input
                type="text"
                value={secondaryButtonText}
                onChange={(e) => onUpdate?.({ secondaryButtonText: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showCloseButton}
                onChange={(e) => onUpdate?.({ showCloseButton: e.target.checked })}
                className="rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Show Close Button</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={closeOnOverlayClick}
                onChange={(e) => onUpdate?.({ closeOnOverlayClick: e.target.checked })}
                className="rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Close on Overlay Click</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {internalOpen && (
        <div className="fixed inset-0 z-50 flex" style={{ pointerEvents: 'auto' }}>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleOverlayClick}
          />

          {/* Modal Container */}
          <div className={cn('relative w-full flex', positionClasses[position])}>
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl',
                'border border-gray-200 dark:border-gray-700',
                'w-full',
                sizeClasses[size]
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h2>
                {showCloseButton && (
                  <button
                    onClick={handleClose}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  {content}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => {
                    onSecondaryClick?.();
                    handleClose();
                  }}
                  variant="outline"
                >
                  {secondaryButtonText}
                </Button>
                <Button
                  onClick={() => {
                    onPrimaryClick?.();
                    handleClose();
                  }}
                >
                  {primaryButtonText}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Helper function for cn utility
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
