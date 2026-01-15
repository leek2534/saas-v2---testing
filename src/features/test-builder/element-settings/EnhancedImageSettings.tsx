"use client";



import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
  Palette, ChevronDown, ChevronUp, Sparkles, Eye, Link as LinkIcon,
  Upload, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageLibraryModal } from '../ImageLibraryModal';

interface EnhancedImageSettingsProps {
  node: { id: string; type: string; props: Record<string, any> };
  updateProps: (updates: any) => void;
}

export function EnhancedImageSettings({ node, updateProps }: EnhancedImageSettingsProps) {
  const props = node.props;
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'source', 'layout', 'style', 'effects', 'accessibility'
  ]);
  const [showImageLibrary, setShowImageLibrary] = useState(false);

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

  const SliderWithInput = ({ 
    label, 
    value, 
    onChange, 
    min, 
    max, 
    step = 1, 
    unit = 'px' 
  }: { 
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
        <Label className="text-xs text-foreground">{label}</Label>
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
        className="mt-2"
      />
    </div>
  );

  return (
    <div className="space-y-2">
      {/* Image Source Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="source" title="Image Source" icon={ImageIcon} />
        {expandedSections.includes('source') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImageLibrary(true)}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Search size={20} />
                <span className="text-xs">Stock Photos</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Open media library
                  console.log('Open media library');
                }}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <ImageIcon size={20} />
                <span className="text-xs">My Library</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e: any) => {
                    const file = e.target?.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        updateProps({ url: event.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Upload size={20} />
                <span className="text-xs">Upload</span>
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs text-foreground">Image URL</Label>
              <Input
                value={props.url || ''}
                onChange={(e) => updateProps({ url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="text-sm"
              />
            </div>

            {props.url && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">
                <img
                  src={props.url}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Layout Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="layout" title="Layout & Sizing" icon={Sparkles} />
        {expandedSections.includes('layout') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Alignment</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight }
                ].map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => updateProps({ align: value })}
                    className={cn(
                      "p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                      props.align === value && "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                    )}
                  >
                    <Icon size={18} className="mx-auto" />
                  </button>
                ))}
              </div>
            </div>

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
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Aspect Ratio</Label>
              <Select value={props.aspectRatio || 'none'} onValueChange={(value) => updateProps({ aspectRatio: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="1/1">1:1 (Square)</SelectItem>
                  <SelectItem value="4/3">4:3</SelectItem>
                  <SelectItem value="16/9">16:9 (Widescreen)</SelectItem>
                  <SelectItem value="21/9">21:9 (Ultrawide)</SelectItem>
                  <SelectItem value="3/2">3:2</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  <SelectItem value="scale-down">Scale Down</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SliderWithInput
                label="Margin Top"
                value={props.marginTop || 0}
                onChange={(val) => updateProps({ marginTop: val })}
                min={0}
                max={100}
                step={1}
              />
              <SliderWithInput
                label="Margin Bottom"
                value={props.marginBottom || 0}
                onChange={(val) => updateProps({ marginBottom: val })}
                min={0}
                max={100}
                step={1}
              />
            </div>
          </div>
        )}
      </div>

      {/* Style Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="style" title="Style & Border" icon={Palette} />
        {expandedSections.includes('style') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <SliderWithInput
              label="Border Radius"
              value={props.borderRadius || 0}
              onChange={(val) => updateProps({ borderRadius: val })}
              min={0}
              max={50}
              step={1}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-foreground">Border</Label>
                <Switch
                  checked={props.borderEnabled || false}
                  onCheckedChange={(checked) => updateProps({ borderEnabled: checked })}
                />
              </div>
              {props.borderEnabled && (
                <div className="space-y-3 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
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
                  <SliderWithInput
                    label="Border Width"
                    value={props.borderWidth || 1}
                    onChange={(val) => updateProps({ borderWidth: val })}
                    min={1}
                    max={20}
                    step={1}
                  />
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Border Style</Label>
                    <Select value={props.borderStyle || 'solid'} onValueChange={(value) => updateProps({ borderStyle: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                        <SelectItem value="dotted">Dotted</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <SliderWithInput
              label="Opacity"
              value={Math.round((props.opacity || 1) * 100)}
              onChange={(val) => updateProps({ opacity: val / 100 })}
              min={0}
              max={100}
              step={1}
              unit="%"
            />
          </div>
        )}
      </div>

      {/* Effects Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="effects" title="Effects & Filters" icon={Eye} />
        {expandedSections.includes('effects') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-foreground">Shadow</Label>
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
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-foreground">Grayscale</Label>
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
              step={1}
              unit="%"
            />

            <SliderWithInput
              label="Contrast"
              value={props.contrast || 100}
              onChange={(val) => updateProps({ contrast: val })}
              min={0}
              max={200}
              step={1}
              unit="%"
            />

            <SliderWithInput
              label="Saturation"
              value={props.saturation || 100}
              onChange={(val) => updateProps({ saturation: val })}
              min={0}
              max={200}
              step={1}
              unit="%"
            />

            <SliderWithInput
              label="Blur"
              value={props.blur || 0}
              onChange={(val) => updateProps({ blur: val })}
              min={0}
              max={20}
              step={1}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-foreground">Hover Effect</Label>
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
                    <SelectItem value="lift">Lift (Shadow)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Accessibility & Link Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="accessibility" title="Accessibility & Link" icon={LinkIcon} />
        {expandedSections.includes('accessibility') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Alt Text (Required)</Label>
              <Input
                value={props.alt || ''}
                onChange={(e) => updateProps({ alt: e.target.value })}
                placeholder="Describe the image for screen readers"
                className="text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Important for SEO and accessibility</p>
            </div>

            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Title (Tooltip)</Label>
              <Input
                value={props.title || ''}
                onChange={(e) => updateProps({ title: e.target.value })}
                placeholder="Appears on hover"
                className="text-sm"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-foreground">Make Clickable</Label>
                <Switch
                  checked={props.clickable || false}
                  onCheckedChange={(checked) => updateProps({ clickable: checked })}
                />
              </div>
              {props.clickable && (
                <div className="space-y-3 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                  <Input
                    value={props.clickUrl || ''}
                    onChange={(e) => updateProps({ clickUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-foreground">Open in New Tab</Label>
                    <Switch
                      checked={props.openInNewTab || false}
                      onCheckedChange={(checked) => updateProps({ openInNewTab: checked })}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-foreground">Lazy Loading</Label>
              <Switch
                checked={props.lazyLoad !== false}
                onCheckedChange={(checked) => updateProps({ lazyLoad: checked })}
              />
            </div>
            <p className="text-xs text-gray-500">Improves page load performance</p>
          </div>
        )}
      </div>

      {/* Image Library Modal */}
      <ImageLibraryModal
        isOpen={showImageLibrary}
        onClose={() => setShowImageLibrary(false)}
        onSelectImage={(url: string) => {
          updateProps({ url });
          setShowImageLibrary(false);
        }}
      />
    </div>
  );
}
