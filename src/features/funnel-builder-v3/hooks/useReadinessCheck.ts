"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { checkFunnelReadiness, type Funnel } from "../lib/readiness-engine";
import type { FunnelReadiness, PriceWithStatus } from "../types/payments";

interface UseReadinessCheckOptions {
  funnel: Funnel | null;
  enabled?: boolean;
}

export function useReadinessCheck({ funnel, enabled = true }: UseReadinessCheckOptions) {
  const [readiness, setReadiness] = useState<FunnelReadiness | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Fetch all prices with their sync status
  // TODO: Replace with your actual query to fetch prices
  const allPrices = useQuery(api.catalog.prices.listAll) as PriceWithStatus[] | undefined;

  useEffect(() => {
    if (!enabled || !funnel || !allPrices) {
      setReadiness(null);
      return;
    }

    setIsChecking(true);
    try {
      const result = checkFunnelReadiness(funnel, allPrices);
      setReadiness(result);
    } catch (error) {
      console.error("Error checking funnel readiness:", error);
      setReadiness(null);
    } finally {
      setIsChecking(false);
    }
  }, [funnel, allPrices, enabled]);

  const recheckReadiness = () => {
    if (!funnel || !allPrices) return;
    
    setIsChecking(true);
    try {
      const result = checkFunnelReadiness(funnel, allPrices);
      setReadiness(result);
    } finally {
      setIsChecking(false);
    }
  };

  return {
    readiness,
    isChecking,
    recheckReadiness,
  };
}
