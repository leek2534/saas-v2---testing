# 🔧 Stripe Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Secret key** (starts with `sk_test_`)
3. Copy your **Publishable key** (starts with `pk_test_`)

### Step 2: Update .env.local

Open `.env.local` and replace the placeholder values:

```bash
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
```

### Step 3: Set Convex Environment Variable

Run this command in your terminal:

```bash
npx convex env set STRIPE_SECRET_KEY sk_test_YOUR_ACTUAL_KEY_HERE
```

### Step 4: Configure Webhook (For Production)

**For Local Development:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will output a webhook signing secret. Add it to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LOCAL_SECRET_HERE
```

**For Production:**

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **Add endpoint**
3. Set endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select these events:
   - ✓ `checkout.session.completed`
   - ✓ `payment_intent.succeeded`
   - ✓ `payment_intent.payment_failed`
   - ✓ `customer.subscription.created`
   - ✓ `customer.subscription.updated`
   - ✓ `customer.subscription.deleted`
5. Copy the **Signing secret** and update `.env.local`

### Step 5: Restart Dev Server

```bash
npm run dev
```

---

## ✅ Verify Setup

### Test Product Sync

1. Go to `http://localhost:3000/t/yourteam/catalog/products`
2. Create a new product with a price
3. Click "Sync to Stripe" (you'll need to add this button)
4. Check [Stripe Dashboard](https://dashboard.stripe.com/test/products) to see the product

### Test Checkout

```tsx
// Example usage in your funnel
import { PaymentElement } from "@/src/features/funnel-builder-v3/components/PaymentElement";

<PaymentElement
  priceIds={[priceId]}
  quantities={[1]}
  onSuccess={(paymentIntentId) => {
    console.log("Payment successful!", paymentIntentId);
  }}
/>
```

---

## 🐛 Troubleshooting

### "Stripe client not initialized"
- Make sure `STRIPE_SECRET_KEY` is set in both `.env.local` AND Convex environment

### "Webhook signature verification failed"
- Check that `STRIPE_WEBHOOK_SECRET` matches your webhook endpoint
- For local dev, use the secret from `stripe listen` command

### "Price not synced to Stripe"
- Run the sync action: `await syncProduct({ productId })`
- Check Stripe Dashboard to verify the product/price exists

---

## 📚 Next Steps

- Read `/docs/implementation-complete.md` for full documentation
- See `/docs/stripe-setup.md` for detailed integration guide
- Run `./scripts/setup-stripe.sh` for interactive setup help

---

## 🔒 Security Notes

- Never commit `.env.local` to git (already in .gitignore)
- Use test keys (`sk_test_`, `pk_test_`) during development
- Switch to live keys only when ready for production
- Rotate keys if accidentally exposed
