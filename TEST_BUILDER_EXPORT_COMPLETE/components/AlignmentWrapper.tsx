

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  getAlignment, 
  getContainerAlignmentClass, 
  AlignmentWrapperProps 
} from '../utils/alignment';

/**
 * Universal Alignment Wrapper
 * Provides consistent alignment for all elements
 */
export function AlignmentWrapper({ 
  alignment, 
  align, 
  children, 
  className,
  style,
  ...props 
}: AlignmentWrapperProps & React.HTMLAttributes<HTMLDivElement>) {
  const effectiveAlignment = getAlignment({ alignment, align });
  
  // Clean alignment wrapper for non-text elements
  
  // Generate unique ID for this wrapper
  const wrapperId = `alignment-wrapper-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      <style>{`
        #${wrapperId} {
          display: flex !important;
          justify-content: ${effectiveAlignment === 'left' ? 'flex-start' : effectiveAlignment === 'right' ? 'flex-end' : 'center'} !important;
          width: 100% !important;
        }
      `}</style>
      <div 
        id={wrapperId}
        className={className}
        style={{
          width: '100%',
          ...style
        }}
        {...props}
      >
        {children}
      </div>
    </>
  );
}
