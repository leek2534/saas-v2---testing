"use client";

import { create } from "zustand";
import { createDemoDocument } from "./templates/createDemoDocument";
import { id } from "./ids";
import type {
  AnyNode,
  ColumnNode,
  EditorTree,
  ElementNode,
  NodeType,
  PopupAnimation,
  PopupDefinition,
  PopupFrequency,
  PopupTargeting,
  PopupTrigger,
  RowNode,
  SectionNode,
  ViewportMode,
} from "./types";

type Mode = "edit" | "preview";
type Workspace = "page" | "popup";

type HoverPath = {
  sectionId: string | null;
  rowId: string | null;
  columnId: string | null;
  elementId: string | null;
};


type StepType = "page" | "checkout" | "offer" | "thankyou" | "optin" | "survey" | "cart" | "confirmation";

type StepInfo = {
  _id: string;
  funnelId: string;
  orgId: string;
  pageId?: string;
  type: StepType;
  name: string;
  nextStepId?: string | null;
  config?: string | null;
};

type StepContext = {
  teamSlug: string;
  orgId: string;
  funnelId: string;
  steps: StepInfo[];
  currentStepId: string | null;
  /** Optional: page trees keyed by pageId (used for step warnings in the editor UI). */
  pageTreesById?: Record<string, string>;
};

type InsertPosition = {
  parentId: string | null;
  index?: number;
  /** When inserting a root section, choose which canvas to insert into. */
  popupId?: string;
};

type ExportPayloadV1 = {
  version: 1;
  tree: {
    rootIds: string[];
    nodes: Record<string, AnyNode>;
  };
};

type ExportPayloadV2 = {
  version: 2;
  tree: EditorTree;
};

type ExportPayload = ExportPayloadV1 | ExportPayloadV2;

const STORAGE_KEY = "funnel-builder-v3:document:v2";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function asTreeV2(payload: unknown): EditorTree | null {
  const normalize = (tree: EditorTree): EditorTree => {
    const nodes: Record<string, AnyNode> = { ...(tree.nodes ?? {}) } as any;

    for (const [idKey, rawNode] of Object.entries(nodes)) {
      const node: any = { ...(rawNode as any) };

      if (node.type === "section" || node.type === "row" || node.type === "column") {
        const children =
          (node as any).children ??
          (node as any).childIds ??
          (node as any).childrenIds ??
          [];
        node.children = Array.isArray(children) ? children : [];
        delete node.childIds;
        delete node.childrenIds;
      }

      nodes[idKey] = node;
    }

    return {
      pageRootIds: Array.isArray((tree as any).pageRootIds) ? [...(tree as any).pageRootIds] : [],
      nodes,
      popups: (tree as any).popups ?? {},
    };
  };

  try {
    const p: any = payload;

    // v2 payload wrapper { version: 2, tree: ... }
    if (p && typeof p === "object" && "version" in p) {
      if (p.version === 2) {
        const tree = p.tree;
        if (!tree || typeof tree !== "object") return null;
        if (!Array.isArray(tree.pageRootIds)) return null;
        if (typeof tree.nodes !== "object") return null;
        if (typeof tree.popups !== "object") return null;
        return normalize(tree as EditorTree);
      }

      // Backwards compatibility with v1 exports.
      if (p.version === 1) {
        const v1 = p as ExportPayloadV1;
        if (!v1.tree || !Array.isArray(v1.tree.rootIds)) return null;
        return normalize({
          pageRootIds: [...v1.tree.rootIds],
          nodes: v1.tree.nodes ?? {},
          popups: {},
        });
      }

      return null;
    }

    // Accept raw tree shape (legacy server payloads)
    if (p && typeof p === "object" && Array.isArray(p.pageRootIds) && typeof p.nodes === "object") {
      return normalize(p as EditorTree);
    }

    return null;
  } catch {
    return null;
  }
}

function defaultPopupDefinition(name = "New Popup"): PopupDefinition {
  const popupId = id("popup");
  return {
    id: popupId,
    name,
    rootIds: [],
    enabled: true,
    triggers: [{ type: "on_page_load" }],
    targeting: { mode: "all", include: [], exclude: [] },
    frequency: { mode: "every_visit", maxShows: 0 },
    animation: "fade",
    style: {
      overlayColor: "rgba(0,0,0,0.5)",
      background: "#ffffff",
      maxWidth: 560,
      padding: 24,
      borderRadius: 16,
      showClose: true,
    },
  };
}

function pathMatches(targeting: PopupTargeting, pathname: string) {
  const includes = (patterns: string[]) => {
    if (!patterns.length) return false;
    return patterns.some((p) => {
      const s = p.trim();
      if (!s) return false;
      // Regex syntax: /.../ or /.../i
      if (s.startsWith("/") && s.lastIndexOf("/") > 0) {
        const lastSlash = s.lastIndexOf("/");
        const body = s.slice(1, lastSlash);
        const flags = s.slice(lastSlash + 1);
        try {
          return new RegExp(body, flags).test(pathname);
        } catch {
          return false;
        }
      }
      return pathname.includes(s);
    });
  };

  const includeHit = includes(targeting.include);
  const excludeHit = includes(targeting.exclude);

  if (targeting.mode === "all") return !excludeHit;
  if (targeting.mode === "include") return includeHit && !excludeHit;
  return !excludeHit; // "exclude"
}

type FrequencyState = { count: number; lastShownAt: number | null };

function freqKey(popupId: string) {
  return `funnel-builder-v3:popup:freq:${popupId}`;
}

