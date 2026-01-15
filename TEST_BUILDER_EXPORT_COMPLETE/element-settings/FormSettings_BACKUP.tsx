"use client";



import React, { useState } from 'react';
import { ElementNode } from '@/lib/store/test-builder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, AlignLeft, AlignCenter, AlignRight,
  Palette, Type, Zap, Eye, Search, Wand2,
  Settings, Mail, Webhook, Shield, BarChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedColorPicker } from './shared/EnhancedColorPicker';
import { EnhancedSlider } from './shared/EnhancedSlider';
import { SectionCard } from './shared/SectionCard';
import { FormFieldBuilder, FormField } from './shared/FormFieldBuilder';

interface FormSettingsProps {
  node: ElementNode;
  updateProps: (updates: any) => void;
}

export function FormSettings({ node, updateProps }: FormSettingsProps) {
  const props = node.props;
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'content', 'padding', 'typography', 'decoration', 'alignment', 'background', 'textShadow', 'icons'
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

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (color: string) => void }) => {
    const [showPicker, setShowPicker] = useState(false);

    return (
      <div>
        <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">{label}</Label>
        <div className="relative">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 transition-colors bg-white dark:bg-gray-800"
          >
            <div
              className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: value || '#000000' }}
            />
            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{value || '#000000'}</span>
          </button>
          {showPicker && (
            <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
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
        className="mt-2 cursor-pointer"
        style={{ touchAction: 'none' }}
      />
    </div>
  );

  return (
    <div className="space-y-2">
      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="content" title="Content" icon={Type} />
        {expandedSections.includes('content') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Heading Text</Label>
              <Input
                value={(props.text || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')}
                onChange={(e) => updateProps({ text: e.target.value })}
                placeholder="Enter heading text..."
                className="font-medium"
              />
            </div>

            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Heading Level</Label>
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
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="padding" title="Padding & Spacing" icon={Sparkles} />
        {expandedSections.includes('padding') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
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
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="typography" title="Typography" icon={Type} />
        {expandedSections.includes('typography') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Size</Label>
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
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Font Weight</Label>
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
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Font Family</Label>
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
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="decoration" title="Text Decoration" icon={Sparkles} />
        {expandedSections.includes('decoration') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Text Casing</Label>
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
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Text Decoration</Label>
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
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="alignment" title="Alignment & Opacity" icon={AlignCenter} />
        {expandedSections.includes('alignment') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Text Alignment</Label>
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
                      "p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                      props.align === value && "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
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
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="background" title="Background" icon={ImageIcon} />
        {expandedSections.includes('background') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600 dark:text-gray-400">Enable Background</Label>
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
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Background Image URL</Label>
                  <Input
                    value={props.backgroundImage || ''}
                    onChange={(e) => updateProps({ backgroundImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {props.backgroundImage && (
                  <>
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Image Style</Label>
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
                      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Image Position</Label>
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
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="textShadow" title="Text Shadow" icon={Eye} />
        {expandedSections.includes('textShadow') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600 dark:text-gray-400">Enable Text Shadow</Label>
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
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="icons" title="Icons" icon={Sparkles} />
        {expandedSections.includes('icons') && (
          <div className="p-4 space-y-6 border-t border-gray-200 dark:border-gray-700">
            {/* Icon Before */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Icon Before</Label>
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
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Icon After</Label>
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
