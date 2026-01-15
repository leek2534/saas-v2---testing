import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { defaultLogoShowcaseSettings } from './elements/logo-showcase/types';
import { sampleLogos } from './elements/logo-showcase/utils';

// Element types
export type ElementType = 
  | 'heading' | 'subheading' | 'text' | 'button' | 'image' | 'video' | 'gif' | 'form' 
  | 'countdown' | 'testimonial' | 'pricing' | 'socialproof' | 'progress' | 'list' | 'faq'
  | 'spacer' | 'divider' | 'icon'
  | 'accordion' | 'tabs' | 'modal' | 'alert' | 'badge'
  | 'container' | 'card' | 'social-proof' | 'logo-showcase'
  | 'guarantee' | 'feature-box' | 'comparison' | 'star-rating'
  // HyperUI Components
  | 'announcement' | 'contact-form' | 'cta-block' | 'newsletter' | 'header-block'
  | 'feature-grid' | 'button-group' | 'logo-cloud' | 'banner' | 'poll'
  | 'team-section' | 'steps' | 'product-collection';

// Funnel step types
export type StepType = 
  | 'landing'      // Landing page
  | 'optin'        // Opt-in / Lead capture
  | 'sales'        // Sales page
  | 'upsell'       // Upsell offer
  | 'downsell'     // Downsell offer
  | 'thankyou'     // Thank you page
  | 'webinar'      // Webinar registration
  | 'checkout';    // Checkout page

// Funnel step (represents one page in the funnel)
export interface FunnelStep {
  id: string;
  name: string;
  type: StepType;
  order: number;
  sections: Section[]; // Page content
  thumbnail?: string; // Auto-generated preview
  createdAt: Date;
  updatedAt: Date;
}

// Complete funnel
export interface Funnel {
  id: string;
  name: string;
  steps: FunnelStep[];
  createdAt: Date;
  updatedAt: Date;
}

// Base element that goes inside columns
export interface Element {
  id: string;
  type: ElementType;
  name?: string; // Optional custom name for element
  props: Record<string, any>;
}

// Column within a row - STRUCTURAL ONLY, INVISIBLE
export interface Column {
  id: string;
  name?: string; // Optional custom name for column
  ratio: number; // Fractional unit ratio (e.g., 1, 2, 3) - SOURCE OF TRUTH for width
  elements: Element[];
  minRatio?: number; // Minimum ratio constraint (default: 0.5)
  verticalAlign?: 'start' | 'center' | 'end' | 'stretch';
  horizontalAlign?: 'start' | 'center' | 'end'; // Horizontal alignment of content within column
  // NO VISUAL PROPERTIES - Column is invisible
  // No backgroundColor, backgroundGradient, padding, borders
}

// Row with nested columns
export interface Row {
  id: string;
  name: string; // Auto: "Row 1", "Row 2" or custom
  columns: Column[];
  backgroundColor?: string;
  backgroundGradient?: {
    type: 'linear' | 'radial';
    angle: number;
    stops: Array<{ color: string; position: number }>;
  };
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  gap?: number;
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  width?: number; // Row width percentage (30-100%)
  rowAlignment?: 'left' | 'center' | 'right'; // Horizontal alignment of row
}

// Section containing rows
export interface Section {
  id: string;
  name: string; // Auto: "Section 1", "Section 2" or custom
  rows: Row[];
  props: {
    backgroundColor?: string;
    backgroundGradient?: {
      type: 'linear' | 'radial';
      angle: number;
      stops: Array<{ color: string; position: number }>;
    };
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundVideo?: string;
    backgroundVideoSettings?: {
      autoplay: boolean;
      loop: boolean;
      muted: boolean;
      playbackSpeed: number;
    };
    backgroundOverlay?: {
      enabled: boolean;
      color: string;
      opacity: number;
    };
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    containerType?: 'full-width' | 'wide' | 'standard' | 'medium' | 'small' | 'container' | 'narrow';
    maxWidth?: string;
    minHeight?: number;
  };
}

// Popup configuration
export interface PopupConfig {
  enabled: boolean;
  trigger: 'exit' | 'pageLoad' | 'elementVisible' | 'delay';
  elementId?: string; // For 'elementVisible' trigger
  delay?: {
    value: number;
    unit: 'seconds' | 'minutes';
  };
  backdrop: {
    color: string;
    opacity: number;
  };
  padding: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  size: {
    width: number; // percentage
    maxWidth: number; // pixels
  };
  position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  background: {
    type: 'color' | 'image' | 'gradient' | 'video';
    color?: string;
    image?: string;
    imageStyle?: 'cover' | 'contain' | 'parallax';
    imageFit?: string;
    video?: string;
    gradient?: {
      type: 'linear' | 'radial';
      angle: number;
      colors: Array<{ color: string; position: number }>;
    };
  };
  border: {
    enabled: boolean;
    width: number;
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
  };
  shadow: {
    enabled: boolean;
    x: number;
    y: number;
    blur: number;
    color: string;
  };
  corners: {
    radius: number; // 0-50 (0 = square, 50 = circle)
  };
  sections: Section[]; // Popup has its own sections/rows/columns structure
}

interface TestBuilderV2State {
  // Funnel management
  funnel: Funnel;
  currentStepId: string;
  
  // Current page content (loaded from current step)
  sections: Section[];
  selectedSectionId: string | null;
  selectedRowId: string | null;
  selectedColumnId: string | null;
  selectedElementId: string | null;
  editingElementId: string | null; // Track which element is currently being edited
  hoveredType: 'section' | 'row' | 'column' | 'element' | null;
  hoveredId: string | null;
  isResizing: boolean;
  popup: PopupConfig;
  history: Section[][];
  historyIndex: number;
  
  // Save state
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  
  // Puck-inspired features
  zoom: number; // 0.25 to 1.5 (25% to 150%)
  viewport: 'mobile' | 'tablet' | 'desktop'; // Responsive preview
  viewMode: 'edit' | 'preview'; // Edit or preview mode
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  rightSidebarExpanded: boolean; // For expanded preset browser
  
  // Funnel step management
  addStep: (type: StepType, name?: string) => void;
  deleteStep: (stepId: string) => void;
  duplicateStep: (stepId: string) => void;
  renameStep: (stepId: string, name: string) => void;
  reorderStep: (stepId: string, newOrder: number) => void;
  switchToStep: (stepId: string) => void;
  getCurrentStep: () => FunnelStep | undefined;
  
  // Actions
  addSection: (config?: { containerType?: string; maxWidth?: string; rows?: any[] }) => void;
  deleteSection: (sectionId: string) => void;
  renameSection: (sectionId: string, name: string) => void;
  moveSection: (sectionId: string, direction: 'up' | 'down') => void;
  duplicateSection: (sectionId: string) => void;
  
