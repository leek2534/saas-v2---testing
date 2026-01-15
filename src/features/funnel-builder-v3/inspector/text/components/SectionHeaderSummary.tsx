"use client";

import React from "react";

interface SectionHeaderSummaryProps {
  summary: string;
}

export function SectionHeaderSummary({ summary }: SectionHeaderSummaryProps) {
  return (
    <span className="ml-auto text-xs font-normal text-slate-500 truncate max-w-[200px]">
      {summary}
    </span>
  );
}
