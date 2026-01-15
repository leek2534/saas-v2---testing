"use client";



import React, { useState } from 'react';
import { ElementNode } from '@/lib/store/test-builder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Type, Palette, Zap, Search, Timer, Calendar, AlignLeft, AlignCenter, AlignRight, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedColorPicker } from './shared/EnhancedColorPicker';
import { EnhancedSlider } from './shared/EnhancedSlider';
import { SectionCard } from './shared/SectionCard';
import { COUNTDOWN_STYLE_PRESETS } from './FlipCountdownPresets';

interface CountdownSettingsProps {
  node: ElementNode;
  updateProps: (updates: any) => void;
}

// Countdown Timer Presets
const COUNTDOWN_PRESETS = [
  {
    id: 'urgent-red',
    name: 'Urgent Red',
    description: 'High urgency with bold red styling',
    category: 'urgency',
    props: {
      title: 'Limited Time Offer!',
      countdownType: 'fixed',
      displayFormat: 'full',
      numberColor: '#dc2626',
      labelColor: '#991b1b',
      backgroundColor: '#fee2e2',
      fontSize: 56,
      labelFontSize: 14,
      fontWeight: '800',
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: 32,
      paddingRight: 32,
      borderRadius: 12,
      gap: 20,
      animateNumbers: true,
      pulseOnLowTime: true,
      lowTimeThreshold: 300
    }
  },
  {
    id: 'elegant-dark',
    name: 'Elegant Dark',
    description: 'Sophisticated dark theme for premium offers',
    category: 'premium',
    props: {
      title: 'Exclusive Access Ends In',
      countdownType: 'fixed',
      displayFormat: 'full',
      numberColor: '#ffffff',
      labelColor: '#d1d5db',
      backgroundColor: '#1f2937',
      fontSize: 48,
      labelFontSize: 12,
      fontWeight: '700',
      paddingTop: 28,
      paddingBottom: 28,
      paddingLeft: 36,
      paddingRight: 36,
      borderRadius: 16,
      gap: 24,
      animateNumbers: true,
      showSeparator: false
    }
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Simple and clean design for any page',
    category: 'minimal',
    props: {
      title: 'Sale Ends Soon',
      countdownType: 'fixed',
      displayFormat: 'hours',
      numberColor: '#111827',
      labelColor: '#6b7280',
      backgroundColor: '#ffffff',
      fontSize: 40,
      labelFontSize: 13,
      fontWeight: '600',
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 24,
      paddingRight: 24,
      borderRadius: 8,
      gap: 16,
      animateNumbers: true
    }
  },
  {
    id: 'vibrant-gradient',
    name: 'Vibrant Gradient',
    description: 'Eye-catching gradient for maximum attention',
    category: 'attention',
    props: {
      title: 'Flash Sale!',
      countdownType: 'fixed',
      displayFormat: 'full',
      numberColor: '#ffffff',
      labelColor: '#f3f4f6',
      backgroundColor: '#8b5cf6',
      fontSize: 52,
      labelFontSize: 14,
      fontWeight: '800',
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: 32,
      paddingRight: 32,
      borderRadius: 20,
      gap: 20,
      animateNumbers: true,
      pulseOnLowTime: true
    }
  },
  {
    id: 'compact-inline',
    name: 'Compact Inline',
    description: 'Space-saving compact format',
    category: 'compact',
    props: {
      title: '',
      countdownType: 'fixed',
      displayFormat: 'compact',
      numberColor: '#059669',
      labelColor: '#047857',
      backgroundColor: '#d1fae5',
      fontSize: 32,
      labelFontSize: 12,
      fontWeight: '700',
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 6,
      gap: 12,
      animateNumbers: true
    }
  }
];

