"use client";



import React from 'react';
import { Element } from '../store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnhancedTextSettingsProps {
  node: { id: string; type: string; props: Record<string, any> };
  updateProps: (updates: any) => void;
  elementType?: string;
}

export function EnhancedTextSettings({ node, updateProps, elementType }: EnhancedTextSettingsProps) {
  const props = node.props;

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label className="text-xs font-semibold mb-2 block">Text Content</Label>
        <Textarea
          value={props.text || ''}
          onChange={(e) => updateProps({ text: e.target.value })}
          placeholder="Enter your text content"
          rows={4}
        />
      </div>

      <div>
        <Label className="text-xs font-semibold mb-2 block">Font Size</Label>
        <Select 
          value={props.fontSize || 'base'} 
          onValueChange={(value) => updateProps({ fontSize: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xs">Extra Small</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="base">Base</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
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
            <SelectItem value="justify">Justify</SelectItem>
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
