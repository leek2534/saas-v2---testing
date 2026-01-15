"use client";



import React, { useState } from 'react';
import { ElementNode } from '@/lib/store/test-builder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Type, Palette, Zap, Eye, Link2, Send, Download, Phone, Mail, ArrowRight, Maximize2, AlignLeft, AlignCenter, AlignRight, Sparkles } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { IconPicker } from '../IconPicker';
import { PaddingControl } from '../PaddingControl';
import { cn } from '@/lib/utils';

interface ButtonSettingsProps {
  node: ElementNode;
  updateProps: (updates: any) => void;
}

export function ButtonSettings({ node, updateProps }: ButtonSettingsProps) {
  const props = node.props;
  const [activeTab, setActiveTab] = useState('content');

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (color: string) => void }) => {
    const [showPicker, setShowPicker] = useState(false);
    return (
      <div>
        <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">{label}</Label>
        <div className="relative">
          <button onClick={() => setShowPicker(!showPicker)} className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 transition-colors bg-white dark:bg-gray-800">
            <div className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600" style={{ backgroundColor: value || '#3b82f6' }} />
            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{value || '#3b82f6'}</span>
          </button>
          {showPicker && (
            <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <HexColorPicker color={value || '#3b82f6'} onChange={onChange} />
              <Input type="text" value={value || '#3b82f6'} onChange={(e) => onChange(e.target.value)} className="mt-2 text-xs font-mono" />
              <Button size="sm" variant="ghost" onClick={() => setShowPicker(false)} className="w-full mt-2">Done</Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Eye size={14} className="text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Live Preview</span>
        </div>
        <div className="flex justify-center">
          <button className="px-6 py-3 rounded-lg font-medium transition-all" style={{ backgroundColor: props.backgroundColor || '#3b82f6', color: props.textColor || '#ffffff', borderRadius: `${props.borderRadius || 8}px` }}>
            {props.text || 'Click Me'}
          </button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-gray-200 dark:border-gray-700 bg-transparent h-12">
          <TabsTrigger value="content" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <Type size={14} className="mr-2" />Content
          </TabsTrigger>
          <TabsTrigger value="design" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <Palette size={14} className="mr-2" />Design
          </TabsTrigger>
          <TabsTrigger value="behavior" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <Zap size={14} className="mr-2" />Behavior
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
          <div>
            <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Button Text</Label>
            <Input value={props.text || ''} onChange={(e) => updateProps({ text: e.target.value })} placeholder="Click Me" />
          </div>
        </TabsContent>

        <TabsContent value="design" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
          <ColorPicker label="Background Color" value={props.backgroundColor || '#3b82f6'} onChange={(color) => updateProps({ backgroundColor: color })} />
          <ColorPicker label="Text Color" value={props.textColor || '#ffffff'} onChange={(color) => updateProps({ textColor: color })} />
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Border Radius</Label>
            <Slider value={[props.borderRadius || 8]} onValueChange={([val]) => updateProps({ borderRadius: val })} min={0} max={50} />
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
          <div>
            <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Click Action</Label>
            <Select value={props.action || 'none'} onValueChange={(value) => updateProps({ action: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="link">Open Link</SelectItem>
                <SelectItem value="submit">Submit Form</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {props.action === 'link' && (
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Link URL</Label>
              <Input value={props.url || ''} onChange={(e) => updateProps({ url: e.target.value })} placeholder="https://example.com" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
