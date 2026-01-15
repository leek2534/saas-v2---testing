"use client";

import React, { useState } from "react";
import { useFunnelEditorStore } from "../../store/store";
import type { ElementNode } from "../../store/types";

interface CheckoutPanelProps {
  node: ElementNode;
}

export function CheckoutPanel({ node }: CheckoutPanelProps) {
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);
  const select = useFunnelEditorStore((s) => s.select);

  const handleClose = () => {
    select(null);
  };

  return (
    <>
      <div className="border-b border-slate-200 pb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-900">Checkout Block</div>
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
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-blue-900 mb-2">
            💡 How to Configure
          </div>
          <div className="text-xs text-blue-700 space-y-2">
            <p>This Checkout block is just a placeholder in the builder.</p>
            <p className="font-medium">To configure what products are sold:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Go back to the Funnel detail page</li>
              <li>Click "Settings" on this step</li>
              <li>Select products and configure options</li>
              <li>Save settings</li>
            </ol>
            <p className="mt-3 pt-3 border-t border-blue-300">
              At runtime, this becomes a real Stripe payment form with the products you configured.
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
            <p className="mt-2">✅ Edit step settings to configure products/routing</p>
            <p className="mt-2">✅ Edit this page to design the layout around it</p>
          </div>
        </div>

        <div className="text-xs text-slate-500 italic">
          No visual settings available for this element. Configure products and checkout options in the step settings.
        </div>
      </div>
    </>
  );
}
