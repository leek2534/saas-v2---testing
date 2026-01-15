'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { produce } from 'immer';
import { nanoid } from 'nanoid';
import type {
  EditorState,
  EditorElement,
  ID,
  HistoryState,
  Asset,
  CanvasConfig,
  ImageElement,
  TextElement,
  ShapeElement,
  Template,
  Page,
} from './types';
import type { Guide } from './snapEnhanced';
import { getDefaultTextSize, getDefaultShapeSize, getDefaultImageSize } from './responsiveFontSizing';
import { textToJSON } from './renderText';
import { createCollabSlice, CollabState, CollabActions } from './storeCollabExtension';

const MAX_HISTORY_SIZE = 50;

// Default to Instagram Post (most common Canva size)
const initialCanvas: CanvasConfig = {
  width: 1080,
  height: 1080,
  background: {
    color: '#ffffff',
  },
};

const initialHistory: HistoryState = {
  stack: [],
  index: -1,
  maxSize: MAX_HISTORY_SIZE,
};

// Create initial page
const initialPageId = nanoid();
const initialPage: Page = {
  id: initialPageId,
  name: 'Page 1',
  canvas: initialCanvas,
  elements: [],
  order: 0,
};

const initialState: EditorState = {
  canvas: initialCanvas,
  elements: [],
  selectedIds: [],
  history: initialHistory,
  assets: [],
  showAlignmentGuides: true,
  snapThreshold: 8,
  showSnapGuides: true,
  activeGuides: [],
  alignmentBadge: null,
  meta: {
    projectName: 'Untitled Design',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  // Multi-page support
  pages: [initialPage],
  activePageId: initialPageId,
  // Drawing mode
  isDrawingMode: false,
  drawingConfig: {
    color: '#000000',
    strokeWidth: 5,
  },
  // Video editor mode
  videoEditorMode: false,
};

interface EditorStore extends EditorState, CollabState, CollabActions {
  // Actions
  setCanvas: (canvas: Partial<CanvasConfig>) => void;
  addElement: (element: EditorElement) => void;
  updateElement: (id: ID, updates: Partial<EditorElement>) => void;
  deleteElements: (ids: ID[]) => void;
  duplicateElements: (ids: ID[]) => void;
  setSelectedIds: (ids: ID[]) => void;
  clearSelection: () => void;
  bringToFront: (id: ID) => void;
  sendToBack: (id: ID) => void;
  bringForward: (id: ID) => void;
  sendBackward: (id: ID) => void;
  setShowAlignmentGuides: (show: boolean) => void;
  
  // Enhanced snapping
  snapThreshold: number;
  showSnapGuides: boolean;
  activeGuides: Guide[];
  alignmentBadge: { x: number; y: number; text: string } | null;
  setSnapThreshold: (threshold: number) => void;
  setShowSnapGuides: (show: boolean) => void;
  setActiveGuides: (guides: Guide[]) => void;
  setAlignmentBadge: (badge: { x: number; y: number; text: string } | null) => void;
  
  // Convenience methods (inspired by Polotno's cleaner API)
  addTextElement: (props: {
    text?: string;
    x?: number;
    y?: number;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    width?: number;
    height?: number;
  }) => ID;
  addImageElement: (props: {
    src: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }) => ID;
  addShapeElement: (props: {
    shapeType: 'rect' | 'circle' | 'triangle' | 'line' | 'polygon';
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }) => ID;
  
  // Active canvas (for future multi-canvas support)
  getActiveCanvas: () => CanvasConfig;
  
  // Drawing mode
  setDrawingMode: (enabled: boolean) => void;
  setDrawingConfig: (config: { color?: string; strokeWidth?: number }) => void;
  
  // Video editor mode
  setVideoEditorMode: (enabled: boolean) => void;
  
  // History
  pushHistory: (state: EditorState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Assets
  addAsset: (asset: Asset) => void;
  removeAsset: (id: ID) => void;
  
  // Meta
  updateMeta: (meta: Partial<EditorState['meta']>) => void;
  
  // Templates
  saveTemplate: (name: string, thumbnail?: string, tags?: string[], category?: string) => Template;
  loadTemplate: (templateId: ID) => void;
  getTemplates: () => Template[];
  deleteTemplate: (templateId: ID) => void;
  
  // Reset
  reset: () => void;
  
  // Get current state snapshot
  getStateSnapshot: () => EditorState;
  
  // Grouping actions
  groupElements: (ids: ID[]) => string | null; // Returns groupId or null if < 2 elements
  ungroupElements: (groupId: string) => void;
  getGroupElements: (groupId: string) => EditorElement[];
  getElementGroup: (elementId: ID) => string | null; // Get groupId for an element
  getSelectedGroup: () => string | null; // Get groupId if all selected elements are in same group
  
  // Multi-page actions
  addPage: (name?: string) => ID;
  deletePage: (pageId: ID) => void;
  duplicatePage: (pageId: ID) => ID;
  setActivePage: (pageId: ID) => void;
  renamePage: (pageId: ID, name: string) => void;
  reorderPages: (pageIds: ID[]) => void;
  getActivePage: () => Page | undefined;
  getAllPages: () => Page[];
}

export const useEditorStore = create<EditorStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        ...createCollabSlice(set, get),

        setCanvas: (canvas) =>
          set(
            produce((state: EditorState) => {
              state.canvas = { ...state.canvas, ...canvas };
              state.meta.updatedAt = new Date().toISOString();
              
              // Also update the active page's canvas
              if (state.activePageId && state.pages) {
                const pageIndex = state.pages.findIndex((p) => p.id === state.activePageId);
                if (pageIndex !== -1) {
                  state.pages[pageIndex].canvas = { ...state.canvas };
                }
              }
            })
          ),

        addElement: (element) => {
          set(
            produce((state: EditorState) => {
              state.elements.push(element);
              state.meta.updatedAt = new Date().toISOString();
              
              // Also sync to active page's elements
              if (state.activePageId && state.pages) {
                const pageIndex = state.pages.findIndex((p) => p.id === state.activePageId);
                if (pageIndex !== -1) {
                  state.pages[pageIndex].elements = [...state.elements];
                }
              }
            })
          );
          get().pushHistory(get().getStateSnapshot());
        },

        updateElement: (id, updates) => {
          set(
            produce((state: EditorState) => {
              const index = state.elements.findIndex((el) => el.id === id);
              if (index !== -1) {
                state.elements[index] = { ...state.elements[index], ...updates };
                state.meta.updatedAt = new Date().toISOString();
                
                // Sync to active page
                if (state.activePageId && state.pages) {
                  const pageIndex = state.pages.findIndex((p) => p.id === state.activePageId);
                  if (pageIndex !== -1) {
                    state.pages[pageIndex].elements = [...state.elements];
                  }
                }
              }
            })
          );
        },

        deleteElements: (ids) => {
          set(
            produce((state: EditorState) => {
              state.elements = state.elements.filter((el) => !ids.includes(el.id));
              state.selectedIds = state.selectedIds.filter((id) => !ids.includes(id));
              state.meta.updatedAt = new Date().toISOString();
              
              // Sync to active page
              if (state.activePageId && state.pages) {
                const pageIndex = state.pages.findIndex((p) => p.id === state.activePageId);
                if (pageIndex !== -1) {
                  state.pages[pageIndex].elements = [...state.elements];
                }
              }
            })
          );
          get().pushHistory(get().getStateSnapshot());
        },

        duplicateElements: (ids) => {
          set(
            produce((state: EditorState) => {
              const duplicated: EditorElement[] = [];
              
              ids.forEach((id) => {
                const original = state.elements.find((el) => el.id === id);
                if (original) {
                  const duplicate: EditorElement = {
                    ...original,
                    id: nanoid(),
                    x: original.x + 20,
                    y: original.y + 20,
                    zIndex: Math.max(...state.elements.map((e) => e.zIndex), 0) + 1,
                  };
                  duplicated.push(duplicate);
                }
              });

              state.elements.push(...duplicated);
              state.selectedIds = duplicated.map((el) => el.id);
              state.meta.updatedAt = new Date().toISOString();
              
              // Sync to active page
              if (state.activePageId && state.pages) {
                const pageIndex = state.pages.findIndex((p) => p.id === state.activePageId);
                if (pageIndex !== -1) {
                  state.pages[pageIndex].elements = [...state.elements];
                }
              }
            })
          );
          get().pushHistory(get().getStateSnapshot());
        },

        setSelectedIds: (ids) =>
          set((state) => ({
            selectedIds: ids,
          })),

        clearSelection: () =>
          set((state) => ({
            selectedIds: [],
          })),

        bringToFront: (id) => {
          const state = get();
          const maxZ = Math.max(...state.elements.map((e) => e.zIndex || 0), 0);
          get().updateElement(id, { zIndex: maxZ + 1 });
          get().pushHistory(get().getStateSnapshot());
        },

        sendToBack: (id) => {
          const state = get();
          const minZ = Math.min(...state.elements.map((e) => e.zIndex || 0), 0);
          get().updateElement(id, { zIndex: minZ - 1 });
          get().pushHistory(get().getStateSnapshot());
        },

        bringForward: (id) => {
          const state = get();
          const element = state.elements.find((e) => e.id === id);
          if (element) {
            const nextZ = (element.zIndex || 0) + 1;
            get().updateElement(id, { zIndex: nextZ });
            get().pushHistory(get().getStateSnapshot());
          }
        },

        sendBackward: (id) => {
          const state = get();
          const element = state.elements.find((e) => e.id === id);
          if (element) {
            const nextZ = Math.max((element.zIndex || 0) - 1, 0);
            get().updateElement(id, { zIndex: nextZ });
            get().pushHistory(get().getStateSnapshot());
          }
        },

        setShowAlignmentGuides: (show: boolean) =>
          set((state) => ({
            showAlignmentGuides: show,
          })),

        // Enhanced snapping actions
        setSnapThreshold: (threshold: number) =>
          set(() => ({
            snapThreshold: threshold,
          })),

        setShowSnapGuides: (show: boolean) =>
          set(() => ({
            showSnapGuides: show,
          })),

        setActiveGuides: (guides: Guide[]) =>
          set(() => ({
            activeGuides: guides,
          })),

        setAlignmentBadge: (badge: { x: number; y: number; text: string } | null) =>
          set(() => ({
            alignmentBadge: badge,
          })),

        // Drawing mode
        setDrawingMode: (enabled: boolean) =>
          set((state) => ({
            isDrawingMode: enabled,
            // Clear selection when entering drawing mode
            selectedIds: enabled ? [] : state.selectedIds,
          })),

        setDrawingConfig: (config: { color?: string; strokeWidth?: number }) =>
          set((state) => ({
            drawingConfig: {
              ...state.drawingConfig,
              color: config.color ?? state.drawingConfig?.color ?? '#000000',
              strokeWidth: config.strokeWidth ?? state.drawingConfig?.strokeWidth ?? 5,
            },
          })),

        // Video editor mode
        setVideoEditorMode: (enabled: boolean) =>
          set((state) => ({
            videoEditorMode: enabled,
          })),

        // Convenience methods (inspired by Polotno's cleaner API)
        addTextElement: (props) => {
          const state = get();
          const canvas = state.canvas;
          const maxZ = Math.max(...state.elements.map((e) => e.zIndex), 0);
          
          // Use responsive font sizing if no fontSize is provided
          const defaultFontSize = props.fontSize ?? getDefaultTextSize(canvas.width, canvas.height);
          
          // Auto-width mode by default (like Figma) - don't set width/height
          // The canvas will measure and render based on actual text content
          const textContent = props.text || 'Text';
          const element: TextElement = {
            id: nanoid(),
            type: 'text',
            text: textContent, // Keep for backwards compatibility
            textJSON: textToJSON(textContent), // Initialize TipTap JSON
            x: props.x ?? canvas.width / 2 - 50,
            y: props.y ?? canvas.height / 2 - 20,
            // Don't set width/height - let it be auto-sized based on text content
            // Width will only be set when user manually resizes with side handles
            width: props.width, // undefined = auto-width mode
            height: props.height, // undefined = auto-height
            rotation: 0,
            zIndex: maxZ + 1,
            visible: true,
            fontSize: defaultFontSize,
            fontFamily: props.fontFamily || 'Inter',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fill: props.fill || '#000000',
            align: 'left',
            verticalAlign: 'top',
          };
          
          get().addElement(element);
          return element.id;
        },

        addImageElement: (props) => {
          const state = get();
          const canvas = state.canvas;
          const maxZ = Math.max(...state.elements.map((e) => e.zIndex), 0);
          
          // Use responsive sizing if no dimensions provided
          const defaultSize = props.width ?? getDefaultImageSize(canvas.width, canvas.height);
          const width = props.width ?? defaultSize;
          const height = props.height ?? defaultSize;
          
          const element: ImageElement = {
            id: nanoid(),
            type: 'image',
            src: props.src,
            x: props.x ?? canvas.width / 2 - width / 2,
            y: props.y ?? canvas.height / 2 - height / 2,
            width,
            height,
            rotation: 0,
            zIndex: maxZ + 1,
            visible: true,
            originalMeta: {
              width,
              height,
            },
          };
          
          get().addElement(element);
          return element.id;
        },

        addShapeElement: (props) => {
          const state = get();
          const canvas = state.canvas;
          const maxZ = Math.max(...state.elements.map((e) => e.zIndex), 0);
          
          // Use responsive sizing if no dimensions provided
          const defaultSize = getDefaultShapeSize(canvas.width, canvas.height);
          const width = props.width ?? defaultSize;
          const height = props.height ?? defaultSize;
          
          const element: ShapeElement = {
            id: nanoid(),
            type: 'shape',
            shapeType: props.shapeType,
            x: props.x ?? canvas.width / 2 - width / 2,
            y: props.y ?? canvas.height / 2 - height / 2,
            width,
            height,
            rotation: 0,
            zIndex: maxZ + 1,
            visible: true,
            fill: props.fill || '#3b82f6',
            stroke: props.stroke,
            strokeWidth: props.strokeWidth ?? 0,
          };
          
          get().addElement(element);
          return element.id;
        },

        getActiveCanvas: () => {
          return get().canvas;
        },

        pushHistory: (state) => {
          const current = get();
          const newStack = current.history.stack.slice(0, current.history.index + 1);
          newStack.push({ ...state });
          
          // Limit history size
          if (newStack.length > MAX_HISTORY_SIZE) {
            newStack.shift();
          } else {
            // Only increment index if we're not in the middle of history
            if (current.history.index < current.history.stack.length - 1) {
              // User was browsing history, so we replace future history
            }
          }

          set({
            history: {
              stack: newStack,
              index: newStack.length - 1,
              maxSize: MAX_HISTORY_SIZE,
            },
          });
        },

        undo: () => {
          const state = get();
          if (state.history.index <= 0) return;
          const prev = state.history.stack[state.history.index - 1];
          if (prev) {
            set({
              elements: JSON.parse(JSON.stringify(prev)),
              history: {
                ...state.history,
                index: state.history.index - 1,
              },
              selectedIds: [],
            });
          }
        },

        redo: () => {
          const state = get();
          if (state.history.index >= state.history.stack.length - 1) return;
          const next = state.history.stack[state.history.index + 1];
          if (next) {
            set({
              elements: JSON.parse(JSON.stringify(next)),
              history: {
                ...state.history,
                index: state.history.index + 1,
              },
              selectedIds: [],
            });
          }
        },

        canUndo: () => {
          const state = get();
          return state.history.index > 0;
        },

        canRedo: () => {
          const state = get();
          return state.history.index < state.history.stack.length - 1;
        },

        addAsset: (asset) =>
          set((state) => ({
            assets: [...state.assets, asset],
          })),

        removeAsset: (id) =>
          set((state) => ({
            assets: state.assets.filter((a) => a.id !== id),
          })),

        updateMeta: (meta) =>
          set((state) => ({
            meta: { ...state.meta, ...meta, updatedAt: new Date().toISOString() },
          })),

        saveTemplate: (name, thumbnail, tags, category) => {
          const state = get();
          const template: Template = {
            id: nanoid(),
            name,
            thumbnail,
            canvas: { ...state.canvas },
            elements: JSON.parse(JSON.stringify(state.elements)),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags,
            category,
          };
          
          // Save to localStorage
          if (typeof window !== 'undefined') {
            const templates = JSON.parse(localStorage.getItem('kanva-templates') || '[]');
            templates.push(template);
            localStorage.setItem('kanva-templates', JSON.stringify(templates));
          }
          
          return template;
        },

        loadTemplate: (templateId) => {
          if (typeof window === 'undefined') return;
          const templates = JSON.parse(localStorage.getItem('kanva-templates') || '[]');
          const template = templates.find((t: Template) => t.id === templateId);
          if (template) {
            set({
              canvas: { ...template.canvas },
              elements: JSON.parse(JSON.stringify(template.elements)),
              selectedIds: [],
              meta: {
                projectName: template.name,
                updatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
              },
            });
            get().pushHistory(get().getStateSnapshot());
          }
        },

        getTemplates: () => {
          if (typeof window === 'undefined') return [];
          const templates = JSON.parse(localStorage.getItem('kanva-templates') || '[]');
          return templates.sort((a: Template, b: Template) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        },

        deleteTemplate: (templateId) => {
          if (typeof window === 'undefined') return;
          const templates = JSON.parse(localStorage.getItem('kanva-templates') || '[]');
          const filtered = templates.filter((t: Template) => t.id !== templateId);
          localStorage.setItem('kanva-templates', JSON.stringify(filtered));
        },

        reset: () => set(initialState),

        getStateSnapshot: () => {
          const state = get();
          return {
            canvas: state.canvas,
            elements: state.elements,
            selectedIds: state.selectedIds,
            history: state.history,
            assets: state.assets,
            meta: state.meta,
          };
        },

        // Grouping actions
        groupElements: (ids) => {
          if (ids.length < 2) return null;
          
          const groupId = `group-${nanoid()}`;
          
          set(
            produce((state: EditorState) => {
              ids.forEach((id) => {
                const element = state.elements.find((el) => el.id === id);
                if (element) {
                  element.groupId = groupId;
                }
              });
              state.meta.updatedAt = new Date().toISOString();
            })
          );
          
          get().pushHistory(get().getStateSnapshot());
          return groupId;
        },

        ungroupElements: (groupId) => {
          set(
            produce((state: EditorState) => {
              state.elements.forEach((element) => {
                if (element.groupId === groupId) {
                  element.groupId = undefined;
                }
              });
              state.meta.updatedAt = new Date().toISOString();
            })
          );
          
          get().pushHistory(get().getStateSnapshot());
        },

        getGroupElements: (groupId) => {
          const state = get();
          return state.elements.filter((el) => el.groupId === groupId);
        },

        getElementGroup: (elementId) => {
          const state = get();
          const element = state.elements.find((el) => el.id === elementId);
          return element?.groupId || null;
        },

        getSelectedGroup: () => {
          const state = get();
          if (state.selectedIds.length === 0) return null;
          
          const selectedElements = state.elements.filter((el) => 
            state.selectedIds.includes(el.id)
          );
          
          // Check if all selected elements have the same groupId
          const groupIds = new Set(selectedElements.map((el) => el.groupId).filter(Boolean));
          
          if (groupIds.size === 1) {
            return Array.from(groupIds)[0] as string;
          }
          
          return null;
        },

        // Multi-page actions
        addPage: (name) => {
          const state = get();
          const newPageId = nanoid();
          const pageCount = state.pages?.length || 0;
          const newPage: Page = {
            id: newPageId,
            name: name || `Page ${pageCount + 1}`,
            canvas: { ...initialCanvas },
            elements: [],
            order: pageCount,
          };
          
          set(
            produce((state: EditorState) => {
              if (!state.pages) state.pages = [];
              state.pages.push(newPage);
              state.meta.updatedAt = new Date().toISOString();
            })
          );
          
          return newPageId;
        },

        deletePage: (pageId) => {
          const state = get();
          if (!state.pages || state.pages.length <= 1) {
            // Don't delete if it's the last page
            return;
          }
          
          set(
            produce((state: EditorState) => {
              if (!state.pages) return;
              
              const pageIndex = state.pages.findIndex((p) => p.id === pageId);
              if (pageIndex === -1) return;
              
              // Remove the page
              state.pages.splice(pageIndex, 1);
              
              // Reorder remaining pages
              state.pages.forEach((page, index) => {
                page.order = index;
              });
              
              // If deleted page was active, switch to first page
              if (state.activePageId === pageId) {
                state.activePageId = state.pages[0]?.id;
                const newActivePage = state.pages[0];
                if (newActivePage) {
                  state.canvas = { ...newActivePage.canvas };
                  state.elements = [...newActivePage.elements];
                  state.selectedIds = [];
                }
              }
              
              state.meta.updatedAt = new Date().toISOString();
            })
          );
        },

        duplicatePage: (pageId) => {
          const state = get();
          const page = state.pages?.find((p) => p.id === pageId);
          if (!page) return '';
          
          const newPageId = nanoid();
          const duplicatedPage: Page = {
            ...page,
            id: newPageId,
            name: `${page.name} (Copy)`,
            elements: JSON.parse(JSON.stringify(page.elements)).map((el: EditorElement) => ({
              ...el,
              id: nanoid(),
            })),
            order: (state.pages?.length || 0),
          };
          
          set(
            produce((state: EditorState) => {
              if (!state.pages) state.pages = [];
              state.pages.push(duplicatedPage);
              state.meta.updatedAt = new Date().toISOString();
            })
          );
          
          return newPageId;
        },

        setActivePage: (pageId) => {
          const state = get();
          const page = state.pages?.find((p) => p.id === pageId);
          if (!page) return;
          
          // Save current page state before switching
          if (state.activePageId && state.pages) {
            const currentPageIndex = state.pages.findIndex((p) => p.id === state.activePageId);
            if (currentPageIndex !== -1) {
              set(
                produce((state: EditorState) => {
                  if (!state.pages) return;
                  state.pages[currentPageIndex].canvas = { ...state.canvas };
                  state.pages[currentPageIndex].elements = [...state.elements];
                })
              );
            }
          }
          
          // Switch to new page
          set({
            activePageId: pageId,
            canvas: { ...page.canvas },
            elements: [...page.elements],
            selectedIds: [],
          });
        },

        renamePage: (pageId, name) => {
          set(
            produce((state: EditorState) => {
              if (!state.pages) return;
              const page = state.pages.find((p) => p.id === pageId);
              if (page) {
                page.name = name;
                state.meta.updatedAt = new Date().toISOString();
              }
            })
          );
        },

        reorderPages: (pageIds) => {
          set(
            produce((state: EditorState) => {
              if (!state.pages) return;
              const reordered = pageIds
                .map((id) => state.pages?.find((p) => p.id === id))
                .filter((p): p is Page => p !== undefined);
              
              reordered.forEach((page, index) => {
                page.order = index;
              });
              
              state.pages = reordered;
              state.meta.updatedAt = new Date().toISOString();
            })
          );
        },

        getActivePage: () => {
          const state = get();
          return state.pages?.find((p) => p.id === state.activePageId);
        },

        getAllPages: () => {
          const state = get();
          return state.pages || [];
        },
      }),
      {
        name: 'kanva-editor-storage',
        partialize: (state) => ({
          canvas: {
            ...state.canvas,
            background: {
              color: state.canvas.background?.color || '#ffffff',
            },
          },
          elements: state.elements,
          assets: state.assets,
          meta: state.meta,
          pages: state.pages,
          activePageId: state.activePageId,
        }),
        // Reset to initial state if persisted state is invalid
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Ensure background is white if not set
            if (!state.canvas.background?.color) {
              state.canvas.background = { color: '#ffffff' };
            }
            // Ensure elements is always an array (fix hydration issues)
            if (!Array.isArray(state.elements)) {
              state.elements = [];
            }
            // Ensure pages array exists and has at least one page
            if (!Array.isArray(state.pages) || state.pages.length === 0) {
              const pageId = nanoid();
              state.pages = [{
                id: pageId,
                name: 'Page 1',
                canvas: state.canvas,
                elements: state.elements,
                order: 0,
              }];
              state.activePageId = pageId;
            }
            // Ensure activePageId is set
            if (!state.activePageId && state.pages.length > 0) {
              state.activePageId = state.pages[0].id;
            }
          }
        },
      }
    ),
    { name: 'EditorStore' }
  )
);

