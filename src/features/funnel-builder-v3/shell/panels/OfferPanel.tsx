"use client";

import React from "react";
import { useFunnelEditorStore } from "../../store/store";
import type { ElementNode } from "../../store/types";

interface OfferPanelProps {
  node: ElementNode;
}

export function OfferPanel({ node }: OfferPanelProps) {
  const select = useFunnelEditorStore((s) => s.select);

  const handleClose = () => {
    select(null);
  };

  return (
    <>
      <div className="border-b border-slate-200 pb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-900">Offer Block</div>
          <div className="mt-1 text-xs text-slate-500">{node.id}</div>
        </div>
        <button
          onClick={handleClose}
          className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          title="Close panel"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 4L4 12M4 4l8 8" />
          </svg>
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="text-sm font-medium text-purple-900 mb-2">
            💡 How to Configure
          </div>
          <div className="text-xs text-purple-700 space-y-2">
            <p>This Offer block is just a placeholder in the builder.</p>
            <p className="font-medium">To configure the offer product and copy:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Go back to the Funnel detail page</li>
              <li>Click "Settings" on this step</li>
              <li>Select the offer product</li>
              <li>Add headline and subheadline</li>
              <li>Set accept/decline routing</li>
              <li>Save settings</li>
            </ol>
            <p className="mt-3 pt-3 border-t border-purple-300">
              At runtime, this becomes a one-click offer button using the saved payment method from checkout.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="text-sm font-medium text-slate-900 mb-2">
            Config Location
          </div>
          <div className="text-xs text-slate-600">
            <p>✅ Config lives on the <strong>Step</strong> (not in the page)</p>
            <p className="mt-2">✅ This element is just a "mount point"</p>
            <p className="mt-2">✅ Edit step settings to configure product/copy/routing</p>
            <p className="mt-2">✅ Edit this page to design the layout around it</p>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm font-medium text-yellow-900 mb-2">
            ⚠️ Requirements
          </div>
          <div className="text-xs text-yellow-700">
            <p>One-click offers require:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
              <li>Checkout step must have "Enable One-Click Offers" turned on</li>
              <li>Customer must complete checkout first</li>
              <li>Payment method is saved during checkout</li>
            </ul>
          </div>
        </div>

        <div className="text-xs text-slate-500 italic">
          No visual settings available for this element. Configure offer details in the step settings.
        </div>
      </div>
    </>
  );
}
