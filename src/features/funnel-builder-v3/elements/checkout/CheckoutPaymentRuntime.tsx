'use client';

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CheckoutPaymentProps } from "../../types/checkout-elements";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutPaymentRuntimeProps {
  props: Partial<CheckoutPaymentProps>;
  clientSecret?: string;
  onSubmit?: () => Promise<void>;
}

function PaymentForm({ 
  props, 
  onSubmit 
}: { 
  props: Partial<CheckoutPaymentProps>; 
  onSubmit?: () => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    layout = "tabs",
    savePaymentMethod = false,
    showSaveOption = true,
    appearance = {},
  } = props;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      if (onSubmit) {
        await onSubmit();
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement 
        options={{
          layout: layout === "tabs" ? { type: "tabs" } : layout === "accordion" ? { type: "accordion" } : undefined,
        }}
      />
      
      {showSaveOption && savePaymentMethod && (
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="save-payment"
            className="h-4 w-4 rounded"
          />
          <label htmlFor="save-payment" className="text-sm text-slate-700">
            Save payment method for future purchases
          </label>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}
    </form>
  );
}

export function CheckoutPaymentRuntime({ props, clientSecret, onSubmit }: CheckoutPaymentRuntimeProps) {
  const {
    appearance = {},
  } = props;

  const {
    variables = {
      colorPrimary: "#3b82f6",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      borderRadius: "8px",
      borderColor: "#d1d5db",
    },
  } = appearance;

  if (!clientSecret) {
    return (
      <div className="w-full rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-center gap-2 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Initializing secure payment...</span>
        </div>
      </div>
    );
  }

  const stripeAppearance: any = {
    theme: (appearance.theme === 'none' ? undefined : appearance.theme || 'stripe'),
    variables: {
      colorPrimary: variables.colorPrimary,
      colorBackground: variables.colorBackground,
      colorText: variables.colorText,
      borderRadius: variables.borderRadius,
      fontFamily: variables.fontFamily,
      fontSizeBase: variables.fontSizeBase,
      spacingUnit: variables.spacingUnit,
    },
    rules: appearance.rules,
  };

  return (
    <div className="w-full rounded-lg border border-green-500 bg-white p-6">
      <div className="mb-2 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
        <span className="font-semibold">✓ LIVE RUNTIME</span>
        <span>Real Stripe Payment Element</span>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold" style={{ color: variables.colorText }}>
          Payment Method
        </h3>
        <p className="text-sm text-slate-500 mt-1">Enter your payment details</p>
      </div>

      <Elements 
        stripe={stripePromise} 
        options={{ 
          clientSecret,
          appearance: stripeAppearance,
        }}
      >
        <PaymentForm props={props} onSubmit={onSubmit} />
      </Elements>
    </div>
  );
}
