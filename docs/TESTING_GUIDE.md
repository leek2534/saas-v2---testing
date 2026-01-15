# Testing Guide — Funnel Payment System

## Prerequisites

### 1. Environment Setup

Ensure `.env.local` has:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CONVEX_URL=https://...
```

### 2. Stripe Webhook Setup

**Option A: Stripe CLI (Recommended for local testing)**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

**Option B: Stripe Dashboard (For deployed environments)**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `checkout.session.completed`
4. Copy webhook secret to `.env.local`

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
```

---

## Test 1: Create a Test Funnel

### Step 1: Create Catalog Products

1. Navigate to `/t/[teamSlug]/catalog/products`
2. Click "New Product"
3. Create a one-time product:
   - Name: "Test Product"
   - Price: $10.00
   - Billing: One-time
4. Create an offer product:
   - Name: "Test Upsell"
   - Price: $5.00
   - Billing: One-time
5. Click "Sync to Stripe" for both products

### Step 2: Create Funnel

1. Navigate to `/t/[teamSlug]/funnels`
2. Click "Create Funnel"
3. Enter:
   - Name: "Test Funnel"
   - Handle: "test-funnel"
4. Click "Create"

### Step 3: Add Checkout Step

1. In funnel detail page, click "Add Step"
2. Select "Checkout"
3. Configure:
   - Name: "Main Checkout"
   - Select "Test Product" ($10)
   - Enable "One-Click Offers" ✓
4. Click "Create Step"
5. Click "Edit Page" to customize checkout page (optional)

### Step 4: Add Offer Step

1. Click "Add Step"
2. Select "Offer"
3. Configure:
   - Name: "Upsell Offer"
   - Select "Test Upsell" ($5)
   - On Accept: (will set after creating thank you)
   - On Decline: (will set after creating thank you)
4. Click "Create Step"

### Step 5: Add Thank You Step

1. Click "Add Step"
2. Select "Thank You"
3. Configure:
   - Name: "Thank You"
4. Click "Create Step"
5. Click "Edit Page" to customize thank you page

### Step 6: Configure Routing

1. Go back to Checkout step settings
2. Set "On Success" → Offer step
3. Go to Offer step settings
4. Set "On Accept" → Thank You step
5. Set "On Decline" → Thank You step

### Step 7: Set Entry Step

1. In funnel settings, set "Entry Step" → Checkout step
2. Save

---

## Test 2: Complete One-Time Checkout

### Step 1: Visit Funnel

1. Navigate to `/f/test-funnel`
2. **Expected**: Should see checkout page
3. **Check**: URL should have `?runId=run_...&stepId=...`

### Step 2: Verify Run Created

1. Open Convex Dashboard
2. Go to "funnelRuns" table
3. **Expected**: New record with:
   - `runId` matching URL
   - `status: "in_progress"`
   - `currentStepId` matching checkout step

### Step 3: Complete Payment

1. Fill in Stripe payment form:
   - Email: test@example.com
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
2. Click "Pay Now"
3. **Expected**: Payment processes successfully

### Step 4: Verify Webhook Processing

**Check Stripe CLI output:**
```
payment_intent.succeeded [evt_...]
```

**Check Convex Dashboard:**

1. **checkoutAttempts** table:
   - Status should be "completed"
   - `stripePaymentIntentId` should be set
   - `stripeCustomerId` should be set
   - `paymentMethodId` should be set

2. **funnelRuns** table:
   - Status should be "completed"
   - `stripeCustomerId` should be set
   - `stripePaymentMethodId` should be set
   - `checkoutAttemptId` should reference the attempt

### Step 5: Verify Navigation

**Expected**: Should automatically navigate to offer step

---

## Test 3: One-Click Offer

### Step 1: View Offer Page

**Expected**: Should see offer with two buttons:
- "Yes, Add to My Order!"
- "No Thanks"

### Step 2: Click Accept

1. Click "Yes, Add to My Order!"
2. **Expected**: Button shows "Processing..."
3. **Expected**: Charge happens immediately (no payment form)

### Step 3: Verify One-Click Charge

**Check Stripe CLI output:**
```
payment_intent.succeeded [evt_...]
```

**Check Stripe Dashboard:**
1. Go to Payments
2. **Expected**: Two charges:
   - $10.00 (checkout)
   - $5.00 (offer)
3. Both should have same customer ID

**Check Convex Dashboard:**
1. **checkoutAttempts** table:
   - Should have 2 records for this runId
   - Both with status "completed"

### Step 4: Verify Navigation

**Expected**: Should navigate to Thank You page

---

## Test 4: Decline Offer

### Step 1: Start New Run

1. Visit `/f/test-funnel` (without runId parameter)
2. Complete checkout again
3. Navigate to offer

### Step 2: Click Decline

1. Click "No Thanks"
2. **Expected**: Immediate navigation to Thank You page
3. **Expected**: No charge made

### Step 3: Verify

**Check Stripe Dashboard:**
- Only 1 charge for this run ($10 checkout)

---

## Test 5: Subscription Checkout

### Step 1: Create Subscription Product

1. Create new product with recurring billing:
   - Name: "Monthly Subscription"
   - Price: $29/month
   - Billing: Recurring
2. Sync to Stripe

### Step 2: Create Subscription Funnel

