"use client";

import React from "react";
import { TextSettingsPanel } from "../TextSettingsPanel";
import { useMockTextInspectorAdapter } from "../adapter/mockAdapter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TextInspectorDemoPage() {
  const headingAdapter = useMockTextInspectorAdapter("heading");
  const subheadingAdapter = useMockTextInspectorAdapter("subheading");
  const paragraphAdapter = useMockTextInspectorAdapter("paragraph");

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Text Settings Inspector Demo</h1>
          <p className="text-slate-600 mt-2">
            Comprehensive text settings panel for Heading, Subheading, and Paragraph elements
          </p>
        </div>

        <Tabs defaultValue="heading" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="heading">Heading</TabsTrigger>
            <TabsTrigger value="subheading">Subheading</TabsTrigger>
            <TabsTrigger value="paragraph">Paragraph</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inspector Panel */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: "800px" }}>
              <TabsContent value="heading" className="h-full m-0">
                <TextSettingsPanel
                  {...headingAdapter}
                  breadcrumbs={[
                    { id: "section-1", label: "Hero Section" },
                    { id: "row-1", label: "Row" },
                    { id: "col-1", label: "Column" },
                    { id: "heading-1", label: "Heading" },
                  ]}
                  seoWarnings={[]}
                />
              </TabsContent>

              <TabsContent value="subheading" className="h-full m-0">
                <TextSettingsPanel
                  {...subheadingAdapter}
                  breadcrumbs={[
                    { id: "section-2", label: "Features Section" },
                    { id: "row-2", label: "Row" },
                    { id: "col-2", label: "Column" },
                    { id: "subheading-1", label: "Subheading" },
                  ]}
                  seoWarnings={[]}
                />
              </TabsContent>

              <TabsContent value="paragraph" className="h-full m-0">
                <TextSettingsPanel
                  {...paragraphAdapter}
                  breadcrumbs={[
                    { id: "section-3", label: "Content Section" },
                    { id: "row-3", label: "Row" },
                    { id: "col-3", label: "Column" },
                    { id: "paragraph-1", label: "Paragraph" },
                  ]}
                  seoWarnings={[]}
                />
              </TabsContent>
            </div>

            {/* Live Preview */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
              
              <TabsContent value="heading" className="m-0">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8">
                  <div
                    style={{
                      fontFamily: headingAdapter.settings.typography.fontFamily,
                      fontWeight: headingAdapter.settings.typography.fontWeight,
                      fontSize: `${headingAdapter.settings.typography.fontSize.value}${headingAdapter.settings.typography.fontSize.unit}`,
                      lineHeight: String(headingAdapter.settings.typography.lineHeight.value),
                      letterSpacing: `${headingAdapter.settings.typography.letterSpacing.value}${headingAdapter.settings.typography.letterSpacing.unit}`,
                      textAlign: headingAdapter.settings.typography.align,
                      textTransform: headingAdapter.settings.typography.transform,
                      color: headingAdapter.settings.colorEffects.color,
                      opacity: headingAdapter.settings.colorEffects.opacity,
                      maxWidth: headingAdapter.settings.layout.maxWidth 
                        ? `${headingAdapter.settings.layout.maxWidth.value}${headingAdapter.settings.layout.maxWidth.unit}`
                        : undefined,
                      margin: headingAdapter.settings.layout.margin
                        ? `${headingAdapter.settings.layout.margin.top}px ${headingAdapter.settings.layout.margin.right}px ${headingAdapter.settings.layout.margin.bottom}px ${headingAdapter.settings.layout.margin.left}px`
                        : undefined,
                      padding: headingAdapter.settings.layout.padding
                        ? `${headingAdapter.settings.layout.padding.top}px ${headingAdapter.settings.layout.padding.right}px ${headingAdapter.settings.layout.padding.bottom}px ${headingAdapter.settings.layout.padding.left}px`
                        : undefined,
                    }}
                  >
                    {headingAdapter.settings.content.text || headingAdapter.settings.content.placeholder}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="subheading" className="m-0">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8">
                  <div
                    style={{
                      fontFamily: subheadingAdapter.settings.typography.fontFamily,
                      fontWeight: subheadingAdapter.settings.typography.fontWeight,
                      fontSize: `${subheadingAdapter.settings.typography.fontSize.value}${subheadingAdapter.settings.typography.fontSize.unit}`,
                      lineHeight: String(subheadingAdapter.settings.typography.lineHeight.value),
                      letterSpacing: `${subheadingAdapter.settings.typography.letterSpacing.value}${subheadingAdapter.settings.typography.letterSpacing.unit}`,
                      textAlign: subheadingAdapter.settings.typography.align,
                      textTransform: subheadingAdapter.settings.typography.transform,
                      color: subheadingAdapter.settings.colorEffects.color,
                      opacity: subheadingAdapter.settings.colorEffects.opacity,
                      maxWidth: subheadingAdapter.settings.layout.maxWidth 
                        ? `${subheadingAdapter.settings.layout.maxWidth.value}${subheadingAdapter.settings.layout.maxWidth.unit}`
                        : undefined,
                      margin: subheadingAdapter.settings.layout.margin
                        ? `${subheadingAdapter.settings.layout.margin.top}px ${subheadingAdapter.settings.layout.margin.right}px ${subheadingAdapter.settings.layout.margin.bottom}px ${subheadingAdapter.settings.layout.margin.left}px`
                        : undefined,
                      padding: subheadingAdapter.settings.layout.padding
                        ? `${subheadingAdapter.settings.layout.padding.top}px ${subheadingAdapter.settings.layout.padding.right}px ${subheadingAdapter.settings.layout.padding.bottom}px ${subheadingAdapter.settings.layout.padding.left}px`
                        : undefined,
                    }}
                  >
                    {subheadingAdapter.settings.content.text || subheadingAdapter.settings.content.placeholder}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="paragraph" className="m-0">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8">
                  <div
                    style={{
                      fontFamily: paragraphAdapter.settings.typography.fontFamily,
                      fontWeight: paragraphAdapter.settings.typography.fontWeight,
                      fontSize: `${paragraphAdapter.settings.typography.fontSize.value}${paragraphAdapter.settings.typography.fontSize.unit}`,
                      lineHeight: String(paragraphAdapter.settings.typography.lineHeight.value),
                      letterSpacing: `${paragraphAdapter.settings.typography.letterSpacing.value}${paragraphAdapter.settings.typography.letterSpacing.unit}`,
                      textAlign: paragraphAdapter.settings.typography.align,
                      textTransform: paragraphAdapter.settings.typography.transform,
                      color: paragraphAdapter.settings.colorEffects.color,
                      opacity: paragraphAdapter.settings.colorEffects.opacity,
                      maxWidth: paragraphAdapter.settings.layout.maxWidth 
                        ? `${paragraphAdapter.settings.layout.maxWidth.value}${paragraphAdapter.settings.layout.maxWidth.unit}`
                        : undefined,
                      margin: paragraphAdapter.settings.layout.margin
                        ? `${paragraphAdapter.settings.layout.margin.top}px ${paragraphAdapter.settings.layout.margin.right}px ${paragraphAdapter.settings.layout.margin.bottom}px ${paragraphAdapter.settings.layout.margin.left}px`
                        : undefined,
                      padding: paragraphAdapter.settings.layout.padding
                        ? `${paragraphAdapter.settings.layout.padding.top}px ${paragraphAdapter.settings.layout.padding.right}px ${paragraphAdapter.settings.layout.padding.bottom}px ${paragraphAdapter.settings.layout.padding.left}px`
                        : undefined,
                    }}
                  >
                    {paragraphAdapter.settings.content.text || paragraphAdapter.settings.content.placeholder}
                  </div>
                </div>
              </TabsContent>

              <div className="mt-6 p-4 bg-slate-50 rounded border border-slate-200">
                <h3 className="text-sm font-semibold mb-2">Features Demonstrated:</h3>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>✓ 9 Accordion sections with summaries</li>
                  <li>✓ Device toggle (Desktop/Tablet/Mobile)</li>
                  <li>✓ Preset system with 6 presets</li>
                  <li>✓ Live preview strip</li>
                  <li>✓ Typography controls (font, size, weight, spacing)</li>
                  <li>✓ Color & effects (shadows, strokes, highlights)</li>
                  <li>✓ Spacing & layout (margin, padding, max-width)</li>
                  <li>✓ Responsive visibility & scaling</li>
                  <li>✓ Actions & links (block click, inline styles)</li>
                  <li>✓ SEO & accessibility warnings</li>
                  <li>✓ Advanced settings (classes, data attrs, tracking)</li>
                </ul>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
