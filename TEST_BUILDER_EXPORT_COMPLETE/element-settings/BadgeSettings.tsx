"use client";

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tag, Palette } from 'lucide-react';
import { EnhancedColorPicker } from './shared/EnhancedColorPicker';
import { SectionCard } from './shared/SectionCard';

interface BadgeSettingsProps {
  node: { id: string; type: string; props: Record<string, any> };
  updateProps: (updates: Record<string, any>) => void;
}

export function BadgeSettings({ node, updateProps }: BadgeSettingsProps) {
  const props = node.props;

  return (
    <div className="p-4 space-y-4">
      {/* Content */}
      <SectionCard id="badge-content" title="Badge Content" icon={Tag}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Text</Label>
            <Input
              value={props.text || 'New'}
              onChange={(e) => updateProps({ text: e.target.value })}
              placeholder="Badge text"
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Variant</Label>
            <Select
              value={props.variant || 'primary'}
              onValueChange={(value) => updateProps({ variant: value })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Size</Label>
            <Select
              value={props.size || 'medium'}
              onValueChange={(value) => updateProps({ size: value })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      {/* Style */}
      <SectionCard id="badge-style" title="Style" icon={Palette}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Border Radius</Label>
            <Select
              value={props.rounded || 'full'}
              onValueChange={(value) => updateProps({ rounded: value })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="full">Full (Pill)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Animated</Label>
            <Switch
              checked={props.animated ?? false}
              onCheckedChange={(checked) => updateProps({ animated: checked })}
            />
          </div>
          <EnhancedColorPicker
            label="Custom Color"
            value={props.customColor || '#3b82f6'}
            onChange={(color) => updateProps({ customColor: color })}
          />
          <EnhancedColorPicker
            label="Text Color"
            value={props.textColor || '#ffffff'}
            onChange={(color) => updateProps({ textColor: color })}
          />
        </div>
      </SectionCard>
    </div>
  );
}
