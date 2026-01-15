"use client";

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTestBuilderV2Store } from '../store';

interface GuaranteeSettingsProps {
  elementId: string;
  props: Record<string, any>;
}

export function GuaranteeSettings({ elementId, props }: GuaranteeSettingsProps) {
  const { updateElement } = useTestBuilderV2Store();

  const updateProps = (updates: Record<string, any>) => {
    updateElement(elementId, updates);
  };

  return (
    <div className="space-y-6">
      {/* Variant */}
      <div className="space-y-2">
        <Label>Style</Label>
        <Select
          value={props.variant || 'gold-seal'}
          onValueChange={(value) => updateProps({ variant: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gold-seal">Gold Seal</SelectItem>
            <SelectItem value="green-shield">Green Shield</SelectItem>
            <SelectItem value="blue-ribbon">Blue Ribbon</SelectItem>
            <SelectItem value="red-badge">Red Badge</SelectItem>
            <SelectItem value="premium-gold">Premium Gold</SelectItem>
            <SelectItem value="trust-badge">Trust Badge</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Days */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Show Days</Label>
          <Switch
            checked={props.showDays ?? true}
            onCheckedChange={(checked) => updateProps({ showDays: checked })}
          />
        </div>
        {(props.showDays ?? true) && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Number of Days</Label>
            <Input
              type="number"
              value={props.days || 30}
              onChange={(e) => updateProps({ days: parseInt(e.target.value) || 30 })}
              min={1}
              max={365}
            />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={props.title || 'Money Back'}
          onChange={(e) => updateProps({ title: e.target.value })}
          placeholder="Money Back"
        />
      </div>

      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input
          value={props.subtitle || 'Guarantee'}
          onChange={(e) => updateProps({ subtitle: e.target.value })}
          placeholder="Guarantee"
        />
      </div>

      {/* Size */}
      <div className="space-y-2">
        <Label>Size</Label>
        <Select
          value={props.size || 'md'}
          onValueChange={(value) => updateProps({ size: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <Label>Colors</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Primary</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={props.primaryColor || '#10b981'}
                onChange={(e) => updateProps({ primaryColor: e.target.value })}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                value={props.primaryColor || '#10b981'}
                onChange={(e) => updateProps({ primaryColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Secondary</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={props.secondaryColor || '#059669'}
                onChange={(e) => updateProps({ secondaryColor: e.target.value })}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                value={props.secondaryColor || '#059669'}
                onChange={(e) => updateProps({ secondaryColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Text</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={props.textColor || '#ffffff'}
                onChange={(e) => updateProps({ textColor: e.target.value })}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                value={props.textColor || '#ffffff'}
                onChange={(e) => updateProps({ textColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