export function CountdownSettings({ node, updateProps }: CountdownSettingsProps) {
  const props = node.props;
  const [activeTab, setActiveTab] = useState('content');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  // Set default values on mount
  React.useEffect(() => {
    const defaults: any = {};
    if (!props.title) defaults.title = 'Limited Time Offer!';
    if (!props.countdownType) defaults.countdownType = 'fixed';
    if (!props.displayFormat) defaults.displayFormat = 'full';
    if (!props.daysLabel) defaults.daysLabel = 'Days';
    if (!props.hoursLabel) defaults.hoursLabel = 'Hours';
    if (!props.minutesLabel) defaults.minutesLabel = 'Minutes';
    if (!props.secondsLabel) defaults.secondsLabel = 'Seconds';
    if (!props.expiredMessage) defaults.expiredMessage = 'Offer has ended!';
    if (!props.numberColor) defaults.numberColor = '#000000';
    if (!props.labelColor) defaults.labelColor = '#666666';
    if (!props.backgroundColor) defaults.backgroundColor = '#f3f4f6';
    if (!props.fontSize) defaults.fontSize = 48;
    if (!props.labelFontSize) defaults.labelFontSize = 14;
    if (props.paddingTop === undefined) defaults.paddingTop = 20;
    if (props.paddingBottom === undefined) defaults.paddingBottom = 20;
    if (props.paddingLeft === undefined) defaults.paddingLeft = 20;
    if (props.paddingRight === undefined) defaults.paddingRight = 20;
    if (!props.borderRadius) defaults.borderRadius = 8;
    if (!props.gap) defaults.gap = 16;
    
    if (Object.keys(defaults).length > 0) {
      updateProps(defaults);
    }
  }, []);

  // Calculate time remaining for preview
  const getTimeRemaining = () => {
    if (props.countdownType === 'fixed' && props.endDate) {
      const end = new Date(props.endDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, end - now);
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    } else if (props.countdownType === 'evergreen') {
      return { days: props.evergreenDays || 0, hours: props.evergreenHours || 24, minutes: 30, seconds: 45 };
    }
    
    return { days: 2, hours: 14, minutes: 30, seconds: 45 };
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div className="flex flex-col bg-card">
      {/* Top Bar with Search */}
      <div className="p-3 bg-card border-b border-border">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search settings..." className="pl-9 h-9 text-sm" />
        </div>
      </div>

      {/* Presets Section */}
      <div className="p-3 bg-card border-b border-border">
        <div className="mb-2">
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
        </div>

        {showPresetPicker && (
          <div className="space-y-4 mt-3">
            {/* Regular Presets */}
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">Standard Styles</h4>
              <div className="grid grid-cols-2 gap-2">
                {COUNTDOWN_PRESETS.map((preset) => (
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
                      <span className="text-xs font-semibold text-foreground">
                        {preset.name}
                      </span>
                      {props.presetId === preset.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {preset.description}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <div
                        className="w-6 h-6 rounded border border-border"
                        style={{ backgroundColor: preset.props.backgroundColor }}
                      />
                      <div
                        className="w-6 h-6 rounded border border-border flex items-center justify-center text-[8px] font-bold"
                        style={{ color: preset.props.numberColor, backgroundColor: preset.props.backgroundColor }}
                      >
                        00
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Different Visual Style Presets with Visual Previews */}
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">Visual Styles</h4>
              <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto">
                {COUNTDOWN_STYLE_PRESETS.map((preset) => (
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
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-foreground">
                            {preset.name}
                          </span>
                          {props.presetId === preset.id && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight mb-2">
                          {preset.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-foreground">
                          <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                            {preset.category}
                          </span>
                          <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded text-primary">
                            {preset.props.visualStyle}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Visual Preview */}
                    <div className="mt-3 border border-border rounded-lg overflow-hidden">
                      {preset.preview}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {props.presetId && (
          <div className="mt-3 p-2 bg-primary/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                  Current: {
                    COUNTDOWN_PRESETS.find(p => p.id === props.presetId)?.name ||
                    COUNTDOWN_STYLE_PRESETS.find(p => p.id === props.presetId)?.name ||
                    'Custom'
                  }
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
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-border bg-card h-12 flex-shrink-0">
          <TabsTrigger value="content" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <Clock size={14} className="mr-2" />Content
          </TabsTrigger>
          <TabsTrigger value="design" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <Palette size={14} className="mr-2" />Design
          </TabsTrigger>
          <TabsTrigger value="behavior" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <Zap size={14} className="mr-2" />Behavior
          </TabsTrigger>
        </TabsList>

        {/* CONTENT TAB */}
        <TabsContent value="content" className="p-4 space-y-3 mt-0">
          <SectionCard id="title" title="Title" icon={Type} onReset={() => updateProps({ title: 'Limited Time Offer!' })}>
            <div>
              <Label className="text-xs font-medium text-foreground mb-2 block">Countdown Title</Label>
              <Input value={props.title || ''} onChange={(e) => updateProps({ title: e.target.value })} placeholder="Limited Time Offer!" />
            </div>
          </SectionCard>

          <SectionCard id="timer" title="Timer Configuration" icon={Clock} onReset={() => updateProps({ countdownType: 'fixed', endDate: '', evergreenDays: 0, evergreenHours: 24 })}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Countdown Type</Label>
                <Select value={props.countdownType || 'fixed'} onValueChange={(value) => updateProps({ countdownType: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Date/Time</SelectItem>
                    <SelectItem value="evergreen">Evergreen (Per Visitor)</SelectItem>
                    <SelectItem value="recurring">Recurring Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {props.countdownType === 'fixed' && (
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">End Date & Time</Label>
                  <Input type="datetime-local" value={props.endDate || ''} onChange={(e) => updateProps({ endDate: e.target.value })} />
                </div>
              )}

              {props.countdownType === 'evergreen' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-foreground mb-2 block">Days</Label>
                    <Input type="number" value={props.evergreenDays || 0} onChange={(e) => updateProps({ evergreenDays: parseInt(e.target.value) })} min={0} />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-foreground mb-2 block">Hours</Label>
                    <Input type="number" value={props.evergreenHours || 24} onChange={(e) => updateProps({ evergreenHours: parseInt(e.target.value) })} min={0} max={23} />
                  </div>
                </div>
              )}

              {props.countdownType === 'recurring' && (
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">Reset Time (Daily)</Label>
                  <Input type="time" value={props.recurringTime || '23:59'} onChange={(e) => updateProps({ recurringTime: e.target.value })} />
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard id="format" title="Display Format" icon={Sparkles} onReset={() => updateProps({ displayFormat: 'full', daysLabel: 'Days', hoursLabel: 'Hours', minutesLabel: 'Minutes', secondsLabel: 'Seconds' })}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Format Style</Label>
                <Select value={props.displayFormat || 'full'} onValueChange={(value) => updateProps({ displayFormat: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Days, Hours, Minutes, Seconds</SelectItem>
                    <SelectItem value="hours">Hours, Minutes, Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes, Seconds</SelectItem>
                    <SelectItem value="compact">Compact (00:00:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {props.displayFormat !== 'compact' && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-foreground">Unit Labels</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {props.displayFormat === 'full' && <Input value={props.daysLabel || 'Days'} onChange={(e) => updateProps({ daysLabel: e.target.value })} placeholder="Days" />}
                    <Input value={props.hoursLabel || 'Hours'} onChange={(e) => updateProps({ hoursLabel: e.target.value })} placeholder="Hours" />
                    <Input value={props.minutesLabel || 'Minutes'} onChange={(e) => updateProps({ minutesLabel: e.target.value })} placeholder="Minutes" />
                    <Input value={props.secondsLabel || 'Seconds'} onChange={(e) => updateProps({ secondsLabel: e.target.value })} placeholder="Seconds" />
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard id="expiration" title="Expiration" icon={Calendar} onReset={() => updateProps({ expiredMessage: 'Offer has ended!', redirectOnExpire: false, expireRedirectUrl: '' })}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Expired Message</Label>
                <Input value={props.expiredMessage || ''} onChange={(e) => updateProps({ expiredMessage: e.target.value })} placeholder="Offer has ended!" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Redirect on Expire</Label>
                  <p className="text-xs text-foreground">Redirect to URL when timer ends</p>
                </div>
                <Switch checked={props.redirectOnExpire || false} onCheckedChange={(checked) => updateProps({ redirectOnExpire: checked })} />
              </div>

              {props.redirectOnExpire && <Input value={props.expireRedirectUrl || ''} onChange={(e) => updateProps({ expireRedirectUrl: e.target.value })} placeholder="https://example.com/expired" />}
            </div>
          </SectionCard>
        </TabsContent>

        {/* DESIGN TAB */}
        <TabsContent value="design" className="p-4 space-y-3 mt-0">
          <SectionCard id="colors" title="Colors" icon={Palette} onReset={() => updateProps({ numberColor: '#000000', labelColor: '#666666', backgroundColor: '#f3f4f6' })}>
            <div className="space-y-3">
              <EnhancedColorPicker label="Number Color" value={props.numberColor || '#000000'} onChange={(color) => updateProps({ numberColor: color })} />
              <EnhancedColorPicker label="Label Color" value={props.labelColor || '#666666'} onChange={(color) => updateProps({ labelColor: color })} />
              <EnhancedColorPicker label="Background Color" value={props.backgroundColor || '#f3f4f6'} onChange={(color) => updateProps({ backgroundColor: color })} />
            </div>
          </SectionCard>

          <SectionCard id="typography" title="Typography" icon={Type} onReset={() => updateProps({ fontSize: 48, labelFontSize: 14, fontWeight: '700' })}>
            <div className="space-y-3">
              <EnhancedSlider label="Number Size" value={props.fontSize || 48} onChange={(val) => updateProps({ fontSize: val })} min={24} max={96} tooltip="Size of the countdown numbers" />
              <EnhancedSlider label="Label Size" value={props.labelFontSize || 14} onChange={(val) => updateProps({ labelFontSize: val })} min={10} max={24} tooltip="Size of the unit labels" />
              
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Font Weight</Label>
                <Select value={props.fontWeight || '700'} onValueChange={(value) => updateProps({ fontWeight: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="400">Normal (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semibold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                    <SelectItem value="800">Extra Bold (800)</SelectItem>
                    <SelectItem value="900">Black (900)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>

          <SectionCard id="spacing" title="Spacing" icon={Sparkles} onReset={() => updateProps({ paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, gap: 16 })}>
            <div className="space-y-3">
              <EnhancedSlider label="Top Padding" value={props.paddingTop || 20} onChange={(val) => updateProps({ paddingTop: val })} min={0} max={100} tooltip="Padding above the countdown" />
              <EnhancedSlider label="Bottom Padding" value={props.paddingBottom || 20} onChange={(val) => updateProps({ paddingBottom: val })} min={0} max={100} tooltip="Padding below the countdown" />
              <EnhancedSlider label="Left Padding" value={props.paddingLeft || 20} onChange={(val) => updateProps({ paddingLeft: val })} min={0} max={100} tooltip="Padding on the left side" />
              <EnhancedSlider label="Right Padding" value={props.paddingRight || 20} onChange={(val) => updateProps({ paddingRight: val })} min={0} max={100} tooltip="Padding on the right side" />
              <EnhancedSlider label="Gap Between Units" value={props.gap || 16} onChange={(val) => updateProps({ gap: val })} min={0} max={48} tooltip="Space between time units" />
            </div>
          </SectionCard>

          <SectionCard id="effects" title="Border & Effects" icon={Sparkles} onReset={() => updateProps({ borderRadius: 8, showSeparator: false })}>
            <div className="space-y-3">
              <EnhancedSlider label="Border Radius" value={props.borderRadius || 8} onChange={(val) => updateProps({ borderRadius: val })} min={0} max={32} tooltip="Roundness of the corners" />
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Show Separators</Label>
                  <p className="text-xs text-foreground">Display colons between units</p>
                </div>
                <Switch checked={props.showSeparator || false} onCheckedChange={(checked) => updateProps({ showSeparator: checked })} />
              </div>
            </div>
          </SectionCard>

          <SectionCard id="alignment" title="Alignment" icon={AlignCenter} onReset={() => updateProps({ align: 'center' })}>
            <div>
              <Label className="text-xs font-medium text-foreground mb-2 block">Countdown Alignment</Label>
              <div className="grid grid-cols-3 gap-2">
                {[{ value: 'left', icon: AlignLeft }, { value: 'center', icon: AlignCenter }, { value: 'right', icon: AlignRight }].map(({ value, icon: Icon }) => (
                  <button key={value} onClick={() => updateProps({ align: value })} className={cn("p-3 border rounded-lg hover:bg-accent transition-colors", props.align === value && "bg-primary/10 border-primary")}>
                    <Icon size={18} className="mx-auto" />
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* BEHAVIOR TAB */}
        <TabsContent value="behavior" className="p-4 space-y-3 mt-0">
          <SectionCard id="animation" title="Animation" icon={Zap} onReset={() => updateProps({ animateNumbers: true, pulseOnLowTime: false, lowTimeThreshold: 60 })}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Animate Numbers</Label>
                  <p className="text-xs text-foreground">Smooth number transitions</p>
                </div>
                <Switch checked={props.animateNumbers !== false} onCheckedChange={(checked) => updateProps({ animateNumbers: checked })} />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Pulse on Low Time</Label>
                  <p className="text-xs text-foreground">Add urgency when time is running out</p>
                </div>
                <Switch checked={props.pulseOnLowTime || false} onCheckedChange={(checked) => updateProps({ pulseOnLowTime: checked })} />
              </div>

              {props.pulseOnLowTime && (
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">Low Time Threshold (seconds)</Label>
                  <Input type="number" value={props.lowTimeThreshold || 60} onChange={(e) => updateProps({ lowTimeThreshold: parseInt(e.target.value) })} min={10} max={300} />
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard id="visibility" title="Visibility" icon={Clock} onReset={() => updateProps({ hideOnExpire: false, showOnMobile: true })}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Hide on Expire</Label>
                  <p className="text-xs text-foreground">Remove countdown when timer ends</p>
                </div>
                <Switch checked={props.hideOnExpire || false} onCheckedChange={(checked) => updateProps({ hideOnExpire: checked })} />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Show on Mobile</Label>
                  <p className="text-xs text-foreground">Display countdown on mobile devices</p>
                </div>
                <Switch checked={props.showOnMobile !== false} onCheckedChange={(checked) => updateProps({ showOnMobile: checked })} />
              </div>
            </div>
          </SectionCard>

          <SectionCard id="persistence" title="Persistence" icon={Timer} onReset={() => updateProps({ persistTimer: true, resetOnPageLoad: false })}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Persist Timer</Label>
                  <p className="text-xs text-foreground">Remember timer state across sessions</p>
                </div>
                <Switch checked={props.persistTimer !== false} onCheckedChange={(checked) => updateProps({ persistTimer: checked })} />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Reset on Page Load</Label>
                  <p className="text-xs text-foreground">Start timer fresh on each visit</p>
                </div>
                <Switch checked={props.resetOnPageLoad || false} onCheckedChange={(checked) => updateProps({ resetOnPageLoad: checked })} />
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
