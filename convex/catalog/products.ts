import { v } from "convex/values";
import { mutation, query } from "../functions";

export const createProduct = mutation({
  args: {
    name: v.string(),
    handle: v.string(),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("archived")),
    type: v.union(v.literal("digital"), v.literal("physical"), v.literal("service")),
    sku: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      throw new Error("Unauthorized");
    }

    // Get user's personal team for now (simplified for Phase 1)
    const teams = await ctx.viewer
      .edge("members")
      .map((member) => member.edge("team").doc());
    
    const personalTeam = teams.find((team) => team.isPersonal);
    if (!personalTeam) {
      throw new Error("No personal team found");
    }

    // Check if handle already exists
    const existing = await ctx
      .table("catalogProducts")
      .get("handle", args.handle);

    if (existing) {
      throw new Error("Product handle already exists");
    }

    const productId = await ctx.table("catalogProducts").insert({
      ...args,
      orgId: personalTeam._id,
      imageIds: [],
      tags: args.tags || [],
    });

    return productId;
  },
});

export const listProducts = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("active"), v.literal("archived"))),
    type: v.optional(v.union(v.literal("digital"), v.literal("physical"), v.literal("service"))),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      return [];
    }

    // Get user's teams
    const teams = await ctx.viewer
      .edge("members")
      .map((member: any) => member.edge("team").doc());
    
    if (teams.length === 0) {
      return [];
    }

    const teamIds = teams.map((team: any) => team._id);

    // Get all products and filter by orgId
    const allProducts = await ctx.table("catalogProducts");
    const teamProducts: any[] = [];
    
    for await (const product of allProducts) {
      if ((product as any).orgId === teamIds[0]) {
        teamProducts.push(product);
      }
    }

    let products = teamProducts;

    if (args.status) {
      products = products.filter((product: any) => product.status === args.status);
    }
    if (args.type) {
      products = products.filter((product: any) => product.type === args.type);
    }

    // Fetch prices for each product
    const productsWithPrices = await Promise.all(
      products.map(async (product: any) => {
        const allPrices = await ctx.table("catalogPrices", "by_org_product", (q: any) =>
          q.eq("orgId", product.orgId).eq("productId", product._id)
        );
        
        const prices: any[] = [];
        for await (const price of allPrices) {
          prices.push(price);
        }
        
        return { ...product, prices };
      })
    );

    return productsWithPrices;
  },
});

export const getProduct = query({
  args: {
    productId: v.id("catalogProducts"),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      return null;
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

    return product;
  },
});

export const updateProduct = mutation({
  args: {
    productId: v.id("catalogProducts"),
    name: v.optional(v.string()),
    handle: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("active"), v.literal("archived"))),
    type: v.optional(v.union(v.literal("digital"), v.literal("physical"), v.literal("service"))),
    sku: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      throw new Error("Unauthorized");
    }

    const { productId, ...updates } = args;
    const product = await ctx.table("catalogProducts").getX(productId);
    
    // Check if user is member of the org
    const membership = await ctx
      .table("members", "teamUser", (q) =>
        q.eq("teamId", product.orgId).eq("userId", ctx.viewerX()._id)
      )
      .unique();

    if (!membership) {
      throw new Error("Not a member of this organization");
    }

    // Check if handle is being updated and already exists
    if (updates.handle && updates.handle !== product.handle) {
      const existing = await ctx
        .table("catalogProducts")
        .get("handle", updates.handle);

      if (existing) {
        throw new Error("Product handle already exists");
      }
    }

    await ctx.table("catalogProducts").getX(productId).patch(updates);
    return productId;
  },
});

export const deleteProduct = mutation({
  args: {
    productId: v.id("catalogProducts"),
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

    // Delete associated prices
    const prices = await ctx
      .table("catalogPrices", "by_org_product", (q) =>
        q.eq("orgId", product.orgId).eq("productId", args.productId)
      )
      .collect();

    for (const price of prices) {
      await ctx.table("catalogPrices").getX(price._id).delete();
    }

    // Delete the product
    await ctx.table("catalogProducts").getX(args.productId).delete();
    return args.productId;
  },
});
