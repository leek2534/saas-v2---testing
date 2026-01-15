"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Variable } from "lucide-react";
import { RichText } from "../../../editor/RichText";
import type { TextSettings, TextSemanticTag } from "../types";
import type { JSONContent } from "@tiptap/core";

interface ContentSectionProps {
  settings: TextSettings;
  onChange: (path: string, value: any) => void;
  content?: JSONContent;
  onContentChange?: (content: JSONContent) => void;
}

export function ContentSection({ settings, onChange, content, onContentChange }: ContentSectionProps) {
  const isHeadingType = settings.subtype === "heading" || settings.subtype === "subheading";
  const isParagraphType = settings.subtype === "paragraph";

  const semanticTagOptions: TextSemanticTag[] = isHeadingType
    ? ["h1", "h2", "h3", "h4", "h5", "h6"]
    : ["p", "lead", "small"];

  return (
    <div className="space-y-4">
      {/* Text Content Editor */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Text Content</Label>
        {settings.content.richTextEnabled && content && onContentChange ? (
          <RichText
            value={content}
            editable={true}
            onChange={onContentChange}
            inline={true}
          />
        ) : isHeadingType && !settings.content.allowLineBreaks ? (
          <Input
            value={settings.content.text}
            onChange={(e) => onChange("content.text", e.target.value)}
            placeholder={settings.content.placeholder}
            className="text-sm"
          />
        ) : (
          <Textarea
            value={settings.content.text}
            onChange={(e) => onChange("content.text", e.target.value)}
            placeholder={settings.content.placeholder}
            className="text-sm min-h-[100px]"
          />
        )}
      </div>

      {/* Semantic Tag Selector */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Semantic Tag</Label>
        <Select
          value={settings.semanticTag}
          onValueChange={(value) => onChange("semanticTag", value)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {semanticTagOptions.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-500">
          {isHeadingType
            ? "Choose the appropriate heading level for SEO and accessibility"
            : "Choose paragraph style variant"}
        </p>
      </div>

      {/* Line Clamp */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Clamp Lines</Label>
          <Switch
            checked={settings.layout.clamp?.enabled ?? false}
            onCheckedChange={(checked) => onChange("layout.clamp.enabled", checked)}
          />
        </div>
        {settings.layout.clamp?.enabled && (
          <div className="space-y-2">
            <Input
              type="number"
              min={1}
              max={8}
              value={settings.layout.clamp.lines}
              onChange={(e) => onChange("layout.clamp.lines", Number(e.target.value))}
              className="text-sm"
            />
            <p className="text-xs text-slate-500">
              Limits text to specified lines with ellipsis overflow
            </p>
          </div>
        )}
      </div>

      {/* Placeholder Text */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Placeholder (Builder Only)</Label>
        <Input
          value={settings.content.placeholder ?? ""}
          onChange={(e) => onChange("content.placeholder", e.target.value)}
          placeholder="Enter placeholder text..."
          className="text-sm"
        />
      </div>

      {/* Dynamic Variables */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Dynamic Variables</Label>
          <Switch
            checked={settings.content.dynamicTokens?.enabled ?? false}
            onCheckedChange={(checked) => onChange("content.dynamicTokens.enabled", checked)}
          />
        </div>
        {settings.content.dynamicTokens?.enabled && (
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Variable className="h-3 w-3 mr-1" />
                  Insert Variable
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <p className="text-xs font-medium">Available Variables</p>
                  <div className="space-y-1">
                    {["{{first_name}}", "{{last_name}}", "{{email}}", "{{city}}", "{{company}}"].map((token) => (
                      <button
                        key={token}
                        onClick={() => {
                          const newText = settings.content.text + token;
                          onChange("content.text", newText);
                        }}
                        className="w-full text-left px-2 py-1 text-xs hover:bg-slate-100 rounded"
                      >
                        {token}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Input
              value={settings.content.dynamicTokens.fallback ?? ""}
              onChange={(e) => onChange("content.dynamicTokens.fallback", e.target.value)}
              placeholder="Fallback text if variable is empty"
              className="text-sm"
            />
          </div>
        )}
      </div>

      {/* Advanced: Allow Line Breaks (Headings) */}
      {isHeadingType && (
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium">Allow Line Breaks</Label>
              <p className="text-xs text-slate-500">Enable multi-line headings</p>
            </div>
            <Switch
              checked={settings.content.allowLineBreaks ?? false}
              onCheckedChange={(checked) => onChange("content.allowLineBreaks", checked)}
            />
          </div>
        </div>
      )}

      {/* Advanced: Preserve Whitespace (Paragraph) */}
      {isParagraphType && (
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium">Preserve Whitespace</Label>
              <p className="text-xs text-slate-500">Maintain spacing and line breaks</p>
            </div>
            <Switch
              checked={settings.layout.whiteSpace === "pre-wrap"}
              onCheckedChange={(checked) => onChange("layout.whiteSpace", checked ? "pre-wrap" : "normal")}
            />
          </div>
        </div>
      )}

      {/* Rich Text Mode Toggle */}
      <div className="pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium">Rich Text Mode</Label>
            <p className="text-xs text-slate-500">Enable formatting controls</p>
          </div>
          <Switch
            checked={settings.content.richTextEnabled ?? false}
            onCheckedChange={(checked) => onChange("content.richTextEnabled", checked)}
          />
        </div>
      </div>
    </div>
  );
}
