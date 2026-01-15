"use client";



import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AlertElementProps {
  title?: string;
  message?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  showIcon?: boolean;
  actionText?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<AlertElementProps>) => void;
}

export function AlertElement({
  title = 'Alert Title',
  message = 'This is an alert message. You can customize this text.',
  variant = 'info',
  dismissible = true,
  showIcon = true,
  actionText,
  onAction,
  onDismiss,
  isEditing = false,
  onUpdate,
}: AlertElementProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  };

  const variantStyles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-900 dark:text-blue-100',
      icon: 'text-blue-600 dark:text-blue-400',
      button: 'text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-900 dark:text-green-100',
      icon: 'text-green-600 dark:text-green-400',
      button: 'text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-900 dark:text-yellow-100',
      icon: 'text-yellow-600 dark:text-yellow-400',
      button: 'text-yellow-700 hover:text-yellow-900 dark:text-yellow-300 dark:hover:text-yellow-100',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-900 dark:text-red-100',
      icon: 'text-red-600 dark:text-red-400',
      button: 'text-red-700 hover:text-red-900 dark:text-red-300 dark:hover:text-red-100',
    },
  };

  const Icon = icons[variant];
  const styles = variantStyles[variant];

  if (isEditing) {
    return (
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Alert Settings
          </h3>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Variant:</label>
          <select
            value={variant}
            onChange={(e) => onUpdate?.({ variant: e.target.value as any })}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          >
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdate?.({ title: e.target.value })}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Message:</label>
          <textarea
            value={message}
            onChange={(e) => onUpdate?.({ message: e.target.value })}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 min-h-[80px]"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Action Button Text (optional):</label>
          <input
            type="text"
            value={actionText || ''}
            onChange={(e) => onUpdate?.({ actionText: e.target.value })}
            placeholder="Leave empty for no button"
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showIcon}
              onChange={(e) => onUpdate?.({ showIcon: e.target.checked })}
              className="rounded"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">Show Icon</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dismissible}
              onChange={(e) => onUpdate?.({ dismissible: e.target.checked })}
              className="rounded"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">Dismissible</span>
          </label>
        </div>

      </div>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'rounded-lg border p-4',
            styles.bg,
            styles.border
          )}
        >
          <div className="flex gap-3">
            {/* Icon */}
            {showIcon && (
              <div className="flex-shrink-0">
                <Icon className={cn('w-5 h-5', styles.icon)} />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className={cn('text-sm font-semibold mb-1', styles.text)}>
                  {title}
                </h3>
              )}
              <p className={cn('text-sm', styles.text)}>
                {message}
              </p>

              {/* Action Button */}
              {actionText && (
                <Button
                  onClick={onAction}
                  variant="link"
                  size="sm"
                  className={cn('mt-2 px-0 h-auto', styles.button)}
                >
                  {actionText}
                </Button>
              )}
            </div>

            {/* Dismiss Button */}
            {dismissible && (
              <button
                onClick={handleDismiss}
                className={cn(
                  'flex-shrink-0 p-1 rounded-lg transition-colors',
                  'hover:bg-black/5 dark:hover:bg-white/5',
                  styles.text
                )}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper function for cn utility
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
