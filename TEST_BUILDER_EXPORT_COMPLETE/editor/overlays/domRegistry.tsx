"use client";

import React, { createContext, useContext, useRef, ReactNode } from 'react';

interface DomRegistryContextValue {
  register: (id: string, el: HTMLElement | null) => void;
  get: (id: string) => HTMLElement | null;
}

const DomRegistryContext = createContext<DomRegistryContextValue | null>(null);

interface DomRegistryProviderProps {
  children: ReactNode;
}

export function DomRegistryProvider({ children }: DomRegistryProviderProps) {
  const registryRef = useRef<Map<string, HTMLElement>>(new Map());

  const register = (id: string, el: HTMLElement | null) => {
    if (el) {
      registryRef.current.set(id, el);
    } else {
      registryRef.current.delete(id);
    }
  };

  const get = (id: string): HTMLElement | null => {
    return registryRef.current.get(id) || null;
  };

  return (
    <DomRegistryContext.Provider value={{ register, get }}>
      {children}
    </DomRegistryContext.Provider>
  );
}

export function useDomRegistry(): DomRegistryContextValue {
  const context = useContext(DomRegistryContext);
  if (!context) {
    throw new Error('useDomRegistry must be used within DomRegistryProvider');
  }
  return context;
}
