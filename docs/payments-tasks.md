# Payments Implementation Tasks

## Phase 1 — Convex Schema + Basic CRUD

### Database Schema
**Files to create/modify:**
- `convex/schema.ts` - Add catalog tables
- `convex/catalog/` - New directory for catalog functions
- `convex/catalog/products.ts` - Product CRUD operations
- `convex/catalog/prices.ts` - Price CRUD operations  
- `convex/catalog/collections.ts` - Collection CRUD operations
- `convex/catalog/images.ts` - Image storage helpers

**Schema additions:**
- `catalogProducts` table with indexes
- `catalogPrices` table with indexes
- `catalogCollections` table (optional)
- `catalogCollectionItems` table (optional)
- `stripeWebhookEvents` table for idempotency

**Core functions needed:**
- `createProduct(orgId, productData)`
- `updateProduct(productId, updates)`
- `deleteProduct(productId)`
- `listProducts(orgId, filters?)`
- `getProductByHandle(orgId, handle)`

- `createPrice(productId, priceData)`
- `updatePrice(priceId, updates)`
- `deletePrice(priceId)`
- `listPrices(productId)`
- `setDefaultPrice(productId, priceId)`

- `generateUploadUrl()`
- `attachImageToProduct(productId, storageId, setAsDefault?)`
- `reorderImages(productId, imageIds[])`
- `setDefaultImage(productId, storageId)`

### Verification Steps
1. `npx convex dev` starts without errors
2. Can create product via Convex dashboard or test UI
3. Can add prices to product
4. Image upload/attach works
5. Indexes are created correctly

---

## Phase 2 — Catalog UI

### Frontend Components
**Files to create/modify:**
- `src/app/(dashboard)/catalog/` - New catalog section
- `src/app/(dashboard)/catalog/page.tsx` - Products list
- `src/app/(dashboard)/catalog/new/page.tsx` - New product wizard
- `src/app/(dashboard)/catalog/[productId]/page.tsx` - Product editor
- `src/components/catalog/` - Catalog UI components
- `src/components/catalog/ProductCard.tsx`
- `src/components/catalog/ProductEditor.tsx`
- `src/components/catalog/PriceEditor.tsx`
- `src/components/catalog/ImageUpload.tsx`

**Key features:**
- Products list with search/filter
- Product editor with tabs (General, Description, Media, Pricing, Integrations)
- New product wizard (creates product + default price)
- Image upload with drag & drop
- Price management (add/edit/delete/set default)

### Verification Steps
1. Navigate to `/catalog` - see products list
2. Click "New Product" - wizard works
3. Edit existing product - all tabs functional
4. Upload images - works and sets default
5. Add/edit/delete prices - updates correctly

---

## Phase 3 — Stripe Sync + Webhook Skeleton

### Stripe Integration
**Files to create/modify:**
- `convex/stripe/` - New directory for Stripe functions
- `convex/stripe/client.ts` - Stripe client setup
- `convex/stripe/sync.ts` - Product/price sync functions
- `convex/stripe/webhooks.ts` - Webhook handlers
- `src/lib/stripe.ts` - Frontend Stripe utilities

**Core functions needed:**
- `syncProductToStripe(productId)` - Creates/updates Stripe product
- `syncPriceToStripe(priceId)` - Creates/updates Stripe price
- `archiveStripePrice(priceId)` - Deactivates old price
- `handleStripeWebhook(eventType, data)` - Main webhook router
- Specific handlers: `handleCheckoutCompleted`, `handleInvoicePaid`, etc.

### Webhook Setup
- Add webhook endpoint route
- Implement signature verification
- Add idempotency checking
- Store webhook events in `stripeWebhookEvents`

### Verification Steps
1. Stripe client initializes correctly
2. Can sync product to Stripe (stores `stripeProductId`)
3. Can sync price to Stripe (stores `stripePriceId`)
4. Webhook endpoint receives events
5. Idempotency prevents duplicate processing

---

## Phase 4 — Price Picker + Inspector Integration

### Price Picker Component
**Files to create/modify:**
- `src/components/payments/PricePicker.tsx` - Main picker dialog
- `src/components/payments/ProductOptionCard.tsx` - Individual option display
- `src/components/payments/PricePickerSyncButton.tsx` - Sync & Select button
- `src/features/funnel-builder-v3/inspector/checkout/CheckoutInspector.tsx`
- `src/features/funnel-builder-v3/inspector/offer/OfferInspector.tsx`

**Picker features:**
- Search products by name/handle
- Expand product to see options
- Show sync status (Synced/Needs Sync)
- Show billing type (One-time/Subscription)
- Compatibility checking (no mixed billing)
- "Sync & Select" for unsynced options

