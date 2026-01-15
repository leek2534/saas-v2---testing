import { StateCreator } from 'zustand';

export interface LayoutSlice {
  sections: any[];
  addSection: (section: any) => void;
  updateSection: (id: string, updates: any) => void;
  removeSection: (id: string) => void;
}

export const createLayoutSlice: StateCreator<LayoutSlice> = (set) => ({
  sections: [],
  addSection: (section) =>
    set((state) => ({
      sections: [...state.sections, section],
    })),
  updateSection: (id, updates) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  removeSection: (id) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
    })),
});
