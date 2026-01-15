import type { EditorTree, AnyNode, SectionNode, RowNode, ColumnNode, ElementNode, PopupDefinition } from "../types";
import { id } from "../ids";

function doc(text: string) {
  return {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  } as any;
}

function section(props: SectionNode["props"]): SectionNode {
  return { id: id("section"), type: "section", parentId: null, children: [], props };
}
function row(parentId: string, props: RowNode["props"]): RowNode {
  return { id: id("row"), type: "row", parentId, children: [], props };
}
function col(parentId: string, widthFraction: number): ColumnNode {
  return { id: id("col"), type: "column", parentId, children: [], props: { widthPct: widthFraction * 100 } };
}
function el(parentId: string, kind: string, props: Partial<ElementNode["props"]> = {}): ElementNode {
  const isRich = kind === "heading" || kind === "subheading" || kind === "paragraph";
  return {
    id: id("el"),
    type: "element",
    parentId,
    props: {
      kind,
      text: kind === "button" ? "Get Started" : undefined,
      content: isRich
        ? doc(
            kind === "heading"
              ? "Your Next Funnel Starts Here"
              : kind === "paragraph"
              ? "Edit everything. Simple UI. Full control."
              : "Subheading"
          )
        : undefined,
      align: "left",
      fontSize: kind === "heading" ? 36 : kind === "subheading" ? 20 : 16,
      fontWeight: kind === "heading" ? 700 : kind === "subheading" ? 600 : 400,
      color: kind === "heading" ? "#0f172a" : "#334155",
      paddingY: 8,
      paddingX: 0,
      borderRadius: 12,
      ...props,
    },
  };
}

function couponEl(parentId: string, code: string): ElementNode {
  return {
    id: id("el"),
    type: "element",
    parentId,
    props: {
      kind: "couponCode",
      code,
      label: "Use code",
      buttonText: "Copy",
      copiedText: "Copied!",
      background: "#0f172a",
      color: "#ffffff",
      borderRadius: 12,
      paddingX: 14,
      paddingY: 12,
    },
  };
}

function popup(name: string, rootIds: string[]): PopupDefinition {
  return {
    id: id("popup"),
    name,
    rootIds,
    enabled: true,
    triggers: [{ type: "after_seconds", seconds: 2 }],
    targeting: { mode: "all", include: [], exclude: [] },
    frequency: { mode: "cooldown", cooldownHours: 24, maxShows: 3 },
    animation: "fade",
    style: {
      overlayColor: "rgba(2, 6, 23, 0.6)",
      background: "#ffffff",
      maxWidth: 520,
      padding: 24,
      borderRadius: 16,
      showCloseButton: true,
    },
  };
}

export function createDemoDocument(): EditorTree {
  const nodes: Record<string, AnyNode> = {};

  const s1 = section({
    background: "#ffffff",
    paddingY: 40,
    paddingX: 20,
    maxWidth: 1100,
    gapToNext: 16,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: "#e2e8f0",
    shadow: "none",
  });
  const r1 = row(s1.id, { paddingY: 16, paddingX: 0, align: "center", gap: 0, vAlign: "stretch", background: "transparent" });
  const c1 = col(r1.id, 1);
  const c2 = col(r1.id, 1);

  const h = el(c1.id, "heading", { align: "left" });
  const t = el(c1.id, "text", {
    content: doc(
      "This is the new builder feature. Hover an element: element outline shows on top of a full-row outline. Hover row space to resize columns."
    ),
    fontSize: 16,
  });
  const b = el(c1.id, "button", {
    text: "Get Started",
    background: "#2563eb",
    color: "#ffffff",
    paddingX: 18,
    paddingY: 12,
    borderRadius: 10,
    hoverBackground: "#1d4ed8",
    hoverColor: "#ffffff",
  });
  const img = el(c2.id, "image", {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    borderRadius: 16,
    alt: "Team working together",
    objectFit: "cover",
  });

  nodes[s1.id] = s1;
  nodes[r1.id] = r1;
  nodes[c1.id] = c1;
  nodes[c2.id] = c2;
  nodes[h.id] = h;
  nodes[t.id] = t;
  nodes[b.id] = b;
  nodes[img.id] = img;

  s1.children = [r1.id];
  r1.children = [c1.id, c2.id];
  c1.children = [h.id, t.id, b.id];
  c2.children = [img.id];

  // Demo coupon popup (shows after 2 seconds in Preview).
  const ps = section({
    background: "transparent",
    paddingY: 0,
    paddingX: 0,
    maxWidth: 1100,
    gapToNext: 0,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: "#e2e8f0",
    shadow: "none",
  });
  const pr = row(ps.id, { paddingY: 0, paddingX: 0, align: "center", gap: 12, vAlign: "stretch", background: "transparent" });
  const pc = col(pr.id, 1);
  const ph = el(pc.id, "heading", {
    content: doc("Here’s 20% off"),
    fontSize: 28,
    fontWeight: 700,
    align: "center",
    color: "#0f172a",
    paddingY: 0,
  });
  const pt = el(pc.id, "text", {
    content: doc("Copy the coupon code below and use it at checkout."),
    fontSize: 16,
    align: "center",
    color: "#334155",
    paddingY: 0,
  });
  const pcode = couponEl(pc.id, "SAVE20");
  const pclose = el(pc.id, "button", {
    text: "Continue",
    action: "closePopup",
    background: "#2563eb",
    color: "#ffffff",
    paddingX: 18,
    paddingY: 12,
    borderRadius: 10,
    hoverBackground: "#1d4ed8",
    hoverColor: "#ffffff",
  });

  nodes[ps.id] = ps;
  nodes[pr.id] = pr;
  nodes[pc.id] = pc;
  nodes[ph.id] = ph;
  nodes[pt.id] = pt;
  nodes[pcode.id] = pcode;
  nodes[pclose.id] = pclose;

  ps.children = [pr.id];
  pr.children = [pc.id];
  pc.children = [ph.id, pt.id, pcode.id, pclose.id];

  const couponPopup = popup("Coupon", [ps.id]);

  return {
    pageRootIds: [s1.id],
    nodes,
    popups: { [couponPopup.id]: couponPopup },
  };
}
