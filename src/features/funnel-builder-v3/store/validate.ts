import type { AnyNode, NodeType } from "./types";

export function canParentChild(parentType: NodeType | null, childType: NodeType) {
  if (parentType === null) return childType === "section";
  if (parentType === "section") return childType === "row";
  if (parentType === "row") return childType === "column";
  if (parentType === "column") return childType === "element";
  return false;
}

export function assertExists<T>(value: T | null | undefined, msg: string): T {
  if (value == null) throw new Error(msg);
  return value;
}

export function getNode(tree: { nodes: Record<string, AnyNode> }, nodeId: string) {
  return tree.nodes[nodeId] ?? null;
}
