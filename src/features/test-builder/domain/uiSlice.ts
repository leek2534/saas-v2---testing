import { StateCreator } from 'zustand';

export interface UISlice {
  hoveredId: string | null;
  hoveredType: string | null;
  isDragging: boolean;
  isResizing: boolean;
  showGrid: boolean;
  zoom: number;
  setHover: (id: string | null, type?: string | null) => void;
  clearHover: () => void;
  setDragging: (isDragging: boolean) => void;
  setResizing: (isResizing: boolean) => void;
  toggleGrid: () => void;
  setZoom: (zoom: number) => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  hoveredId: null,
  hoveredType: null,
  isDragging: false,
  isResizing: false,
  showGrid: false,
  zoom: 1,
  setHover: (id, type = null) =>
    set({
      hoveredId: id,
      hoveredType: type,
    }),
  clearHover: () =>
    set({
      hoveredId: null,
      hoveredType: null,
    }),
  setDragging: (isDragging) => set({ isDragging }),
  setResizing: (isResizing) => set({ isResizing }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  setZoom: (zoom) => set({ zoom }),
});
