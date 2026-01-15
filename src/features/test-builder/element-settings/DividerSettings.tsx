"use client";



import React, { useState } from 'react';
import { ElementNode } from '@/lib/store/test-builder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Type, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Palette, ChevronDown, ChevronUp, Image as ImageIcon,
  Sparkles, Eye, EyeOff, Wand2, Search, Minus
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';
import { GradientPicker, GradientValue } from '../GradientPicker';
import { IconPicker } from '../IconPicker';

interface DividerSettingsProps {
  node: ElementNode;
  updateProps: (updates: any) => void;
}

const DIVIDER_PRESETS = [
  {
    id: 'solid-thin',
    name: 'Solid Thin',
    description: 'Thin solid line',
    props: {
      style: 'solid',
      height: 1,
      color: '#e5e7eb',
      width: '100%',
      marginTop: 20,
      marginBottom: 20
    }
  },
  {
    id: 'dashed-medium',
    name: 'Dashed Medium',
    description: 'Dashed separator',
    props: {
      style: 'dashed',
      height: 2,
      color: '#9ca3af',
      width: '100%',
      marginTop: 30,
      marginBottom: 30
    }
  },
  {
    id: 'gradient-bold',
    name: 'Gradient Bold',
    description: 'Bold gradient divider',
    props: {
      style: 'gradient',
      height: 4,
      gradientFrom: '#3b82f6',
      gradientTo: '#8b5cf6',
      width: '100%',
      marginTop: 40,
      marginBottom: 40
    }
  },
  {
    id: 'decorative-short',
    name: 'Decorative Short',
    description: 'Short centered divider',
    props: {
      style: 'solid',
      height: 3,
      color: '#3b82f6',
      width: '60%',
      alignment: 'center',
      marginTop: 30,
      marginBottom: 30
    }
  },
  {
    id: 'spacer-large',
    name: 'Spacer Large',
    description: 'Invisible spacer',
    props: {
      style: 'none',
      height: 60,
      width: '100%',
      marginTop: 0,
      marginBottom: 0
    }
  }
];

