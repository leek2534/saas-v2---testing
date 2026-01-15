"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Monitor, Tablet, Smartphone } from "lucide-react";

// Standard viewport sizes based on 2025 web design standards
export const VIEWPORT_SIZES = {
  mobile: {
    width: "375px",
    minWidth: "375px",
    maxWidth: undefined,
    label: "Mobile · 375px",
  },
  tablet: {
    width: "768px",
    minWidth: "768px",
    maxWidth: undefined,
    label: "Tablet · 768px",
  },
  desktop: {
    width: "100%",
    minWidth: "320px",
    maxWidth: "1440px",
    label: "Desktop · 1440px",
  },
} as const;

export type ViewportType = keyof typeof VIEWPORT_SIZES;

interface CanvasViewportProps {
  viewport: ViewportType;
  viewMode: "edit" | "preview";
  children: React.ReactNode;
  className?: string;
}

/**
 * CanvasViewport - Handles viewport sizing and indicator badge
 * Wraps the canvas content with proper width constraints
 */
export const CanvasViewport = forwardRef<HTMLDivElement, CanvasViewportProps>(
  ({ viewport, viewMode, children, className }, ref) => {
    const sizes = VIEWPORT_SIZES[viewport];

    return (
      <div
        className={cn(
          "relative flex h-full w-full items-start justify-center overflow-auto bg-neutral-100 dark:bg-neutral-900",
          className
        )}
      >
        {/* Stage background (centered viewport frame) */}
        <div
          ref={ref}
          className={cn(
            "relative my-8 rounded-lg border border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-950",
            "transition-[width] duration-200 ease-out"
          )}
          style={{
            width: sizes.width,
            minWidth: sizes.minWidth,
            maxWidth: sizes.maxWidth,
          }}
        >
          {/* Viewport Indicator Badge */}
          {viewMode === "edit" && (
            <div className="pointer-events-none absolute left-4 top-4 z-20">
              <ViewportIndicator viewport={viewport} />
            </div>
          )}

          {/* Canvas content */}
          <div className="relative z-10 px-4 pb-6 pt-12 sm:px-6 sm:pb-8">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

CanvasViewport.displayName = "CanvasViewport";

/**
 * ViewportIndicator - Shows current viewport size with icon
 */
function ViewportIndicator({ viewport }: { viewport: ViewportType }) {
  const config = {
    mobile: {
      icon: Smartphone,
      colors:
        "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
    },
    tablet: {
      icon: Tablet,
      colors:
        "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
    },
    desktop: {
      icon: Monitor,
      colors:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    },
  } as const;

  const { icon: Icon, colors } = config[viewport];
  const label = VIEWPORT_SIZES[viewport].label;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-sm",
        colors
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}
