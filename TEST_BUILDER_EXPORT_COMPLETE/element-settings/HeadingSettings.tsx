"use client";



import React, { useState, useCallback, useMemo } from 'react';
import { useToggle } from '@/src/lib/hooks';
import { ElementNode } from '@/lib/store/test-builder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Type, Palette, Zap, Eye,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Search, Sparkles, Waves, Link2, Wand2,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  Bold, Italic, Underline, Strikethrough, Minus
} from 'lucide-react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as Separator from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';
import { EnhancedColorPicker } from './shared/EnhancedColorPicker';
import { EnhancedSlider } from './shared/EnhancedSlider';
import { SectionCard } from './shared/SectionCard';
import { TextStyleControls } from './shared/TextStyleControls';
import { RichTextEditor } from './shared/RichTextEditor';

interface HeadingSettingsProps {
  node: { id: string; props: Record<string, any> };
  updateProps: (updates: any) => void;
}

// Heading Presets
const HEADING_PRESETS = [
  {
    id: 'hero-gradient',
    name: 'Hero Gradient',
    description: 'Large gradient heading for hero sections',
    props: {
      text: 'Transform Your Business',
      level: 'h1',
      fontSize: 64,
      fontWeight: '800',
      lineHeight: 1.1,
      letterSpacing: -1,
      alignment: 'center',
      useGradient: true,
      gradientFrom: '#3b82f6',
      gradientTo: '#8b5cf6',
      gradientAngle: 135,
      textTransform: 'none'
    }
  },
  {
    id: 'section-bold',
    name: 'Section Bold',
    description: 'Bold section heading with emphasis',
    props: {
      text: 'Key Features',
      level: 'h2',
      fontSize: 48,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: -0.5,
      alignment: 'left',
      useGradient: false,
      textColor: '#1f2937',
      textTransform: 'none'
    }
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Simple, elegant heading',
    props: {
      text: 'About Our Company',
      level: 'h2',
      fontSize: 36,
      fontWeight: '600',
      lineHeight: 1.3,
      letterSpacing: 0,
      alignment: 'center',
      useGradient: false,
      textColor: '#374151',
      textTransform: 'none'
    }
  },
  {
    id: 'accent-uppercase',
    name: 'Accent Uppercase',
    description: 'Small uppercase accent heading',
    props: {
      text: 'Our Services',
      level: 'h3',
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 1.4,
      letterSpacing: 2,
      alignment: 'left',
      useGradient: false,
      textColor: '#3b82f6',
      textTransform: 'uppercase'
    }
  },
  {
    id: 'dark-dramatic',
    name: 'Dark Dramatic',
    description: 'Large dark heading with shadow',
    props: {
      text: 'Premium Experience',
      level: 'h1',
      fontSize: 56,
      fontWeight: '900',
      lineHeight: 1.1,
      letterSpacing: -1,
      alignment: 'center',
      useGradient: false,
      textColor: '#111827',
      useTextShadow: true,
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      textTransform: 'none'
    }
  }
];

