"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { EditorState, EditorAction, editorReducer, createInitialState } from "./editorStore";

interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

const EditorContext = createContext<EditorContextValue | null>(null);

interface EditorProviderProps {
  children: ReactNode;
  initialState?: EditorState;
}

export function EditorProvider({ children, initialState }: EditorProviderProps) {
  const [state, dispatch] = useReducer(editorReducer, initialState || createInitialState());
  return <EditorContext.Provider value={{ state, dispatch }}>{children}</EditorContext.Provider>;
}

export function useEditor(): EditorContextValue {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useEditor must be used within EditorProvider");
  return context;
}
