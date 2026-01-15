"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface UnifiedPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'gray' | 'orange' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50/50 dark:bg-blue-900/20',
    border: 'border-blue-300 dark:border-blue-700',
    iconBg: 'bg-blue-100 dark:bg-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    textColor: 'text-blue-700 dark:text-blue-300',
  },
  green: {
    bg: 'bg-green-50/50 dark:bg-green-900/20',
    border: 'border-green-300 dark:border-green-700',
    iconBg: 'bg-green-100 dark:bg-green-800',
    iconColor: 'text-green-600 dark:text-green-400',
    textColor: 'text-green-700 dark:text-green-300',
  },
  purple: {
    bg: 'bg-purple-50/50 dark:bg-purple-900/20',
    border: 'border-purple-300 dark:border-purple-700',
    iconBg: 'bg-purple-100 dark:bg-purple-800',
    iconColor: 'text-purple-600 dark:text-purple-400',
    textColor: 'text-purple-700 dark:text-purple-300',
  },
  gray: {
    bg: 'bg-gray-50/50 dark:bg-gray-900/20',
    border: 'border-gray-300 dark:border-gray-700',
    iconBg: 'bg-gray-100 dark:bg-gray-800',
    iconColor: 'text-gray-600 dark:text-gray-400',
    textColor: 'text-gray-700 dark:text-gray-300',
  },
  orange: {
    bg: 'bg-orange-50/50 dark:bg-orange-900/20',
    border: 'border-orange-300 dark:border-orange-700',
    iconBg: 'bg-orange-100 dark:bg-orange-800',
    iconColor: 'text-orange-600 dark:text-orange-400',
    textColor: 'text-orange-700 dark:text-orange-300',
  },
  pink: {
    bg: 'bg-pink-50/50 dark:bg-pink-900/20',
    border: 'border-pink-300 dark:border-pink-700',
    iconBg: 'bg-pink-100 dark:bg-pink-800',
    iconColor: 'text-pink-600 dark:text-pink-400',
    textColor: 'text-pink-700 dark:text-pink-300',
  },
};

const sizeMap = {
  sm: {
    container: 'min-h-[100px]',
    icon: 'w-8 h-8',
    iconSize: 16,
    title: 'text-xs',
    description: 'text-[10px]',
    spacing: 'mb-1.5',
  },
  md: {
    container: 'min-h-[150px]',
    icon: 'w-10 h-10',
    iconSize: 20,
    title: 'text-sm',
    description: 'text-xs',
    spacing: 'mb-2',
  },
  lg: {
    container: 'min-h-[200px]',
    icon: 'w-12 h-12',
    iconSize: 24,
    title: 'text-base',
    description: 'text-sm',
    spacing: 'mb-3',
  },
};

export function UnifiedPlaceholder({
  icon: Icon,
  title,
  description,
  color = 'gray',
  size = 'md',
  className,
}: UnifiedPlaceholderProps) {
  const colors = colorMap[color];
  const sizes = sizeMap[size];

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg flex items-center justify-center transition-all',
        colors.bg,
        colors.border,
        sizes.container,
        className
      )}
    >
      <div className="text-center px-4">
        <div
          className={cn(
            'mx-auto rounded-lg flex items-center justify-center',
            colors.iconBg,
            sizes.icon,
            sizes.spacing
          )}
        >
          <Icon size={sizes.iconSize} className={colors.iconColor} />
        </div>
        <p className={cn('font-medium', colors.textColor, sizes.title)}>
          {title}
        </p>
        {description && (
          <p className={cn('mt-1 opacity-75', colors.textColor, sizes.description)}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}