    addRow: (sectionId: string, columnCount: 1 | 2 | 3 | 4 | 5 | 6, columnWidths?: number[]) => void;
  deleteRow: (sectionId: string, rowId: string) => void;
  renameRow: (sectionId: string, rowId: string, name: string) => void;
  moveRow: (sectionId: string, rowId: string, direction: 'up' | 'down') => void;
  
  addColumn: (sectionId: string, rowId: string, width?: number, position?: 'start' | 'end' | number) => void;
  deleteColumn: (sectionId: string, rowId: string, columnId: string) => void;
  renameColumn: (sectionId: string, rowId: string, columnId: string, name: string) => void;
  resizeColumn: (sectionId: string, rowId: string, columnId: string, width: number) => void;
  equalizeColumns: (sectionId: string, rowId: string) => void;
  moveColumn: (sectionId: string, rowId: string, columnId: string, targetSectionId: string, targetRowId: string, targetIndex: number) => void;
  
  addElement: (sectionId: string, rowId: string, columnId: string, type: ElementType, index?: number) => void;
  updateElement: (elementId: string, props: Record<string, any>) => void;
  renameElement: (elementId: string, name: string) => void;
  deleteElement: (elementId: string) => void;
  moveElement: (elementId: string, targetSectionId: string, targetRowId: string, targetColumnId: string, targetIndex: number) => void;
  
  selectSection: (sectionId: string | null) => void;
  selectRow: (rowId: string | null) => void;
  selectColumn: (columnId: string | null) => void;
  selectElement: (elementId: string | null) => void;
  setEditingElement: (elementId: string | null) => void; // Set which element is being edited
  
  setHover: (type: 'section' | 'row' | 'column' | 'element' | null, id: string | null) => void;
  setIsResizing: (isResizing: boolean) => void;
  
  updatePopup: (config: Partial<PopupConfig>) => void;
  addPopupSection: () => void;
  deletePopupSection: (sectionId: string) => void;
  addPopupRow: (sectionId: string, columnCount: 1 | 2 | 3 | 4 | 5 | 6) => void;
  addPopupElement: (sectionId: string, rowId: string, columnId: string, type: ElementType) => void;
  
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Save actions
  saveFunnel: () => Promise<void>;
  loadFunnel: (funnelId: string) => Promise<void>;
  renameFunnel: (name: string) => void;
  exportFunnel: () => void;
  importFunnel: (file: File) => Promise<void>;
  markAsUnsaved: () => void;
  markAsSaved: () => void;
  
  // Template actions
  loadTemplate: (sections: Section[]) => void;
  
  // Puck-inspired actions
  setZoom: (zoom: number) => void;
  setViewport: (viewport: 'mobile' | 'tablet' | 'desktop') => void;
  setViewMode: (mode: 'edit' | 'preview') => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setRightSidebarExpanded: (expanded: boolean) => void;
  
  // Sidebar tab control
  sidebarActiveTab: string;
  setSidebarActiveTab: (tab: string) => void;
  
  // Clipboard actions
  clipboard: Element | null;
  duplicateElement: (elementId: string) => void;
  moveElementUp: (elementId: string) => void;
  moveElementDown: (elementId: string) => void;
  moveColumnUp: (sectionId: string, rowId: string, columnId: string) => void;
  moveColumnDown: (sectionId: string, rowId: string, columnId: string) => void;
  copyElement: (elementId: string) => void;
  cutElement: (elementId: string) => void;
  pasteElement: () => void;
}

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Enhanced history management helper
 * Limits history to 50 states (like OpenFunnels)
 * Prevents memory issues with large histories
 */
const addToHistory = (currentHistory: Section[][], currentIndex: number, newSections: Section[]): {
  history: Section[][];
  historyIndex: number;
} => {
  // Slice history up to current index and add new state
  const newHistory = currentHistory.slice(0, currentIndex + 1);
  newHistory.push(newSections);
  
  // Limit to last 50 states (like OpenFunnels)
  const limitedHistory = newHistory.slice(-50);
  const newIndex = Math.min(limitedHistory.length - 1, 49);
  
  return {
    history: limitedHistory,
    historyIndex: newIndex,
  };
};

const defaultPopupConfig: PopupConfig = {
  enabled: false,
  trigger: 'exit',
  delay: { value: 5, unit: 'seconds' },
  backdrop: { color: '#000000', opacity: 50 },
  padding: { left: 20, right: 20, top: 20, bottom: 20 },
  size: { width: 80, maxWidth: 600 },
  position: 'center',
  background: { 
    type: 'color',
    color: '#ffffff',
    gradient: {
      type: 'linear',
      angle: 180,
      colors: [
        { color: '#ffffff', position: 0 },
        { color: '#f3f4f6', position: 100 }
      ]
    }
  },
  border: { enabled: false, width: 1, color: '#e5e7eb', style: 'solid' },
  shadow: { enabled: true, x: 0, y: 10, blur: 30, color: 'rgba(0,0,0,0.1)' },
  corners: { radius: 8 },
  sections: [],
};

// Create initial funnel with one landing page step
const createInitialFunnel = (): Funnel => {
  const now = new Date();
  const stepId = generateId('step');
  return {
    id: generateId('funnel'),
    name: 'My Funnel',
    steps: [
      {
        id: stepId,
        name: 'Landing Page',
        type: 'landing',
        order: 0,
        sections: [],
        createdAt: now,
        updatedAt: now,
      }
    ],
    createdAt: now,
    updatedAt: now,
  };
};

