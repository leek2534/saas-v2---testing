import { StateCreator } from 'zustand';

export interface ClipboardSlice {
  clipboard: any | null;
  clipboardType: string | null;
  copy: (item: any, type: string) => void;
  paste: () => any | null;
  clearClipboard: () => void;
}

export const createClipboardSlice: StateCreator<ClipboardSlice> = (set, get) => ({
  clipboard: null,
  clipboardType: null,
  copy: (item, type) =>
    set({
      clipboard: item,
      clipboardType: type,
    }),
  paste: () => {
    const { clipboard } = get();
    return clipboard;
  },
  clearClipboard: () =>
    set({
      clipboard: null,
      clipboardType: null,
    }),
});
