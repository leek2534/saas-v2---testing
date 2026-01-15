import { StateCreator } from 'zustand';

export interface SelectionSlice {
  selectedId: string | null;
  selectedType: string | null;
  setSelection: (id: string | null, type?: string | null) => void;
  clearSelection: () => void;
}

export const createSelectionSlice: StateCreator<SelectionSlice> = (set) => ({
  selectedId: null,
  selectedType: null,
  setSelection: (id, type = null) =>
    set({
      selectedId: id,
      selectedType: type,
    }),
  clearSelection: () =>
    set({
      selectedId: null,
      selectedType: null,
    }),
});
