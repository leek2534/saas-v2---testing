import { StateCreator } from 'zustand';

export interface HistorySlice {
  past: any[];
  future: any[];
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  pushHistory: (state: any) => void;
  clearHistory: () => void;
}

export const createHistorySlice: StateCreator<HistorySlice> = (set) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,
  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return {
        past: newPast,
        future: [state, ...state.future],
        canUndo: newPast.length > 0,
        canRedo: true,
      };
    }),
  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state],
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
      };
    }),
  pushHistory: (snapshot) =>
    set((state) => ({
      past: [...state.past, snapshot],
      future: [],
      canUndo: true,
      canRedo: false,
    })),
  clearHistory: () =>
    set({
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    }),
});
