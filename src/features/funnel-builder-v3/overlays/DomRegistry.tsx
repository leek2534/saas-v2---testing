"use client";

import React from "react";
import { create } from "zustand";

type RegistryState = {
  map: Map<string, HTMLElement>;
  register: (id: string, el: HTMLElement | null) => void;
  get: (id: string) => HTMLElement | undefined;
};

const useRegistry = create<RegistryState>((set, get) => ({
  map: new Map(),
  register: (id, el) =>
    set((s) => {
      const next = new Map(s.map);
      if (el) next.set(id, el);
      else next.delete(id);
      return { map: next };
    }),
  get: (id) => get().map.get(id),
}));

const Ctx = React.createContext<typeof useRegistry | null>(null);

export function DomRegistryProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={useRegistry}>{children}</Ctx.Provider>;
}

export function useDomRegistry<T>(selector: (s: RegistryState) => T): T {
  const store = React.useContext(Ctx);
  if (!store) throw new Error("useDomRegistry must be used within DomRegistryProvider");
  return store(selector);
}
