"use client";



import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp, Image as ImageIcon, Layout, Palette, Sparkles, Wand2 } from 'lucide-react';

interface ImageSettingsProps {
  node: { id: string; type: string; props: Record<string, any> };
  updateProps: (updates: Record<string, any>) => void;
}

export function ImageSettings({ node, updateProps }: ImageSettingsProps) {
  const props = node.props;
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'content', 'layout', 'style', 'effects', 'advanced'
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const SectionHeader = ({ id, title, icon: Icon }: { id: string; title: string; icon: any }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-blue-600 dark:text-blue-400" />
        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{title}</span>
      </div>
      {expandedSections.includes(id) ? (
        <ChevronUp size={16} className="text-gray-400 group-hover:text-gray-600" />
      ) : (
        <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />
      )}
    </button>
  );

  const SliderWithInput = ({ label, value, onChange, min, max, step = 1, unit = 'px' }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
  }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-xs text-gray-600 dark:text-gray-400">{label}</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={value || 0}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-16 h-7 text-xs text-center"
            min={min}
            max={max}
            step={step}
          />
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
      <Slider
        value={[value || 0]}
        onValueChange={([val]) => onChange(val)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );

  return (
    <div className="space-y-2">
      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="content" title="Content" icon={ImageIcon} />
        {expandedSections.includes('content') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Image Source</Label>
              <Select value={props.sourceType || 'url'} onValueChange={(value) => updateProps({ sourceType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="upload">Upload</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {props.sourceType === 'url' && (
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Image URL</Label>
                <Input
                  value={props.url || ''}
                  onChange={(e) => updateProps({ url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {props.sourceType === 'upload' && (
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Upload Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        updateProps({ url: event.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            )}

            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Alt Text (Accessibility)</Label>
              <Textarea
                value={props.alt || ''}
                onChange={(e) => updateProps({ alt: e.target.value })}
                placeholder="Describe the image"
                rows={2}
              />
            </div>

            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Title (Tooltip)</Label>
              <Input
                value={props.title || ''}
                onChange={(e) => updateProps({ title: e.target.value })}
                placeholder="Appears on hover"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600 dark:text-gray-400">Clickable Link</Label>
              <Switch
                checked={props.clickable || false}
                onCheckedChange={(checked) => updateProps({ clickable: checked })}
              />
            </div>

            {props.clickable && (
              <>
                <Input
                  value={props.clickUrl || ''}
                  onChange={(e) => updateProps({ clickUrl: e.target.value })}
                  placeholder="https://example.com"
                />
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600 dark:text-gray-400">Open in New Tab</Label>
                  <Switch
                    checked={props.openInNewTab || false}
                    onCheckedChange={(checked) => updateProps({ openInNewTab: checked })}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Layout Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="layout" title="Layout & Spacing" icon={Layout} />
        {expandedSections.includes('layout') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Width</Label>
              <Select value={props.width || 'full'} onValueChange={(value) => updateProps({ width: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="full">Full Width</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {props.width === 'custom' && (
                <Input
                  type="number"
                  value={props.customWidth || 600}
                  onChange={(e) => updateProps({ customWidth: parseInt(e.target.value) })}
                  placeholder="Width in pixels"
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Height</Label>
              <Select value={props.height || 'auto'} onValueChange={(value) => updateProps({ height: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {props.height === 'custom' && (
                <Input
                  type="number"
                  value={props.customHeight || 400}
                  onChange={(e) => updateProps({ customHeight: parseInt(e.target.value) })}
                  placeholder="Height in pixels"
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Aspect Ratio</Label>
              <Select value={props.aspectRatio || 'none'} onValueChange={(value) => updateProps({ aspectRatio: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="1/1">1:1 (Square)</SelectItem>
                  <SelectItem value="4/3">4:3</SelectItem>
                  <SelectItem value="16/9">16:9</SelectItem>
                  <SelectItem value="21/9">21:9</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Alignment</Label>
              <Select value={props.align || 'center'} onValueChange={(value) => updateProps({ align: value })}>
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

            <SliderWithInput
              label="Top Margin"
              value={props.marginTop || 0}
              onChange={(val) => updateProps({ marginTop: val })}
              min={0}
              max={200}
            />

            <SliderWithInput
              label="Bottom Margin"
              value={props.marginBottom || 0}
              onChange={(val) => updateProps({ marginBottom: val })}
              min={0}
              max={200}
            />
          </div>
        )}
      </div>

      {/* Style Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="style" title="Style & Colors" icon={Palette} />
        {expandedSections.includes('style') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Object Fit</Label>
              <Select value={props.objectFit || 'cover'} onValueChange={(value) => updateProps({ objectFit: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="fill">Fill</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <SliderWithInput
              label="Border Radius"
              value={props.borderRadius || 0}
              onChange={(val) => updateProps({ borderRadius: val })}
              min={0}
              max={50}
            />

            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600 dark:text-gray-400">Border</Label>
              <Switch
                checked={props.borderEnabled || false}
                onCheckedChange={(checked) => updateProps({ borderEnabled: checked })}
              />
            </div>

            {props.borderEnabled && (
              <>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={props.borderColor || '#e5e7eb'}
                    onChange={(e) => updateProps({ borderColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={props.borderColor || '#e5e7eb'}
                    onChange={(e) => updateProps({ borderColor: e.target.value })}
                    placeholder="#e5e7eb"
                  />
                </div>
                <Input
                  type="number"
                  value={props.borderWidth || 1}
                  onChange={(e) => updateProps({ borderWidth: parseInt(e.target.value) })}
                  placeholder="Border width (px)"
                  min={1}
                  max={20}
                />
              </>
            )}

            <SliderWithInput
              label="Opacity"
              value={(props.opacity || 1) * 100}
              onChange={(val) => updateProps({ opacity: val / 100 })}
              min={0}
              max={100}
              unit="%"
            />
          </div>
        )}
      </div>

      {/* Effects Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="effects" title="Effects & Filters" icon={Wand2} />
        {expandedSections.includes('effects') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600 dark:text-gray-400">Shadow</Label>
              <Switch
                checked={props.shadowEnabled || false}
                onCheckedChange={(checked) => updateProps({ shadowEnabled: checked })}
              />
            </div>

            {props.shadowEnabled && (
              <Select value={props.shadowSize || 'medium'} onValueChange={(value) => updateProps({ shadowSize: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600 dark:text-gray-400">Grayscale</Label>
              <Switch
                checked={props.grayscale || false}
                onCheckedChange={(checked) => updateProps({ grayscale: checked })}
              />
            </div>

            <SliderWithInput
              label="Brightness"
              value={props.brightness || 100}
              onChange={(val) => updateProps({ brightness: val })}
              min={0}
              max={200}
              unit="%"
            />

            <SliderWithInput
              label="Contrast"
              value={props.contrast || 100}
              onChange={(val) => updateProps({ contrast: val })}
              min={0}
              max={200}
              unit="%"
            />

            <SliderWithInput
              label="Blur"
              value={props.blur || 0}
              onChange={(val) => updateProps({ blur: val })}
              min={0}
              max={20}
            />

            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600 dark:text-gray-400">Hover Effect</Label>
              <Switch
                checked={props.hoverEffect || false}
                onCheckedChange={(checked) => updateProps({ hoverEffect: checked })}
              />
            </div>

            {props.hoverEffect && (
              <Select value={props.hoverEffectType || 'zoom'} onValueChange={(value) => updateProps({ hoverEffectType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="brightness">Brightness</SelectItem>
                  <SelectItem value="opacity">Opacity</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>

      {/* Advanced Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="advanced" title="Advanced" icon={Sparkles} />
        {expandedSections.includes('advanced') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600 dark:text-gray-400">Lazy Loading</Label>
              <Switch
                checked={props.lazyLoad !== false}
                onCheckedChange={(checked) => updateProps({ lazyLoad: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600 dark:text-gray-400">Lightbox</Label>
              <Switch
                checked={props.lightbox || false}
                onCheckedChange={(checked) => updateProps({ lightbox: checked })}
              />
            </div>

            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Animation on Scroll</Label>
              <Select value={props.scrollAnimation || 'none'} onValueChange={(value) => updateProps({ scrollAnimation: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fade-in">Fade In</SelectItem>
                  <SelectItem value="slide-up">Slide Up</SelectItem>
                  <SelectItem value="zoom-in">Zoom In</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Custom CSS Class</Label>
              <Input
                value={props.customClass || ''}
                onChange={(e) => updateProps({ customClass: e.target.value })}
                placeholder="custom-class"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
