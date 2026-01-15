"use client";

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useEditor } from '../editor/store/useEditorStore';

interface StarRatingSettingsProps {
  elementId: string;
  props: Record<string, any>;
}

export function StarRatingSettings({ elementId, props }: StarRatingSettingsProps) {
  const { dispatch } = useEditor();

  const updateProps = (updates: Record<string, any>) => {
    dispatch({
      type: 'UPDATE_NODE_PROPS',
      nodeId: elementId,
      props: updates,
    });
  };

  return (
    <div className="space-y-6">
      {/* Rating */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Rating</Label>
          <span className="text-sm font-medium">{(props.rating || 4.8).toFixed(1)}</span>
        </div>
        <Slider
          value={[props.rating || 4.8]}
          onValueChange={([value]) => updateProps({ rating: value })}
          min={0}
          max={5}
          step={0.1}
        />
      </div>

      {/* Max Rating */}
      <div className="space-y-2">
        <Label>Max Stars</Label>
        <Select
          value={String(props.maxRating || 5)}
          onValueChange={(value) => updateProps({ maxRating: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="10">10 Stars</SelectItem>
          </SelectContent>
        </Select>
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

      {/* Layout */}
      <div className="space-y-2">
        <Label>Layout</Label>
        <Select
          value={props.layout || 'horizontal'}
          onValueChange={(value) => updateProps({ layout: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">Horizontal</SelectItem>
            <SelectItem value="vertical">Vertical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alignment */}
      <div className="space-y-2">
        <Label>Alignment</Label>
        <Select
          value={props.alignment || 'left'}
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

      {/* Review Count */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Show Review Count</Label>
          <Switch
            checked={props.showCount ?? true}
            onCheckedChange={(checked) => updateProps({ showCount: checked })}
          />
        </div>
        {(props.showCount ?? true) && (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Number of Reviews</Label>
              <Input
                type="number"
                value={props.count || 2847}
                onChange={(e) => updateProps({ count: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Count Label</Label>
              <Input
                value={props.countText || 'reviews'}
                onChange={(e) => updateProps({ countText: e.target.value })}
                placeholder="reviews"
              />
            </div>
          </>
        )}
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <Label>Colors</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Star Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={props.color || '#facc15'}
                onChange={(e) => updateProps({ color: e.target.value })}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                value={props.color || '#facc15'}
                onChange={(e) => updateProps({ color: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Empty Star</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={props.emptyColor || '#e5e7eb'}
                onChange={(e) => updateProps({ emptyColor: e.target.value })}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                value={props.emptyColor || '#e5e7eb'}
                onChange={(e) => updateProps({ emptyColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
