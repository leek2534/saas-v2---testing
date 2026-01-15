"use client";

import { cn } from "@/lib/utils";

interface BrowserFrameProps {
  viewMode: "edit" | "preview";
  pageUrl?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * BrowserFrame - Wraps content in a browser-like frame with traffic lights and URL bar
 * Only shows the chrome in edit mode
 */
export function BrowserFrame({
  viewMode,
  pageUrl,
  children,
  className,
}: BrowserFrameProps) {
  const isEdit = viewMode === "edit";

  return (
    <div
      className={cn(
        "relative w-full rounded-xl border border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-950",
        className
      )}
    >
      {isEdit && (
        <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5 dark:border-neutral-800 dark:bg-neutral-900">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>

          {/* URL bar */}
          <div className="ml-3 flex-1">
            <div className="flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-500 shadow-inner dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
              <span className="truncate">
                {pageUrl || "https://your-funnel.test/page"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className={cn(isEdit ? "p-4 sm:p-5" : "p-0")}>{children}</div>
    </div>
  );
}
