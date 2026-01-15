'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckoutConfig } from "../types";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CheckoutBlock({ runtimeContext }: { runtimeContext: any; orgId: string }) {
  const config: CheckoutConfig =
    runtimeContext?.config ?? {
      priceIds: [],
      quantities: [],
      mode: "payment_intent",
      paymentMethods: ["card"],
      enableOneClickOffers: false,
      requireEmail: false,
      showOrderSummary: true,
      showTestModeWarning: true,
    };

  const priceIds = (config.priceIds ?? []) as unknown as Id<"catalogPrices">[];
  const quantities = config.quantities ?? [];

  const prices = useQuery(
    api.catalogPrices.getByIds,
    priceIds.length ? { ids: priceIds } : "skip"
  );

  const getOrCreateAttempt = useMutation(api.checkoutAttempts.getOrCreateAttempt);
  const updateAttemptStatus = useMutation(api.checkoutAttempts.updateStatus);
  const setCheckoutAttempt = useMutation(api.funnelRuns.setCheckoutAttempt);
  const storePaymentMethod = useMutation(api.funnelRuns.storePaymentMethod);
  const updateRunStatus = useMutation(api.funnelRuns.updateStatus);

  const createPaymentIntent = useMutation(api.stripe.createPaymentIntent);
  const createCheckoutSession = useMutation(api.stripe.createCheckoutSession);

  const [clientSecret, setClientSecret] = useState<string>("");
  const [checkoutMode, setCheckoutMode] = useState<"payment_intent" | "checkout_session">("payment_intent");
  const [attemptId, setAttemptId] = useState<Id<"checkoutAttempts"> | null>(null);

  const [email, setEmail] = useState("");
  const [savePaymentMethodChecked, setSavePaymentMethodChecked] = useState(config.enableOneClickOffers ?? false);
  const [error, setError] = useState<string>("");

  const initializedRef = useRef(false);

  const totals = useMemo(() => {
    if (!prices) return null;

    const byId = new Map(prices.map((p: any) => [p._id, p]));
    const lineItems = priceIds
      .map((pid, idx) => {
        const p = byId.get(pid as any);
        if (!p) return null;
        const qty = quantities[idx] ?? 1;
        const amount = (p.amount ?? 0) * qty;
        return { price: p, qty, amount };
      })
      .filter(Boolean) as Array<{ price: any; qty: number; amount: number }>;

    const total = lineItems.reduce((sum, li) => sum + li.amount, 0);

    const billingType = lineItems[0]?.price?.billing?.type ?? "one_time";
    const allSame = lineItems.every((li) => (li.price?.billing?.type ?? "one_time") === billingType);

    return {
      lineItems,
      total,
      currency: (lineItems[0]?.price?.currency ?? "usd") as string,
      billingType: allSame ? billingType : "mixed",
    };
  }, [prices, priceIds, quantities]);

  // Initialize checkout attempt + Stripe secret
  useEffect(() => {
    const init = async () => {
      if (initializedRef.current) return;
      if (!totals) return;
      if (!runtimeContext?.funnelId || !runtimeContext?.stepId || !runtimeContext?.runId) return;

      if (totals.billingType === "mixed") {
        setError("Mixed one-time and recurring prices are not supported in a single checkout step.");
        initializedRef.current = true;
        return;
      }

      if (totals.lineItems.length === 0) {
        setError("This checkout step has no prices configured.");
        initializedRef.current = true;
        return;
      }

      if (config.requireEmail && !email) {
        return;
      }

      initializedRef.current = true;
      setError("");

      const effectiveMode: "payment_intent" | "checkout_session" =
        totals.billingType === "recurring" ? "checkout_session" : "payment_intent";

      setCheckoutMode(effectiveMode);

      try {
        // Create a checkout attempt record (idempotent per run+step)
        const attempt = await getOrCreateAttempt({
          orgId: runtimeContext.orgId,
          funnelId: runtimeContext.funnelId,
          stepId: runtimeContext.stepId,
          runId: runtimeContext.runId,
          mode: effectiveMode,
          amount: totals.total,
          currency: totals.currency,
          customerEmail: config.requireEmail ? email || undefined : email || undefined,
        });

        setAttemptId(attempt as any);

        // Store attempt id on the run for easy lookup / debugging
        await setCheckoutAttempt({
          funnelId: runtimeContext.funnelId,
          runId: runtimeContext.runId,
          checkoutAttemptId: attempt as any,
        });

        if (effectiveMode === "payment_intent") {
          const result = await createPaymentIntent({
            priceIds,
            quantities: quantities.length ? quantities : priceIds.map(() => 1),
            savePaymentMethod: savePaymentMethodChecked,
            customerEmail: email || undefined,
            metadata: {
              orgId: runtimeContext.orgId,
              funnelId: runtimeContext.funnelId,
              stepId: runtimeContext.stepId,
              runId: runtimeContext.runId,
              checkoutAttemptId: attempt,
            },
          });

          setClientSecret(result.clientSecret);

          await updateAttemptStatus({
            attemptId: attempt as any,
            status: "pending",
            stripePaymentIntentId: result.paymentIntentId,
            stripeCustomerId: (result as any).customerId ?? undefined,
            customerEmail: email || undefined,
          });
        } else {
          // Recurring: use Embedded Checkout session
          const returnUrl = `${window.location.origin}${window.location.pathname}?runId=${runtimeContext.runId}&stepId=${config.onSuccessStepId || runtimeContext.stepId}`;

          const result = await createCheckoutSession({
            priceIds,
            quantities: quantities.length ? quantities : priceIds.map(() => 1),
            customerEmail: email || undefined,
            returnUrl,
            metadata: {
              orgId: runtimeContext.orgId,
              funnelId: runtimeContext.funnelId,
              stepId: runtimeContext.stepId,
              runId: runtimeContext.runId,
              checkoutAttemptId: attempt,
            },
          });

          setClientSecret(result.clientSecret);

          await updateAttemptStatus({
            attemptId: attempt as any,
            status: "pending",
            stripeCheckoutSessionId: result.sessionId,
            customerEmail: email || undefined,
          });
        }
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "Failed to initialize checkout.");
      }
    };

    init();
  }, [
    totals,
    runtimeContext,
    getOrCreateAttempt,
    setCheckoutAttempt,
    createPaymentIntent,
    createCheckoutSession,
    updateAttemptStatus,
    savePaymentMethodChecked,
    config.requireEmail,
    config.onSuccessStepId,
    email,
    priceIds,
    quantities,
  ]);

  if (!totals && priceIds.length) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="p-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-lg mx-auto border-red-200">
        <CardContent className="p-6">
          <p className="text-sm text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {(config.requireEmail || config.enableOneClickOffers) && (
          <div className="space-y-4">
            {config.requireEmail && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            )}

            {config.enableOneClickOffers && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="savePaymentMethod"
                  checked={savePaymentMethodChecked}
                  onCheckedChange={(checked) => setSavePaymentMethodChecked(checked as boolean)}
                />
                <Label htmlFor="savePaymentMethod" className="text-sm">
                  Save payment method for one-click offers
                </Label>
              </div>
            )}
          </div>
        )}

        {config.showOrderSummary && totals && (
          <OrderSummary lineItems={totals.lineItems} currency={totals.currency} total={totals.total} />
        )}

        {clientSecret ? (
          checkoutMode === "checkout_session" ? (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                clientSecret={clientSecret}
                onSuccess={async (pi) => {
                  // Best-effort immediate updates (webhooks still reconcile)
                  if (attemptId) {
                    await updateAttemptStatus({
                      attemptId,
                      status: "completed",
                      stripePaymentIntentId: pi.id,
                      stripeCustomerId: (pi.customer as any) || undefined,
                      paymentMethodId: (pi.payment_method as any) || undefined,
                      customerEmail: email || undefined,
                    }).catch(console.error);
                  }

                  const customerId = typeof pi.customer === "string" ? pi.customer : undefined;
                  const paymentMethodId = typeof pi.payment_method === "string" ? pi.payment_method : undefined;

                  if (savePaymentMethodChecked && customerId && paymentMethodId) {
                    await storePaymentMethod({
                      funnelId: runtimeContext.funnelId,
                      runId: runtimeContext.runId,
                      stripeCustomerId: customerId,
                      paymentMethodId,
                    }).catch(console.error);
                  }

                  await updateRunStatus({
                    funnelId: runtimeContext.funnelId,
                    runId: runtimeContext.runId,
                    status: "completed",
                    customerEmail: email || undefined,
                    stripeCustomerId: customerId,
                  }).catch(console.error);

                  if (config.onSuccessStepId) {
                    runtimeContext.navigateToStep(config.onSuccessStepId);
                  }
                }}
              />
            </Elements>
          )
        ) : (
          <div className="text-sm text-muted-foreground">Preparing secure checkout…</div>
        )}
      </CardContent>
    </Card>
  );
}

function OrderSummary({
  lineItems,
  currency,
  total,
}: {
  lineItems: Array<{ price: any; qty: number; amount: number }>;
  currency: string;
  total: number;
}) {
  return (
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
      <h3 className="font-semibold text-sm">Order Summary</h3>

      <div className="space-y-2">
        {lineItems.map((li) => (
          <div key={li.price._id} className="flex justify-between text-sm">
            <span>
              {li.price.nickname} × {li.qty}
            </span>
            <span>{formatCurrency(li.amount, currency)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-2 flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatCurrency(total, currency)}</span>
      </div>
    </div>
  );
}

function CheckoutForm({
  clientSecret,
  onSuccess,
}: {
  clientSecret: string;
  onSuccess: (paymentIntent: any) => void | Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage("");

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message || "Payment failed");
        return;
      }

      const res = await stripe.retrievePaymentIntent(clientSecret);
      if (res.paymentIntent) {
        await onSuccess(res.paymentIntent);
      }
    } catch (err: any) {
      setMessage(err?.message ?? "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {message && <div className="text-sm text-red-600">{message}</div>}
      <Button disabled={isLoading || !stripe} className="w-full" type="submit">
        {isLoading ? "Processing..." : "Pay now"}
      </Button>
    </form>
  );
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}
