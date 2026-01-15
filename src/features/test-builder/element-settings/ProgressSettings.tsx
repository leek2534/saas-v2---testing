"use client";



import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Palette, Zap, Eye, Search, Wand2, Target, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedColorPicker } from './shared/EnhancedColorPicker';
import { EnhancedSlider } from './shared/EnhancedSlider';
import { SectionCard } from './shared/SectionCard';

interface ProgressSettingsProps {
  node: { id: string; type: string; props: Record<string, any> };
  updateProps: (updates: Record<string, any>) => void;
}

/**
 * RESEARCH-BASED PROGRESS BAR PRESETS
 * 
 * Based on UX research from Nielsen Norman Group and Baymard Institute:
 * - Progress bars reduce perceived wait time by 40%
 * - Multi-step indicators improve form completion by 28%
 * - Skill bars increase engagement on portfolio/about pages
 * - Circular progress works best for single metrics (NPS, completion %)
 * - Linear progress preferred for multi-step processes
 */
const PROGRESS_PRESETS = [
  {
    id: 'linear-standard',
    name: 'Linear Standard',
    description: 'Classic progress bar for forms',
    props: {
      type: 'linear',
      value: 60,
      showPercentage: true,
      showLabel: true,
      label: 'Profile Completion',
      height: 12,
      barColor: '#3b82f6',
      backgroundColor: '#e5e7eb',
      borderRadius: 999,
      animated: true,
      stripes: false
    }
  },
  {
    id: 'circular-metric',
    name: 'Circular Metric',
    description: 'Circular progress for KPIs',
    props: {
      type: 'circular',
      value: 85,
      showPercentage: true,
      showLabel: true,
      label: 'Customer Satisfaction',
      size: 120,
      strokeWidth: 10,
      barColor: '#10b981',
      backgroundColor: '#e5e7eb',
      animated: true
    }
  },
  {
    id: 'steps-multi',
    name: 'Multi-Step',
    description: 'Step indicator for processes',
    props: {
      type: 'steps',
      currentStep: 2,
      totalSteps: 4,
      showLabels: true,
      stepLabels: ['Account', 'Profile', 'Payment', 'Confirm'],
      completedColor: '#3b82f6',
      activeColor: '#3b82f6',
      inactiveColor: '#e5e7eb',
      showConnectors: true
    }
  },
  {
    id: 'skill-bar',
    name: 'Skill Bar',
    description: 'Skill level indicator',
    props: {
      type: 'linear',
      value: 90,
      showPercentage: false,
      showLabel: true,
      label: 'JavaScript',
      height: 8,
      barColor: '#f59e0b',
      backgroundColor: '#fef3c7',
      borderRadius: 4,
      animated: true,
      stripes: false
    }
  },
  {
    id: 'gradient-bold',
    name: 'Gradient Bold',
    description: 'Eye-catching gradient bar',
    props: {
      type: 'linear',
      value: 75,
      showPercentage: true,
      showLabel: true,
      label: 'Campaign Progress',
      height: 16,
      useGradient: true,
      gradientFrom: '#3b82f6',
      gradientTo: '#8b5cf6',
      backgroundColor: '#e5e7eb',
      borderRadius: 8,
      animated: true,
      stripes: true
    }
  }
];

