"use client";

import React from "react";
import { useFunnelEditorStore } from "../store/store";
import type { AnyNode } from "../store/types";
import { Section } from "./nodes/Section";
import { Row } from "./nodes/Row";
import { Column } from "./nodes/Column";
import { Element } from "./nodes/Element";

export function RuntimeRenderer({ rootIds }: { rootIds: string[] }) {
  const tree = useFunnelEditorStore((s) => s.tree);

  const render = (nodeId: string): React.ReactNode => {
    const node = tree.nodes[nodeId] as AnyNode | undefined;
    if (!node) return null;

    switch (node.type) {
      case "section":
        return <Section key={node.id} node={node} render={render} />;
      case "row":
        return <Row key={node.id} node={node} render={render} />;
      case "column":
        return <Column key={node.id} node={node} render={render} />;
      case "element":
        return <Element key={node.id} node={node} />;
      default:
        return null;
    }
  };

  if (!rootIds.length) {
    return (
      <div className="p-10 text-center text-sm text-slate-500">
        Empty document. Add a section from the left sidebar.
      </div>
    );
  }

  return <div>{rootIds.map((sid) => render(sid))}</div>;
}
