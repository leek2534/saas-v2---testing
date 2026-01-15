# ✅ Stripe Setup Checklist

## 🎯 Complete These Steps to Activate Payments

### 1. Get Stripe Account (2 min)
- [ ] Sign up at [stripe.com](https://stripe.com) (if you don't have an account)
- [ ] Verify your email
- [ ] Access your [Dashboard](https://dashboard.stripe.com)

### 2. Get API Keys (1 min)
- [ ] Go to [API Keys](https://dashboard.stripe.com/test/apikeys)
- [ ] Copy **Secret key** (starts with `sk_test_`)
- [ ] Copy **Publishable key** (starts with `pk_test_`)

### 3. Update .env.local (1 min)
- [ ] Open `.env.local` in your project root
- [ ] Replace `STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE` with your actual secret key
- [ ] Replace `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE` with your actual publishable key
- [ ] Save the file

### 4. Set Convex Environment Variable (1 min)
- [ ] Open terminal in project root
- [ ] Run: `npx convex env set STRIPE_SECRET_KEY sk_test_YOUR_ACTUAL_KEY`
- [ ] Verify it's set: `npx convex env list`

### 5. Setup Webhooks for Local Development (2 min)
**Option A: Using Stripe CLI (Recommended)**
- [ ] Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
- [ ] Login: `stripe login`
- [ ] In a new terminal, run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Copy the webhook signing secret (starts with `whsec_`)
- [ ] Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_YOUR_LOCAL_SECRET`

**Option B: Skip for now**
- [ ] Leave `STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE` as is
- [ ] Webhooks won't work but you can still test checkout

### 6. Restart Development Server (1 min)
- [ ] Stop your dev server (Ctrl+C)
- [ ] Run: `npm run dev`
- [ ] Wait for both Next.js and Convex to start

### 7. Test the Setup (3 min)
- [ ] Go to `http://localhost:3000/t/yourteam/catalog/products`
- [ ] Create a test product
- [ ] Add a price (e.g., $10.00 one-time)
- [ ] Save the product

### 8. Sync to Stripe (2 min)
- [ ] Open browser console
- [ ] Run this in console:
```javascript
// Get the product ID from the URL or page
const productId = "YOUR_PRODUCT_ID";

// Sync to Stripe
await fetch('/api/sync-product', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productId })
});
```
- [ ] Or use the Convex dashboard to call `stripe.syncProductToStripe`
- [ ] Check [Stripe Products](https://dashboard.stripe.com/test/products) to verify

---

## 🎉 You're Ready!

Once all checkboxes are complete, your Stripe integration is live and ready to use!

### Quick Test Checkout
```tsx
import { PaymentElement } from "@/src/features/funnel-builder-v3/components/PaymentElement";

<PaymentElement
  priceIds={["YOUR_PRICE_ID"]}
  quantities={[1]}
  onSuccess={(paymentIntentId) => {
    alert("Payment successful! " + paymentIntentId);
  }}
/>
```

### Test Card Numbers
Use these in test mode:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`
- Any future expiry date, any CVC

---

## 📚 Documentation

- **Full Guide**: `STRIPE_SETUP.md`
- **Implementation Docs**: `docs/implementation-complete.md`
- **Stripe Setup**: `docs/stripe-setup.md`
- **Setup Script**: Run `./scripts/setup-stripe.sh`

---

## 🆘 Need Help?

### Common Issues

**"Cannot find Stripe client"**
- Check `.env.local` has `STRIPE_SECRET_KEY`
- Check Convex env: `npx convex env list`
- Restart dev server

**"Webhook verification failed"**
- Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Copy the webhook secret from CLI output
- Update `STRIPE_WEBHOOK_SECRET` in `.env.local`
- Restart dev server

**"Price not synced"**
- Product must be synced before prices
- Use Convex dashboard to call `stripe.syncProductToStripe`
- Check Stripe dashboard to verify

---

## 🚀 Production Deployment

When ready for production:

1. **Get Live Keys**
   - Switch to [Live mode](https://dashboard.stripe.com/apikeys) in Stripe
   - Copy live keys (start with `sk_live_` and `pk_live_`)

2. **Update Production Environment**
   - Set live keys in your hosting platform (Vercel, etc.)
   - Set `STRIPE_SECRET_KEY` in Convex production environment

3. **Setup Production Webhook**
   - Go to [Webhooks](https://dashboard.stripe.com/webhooks)
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select same events as test mode
   - Copy signing secret
   - Update production environment variable

4. **Test in Production**
   - Use real card (will charge real money!)
   - Or use test mode keys first to verify everything works
