import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Check for duplicate events using idempotency
  try {
    const existingEvent = await convex.query(api.stripe.webhooks.checkEvent, {
      eventId: event.id,
    });

    if (existingEvent) {
      console.log("Duplicate event, skipping:", event.id);
      return NextResponse.json({ received: true });
    }

    // Record this event
    await convex.mutation(api.stripe.webhooks.recordEvent, {
      eventId: event.id,
      type: event.type,
    });
  } catch (err) {
    console.error("Error checking/recording event:", err);
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionEvent(event.type, event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Error handling webhook event:", err);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const sessionId = session.id;
  console.log("checkout.session.completed:", sessionId);

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? undefined;

  const email =
    session.customer_details?.email ??
    (typeof session.customer_email === "string" ? session.customer_email : undefined) ??
    undefined;

  const checkoutAttempt = await convex.query(api.checkoutAttempts.getByStripeCheckoutSession, {
    stripeCheckoutSessionId: sessionId,
  });

  if (!checkoutAttempt) {
    console.warn("No checkout attempt found for session:", sessionId, { metadata: session.metadata });
    return;
  }

  if (checkoutAttempt.status === "completed") return;

  await convex.mutation(api.checkoutAttempts.updateStatus, {
    attemptId: checkoutAttempt._id,
    status: "completed",
    stripeCheckoutSessionId: sessionId,
    stripeCustomerId: customerId,
    customerEmail: email || checkoutAttempt.customerEmail || undefined,
  });

  if (customerId) {
    await convex.mutation(api.funnelRuns.storeCustomer, {
      funnelId: checkoutAttempt.funnelId,
      runId: checkoutAttempt.runId,
      stripeCustomerId: customerId,
    });
  }

  await convex.mutation(api.funnelRuns.updateStatus, {
    funnelId: checkoutAttempt.funnelId,
    runId: checkoutAttempt.runId,
    status: "completed",
    customerEmail: email || checkoutAttempt.customerEmail || undefined,
    stripeCustomerId: customerId,
  });
  
  // TODO: Implement order fulfillment logic here
  // - Create order record
  // - Send confirmation email
  // - Grant access to products
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const piId = paymentIntent.id;
  console.log("payment_intent.succeeded:", piId);

  const customerId =
    typeof paymentIntent.customer === "string"
      ? paymentIntent.customer
      : paymentIntent.customer?.id ?? undefined;

  const paymentMethodId =
    typeof paymentIntent.payment_method === "string"
      ? paymentIntent.payment_method
      : paymentIntent.payment_method?.id ?? undefined;

  const email = paymentIntent.receipt_email ?? undefined;

  const checkoutAttempt = await convex.query(api.checkoutAttempts.getByStripePaymentIntent, {
    stripePaymentIntentId: piId,
  });

  if (!checkoutAttempt) {
    console.warn("No checkout attempt found for PI:", piId, { metadata: paymentIntent.metadata });
    return;
  }

  if (checkoutAttempt.status === "completed") return;

  await convex.mutation(api.checkoutAttempts.updateStatus, {
    attemptId: checkoutAttempt._id,
    status: "completed",
    stripePaymentIntentId: piId,
    stripeCustomerId: customerId,
    paymentMethodId,
    customerEmail: email || checkoutAttempt.customerEmail || undefined,
  });

  if (customerId && paymentMethodId) {
    await convex.mutation(api.funnelRuns.storePaymentMethod, {
      funnelId: checkoutAttempt.funnelId,
      runId: checkoutAttempt.runId,
      stripeCustomerId: customerId,
      paymentMethodId,
    });
  }

  await convex.mutation(api.funnelRuns.updateStatus, {
    funnelId: checkoutAttempt.funnelId,
    runId: checkoutAttempt.runId,
    status: "completed",
    customerEmail: email || checkoutAttempt.customerEmail || undefined,
    stripeCustomerId: customerId,
  });
  
  // TODO: Implement order fulfillment logic here
  // - Create order record
  // - Send confirmation email
  // - Grant access to products
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment intent failed:", paymentIntent.id);
  
  // TODO: Implement failure handling
  // - Notify user
  // - Log failure reason
}

async function handleSubscriptionEvent(eventType: string, subscription: Stripe.Subscription) {
  console.log(`Subscription event: ${eventType}`, subscription.id);
  
  // TODO: Implement subscription lifecycle handling
  // - Update subscription status in Convex
  // - Grant/revoke access based on status
}
