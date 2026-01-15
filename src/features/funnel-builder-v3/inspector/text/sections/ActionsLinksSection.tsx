"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ColorPicker } from "../components/ColorPicker";
import type { TextSettings } from "../types";

interface ActionsLinksSectionProps {
  settings: TextSettings;
  onChange: (path: string, value: any) => void;
}

export function ActionsLinksSection({ settings, onChange }: ActionsLinksSectionProps) {
  const hasBlockAction = settings.actions.blockClick.type !== "none";
  const isUrlAction = settings.actions.blockClick.type === "url";

  return (
    <div className="space-y-4">
      {/* Block Click Action */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Block Click Action</Label>
        <Select
          value={settings.actions.blockClick.type}
          onValueChange={(value) => onChange("actions.blockClick.type", value)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="url">Go to URL</SelectItem>
            <SelectItem value="scroll">Scroll to Section</SelectItem>
            <SelectItem value="popup">Open Popup</SelectItem>
            <SelectItem value="next_step">Next Step</SelectItem>
            <SelectItem value="form_step">Trigger Form Step</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-500">
          Make the entire text block clickable
        </p>
      </div>

      {/* URL Action Settings */}
      {isUrlAction && (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">URL</Label>
            <Input
              type="url"
              value={settings.actions.blockClick.url ?? ""}
              onChange={(e) => onChange("actions.blockClick.url", e.target.value)}
              placeholder="https://example.com"
              className="text-xs"
            />
            {!settings.actions.blockClick.url && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  URL is required for this action
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="open-new-tab"
              checked={settings.actions.blockClick.openNewTab ?? false}
              onCheckedChange={(checked: boolean) => onChange("actions.blockClick.openNewTab", checked)}
            />
            <label
              htmlFor="open-new-tab"
              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Open in new tab
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="nofollow"
              checked={settings.actions.blockClick.nofollow ?? false}
              onCheckedChange={(checked: boolean) => onChange("actions.blockClick.nofollow", checked)}
            />
            <label
              htmlFor="nofollow"
              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Add nofollow attribute
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="utm-passthrough"
              checked={settings.actions.blockClick.utmPassthrough ?? false}
              onCheckedChange={(checked: boolean) => onChange("actions.blockClick.utmPassthrough", checked)}
            />
            <label
              htmlFor="utm-passthrough"
              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Pass through UTM parameters
            </label>
          </div>
        </div>
      )}

      {/* Scroll Action Settings */}
      {settings.actions.blockClick.type === "scroll" && (
        <div className="space-y-1">
          <Label className="text-xs text-slate-600">Section ID</Label>
          <Input
            value={settings.actions.blockClick.sectionId ?? ""}
            onChange={(e) => onChange("actions.blockClick.sectionId", e.target.value)}
            placeholder="section-id"
            className="text-xs"
          />
        </div>
      )}

      {/* Popup Action Settings */}
      {settings.actions.blockClick.type === "popup" && (
        <div className="space-y-1">
          <Label className="text-xs text-slate-600">Popup ID</Label>
          <Input
            value={settings.actions.blockClick.popupId ?? ""}
            onChange={(e) => onChange("actions.blockClick.popupId", e.target.value)}
            placeholder="popup-id"
            className="text-xs"
          />
        </div>
      )}

      {/* Inline Links Style */}
      <div className="pt-3 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium">Inline Links</Label>
            <p className="text-xs text-slate-500">Style for links within text</p>
          </div>
          <Switch
            checked={settings.actions.linkStyle.enabled}
            onCheckedChange={(checked: boolean) => onChange("actions.linkStyle.enabled", checked)}
          />
        </div>
        {settings.actions.linkStyle.enabled && (
          <>
            {!settings.content.richTextEnabled && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Inline links require Rich Text mode to be enabled
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-3">
              <ColorPicker
                value={settings.actions.linkStyle.color ?? "#3b82f6"}
                onChange={(value) => onChange("actions.linkStyle.color", value)}
                label="Link Color"
              />
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Underline</Label>
                <Select
                  value={settings.actions.linkStyle.underline ?? "hover"}
                  onValueChange={(value) => onChange("actions.linkStyle.underline", value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Always</SelectItem>
                    <SelectItem value="hover">On Hover</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ColorPicker
                value={settings.actions.linkStyle.hoverColor ?? "#2563eb"}
                onChange={(value) => onChange("actions.linkStyle.hoverColor", value)}
                label="Hover Color"
              />
            </div>
          </>
        )}
      </div>

      {/* Click Tracking */}
      <div className="pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium">Click Tracking</Label>
            <p className="text-xs text-slate-500">Track clicks for analytics</p>
          </div>
          <Switch
            checked={settings.advanced.tracking?.enabled ?? false}
            onCheckedChange={(checked: boolean) => onChange("advanced.tracking.enabled", checked)}
          />
        </div>
      </div>
    </div>
  );
}
