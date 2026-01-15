"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement as StripePaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PaymentElementProps = {
  priceIds: Id<"catalogPrices">[];
  quantities: number[];
  savePaymentMethod?: boolean;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  metadata?: {
    funnelId: string;
    stepId: string;
  };
};

export function PaymentElement(props: PaymentElementProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const createPaymentIntent = useMutation(api.stripe.createPaymentIntent);

  useEffect(() => {
    const initPayment = async () => {
      try {
        const result = await createPaymentIntent({
          priceIds: props.priceIds,
          quantities: props.quantities,
          savePaymentMethod: props.savePaymentMethod || false,
          metadata: props.metadata,
        });

        setClientSecret(result.clientSecret!);
      } catch (error) {
        console.error("Failed to create payment intent:", error);
        props.onError?.(error instanceof Error ? error.message : "Failed to initialize payment");
      } finally {
        setIsLoading(false);
      }
    };

    initPayment();
  }, []);

  if (isLoading || !clientSecret) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      }}
    >
      <PaymentForm {...props} />
    </Elements>
  );
}

function PaymentForm({
  onSuccess,
  onError,
}: Pick<PaymentElementProps, "onSuccess" | "onError">) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("idle");
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) {
      setPaymentStatus("error");
      setErrorMessage(error.message || "Payment failed");
      onError?.(error.message || "Payment failed");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setPaymentStatus("success");
      onSuccess?.(paymentIntent.id);
    }

    setIsProcessing(false);
  };

  if (paymentStatus === "success") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold text-green-900 mb-2">Payment Successful!</h3>
          <p className="text-sm text-green-700">Your payment has been processed.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Enter your payment information to complete your purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <StripePaymentElement />

          {paymentStatus === "error" && errorMessage && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Payment Failed</p>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Payment"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
