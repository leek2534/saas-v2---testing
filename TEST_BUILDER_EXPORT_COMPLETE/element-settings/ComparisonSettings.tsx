"use client";

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTestBuilderV2Store } from '../store';
import { Plus, Trash2 } from 'lucide-react';

interface ComparisonSettingsProps {
  elementId: string;
  props: Record<string, any>;
}

const DEFAULT_ITEMS = [
  { label: 'Feature One', left: 'no', right: 'yes' },
  { label: 'Feature Two', left: 'partial', right: 'yes' },
  { label: 'Feature Three', left: 'no', right: 'yes' },
  { label: 'Feature Four', left: 'yes', right: 'yes' },
  { label: 'Feature Five', left: 'no', right: 'yes' },
];

export function ComparisonSettings({ elementId, props }: ComparisonSettingsProps) {
  const { updateElement } = useTestBuilderV2Store();

  const updateProps = (updates: Record<string, any>) => {
    updateElement(elementId, updates);
  };

  const items = props.items || DEFAULT_ITEMS;

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateProps({ items: newItems });
  };

  const addItem = () => {
    updateProps({ items: [...items, { label: 'New Feature', left: 'no', right: 'yes' }] });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    updateProps({ items: newItems });
  };

  return (
    <div className="space-y-6">
      {/* Type */}
      <div className="space-y-2">
        <Label>Comparison Type</Label>
        <Select
          value={props.type || 'us-vs-them'}
          onValueChange={(value) => updateProps({ type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us-vs-them">Us vs Them</SelectItem>
            <SelectItem value="before-after">Before / After</SelectItem>
            <SelectItem value="features">Features</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Column Titles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Left Title</Label>
          <Input
            value={props.leftTitle || 'Others'}
            onChange={(e) => updateProps({ leftTitle: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Right Title</Label>
          <Input
            value={props.rightTitle || 'Us'}
            onChange={(e) => updateProps({ rightTitle: e.target.value })}
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Comparison Items</Label>
          <Button size="sm" variant="outline" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {items.map((item: any, index: number) => (
            <div key={index} className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  value={item.label}
                  onChange={(e) => updateItem(index, 'label', e.target.value)}
                  placeholder="Feature name"
                  className="flex-1"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeItem(index)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={item.left}
                  onValueChange={(value) => updateItem(index, 'left', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">✓ Yes</SelectItem>
                    <SelectItem value="no">✗ No</SelectItem>
                    <SelectItem value="partial">~ Partial</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={item.right}
                  onValueChange={(value) => updateItem(index, 'right', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">✓ Yes</SelectItem>
                    <SelectItem value="no">✗ No</SelectItem>
                    <SelectItem value="partial">~ Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Highlight Right Column</Label>
          <Switch
            checked={props.highlightRight ?? true}
            onCheckedChange={(checked) => updateProps({ highlightRight: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Show Icons</Label>
          <Switch
            checked={props.showIcons ?? true}
            onCheckedChange={(checked) => updateProps({ showIcons: checked })}
          />
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <Label>Colors</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Left (Negative)</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={props.leftColor || '#ef4444'}
                onChange={(e) => updateProps({ leftColor: e.target.value })}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                value={props.leftColor || '#ef4444'}
                onChange={(e) => updateProps({ leftColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Right (Positive)</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={props.rightColor || '#10b981'}
                onChange={(e) => updateProps({ rightColor: e.target.value })}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                value={props.rightColor || '#10b981'}
                onChange={(e) => updateProps({ rightColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