function readFreq(popupId: string): FrequencyState {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(freqKey(popupId)) : null;
    if (!raw) return { count: 0, lastShownAt: null };
    const parsed = JSON.parse(raw);
    return {
      count: typeof parsed?.count === "number" ? parsed.count : 0,
      lastShownAt: typeof parsed?.lastShownAt === "number" ? parsed.lastShownAt : null,
    };
  } catch {
    return { count: 0, lastShownAt: null };
  }
}

function writeFreq(popupId: string, next: FrequencyState) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(freqKey(popupId), JSON.stringify(next));
  } catch {
    // ignore
  }
}

function frequencyAllowsAuto(popupId: string, frequency: PopupFrequency) {
  const state = readFreq(popupId);
  const maxShows = frequency.maxShows ?? 0;
  if (maxShows > 0 && state.count >= maxShows) return false;

  if (frequency.mode === "every_visit") return true;
  if (frequency.mode === "once") return state.count === 0;
  if (frequency.mode === "cooldown") {
    const cooldownHours = frequency.cooldownHours ?? 24;
    if (!state.lastShownAt) return true;
    const ms = cooldownHours * 60 * 60 * 1000;
    return Date.now() - state.lastShownAt >= ms;
  }
  return true;
}

function recordShown(popupId: string) {
  const prev = readFreq(popupId);
  writeFreq(popupId, { count: prev.count + 1, lastShownAt: Date.now() });
}

function canHaveChildren(type: NodeType) {
  return type === "section" || type === "row" || type === "column";
}

function findAncestors(nodes: Record<string, AnyNode>, nodeId: string) {
  const out: string[] = [];
  let current = nodes[nodeId];
  while (current?.parentId) {
    out.push(current.parentId);
    current = nodes[current.parentId];
  }
  return out;
}

function collectSubtree(nodes: Record<string, AnyNode>, rootId: string): string[] {
  const visited = new Set<string>();
  const stack: string[] = [rootId];
  while (stack.length) {
    const id = stack.pop()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const n = nodes[id];
    const children = (n as any)?.children || (n as any)?.childIds || [];
    if (Array.isArray(children)) {
      for (const childId of children) stack.push(childId);
    }
  }
  return Array.from(visited);
}