### Inspector Integration
- Checkout inspector: items + order bumps selection
- Offer inspector: offer option selection
- Store `catalogPriceId` in page config
- Show compatibility warnings

### Verification Steps
1. Price picker opens and shows products
2. Can select options for checkout items
3. Can add order bumps via picker
4. Can select offer option via picker
5. Sync & Select works for unsynced options
6. Mixed billing shows compatibility warning

---

## Phase 5 — One-Time Checkout Runtime

### Checkout Flow
**Files to create/modify:**
- `convex/payments/checkout.ts` - Checkout logic
- `convex/payments/orders.ts` - Order management
- `src/features/funnel-builder-v3/renderer/nodes/CheckoutBlock.tsx`
- `src/components/payments/PaymentElement.tsx` - Stripe Payment Element
- `src/app/(funnels)/f/[funnelId]/checkout/page.tsx` - Checkout page

**Core functions needed:**
- `createPaymentIntent(items, orderBumps, savePaymentMethod?)`
- `calculateTotals(items, orderBumps)`
- `createOrderSnapshot(checkoutData)` - Store order details
- `processPaymentResult(paymentIntentId)`

### Payment Element Integration
- Render Stripe Payment Element
- Handle payment submission
- Save payment method if offers enabled
- Show order summary
- Handle payment errors

### Verification Steps
1. Checkout page loads with selected items
2. Payment Element renders correctly
3. Can complete payment successfully
4. Payment method saved when offers enabled
5. Order snapshot stored in database
6. Error handling works (declined cards, etc.)

---

## Phase 6 — Subscription Checkout Runtime

### Embedded Checkout
**Files to create/modify:**
- `convex/payments/subscriptions.ts` - Subscription logic
- `src/components/payments/EmbeddedCheckout.tsx` - Stripe embedded checkout
- `src/app/(funnels)/f/[funnelId]/return/page.tsx` - Return page

**Core functions needed:**
- `createSubscriptionCheckoutSession(items, returnUrl)`
- `handleCheckoutSessionCompletion(sessionId)`
- `processSubscriptionActivation(subscriptionId)`

### Embedded Checkout Flow
- Create Checkout Session server-side
- Render embedded checkout on page
- Handle return from Stripe
- Route to next page on success
- Webhook fulfillment for subscription

### Verification Steps
1. Subscription checkout session created
2. Embedded checkout renders correctly
3. Can complete subscription signup
4. Return page processes completion
5. Webhook activates subscription
6. Routing to next page works

---

## Phase 7 — UX Safety System

### Readiness Engine
**Files to create/modify:**
- `convex/payments/readiness.ts` - Readiness logic
- `src/components/payments/readiness/` - Readiness UI components
- `src/components/payments/readiness/ReadinessHeader.tsx`
- `src/components/payments/readiness/PublishReadinessModal.tsx`
- `src/components/payments/readiness/FixActions.tsx`

**Readiness checks needed:**
- Workspace has Stripe connected
- All checkout items have synced prices
- No mixed billing in checkout
- Offer routing is valid
- One-click enabled when offers exist
- Subscription checkout has return path

### Fix Actions
**Files to create/modify:**
- `convex/payments/fixActions.ts` - Fix action executors
- `src/components/payments/readiness/SplitCheckoutFix.tsx`

**Fix actions needed:**
- Open payments settings
- Open catalog product/pricing tab
- Sync required options
- Enable one-click offers
- Repair offer routing
- Insert offer accept/decline buttons
- Split checkout by billing (magic fix)

### UI Integration
- Add badges to flow builder nodes
- Add readiness header to inspectors
- Add readiness modal to publish flow
- Add fix buttons throughout UI

### Verification Steps
1. Readiness engine detects issues correctly
2. Safety header shows current status
3. Publish modal shows grouped issues
4. Fix buttons resolve issues
5. Split checkout creates separate pages
6. Publish blocked when critical issues exist

---

## Final Verification

After all phases, verify complete integration:

1. **End-to-end funnel flow:**
   - Create product with prices
   - Add to checkout page
   - Complete payment
   - View offers
   - Accept/decline offers

2. **Admin functionality:**
   - Manage catalog
   - Sync products to Stripe
   - Monitor webhooks
   - View orders/subscriptions

3. **Safety system:**
   - All readiness checks work
   - Fix actions resolve issues
   - Publish flow prevents broken funnels

4. **Performance:**
   - Page load times acceptable
   - Stripe elements load quickly
   - Webhooks process reliably

5. **Error handling:**
   - Payment failures handled gracefully
   - Sync failures show clear errors
   - Network issues don't break UI
