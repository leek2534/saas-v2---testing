"use client";

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Square, Palette, Settings } from 'lucide-react';
import { EnhancedColorPicker } from './shared/EnhancedColorPicker';
import { SectionCard } from './shared/SectionCard';

interface ModalSettingsProps {
  node: { id: string; type: string; props: Record<string, any> };
  updateProps: (updates: Record<string, any>) => void;
}

export function ModalSettings({ node, updateProps }: ModalSettingsProps) {
  const props = node.props;

  return (
    <div className="p-4 space-y-4">
      {/* Content */}
      <SectionCard id="modal-content" title="Modal Content" icon={Square}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Trigger Button Text</Label>
            <Input
              value={props.triggerText || 'Open Modal'}
              onChange={(e) => updateProps({ triggerText: e.target.value })}
              placeholder="Button text"
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Modal Title</Label>
            <Input
              value={props.title || 'Modal Title'}
              onChange={(e) => updateProps({ title: e.target.value })}
              placeholder="Modal title"
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Modal Content</Label>
            <Textarea
              value={props.content || 'Modal content goes here...'}
              onChange={(e) => updateProps({ content: e.target.value })}
              placeholder="Modal content"
              className="min-h-[100px]"
            />
          </div>
        </div>
      </SectionCard>

      {/* Behavior */}
      <SectionCard id="modal-behavior" title="Behavior" icon={Settings}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Show Close Button</Label>
            <Switch
              checked={props.showCloseButton ?? true}
              onCheckedChange={(checked) => updateProps({ showCloseButton: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Close on Overlay Click</Label>
            <Switch
              checked={props.closeOnOverlay ?? true}
              onCheckedChange={(checked) => updateProps({ closeOnOverlay: checked })}
            />
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
                <SelectItem value="fullscreen">Fullscreen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      {/* Style */}
      <SectionCard id="modal-style" title="Style" icon={Palette}>
        <div className="space-y-4">
          <EnhancedColorPicker
            label="Button Color"
            value={props.buttonColor || '#3b82f6'}
            onChange={(color) => updateProps({ buttonColor: color })}
          />
          <EnhancedColorPicker
            label="Overlay Color"
            value={props.overlayColor || 'rgba(0,0,0,0.5)'}
            onChange={(color) => updateProps({ overlayColor: color })}
          />
        </div>
      </SectionCard>
    </div>
  );
}
