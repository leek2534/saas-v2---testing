/**
 * Universal Alignment System
 * Provides consistent alignment functionality for all elements
 */

export type AlignmentValue = 'left' | 'center' | 'right' | 'justify';

export interface AlignmentProps {
  alignment?: AlignmentValue;
  align?: AlignmentValue; // Backward compatibility
}

/**
 * Get the effective alignment value with backward compatibility
 */
export function getAlignment(props: AlignmentProps, defaultAlignment: AlignmentValue = 'center'): AlignmentValue {
  return props.alignment || props.align || defaultAlignment;
}

/**
 * Get container alignment classes for flex containers
 */
export function getContainerAlignmentClass(alignment: AlignmentValue): string {
  switch (alignment) {
    case 'left':
      return 'flex !justify-start';
    case 'right':
      return 'flex !justify-end';
    case 'center':
      return 'flex !justify-center';
    case 'justify':
      return 'flex !justify-center'; // Justify behaves like center for containers
    default:
      return 'flex !justify-center';
  }
}

/**
 * Get text alignment CSS value for text elements
 */
export function getTextAlignmentStyle(alignment: AlignmentValue): string {
  switch (alignment) {
    case 'left':
      return 'left';
    case 'right':
      return 'right';
    case 'center':
      return 'center';
    case 'justify':
      return 'justify';
    default:
      return 'center';
  }
}

/**
 * Get alignment classes for block elements (dividers, progress bars, etc.)
 */
export function getBlockAlignmentClass(alignment: AlignmentValue): string {
  switch (alignment) {
    case 'left':
      return 'mr-auto';
    case 'right':
      return 'ml-auto';
    case 'center':
      return 'mx-auto';
    case 'justify':
      return 'mx-auto'; // Justify behaves like center for blocks
    default:
      return 'mx-auto';
  }
}

/**
 * Universal alignment wrapper component props
 */
export interface AlignmentWrapperProps {
  alignment?: AlignmentValue;
  align?: AlignmentValue; // Backward compatibility
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Check if alignment should use container wrapper vs inline styles
 */
export function shouldUseContainerAlignment(elementType: string): boolean {
  // Elements that benefit from container alignment
  const containerAlignedElements = [
    'text', 'heading', 'subheading', 'button', 
    'image', 'video', 'gif', 'icon', 'countdown'
  ];
  
  return containerAlignedElements.includes(elementType);
}

/**
 * Check if alignment should use block alignment (margin-based)
 */
export function shouldUseBlockAlignment(elementType: string): boolean {
  // Elements that use block-level alignment
  const blockAlignedElements = [
    'divider', 'progress', 'spacer'
  ];
  
  return blockAlignedElements.includes(elementType);
}