export type FunnelEditorState = {
  mode: Mode;
  viewport: ViewportMode;
  workspace: Workspace;
  activePopupId: string | null;

  tree: EditorTree;
  pageId: string | null;
  selectedId: string | null;
  selectedPopupId: string | null;
  editingElementId: string | null;
  hovered: HoverPath;
  isDraggingElement: boolean;
  isPlaceholderMode: boolean;

  openPopupId: string | null;
  canvasEl: HTMLDivElement | null;

  // Inspector state (3-state: open/peek/collapsed)
  inspectorState: "open" | "peek" | "collapsed";
  inspectorUserPinned: boolean;
  inspectorFocusSection: string | null;

  // Step settings / funnel context
  rightPanelView: "inspector" | "stepSettings";
  stepContext: StepContext | null;
  activeStepId: string | null;

  init: () => void;
  setViewport: (viewport: ViewportMode) => void;
  togglePreview: () => void;
  setCanvasEl: (el: HTMLDivElement | null) => void;

  select: (nodeId: string | null, options?: { reason?: "user" | "system" }) => void;
  selectPopup: (popupId: string | null) => void;
  setEditingElement: (elementId: string | null) => void;
  setHovered: (hover: Partial<HoverPath>) => void;
  clearHover: () => void;

  setInspectorState: (state: "open" | "peek" | "collapsed", userAction?: boolean) => void;
  toggleInspector: () => void;
  revealInspectorFor: (reason: "create" | "context_edit" | "normal_select") => void;
  setInspectorFocusSection: (section: string | null) => void;

  setStepContext: (ctx: StepContext | null) => void;
  openStepSettings: (stepId: string) => void;
  closeStepSettings: () => void;

  setWorkspacePage: () => void;
  setWorkspacePopup: (popupId: string) => void;
  editPopup: (popupId: string) => void;
  backToPage: () => void;

  /** Popups */
  createPopup: (template?: "blank" | "coupon") => void;
  createCouponPopup: () => void;
  deletePopup: (popupId: string) => void;
  updatePopup: (popupId: string, patch: Partial<PopupDefinition>) => void;
  updatePopupTriggers: (popupId: string, triggers: PopupTrigger[]) => void;
  updatePopupTargeting: (popupId: string, targeting: PopupTargeting) => void;
  updatePopupFrequency: (popupId: string, frequency: PopupFrequency) => void;
  updatePopupAnimation: (popupId: string, animation: PopupAnimation) => void;
  updatePopupStyle: (popupId: string, style: Partial<PopupDefinition["style"]>) => void;

  openPopup: (popupId: string, reason?: "auto" | "manual") => void;
  closePopup: () => void;

  addSection: () => void;
  addSectionToActivePopup: () => void;
  addRow: () => void;
  addColumn: () => void;
  addElement: (kind: ElementNode["props"]["kind"]) => void;
  addElementBelow: (kind: ElementNode["props"]["kind"]) => void;
  insertTemplate: (structure: any) => void;
  duplicateElement: (elementId: string) => void;
  updateNode: (nodeId: string, patch: Partial<AnyNode>) => void;
  updateNodeProps: (nodeId: string, propsPatch: Record<string, any>) => void;
  moveNode: (nodeId: string, to: InsertPosition) => void;
  deleteNode: (nodeId: string) => void;

  /** Column resizing */
  resizeAdjacentColumns: (leftColumnId: string, rightColumnId: string, newLeftWidth: number, newRightWidth: number) => void;

  /** Persistence */
  exportJson: () => string;
  importJson: (json: string) => { ok: true } | { ok: false; error: string };
  saveToLocal: () => void;
  loadFromLocal: () => { ok: true } | { ok: false; error: string };
  saveToConvex: () => Promise<void>;
  loadFromConvex: (pageId: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  setPageId: (pageId: string | null) => void;
  reset: () => void;
};

export const useFunnelEditorStore = create<FunnelEditorState>((set, get) => {
  function insertNode(node: AnyNode, pos: InsertPosition) {
    const { tree } = get();
    const nodes = { ...tree.nodes, [node.id]: node };

    // Root insertion (sections only) goes into either the page or a popup.
    if (!pos.parentId) {
      if (node.type !== "section") throw new Error("Only sections can be inserted at root");
      if (pos.popupId) {
        const popup = tree.popups[pos.popupId];
        if (!popup) throw new Error("Popup not found");
        const rootIds = [...popup.rootIds];
        const index = pos.index ?? rootIds.length;
        rootIds.splice(index, 0, node.id);
        return {
          ...tree,
          nodes,
          popups: {
            ...tree.popups,
            [pos.popupId]: { ...popup, rootIds },
          },
        };
      }

      const pageRootIds = [...tree.pageRootIds];
      const index = pos.index ?? pageRootIds.length;
      pageRootIds.splice(index, 0, node.id);
      return { ...tree, nodes, pageRootIds };
    }

    // Child insertion into existing container.
    const parent = nodes[pos.parentId];
    if (!parent) throw new Error("Parent not found");
    if (!canHaveChildren(parent.type)) throw new Error("Parent cannot have children");

    const parentWithChildren = parent as SectionNode | RowNode | ColumnNode;
    const children = [...(parentWithChildren.children || [])];
    const index = pos.index ?? children.length;
    children.splice(index, 0, node.id);

    nodes[parent.id] = { ...parentWithChildren, children } as AnyNode;
    return { ...tree, nodes };
  }

  function removeFromRoots(tree: EditorTree, nodeId: string) {
    // Remove from page roots.
    const idx = tree.pageRootIds.indexOf(nodeId);
    if (idx >= 0) {
      const next = [...tree.pageRootIds];
      next.splice(idx, 1);
      return { ...tree, pageRootIds: next };
    }
    // Remove from any popup roots.
    const popups: Record<string, PopupDefinition> = { ...tree.popups };
    let changed = false;
    for (const [pid, popup] of Object.entries(popups)) {
      const i = popup.rootIds.indexOf(nodeId);
      if (i >= 0) {
        const rootIds = [...popup.rootIds];
        rootIds.splice(i, 1);
        popups[pid] = { ...popup, rootIds };
        changed = true;
      }
    }
    return changed ? { ...tree, popups } : tree;
  }

  function detachFromParent(tree: EditorTree, nodeId: string) {
    const node = tree.nodes[nodeId];
    if (!node) return tree;
    if (!node.parentId) return removeFromRoots(tree, nodeId);
    const parent = tree.nodes[node.parentId];
    if (!parent || !canHaveChildren(parent.type)) return tree;
    const p = parent as SectionNode | RowNode | ColumnNode;
    const children = p.children || [];
    const idx = children.indexOf(nodeId);
    if (idx < 0) return tree;
    const nextChildren = [...children];
    nextChildren.splice(idx, 1);
    return {
      ...tree,
      nodes: {
        ...tree.nodes,
        [p.id]: { ...p, children: nextChildren } as AnyNode,
      },
    };
  }

  function updateNode(nodeId: string, patch: Partial<AnyNode>) {
    const { tree } = get();
    const existing = tree.nodes[nodeId];
    if (!existing) return;
    set({
      tree: {
        ...tree,
        nodes: {
          ...tree.nodes,
          [nodeId]: { ...existing, ...patch } as AnyNode,
        },
      },
    });
  }

  function createCouponPopupNodes(popupId: string) {
    const sectionId = id("section");
    const rowId = id("row");
    const colId = id("col");
    const hId = id("el");
    const pId = id("el");
    const couponId = id("el");
    const btnId = id("el");

    const section: SectionNode = {
      id: sectionId,
      type: "section",
      parentId: null,
      children: [rowId],
      props: {
        background: "transparent",
        paddingY: 0,
        paddingX: 0,
        maxWidth: 560,
        gapToNext: 0,
      },
    };

    const row: RowNode = {
      id: rowId,
      type: "row",
      parentId: sectionId,
      children: [colId],
      props: {
        columns: 1,
        paddingY: 0,
        gapX: 16,
        gapY: 16,
        background: "transparent",
      },
    };

    const col: ColumnNode = {
      id: colId,
      type: "column",
      parentId: rowId,
      children: [hId, pId, couponId, btnId],
      props: {
        widthPct: 100,
        paddingY: 0,
        paddingX: 0,
        background: "transparent",
      },
    };

    const heading: ElementNode = {
      id: hId,
      type: "element",
      parentId: colId,
      props: {
        kind: "heading",
        align: "center",
        text: {
          type: "doc",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Your 20% Coupon" }] }],
        },
        style: { fontSize: 34, color: "#111827", fontWeight: 800, lineHeight: 1.1 },
        gapToNext: 12,
      },
    };

    const paragraph: ElementNode = {
      id: pId,
      type: "element",
      parentId: colId,
      props: {
        kind: "paragraph",
        align: "center",
        text: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Copy the code below and use it at checkout." }],
            },
          ],
        },
        style: { fontSize: 16, color: "#374151", lineHeight: 1.6 },
        gapToNext: 16,
      },
    };

    const coupon: ElementNode = {
      id: couponId,
      type: "element",
      parentId: colId,
      props: {
        kind: "couponCode",
        align: "center",
        code: "SAVE20",
        label: "Coupon code",
        copyButtonText: "Copy",
        copiedText: "Copied!",
        style: {
          background: "#F3F4F6",
          borderColor: "#E5E7EB",
          textColor: "#111827",
          codeFontSize: 20,
        },
        gapToNext: 20,
      },
    };

    const button: ElementNode = {
      id: btnId,
      type: "element",
      parentId: colId,
      props: {
        kind: "button",
        align: "center",
        text: "Continue",
        action: "closePopup",
        style: {
          background: "#111827",
          color: "#ffffff",
          paddingY: 12,
          paddingX: 18,
          borderRadius: 10,
          fontSize: 16,
          fontWeight: 600,
        },
        gapToNext: 0,
      },
    };

    return {
      rootSectionId: sectionId,
      nodes: [section, row, col, heading, paragraph, coupon, button] as AnyNode[],
    };
  }

  return {
    mode: "edit",
    viewport: "desktop",
    workspace: "page",
    activePopupId: null,

    tree: { pageRootIds: [], nodes: {}, popups: {} },
    pageId: null,
    selectedId: null,
    selectedPopupId: null,
    editingElementId: null,
    hovered: { sectionId: null, rowId: null, columnId: null, elementId: null },
    isDraggingElement: false,
    isPlaceholderMode: false,
    openPopupId: null,
    canvasEl: null,

    // Inspector defaults (load from localStorage)
    inspectorState: (() => {
      if (typeof window === "undefined") return "open";
      const saved = localStorage.getItem("fb:inspectorState");
      return (saved as any) || "open";
    })(),
    inspectorUserPinned: (() => {
      if (typeof window === "undefined") return false;
      return localStorage.getItem("fb:inspectorPinned") === "1";
    })(),
    inspectorFocusSection: null,

    rightPanelView: "inspector",
    stepContext: null,
    activeStepId: null,

    init: () => {
      set({ tree: createDemoDocument() });
    },

    setViewport: (viewport) => set({ viewport }),

    setCanvasEl: (el) => set({ canvasEl: el }),

    togglePreview: () => {
      const next = get().mode === "edit" ? "preview" : "edit";
      set({
        mode: next,
        hovered: { sectionId: null, rowId: null, columnId: null, elementId: null },
        editingElementId: null,
        openPopupId: null,
      });
    },

    select: (nodeId, options) => {
      // Selection just updates content, doesn't change panel state
      set({ selectedId: nodeId });
      
      // Auto-reveal handled separately by revealInspectorFor
      if (options?.reason === "system") {
        get().revealInspectorFor("create");
      }
    },

    selectPopup: (popupId) => set({ selectedPopupId: popupId, selectedId: null }),

    setEditingElement: (elementId) => set({ editingElementId: elementId }),

    setHovered: (hover) => set((s) => ({ hovered: { ...s.hovered, ...hover } })),
    clearHover: () => set({ hovered: { sectionId: null, rowId: null, columnId: null, elementId: null } }),

    setInspectorState: (state, userAction = false) => {
      const current = get();
      set({
        inspectorState: state,
        inspectorUserPinned: userAction ? true : current.inspectorUserPinned,
      });
      
      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("fb:inspectorState", state);
        if (userAction) {
          localStorage.setItem("fb:inspectorPinned", "1");
        }
      }
    },

    toggleInspector: () => {
      const { inspectorState } = get();
      const next =
        inspectorState === "open" ? "peek" :
        inspectorState === "peek" ? "collapsed" :
        "open";
      get().setInspectorState(next, true);
    },

    revealInspectorFor: (reason) => {
      const { inspectorState, inspectorUserPinned } = get();
      
      // Never fight user intent
      if (inspectorUserPinned && inspectorState !== "open") {
        return;
      }
      
      // System-driven reveals
      if (reason === "create") {
        get().setInspectorState("peek", false); // gentle reveal
      } else if (reason === "context_edit") {
        get().setInspectorState("open", false);
      }
      // "normal_select" does nothing
    },

    setInspectorFocusSection: (section) => {
      set({ inspectorFocusSection: section });
    },

    setStepContext: (ctx) => {
      set({ stepContext: ctx });
    },

    openStepSettings: (stepId) => {
      set({ rightPanelView: "stepSettings", activeStepId: stepId });
    },

    closeStepSettings: () => {
      set({ rightPanelView: "inspector", activeStepId: null });
    },

    setWorkspacePage: () => {
      set({
        workspace: "page",
        activePopupId: null,
        selectedPopupId: null,
        selectedId: null,
        openPopupId: null,
        hovered: { sectionId: null, rowId: null, columnId: null, elementId: null },
      });
    },

    setWorkspacePopup: (popupId) => {
      const popup = get().tree.popups[popupId];
      if (!popup) return;
      set({
        workspace: "popup",
        activePopupId: popupId,
        selectedPopupId: popupId,
        selectedId: null,
        openPopupId: null,
        hovered: { sectionId: null, rowId: null, columnId: null, elementId: null },
      });
    },

    editPopup: (popupId) => {
      const popup = get().tree.popups[popupId];
      if (!popup) return;
      set({
        workspace: "popup",
        activePopupId: popupId,
        selectedPopupId: popupId,
        selectedId: null,
        hovered: { sectionId: null, rowId: null, columnId: null, elementId: null },
      });
    },

    backToPage: () => {
      set({
        workspace: "page",
        activePopupId: null,
        selectedPopupId: null,
        selectedId: null,
        openPopupId: null,
        hovered: { sectionId: null, rowId: null, columnId: null, elementId: null },
      });
    },

    createPopup: (template = "blank") => {
      const { tree } = get();
      const popup = defaultPopupDefinition(template === "coupon" ? "Coupon Popup" : "New Popup");
      let nextTree: EditorTree = {
        ...tree,
        popups: { ...tree.popups, [popup.id]: popup },
      };

      if (template === "coupon") {
        const built = createCouponPopupNodes(popup.id);
        const nextNodes = { ...nextTree.nodes };
        for (const n of built.nodes) nextNodes[n.id] = n;
        nextTree = {
          ...nextTree,
          nodes: nextNodes,
          popups: {
            ...nextTree.popups,
            [popup.id]: { ...popup, rootIds: [built.rootSectionId] },
          },
        };
      }

      set({ tree: nextTree });
      get().setWorkspacePopup(popup.id);
    },

    createCouponPopup: () => {
      get().createPopup("coupon");
    },

    deletePopup: (popupId) => {
      const { tree, workspace, activePopupId } = get();
      const popup = tree.popups[popupId];
      if (!popup) return;

      const nodesToDelete: string[] = [];
      for (const rid of popup.rootIds) {
        nodesToDelete.push(...collectSubtree(tree.nodes, rid));
      }

      const nextNodes = { ...tree.nodes };
      nodesToDelete.forEach((nid) => delete nextNodes[nid]);

      const nextPopups = { ...tree.popups };
      delete nextPopups[popupId];

      set({
        tree: { ...tree, nodes: nextNodes, popups: nextPopups },
        openPopupId: get().openPopupId === popupId ? null : get().openPopupId,
      });

      if (workspace === "popup" && activePopupId === popupId) get().setWorkspacePage();
    },

    updatePopup: (popupId, patch) => {
      const { tree } = get();
      const existing = tree.popups[popupId];
      if (!existing) return;
      set({
        tree: {
          ...tree,
          popups: { ...tree.popups, [popupId]: { ...existing, ...patch } },
        },
      });
    },

    updatePopupTriggers: (popupId, triggers) => {
      get().updatePopup(popupId, { triggers });
    },
    updatePopupTargeting: (popupId, targeting) => {
      get().updatePopup(popupId, { targeting });
    },
    updatePopupFrequency: (popupId, frequency) => {
      get().updatePopup(popupId, { frequency });
    },
    updatePopupAnimation: (popupId, animation) => {
      get().updatePopup(popupId, { animation });
    },
    updatePopupStyle: (popupId, style) => {
      const { tree } = get();
      const existing = tree.popups[popupId];
      if (!existing) return;
      get().updatePopup(popupId, { style: { ...existing.style, ...style } });
    },

    openPopup: (popupId, reason = "manual") => {
      const { tree } = get();
      const popup = tree.popups[popupId];
      if (!popup || !popup.enabled) return;

      // Targeting check always applies.
      const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
      if (!pathMatches(popup.targeting, pathname)) return;

      // Frequency rules apply only for auto triggers; CTA/manual opens bypass.
      if (reason === "auto" && !frequencyAllowsAuto(popupId, popup.frequency)) return;

      recordShown(popupId);
      set({ openPopupId: popupId });
    },

    closePopup: () => set({ openPopupId: null }),

    addSection: () => {
      const sectionId = id("section");
      const section: SectionNode = {
        id: sectionId,
        type: "section",
        parentId: null,
        children: [],
        props: {
          background: "#ffffff",
          paddingY: 40,
          paddingX: 20,
          maxWidth: 1100,
          gapToNext: 0,
        },
      };
      const nextTree = insertNode(section, { parentId: null });
      set({ tree: nextTree });
      get().select(sectionId, { reason: "system" });
    },

    addSectionToActivePopup: () => {
      const { activePopupId, tree } = get();
      if (!activePopupId || !tree.popups[activePopupId]) return;
      const sectionId = id("section");
      const section: SectionNode = {
        id: sectionId,
        type: "section",
        parentId: null,
        children: [],
        props: {
          background: "transparent",
          paddingY: 0,
          paddingX: 0,
          maxWidth: 560,
          gapToNext: 0,
        },
      };
      const nextTree = insertNode(section, { parentId: null, popupId: activePopupId });
      set({ tree: nextTree, selectedPopupId: activePopupId });
      get().select(sectionId, { reason: "system" });
    },

    addRow: () => {
      const { selectedId, tree } = get();
      if (!selectedId) return;
      const selected = tree.nodes[selectedId];
      if (!selected || selected.type !== "section") return;

      const rowId = id("row");
      const row: RowNode = {
        id: rowId,
        type: "row",
        parentId: selected.id,
        children: [],
        props: {
          columns: 1,
          paddingY: 16,
          gapX: 16,
          gapY: 16,
          background: "transparent",
        },
      };

      const nextTree = insertNode(row, { parentId: selected.id });
      set({ tree: nextTree });
      get().select(rowId, { reason: "system" });
    },

    addColumn: () => {
      const { selectedId, tree } = get();
      if (!selectedId) return;
      const selected = tree.nodes[selectedId];
      if (!selected || selected.type !== "row") return;

      const row = selected as RowNode;
      const columnCount = (row.children || []).length;
      const nextWidth = clamp(Math.round(100 / Math.max(columnCount + 1, 1)), 10, 100);

      const colId = id("col");
      const col: ColumnNode = {
        id: colId,
        type: "column",
        parentId: row.id,
        children: [],
        props: {
          widthPct: nextWidth,
          paddingY: 0,
          paddingX: 0,
          background: "transparent",
        },
      };

      // Insert new column then normalize widths across siblings.
      let nextTree = insertNode(col, { parentId: row.id });
      const nextRow = nextTree.nodes[row.id] as RowNode;
      const ids = nextRow.children || [];
      const width = clamp(Math.round(100 / Math.max(ids.length, 1)), 10, 100);
      const nodes = { ...nextTree.nodes };
      for (const cid of ids) {
        const c = nodes[cid] as ColumnNode;
        nodes[cid] = { ...c, props: { ...c.props, widthPct: width } };
      }
      nextTree = { ...nextTree, nodes };
      set({ tree: nextTree });
      get().select(colId, { reason: "system" });
    },

    addElement: (kind) => {
      const { selectedId, tree, isPlaceholderMode } = get();
      if (!selectedId) return;
      const selected = tree.nodes[selectedId];
      if (!selected || selected.type !== "column") return;

      const columnId = selected.id;
      const elId = id("el");
      const base: ElementNode = {
        id: elId,
        type: "element",
        parentId: columnId,
        props: {
          kind,
          align: "center",
          gapToNext: 12,
        } as any,
      };

      const defaultByKind: Record<string, Partial<ElementNode["props"]>> = {
        heading: {
          content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Heading" }] }] },
          fontSize: 36,
          color: "#111827",
          fontWeight: 700,
          lineHeight: 1.1,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 12,
          paddingRight: 12,
        },
        subheading: {
          content: {
            type: "doc",
            content: [{ type: "paragraph", content: [{ type: "text", text: "Subheading" }] }],
          },
          fontSize: 22,
          color: "#374151",
          fontWeight: 600,
          lineHeight: 1.2,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 12,
          paddingRight: 12,
        },
        paragraph: {
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Paragraph text goes here." }],
              },
            ],
          },
          fontSize: 16,
          color: "#374151",
          fontWeight: 400,
          lineHeight: 1.6,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 12,
          paddingRight: 12,
        },
        button: {
          text: "Button",
          action: "link",
          href: "#",
          style: {
            background: "#111827",
            color: "#ffffff",
            paddingY: 12,
            paddingX: 18,
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
          },
        },
        image: {
          src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=800&fit=crop",
          alt: "Placeholder image",
          maxWidth: 600,
          borderRadius: 12,
          objectFit: "cover",
          aspectRatio: "auto",
          frameBackground: "#f1f5f9",
        },
        divider: {
          style: { thickness: 1, color: "#E5E7EB" },
          gapToNext: 20,
        },
        spacer: {
          height: 24,
          gapToNext: 0,
        },
        couponCode: {
          label: "Coupon code",
          code: "SAVE20",
          copyButtonText: "Copy",
          copiedText: "Copied!",
          style: { background: "#F3F4F6", borderColor: "#E5E7EB", textColor: "#111827", codeFontSize: 20 },
          align: "center",
          gapToNext: 20,
        },
        video: {
          src: "",
          width: 800,
          height: undefined,
          aspectRatio: "16/9",
          borderRadius: 12,
          borderWidth: 0,
          borderColor: "#e2e8f0",
          borderStyle: "solid",
          controls: true,
          autoPlay: false,
          loop: false,
          muted: false,
          frameBackground: "#000000",
          shadowEnabled: false,
          shadowX: 0,
          shadowY: 4,
          shadowBlur: 8,
          shadowSpread: 0,
          shadowColor: "rgba(0, 0, 0, 0.1)",
          shadowStyle: "outset",
          align: "center",
          gapToNext: 20,
        },
      };

      const patch = defaultByKind[kind] ?? {};
      const element: ElementNode = {
        ...base,
        props: { ...base.props, ...patch } as any,
      };

      const nextTree = insertNode(element, { parentId: columnId });
      set({ tree: nextTree });
      // If in placeholder mode, keep column selected to allow adding more elements
      // Otherwise, select the new element
      if (isPlaceholderMode) {
        get().select(columnId, { reason: "system" });
      } else {
        get().select(elId, { reason: "system" });
      }
    },

    addElementBelow: (kind) => {
      const { selectedId, tree } = get();
      if (!selectedId) return;
      const selected = tree.nodes[selectedId];
      if (!selected) return;

      // If selected is an element, add below it in the same column
      // If selected is a column, add to that column
      let columnId: string | null = null;
      let insertIndex: number | undefined = undefined;

      if (selected.type === "element") {
        columnId = selected.parentId;
        if (columnId) {
          const column = tree.nodes[columnId] as ColumnNode;
          const currentIndex = column.children?.indexOf(selectedId) ?? -1;
          if (currentIndex >= 0) {
            insertIndex = currentIndex + 1;
          }
        }
      } else if (selected.type === "column") {
        columnId = selected.id;
      }

      if (!columnId) return;

      const elId = id("el");
      const base: ElementNode = {
        id: elId,
        type: "element",
        parentId: columnId,
        props: {
          kind,
          align: "center",
          gapToNext: 12,
        } as any,
      };

      const defaultByKind: Record<string, Partial<ElementNode["props"]>> = {
        heading: {
          content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Heading" }] }] },
          fontSize: 36,
          color: "#111827",
          fontWeight: 700,
          lineHeight: 1.1,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 12,
          paddingRight: 12,
        },
        subheading: {
          content: {
            type: "doc",
            content: [{ type: "paragraph", content: [{ type: "text", text: "Subheading" }] }],
          },
          fontSize: 22,
          color: "#374151",
          fontWeight: 600,
          lineHeight: 1.2,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 12,
          paddingRight: 12,
        },
        paragraph: {
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Paragraph text goes here." }],
              },
            ],
          },
          fontSize: 16,
          color: "#374151",
          fontWeight: 400,
          lineHeight: 1.6,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 12,
          paddingRight: 12,
        },
        button: {
          text: "Button",
          action: "link",
          href: "#",
          style: {
            background: "#111827",
            color: "#ffffff",
            paddingY: 12,
            paddingX: 18,
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
          },
        },
        image: {
          src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=800&fit=crop",
          alt: "Placeholder image",
          maxWidth: 600,
          borderRadius: 12,
          objectFit: "cover",
          aspectRatio: "auto",
          frameBackground: "#f1f5f9",
        },
        divider: {
          style: { thickness: 1, color: "#E5E7EB" },
          gapToNext: 20,
        },
        spacer: {
          height: 24,
          gapToNext: 0,
        },
        couponCode: {
          label: "Coupon code",
          code: "SAVE20",
          copyButtonText: "Copy",
          copiedText: "Copied!",
          style: { background: "#F3F4F6", borderColor: "#E5E7EB", textColor: "#111827", codeFontSize: 20 },
          align: "center",
          gapToNext: 20,
        },
        video: {
          src: "",
          width: 800,
          height: undefined,
          aspectRatio: "16/9",
          borderRadius: 12,
          borderWidth: 0,
          borderColor: "#e2e8f0",
          borderStyle: "solid",
          controls: true,
          autoPlay: false,
          loop: false,
          muted: false,
          frameBackground: "#000000",
          shadowEnabled: false,
          shadowX: 0,
          shadowY: 4,
          shadowBlur: 8,
          shadowSpread: 0,
          shadowColor: "rgba(0, 0, 0, 0.1)",
          shadowStyle: "outset",
          align: "center",
          gapToNext: 20,
        },
      };

      const patch = defaultByKind[kind] ?? {};
      const element: ElementNode = {
        ...base,
        props: { ...base.props, ...patch } as any,
      };

      const nextTree = insertNode(element, { parentId: columnId, index: insertIndex });
      set({ tree: nextTree });
      get().select(elId, { reason: "system" });
    },

    insertTemplate: (structure) => {
      const { tree } = get();
      const newNodes = { ...tree.nodes };
      const newPageRootIds = [...tree.pageRootIds];

      // Recursive function to create nodes from template structure
      function createNode(template: any, parentId?: string): string {
        const nodeId = id("tpl");

        if (template.type === 'section') {
          const section: SectionNode = {
            id: nodeId,
            type: 'section',
            parentId: null,
            props: template.props || {},
            children: []
          };

          // Create children
          if (template.children && section.children) {
            template.children.forEach((child: any) => {
              const childId = createNode(child, nodeId);
              section.children!.push(childId);
            });
          }

          newNodes[nodeId] = section;
          newPageRootIds.push(nodeId);

        } else if (template.type === 'row') {
          const row: RowNode = {
            id: nodeId,
            type: 'row',
            parentId: parentId!,
            props: template.props || {},
            children: []
          };

          if (template.children && row.children) {
            template.children.forEach((child: any) => {
              const childId = createNode(child, nodeId);
              row.children!.push(childId);
            });
          }

          newNodes[nodeId] = row;

        } else if (template.type === 'column') {
          const column: ColumnNode = {
            id: nodeId,
            type: 'column',
            parentId: parentId!,
            props: template.props || {},
            children: []
          };

          if (template.children && column.children) {
            template.children.forEach((child: any) => {
              const childId = createNode(child, nodeId);
              column.children!.push(childId);
            });
          }

          newNodes[nodeId] = column;

        } else if (template.type === 'element') {
          const element: ElementNode = {
            id: nodeId,
            type: 'element',
            parentId: parentId!,
            props: template.props
          };

          newNodes[nodeId] = element;
        }

        return nodeId;
      }

      // Create all nodes from template
      const rootId = createNode(structure);

      set({ 
        tree: { ...tree, nodes: newNodes, pageRootIds: newPageRootIds },
        selectedId: rootId
      });
    },

    duplicateElement: (elementId) => {
      const { tree } = get();
      const element = tree.nodes[elementId];
      if (!element || element.type !== "element" || !element.parentId) return;

      const parent = tree.nodes[element.parentId];
      if (!parent || parent.type !== "column" || !parent.children) return;

      const insertIndex = parent.children.indexOf(elementId) + 1;
      const newId = id("el");
      const duplicated: ElementNode = {
        ...element,
        id: newId,
        parentId: element.parentId,
      } as ElementNode;

      const nextTree = insertNode(duplicated, { parentId: element.parentId, index: insertIndex });
      set({ tree: nextTree, selectedId: newId });
    },

    updateNode,

    updateNodeProps: (nodeId, propsPatch) => {
      const { tree } = get();
      const existing = tree.nodes[nodeId];
      if (!existing) return;
      set({
        tree: {
          ...tree,
          nodes: {
            ...tree.nodes,
            [nodeId]: {
              ...existing,
              props: { ...(existing as any).props, ...propsPatch },
            } as AnyNode,
          },
        },
      });
    },

    moveNode: (nodeId, to) => {
      const { tree } = get();
      const node = tree.nodes[nodeId];
      if (!node) return;

      // Prevent dropping a node into its own subtree.
      if (to.parentId) {
        const ancestors = findAncestors(tree.nodes, to.parentId);
        if (ancestors.includes(nodeId)) return;
      }

      // Detach from current parent
      let nextTree = detachFromParent(tree, nodeId);
      
      // Update parentId
      const nextNode = { ...nextTree.nodes[nodeId], parentId: to.parentId } as AnyNode;
      const nodes = { ...nextTree.nodes, [nodeId]: nextNode };
      
      // Insert at new location manually (can't use insertNode as it calls get())
      if (!to.parentId) {
        throw new Error("Cannot move element to root");
      }
      
      const parent = nodes[to.parentId];
      if (!parent || !canHaveChildren(parent.type)) return;
      
      const parentWithChildren = parent as SectionNode | RowNode | ColumnNode;
      const children = [...(parentWithChildren.children || [])];
      const index = to.index ?? children.length;
      children.splice(index, 0, nodeId);
      
      nodes[parent.id] = { ...parentWithChildren, children } as AnyNode;
      
      set({ tree: { ...nextTree, nodes } });
    },

    deleteNode: (nodeId) => {
      const { tree, selectedId } = get();
      const node = tree.nodes[nodeId];
      if (!node) return;

      const ids = collectSubtree(tree.nodes, nodeId);
      let nextTree = detachFromParent(tree, nodeId);
      const nextNodes = { ...nextTree.nodes };
      for (const id of ids) delete nextNodes[id];

      // Also clean any popup roots/page roots if deleting a root section.
      nextTree = removeFromRoots({ ...nextTree, nodes: nextNodes }, nodeId);

      set({
        tree: nextTree,
        selectedId: selectedId === nodeId ? null : selectedId,
      });
    },

    resizeAdjacentColumns: (leftColumnId, rightColumnId, newLeftWidth, newRightWidth) => {
      const { tree } = get();
      const left = tree.nodes[leftColumnId] as ColumnNode | undefined;
      const right = tree.nodes[rightColumnId] as ColumnNode | undefined;
      if (!left || !right) return;
      if (left.type !== "column" || right.type !== "column") return;
      if (left.parentId !== right.parentId) return;

      set({
        tree: {
          ...tree,
          nodes: {
            ...tree.nodes,
            [left.id]: { ...left, props: { ...left.props, widthPct: newLeftWidth } },
            [right.id]: { ...right, props: { ...right.props, widthPct: newRightWidth } },
          },
        },
      });
    },

    exportJson: () => {
      const { tree } = get();
      const payload: ExportPayloadV2 = { version: 2, tree };
      return JSON.stringify(payload, null, 2);
    },

    importJson: (json) => {
      try {
        const parsed = JSON.parse(json);
        const tree = asTreeV2(parsed);
        if (!tree) return { ok: false as const, error: "Invalid document format" };
        set({ tree, selectedId: null, selectedPopupId: null, openPopupId: null, workspace: "page", activePopupId: null });
        return { ok: true as const };
      } catch {
        return { ok: false as const, error: "Invalid JSON" };
      }
    },

    saveToLocal: () => {
      try {
        const json = get().exportJson();
        if (typeof window === "undefined") return;
        window.localStorage.setItem(STORAGE_KEY, json);
      } catch {
        // ignore
      }
    },

    loadFromLocal: () => {
      try {
        if (typeof window === "undefined") return { ok: false as const, error: "No window" };
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ok: false as const, error: "No saved document" };
        const parsed = JSON.parse(raw);
        const tree = asTreeV2(parsed);
        if (!tree) return { ok: false as const, error: "Saved document is invalid" };
        set({ tree, selectedId: null, selectedPopupId: null, openPopupId: null, workspace: "page", activePopupId: null });
        return { ok: true as const };
      } catch {
        return { ok: false as const, error: "Failed to load saved document" };
      }
    },

    saveToConvex: async () => {
      const { pageId, tree } = get();
      if (!pageId) return;
      
      try {
        const treeJson = JSON.stringify({ version: 2, tree });
        // This will be called from a component with useMutation
        // For now, just save to localStorage as fallback
        get().saveToLocal();
      } catch (error) {
        console.error("Failed to save to Convex:", error);
      }
    },

    loadFromConvex: async (pageId: string) => {
      try {
        // This will be implemented in the component using useQuery
        // For now, return success to allow the pattern
        set({ pageId });
        return { ok: true as const };
      } catch {
        return { ok: false as const, error: "Failed to load from Convex" };
      }
    },

    setPageId: (pageId: string | null) => {
      set({ pageId });
    },

    reset: () => {
      set({
        mode: "edit",
        viewport: "desktop",
        workspace: "page",
        activePopupId: null,
        selectedId: null,
        selectedPopupId: null,
        editingElementId: null,
        hovered: { sectionId: null, rowId: null, columnId: null, elementId: null },
        openPopupId: null,
        tree: createDemoDocument(),
      });
    },
  };
});
