"use client";



import React from 'react';
import { Element } from '../store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnhancedHeadingSettingsProps {
  node: { id: string; type: string; props: Record<string, any> };
  updateProps: (updates: any) => void;
}

export function EnhancedHeadingSettings({ node, updateProps }: EnhancedHeadingSettingsProps) {
  const props = node.props;

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label className="text-xs font-semibold mb-2 block">Heading Text</Label>
        <Input
          value={props.text || ''}
          onChange={(e) => updateProps({ text: e.target.value })}
          placeholder="Enter heading text"
        />
      </div>

      <div>
        <Label className="text-xs font-semibold mb-2 block">Heading Level</Label>
        <Select 
          value={props.level || 'h2'} 
          onValueChange={(value) => updateProps({ level: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="h1">H1 - Largest</SelectItem>
            <SelectItem value="h2">H2 - Large</SelectItem>
            <SelectItem value="h3">H3 - Medium</SelectItem>
            <SelectItem value="h4">H4 - Small</SelectItem>
            <SelectItem value="h5">H5 - Smaller</SelectItem>
            <SelectItem value="h6">H6 - Smallest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-semibold mb-2 block">Text Alignment</Label>
        <Select 
          value={props.textAlign || 'left'} 
          onValueChange={(value) => updateProps({ textAlign: value })}
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

      <div>
        <Label className="text-xs font-semibold mb-2 block">Text Color</Label>
        <Input
          type="color"
          value={props.color || '#000000'}
          onChange={(e) => updateProps({ color: e.target.value })}
        />
      </div>
    </div>
  );
}
