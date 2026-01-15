"use client";



import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'branded';
}

export function LoadingScreen({ 
  message = 'Loading...', 
  fullScreen = false,
  size = 'md',
  variant = 'default'
}: LoadingScreenProps) {
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = cn(
    'flex flex-col items-center justify-center',
    fullScreen ? 'fixed inset-0 bg-white dark:bg-gray-900 z-50' : 'w-full h-full min-h-[200px]'
  );

  if (variant === 'minimal') {
    return (
      <div className={containerClasses}>
        <Loader2 className={cn(sizeClasses[size], 'animate-spin text-blue-600')} />
      </div>
    );
  }

  if (variant === 'branded') {
    return (
      <div className={containerClasses}>
        <div className="relative">
          {/* Animated gradient circle */}
          <div className="absolute inset-0 animate-spin">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl"></div>
          </div>
          
          {/* Center icon */}
          <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse opacity-10"></div>
            <Sparkles className="w-12 h-12 text-blue-600 animate-pulse" />
          </div>
        </div>
        
        <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">
          {message}
        </p>
        
        {/* Loading dots */}
        <div className="flex space-x-2 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={containerClasses}>
      <Loader2 className={cn(sizeClasses[size], 'animate-spin text-blue-600 mb-3')} />
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}

// Skeleton loader for content
export function SkeletonLoader({ 
  lines = 3, 
  className 
}: { 
  lines?: number; 
  className?: string;
}) {
  return (
    <div className={cn('space-y-3 animate-pulse', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
          style={{ width: `${100 - (i * 10)}%` }}
        ></div>
      ))}
    </div>
  );
}

// Card skeleton
export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Image grid skeleton
export function ImageGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
        ></div>
      ))}
    </div>
  );
}

// Spinner button (for inline loading states)
export function SpinnerButton({ 
  children, 
  isLoading, 
  ...props 
}: { 
  children: React.ReactNode; 
  isLoading: boolean;
  [key: string]: any;
}) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
}
