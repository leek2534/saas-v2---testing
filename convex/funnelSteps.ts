import { v } from "convex/values";
import { mutation, query } from "./functions";

export const createStep = mutation({
  args: {
    orgId: v.id("teams"),
    funnelId: v.id("funnels"),
    type: v.union(v.literal("page"), v.literal("checkout"), v.literal("offer"), v.literal("thankyou")),
    name: v.string(),
    pageId: v.optional(v.id("pages")),
    pageName: v.optional(v.string()),
    config: v.optional(v.string()),
    pageTree: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ensureTreePayload = (raw?: string) => {
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          if ((parsed as any).version === 2 && (parsed as any).tree) {
            return raw;
          }
          if (Array.isArray((parsed as any).pageRootIds) && typeof (parsed as any).nodes === "object") {
            return JSON.stringify({ version: 2, tree: parsed });
          }
        }
      } catch {
        // ignore
      }
      return raw;
    };

    let pageId = args.pageId;

    // Auto-create page if not provided
    if (!pageId) {
      const pageKind = args.type === "page" ? "standard" : args.type;
      const pageHandle = `${args.funnelId}-${args.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
      
      // Create default tree based on page kind
      let defaultTree = { pageRootIds: [], nodes: {}, popups: {} };
      
      if (args.type === "checkout") {
        // Add placeholder CheckoutBlock element
        const sectionId = `section_${Date.now()}`;
        const rowId = `row_${Date.now()}`;
        const colId = `col_${Date.now()}`;
        const checkoutBlockId = `checkout_${Date.now()}`;
        
        defaultTree = {
          pageRootIds: [sectionId],
          nodes: {
            [sectionId]: {
              id: sectionId,
              type: "section",
              parentId: null,
              children: [rowId],
              props: {},
            },
            [rowId]: {
              id: rowId,
              type: "row",
              parentId: sectionId,
              children: [colId],
              props: {},
            },
            [colId]: {
              id: colId,
              type: "column",
              parentId: rowId,
              children: [checkoutBlockId],
              props: { widthPct: 100 },
            },
            [checkoutBlockId]: {
              id: checkoutBlockId,
              type: "element",
              parentId: colId,
              props: { kind: "funnel.checkout" },
            },
          },
          popups: {},
        };
      } else if (args.type === "offer") {
        // Add placeholder OfferBlock element
        const sectionId = `section_${Date.now()}`;
        const rowId = `row_${Date.now()}`;
        const colId = `col_${Date.now()}`;
        const offerBlockId = `offer_${Date.now()}`;
        
        defaultTree = {
          pageRootIds: [sectionId],
          nodes: {
            [sectionId]: {
              id: sectionId,
              type: "section",
              parentId: null,
              children: [rowId],
              props: {},
            },
            [rowId]: {
              id: rowId,
              type: "row",
              parentId: sectionId,
              children: [colId],
              props: {},
            },
            [colId]: {
              id: colId,
              type: "column",
              parentId: rowId,
              children: [offerBlockId],
              props: { widthPct: 100 },
            },
            [offerBlockId]: {
              id: offerBlockId,
              type: "element",
              parentId: colId,
              props: { kind: "funnel.offer" },
            },
          },
          popups: {},
        };
      }

      // Use provided pageTree if available, otherwise use default
      const treeToUse = args.pageTree ? (ensureTreePayload(args.pageTree) as string) : JSON.stringify({ version: 2, tree: defaultTree });
      
      pageId = await ctx.table("pages").insert({
        orgId: args.orgId,
        name: args.pageName || args.name,
        handle: pageHandle,
        kind: pageKind,
        status: "draft",
        tree: treeToUse,
        schemaVersion: 2,
      });
    }

    const stepId = await ctx.table("funnelSteps").insert({
      orgId: args.orgId,
      funnelId: args.funnelId,
      type: args.type,
      name: args.name,
      pageId,
      config: args.config,
    });

    return { stepId, pageId };
  },
});

export const updateStep = mutation({
  args: {
    stepId: v.id("funnelSteps"),
    name: v.optional(v.string()),
    nextStepId: v.optional(v.string()),
    config: v.optional(v.string()),
    position: v.optional(v.object({ x: v.number(), y: v.number() })),
  },
  handler: async (ctx, args) => {
    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.nextStepId !== undefined) updates.nextStepId = args.nextStepId;
    if (args.config !== undefined) updates.config = args.config;
    if (args.position !== undefined) updates.position = args.position;

    await ctx.table("funnelSteps").getX(args.stepId).patch(updates);

    return { success: true };
  },
});

export const setEntryStep = mutation({
  args: {
    funnelId: v.id("funnels"),
    stepId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.table("funnels").getX(args.funnelId).patch({
      entryStepId: args.stepId,
    });

    return { success: true };
  },
});

export const connectNextStep = mutation({
  args: {
    stepId: v.id("funnelSteps"),
    nextStepId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.table("funnelSteps").getX(args.stepId).patch({
      nextStepId: args.nextStepId,
    });

    return { success: true };
  },
});

export const listStepsByFunnel = query({
  args: {
    funnelId: v.id("funnels"),
  },
  handler: async (ctx, args) => {
    const steps: any[] = [];
    const allSteps = await ctx.table("funnelSteps", "by_funnel", (q: any) =>
      q.eq("funnelId", args.funnelId)
    );

    for await (const step of allSteps) {
      const page = await ctx.table("pages").get(step.pageId);
      steps.push({ ...step, page });
    }

    return steps;
  },
});

export const getStepByPageId = query({
  args: {
    pageId: v.id("pages"),
  },
  handler: async (ctx, args) => {
    const allSteps = await ctx.table("funnelSteps");
    
    for await (const step of allSteps) {
      if (step.pageId === args.pageId) {
        return step;
      }
    }
    
    return null;
  },
});

export const updateStepConfig = mutation({
  args: {
    stepId: v.id("funnelSteps"),
    config: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.table("funnelSteps").getX(args.stepId).patch({
      config: args.config,
    });

    return { success: true };
  },
});

export const deleteStep = mutation({
  args: {
    stepId: v.id("funnelSteps"),
  },
  handler: async (ctx, args) => {
    await ctx.table("funnelSteps").getX(args.stepId).delete();

    return { success: true };
  },
});


export const getStep = query({
  args: {
    stepId: v.id("funnelSteps"),
  },
  handler: async (ctx, args) => {
    return await ctx.table("funnelSteps").get(args.stepId);
  },
});
