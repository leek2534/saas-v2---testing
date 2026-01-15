"use client";

import { Plus, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCanvasStateProps {
  onAddSection: () => void;
}

/**
 * EmptyCanvasState - Beautiful empty state shown when no sections exist
 */
export function EmptyCanvasState({ onAddSection }: EmptyCanvasStateProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-50 px-4 py-10 dark:bg-neutral-950">
      <div className="max-w-md text-center">
        {/* Icon circle */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white shadow-sm dark:bg-neutral-100 dark:text-neutral-900">
          <Layout className="h-6 w-6" />
        </div>

        {/* Heading */}
        <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          Start building your funnel
        </h2>

        {/* Description */}
        <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          Add sections, rows, and columns to create your perfect layout. Drag and
          drop elements to bring your vision to life.
        </p>

        {/* CTA Button */}
        <div className="mb-3 flex justify-center">
          <Button size="lg" onClick={onAddSection}>
            <Plus className="mr-2 h-4 w-4" />
            Add first section
          </Button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-neutral-500 dark:text-neutral-500">
          Or use the sidebar to browse templates and elements.
        </p>
      </div>
    </div>
  );
}
