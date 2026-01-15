import { v } from "convex/values";
import { mutation, query } from "./functions";

export const createFunnel = mutation({
  args: {
    orgId: v.id("teams"),
    name: v.string(),
    handle: v.string(),
  },
  handler: async (ctx, args) => {
    const funnelId = await ctx.table("funnels").insert({
      orgId: args.orgId,
      name: args.name,
      handle: args.handle,
      status: "draft",
    });

    return funnelId;
  },
});

export const getFunnelByHandle = query({
  args: {
    handle: v.string(),
  },
  handler: async (ctx, args) => {
    const funnel = await ctx
      .table("funnels", "by_org_handle")
      .filter((q: any) => q.eq(q.field("handle"), args.handle))
      .first();
    
    return funnel;
  },
});

export const getFunnelById = query({
  args: {
    funnelId: v.id("funnels"),
  },
  handler: async (ctx, args) => {
    const funnel = await ctx.table("funnels").get(args.funnelId);
    return funnel;
  },
});

export const listFunnels = query({
  args: {
    orgId: v.id("teams"),
  },
  handler: async (ctx, args) => {
    const funnels: any[] = [];
    const allFunnels = await ctx.table("funnels", "by_org_status", (q: any) =>
      q.eq("orgId", args.orgId)
    );

    for await (const funnel of allFunnels) {
      funnels.push(funnel);
    }

    return funnels;
  },
});

export const updateFunnel = mutation({
  args: {
    funnelId: v.id("funnels"),
    name: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("active"), v.literal("archived"))),
    entryStepId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.status !== undefined) updates.status = args.status;
    if (args.entryStepId !== undefined) updates.entryStepId = args.entryStepId;

    await ctx.table("funnels").getX(args.funnelId).patch(updates);

    return { success: true };
  },
});