1. Create new funnel: "subscription-test"
2. Add checkout step with subscription product
3. **Important**: Do NOT enable one-click offers (Day-1 limitation)

### Step 3: Test Subscription Flow

1. Visit `/f/subscription-test`
2. **Expected**: See Stripe Embedded Checkout (different UI)
3. Complete subscription signup
4. **Expected**: Webhook processes `checkout.session.completed`

### Step 4: Verify

**Check Convex Dashboard:**
- `stripeCustomerId` stored
- `stripePaymentMethodId` should be undefined (subscriptions don't save PM for offers)

---

## Test 6: Error Scenarios

### Test 6.1: Declined Card

1. Visit funnel
2. Use declined test card: `4000 0000 0000 0002`
3. **Expected**: Error message displayed
4. **Expected**: Can retry with different card

### Test 6.2: Offer Without Checkout

1. Manually navigate to offer step URL (copy stepId from offer step)
2. Visit `/f/test-funnel?runId=new_run&stepId=[offerStepId]`
3. **Expected**: Error message: "Offer Not Available - Please complete checkout first"

### Test 6.3: Missing Payment Method

1. Create new funnel with checkout that has one-click offers DISABLED
2. Complete checkout
3. Try to access offer step
4. **Expected**: Error about payment method not saved

---

## Test 7: Idempotency

### Test 7.1: Duplicate Webhook

1. Complete a checkout
2. In Stripe CLI, replay the webhook:
   ```bash
   stripe events resend evt_...
   ```
3. **Expected**: No duplicate updates in Convex
4. **Expected**: Attempt status stays "completed"

### Test 7.2: Page Refresh During Checkout

1. Start checkout
2. Refresh page before completing payment
3. **Expected**: Same checkout attempt reused
4. **Expected**: No duplicate attempts in DB

---

## Test 8: Run Tracking

### Test 8.1: Resume Run

1. Complete checkout (get runId from URL)
2. Close browser
3. Reopen and visit `/f/test-funnel?runId=[savedRunId]&stepId=[checkoutStepId]`
4. **Expected**: Loads existing run
5. **Expected**: Can navigate through funnel

### Test 8.2: Multiple Runs

1. Complete full funnel flow (runId1)
2. Visit `/f/test-funnel` again (creates runId2)
3. **Expected**: Two separate runs in DB
4. **Expected**: Each with own attempts and state

---

## Debugging Tips

### Check Convex Logs

1. Open Convex Dashboard
2. Go to "Logs" tab
3. Filter by function name:
   - `funnelRuns:getOrCreateRun`
   - `checkoutAttempts:getOrCreateAttempt`
   - `stripe/checkout:createPaymentIntent`

### Check Stripe Events

1. Stripe Dashboard → Developers → Events
2. Look for recent events
3. Check event data and webhook delivery status

### Check Browser Console

1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests

### Common Issues

**Issue**: "No checkout attempt found for PI"
- **Cause**: Webhook received before attempt created
- **Fix**: Ensure attempt is created before Stripe call

**Issue**: "Payment method not saved"
- **Cause**: `enableOneClickOffers` not set to true
- **Fix**: Update checkout step config

**Issue**: TypeScript errors in Convex files
- **Cause**: Types not regenerated yet
- **Fix**: Wait for Convex to regenerate (automatic)

---

## Stripe Test Cards

```
✅ Success:           4242 4242 4242 4242
❌ Decline:           4000 0000 0000 0002
🔐 Requires Auth:     4000 0025 0000 3155
💳 Insufficient Funds: 4000 0000 0000 9995
```

---

## Quick Verification Checklist

After completing a full test flow, verify:

- [ ] funnelRun created with correct runId
- [ ] checkoutAttempt created for checkout step
- [ ] Stripe PaymentIntent created
- [ ] Webhook processed successfully
- [ ] checkoutAttempt status = "completed"
- [ ] funnelRun has stripeCustomerId
- [ ] funnelRun has stripePaymentMethodId
- [ ] Navigation to offer step works
- [ ] Offer charge succeeds with stored PM
- [ ] Second checkoutAttempt created for offer
- [ ] Navigation to thank you works
- [ ] All data visible in Convex Dashboard
- [ ] All charges visible in Stripe Dashboard

---

## Performance Testing

### Load Test (Optional)

```bash
# Install k6
brew install k6

# Create test script (test.js)
import http from 'k6/http';
import { check } from 'k6';

export default function() {
  const res = http.get('http://localhost:3000/f/test-funnel');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has runId': (r) => r.url.includes('runId='),
  });
}

# Run test
k6 run --vus 10 --duration 30s test.js
```

---

## Next Steps After Testing

1. **Deploy to Production**
   - Update environment variables
   - Configure production Stripe webhook
   - Test with live mode

2. **Add Monitoring**
   - Set up error tracking (Sentry)
   - Add analytics (PostHog, Mixpanel)
   - Monitor Convex usage

3. **Optimize**
   - Add caching where appropriate
   - Optimize Convex queries
   - Add loading skeletons

4. **Enhance**
   - Add order fulfillment
   - Add email notifications
   - Add customer portal
   - Add readiness UI

---

## Support

If you encounter issues:

1. Check this guide's "Common Issues" section
2. Review Convex logs
3. Check Stripe event logs
4. Verify webhook secret is correct
5. Ensure all environment variables are set

Happy testing! 🚀
