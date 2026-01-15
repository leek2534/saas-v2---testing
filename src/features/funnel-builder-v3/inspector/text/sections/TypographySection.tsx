"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline, Strikethrough } from "lucide-react";
import type { TextSettings } from "../types";

interface TypographySectionProps {
  settings: TextSettings;
  onChange: (path: string, value: any) => void;
}

export function TypographySection({ settings, onChange }: TypographySectionProps) {
  const isHeadingType = settings.subtype === "heading" || settings.subtype === "subheading";
  const isParagraphType = settings.subtype === "paragraph";

  return (
    <div className="space-y-4">
      {/* Font Family */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Font Family</Label>
        <Select
          value={settings.typography.fontFamily}
          onValueChange={(value) => onChange("typography.fontFamily", value)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Inter">Inter</SelectItem>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Font Weight */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Font Weight</Label>
        <Select
          value={String(settings.typography.fontWeight)}
          onValueChange={(value) => onChange("typography.fontWeight", Number(value))}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="300">300 - Light</SelectItem>
            <SelectItem value="400">400 - Normal</SelectItem>
            <SelectItem value="500">500 - Medium</SelectItem>
            <SelectItem value="600">600 - Semibold</SelectItem>
            <SelectItem value="700">700 - Bold</SelectItem>
            <SelectItem value="800">800 - Extrabold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Font Size</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={8}
            max={200}
            value={settings.typography.fontSize.value}
            onChange={(e) => onChange("typography.fontSize.value", Number(e.target.value))}
            className="text-sm"
          />
          <Select
            value={settings.typography.fontSize.unit}
            onValueChange={(value) => onChange("typography.fontSize.unit", value)}
          >
            <SelectTrigger className="w-20 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="px">px</SelectItem>
              <SelectItem value="rem">rem</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Line Height */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Line Height</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0.5}
            max={5}
            step={0.1}
            value={settings.typography.lineHeight.value}
            onChange={(e) => onChange("typography.lineHeight.value", Number(e.target.value))}
            className="text-sm"
          />
          <Select
            value={settings.typography.lineHeight.unit}
            onValueChange={(value) => onChange("typography.lineHeight.unit", value)}
          >
            <SelectTrigger className="w-24 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unitless">unitless</SelectItem>
              <SelectItem value="px">px</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Letter Spacing */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Letter Spacing</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={-5}
            max={10}
            step={0.01}
            value={settings.typography.letterSpacing.value}
            onChange={(e) => onChange("typography.letterSpacing.value", Number(e.target.value))}
            className="text-sm"
          />
          <Select
            value={settings.typography.letterSpacing.unit}
            onValueChange={(value) => onChange("typography.letterSpacing.unit", value)}
          >
            <SelectTrigger className="w-20 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="px">px</SelectItem>
              <SelectItem value="em">em</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Text Align */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Text Align</Label>
        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => onChange("typography.align", "left")}
            className={`inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium transition-colors ${
              settings.typography.align === "left"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
            aria-label="Align left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange("typography.align", "center")}
            className={`inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium transition-colors ${
              settings.typography.align === "center"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
            aria-label="Align center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange("typography.align", "right")}
            className={`inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium transition-colors ${
              settings.typography.align === "right"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
            aria-label="Align right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange("typography.align", "justify")}
            className={`inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium transition-colors ${
              settings.typography.align === "justify"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
            aria-label="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Text Transform */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Text Transform</Label>
        <Select
          value={settings.typography.transform}
          onValueChange={(value) => onChange("typography.transform", value)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="uppercase">UPPERCASE</SelectItem>
            <SelectItem value="lowercase">lowercase</SelectItem>
            <SelectItem value="capitalize">Capitalize</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Basic Styles */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Text Styles</Label>
        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => onChange("typography.bold", !(settings.typography.bold ?? false))}
            className={`inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium transition-colors ${
              settings.typography.bold
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange("typography.italic", !(settings.typography.italic ?? false))}
            className={`inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium transition-colors ${
              settings.typography.italic
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange("typography.underline", !(settings.typography.underline ?? false))}
            className={`inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium transition-colors ${
              settings.typography.underline
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
            aria-label="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange("typography.strike", !(settings.typography.strike ?? false))}
            className={`inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium transition-colors ${
              settings.typography.strike
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
            aria-label="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
        </div>
        {!settings.content.richTextEnabled && (
          <p className="text-xs text-slate-500">
            Styles apply to entire text block (enable Rich Text for inline formatting)
          </p>
        )}
      </div>

      {/* Balance Text (Headings) */}
      {isHeadingType && (
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium">Balance Text</Label>
              <p className="text-xs text-slate-500">Optimize line breaks for readability</p>
            </div>
            <Switch
              checked={settings.typography.wrap === "balance"}
              onCheckedChange={(checked) => onChange("typography.wrap", checked ? "balance" : "normal")}
            />
          </div>
        </div>
      )}

      {/* Advanced: Hyphenation (Paragraph) */}
      {isParagraphType && (
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium">Hyphenation</Label>
              <p className="text-xs text-slate-500">Auto-hyphenate long words</p>
            </div>
            <Switch
              checked={settings.typography.hyphenation ?? false}
              onCheckedChange={(checked) => onChange("typography.hyphenation", checked)}
            />
          </div>
        </div>
      )}

      {/* Advanced: Wrap Behavior */}
      <div className="pt-3 border-t border-slate-200 space-y-2">
        <Label className="text-xs font-medium">Wrap Behavior</Label>
        <Select
          value={settings.typography.wrap}
          onValueChange={(value) => onChange("typography.wrap", value)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="break-word">Break Word</SelectItem>
            <SelectItem value="balance">Balance</SelectItem>
            <SelectItem value="nowrap">No Wrap</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