export const HeadingSettings = React.memo(function HeadingSettings({ node, updateProps }: HeadingSettingsProps) {
  const props = node.props;
  const [activeTab, setActiveTab] = useState('content');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPresetPicker, togglePresetPicker, showPresets, hidePresets] = useToggle(false);

  // Memoize filtered presets based on search query
  const filteredPresets = useMemo(() => {
    if (!searchQuery) return HEADING_PRESETS;
    const query = searchQuery.toLowerCase();
    return HEADING_PRESETS.filter(preset => 
      preset.name.toLowerCase().includes(query) ||
      preset.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Memoize preset application handler
  const handleApplyPreset = useCallback((preset: typeof HEADING_PRESETS[0]) => {
    updateProps({ ...preset.props, presetId: preset.id });
    hidePresets();
  }, [updateProps, hidePresets]);

  // Set default values
  React.useEffect(() => {
    const defaults: any = {};
    if (!props.text) defaults.text = 'Your Heading Here';
    if (!props.level) defaults.level = 'h2';
    // Don't set default fontSize - let heading level determine size
    if (!props.fontWeight) defaults.fontWeight = '700';
    if (!props.lineHeight) defaults.lineHeight = 1.2;
    if (!props.letterSpacing) defaults.letterSpacing = 0;
    if (!props.textColor) defaults.textColor = '#1f2937';
    // Only set alignment default if it's truly undefined/null (not if it's already set)
    // Default to 'center' to match our new default behavior
    if (props.alignment === undefined || props.alignment === null) {
      defaults.alignment = 'center';
    }
    
    if (Object.keys(defaults).length > 0) {
      updateProps(defaults);
    }
  }, []);

  return (
    <div className="flex flex-col bg-card">
      {/* Top Bar with Search */}
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
        <div className="mb-2">
          <button
            onClick={togglePresetPicker}
            className="w-full flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <Wand2 size={14} className="text-primary" />
              <span className="text-xs font-semibold text-foreground">Style Presets</span>
            </div>
            <span className="text-xs text-foreground">{showPresetPicker ? 'Hide' : 'Show'}</span>
          </button>
        </div>

        {showPresetPicker && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {filteredPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={cn(
                  "p-3 border-2 rounded-lg text-left transition-all hover:border-primary hover:shadow-md",
                  props.presetId === preset.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">
                    {preset.name}
                  </span>
                  {props.presetId === preset.id && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {preset.description}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <Type size={12} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{preset.props.level.toUpperCase()}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {props.presetId && (
          <div className="mt-3 p-2 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Current: {HEADING_PRESETS.find(p => p.id === props.presetId)?.name || 'Custom'}
                </p>
              </div>
              <button
                onClick={() => updateProps({ presetId: null })}
                className="text-xs text-primary hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b bg-card px-4">
          <TabsTrigger 
            value="content"
            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
          >
            <Type size={14} className="mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger 
            value="design"
            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
          >
            <Palette size={14} className="mr-2" />
            Design
          </TabsTrigger>
          <TabsTrigger 
            value="behavior"
            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
          >
            <Zap size={14} className="mr-2" />
            Behavior
          </TabsTrigger>
        </TabsList>

        {/* CONTENT TAB */}
        <TabsContent value="content" className="p-4 space-y-3 mt-0">
          
          {/* Text Section */}
          <SectionCard id="text" title="Text Content" icon={Type}>
            <div className="space-y-3">
              <RichTextEditor
                content={props.text || ''}
                onChange={(content) => updateProps({ text: content })}
                placeholder="Your Heading Here"
                label="Heading Text"
                minHeight="100px"
                externalAlignment={props.alignment}
                externalFontFamily={props.fontFamily}
                externalFontSize={props.fontSize}
                externalTag={props.level || 'h1'}
                // NOTE: Removed externalBold, externalItalic, externalUnderline, externalStrikethrough
                // TipTap reads formatting directly from HTML content (<strong>, <em>, <u>, <s> tags)
                onAlignmentChange={(alignment) => {
                  // Update both alignment and align props to ensure sync
                  updateProps({ alignment, align: alignment });
                }}
                onFontFamilyChange={(fontFamily) => updateProps({ fontFamily })}
                onFontSizeChange={(fontSize) => updateProps({ fontSize })}
                onTagChange={(tag) => updateProps({ level: tag })}
                // NOTE: Remove formatting callbacks - TipTap handles via HTML tags in content
                onBoldChange={undefined}
                onItalicChange={undefined}
                onUnderlineChange={undefined}
                onStrikethroughChange={undefined}
              />

              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Heading Level</Label>
                <ToggleGroup.Root
                  type="single"
                  value={props.level || 'h2'}
                  onValueChange={(value) => value && updateProps({ level: value })}
                  className="grid grid-cols-6 gap-2"
                >
                  <ToggleGroup.Item
                    value="h1"
                    className={cn(
                      "h-12 flex flex-col items-center justify-center rounded-lg border-2 transition-all",
                      props.level === 'h1'
                        ? "bg-blue-50 dark:bg-blue-900/30 border-primary"
                        : "bg-card border-border hover:border-blue-300"
                    )}
                  >
                    <Heading1 size={20} />
                    <span className="text-[10px] mt-1">H1</span>
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    value="h2"
                    className={cn(
                      "h-12 flex flex-col items-center justify-center rounded-lg border-2 transition-all",
                      props.level === 'h2'
                        ? "bg-blue-50 dark:bg-blue-900/30 border-primary"
                        : "bg-card border-border hover:border-blue-300"
                    )}
                  >
                    <Heading2 size={18} />
                    <span className="text-[10px] mt-1">H2</span>
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    value="h3"
                    className={cn(
                      "h-12 flex flex-col items-center justify-center rounded-lg border-2 transition-all",
                      props.level === 'h3'
                        ? "bg-blue-50 dark:bg-blue-900/30 border-primary"
                        : "bg-card border-border hover:border-blue-300"
                    )}
                  >
                    <Heading3 size={16} />
                    <span className="text-[10px] mt-1">H3</span>
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    value="h4"
                    className={cn(
                      "h-12 flex flex-col items-center justify-center rounded-lg border-2 transition-all",
                      props.level === 'h4'
                        ? "bg-blue-50 dark:bg-blue-900/30 border-primary"
                        : "bg-card border-border hover:border-blue-300"
                    )}
                  >
                    <Heading4 size={14} />
                    <span className="text-[10px] mt-1">H4</span>
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    value="h5"
                    className={cn(
                      "h-12 flex flex-col items-center justify-center rounded-lg border-2 transition-all",
                      props.level === 'h5'
                        ? "bg-blue-50 dark:bg-blue-900/30 border-primary"
                        : "bg-card border-border hover:border-blue-300"
                    )}
                  >
                    <Heading5 size={12} />
                    <span className="text-[10px] mt-1">H5</span>
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    value="h6"
                    className={cn(
                      "h-12 flex flex-col items-center justify-center rounded-lg border-2 transition-all",
                      props.level === 'h6'
                        ? "bg-blue-50 dark:bg-blue-900/30 border-primary"
                        : "bg-card border-border hover:border-blue-300"
                    )}
                  >
                    <Heading6 size={10} />
                    <span className="text-[10px] mt-1">H6</span>
                  </ToggleGroup.Item>
                </ToggleGroup.Root>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Dynamic Content</Label>
                  <p className="text-xs text-foreground">Bind to variable</p>
                </div>
                <Switch
                  checked={props.dynamicContent || false}
                  onCheckedChange={(checked) => updateProps({ dynamicContent: checked })}
                />
              </div>

              {props.dynamicContent && (
                <Input
                  value={props.dynamicVariable || ''}
                  onChange={(e) => updateProps({ dynamicVariable: e.target.value })}
                  placeholder="{{variable_name}}"
                  className="font-mono text-sm"
                />
              )}
            </div>
          </SectionCard>

          {/* Alignment Section */}
          <SectionCard id="alignment" title="Alignment" icon={AlignCenter}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Text Alignment</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: AlignLeft, value: 'left', label: 'Left' },
                    { icon: AlignCenter, value: 'center', label: 'Center' },
                    { icon: AlignRight, value: 'right', label: 'Right' },
                    { icon: AlignJustify, value: 'justify', label: 'Justify' },
                  ].map(({ icon: Icon, value, label }) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => updateProps({ alignment: value })}
                      className={cn(
                        "h-10 flex flex-col items-center justify-center gap-1",
                        (props.alignment || props.align) === value && "bg-blue-50 dark:bg-blue-900/30 border-primary"
                      )}
                      title={label}
                    >
                      <Icon size={16} />
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-foreground mt-2">Current: {props.alignment || 'left'}</p>
              </div>
            </div>
          </SectionCard>

        </TabsContent>

        {/* DESIGN TAB */}
        <TabsContent value="design" className="p-4 space-y-3 mt-0">
          
          <Separator.Root className="my-4 h-px bg-gray-200 dark:bg-gray-700" />

          {/* Typography Section */}
          <SectionCard id="typography" title="Typography" icon={Type}>
            <div className="space-y-3">
              {/* Font Family */}
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Font Family</Label>
                <Select value={props.fontFamily || 'Inter'} onValueChange={(value) => updateProps({ fontFamily: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                    <SelectItem value="Merriweather">Merriweather</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <EnhancedSlider
                label="Font Size"
                value={props.fontSize || 32}
                onChange={(val) => updateProps({ fontSize: val })}
                min={16}
                max={96}
                unit="px"
              />

              {/* NOTE: Font Weight, Font Style, and Text Decoration controls removed */}
              {/* TipTap handles these via HTML tags (<strong>, <em>, <u>, <s>) in the Content tab */}
              {/* CSS-based controls here would conflict with HTML-based formatting */}

              <EnhancedSlider
                label="Line Height"
                value={props.lineHeight || 1.2}
                onChange={(val) => updateProps({ lineHeight: val })}
                min={0.8}
                max={2.5}
                step={0.1}
              />

              <EnhancedSlider
                label="Letter Spacing"
                value={props.letterSpacing || 0}
                onChange={(val) => updateProps({ letterSpacing: val })}
                min={-2}
                max={10}
                step={0.1}
                unit="px"
              />

              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Text Transform</Label>
                <Select value={props.textTransform || 'none'} onValueChange={(value) => updateProps({ textTransform: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="uppercase">UPPERCASE</SelectItem>
                    <SelectItem value="lowercase">lowercase</SelectItem>
                    <SelectItem value="capitalize">Capitalize</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Opacity */}
              <EnhancedSlider
                label="Opacity"
                value={props.opacity !== undefined ? props.opacity : 1}
                onChange={(val) => updateProps({ opacity: val })}
                min={0}
                max={1}
                step={0.1}
              />
            </div>
          </SectionCard>

          <Separator.Root className="my-4 h-px bg-gray-200 dark:bg-gray-700" />

          {/* Colors Section */}
          <SectionCard id="colors" title="Colors" icon={Palette}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Use Gradient</Label>
                  <p className="text-xs text-foreground">Gradient text effect</p>
                </div>
                <Switch
                  checked={props.useGradient || false}
                  onCheckedChange={(checked) => updateProps({ useGradient: checked })}
                />
              </div>

              {!props.useGradient ? (
                <EnhancedColorPicker
                  label="Text Color"
                  value={props.textColor || '#1f2937'}
                  onChange={(color) => updateProps({ textColor: color })}
                />
              ) : (
                <>
                  <EnhancedColorPicker
                    label="Gradient From"
                    value={props.gradientFrom || '#3b82f6'}
                    onChange={(color) => updateProps({ gradientFrom: color })}
                  />
                  <EnhancedColorPicker
                    label="Gradient To"
                    value={props.gradientTo || '#8b5cf6'}
                    onChange={(color) => updateProps({ gradientTo: color })}
                  />
                  <EnhancedSlider
                    label="Gradient Angle"
                    value={props.gradientAngle || 90}
                    onChange={(val) => updateProps({ gradientAngle: val })}
                    min={0}
                    max={360}
                    unit="°"
                  />
                </>
              )}

              <EnhancedColorPicker
                label="Highlight Color"
                value={props.highlightColor || 'transparent'}
                onChange={(color) => updateProps({ highlightColor: color })}
              />
            </div>
          </SectionCard>

        </TabsContent>

        {/* BEHAVIOR TAB */}
        <TabsContent value="behavior" className="p-4 space-y-3 mt-0">
          
          {/* Entry Animations Section */}
          <SectionCard id="animations" title="Entry Animations" icon={Waves}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Animation Trigger</Label>
                <Select value={props.animationTrigger || 'none'} onValueChange={(value) => updateProps({ animationTrigger: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="load">On Page Load</SelectItem>
                    <SelectItem value="scroll">On Scroll Into View</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {props.animationTrigger && props.animationTrigger !== 'none' && (
                <>
                  <div>
                    <Label className="text-xs font-medium text-foreground mb-2 block">Animation Type</Label>
                    <Select value={props.animationType || 'fadeIn'} onValueChange={(value) => updateProps({ animationType: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fadeIn">Fade In</SelectItem>
                        <SelectItem value="slideInUp">Slide In Up</SelectItem>
                        <SelectItem value="slideInDown">Slide In Down</SelectItem>
                        <SelectItem value="slideInLeft">Slide In Left</SelectItem>
                        <SelectItem value="slideInRight">Slide In Right</SelectItem>
                        <SelectItem value="zoomIn">Zoom In</SelectItem>
                        <SelectItem value="bounceIn">Bounce In</SelectItem>
                        <SelectItem value="rotateIn">Rotate In</SelectItem>
                        <SelectItem value="typing">Typing Effect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <EnhancedSlider
                    label="Animation Duration"
                    value={props.animationDuration || 600}
                    onChange={(val) => updateProps({ animationDuration: val })}
                    min={300}
                    max={2000}
                    unit="ms"
                  />

                  <EnhancedSlider
                    label="Animation Delay"
                    value={props.animationDelay || 0}
                    onChange={(val) => updateProps({ animationDelay: val })}
                    min={0}
                    max={2000}
                    unit="ms"
                  />

                  <div>
                    <Label className="text-xs font-medium text-foreground mb-2 block">Easing</Label>
                    <Select value={props.animationEasing || 'ease'} onValueChange={(value) => updateProps({ animationEasing: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="ease">Ease</SelectItem>
                        <SelectItem value="ease-in">Ease In</SelectItem>
                        <SelectItem value="ease-out">Ease Out</SelectItem>
                        <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </SectionCard>

          {/* Letter Hover Animation Section */}
          <SectionCard id="letter-hover" title="Letter Hover Animation" icon={Zap}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Enable Letter Hover</Label>
                  <p className="text-xs text-foreground">Letters enlarge on hover</p>
                </div>
                <Switch
                  checked={props.letterHoverAnimation || false}
                  onCheckedChange={(checked) => updateProps({ letterHoverAnimation: checked })}
                />
              </div>

              {props.letterHoverAnimation && (
                <>
                  <EnhancedSlider
                    label="Scale Amount"
                    value={props.letterHoverScale || 1.2}
                    onChange={(val) => updateProps({ letterHoverScale: val })}
                    min={1.1}
                    max={2.0}
                    step={0.1}
                    unit="x"
                  />

                  <EnhancedSlider
                    label="Animation Duration"
                    value={(props.letterHoverDuration || 0.3) * 1000}
                    onChange={(val) => updateProps({ letterHoverDuration: val / 1000 })}
                    min={100}
                    max={1000}
                    step={50}
                    unit="ms"
                  />
                </>
              )}
            </div>
          </SectionCard>

          {/* Link Section */}
          <SectionCard id="link" title="Link" icon={Link2}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Make Clickable</Label>
                  <p className="text-xs text-foreground">Add link to heading</p>
                </div>
                <Switch
                  checked={props.isClickable || false}
                  onCheckedChange={(checked) => updateProps({ isClickable: checked })}
                />
              </div>

              {props.isClickable && (
                <>
                  <div>
                    <Label className="text-xs font-medium text-foreground mb-2 block">URL</Label>
                    <Input
                      value={props.url || ''}
                      onChange={(e) => updateProps({ url: e.target.value })}
                      placeholder="https://example.com"
                      type="url"
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Label className="text-xs text-foreground">Open in New Tab</Label>
                    <Switch
                      checked={props.openInNewTab || false}
                      onCheckedChange={(checked) => updateProps({ openInNewTab: checked })}
                    />
                  </div>
                </>
              )}
            </div>
          </SectionCard>

        </TabsContent>
      </Tabs>
    </div>
  );
});
