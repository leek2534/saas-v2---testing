import { v } from "convex/values";
import { mutation, query } from "../functions";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    if (ctx.viewer === null) {
      throw new Error("Unauthorized");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const saveImageMetadata = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileSize: v.number(),
    contentType: v.string(),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      throw new Error("Unauthorized");
    }

    // Get user's personal team
    const teams = await ctx.viewer
      .edge("members")
      .map((member: any) => member.edge("team").doc());
    
    const personalTeam = teams.find((team: any) => team.isPersonal);
    if (!personalTeam) {
      throw new Error("No personal team found");
    }

    const imageId = await ctx.table("catalogImages").insert({
      orgId: personalTeam._id,
      storageId: args.storageId,
      fileName: args.fileName,
      fileSize: args.fileSize,
      contentType: args.contentType,
      tags: [],
    });

    return imageId;
  },
});

export const attachImageToProduct = mutation({
  args: {
    productId: v.id("catalogProducts"),
    storageId: v.id("_storage"),
    setAsDefault: v.boolean(),
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

    // Check if storage ID exists
    const storageUrl = await ctx.storage.getUrl(args.storageId);
    if (!storageUrl) {
      throw new Error("Invalid storage ID");
    }

    // Add image to product
    const updatedImageIds = [...product.imageIds, args.storageId];
    const updates: any = { imageIds: updatedImageIds };

    // Set as default if requested
    if (args.setAsDefault) {
      updates.defaultImageId = args.storageId;
    }

    await ctx.table("catalogProducts").getX(args.productId).patch(updates);
    return args.productId;
  },
});

export const getImageUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      throw new Error("Unauthorized");
    }

    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});

export const listImages = query({
  args: {},
  handler: async (ctx) => {
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

    // Get all images from catalogImages table
    const allImages = await ctx.table("catalogImages");
    const imageRecords: any[] = [];
    
    for await (const image of allImages) {
      if ((image as any).orgId === teamIds[0]) {
        imageRecords.push(image);
      }
    }

    // Get all products to check which images are in use
    const allProducts = await ctx.table("catalogProducts");
    const products: any[] = [];
    
    for await (const product of allProducts) {
      if ((product as any).orgId === teamIds[0]) {
        products.push(product);
      }
    }

    // Build image list with URLs and usage info
    const images = [];
    for (const imageRecord of imageRecords) {
      const url = await ctx.storage.getUrl(imageRecord.storageId);
      if (url) {
        images.push({
          _id: imageRecord.storageId,
          url,
          fileName: imageRecord.fileName,
          fileSize: imageRecord.fileSize,
          uploadedAt: imageRecord._creationTime,
          tags: imageRecord.tags,
          usedInProducts: products
            .filter((p: any) => p.imageIds.includes(imageRecord.storageId))
            .map((p: any) => p.name),
        });
      }
    }

    return images;
  },
});

export const deleteImage = mutation({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    if (ctx.viewer === null) {
      throw new Error("Unauthorized");
    }

    // Get user's teams
    const teams = await ctx.viewer
      .edge("members")
      .map((member: any) => member.edge("team").doc());
    
    const teamIds = teams.map((team: any) => team._id);

    // Remove image from all products
    const products = await ctx
      .table("catalogProducts", "by_org_updated", (q: any) =>
        q.eq("orgId", teamIds[0])
      )
      .collect();

    for (const product of products) {
      if (product.imageIds.includes(args.imageId as any)) {
        const updatedImageIds = product.imageIds.filter((id: any) => id !== args.imageId);
        await ctx.table("catalogProducts").getX(product._id).patch({
          imageIds: updatedImageIds,
        });
      }
    }

    // Delete from storage
    await ctx.storage.delete(args.imageId as any);
    
    return args.imageId;
  },
});
