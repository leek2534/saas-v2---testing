import { v } from "convex/values";
import { action } from "../_generated/server";
import { getStripeClient } from "./client";
import { api } from "../_generated/api";

/**
 * Syncs a product and its prices to Stripe
 * Creates Stripe Product and Price objects, stores IDs back in Convex
 */
export const syncProductToStripe = action({
  args: {
    productId: v.id("catalogProducts"),
  },
  handler: async (ctx, args) => {
    const stripe = getStripeClient();

    // Get product from Convex
    const product = await ctx.runQuery(api.catalog.getProduct, {
      productId: args.productId,
    });

    if (!product) {
      throw new Error("Product not found");
    }

    let stripeProductId = product.stripeProductId;

    // Create or update Stripe product
    if (stripeProductId) {
      // Update existing product
      await stripe.products.update(stripeProductId, {
        name: product.name,
        description: product.shortDescription || undefined,
        active: product.status === "active",
        metadata: {
          convexProductId: args.productId,
          orgId: product.orgId,
        },
      });
    } else {
      // Create new product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.shortDescription || undefined,
        active: product.status === "active",
        metadata: {
          convexProductId: args.productId,
          orgId: product.orgId,
        },
      });
      stripeProductId = stripeProduct.id;

      // Save Stripe product ID back to Convex
      await ctx.runMutation(api.catalog.updateProduct, {
        productId: args.productId,
        stripeProductId,
      });
    }

    // Get all prices for this product
    const prices = await ctx.runQuery(api.catalog.listPrices, {
      productId: args.productId,
    });

    // Sync each price
    for (const price of prices) {
      await syncPriceToStripe(ctx, stripe, price, stripeProductId);
    }

    return { success: true, stripeProductId };
  },
});

/**
 * Syncs a single price to Stripe
 */
export const syncPriceToStripe = async (
  ctx: any,
  stripe: ReturnType<typeof getStripeClient>,
  price: any,
  stripeProductId: string
) => {
  let stripePriceId = price.stripePriceId;

  // If price already has a Stripe ID, deactivate it and create a new one
  // (Stripe prices are immutable once created)
  if (stripePriceId) {
    await stripe.prices.update(stripePriceId, {
      active: false,
    });
  }

  // Create new Stripe price
  const priceData: any = {
    product: stripeProductId,
    currency: price.currency.toLowerCase(),
    unit_amount: price.amount,
    active: price.active,
    nickname: price.nickname,
    metadata: {
      convexPriceId: price._id,
      orgId: price.orgId,
    },
  };

  // Add billing configuration
  if (price.billing.type === "recurring") {
    priceData.recurring = {
      interval: price.billing.interval,
      interval_count: price.billing.intervalCount,
    };
  }

  const stripePrice = await stripe.prices.create(priceData);
  stripePriceId = stripePrice.id;

  // Save Stripe price ID back to Convex
  await ctx.runMutation(api.catalog.updatePrice, {
    priceId: price._id,
    stripePriceId,
  });

  return stripePriceId;
};

/**
 * Syncs a single price (can be called directly)
 */
export const syncPrice = action({
  args: {
    priceId: v.id("catalogPrices"),
  },
  handler: async (ctx, args) => {
    const stripe = getStripeClient();

    // Get price from Convex
    const allPrices = await ctx.runQuery(api.catalog.listPrices, {
      productId: args.priceId as any, // We need to get the product first
    });

    const price = allPrices.find((p: any) => p._id === args.priceId);
    if (!price) {
      throw new Error("Price not found");
    }

    // Get product to get stripeProductId
    const product = await ctx.runQuery(api.catalog.getProduct, {
      productId: price.productId,
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.stripeProductId) {
      throw new Error("Product must be synced to Stripe first");
    }

    await syncPriceToStripe(ctx, stripe, price, product.stripeProductId);

    return { success: true };
  },
});
