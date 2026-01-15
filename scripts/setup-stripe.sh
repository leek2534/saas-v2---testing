#!/bin/bash

# Stripe Setup Script for Golden SaaS
# This script helps you configure Stripe environment variables

echo "🔧 Stripe Setup for Golden SaaS"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found"
    exit 1
fi

echo "📝 Please provide your Stripe API keys from:"
echo "   https://dashboard.stripe.com/test/apikeys"
echo ""

# Check if keys are already set
if grep -q "sk_test_YOUR_SECRET_KEY_HERE" .env.local; then
    echo "⚠️  Stripe keys not configured yet"
    echo ""
    echo "To complete setup:"
    echo "1. Go to https://dashboard.stripe.com/test/apikeys"
    echo "2. Copy your Secret key (starts with sk_test_)"
    echo "3. Copy your Publishable key (starts with pk_test_)"
    echo "4. Update the following in .env.local:"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    echo ""
else
    echo "✅ Stripe API keys are configured in .env.local"
    echo ""
fi

# Check Convex environment variables
echo "🔍 Checking Convex environment variables..."
echo ""
echo "Run this command to set STRIPE_SECRET_KEY in Convex:"
echo ""
echo "  npx convex env set STRIPE_SECRET_KEY sk_test_YOUR_KEY_HERE"
echo ""

# Webhook setup instructions
echo "🪝 Webhook Setup Instructions:"
echo "================================"
echo ""
echo "1. Go to: https://dashboard.stripe.com/test/webhooks"
echo "2. Click 'Add endpoint'"
echo "3. Set endpoint URL to: https://yourdomain.com/api/webhooks/stripe"
echo "   (Replace 'yourdomain.com' with your actual domain)"
echo ""
echo "4. Select these events:"
echo "   ✓ checkout.session.completed"
echo "   ✓ payment_intent.succeeded"
echo "   ✓ payment_intent.payment_failed"
echo "   ✓ customer.subscription.created"
echo "   ✓ customer.subscription.updated"
echo "   ✓ customer.subscription.deleted"
echo ""
echo "5. After creating the webhook, copy the 'Signing secret'"
echo "   (starts with whsec_)"
echo ""
echo "6. Update STRIPE_WEBHOOK_SECRET in .env.local"
echo ""

# Test webhook locally
echo "🧪 Testing Webhooks Locally:"
echo "================================"
echo ""
echo "To test webhooks on localhost, use Stripe CLI:"
echo ""
echo "1. Install Stripe CLI: https://stripe.com/docs/stripe-cli"
echo "2. Login: stripe login"
echo "3. Forward webhooks:"
echo "   stripe listen --forward-to localhost:3000/api/webhooks/stripe"
echo ""
echo "4. The CLI will provide a webhook signing secret (whsec_...)"
echo "   Use this for STRIPE_WEBHOOK_SECRET during local development"
echo ""

echo "✅ Setup guide complete!"
echo ""
echo "Next steps:"
echo "1. Update Stripe keys in .env.local"
echo "2. Set STRIPE_SECRET_KEY in Convex: npx convex env set STRIPE_SECRET_KEY sk_test_..."
echo "3. Configure webhook endpoint in Stripe Dashboard"
echo "4. Restart your dev server: npm run dev"
echo ""
