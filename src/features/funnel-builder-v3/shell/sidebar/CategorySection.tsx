"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  id: string;
  label: string;
  icon?: LucideIcon;
  defaultOpen?: boolean;
  collapsible?: boolean;
  highlight?: boolean;
  children: React.ReactNode;
}

export function CategorySection({
  id,
  label,
  icon: Icon,
  defaultOpen = false,
  collapsible = true,
  highlight = false,
  children,
}: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "rounded-xl border p-2",
        highlight
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-white"
      )}
    >
      <button
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-2 py-1.5 text-sm font-semibold transition-colors",
          highlight ? "text-blue-700" : "text-slate-700",
          collapsible && "hover:bg-slate-50 rounded-lg"
        )}
        disabled={!collapsible}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          <span>{label}</span>
        </div>
        {collapsible && (
          isOpen ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )
        )}
      </button>

      {isOpen && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
}
