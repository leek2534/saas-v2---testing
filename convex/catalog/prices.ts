import { v } from "convex/values";
import { mutation, query } from "../functions";

export const createPrice = mutation({
  args: {
    productId: v.id("catalogProducts"),
    nickname: v.string(),
    currency: v.string(),
    amount: v.number(),
    billing: v.union(
      v.object({ type: v.literal("one_time") }),
      v.object({ 
        type: v.literal("recurring"), 
        interval: v.union(v.literal("month"), v.literal("year")),
        intervalCount: v.number()
      })
    ),
    isDefault: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      throw new Error("Unauthorized");
    }

    const product = await ctx.table("catalogProducts").getX(args.productId);
    
    // Check if user is member of the org
    const membership = await ctx
      .table("members", "teamUser", (q) =>
        q.eq("teamId", product.orgId).eq("userId", ctx.viewerX()._id)
      )
      .unique();

    if (!membership) {
      throw new Error("Not a member of this organization");
    }

    const priceId = await ctx.table("catalogPrices").insert({
      ...args,
      orgId: product.orgId,
      active: true,
    });

    return priceId;
  },
});

export const listPrices = query({
  args: {
    productId: v.id("catalogProducts"),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      return [];
    }

    const product = await ctx.table("catalogProducts").getX(args.productId);
    
    // Check if user is member of the org
    const membership = await ctx
      .table("members", "teamUser", (q: any) =>
        q.eq("teamId", product.orgId).eq("userId", ctx.viewerX()._id)
      )
      .unique();

    if (!membership) {
      throw new Error("Not a member of this organization");
    }

    // Get all prices and filter by orgId and productId
    const allPrices = await ctx.table("catalogPrices");
    const prices: any[] = [];
    
    for await (const price of allPrices) {
      if ((price as any).orgId === product.orgId && (price as any).productId === args.productId) {
        prices.push(price);
      }
    }

    return prices;
  },
});

export const updatePrice = mutation({
  args: {
    priceId: v.id("catalogPrices"),
    nickname: v.optional(v.string()),
    currency: v.optional(v.string()),
    amount: v.optional(v.number()),
    billing: v.optional(v.union(
      v.object({ type: v.literal("one_time") }),
      v.object({ 
        type: v.literal("recurring"), 
        interval: v.union(v.literal("month"), v.literal("year")),
        intervalCount: v.number()
      })
    )),
    active: v.optional(v.boolean()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      throw new Error("Unauthorized");
    }

    const { priceId, ...updates } = args;
    const price = await ctx.table("catalogPrices").getX(priceId);
    
    // Check if user is member of the org
    const membership = await ctx
      .table("members", "teamUser", (q) =>
        q.eq("teamId", price.orgId).eq("userId", ctx.viewerX()._id)
      )
      .unique();

    if (!membership) {
      throw new Error("Not a member of this organization");
    }

    await ctx.table("catalogPrices").getX(priceId).patch(updates);
    return priceId;
  },
});

export const deletePrice = mutation({
  args: {
    priceId: v.id("catalogPrices"),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      throw new Error("Unauthorized");
    }

    const price = await ctx.table("catalogPrices").getX(args.priceId);
    
    // Check if user is member of the org
    const membership = await ctx
      .table("members", "teamUser", (q) =>
        q.eq("teamId", price.orgId).eq("userId", ctx.viewerX()._id)
      )
      .unique();

    if (!membership) {
      throw new Error("Not a member of this organization");
    }

    await ctx.table("catalogPrices").getX(args.priceId).delete();
    return args.priceId;
  },
});
