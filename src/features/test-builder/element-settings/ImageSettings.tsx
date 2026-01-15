"use client";



import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Image as ImageIcon, Layout, Palette, Wand2, Eye, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BorderSelector } from './shared/BorderSelector';
import '../styles/animated-borders.css';

interface ImageSettingsProps {
  node: { id: string; type: string; props: Record<string, any> };
  updateProps: (updates: Record<string, any>) => void;
}

const IMAGE_PRESETS = [
  {
    id: 'hero-full',
    name: 'Hero Full Width',
    description: 'Full-width hero image',
    props: {
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
      alt: 'Hero Image',
      width: 'full',
      height: '500px',
      objectFit: 'cover',
      align: 'center',
      borderRadius: 0
    }
  },
  {
    id: 'product-square',
    name: 'Product Square',
    description: 'Square product image',
    props: {
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      alt: 'Product Image',
      width: '400px',
      height: '400px',
      objectFit: 'cover',
      align: 'center',
      borderRadius: 12
    }
  },
  {
    id: 'portrait-rounded',
    name: 'Portrait Rounded',
    description: 'Rounded portrait image',
    props: {
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      alt: 'Portrait',
      width: '300px',
      height: '400px',
      objectFit: 'cover',
      align: 'center',
      borderRadius: 16
    }
  },
  {
    id: 'thumbnail-small',
    name: 'Thumbnail Small',
    description: 'Small thumbnail image',
    props: {
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
      alt: 'Thumbnail',
      width: '150px',
      height: '150px',
      objectFit: 'cover',
      align: 'left',
      borderRadius: 8
    }
  },
  {
    id: 'banner-wide',
    name: 'Banner Wide',
    description: 'Wide banner image',
    props: {
      url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200',
      alt: 'Banner',
      width: 'full',
      height: '300px',
      objectFit: 'cover',
      align: 'center',
      borderRadius: 8
    }
  }
];