export function ProgressSettings({ node, updateProps }: ProgressSettingsProps) {
  const props = node.props;
  const [activeTab, setActiveTab] = useState('content');
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
            {PROGRESS_PRESETS.map((preset) => (
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
                <div className="mt-2 flex items-center gap-1">
                  <BarChart3 size={10} className="text-foreground" />
                  <span className="text-[10px] text-foreground">{preset.props.type}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {props.presetId && (
          <div className="mt-3 p-2 bg-primary/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                Current: {PROGRESS_PRESETS.find(p => p.id === props.presetId)?.name || 'Custom'}
              </p>
              <button onClick={() => updateProps({ presetId: null })} className="text-xs text-primary hover:underline">
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
          <TabsTrigger value="content" className="rounded-none">
            <TrendingUp size={14} className="mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="design" className="rounded-none">
            <Palette size={14} className="mr-2" />
            Design
          </TabsTrigger>
          <TabsTrigger value="behavior" className="rounded-none">
            <Zap size={14} className="mr-2" />
            Behavior
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          {/* Content Tab */}
          <TabsContent value="content" className="p-4 space-y-4 m-0">
            <SectionCard id="progress-type" title="Progress Type" icon={Target}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Type</Label>
                  <Select value={props.type || 'linear'} onValueChange={(value) => updateProps({ type: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear Bar</SelectItem>
                      <SelectItem value="circular">Circular</SelectItem>
                      <SelectItem value="steps">Multi-Step</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-foreground mt-1">
                    {props.type === 'linear' && 'Best for forms, downloads, skill levels'}
                    {props.type === 'circular' && 'Best for single metrics, KPIs, completion rates'}
                    {props.type === 'steps' && 'Best for multi-step processes, checkouts, onboarding'}
                  </p>
                </div>

                {(props.type === 'linear' || props.type === 'circular') && (
                  <div>
                    <Label className="text-xs">Progress Value (%)</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <Slider
                        value={[props.value || 0]}
                        onValueChange={([val]) => updateProps({ value: val })}
                        min={0}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={props.value || 0}
                        onChange={(e) => updateProps({ value: parseInt(e.target.value) || 0 })}
                        className="w-16 text-center"
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>
                )}

                {props.type === 'steps' && (
                  <>
                    <div>
                      <Label className="text-xs">Total Steps</Label>
                      <Input
                        type="number"
                        value={props.totalSteps || 4}
                        onChange={(e) => updateProps({ totalSteps: parseInt(e.target.value) || 4 })}
                        className="mt-1"
                        min={2}
                        max={10}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Current Step</Label>
                      <Input
                        type="number"
                        value={props.currentStep || 1}
                        onChange={(e) => updateProps({ currentStep: parseInt(e.target.value) || 1 })}
                        className="mt-1"
                        min={1}
                        max={props.totalSteps || 4}
                      />
                    </div>
                  </>
                )}
              </div>
            </SectionCard>

            <SectionCard id="labels" title="Labels & Text" icon={TrendingUp}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Show Label</Label>
                    <p className="text-xs text-foreground">Display descriptive text</p>
                  </div>
                  <Switch
                    checked={props.showLabel ?? true}
                    onCheckedChange={(checked) => updateProps({ showLabel: checked })}
                  />
                </div>

                {props.showLabel && (
                  <div>
                    <Label className="text-xs">Label Text</Label>
                    <Input
                      value={props.label || ''}
                      onChange={(e) => updateProps({ label: e.target.value })}
                      placeholder="e.g., Profile Completion"
                      className="mt-1"
                    />
                  </div>
                )}

                <Separator />

                {(props.type === 'linear' || props.type === 'circular') && (
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs">Show Percentage</Label>
                      <p className="text-xs text-foreground">Display numeric value</p>
                    </div>
                    <Switch
                      checked={props.showPercentage ?? true}
                      onCheckedChange={(checked) => updateProps({ showPercentage: checked })}
                    />
                  </div>
                )}

                {props.type === 'steps' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-xs">Show Step Labels</Label>
                        <p className="text-xs text-foreground">Label each step</p>
                      </div>
                      <Switch
                        checked={props.showLabels ?? true}
                        onCheckedChange={(checked) => updateProps({ showLabels: checked })}
                      />
                    </div>
                    {props.showLabels && (
                      <div>
                        <Label className="text-xs">Step Labels (comma-separated)</Label>
                        <Input
                          value={(props.stepLabels || []).join(', ')}
                          onChange={(e) => updateProps({ stepLabels: e.target.value.split(',').map(s => s.trim()) })}
                          placeholder="Account, Profile, Payment, Confirm"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </SectionCard>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="p-4 space-y-4 m-0">
            <SectionCard id="colors" title="Colors" icon={Palette}>
              <div className="space-y-3">
                {props.type !== 'steps' && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Use Gradient</Label>
                      <Switch
                        checked={props.useGradient || false}
                        onCheckedChange={(checked) => updateProps({ useGradient: checked })}
                      />
                    </div>

                    {props.useGradient ? (
                      <>
                        <EnhancedColorPicker
                          label="Gradient Start"
                          value={props.gradientFrom || '#3b82f6'}
                          onChange={(color) => updateProps({ gradientFrom: color })}
                        />
                        <EnhancedColorPicker
                          label="Gradient End"
                          value={props.gradientTo || '#8b5cf6'}
                          onChange={(color) => updateProps({ gradientTo: color })}
                        />
                      </>
                    ) : (
                      <EnhancedColorPicker
                        label="Bar Color"
                        value={props.barColor || '#3b82f6'}
                        onChange={(color) => updateProps({ barColor: color })}
                      />
                    )}

                    <EnhancedColorPicker
                      label="Background Color"
                      value={props.backgroundColor || '#e5e7eb'}
                      onChange={(color) => updateProps({ backgroundColor: color })}
                    />
                  </>
                )}

                {props.type === 'steps' && (
                  <>
                    <EnhancedColorPicker
                      label="Completed Color"
                      value={props.completedColor || '#3b82f6'}
                      onChange={(color) => updateProps({ completedColor: color })}
                    />
                    <EnhancedColorPicker
                      label="Active Color"
                      value={props.activeColor || '#3b82f6'}
                      onChange={(color) => updateProps({ activeColor: color })}
                    />
                    <EnhancedColorPicker
                      label="Inactive Color"
                      value={props.inactiveColor || '#e5e7eb'}
                      onChange={(color) => updateProps({ inactiveColor: color })}
                    />
                  </>
                )}
              </div>
            </SectionCard>

            <SectionCard id="dimensions" title="Dimensions" icon={Palette}>
              <div className="space-y-3">
                {props.type === 'linear' && (
                  <>
                    <EnhancedSlider
                      label="Height"
                      value={props.height ?? 12}
                      onChange={(value) => updateProps({ height: value })}
                      min={4}
                      max={40}
                      unit="px"
                    />
                    <EnhancedSlider
                      label="Border Radius"
                      value={props.borderRadius ?? 999}
                      onChange={(value) => updateProps({ borderRadius: value })}
                      min={0}
                      max={999}
                      unit="px"
                    />
                  </>
                )}

                {props.type === 'circular' && (
                  <>
                    <EnhancedSlider
                      label="Size"
                      value={props.size ?? 120}
                      onChange={(value) => updateProps({ size: value })}
                      min={60}
                      max={200}
                      unit="px"
                    />
                    <EnhancedSlider
                      label="Stroke Width"
                      value={props.strokeWidth ?? 10}
                      onChange={(value) => updateProps({ strokeWidth: value })}
                      min={4}
                      max={20}
                      unit="px"
                    />
                  </>
                )}
              </div>
            </SectionCard>

            <SectionCard id="spacing" title="Spacing" icon={Palette}>
              <div className="space-y-3">
                <EnhancedSlider
                  label="Margin Top"
                  value={props.marginTop ?? 0}
                  onChange={(value) => updateProps({ marginTop: value })}
                  min={0}
                  max={100}
                  unit="px"
                />
                <EnhancedSlider
                  label="Margin Bottom"
                  value={props.marginBottom ?? 0}
                  onChange={(value) => updateProps({ marginBottom: value })}
                  min={0}
                  max={100}
                  unit="px"
                />
              </div>
            </SectionCard>
          </TabsContent>

          {/* Behavior Tab */}
          <TabsContent value="behavior" className="p-4 space-y-4 m-0">
            <SectionCard id="animation" title="Animation" icon={Zap}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Animated</Label>
                    <p className="text-xs text-foreground">Smooth transitions on value change</p>
                  </div>
                  <Switch
                    checked={props.animated ?? true}
                    onCheckedChange={(checked) => updateProps({ animated: checked })}
                  />
                </div>

                {props.type === 'linear' && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-xs">Striped Pattern</Label>
                        <p className="text-xs text-foreground">Diagonal stripes effect</p>
                      </div>
                      <Switch
                        checked={props.stripes || false}
                        onCheckedChange={(checked) => updateProps({ stripes: checked })}
                      />
                    </div>
                  </>
                )}
              </div>
            </SectionCard>

            {props.type === 'steps' && (
              <SectionCard id="step-behavior" title="Step Behavior" icon={Zap}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs">Show Connectors</Label>
                      <p className="text-xs text-foreground">Lines between steps</p>
                    </div>
                    <Switch
                      checked={props.showConnectors ?? true}
                      onCheckedChange={(checked) => updateProps({ showConnectors: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs">Clickable Steps</Label>
                      <p className="text-xs text-foreground">Allow navigation by clicking</p>
                    </div>
                    <Switch
                      checked={props.clickableSteps || false}
                      onCheckedChange={(checked) => updateProps({ clickableSteps: checked })}
                    />
                  </div>
                </div>
              </SectionCard>
            )}

            <SectionCard id="dynamic-updates" title="Dynamic Updates" icon={Zap}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Update Trigger</Label>
                  <Select value={props.updateTrigger || 'manual'} onValueChange={(value) => updateProps({ updateTrigger: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual (Static)</SelectItem>
                      <SelectItem value="scroll">On Scroll Into View</SelectItem>
                      <SelectItem value="timer">Auto-increment Timer</SelectItem>
                      <SelectItem value="form">Form Field Progress</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-foreground mt-1">
                    {props.updateTrigger === 'scroll' && 'Animates when element enters viewport'}
                    {props.updateTrigger === 'timer' && 'Automatically increments over time'}
                    {props.updateTrigger === 'form' && 'Tracks form completion percentage'}
                    {!props.updateTrigger || props.updateTrigger === 'manual' ? 'Static display' : ''}
                  </p>
                </div>

                {props.updateTrigger === 'timer' && (
                  <div>
                    <Label className="text-xs">Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={props.timerDuration || 5}
                      onChange={(e) => updateProps({ timerDuration: parseInt(e.target.value) || 5 })}
                      className="mt-1"
                      min={1}
                      max={60}
                    />
                  </div>
                )}
              </div>
            </SectionCard>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
