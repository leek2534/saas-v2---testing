import { v } from "convex/values";
import { mutation, query } from "../functions";

export const createCollection = mutation({
  args: {
    name: v.string(),
    handle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      throw new Error("Unauthorized");
    }

    // Get user's personal team for now (simplified for Phase 1)
    const teams = await ctx.viewer
      .edge("members")
      .map((member: any) => member.edge("team").doc());
    
    const personalTeam = teams.find((team: any) => team.isPersonal);
    if (!personalTeam) {
      throw new Error("No personal team found");
    }

    const collectionId = await ctx.table("catalogCollections").insert({
      ...args,
      orgId: personalTeam._id,
    });

    return collectionId;
  },
});

export const listCollections = query({
  args: {},
  handler: async (ctx) => {
    if (ctx.viewer === null) {
      throw new Error("Unauthorized");
    }

    // Get user's teams
    const teams = await ctx.viewer
      .edge("members")
      .map((member: any) => member.edge("team").doc());
    
    const teamIds = teams.map((team: any) => team._id);

    // Get collections from user's teams
    const collections = await ctx
      .table("catalogCollections", "by_org", (q) =>
        q.eq("orgId", teamIds[0]) // Simplified: use first team for now
      )
      .collect();

    return collections;
  },
});

export const addToCollection = mutation({
  args: {
    collectionId: v.id("catalogCollections"),
    productId: v.id("catalogProducts"),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      throw new Error("Unauthorized");
    }

    const collection = await ctx.table("catalogCollections").getX(args.collectionId);
    const product = await ctx.table("catalogProducts").getX(args.productId);
    
    // Check if user is member of the org
    const membership = await ctx
      .table("members", "teamUser", (q: any) =>
        q.eq("teamId", collection.orgId).eq("userId", ctx.viewerX()._id)
      )
      .unique();

    if (!membership) {
      throw new Error("Not a member of this organization");
    }

    // Get next order if not provided
    let order = args.order;
    if (order === undefined) {
      const lastItem = await ctx
        .table("catalogCollectionItems", "by_collection", (q: any) =>
          q.eq("collectionId", args.collectionId)
        )
        .order("desc")
        .first();

      order = lastItem ? lastItem.order + 1 : 0;
    }

    const itemId = await ctx.table("catalogCollectionItems").insert({
      orgId: collection.orgId,
      collectionId: args.collectionId,
      productId: args.productId,
      order,
    });

    return itemId;
  },
});

export const getCollectionItems = query({
  args: {
    collectionId: v.id("catalogCollections"),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      throw new Error("Unauthorized");
    }

    const collection = await ctx.table("catalogCollections").getX(args.collectionId);
    
    // Check if user is member of the org
    const membership = await ctx
      .table("members", "teamUser", (q: any) =>
        q.eq("teamId", collection.orgId).eq("userId", ctx.viewerX()._id)
      )
      .unique();

    if (!membership) {
      throw new Error("Not a member of this organization");
    }

    const items = await ctx
      .table("catalogCollectionItems", "by_collection", (q: any) =>
        q.eq("collectionId", args.collectionId)
      )
      .order("asc")
      .collect();

    return items;
  },
});