export function ImageSettings({ node, updateProps }: ImageSettingsProps) {
  const props = node.props;
  const [activeTab, setActiveTab] = useState('content');
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Set default values on mount to ensure image has placeholder (only if no URL is set)
  React.useEffect(() => {
    const defaults: any = {};
    // Don't override URL if it's already set (from default props in store)
    if (!props.alt) defaults.alt = 'Image';
    if (!props.width) defaults.width = 'custom';
    if (!props.height) defaults.height = 'custom';
    if (!props.objectFit) defaults.objectFit = 'cover';
    if (!props.align) defaults.align = 'center';
    if (props.opacity === undefined) defaults.opacity = 1;
    if (props.brightness === undefined) defaults.brightness = 100;
    if (props.contrast === undefined) defaults.contrast = 100;
    if (props.blur === undefined) defaults.blur = 0;
    if (props.lazyLoad === undefined) defaults.lazyLoad = true;
    
    if (Object.keys(defaults).length > 0) {
      updateProps(defaults);
    }
  }, []);

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
        <Label className="text-xs text-muted-foreground">{label}</Label>
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
          <span className="text-xs text-foreground">{unit}</span>
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
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-3 bg-card border-b border-border">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search settings..."
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Presets Section */}
      <div className="p-3 bg-card border-b border-border">
        <button
          onClick={() => setShowPresetPicker(!showPresetPicker)}
          className="w-full flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <Wand2 size={14} className="text-primary" />
            <span className="text-xs font-semibold text-foreground">Style Presets</span>
          </div>
          <span className="text-xs text-foreground">{showPresetPicker ? 'Hide' : 'Show'}</span>
        </button>

        {showPresetPicker && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {IMAGE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  updateProps({ ...preset.props, presetId: preset.id });
                  setShowPresetPicker(false);
                }}
                className={cn(
                  "p-3 border-2 rounded-lg text-left transition-all hover:border-primary hover:shadow-md",
                  props.presetId === preset.id
                    ? "border-primary bg-blue-50 dark:bg-blue-950/30"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">{preset.name}</span>
                  {props.presetId === preset.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">{preset.description}</p>
              </button>
            ))}
          </div>
        )}

        {props.presetId && (
          <div className="mt-3 p-2 bg-primary/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                Current: {IMAGE_PRESETS.find(p => p.id === props.presetId)?.name || 'Custom'}
              </p>
              <button onClick={() => updateProps({ presetId: null })} className="text-xs text-primary hover:underline">
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-border bg-transparent h-12">
          <TabsTrigger 
            value="content" 
            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
          >
            <ImageIcon size={14} className="mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger 
            value="design"
            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
          >
            <Layout size={14} className="mr-2" />
            Design
          </TabsTrigger>
          <TabsTrigger 
            value="effects"
            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
          >
            <Wand2 size={14} className="mr-2" />
            Effects
          </TabsTrigger>
        </TabsList>

        {/* CONTENT TAB */}
        <TabsContent value="content" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
          
          {/* Image Source */}
          <div>
            <Label className="text-xs font-semibold text-foreground mb-2 block">Image Source</Label>
            <Select value={props.sourceType || 'url'} onValueChange={(value) => updateProps({ sourceType: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="upload">Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* URL Input */}
          {props.sourceType === 'url' && (
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Image URL *</Label>
              <Input
                value={props.url || ''}
                onChange={(e) => updateProps({ url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-foreground mt-1">Direct link to the image file</p>
            </div>
          )}

          {/* File Upload */}
          {props.sourceType === 'upload' && (
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Upload Image</Label>
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
              <p className="text-xs text-foreground mt-1">Supports JPG, PNG, GIF, WebP</p>
            </div>
          )}

          <Separator />

          {/* Alt Text */}
          <div>
            <Label className="text-xs font-semibold text-foreground mb-2 block">
              Alt Text (Accessibility) *
            </Label>
            <Textarea
              value={props.alt || ''}
              onChange={(e) => updateProps({ alt: e.target.value })}
              placeholder="Describe the image for screen readers"
              rows={2}
            />
            <p className="text-xs text-foreground mt-1">Important for SEO and accessibility</p>
          </div>

          {/* Title */}
          <div>
            <Label className="text-xs font-semibold text-foreground mb-2 block">
              Title (Tooltip)
            </Label>
            <Input
              value={props.title || ''}
              onChange={(e) => updateProps({ title: e.target.value })}
              placeholder="Appears on hover"
            />
            <p className="text-xs text-foreground mt-1">Shows when user hovers over image</p>
          </div>

          <Separator />

          {/* Clickable Link */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">Clickable Link</Label>
              <Switch
                checked={props.clickable || false}
                onCheckedChange={(checked) => updateProps({ clickable: checked })}
              />
            </div>

            {props.clickable && (
              <>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Link URL *</Label>
                  <Input
                    value={props.clickUrl || ''}
                    onChange={(e) => updateProps({ clickUrl: e.target.value })}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label className="text-xs text-foreground">Open in New Tab</Label>
                    <p className="text-xs text-foreground">Opens link in new browser tab</p>
                  </div>
                  <Switch
                    checked={props.openInNewTab || false}
                    onCheckedChange={(checked) => updateProps({ openInNewTab: checked })}
                  />
                </div>
              </>
            )}
          </div>

        </TabsContent>

        {/* DESIGN TAB */}
        <TabsContent value="design" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
          
          {/* Width */}
          <div>
            <Label className="text-xs font-semibold text-foreground mb-2 block">Width</Label>
            <Select value={props.width || 'custom'} onValueChange={(value) => updateProps({ width: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="full">Full Width</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {(props.width === 'custom' || !props.width) && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={props.customWidth || props.width?.replace('px', '') || 600}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      updateProps({ customWidth: val, width: 'custom' });
                    }}
                    placeholder="Width in pixels"
                    className="flex-1"
                  />
                  <span className="text-xs text-foreground">px</span>
                </div>
                <Slider
                  value={[props.customWidth || parseInt(props.width?.replace('px', '') || '600') || 600]}
                  onValueChange={([val]) => updateProps({ customWidth: val, width: 'custom' })}
                  min={50}
                  max={1200}
                  step={10}
                />
              </div>
            )}
          </div>

          {/* Height */}
          <div>
            <Label className="text-xs font-semibold text-foreground mb-2 block">Height</Label>
            <Select value={props.height || 'custom'} onValueChange={(value) => updateProps({ height: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {(props.height === 'custom' || !props.height || props.height === 'auto') && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={props.customHeight || props.height?.replace('px', '') || 400}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      updateProps({ customHeight: val, height: 'custom' });
                    }}
                    placeholder="Height in pixels"
                    className="flex-1"
                  />
                  <span className="text-xs text-foreground">px</span>
                </div>
                <Slider
                  value={[props.customHeight || parseInt(props.height?.replace('px', '') || '400') || 400]}
                  onValueChange={([val]) => updateProps({ customHeight: val, height: 'custom' })}
                  min={50}
                  max={800}
                  step={10}
                />
              </div>
            )}
          </div>

          {/* Aspect Ratio */}
          <div>
            <Label className="text-xs font-semibold text-foreground mb-2 block">Aspect Ratio</Label>
            <Select value={props.aspectRatio || 'none'} onValueChange={(value) => updateProps({ aspectRatio: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="1/1">1:1 (Square)</SelectItem>
                <SelectItem value="4/3">4:3</SelectItem>
                <SelectItem value="16/9">16:9 (Widescreen)</SelectItem>
                <SelectItem value="21/9">21:9 (Ultrawide)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Object Fit */}
          <div>
            <Label className="text-xs font-semibold text-foreground mb-2 block">Object Fit</Label>
            <Select value={props.objectFit || 'cover'} onValueChange={(value) => updateProps({ objectFit: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover (Fill area)</SelectItem>
                <SelectItem value="contain">Contain (Fit inside)</SelectItem>
                <SelectItem value="fill">Fill (Stretch)</SelectItem>
                <SelectItem value="none">None (Original size)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-foreground mt-1">How image fits in container</p>
          </div>

          {/* Alignment */}
          <div>
            <Label className="text-xs font-semibold text-foreground mb-2 block">Alignment</Label>
            <Select value={props.align || 'center'} onValueChange={(value) => updateProps({ align: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Border Radius */}
          <SliderWithInput
            label="Border Radius"
            value={props.borderRadius || 0}
            onChange={(val) => updateProps({ borderRadius: val })}
            min={0}
            max={50}
          />

          {/* Border Style */}
          <BorderSelector
            value={props.borderStyle || ''}
            onChange={(borderId, borderProps) => {
              updateProps({ 
                borderStyle: borderId || undefined,
                borderStyleProps: borderId ? borderProps : undefined
              });
            }}
            label="Border Style"
          />

          <Separator />

          {/* Margins */}
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

        </TabsContent>

        {/* EFFECTS TAB */}
        <TabsContent value="effects" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
          
          {/* Shadow */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">Shadow</Label>
              <Switch
                checked={props.shadowEnabled || false}
                onCheckedChange={(checked) => updateProps({ shadowEnabled: checked })}
              />
            </div>

            {props.shadowEnabled && (
              <Select value={props.shadowSize || 'medium'} onValueChange={(value) => updateProps({ shadowSize: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <Separator />

          {/* Opacity */}
          <SliderWithInput
            label="Opacity"
            value={(props.opacity || 1) * 100}
            onChange={(val) => updateProps({ opacity: val / 100 })}
            min={0}
            max={100}
            unit="%"
          />

          {/* Grayscale */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-semibold text-foreground">Grayscale</Label>
              <p className="text-xs text-foreground">Convert to black and white</p>
            </div>
            <Switch
              checked={props.grayscale || false}
              onCheckedChange={(checked) => updateProps({ grayscale: checked })}
            />
          </div>

          <Separator />

          {/* Brightness */}
          <SliderWithInput
            label="Brightness"
            value={props.brightness || 100}
            onChange={(val) => updateProps({ brightness: val })}
            min={0}
            max={200}
            unit="%"
          />

          {/* Contrast */}
          <SliderWithInput
            label="Contrast"
            value={props.contrast || 100}
            onChange={(val) => updateProps({ contrast: val })}
            min={0}
            max={200}
            unit="%"
          />

          {/* Blur */}
          <SliderWithInput
            label="Blur"
            value={props.blur || 0}
            onChange={(val) => updateProps({ blur: val })}
            min={0}
            max={20}
          />

          <Separator />

          {/* Hover Effect */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">Hover Effect</Label>
              <Switch
                checked={props.hoverEffect || false}
                onCheckedChange={(checked) => updateProps({ hoverEffect: checked })}
              />
            </div>

            {props.hoverEffect && (
              <Select value={props.hoverEffectType || 'zoom'} onValueChange={(value) => updateProps({ hoverEffectType: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="zoom">Zoom In</SelectItem>
                  <SelectItem value="brightness">Brighten</SelectItem>
                  <SelectItem value="opacity">Fade</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <Separator />

          {/* Advanced Options */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-semibold text-foreground">Lazy Loading</Label>
              <p className="text-xs text-foreground">Load image when visible</p>
            </div>
            <Switch
              checked={props.lazyLoad !== false}
              onCheckedChange={(checked) => updateProps({ lazyLoad: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-semibold text-foreground">Lightbox</Label>
              <p className="text-xs text-foreground">Click to enlarge</p>
            </div>
            <Switch
              checked={props.lightbox || false}
              onCheckedChange={(checked) => updateProps({ lightbox: checked })}
            />
          </div>

          {/* Scroll Animation */}
          <div>
            <Label className="text-xs font-semibold text-foreground mb-2 block">Animation on Scroll</Label>
            <Select value={props.scrollAnimation || 'none'} onValueChange={(value) => updateProps({ scrollAnimation: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="fade-in">Fade In</SelectItem>
                <SelectItem value="slide-up">Slide Up</SelectItem>
                <SelectItem value="zoom-in">Zoom In</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </TabsContent>
      </Tabs>
    </div>
  );
}
