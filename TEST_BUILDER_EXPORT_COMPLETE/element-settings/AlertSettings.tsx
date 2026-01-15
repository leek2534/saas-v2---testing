"use client";

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Palette } from 'lucide-react';
import { EnhancedColorPicker } from './shared/EnhancedColorPicker';
import { SectionCard } from './shared/SectionCard';

interface AlertSettingsProps {
  node: { id: string; type: string; props: Record<string, any> };
  updateProps: (updates: Record<string, any>) => void;
}

export function AlertSettings({ node, updateProps }: AlertSettingsProps) {
  const props = node.props;

  return (
    <div className="p-4 space-y-4">
      {/* Content */}
      <SectionCard id="alert-content" title="Alert Content" icon={AlertCircle}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Alert Type</Label>
            <Select
              value={props.type || 'info'}
              onValueChange={(value) => updateProps({ type: value })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Title</Label>
            <Input
              value={props.title || 'Information'}
              onChange={(e) => updateProps({ title: e.target.value })}
              placeholder="Alert title"
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Message</Label>
            <Textarea
              value={props.message || 'This is an informational alert message.'}
              onChange={(e) => updateProps({ message: e.target.value })}
              placeholder="Alert message"
              className="min-h-[80px]"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Dismissible</Label>
            <Switch
              checked={props.dismissible ?? true}
              onCheckedChange={(checked) => updateProps({ dismissible: checked })}
            />
          </div>
        </div>
      </SectionCard>

      {/* Style */}
      <SectionCard id="alert-style" title="Style" icon={Palette}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Variant</Label>
            <Select
              value={props.variant || 'filled'}
              onValueChange={(value) => updateProps({ variant: value })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="filled">Filled</SelectItem>
                <SelectItem value="outlined">Outlined</SelectItem>
                <SelectItem value="subtle">Subtle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Show Icon</Label>
            <Switch
              checked={props.showIcon ?? true}
              onCheckedChange={(checked) => updateProps({ showIcon: checked })}
            />
          </div>
          <EnhancedColorPicker
            label="Custom Color"
            value={props.customColor || '#3b82f6'}
            onChange={(color) => updateProps({ customColor: color })}
          />
        </div>
      </SectionCard>
    </div>
  );
}
