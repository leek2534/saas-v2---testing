"use client";

import React from "react";
import { Globe, CreditCard, FileText, Sparkles } from "lucide-react";
import { CategorySection } from "./CategorySection";

export function BlocksTab() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-xs font-semibold text-slate-500 mb-3">Pre-built Templates</div>

        {/* Website Templates */}
        <CategorySection
          id="website"
          label="Website"
          icon={Globe}
          defaultOpen={true}
        >
          <div className="space-y-2">
            <div className="text-xs text-slate-600 font-medium mb-2">Coming Soon:</div>
            <div className="text-xs text-slate-500 space-y-1">
              <div>• Hero Sections (5 variants)</div>
              <div>• Navigation Bars (3 variants)</div>
              <div>• Footers (3 variants)</div>
              <div>• Feature Sections (4 variants)</div>
              <div>• Testimonials (3 variants)</div>
              <div>• Pricing Tables (3 variants)</div>
              <div>• CTA Sections (4 variants)</div>
            </div>
          </div>
        </CategorySection>

        {/* Checkout Templates */}
        <CategorySection
          id="checkout-templates"
          label="Checkout Flows"
          icon={CreditCard}
          defaultOpen={true}
          highlight={true}
        >
          <div className="space-y-2">
            <div className="text-xs text-blue-600 font-medium mb-2">Coming Soon:</div>
            <div className="text-xs text-blue-600 space-y-1">
              <div>• 1-Step Checkout (3 templates)</div>
              <div>• 2-Step Checkout (3 templates)</div>
              <div>• 3-Step Checkout (2 templates)</div>
            </div>
            <div className="mt-3 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded p-2">
              💡 Use individual checkout elements from the Elements tab to build custom flows now
            </div>
          </div>
        </CategorySection>

        {/* Page Templates */}
        <CategorySection
          id="pages"
          label="Full Pages"
          icon={FileText}
          defaultOpen={false}
        >
          <div className="space-y-2">
            <div className="text-xs text-slate-600 font-medium mb-2">Coming Soon:</div>
            <div className="text-xs text-slate-500 space-y-1">
              <div>• Landing Pages</div>
              <div>• Sales Pages</div>
              <div>• Thank You Pages</div>
              <div>• Webinar Registration</div>
            </div>
          </div>
        </CategorySection>

        {/* Info Box */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-700">
              <div className="font-semibold mb-1">Template Library Coming Soon</div>
              <div className="text-slate-600">
                Drag-and-drop pre-built sections to build pages in seconds. For now, use the Elements tab to build custom layouts.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
