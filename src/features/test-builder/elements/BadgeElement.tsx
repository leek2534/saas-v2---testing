"use client";



import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, Zap, Crown, Heart, Shield, Award } from 'lucide-react';

export interface BadgeElementProps {
  text?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  icon?: 'star' | 'zap' | 'crown' | 'heart' | 'shield' | 'award' | 'none';
  iconPosition?: 'left' | 'right';
  removable?: boolean;
  onRemove?: () => void;
  animated?: boolean;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<BadgeElementProps>) => void;
}

export function BadgeElement({
  text = 'Badge',
  variant = 'default',
  size = 'md',
  rounded = 'md',
  icon = 'none',
  iconPosition = 'left',
  removable = false,
  onRemove,
  animated = false,
  isEditing = false,
  onUpdate,
}: BadgeElementProps) {
  const icons = {
    star: Star,
    zap: Zap,
    crown: Crown,
    heart: Heart,
    shield: Shield,
    award: Award,
    none: null,
  };

  const variantStyles = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    info: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const Icon = icon !== 'none' ? icons[icon] : null;

  if (isEditing) {
    return (
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3 inline-block min-w-[300px]">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Badge Settings
        </h3>

        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Text:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => onUpdate?.({ text: e.target.value })}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Variant:</label>
            <select
              value={variant}
              onChange={(e) => onUpdate?.({ variant: e.target.value as any })}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="default">Default</option>
              <option value="primary">Primary</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="info">Info</option>
              <option value="purple">Purple</option>
              <option value="pink">Pink</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Size:</label>
            <select
              value={size}
              onChange={(e) => onUpdate?.({ size: e.target.value as any })}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Rounded:</label>
            <select
              value={rounded}
              onChange={(e) => onUpdate?.({ rounded: e.target.value as any })}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="full">Full (Pill)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Icon:</label>
            <select
              value={icon}
              onChange={(e) => onUpdate?.({ icon: e.target.value as any })}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="none">None</option>
              <option value="star">Star</option>
              <option value="zap">Zap</option>
              <option value="crown">Crown</option>
              <option value="heart">Heart</option>
              <option value="shield">Shield</option>
              <option value="award">Award</option>
            </select>
          </div>
        </div>

        {icon !== 'none' && (
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Icon Position:</label>
            <select
              value={iconPosition}
              onChange={(e) => onUpdate?.({ iconPosition: e.target.value as any })}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
        )}

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={removable}
              onChange={(e) => onUpdate?.({ removable: e.target.checked })}
              className="rounded"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">Removable</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={animated}
              onChange={(e) => onUpdate?.({ animated: e.target.checked })}
              className="rounded"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">Animated</span>
          </label>
        </div>

      </div>
    );
  }

  const BadgeContent = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border transition-all',
        variantStyles[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        animated && 'hover:scale-105 active:scale-95'
      )}
    >
      {Icon && iconPosition === 'left' && <Icon className={iconSizes[size]} />}
      {text}
      {Icon && iconPosition === 'right' && <Icon className={iconSizes[size]} />}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
        >
          <X className={iconSizes[size]} />
        </button>
      )}
    </span>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block"
      >
        {BadgeContent}
      </motion.div>
    );
  }

  return BadgeContent;
}

// Helper function for cn utility
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
