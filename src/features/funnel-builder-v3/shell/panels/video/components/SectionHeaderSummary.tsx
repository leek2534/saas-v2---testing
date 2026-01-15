"use client";

import React from "react";

interface SectionHeaderSummaryProps {
  summary: string;
}

export function SectionHeaderSummary({ summary }: SectionHeaderSummaryProps) {
  if (!summary) return null;

  return (
    <span className="ml-auto text-xs text-slate-500 font-normal">
      {summary}
    </span>
  );
}
