"use client";

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTestBuilderV2Store } from '../store';

interface FeatureBoxSettingsProps {
  elementId: string;
  props: Record<string, any>;
}

const ICONS = [
  'Zap', 'Star', 'Check', 'Heart', 'Shield', 'Rocket', 
  'Target', 'Award', 'Lightbulb', 'Users', 'Clock', 'TrendingUp'
];

export function FeatureBoxSettings({ elementId, props }: FeatureBoxSettingsProps) {
  const { updateElement } = useTestBuilderV2Store();

  const updateProps = (updates: Record<string, any>) => {
    updateElement(elementId, updates);
  };

  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="space-y-2">
        <Label>Icon</Label>
        <Select
          value={props.icon || 'Zap'}
          onValueChange={(value) => updateProps({ icon: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ICONS.map((icon) => (
              <SelectItem key={icon} value={icon}>{icon}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={props.title || 'Feature Title'}
          onChange={(e) => updateProps({ title: e.target.value })}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={props.description || 'Describe your amazing feature here.'}
          onChange={(e) => updateProps({ description: e.target.value })}
          rows={3}
        />
      </div>

      {/* Layout */}
      <div className="space-y-2">
        <Label>Layout</Label>
        <Select
          value={props.layout || 'vertical'}
          onValueChange={(value) => updateProps({ layout: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vertical">Vertical</SelectItem>
            <SelectItem value="horizontal">Horizontal</SelectItem>
            <SelectItem value="horizontal-reverse">Horizontal Reverse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Icon Style */}
      <div className="space-y-2">
        <Label>Icon Style</Label>
        <Select
          value={props.iconStyle || 'filled'}
          onValueChange={(value) => updateProps({ iconStyle: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="filled">Filled</SelectItem>
            <SelectItem value="outlined">Outlined</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Icon Size */}
      <div className="space-y-2">
        <Label>Icon Size</Label>
        <Select
          value={props.iconSize || 'md'}
          onValueChange={(value) => updateProps({ iconSize: value })}
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

      {/* Alignment */}
      <div className="space-y-2">
        <Label>Alignment</Label>
        <Select
          value={props.alignment || 'center'}
          onValueChange={(value) => updateProps({ alignment: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <Label>Colors</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Icon</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={props.iconColor || '#3b82f6'}
                onChange={(e) => updateProps({ iconColor: e.target.value })}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                value={props.iconColor || '#3b82f6'}
                onChange={(e) => updateProps({ iconColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Icon Background</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={props.iconBackgroundColor || '#eff6ff'}
                onChange={(e) => updateProps({ iconBackgroundColor: e.target.value })}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                value={props.iconBackgroundColor || '#eff6ff'}
                onChange={(e) => updateProps({ iconBackgroundColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={props.titleColor || '#111827'}
                onChange={(e) => updateProps({ titleColor: e.target.value })}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                value={props.titleColor || '#111827'}
                onChange={(e) => updateProps({ titleColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={props.descriptionColor || '#6b7280'}
                onChange={(e) => updateProps({ descriptionColor: e.target.value })}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                value={props.descriptionColor || '#6b7280'}
                onChange={(e) => updateProps({ descriptionColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Border & Shadow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Show Border</Label>
          <Switch
            checked={props.showBorder ?? false}
            onCheckedChange={(checked) => updateProps({ showBorder: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Show Shadow</Label>
          <Switch
            checked={props.showShadow ?? false}
            onCheckedChange={(checked) => updateProps({ showShadow: checked })}
          />
        </div>
      </div>
    </div>
  );
}
