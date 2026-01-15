"use client";



import React, { useState } from 'react';
import { Element } from '../store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Type, Palette, Zap, Eye,
  Sparkles, Link2, AlignLeft, AlignCenter, AlignRight,
  Search, Wand2, MousePointer, Waves,
  Download, Mail, Phone, ExternalLink, FileDown, Anchor,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedColorPicker } from './shared/EnhancedColorPicker';
import { EnhancedSlider } from './shared/EnhancedSlider';
import { SectionCard } from './shared/SectionCard';

interface ButtonSettingsProps {
  node: Element;
  updateProps: (updates: any) => void;
}

export function ButtonSettings({ node, updateProps }: ButtonSettingsProps) {
  const props = node.props;
  const [activeTab, setActiveTab] = useState('content');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Set default values on mount
  React.useEffect(() => {
    const defaults: any = {};
    if (!props.text) defaults.text = 'Click Here';
    if (!props.backgroundColor) defaults.backgroundColor = '#3b82f6';
    if (!props.textColor) defaults.textColor = '#ffffff';
    if (!props.borderRadius && props.borderRadius !== 0) defaults.borderRadius = 8;
    if (!props.fontSize) defaults.fontSize = 16;
    if (!props.fontWeight) defaults.fontWeight = '500';
    if (props.paddingTop === undefined) defaults.paddingTop = 12;
    if (props.paddingRight === undefined) defaults.paddingRight = 24;
    if (props.paddingBottom === undefined) defaults.paddingBottom = 12;
    if (props.paddingLeft === undefined) defaults.paddingLeft = 24;
    if (!props.transitionDuration) defaults.transitionDuration = 300;
    
    if (Object.keys(defaults).length > 0) {
      updateProps(defaults);
    }
  }, []);

  // Preset styles
  const presets = {
    primary: {
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderRadius: 8,
      paddingTop: 12,
      paddingRight: 24,
      paddingBottom: 12,
      paddingLeft: 24,
      fontSize: 16,
      fontWeight: '600',
    },
    secondary: {
      backgroundColor: '#6b7280',
      textColor: '#ffffff',
      borderRadius: 8,
      paddingTop: 12,
      paddingRight: 24,
      paddingBottom: 12,
      paddingLeft: 24,
      fontSize: 16,
      fontWeight: '500',
    },
    success: {
      backgroundColor: '#10b981',
      textColor: '#ffffff',
      borderRadius: 8,
      paddingTop: 12,
      paddingRight: 24,
      paddingBottom: 12,
      paddingLeft: 24,
      fontSize: 16,
      fontWeight: '600',
    },
    danger: {
      backgroundColor: '#ef4444',
      textColor: '#ffffff',
      borderRadius: 8,
      paddingTop: 12,
      paddingRight: 24,
      paddingBottom: 12,
      paddingLeft: 24,
      fontSize: 16,
      fontWeight: '600',
    },
    warning: {
      backgroundColor: '#f59e0b',
      textColor: '#ffffff',
      borderRadius: 8,
      paddingTop: 12,
      paddingRight: 24,
      paddingBottom: 12,
      paddingLeft: 24,
      fontSize: 16,
      fontWeight: '600',
    },
    info: {
      backgroundColor: '#06b6d4',
      textColor: '#ffffff',
      borderRadius: 8,
      paddingTop: 12,
      paddingRight: 24,
      paddingBottom: 12,
      paddingLeft: 24,
      fontSize: 16,
      fontWeight: '500',
    },
    outline: {
      backgroundColor: 'transparent',
      textColor: '#3b82f6',
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#3b82f6',
      paddingTop: 12,
      paddingRight: 24,
      paddingBottom: 12,
      paddingLeft: 24,
      fontSize: 16,
      fontWeight: '500',
    },
    ghost: {
      backgroundColor: 'transparent',
      textColor: '#374151',
      borderRadius: 8,
      paddingTop: 12,
      paddingRight: 24,
      paddingBottom: 12,
      paddingLeft: 24,
      fontSize: 16,
      fontWeight: '500',
    },
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    updateProps(presets[presetName]);
  };

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


      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-border bg-card h-12 flex-shrink-0">
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
          <SectionCard id="text" title="Text" icon={Type} onReset={() => updateProps({ text: 'Click Here', subtext: '' })}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">
                  Button Text *
                </Label>
                <Input
                  value={props.text || ''}
                  onChange={(e) => updateProps({ text: e.target.value })}
                  placeholder="Click Here"
                  className="font-medium"
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">
                  Subtext
                </Label>
                <Input
                  value={props.subtext || ''}
                  onChange={(e) => updateProps({ subtext: e.target.value })}
                  placeholder="Optional secondary text"
                  className="text-sm"
                />
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

          {/* Icon Section */}
          <SectionCard id="icon" title="Icon" icon={Sparkles} onReset={() => updateProps({ showIcon: false })}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-foreground">Show Icon</Label>
                <Switch
                  checked={props.showIcon || false}
                  onCheckedChange={(checked) => updateProps({ showIcon: checked })}
                />
              </div>

              {props.showIcon && (
                <>
                  <div>
                    <Label className="text-xs font-medium text-foreground mb-2 block">Position</Label>
                    <Select value={props.iconPosition || 'left'} onValueChange={(value) => updateProps({ iconPosition: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <EnhancedSlider
                    label="Icon Size"
                    value={props.iconSize || 16}
                    onChange={(val) => updateProps({ iconSize: val })}
                    min={12}
                    max={32}
                    tooltip="Size of the icon in pixels"
                  />

                  <EnhancedSlider
                    label="Icon Spacing"
                    value={props.iconSpacing || 8}
                    onChange={(val) => updateProps({ iconSpacing: val })}
                    min={0}
                    max={24}
                    tooltip="Space between icon and text"
                  />
                </>
              )}
            </div>
          </SectionCard>

          {/* Alignment Section */}
          <SectionCard id="alignment" title="Alignment" icon={AlignCenter}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Button Alignment</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: AlignLeft, value: 'left', label: 'Left' },
                    { icon: AlignCenter, value: 'center', label: 'Center' },
                    { icon: AlignRight, value: 'right', label: 'Right' },
                  ].map(({ icon: Icon, value, label }) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('🎯 Alignment clicked:', value);
                        updateProps({ alignment: value });
                      }}
                      className={cn(
                        "h-10 flex flex-col items-center justify-center gap-1",
                        props.alignment === value && "bg-blue-50 dark:bg-blue-900/30 border-primary"
                      )}
                      title={label}
                    >
                      <Icon size={16} />
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-foreground mt-2">Current: {props.alignment || 'center'}</p>
              </div>
            </div>
          </SectionCard>

        </TabsContent>

        {/* DESIGN TAB */}
        <TabsContent value="design" className="p-4 space-y-3 mt-0">
          
          {/* Presets Gallery Section */}
          <SectionCard id="presets" title="Quick Presets" icon={Wand2}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(presets).map((presetName) => (
                  <Button
                    key={presetName}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(presetName as keyof typeof presets)}
                    className="h-auto py-3 flex flex-col items-center gap-2 hover:bg-accent"
                  >
                    <div 
                      className="w-full h-10 rounded flex items-center justify-center text-xs font-medium transition-all"
                      style={{
                        backgroundColor: presets[presetName as keyof typeof presets].backgroundColor,
                        color: presets[presetName as keyof typeof presets].textColor,
                        border: (presets[presetName as keyof typeof presets] as any).borderWidth 
                          ? `${(presets[presetName as keyof typeof presets] as any).borderWidth}px solid ${(presets[presetName as keyof typeof presets] as any).borderColor}`
                          : 'none',
                        borderRadius: '6px',
                      }}
                    >
                      Button
                    </div>
                    <span className="text-xs capitalize font-medium text-foreground">{presetName}</span>
                  </Button>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Typography Section */}
          <SectionCard id="typography" title="Typography" icon={Type}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Font Weight</Label>
                <Select value={props.fontWeight || '500'} onValueChange={(value) => updateProps({ fontWeight: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Light (300)</SelectItem>
                    <SelectItem value="400">Normal (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semibold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <EnhancedSlider
                label="Font Size"
                value={props.fontSize || 16}
                onChange={(val) => updateProps({ fontSize: val })}
                min={10}
                max={32}
                tooltip="Text size in pixels"
              />

              <EnhancedSlider
                label="Letter Spacing"
                value={props.letterSpacing || 0}
                onChange={(val) => updateProps({ letterSpacing: val })}
                min={-2}
                max={10}
                step={0.1}
                tooltip="Space between letters"
              />
            </div>
          </SectionCard>

          {/* Colors Section */}
          <SectionCard id="colors" title="Colors" icon={Palette}>
            <div className="space-y-3">
              <EnhancedColorPicker
                label="Text Color (Normal)"
                value={props.textColor || '#ffffff'}
                onChange={(color) => updateProps({ textColor: color })}
                showContrastCheck
                contrastWith={props.backgroundColor}
              />

              <EnhancedColorPicker
                label="Text Color (Hover)"
                value={props.hoverTextColor || props.textColor || '#ffffff'}
                onChange={(color) => updateProps({ hoverTextColor: color })}
              />

              <EnhancedColorPicker
                label="Background (Normal)"
                value={props.backgroundColor || '#3b82f6'}
                onChange={(color) => updateProps({ backgroundColor: color })}
              />

              <EnhancedColorPicker
                label="Background (Hover)"
                value={props.hoverBackgroundColor || props.backgroundColor || '#3b82f6'}
                onChange={(color) => updateProps({ hoverBackgroundColor: color })}
              />

              <EnhancedColorPicker
                label="Subtext Color"
                value={props.subtextColor || props.textColor || '#ffffff'}
                onChange={(color) => updateProps({ subtextColor: color })}
              />
            </div>
          </SectionCard>

          {/* Size & Spacing Section */}
          <SectionCard id="spacing" title="Size & Spacing" icon={Sparkles}>
            <div className="space-y-3">
              <EnhancedSlider
                label="Padding Top"
                value={props.paddingTop || 12}
                onChange={(val) => updateProps({ paddingTop: val })}
                min={0}
                max={50}
              />

              <EnhancedSlider
                label="Padding Right"
                value={props.paddingRight || 24}
                onChange={(val) => updateProps({ paddingRight: val })}
                min={0}
                max={100}
              />

              <EnhancedSlider
                label="Padding Bottom"
                value={props.paddingBottom || 12}
                onChange={(val) => updateProps({ paddingBottom: val })}
                min={0}
                max={50}
              />

              <EnhancedSlider
                label="Padding Left"
                value={props.paddingLeft || 24}
                onChange={(val) => updateProps({ paddingLeft: val })}
                min={0}
                max={100}
              />

              <EnhancedSlider
                label="Border Radius"
                value={props.borderRadius || 8}
                onChange={(val) => updateProps({ borderRadius: val })}
                min={0}
                max={50}
                tooltip="Rounded corners"
              />
            </div>
          </SectionCard>

        </TabsContent>

        {/* BEHAVIOR TAB */}
        <TabsContent value="behavior" className="p-4 space-y-3 mt-0">
          
          {/* Link / Action Section - MOVED FROM CONTENT TAB */}
          <SectionCard id="action" title="Link / Action" icon={Link2}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Action Type</Label>
                <Select value={props.actionType || 'link'} onValueChange={(value) => updateProps({ actionType: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="link">
                      <div className="flex items-center gap-2">
                        <ExternalLink size={14} />
                        <span>Open URL</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="download">
                      <div className="flex items-center gap-2">
                        <FileDown size={14} />
                        <span>Download File</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="scroll">
                      <div className="flex items-center gap-2">
                        <Anchor size={14} />
                        <span>Scroll to Section</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="popup">
                      <div className="flex items-center gap-2">
                        <Maximize2 size={14} />
                        <span>Open Popup</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>Send Email</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>Call Phone</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Fields Based on Action Type */}
              {props.actionType === 'link' && (
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

              {props.actionType === 'download' && (
                <>
                  <div>
                    <Label className="text-xs font-medium text-foreground mb-2 block">File URL</Label>
                    <Input
                      value={props.downloadUrl || ''}
                      onChange={(e) => updateProps({ downloadUrl: e.target.value })}
                      placeholder="https://example.com/file.pdf"
                      type="url"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-foreground mb-2 block">Filename (Optional)</Label>
                    <Input
                      value={props.downloadFilename || ''}
                      onChange={(e) => updateProps({ downloadFilename: e.target.value })}
                      placeholder="document.pdf"
                      className="text-sm"
                    />
                  </div>
                </>
              )}

              {props.actionType === 'scroll' && (
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">Section ID</Label>
                  <Input
                    value={props.scrollTarget || ''}
                    onChange={(e) => updateProps({ scrollTarget: e.target.value })}
                    placeholder="section-id"
                    className="text-sm"
                  />
                  <p className="text-xs text-foreground mt-1">Enter the ID of the section to scroll to</p>
                </div>
              )}

              {props.actionType === 'popup' && (
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">Popup ID</Label>
                  <Input
                    value={props.popupId || ''}
                    onChange={(e) => updateProps({ popupId: e.target.value })}
                    placeholder="popup-id"
                    className="text-sm"
                  />
                </div>
              )}

              {props.actionType === 'email' && (
                <>
                  <div>
                    <Label className="text-xs font-medium text-foreground mb-2 block">Email Address</Label>
                    <Input
                      value={props.emailAddress || ''}
                      onChange={(e) => updateProps({ emailAddress: e.target.value })}
                      placeholder="contact@example.com"
                      type="email"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-foreground mb-2 block">Subject (Optional)</Label>
                    <Input
                      value={props.emailSubject || ''}
                      onChange={(e) => updateProps({ emailSubject: e.target.value })}
                      placeholder="Inquiry"
                      className="text-sm"
                    />
                  </div>
                </>
              )}

              {props.actionType === 'phone' && (
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">Phone Number</Label>
                  <Input
                    value={props.phoneNumber || ''}
                    onChange={(e) => updateProps({ phoneNumber: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    type="tel"
                    className="text-sm"
                  />
                </div>
              )}
            </div>
          </SectionCard>

          {/* Hover Effects Section */}
          <SectionCard id="hover" title="Hover Effects" icon={MousePointer}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Hover Animation</Label>
                <Select value={props.hoverAnimation || 'none'} onValueChange={(value) => updateProps({ hoverAnimation: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="lift">Lift Up</SelectItem>
                    <SelectItem value="grow">Grow</SelectItem>
                    <SelectItem value="shrink">Shrink</SelectItem>
                    <SelectItem value="pulse">Pulse</SelectItem>
                    <SelectItem value="shake">Shake</SelectItem>
                    <SelectItem value="rotate">Rotate</SelectItem>
                    <SelectItem value="glow">Glow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <EnhancedSlider
                label="Hover Scale"
                value={props.hoverScale || 1}
                onChange={(val) => updateProps({ hoverScale: val })}
                min={0.9}
                max={1.2}
                step={0.05}
              />

              <EnhancedSlider
                label="Hover Shadow"
                value={props.hoverShadow || 0}
                onChange={(val) => updateProps({ hoverShadow: val })}
                min={0}
                max={30}
                unit="px"
              />

              <EnhancedSlider
                label="Transition Duration"
                value={props.transitionDuration || 300}
                onChange={(val) => updateProps({ transitionDuration: val })}
                min={100}
                max={1000}
                unit="ms"
              />
            </div>
          </SectionCard>

          {/* Click Effects Section */}
          <SectionCard id="click" title="Click Effects" icon={Zap}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Click Animation</Label>
                <Select value={props.clickAnimation || 'none'} onValueChange={(value) => updateProps({ clickAnimation: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="ripple">Ripple</SelectItem>
                    <SelectItem value="bounce">Bounce</SelectItem>
                    <SelectItem value="flash">Flash</SelectItem>
                    <SelectItem value="jello">Jello</SelectItem>
                    <SelectItem value="rubber">Rubber Band</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Haptic Feedback</Label>
                  <p className="text-xs text-foreground">Vibrate on mobile</p>
                </div>
                <Switch
                  checked={props.hapticFeedback || false}
                  onCheckedChange={(checked) => updateProps({ hapticFeedback: checked })}
                />
              </div>
            </div>
          </SectionCard>

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
                        <SelectItem value="flipIn">Flip In</SelectItem>
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

        </TabsContent>
      </Tabs>
    </div>
  );
}