export const useTestBuilderV2Store = create<TestBuilderV2State>()(
  devtools((set, get) => {
    const initialFunnel = createInitialFunnel();
    return {
      // Funnel state
      funnel: initialFunnel,
      currentStepId: initialFunnel.steps[0].id,
      
      // Current page content
      sections: [],
      selectedSectionId: null,
      selectedRowId: null,
      selectedColumnId: null,
      selectedElementId: null,
      editingElementId: null,
      hoveredType: null,
      hoveredId: null,
      isResizing: false,
      popup: defaultPopupConfig,
      history: [[]],
      historyIndex: 0,
      
      // Save state
      saveStatus: 'saved',
      lastSaved: null,
      hasUnsavedChanges: false,
      
      // Puck-inspired initial state
      zoom: 1,
    viewport: 'desktop',
    viewMode: 'edit',
    showLeftSidebar: true,
    showRightSidebar: true,
    rightSidebarExpanded: false,
    sidebarActiveTab: 'elements',
    
    setSidebarActiveTab: (tab) => set({ sidebarActiveTab: tab }),

    addSection: (config?: { containerType?: string; maxWidth?: string; rows?: any[] }) => {
      set((state) => {
        const sectionNumber = state.sections.length + 1;
        
        // Create rows from config if provided
        let rows: Row[] = [];
        if (config?.rows && config.rows.length > 0) {
          rows = config.rows.map((rowConfig: any, rowIndex: number) => {
            const columns: Column[] = rowConfig.columns.map((colConfig: any, colIndex: number) => ({
              id: generateId('column'),
              name: `Column ${colIndex + 1}`,
              ratio: colConfig.ratio || 1,
              elements: [],
              minRatio: 0.5,
            }));
            
            return {
              id: generateId('row'),
              name: `Row ${rowIndex + 1}`,
              columns,
              props: {},
            };
          });
        }
        
        const newSection: Section = {
          id: generateId('section'),
          name: `Section ${sectionNumber}`,
          rows,
          props: {
            containerType: (config?.containerType as any) || 'standard',
            maxWidth: config?.maxWidth || (config?.containerType === 'full-width' ? '100%' : 
                     config?.containerType === 'wide' ? '1280px' :
                     config?.containerType === 'standard' ? '960px' :
                     config?.containerType === 'medium' ? '1024px' :
                     config?.containerType === 'small' ? '768px' : '960px'),
            ...config,
          },
        };
        
        const newSections = [...state.sections, newSection];
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          selectedSectionId: newSection.id,
          ...historyUpdate,
          hasUnsavedChanges: true,
          saveStatus: 'unsaved' as const,
        };
      });
    },

    deleteSection: (sectionId) => {
      set((state) => {
        const newSections = state.sections.filter(s => s.id !== sectionId);
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          selectedSectionId: state.selectedSectionId === sectionId ? null : state.selectedSectionId,
          ...historyUpdate,
          hasUnsavedChanges: true,
          saveStatus: 'unsaved' as const,
        };
      });
    },

    renameSection: (sectionId, name) => {
      set((state) => {
        const newSections = state.sections.map(s =>
          s.id === sectionId ? { ...s, name } : s
        );
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          ...historyUpdate,
        };
      });
    },

    moveSection: (sectionId, direction) => {
      set((state) => {
        const index = state.sections.findIndex(s => s.id === sectionId);
        if (index === -1) return state;
        
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= state.sections.length) return state;
        
        const newSections = [...state.sections];
        [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          ...historyUpdate,
        };
      });
    },

    duplicateSection: (sectionId: string) => {
      set((state) => {
        const sectionIndex = state.sections.findIndex(s => s.id === sectionId);
        if (sectionIndex === -1) return state;
        
        const originalSection = state.sections[sectionIndex];
        
        // Deep clone the section with new IDs
        const cloneWithNewIds = (obj: any): any => {
          if (Array.isArray(obj)) {
            return obj.map(item => cloneWithNewIds(item));
          }
          if (obj && typeof obj === 'object') {
            const cloned: any = {};
            for (const key in obj) {
              if (key === 'id') {
                cloned[key] = generateId(obj.type || 'item');
              } else {
                cloned[key] = cloneWithNewIds(obj[key]);
              }
            }
            return cloned;
          }
          return obj;
        };
        
        const duplicatedSection: Section = {
          ...cloneWithNewIds(originalSection),
          id: generateId('section'),
          name: `${originalSection.name} (Copy)`,
        };
        
        // Insert after the original section
        const newSections = [
          ...state.sections.slice(0, sectionIndex + 1),
          duplicatedSection,
          ...state.sections.slice(sectionIndex + 1),
        ];
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          selectedSectionId: duplicatedSection.id,
          ...historyUpdate,
          hasUnsavedChanges: true,
          saveStatus: 'unsaved' as const,
        };
      });
    },

    addRow: (sectionId, columnCount, columnWidths) => {
      set((state) => {
        const newSections = state.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          const rowNumber = section.rows.length + 1;
          
          // Use provided column widths or default to equal distribution
          const widths = columnWidths && columnWidths.length === columnCount
            ? columnWidths
            : Array(columnCount).fill(100 / columnCount);
          
          const newRow: Row = {
            id: generateId('row'),
            name: `Row ${rowNumber}`,
            columns: Array.from({ length: columnCount }, (_, i) => ({
              id: generateId('column'),
              ratio: 1, // Equal ratios by default
              elements: [],
              minRatio: 0.5,
            })),
          };
          
          return {
            ...section,
            rows: [...section.rows, newRow],
          };
        });
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          ...historyUpdate,
        };
      });
    },

    deleteRow: (sectionId, rowId) => {
      set((state) => {
        const newSections = state.sections.map(section => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            rows: section.rows.filter(r => r.id !== rowId),
          };
        });
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          selectedRowId: state.selectedRowId === rowId ? null : state.selectedRowId,
          ...historyUpdate,
        };
      });
    },

    renameRow: (sectionId, rowId, name) => {
      set((state) => {
        const newSections = state.sections.map(section => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            rows: section.rows.map(r => r.id === rowId ? { ...r, name } : r),
          };
        });
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          ...historyUpdate,
        };
      });
    },

    moveRow: (sectionId, rowId, direction) => {
      set((state) => {
        const newSections = state.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          const index = section.rows.findIndex(r => r.id === rowId);
          if (index === -1) return section;
          
          const newIndex = direction === 'up' ? index - 1 : index + 1;
          if (newIndex < 0 || newIndex >= section.rows.length) return section;
          
          const newRows = [...section.rows];
          [newRows[index], newRows[newIndex]] = [newRows[newIndex], newRows[index]];
          
          return { ...section, rows: newRows };
        });
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          ...historyUpdate,
        };
      });
    },

    addColumn: (sectionId, rowId, width, position) => {
      set((state) => {
        const newSections = state.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          return {
            ...section,
            rows: section.rows.map(row => {
              if (row.id !== rowId) return row;
              if (row.columns.length >= 6) return row; // Max 6 columns
              
              const newColumn: Column = {
                id: generateId('column'),
                ratio: 1, // Default ratio
                elements: [],
                minRatio: 0.5,
              };
              
              // Determine insertion position
              let insertIndex: number;
              if (position === 'start') {
                insertIndex = 0;
              } else if (position === 'end' || position === undefined) {
                insertIndex = row.columns.length;
              } else {
                insertIndex = Math.max(0, Math.min(position, row.columns.length));
              }
              
              // Insert column at specified position
              const newColumns = [
                ...row.columns.slice(0, insertIndex),
                newColumn,
                ...row.columns.slice(insertIndex),
              ];
              
              // All columns maintain ratio of 1 (equal distribution)
              // No redistribution needed - ratios handle this automatically
              
              return {
                ...row,
                columns: newColumns,
              };
            }),
          };
        });
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          ...historyUpdate,
        };
      });
    },

    deleteColumn: (sectionId, rowId, columnId) => {
      set((state) => {
        const newSections = state.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          return {
            ...section,
            rows: section.rows.map(row => {
              if (row.id !== rowId) return row;
              if (row.columns.length <= 1) return row; // Keep at least 1 column
              
              const newColumns = row.columns.filter(col => col.id !== columnId);
              
              return {
                ...row,
                columns: newColumns,
              };
            }),
          };
        });
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          selectedColumnId: state.selectedColumnId === columnId ? null : state.selectedColumnId,
          ...historyUpdate,
        };
      });
    },

    renameColumn: (sectionId, rowId, columnId, name) => {
      set((state) => {
        const newSections = state.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          return {
            ...section,
            rows: section.rows.map(row => {
              if (row.id !== rowId) return row;
              
              return {
                ...row,
                columns: row.columns.map(col =>
                  col.id === columnId ? { ...col, name } : col
                ),
              };
            }),
          };
        });
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          ...historyUpdate,
        };
      });
    },

    resizeColumn: (sectionId, rowId, columnId, ratio) => {
      set((state) => {
        const newSections = state.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          return {
            ...section,
            rows: section.rows.map(row => {
              if (row.id !== rowId) return row;
              
              return {
                ...row,
                columns: row.columns.map(col =>
                  col.id === columnId ? { ...col, ratio } : col
                ),
              };
            }),
          };
        });
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          ...historyUpdate,
        };
      });
    },

    equalizeColumns: (sectionId, rowId) => {
      set((state) => {
        const newSections = state.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          return {
            ...section,
            rows: section.rows.map(row => {
              if (row.id !== rowId) return row;
              
              // Calculate equal width for all columns
              const columnCount = row.columns.length;
              const equalWidth = 100 / columnCount;
              
              const equalRatio = 1; // All columns get ratio of 1
              return {
                ...row,
                columns: row.columns.map(col => ({ ...col, ratio: equalRatio })),
              };
            }),
          };
        });
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          ...historyUpdate,
        };
      });
    },

    moveColumn: (sectionId, rowId, columnId, targetSectionId, targetRowId, targetIndex) => {
      // Implementation for drag-and-drop column movement
      set((state) => {
        // Complex logic for moving columns between rows/sections
        // Will implement with drag-and-drop
        return state;
      });
    },

    addElement: (sectionId, rowId, columnId, type, index) => {
      let newElementId: string | null = null;
      
      set((state) => {
        const newSections = state.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          return {
            ...section,
            rows: section.rows.map(row => {
              if (row.id !== rowId) return row;
              
              return {
                ...row,
                columns: row.columns.map(col => {
                  if (col.id !== columnId) return col;
                  
                  // Set default props based on element type
                  const getDefaultProps = (elementType: ElementType): Record<string, any> => {
                    switch (elementType) {
                      case 'heading':
                        return { 
                          text: '<h1>Your Heading Here</h1>', 
                          level: 'h1',
                          alignment: 'center',
                          align: 'center',
                        };
                      case 'subheading':
                        return { 
                          text: '<h2>Your Subheading Here</h2>', 
                          level: 'h2',
                          alignment: 'center',
                          align: 'center',
                        };
                      case 'text':
                        return { 
                          text: '<p>Your text content goes here...</p>',
                          alignment: 'center',
                          align: 'center',
                        };
                      case 'button':
                        return { 
                          text: '<span>Click Here</span>', 
                          actionType: 'none',
                          alignment: 'center',
                          align: 'center',
                        };
                      case 'image':
                        return {
                          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                          alt: 'Mountain landscape',
                          width: '600px',
                          height: '400px',
                          objectFit: 'cover',
                          align: 'center',
                          alignment: 'center',
                          borderRadius: 8,
                          opacity: 1,
                          brightness: 100,
                          contrast: 100,
                          blur: 0,
                          lazyLoad: true,
                        };
                      case 'gif':
                        return {
                          url: 'https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif',
                          alt: 'Animated GIF',
                          width: 'custom',
                          height: 'custom',
                          customWidth: 600,
                          customHeight: 400,
                          align: 'center',
                          alignment: 'center',
                          borderRadius: 8,
                          autoplay: true,
                          loop: true,
                          showControls: false,
                        };
                      case 'countdown':
                        // Set target date to 2 days from now by default
                        const defaultTargetDate = new Date();
                        defaultTargetDate.setDate(defaultTargetDate.getDate() + 2);
                        return {
                          countdownType: 'fixed',
                          targetDate: defaultTargetDate.toISOString(),
                          displayFormat: 'full',
                          visualStyle: 'flip',
                          title: 'Limited Time Offer',
                          daysLabel: 'Days',
                          hoursLabel: 'Hours',
                          minutesLabel: 'Minutes',
                          secondsLabel: 'Seconds',
                          fontSize: 48,
                          labelFontSize: 12,
                          fontWeight: '700',
                          numberColor: '#ffffff',
                          labelColor: '#d1d5db',
                          backgroundColor: '#1f2937',
                          borderRadius: 8,
                          gap: 12,
                          alignment: 'center',
                          showSeparator: true,
                          animateNumbers: true,
                        };
                      case 'video':
                        return {
                          url: '',
                          source: 'youtube',
                          aspectRatio: '16:9',
                          alignment: 'center',
                          align: 'center',
                          width: '100%', // Default to full width of column
                          maxWidth: '100%',
                          padding: 16, // Reasonable padding
                          borderRadius: 8,
                          controls: true,
                          autoplay: false,
                          loop: false,
                          muted: false,
                          responsiveMode: 'fit', // Fit mode for reasonable sizing
                        };
                      case 'logo-showcase':
                        return {
                          logos: sampleLogos,
                          settings: defaultLogoShowcaseSettings,
                        };
                      case 'form':
                        return {
                          formType: 'form',
                          fields: [
                            { 
                              id: 'field-1', 
                              type: 'text', 
                              label: 'Name', 
                              name: 'name',
                              placeholder: 'Enter your name', 
                              required: true, 
                              width: 'full' 
                            },
                            { 
                              id: 'field-2', 
                              type: 'email', 
                              label: 'Email', 
                              name: 'email',
                              placeholder: 'Enter your email', 
                              required: true, 
                              width: 'full' 
                            },
                          ],
                          submitText: 'Submit',
                          successMessage: 'Thank you for submitting!',
                          alignment: 'center',
                          submitBackgroundColor: '#3b82f6',
                          submitTextColor: '#ffffff',
                        };
                      case 'testimonial':
                        return {
                          quote: 'This product changed my life! I highly recommend it to anyone looking for results.',
                          author: 'John Doe',
                          role: 'CEO, Company Inc.',
                          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                          rating: 5,
                          alignment: 'center',
                          style: 'card',
                        };
                      case 'pricing':
                        return {
                          title: 'Pro Plan',
                          price: '$49',
                          period: '/month',
                          description: 'Perfect for growing businesses',
                          features: ['Unlimited access', 'Priority support', 'Advanced analytics', 'Custom integrations'],
                          buttonText: 'Get Started',
                          highlighted: true,
                          alignment: 'center',
                        };
                      case 'socialproof':
                      case 'social-proof':
                        return {
                          type: 'counter',
                          count: 10000,
                          label: 'Happy Customers',
                          icon: 'users',
                          alignment: 'center',
                        };
                      case 'progress':
                        return {
                          value: 75,
                          max: 100,
                          label: 'Progress',
                          showPercentage: true,
                          color: '#3b82f6',
                          backgroundColor: '#e5e7eb',
                          height: 8,
                          alignment: 'center',
                        };
                      case 'list':
                        return {
                          items: ['First item', 'Second item', 'Third item'],
                          style: 'bullet',
                          icon: 'check',
                          iconColor: '#22c55e',
                          alignment: 'left',
                        };
                      case 'faq':
                        return {
                          items: [
                            { question: 'What is this product?', answer: 'This is an amazing product that solves your problems.' },
                            { question: 'How does it work?', answer: 'Simply sign up and start using it right away.' },
                            { question: 'Is there a free trial?', answer: 'Yes, we offer a 14-day free trial.' },
                          ],
                          style: 'accordion',
                          alignment: 'left',
                        };
                      case 'spacer':
                        return {
                          height: 40,
                        };
                      case 'divider':
                        return {
                          style: 'solid',
                          color: '#e5e7eb',
                          thickness: 1,
                          width: '100%',
                          alignment: 'center',
                        };
                      case 'icon':
                        return {
                          name: 'star',
                          size: 48,
                          color: '#3b82f6',
                          alignment: 'center',
                        };
                      case 'accordion':
                        return {
                          items: [
                            { title: 'Section 1', content: 'Content for section 1' },
                            { title: 'Section 2', content: 'Content for section 2' },
                          ],
                          allowMultiple: false,
                          defaultOpen: 0,
                          alignment: 'left',
                        };
                      case 'tabs':
                        return {
                          tabs: [
                            { id: 'tab1', label: 'Tab 1', content: 'Content for Tab 1' },
                            { id: 'tab2', label: 'Tab 2', content: 'Content for Tab 2' },
                          ],
                          defaultTab: 'tab1',
                          style: 'underline',
                          alignment: 'center',
                        };
                      case 'modal':
                        return {
                          triggerText: 'Open Modal',
                          title: 'Modal Title',
                          content: 'Modal content goes here...',
                          showCloseButton: true,
                          size: 'medium',
                          alignment: 'center',
                        };
                      case 'alert':
                        return {
                          type: 'info',
                          title: 'Information',
                          message: 'This is an informational alert message.',
                          dismissible: true,
                          alignment: 'left',
                        };
                      case 'badge':
                        return {
                          text: 'New',
                          variant: 'primary',
                          size: 'medium',
                          alignment: 'center',
                        };
                      default:
                        return {};
                    }
                  };
                  
                  const newElement: Element = {
                    id: generateId('element'),
                    type,
                    props: getDefaultProps(type),
                  };
                  
                  // Store the new element ID for auto-selection
                  newElementId = newElement.id;
                  
                  // If index is provided, insert at that position, otherwise add to end
                  const newElements = index !== undefined
                    ? [
                        ...col.elements.slice(0, index),
                        newElement,
                        ...col.elements.slice(index)
                      ]
                    : [...col.elements, newElement];
                  
                  return {
                    ...col,
                    elements: newElements,
                  };
                }),
              };
            }),
          };
        });
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          ...historyUpdate,
          // Auto-select the newly added element for sequential stacking
          selectedElementId: newElementId,
        };
      });
    },

    updateElement: (elementId, props) => {
      console.log('🏪 Store updateElement called:', { elementId, props });
      set((state) => {
        const newSections = state.sections.map(section => ({
          ...section,
          rows: section.rows.map(row => ({
            ...row,
            columns: row.columns.map(col => ({
              ...col,
              elements: col.elements.map(el => {
                if (el.id === elementId) {
                  // Sync alignment props - if alignment is updated, sync both 'alignment' and 'align'
                  const syncedProps = { ...props };
                  if ('alignment' in props && !('align' in props)) {
                    syncedProps.align = props.alignment;
                  }
                  if ('align' in props && !('alignment' in props)) {
                    syncedProps.alignment = props.align;
                  }
                  
                  const updatedElement = { ...el, props: { ...el.props, ...syncedProps } };
                  console.log('✅ Element updated in store:', { 
                    elementId, 
                    oldProps: el.props, 
                    newProps: updatedElement.props 
                  });
                  return updatedElement;
                }
                return el;
              }),
            })),
          })),
        }));
        
        return { sections: newSections };
      });
    },

    renameElement: (elementId, name) => {
      set((state) => {
        const newSections = state.sections.map(section => ({
          ...section,
          rows: section.rows.map(row => ({
            ...row,
            columns: row.columns.map(col => ({
              ...col,
              elements: col.elements.map(el =>
                el.id === elementId ? { ...el, name } : el
              ),
            })),
          })),
        }));
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          ...historyUpdate,
        };
      });
    },

    deleteElement: (elementId) => {
      set((state) => {
        const newSections = state.sections.map(section => ({
          ...section,
          rows: section.rows.map(row => ({
            ...row,
            columns: row.columns.map(col => ({
              ...col,
              elements: col.elements.filter(el => el.id !== elementId),
            })),
          })),
        }));
        
        return {
          sections: newSections,
          selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
          ...addToHistory(state.history, state.historyIndex, newSections),
        };
      });
    },

    moveElement: (elementId, targetSectionId, targetRowId, targetColumnId, targetIndex) => {
      set((state) => {
        const newSections = JSON.parse(JSON.stringify(state.sections));
        let sourceElement: Element | null = null;
        let sourceColumn: Column | null = null;
        let sourceSection: Section | null = null;
        let sourceRow: Row | null = null;
        
        // Find and remove element from source
        for (const section of newSections) {
          for (const row of section.rows) {
            for (const column of row.columns) {
              const elementIndex = column.elements.findIndex((e: Element) => e.id === elementId);
              if (elementIndex !== -1) {
                sourceElement = column.elements[elementIndex];
                sourceColumn = column;
                sourceSection = section;
                sourceRow = row;
                column.elements.splice(elementIndex, 1);
                break;
              }
            }
            if (sourceElement) break;
          }
          if (sourceElement) break;
        }
        
        if (!sourceElement) return state;
        
        // Insert element at target position
        for (const section of newSections) {
          if (section.id !== targetSectionId) continue;
          for (const row of section.rows) {
            if (row.id !== targetRowId) continue;
            for (const column of row.columns) {
              if (column.id !== targetColumnId) continue;
              
              // Insert at target index
              const insertIndex = Math.min(targetIndex, column.elements.length);
              column.elements.splice(insertIndex, 0, sourceElement);
              
              const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
              return {
                sections: newSections,
                ...historyUpdate,
                hasUnsavedChanges: true,
                saveStatus: 'unsaved' as const,
              };
            }
          }
        }
        
        return state;
      });
    },

    selectSection: (sectionId) => {
      console.log('🔵 selectSection:', sectionId);
      set({ selectedSectionId: sectionId, selectedRowId: null, selectedColumnId: null, selectedElementId: null, showRightSidebar: sectionId !== null });
    },
    selectRow: (rowId) => {
      console.log('🟢 selectRow:', rowId);
      // When selecting a row, we need to find and set its parent section
      const state = useTestBuilderV2Store.getState();
      const section = state.sections.find(s => s.rows.some(r => r.id === rowId));
      set({ 
        selectedSectionId: section?.id || null,
        selectedRowId: rowId, 
        selectedColumnId: null, 
        selectedElementId: null, 
        showRightSidebar: rowId !== null 
      });
    },
    selectColumn: (columnId) => {
      console.log('🟣 selectColumn:', columnId);
      // When selecting a column, find its parent row and section
      const state = useTestBuilderV2Store.getState();
      const section = state.sections.find(s => 
        s.rows.some(r => r.columns.some(c => c.id === columnId))
      );
      const row = section?.rows.find(r => r.columns.some(c => c.id === columnId));
      set({ 
        selectedSectionId: section?.id || null,
        selectedRowId: row?.id || null,
        selectedColumnId: columnId, 
        selectedElementId: null, 
        showRightSidebar: columnId !== null 
      });
    },
    setEditingElement: (elementId) => {
      set({ editingElementId: elementId });
    },
    selectElement: (elementId) => {
      console.log('🟠 selectElement:', elementId);
      // When selecting an element, find its parent column, row, and section
      const state = useTestBuilderV2Store.getState();
      const section = state.sections.find(s => 
        s.rows.some(r => 
          r.columns.some(c => 
            c.elements.some(e => e.id === elementId)
          )
        )
      );
      const row = section?.rows.find(r => 
        r.columns.some(c => c.elements.some(e => e.id === elementId))
      );
      const column = row?.columns.find(c => c.elements.some(e => e.id === elementId));
      set({ 
        selectedSectionId: section?.id || null,
        selectedRowId: row?.id || null,
        selectedColumnId: column?.id || null,
        selectedElementId: elementId, 
        showRightSidebar: elementId !== null 
      });
    },

    updatePopup: (config) => set((state) => ({ popup: { ...state.popup, ...config } })),

    addPopupSection: () => {
      set((state) => {
        const sectionNumber = state.popup.sections.length + 1;
        const newSection: Section = {
          id: generateId('popup-section'),
          name: `Popup Section ${sectionNumber}`,
          rows: [],
          props: {},
        };
        return {
          popup: {
            ...state.popup,
            sections: [...state.popup.sections, newSection],
          },
        };
      });
    },

    deletePopupSection: (sectionId) => {
      set((state) => ({
        popup: {
          ...state.popup,
          sections: state.popup.sections.filter(s => s.id !== sectionId),
        },
      }));
    },

    addPopupRow: (sectionId, columnCount) => {
      set((state) => {
        const section = state.popup.sections.find(s => s.id === sectionId);
        if (!section) return state;

        const rowNumber = section.rows.length + 1;
        const columns: Column[] = Array.from({ length: columnCount }, (_, i) => ({
          id: generateId('popup-col'),
          ratio: 1, // Equal ratios
          elements: [],
          minRatio: 0.5,
        }));

        const newRow: Row = {
          id: generateId('popup-row'),
          name: `Popup Row ${rowNumber}`,
          columns,
        };

        return {
          popup: {
            ...state.popup,
            sections: state.popup.sections.map(s =>
              s.id === sectionId ? { ...s, rows: [...s.rows, newRow] } : s
            ),
          },
        };
      });
    },

    addPopupElement: (sectionId, rowId, columnId, type) => {
      set((state) => {
        const newElement: Element = {
          id: generateId('popup-el'),
          type,
          props: { text: `New ${type}` },
        };

        return {
          popup: {
            ...state.popup,
            sections: state.popup.sections.map(section =>
              section.id === sectionId
                ? {
                    ...section,
                    rows: section.rows.map(row =>
                      row.id === rowId
                        ? {
                            ...row,
                            columns: row.columns.map(col =>
                              col.id === columnId
                                ? { ...col, elements: [...col.elements, newElement] }
                                : col
                            ),
                          }
                        : row
                    ),
                  }
                : section
            ),
          },
        };
      });
    },

    undo: () => {
      set((state) => {
        if (state.historyIndex <= 0) return state;
        const newIndex = state.historyIndex - 1;
        return {
          sections: state.history[newIndex],
          historyIndex: newIndex,
          selectedSectionId: null,
          selectedRowId: null,
          selectedColumnId: null,
          selectedElementId: null,
          hasUnsavedChanges: true,
          saveStatus: 'unsaved' as const,
        };
      });
    },

    redo: () => {
      set((state) => {
        if (state.historyIndex >= state.history.length - 1) return state;
        const newIndex = state.historyIndex + 1;
        return {
          sections: state.history[newIndex],
          historyIndex: newIndex,
          selectedSectionId: null,
          selectedRowId: null,
          selectedColumnId: null,
          selectedElementId: null,
          hasUnsavedChanges: true,
          saveStatus: 'unsaved' as const,
        };
      });
    },

    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,
    
    setHover: (type, id) => set({ hoveredType: type, hoveredId: id }),
    setIsResizing: (isResizing) => set({ isResizing }),
    
    // Puck-inspired action implementations
    setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(1.5, zoom)) }),
    setViewport: (viewport) => set({ viewport }),
    setViewMode: (mode) => set({ viewMode: mode }),
    toggleLeftSidebar: () => set((state) => ({ showLeftSidebar: !state.showLeftSidebar })),
    toggleRightSidebar: () => set((state) => ({ showRightSidebar: !state.showRightSidebar })),
    setRightSidebarExpanded: (expanded) => set({ rightSidebarExpanded: expanded }),
    
    // Funnel step management implementations
    getCurrentStep: () => {
      const state = get();
      return state.funnel.steps.find(step => step.id === state.currentStepId);
    },
    
    addStep: (type: StepType, name?: string) => {
      set((state) => {
        const now = new Date();
        const newOrder = state.funnel.steps.length;
        const stepTypeNames: Record<StepType, string> = {
          landing: 'Landing Page',
          optin: 'Opt-in Page',
          sales: 'Sales Page',
          upsell: 'Upsell Page',
          downsell: 'Downsell Page',
          thankyou: 'Thank You Page',
          webinar: 'Webinar Page',
          checkout: 'Checkout Page',
        };
        
        const newStep: FunnelStep = {
          id: generateId('step'),
          name: name || stepTypeNames[type],
          type,
          order: newOrder,
          sections: [],
          createdAt: now,
          updatedAt: now,
        };
        
        return {
          funnel: {
            ...state.funnel,
            steps: [...state.funnel.steps, newStep],
            updatedAt: now,
          },
        };
      });
    },
    
    deleteStep: (stepId: string) => {
      set((state) => {
        const steps = state.funnel.steps.filter(s => s.id !== stepId);
        
        // Can't delete the last step
        if (steps.length === 0) {
          alert('Cannot delete the last step in the funnel');
          return state;
        }
        
        // Reorder remaining steps
        const reorderedSteps = steps.map((step, index) => ({
          ...step,
          order: index,
        }));
        
        // If deleting current step, switch to first step
        const newCurrentStepId = state.currentStepId === stepId 
          ? reorderedSteps[0].id 
          : state.currentStepId;
        
        // Load the new current step's sections
        const newCurrentStep = reorderedSteps.find(s => s.id === newCurrentStepId);
        
        return {
          funnel: {
            ...state.funnel,
            steps: reorderedSteps,
            updatedAt: new Date(),
          },
          currentStepId: newCurrentStepId,
          sections: newCurrentStep?.sections || [],
          selectedSectionId: null,
          selectedRowId: null,
          selectedColumnId: null,
          selectedElementId: null,
        };
      });
    },
    
    duplicateStep: (stepId: string) => {
      set((state) => {
        const stepToDuplicate = state.funnel.steps.find(s => s.id === stepId);
        if (!stepToDuplicate) return state;
        
        const now = new Date();
        const newOrder = state.funnel.steps.length;
        
        const duplicatedStep: FunnelStep = {
          ...stepToDuplicate,
          id: generateId('step'),
          name: `${stepToDuplicate.name} (Copy)`,
          order: newOrder,
          sections: JSON.parse(JSON.stringify(stepToDuplicate.sections)), // Deep clone
          createdAt: now,
          updatedAt: now,
        };
        
        return {
          funnel: {
            ...state.funnel,
            steps: [...state.funnel.steps, duplicatedStep],
            updatedAt: now,
          },
        };
      });
    },
    
    renameStep: (stepId: string, name: string) => {
      set((state) => ({
        funnel: {
          ...state.funnel,
          steps: state.funnel.steps.map(step =>
            step.id === stepId
              ? { ...step, name, updatedAt: new Date() }
              : step
          ),
          updatedAt: new Date(),
        },
      }));
    },
    
    reorderStep: (stepId: string, newOrder: number) => {
      set((state) => {
        const steps = [...state.funnel.steps];
        const stepIndex = steps.findIndex(s => s.id === stepId);
        if (stepIndex === -1) return state;
        
        const [movedStep] = steps.splice(stepIndex, 1);
        steps.splice(newOrder, 0, movedStep);
        
        // Update order property for all steps
        const reorderedSteps = steps.map((step, index) => ({
          ...step,
          order: index,
        }));
        
        return {
          funnel: {
            ...state.funnel,
            steps: reorderedSteps,
            updatedAt: new Date(),
          },
        };
      });
    },
    
    switchToStep: (stepId: string) => {
      set((state) => {
        // Save current step's sections
        const currentStep = state.funnel.steps.find(s => s.id === state.currentStepId);
        if (currentStep) {
          currentStep.sections = state.sections;
          currentStep.updatedAt = new Date();
        }
        
        // Load new step's sections
        const newStep = state.funnel.steps.find(s => s.id === stepId);
        if (!newStep) return state;
        
        return {
          funnel: {
            ...state.funnel,
            steps: state.funnel.steps.map(step =>
              step.id === state.currentStepId ? { ...step, sections: state.sections, updatedAt: new Date() } : step
            ),
          },
          currentStepId: stepId,
          sections: newStep.sections,
          selectedSectionId: null,
          selectedRowId: null,
          selectedColumnId: null,
          selectedElementId: null,
          history: [newStep.sections],
          historyIndex: 0,
        };
      });
    },
    
    // Save actions
    saveFunnel: async () => {
      const state = get();
      set({ saveStatus: 'saving' });
      
      try {
        const { funnelSaveService } = await import('@/lib/funnel-save-service');
        
        // Update current step with latest sections
        const updatedFunnel: Funnel = {
          ...state.funnel,
          steps: state.funnel.steps.map(step =>
            step.id === state.currentStepId
              ? { ...step, sections: state.sections, updatedAt: new Date() }
              : step
          ),
          updatedAt: new Date(),
        };
        
        const result = await funnelSaveService.saveFunnel(updatedFunnel, false);
        
        if (result.success) {
          set({
            saveStatus: 'saved',
            lastSaved: result.timestamp || new Date(),
            hasUnsavedChanges: false,
            funnel: updatedFunnel,
          });
        } else {
          set({ saveStatus: 'error' });
        }
      } catch (error) {
        set({ saveStatus: 'error' });
      }
    },
    
    loadFunnel: async (funnelId: string) => {
      try {
        const { funnelSaveService } = await import('@/lib/funnel-save-service');
        const loadedFunnel = await funnelSaveService.loadFunnel(funnelId);
        
        if (loadedFunnel) {
          const firstStep = loadedFunnel.steps[0];
          set({
            funnel: loadedFunnel,
            currentStepId: firstStep.id,
            sections: firstStep.sections,
            selectedSectionId: null,
            selectedRowId: null,
            selectedColumnId: null,
            selectedElementId: null,
            history: [firstStep.sections],
            historyIndex: 0,
            saveStatus: 'saved',
            lastSaved: loadedFunnel.updatedAt,
            hasUnsavedChanges: false,
          });
        }
      } catch (error) {
        console.error('Failed to load funnel:', error);
      }
    },
    
    renameFunnel: (name: string) => {
      set((state) => ({
        funnel: {
          ...state.funnel,
          name,
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
        saveStatus: 'unsaved',
      }));
    },
    
    exportFunnel: () => {
      const state = get();
      const { funnelSaveService } = require('@/lib/funnel-save-service');
      
      // Update current step with latest sections
      const updatedFunnel: Funnel = {
        ...state.funnel,
        steps: state.funnel.steps.map(step =>
          step.id === state.currentStepId
            ? { ...step, sections: state.sections, updatedAt: new Date() }
            : step
        ),
      };
      
      funnelSaveService.exportFunnel(updatedFunnel);
    },
    
    importFunnel: async (file: File) => {
      try {
        const { funnelSaveService } = await import('@/lib/funnel-save-service');
        const importedFunnel = await funnelSaveService.importFunnel(file);
        
        if (importedFunnel) {
          const firstStep = importedFunnel.steps[0];
          set({
            funnel: importedFunnel,
            currentStepId: firstStep.id,
            sections: firstStep.sections,
            selectedSectionId: null,
            selectedRowId: null,
            selectedColumnId: null,
            selectedElementId: null,
            history: [firstStep.sections],
            historyIndex: 0,
            saveStatus: 'saved',
            lastSaved: new Date(),
            hasUnsavedChanges: false,
          });
        }
      } catch (error) {
        console.error('Failed to import funnel:', error);
      }
    },
    
    markAsUnsaved: () => {
      set({ hasUnsavedChanges: true, saveStatus: 'unsaved' });
    },
    
    markAsSaved: () => {
      set({ hasUnsavedChanges: false, saveStatus: 'saved', lastSaved: new Date() });
    },
    
    // Template actions
    loadTemplate: (sections: Section[]) => {
      set((state) => {
        // Update current step with template sections
        const updatedFunnel: Funnel = {
          ...state.funnel,
          steps: state.funnel.steps.map(step =>
            step.id === state.currentStepId
              ? { ...step, sections, updatedAt: new Date() }
              : step
          ),
          updatedAt: new Date(),
        };
        
        return {
          funnel: updatedFunnel,
          sections,
          selectedSectionId: null,
          selectedRowId: null,
          selectedColumnId: null,
          selectedElementId: null,
          history: [sections],
          historyIndex: 0,
          hasUnsavedChanges: true,
          saveStatus: 'unsaved' as const,
        };
      });
    },
    
    // Clipboard actions
    clipboard: null as Element | null,
    
    duplicateElement: (elementId: string) => {
      set((state) => {
        const newSections = JSON.parse(JSON.stringify(state.sections));
        let elementFound = false;
        
        for (const section of newSections) {
          for (const row of section.rows) {
            for (const column of row.columns) {
              const elementIndex = column.elements.findIndex((e: Element) => e.id === elementId);
              if (elementIndex !== -1) {
                const originalElement = column.elements[elementIndex];
                const duplicatedElement: Element = {
                  ...originalElement,
                  id: generateId('element'),
                  name: originalElement.name ? `${originalElement.name} (Copy)` : undefined,
                };
                column.elements.splice(elementIndex + 1, 0, duplicatedElement);
                elementFound = true;
                break;
              }
            }
            if (elementFound) break;
          }
          if (elementFound) break;
        }
        
        return {
          sections: newSections,
          hasUnsavedChanges: true,
          saveStatus: 'unsaved' as const,
        };
      });
    },
    
    moveElementUp: (elementId: string) => {
      set((state) => {
        const newSections = JSON.parse(JSON.stringify(state.sections));
        let elementFound = false;
        
        for (const section of newSections) {
          for (const row of section.rows) {
            for (const column of row.columns) {
              const elementIndex = column.elements.findIndex((e: Element) => e.id === elementId);
              if (elementIndex > 0) {
                const temp = column.elements[elementIndex];
                column.elements[elementIndex] = column.elements[elementIndex - 1];
                column.elements[elementIndex - 1] = temp;
                elementFound = true;
                break;
              }
            }
            if (elementFound) break;
          }
          if (elementFound) break;
        }
        
        return {
          sections: newSections,
          hasUnsavedChanges: true,
          saveStatus: 'unsaved' as const,
        };
      });
    },
    
    moveElementDown: (elementId: string) => {
      set((state) => {
        const newSections = JSON.parse(JSON.stringify(state.sections));
        let elementFound = false;
        
        for (const section of newSections) {
          for (const row of section.rows) {
            for (const column of row.columns) {
              const elementIndex = column.elements.findIndex((e: Element) => e.id === elementId);
              if (elementIndex !== -1 && elementIndex < column.elements.length - 1) {
                const temp = column.elements[elementIndex];
                column.elements[elementIndex] = column.elements[elementIndex + 1];
                column.elements[elementIndex + 1] = temp;
                elementFound = true;
                break;
              }
            }
            if (elementFound) break;
          }
          if (elementFound) break;
        }
        
        return {
          sections: newSections,
          hasUnsavedChanges: true,
          saveStatus: 'unsaved' as const,
        };
      });
    },
    
    moveColumnUp: (sectionId, rowId, columnId) => {
      set((state) => {
        const newSections = state.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          return {
            ...section,
            rows: section.rows.map(row => {
              if (row.id !== rowId) return row;
              
              const columnIndex = row.columns.findIndex(col => col.id === columnId);
              if (columnIndex > 0) {
                const newColumns = [...row.columns];
                const temp = newColumns[columnIndex];
                newColumns[columnIndex] = newColumns[columnIndex - 1];
                newColumns[columnIndex - 1] = temp;
                
                return {
                  ...row,
                  columns: newColumns,
                };
              }
              return row;
            }),
          };
        });
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          ...historyUpdate,
        };
      });
    },
    
    moveColumnDown: (sectionId, rowId, columnId) => {
      set((state) => {
        const newSections = state.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          return {
            ...section,
            rows: section.rows.map(row => {
              if (row.id !== rowId) return row;
              
              const columnIndex = row.columns.findIndex(col => col.id === columnId);
              if (columnIndex !== -1 && columnIndex < row.columns.length - 1) {
                const newColumns = [...row.columns];
                const temp = newColumns[columnIndex];
                newColumns[columnIndex] = newColumns[columnIndex + 1];
                newColumns[columnIndex + 1] = temp;
                
                return {
                  ...row,
                  columns: newColumns,
                };
              }
              return row;
            }),
          };
        });
        
        const historyUpdate = addToHistory(state.history, state.historyIndex, newSections);
        return {
          sections: newSections,
          ...historyUpdate,
        };
      });
    },
    
    copyElement: (elementId: string) => {
      set((state) => {
        for (const section of state.sections) {
          for (const row of section.rows) {
            for (const column of row.columns) {
              const element = column.elements.find((e: Element) => e.id === elementId);
              if (element) {
                return { clipboard: JSON.parse(JSON.stringify(element)) };
              }
            }
          }
        }
        return {};
      });
    },
    
    cutElement: (elementId: string) => {
      set((state) => {
        const newSections = JSON.parse(JSON.stringify(state.sections));
        let cutElement: Element | null = null;
        
        for (const section of newSections) {
          for (const row of section.rows) {
            for (const column of row.columns) {
              const elementIndex = column.elements.findIndex((e: Element) => e.id === elementId);
              if (elementIndex !== -1) {
                cutElement = column.elements[elementIndex];
                column.elements.splice(elementIndex, 1);
                break;
              }
            }
            if (cutElement) break;
          }
          if (cutElement) break;
        }
        
        return {
          sections: newSections,
          clipboard: cutElement,
          hasUnsavedChanges: true,
          saveStatus: 'unsaved' as const,
        };
      });
    },
    
    pasteElement: () => {
      set((state) => {
        if (!state.clipboard || !state.selectedColumnId) return {};
        
        const newSections = JSON.parse(JSON.stringify(state.sections));
        
        for (const section of newSections) {
          for (const row of section.rows) {
            for (const column of row.columns) {
              if (column.id === state.selectedColumnId) {
                const pastedElement: Element = {
                  ...state.clipboard,
                  id: generateId('element'),
                };
                column.elements.push(pastedElement);
                return {
                  sections: newSections,
                  hasUnsavedChanges: true,
                  saveStatus: 'unsaved' as const,
                };
              }
            }
          }
        }
        
        return {};
      });
    },
  };})
);
