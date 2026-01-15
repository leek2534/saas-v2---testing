import type { JSONContent } from "@tiptap/core";

/**
 * Funnel Builder v3 domain types.
 *
 * Notes:
 * - The page canvas is a tree of nodes rooted at `tree.pageRootIds`.
 * - Popups are separate canvases that reuse the same node types; their roots live at `popup.rootIds`.
 */

export type ViewportMode = "desktop" | "tablet" | "mobile";

export type NodeType = "section" | "row" | "column" | "element";

export type ElementKind =
  | "heading"
  | "subheading"
  | "paragraph"
  | "button"
  | "image"
  | "video"
  | "divider"
  | "spacer"
  | "couponCode";

export interface BaseNode {
  id: string;
  type: NodeType;
  parentId: string | null;
}

export interface SectionNode extends BaseNode {
  type: "section";
  children?: string[]; // row ids
  childIds?: string[]; // alias for children
  props: Record<string, any>;
}

export interface RowNode extends BaseNode {
  type: "row";
  children?: string[]; // column ids
  childIds?: string[]; // alias for children
  props: Record<string, any>;
}

export interface ColumnNode extends BaseNode {
  type: "column";
  children?: string[]; // element ids
  childIds?: string[]; // alias for children
  props: Record<string, any>;
}

export type ButtonAction = "link" | "popup" | "closePopup";

export interface ElementNode extends BaseNode {
  type: "element";
  kind?: ElementKind;
  props: Record<string, any>;
}

export type AnyNode = SectionNode | RowNode | ColumnNode | ElementNode;

// -------------------------
// Popups
// -------------------------

export type PopupAnimation = "none" | "fade" | "slide";

export type PopupTrigger =
  | { type: "on_page_load" }
  | { type: "after_seconds"; seconds: number };

export interface PopupTargeting {
  /**
   * all: show everywhere (subject to exclude)
   * include: only show on include matches
   * exclude: show everywhere except exclude matches
   */
  mode: "all" | "include" | "exclude";
  include: string[];
  exclude: string[];
}

export interface PopupFrequency {
  /** every_visit: no limits
   * once: auto triggers only once per visitor
   * cooldown: auto triggers only if cooldown has passed
   */
  mode: "every_visit" | "once" | "cooldown";
  cooldownHours?: number;
  /** Max auto shows per visitor (0/undefined = unlimited). */
  maxShows?: number;
}

export interface PopupStyle {
  overlayColor?: string; // rgba/hex
  background?: string; // css color
  maxWidth?: number; // px
  padding?: number; // px
  borderRadius?: number; // px
  showClose?: boolean;
}

export interface PopupDefinition {
  id: string;
  name: string;
  enabled: boolean;
  rootIds: string[]; // section ids
  triggers: PopupTrigger[];
  targeting: PopupTargeting;
  frequency: PopupFrequency;
  animation: PopupAnimation;
  style: PopupStyle;
}

// -------------------------
// Document
// -------------------------

export interface EditorTree {
  pageRootIds: string[]; // section ids
  nodes: Record<string, AnyNode>;
  popups: Record<string, PopupDefinition>;
}

export interface HoverPath {
  sectionId: string | null;
  rowId: string | null;
  columnId: string | null;
  elementId: string | null;
}

export type EditorMode = "edit" | "preview";

export type WorkspaceMode = "page" | "popup";

// Helper function to determine which layer should be highlighted
export function resolveHoverLayer(hovered: HoverPath): "element" | "row" | "section" | null {
  if (hovered.elementId) return "element";
  if (hovered.rowId) return "row";
  if (hovered.sectionId) return "section";
  return null;
}

export function resolveHoverTarget(hovered: HoverPath): { layer: "element" | "row" | "section" | "column" | null; id: string | null } {
  if (hovered.elementId) return { layer: "element", id: hovered.elementId };
  if (hovered.columnId) return { layer: "column", id: hovered.columnId };
  if (hovered.rowId) return { layer: "row", id: hovered.rowId };
  if (hovered.sectionId) return { layer: "section", id: hovered.sectionId };
  return { layer: null, id: null };
}
