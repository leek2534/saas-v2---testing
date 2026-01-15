// Media toolbar utilities - stub implementation
// TODO: Migrate full implementation if needed

export type ToolbarAction = 'align-left' | 'align-center' | 'align-right' | 'crop' | 'link' | 'delete' | 'replace';

export function normalizeAlignment(alignment: string | { alignment?: string; align?: string } | undefined): 'left' | 'center' | 'right' {
  // Handle object with alignment/align property
  if (typeof alignment === 'object' && alignment !== null) {
    const alignValue = alignment.alignment || alignment.align;
    if (alignValue === 'left' || alignValue === 'center' || alignValue === 'right') {
      return alignValue;
    }
    return 'center';
  }
  
  // Handle string
  if (typeof alignment === 'string') {
    if (alignment === 'left' || alignment === 'center' || alignment === 'right') {
      return alignment;
    }
  }
  
  return 'center';
}

export interface ToolbarActionItem {
  action: ToolbarAction;
  label: string;
  active: boolean;
}

export function getToolbarActions(
  elementType: 'image' | 'gif' | 'video',
  currentAlignment: 'left' | 'center' | 'right',
  isClickable: boolean
): ToolbarActionItem[] {
  const actions: ToolbarActionItem[] = [
    {
      action: 'align-left',
      label: 'Align Left',
      active: currentAlignment === 'left',
    },
    {
      action: 'align-center',
      label: 'Align Center',
      active: currentAlignment === 'center',
    },
    {
      action: 'align-right',
      label: 'Align Right',
      active: currentAlignment === 'right',
    },
  ];

  if (elementType === 'image' || elementType === 'gif') {
    actions.push({
      action: 'crop',
      label: 'Crop',
      active: false,
    });
  }

  if (isClickable) {
    actions.push({
      action: 'link',
      label: 'Edit Link',
      active: false,
    });
  }

  actions.push({
    action: 'delete',
    label: 'Delete',
    active: false,
  });

  return actions;
}

export function handleToolbarAction(
  action: ToolbarAction,
  elementId: string,
  updateElement: (id: string, props: Record<string, any>) => void,
  deleteElement: (id: string) => void,
  callbacks: {
    onReplace?: () => void;
    onLink?: () => void;
    onCrop?: () => void;
  }
): void {
  switch (action) {
    case 'align-left':
      updateElement(elementId, { alignment: 'left' });
      break;
    case 'align-center':
      updateElement(elementId, { alignment: 'center' });
      break;
    case 'align-right':
      updateElement(elementId, { alignment: 'right' });
      break;
    case 'crop':
      callbacks.onCrop?.();
      break;
    case 'link':
      callbacks.onLink?.();
      break;
    case 'delete':
      deleteElement(elementId);
      break;
  }
}

/**
 * Get alignment classes for elements
 */
export function getAlignmentClasses(alignment: 'left' | 'center' | 'right'): string {
  switch (alignment) {
    case 'left':
      return 'ml-0 mr-auto';
    case 'right':
      return 'mr-0 ml-auto';
    case 'center':
      return 'mx-auto';
    default:
      return 'mx-auto';
  }
}

/**
 * Get margin classes for alignment
 */
export function getAlignmentMarginClasses(alignment: 'left' | 'center' | 'right'): string {
  switch (alignment) {
    case 'left':
      return 'ml-0 mr-auto';
    case 'right':
      return 'mr-0 ml-auto';
    case 'center':
      return 'mx-auto';
    default:
      return 'mx-auto';
  }
}