export function DividerSettings({ node, updateProps }: DividerSettingsProps) {
  const props = node.props;
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'content', 'padding', 'typography', 'decoration', 'alignment', 'background', 'textShadow', 'icons'
  ]);
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      className="w-full flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors group"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-primary" />
        <span className="font-semibold text-sm text-foreground">{title}</span>
      </div>
      {expandedSections.includes(id) ? (
        <ChevronUp size={16} className="text-muted-foreground group-hover:text-gray-600" />
      ) : (
        <ChevronDown size={16} className="text-muted-foreground group-hover:text-gray-600" />
      )}
    </button>
  );

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (color: string) => void }) => {
    const [showPicker, setShowPicker] = useState(false);

    return (
      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">{label}</Label>
        <div className="relative">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="w-full flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:border-blue-400 transition-colors bg-card"
          >
            <div
              className="w-8 h-8 rounded border border-border"
              style={{ backgroundColor: value || '#000000' }}
            />
            <span className="text-sm font-mono text-foreground">{value || '#000000'}</span>
          </button>
          {showPicker && (
            <div className="absolute top-full left-0 mt-2 p-3 bg-card rounded-lg shadow-xl border border-border z-50">
              <HexColorPicker color={value || '#000000'} onChange={onChange} />
              <Input
                type="text"
                value={value || '#000000'}
                onChange={(e) => onChange(e.target.value)}
                className="mt-2 text-xs font-mono"
                placeholder="#000000"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPicker(false)}
                className="w-full mt-2"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

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
        className="mt-2 cursor-pointer"
        style={{ touchAction: 'none' }}
      />
    </div>
  );

  return (
    <div className="space-y-2">
      {/* Search Bar */}
      <div className="p-3 bg-card border border-border rounded-lg">
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
      <div className="p-3 bg-card border border-border rounded-lg">
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
            {DIVIDER_PRESETS.map((preset) => (
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
                Current: {DIVIDER_PRESETS.find(p => p.id === props.presetId)?.name || 'Custom'}
              </p>
              <button onClick={() => updateProps({ presetId: null })} className="text-xs text-primary hover:underline">
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="bg-card rounded-lg border border-border">
        <SectionHeader id="content" title="Content" icon={Type} />
        {expandedSections.includes('content') && (
          <div className="p-4 space-y-4 border-t border-border">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Heading Text</Label>
              <Input
                value={(props.text || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')}
                onChange={(e) => updateProps({ text: e.target.value })}
                placeholder="Enter heading text..."
                className="font-medium"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Heading Level</Label>
              <Select
                value={props.level || 'h2'}
                onValueChange={(value) => updateProps({ level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1 - Main Title</SelectItem>
                  <SelectItem value="h2">H2 - Section Title</SelectItem>
                  <SelectItem value="h3">H3 - Subsection</SelectItem>
                  <SelectItem value="h4">H4 - Minor Heading</SelectItem>
                  <SelectItem value="h5">H5 - Small Heading</SelectItem>
                  <SelectItem value="h6">H6 - Tiny Heading</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Padding Section */}
      <div className="bg-card rounded-lg border border-border">
        <SectionHeader id="padding" title="Padding & Spacing" icon={Sparkles} />
        {expandedSections.includes('padding') && (
          <div className="p-4 space-y-4 border-t border-border">
            <SliderWithInput
              label="Top Padding"
              value={props.paddingTop || 0}
              onChange={(val) => updateProps({ paddingTop: val })}
              min={0}
              max={200}
              step={1}
            />
            <SliderWithInput
              label="Bottom Padding"
              value={props.paddingBottom || 0}
              onChange={(val) => updateProps({ paddingBottom: val })}
              min={0}
              max={200}
              step={1}
            />
            <SliderWithInput
              label="Left Padding"
              value={props.paddingLeft || 0}
              onChange={(val) => updateProps({ paddingLeft: val })}
              min={0}
              max={200}
              step={1}
            />
            <SliderWithInput
              label="Right Padding"
              value={props.paddingRight || 0}
              onChange={(val) => updateProps({ paddingRight: val })}
              min={0}
              max={200}
              step={1}
            />
          </div>
        )}
      </div>

      {/* Typography Section */}
      <div className="bg-card rounded-lg border border-border">
        <SectionHeader id="typography" title="Typography" icon={Type} />
        {expandedSections.includes('typography') && (
          <div className="p-4 space-y-4 border-t border-border">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Size</Label>
              <Select
                value={props.headingSize || 'large'}
                onValueChange={(value) => updateProps({ headingSize: value })}
              >
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
            </div>

            {/* Text Color - Solid or Gradient */}
            <div>
              <Tabs defaultValue="solid" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="solid">Solid Color</TabsTrigger>
                  <TabsTrigger value="gradient">Gradient</TabsTrigger>
                </TabsList>
                <TabsContent value="solid" className="mt-4">
                  <ColorPicker
                    label="Text Color"
                    value={props.color || '#000000'}
                    onChange={(color) => updateProps({ color, textGradient: null })}
                  />
                </TabsContent>
                <TabsContent value="gradient" className="mt-4">
                  <GradientPicker
                    value={props.textGradient || {
                      type: 'linear',
                      angle: 90,
                      stops: [
                        { color: '#667eea', position: 0 },
                        { color: '#764ba2', position: 100 },
                      ],
                    }}
                    onChange={(gradient) => updateProps({ textGradient: gradient, color: null })}
                    label="Text Gradient"
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Font Weight</Label>
              <Select
                value={props.fontWeight || 'bold'}
                onValueChange={(value) => updateProps({ fontWeight: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light (300)</SelectItem>
                  <SelectItem value="normal">Normal (400)</SelectItem>
                  <SelectItem value="medium">Medium (500)</SelectItem>
                  <SelectItem value="semibold">Semibold (600)</SelectItem>
                  <SelectItem value="bold">Bold (700)</SelectItem>
                  <SelectItem value="extrabold">Extra Bold (800)</SelectItem>
                  <SelectItem value="black">Black (900)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Font Family</Label>
              <Select
                value={props.fontFamily || 'inherit'}
                onValueChange={(value) => updateProps({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inherit">Default</SelectItem>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <SliderWithInput
              label="Line Height"
              value={props.lineHeight || 1.2}
              onChange={(val) => updateProps({ lineHeight: val })}
              min={0.8}
              max={3}
              step={0.1}
              unit=""
            />

            <SliderWithInput
              label="Letter Spacing"
              value={props.letterSpacing || 0}
              onChange={(val) => updateProps({ letterSpacing: val })}
              min={-5}
              max={10}
              step={0.5}
            />
          </div>
        )}
      </div>

      {/* Text Decoration Section */}
      <div className="bg-card rounded-lg border border-border">
        <SectionHeader id="decoration" title="Text Decoration" icon={Sparkles} />
        {expandedSections.includes('decoration') && (
          <div className="p-4 space-y-4 border-t border-border">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Text Casing</Label>
              <Select
                value={props.textTransform || 'none'}
                onValueChange={(value) => updateProps({ textTransform: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Normal (None)</SelectItem>
                  <SelectItem value="uppercase">UPPERCASE</SelectItem>
                  <SelectItem value="lowercase">lowercase</SelectItem>
                  <SelectItem value="capitalize">Capitalize Each Word</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Text Decoration</Label>
              <Select
                value={props.textDecoration || 'none'}
                onValueChange={(value) => updateProps({ textDecoration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="underline">Underline</SelectItem>
                  <SelectItem value="line-through">Strike Through</SelectItem>
                  <SelectItem value="overline">Overline</SelectItem>
                  <SelectItem value="underline overline">Underline & Overline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Alignment & Opacity Section */}
      <div className="bg-card rounded-lg border border-border">
        <SectionHeader id="alignment" title="Alignment & Opacity" icon={AlignCenter} />
        {expandedSections.includes('alignment') && (
          <div className="p-4 space-y-4 border-t border-border">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Text Alignment</Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight },
                  { value: 'justify', icon: AlignJustify }
                ].map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => updateProps({ align: value })}
                    className={cn(
                      "p-3 border rounded-lg hover:bg-accent transition-colors",
                      props.align === value && "bg-primary/10 border-primary"
                    )}
                  >
                    <Icon size={18} className="mx-auto" />
                  </button>
                ))}
              </div>
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

      {/* Background Section */}
      <div className="bg-card rounded-lg border border-border">
        <SectionHeader id="background" title="Background" icon={ImageIcon} />
        {expandedSections.includes('background') && (
          <div className="p-4 space-y-4 border-t border-border">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Enable Background</Label>
              <Switch
                checked={props.hasBackground || false}
                onCheckedChange={(checked) => updateProps({ hasBackground: checked })}
              />
            </div>

            {props.hasBackground && (
              <>
                {/* Background Color or Gradient */}
                <Tabs defaultValue="solid" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="solid">Solid Color</TabsTrigger>
                    <TabsTrigger value="gradient">Gradient</TabsTrigger>
                  </TabsList>
                  <TabsContent value="solid" className="mt-4">
                    <ColorPicker
                      label="Background Color"
                      value={props.backgroundColor || '#ffffff'}
                      onChange={(color) => updateProps({ backgroundColor: color, backgroundGradient: null })}
                    />
                  </TabsContent>
                  <TabsContent value="gradient" className="mt-4">
                    <GradientPicker
                      value={props.backgroundGradient || {
                        type: 'linear',
                        angle: 135,
                        stops: [
                          { color: '#667eea', position: 0 },
                          { color: '#764ba2', position: 100 },
                        ],
                      }}
                      onChange={(gradient) => updateProps({ backgroundGradient: gradient, backgroundColor: null })}
                      label="Background Gradient"
                    />
                  </TabsContent>
                </Tabs>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Background Image URL</Label>
                  <Input
                    value={props.backgroundImage || ''}
                    onChange={(e) => updateProps({ backgroundImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {props.backgroundImage && (
                  <>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Image Style</Label>
                      <Select
                        value={props.backgroundStyle || 'cover'}
                        onValueChange={(value) => updateProps({ backgroundStyle: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cover">Cover (Full Center)</SelectItem>
                          <SelectItem value="contain">Contain</SelectItem>
                          <SelectItem value="parallax">Parallax Effect</SelectItem>
                          <SelectItem value="fill-width">Fill 100% Width</SelectItem>
                          <SelectItem value="fill-height">Fill 100% Height</SelectItem>
                          <SelectItem value="no-repeat">No Repeat</SelectItem>
                          <SelectItem value="repeat">Repeat</SelectItem>
                          <SelectItem value="repeat-x">Repeat Horizontally</SelectItem>
                          <SelectItem value="repeat-y">Repeat Vertically</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Image Position</Label>
                      <Select
                        value={props.backgroundPosition || 'center'}
                        onValueChange={(value) => updateProps({ backgroundPosition: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="top left">Top Left</SelectItem>
                          <SelectItem value="top right">Top Right</SelectItem>
                          <SelectItem value="bottom left">Bottom Left</SelectItem>
                          <SelectItem value="bottom right">Bottom Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Text Shadow Section */}
      <div className="bg-card rounded-lg border border-border">
        <SectionHeader id="textShadow" title="Text Shadow" icon={Eye} />
        {expandedSections.includes('textShadow') && (
          <div className="p-4 space-y-4 border-t border-border">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Enable Text Shadow</Label>
              <Switch
                checked={props.textShadowEnabled || false}
                onCheckedChange={(checked) => updateProps({ textShadowEnabled: checked })}
              />
            </div>

            {props.textShadowEnabled && (
              <>
                <SliderWithInput
                  label="Horizontal Offset (X)"
                  value={props.textShadowX || 0}
                  onChange={(val) => updateProps({ textShadowX: val })}
                  min={-50}
                  max={50}
                  step={1}
                />

                <SliderWithInput
                  label="Vertical Offset (Y)"
                  value={props.textShadowY || 0}
                  onChange={(val) => updateProps({ textShadowY: val })}
                  min={-50}
                  max={50}
                  step={1}
                />

                <SliderWithInput
                  label="Blur Radius"
                  value={props.textShadowBlur || 0}
                  onChange={(val) => updateProps({ textShadowBlur: val })}
                  min={0}
                  max={50}
                  step={1}
                />

                <ColorPicker
                  label="Shadow Color"
                  value={props.textShadowColor || '#000000'}
                  onChange={(color) => updateProps({ textShadowColor: color })}
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Icons Section */}
      <div className="bg-card rounded-lg border border-border">
        <SectionHeader id="icons" title="Icons" icon={Sparkles} />
        {expandedSections.includes('icons') && (
          <div className="p-4 space-y-6 border-t border-border">
            {/* Icon Before */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-foreground">Icon Before</Label>
                <Switch
                  checked={props.iconBeforeEnabled || false}
                  onCheckedChange={(checked) => updateProps({ iconBeforeEnabled: checked })}
                />
              </div>

              {props.iconBeforeEnabled && (
                <div className="pl-4 space-y-3 border-l-2 border-blue-200 dark:border-blue-800">
                  <IconPicker
                    value={props.iconBefore || ''}
                    onChange={(iconName) => updateProps({ iconBefore: iconName, iconBeforeClass: `lucide-${iconName.toLowerCase()}` })}
                    label="Select Icon"
                  />

                  <SliderWithInput
                    label="Icon Size"
                    value={props.iconBeforeSize || 24}
                    onChange={(val) => updateProps({ iconBeforeSize: val })}
                    min={12}
                    max={64}
                    step={2}
                  />

                  <ColorPicker
                    label="Icon Color"
                    value={props.iconBeforeColor || '#000000'}
                    onChange={(color) => updateProps({ iconBeforeColor: color })}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <SliderWithInput
                      label="Margin Left"
                      value={props.iconBeforeMarginLeft || 0}
                      onChange={(val) => updateProps({ iconBeforeMarginLeft: val })}
                      min={0}
                      max={50}
                      step={2}
                    />

                    <SliderWithInput
                      label="Margin Right"
                      value={props.iconBeforeMarginRight || 8}
                      onChange={(val) => updateProps({ iconBeforeMarginRight: val })}
                      min={0}
                      max={50}
                      step={2}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Icon After */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-foreground">Icon After</Label>
                <Switch
                  checked={props.iconAfterEnabled || false}
                  onCheckedChange={(checked) => updateProps({ iconAfterEnabled: checked })}
                />
              </div>

              {props.iconAfterEnabled && (
                <div className="pl-4 space-y-3 border-l-2 border-purple-200 dark:border-purple-800">
                  <IconPicker
                    value={props.iconAfter || ''}
                    onChange={(iconName) => updateProps({ iconAfter: iconName, iconAfterClass: `lucide-${iconName.toLowerCase()}` })}
                    label="Select Icon"
                  />

                  <SliderWithInput
                    label="Icon Size"
                    value={props.iconAfterSize || 24}
                    onChange={(val) => updateProps({ iconAfterSize: val })}
                    min={12}
                    max={64}
                    step={2}
                  />

                  <ColorPicker
                    label="Icon Color"
                    value={props.iconAfterColor || '#000000'}
                    onChange={(color) => updateProps({ iconAfterColor: color })}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <SliderWithInput
                      label="Margin Left"
                      value={props.iconAfterMarginLeft || 8}
                      onChange={(val) => updateProps({ iconAfterMarginLeft: val })}
                      min={0}
                      max={50}
                      step={2}
                    />

                    <SliderWithInput
                      label="Margin Right"
                      value={props.iconAfterMarginRight || 0}
                      onChange={(val) => updateProps({ iconAfterMarginRight: val })}
                      min={0}
                      max={50}
                      step={2}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
