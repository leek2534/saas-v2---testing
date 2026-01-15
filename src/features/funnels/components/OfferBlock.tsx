"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import type { OfferConfig } from "../types";

interface OfferBlockProps {
  runtimeContext: {
    funnelId: Id<"funnels">;
    stepId: Id<"funnelSteps">;
    runId: string;
    config: OfferConfig;
    navigateToStep: (stepId: string) => void;
  };
}

export function OfferBlock({ runtimeContext }: OfferBlockProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assertRunReady = useQuery(
    api.funnelRuns.assertRunReadyForOffers,
    {
      funnelId: runtimeContext.funnelId,
      runId: runtimeContext.runId,
    }
  );

  const createOneClickCharge = useMutation(api.stripe.checkout.createOneClickCharge);
  const config = runtimeContext.config;

  const handleAccept = async () => {
    setLoading(true);
    setError(null);

    try {
      // Guard: ensure run is ready for offers
      if (!assertRunReady) {
        throw new Error("Payment method not available for one-click offers");
      }

      if (!assertRunReady.stripeCustomerId || !assertRunReady.stripePaymentMethodId) {
        throw new Error("Payment method not saved - one-click offers unavailable");
      }

      // Charge using stored payment method
      const result = await createOneClickCharge({
        priceId: config.priceId as any,
        customerId: assertRunReady.stripeCustomerId,
        paymentMethodId: assertRunReady.stripePaymentMethodId,
        runId: runtimeContext.runId,
        metadata: {
          funnelId: runtimeContext.funnelId,
          stepId: runtimeContext.stepId,
          offerId: config.offerId,
        },
      });

      if (result.status === "succeeded") {
        // Navigate to accept route
        if (config.onAcceptStepId) {
          runtimeContext.navigateToStep(config.onAcceptStepId);
        }
      } else {
        setError("Payment processing - please wait...");
        // Payment is processing, webhook will handle completion
        setTimeout(() => {
          if (config.onAcceptStepId) {
            runtimeContext.navigateToStep(config.onAcceptStepId);
          }
        }, 2000);
      }
    } catch (err) {
      console.error("Offer charge failed:", err);
      setError(err instanceof Error ? err.message : "Failed to process offer");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    if (config.onDeclineStepId) {
      runtimeContext.navigateToStep(config.onDeclineStepId);
    }
  };

  if (!assertRunReady) {
    return (
      <div className="offer-block border rounded-lg p-6 bg-white max-w-2xl mx-auto">
        <div className="text-yellow-600">
          <h3 className="font-semibold mb-2">Offer Not Available</h3>
          <p>Please complete checkout first to access this offer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="offer-block border rounded-lg p-6 bg-white max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Special Offer!</h2>
      <p className="text-muted-foreground mb-6">
        Get this exclusive offer with one-click checkout using your saved payment method.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleAccept}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition"
        >
          {loading ? "Processing..." : "Yes, Add to My Order!"}
        </button>
        <button
          onClick={handleDecline}
          disabled={loading}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          No Thanks
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Your saved payment method will be charged immediately
      </p>
    </div>
  );
}
