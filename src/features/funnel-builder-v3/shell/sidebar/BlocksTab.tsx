"use client";

import React from "react";
import { Globe, CreditCard, FileText, Sparkles, Plus } from "lucide-react";
import { CategorySection } from "./CategorySection";
import { HERO_TEMPLATES, NAVBAR_TEMPLATES, FOOTER_TEMPLATES, FEATURE_TEMPLATES, CTA_TEMPLATES } from "../../templates/template-library";
import { useFunnelEditorStore } from "../../store/store";

export function BlocksTab() {
  const insertTemplate = useFunnelEditorStore((s) => s.insertTemplate);

  const handleInsertTemplate = (templateStructure: any) => {
    insertTemplate(templateStructure);
  };

  const renderTemplateButton = (template: any) => (
    <button
      key={template.id}
      onClick={() => handleInsertTemplate(template.structure)}
      className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <Plus className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-slate-900 mb-1">{template.name}</div>
          <div className="text-xs text-slate-500">{template.description}</div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* Website Templates */}
        <CategorySection
          id="website"
          label="Website"
          icon={Globe}
          defaultOpen={true}
        >
          <div className="space-y-3">
            {/* Heroes */}
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-2">Hero Sections</div>
              <div className="space-y-2">
                {HERO_TEMPLATES.map(renderTemplateButton)}
              </div>
            </div>

            {/* Navbars */}
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-2">Navigation Bars</div>
              <div className="space-y-2">
                {NAVBAR_TEMPLATES.map(renderTemplateButton)}
              </div>
            </div>

            {/* Footers */}
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-2">Footers</div>
              <div className="space-y-2">
                {FOOTER_TEMPLATES.map(renderTemplateButton)}
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-2">Feature Sections</div>
              <div className="space-y-2">
                {FEATURE_TEMPLATES.map(renderTemplateButton)}
              </div>
            </div>

            {/* CTA */}
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-2">Call-to-Action</div>
              <div className="space-y-2">
                {CTA_TEMPLATES.map(renderTemplateButton)}
              </div>
            </div>
          </div>
        </CategorySection>

        {/* Checkout Templates */}
        <CategorySection
          id="checkout-templates"
          label="Checkout Flows"
          icon={CreditCard}
          defaultOpen={false}
          highlight={true}
        >
          <div className="space-y-2">
            <div className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded p-2">
              💡 Coming Soon: Pre-built 1-step, 2-step, and 3-step checkout templates
            </div>
            <div className="text-xs text-blue-600">
              Use individual checkout elements from the Elements tab to build custom flows now
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
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded p-2">
              Coming Soon: Complete page templates (Landing Pages, Sales Pages, etc.)
            </div>
          </div>
        </CategorySection>

        {/* Info Box */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-700">
              <div className="font-semibold mb-1">Quick Start Templates</div>
              <div className="text-slate-600">
                Click any template to insert it into your page. Customize the content and styling to match your brand.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
