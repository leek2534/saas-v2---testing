# Stripe Integration Setup

## Phase 3: Stripe Sync + Webhooks - COMPLETED ✅

### Environment Variables Required

Add these to your `.env.local` file:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Webhook Secret (from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Convex Environment Variables

Add to your Convex dashboard (Settings → Environment Variables):

```bash
STRIPE_SECRET_KEY=sk_test_...
```

### What's Been Implemented

#### 1. Stripe Client (`convex/stripe/client.ts`)
- Singleton Stripe client with proper API version
- Environment variable validation

#### 2. Sync Actions (`convex/stripe/sync.ts`)
- `syncProductToStripe` - Syncs product and all its prices to Stripe
- `syncPrice` - Syncs individual price (creates new, deactivates old)
- Price versioning (Stripe prices are immutable)

#### 3. Webhook Endpoint (`app/api/webhooks/stripe/route.ts`)
- Signature verification
- Idempotency checking
- Event handlers for:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - Subscription lifecycle events

#### 4. Webhook Idempotency (`convex/stripe/webhooks.ts`)
- `checkEvent` - Check if event already processed
- `recordEvent` - Record event for deduplication

#### 5. Schema Updates
- Added `stripeWebhookEvents` table with unique eventId
- Product and Price tables already have `stripeProductId` and `stripePriceId` fields

### Usage

#### Sync a Product to Stripe

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const syncProduct = useMutation(api.stripe.syncProductToStripe);

// In your component
await syncProduct({ productId: "..." });
```

#### Webhook URL

Configure in Stripe Dashboard:
```
https://yourdomain.com/api/webhooks/stripe
```

Events to subscribe to:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### Next Steps (Phases 4-7)

- **Phase 4**: Price Picker UI component
- **Phase 5**: One-time checkout with PaymentIntent
- **Phase 6**: Subscription checkout with embedded Stripe
- **Phase 7**: Readiness engine and UX safety system
