"use client";



import React, { useState } from 'react';
import { ElementNode } from '@/lib/store/test-builder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Check, Star, Search, Wand2, Palette, Zap, Sparkles, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedColorPicker } from './shared/EnhancedColorPicker';
import { EnhancedSlider } from './shared/EnhancedSlider';
import { SectionCard } from './shared/SectionCard';

interface PricingSettingsProps {
  node: ElementNode;
  updateProps: (updates: any) => void;
}

// Pricing Table Presets
const PRICING_PRESETS = [
  {
    id: 'saas-standard',
    name: 'SaaS Standard',
    description: '3-tier pricing with popular badge',
    category: 'saas',
    props: {
      planName: 'Professional',
      price: '49',
      currency: '$',
      period: 'month',
      showBadge: true,
      badge: 'MOST POPULAR',
      badgeColor: '#3b82f6',
      features: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom integrations', 'Team collaboration'],
      ctaText: 'Get Started',
      ctaColor: '#3b82f6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderColor: '#3b82f6',
      borderWidth: 2,
      borderRadius: 12,
      paddingTop: 32,
      paddingBottom: 32,
      paddingLeft: 32,
      paddingRight: 32,
      showAnnualSavings: false,
      highlighted: true
    }
  },
  {
    id: 'agency-premium',
    name: 'Agency Premium',
    description: 'Dark theme with premium feel',
    category: 'agency',
    props: {
      planName: 'Enterprise',
      price: '199',
      currency: '$',
      period: 'month',
      showBadge: true,
      badge: 'BEST VALUE',
      badgeColor: '#8b5cf6',
      features: ['Everything in Pro', 'Dedicated account manager', 'Custom development', 'SLA guarantee', 'White-label options'],
      ctaText: 'Contact Sales',
      ctaColor: '#8b5cf6',
      backgroundColor: '#1f2937',
      textColor: '#ffffff',
      borderColor: '#8b5cf6',
      borderWidth: 2,
      borderRadius: 16,
      paddingTop: 40,
      paddingBottom: 40,
      paddingLeft: 40,
      paddingRight: 40,
      showAnnualSavings: true,
      annualSavings: '20%',
      highlighted: true
    }
  },
  {
    id: 'startup-basic',
    name: 'Startup Basic',
    description: 'Clean, minimal pricing card',
    category: 'startup',
    props: {
      planName: 'Starter',
      price: '19',
      currency: '$',
      period: 'month',
      showBadge: false,
      features: ['5 projects', 'Email support', 'Basic analytics', '1 team member'],
      ctaText: 'Start Free Trial',
      ctaColor: '#10b981',
      backgroundColor: '#ffffff',
      textColor: '#374151',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      borderRadius: 8,
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: 24,
      paddingRight: 24,
      showAnnualSavings: false,
      highlighted: false
    }
  },
  {
    id: 'ecommerce-featured',
    name: 'E-commerce Featured',
    description: 'Bold design with savings highlight',
    category: 'ecommerce',
    props: {
      planName: 'Business',
      price: '99',
      currency: '$',
      period: 'month',
      showBadge: true,
      badge: 'SAVE 30%',
      badgeColor: '#ef4444',
      features: ['Unlimited products', 'Advanced shipping', 'Marketing automation', 'Priority support', 'Custom domain'],
      ctaText: 'Start Selling',
      ctaColor: '#ef4444',
      backgroundColor: '#fef2f2',
      textColor: '#1f2937',
      borderColor: '#ef4444',
      borderWidth: 3,
      borderRadius: 12,
      paddingTop: 32,
      paddingBottom: 32,
      paddingLeft: 32,
      paddingRight: 32,
      showAnnualSavings: true,
      annualSavings: '30%',
      highlighted: true
    }
  },
  {
    id: 'minimal-compact',
    name: 'Minimal Compact',
    description: 'Space-saving simple design',
    category: 'minimal',
    props: {
      planName: 'Basic',
      price: '9',
      currency: '$',
      period: 'month',
      showBadge: false,
      features: ['Core features', 'Email support', 'Basic reporting'],
      ctaText: 'Choose Plan',
      ctaColor: '#6b7280',
      backgroundColor: '#f9fafb',
      textColor: '#374151',
      borderColor: '#d1d5db',
      borderWidth: 1,
      borderRadius: 6,
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      paddingRight: 20,
      showAnnualSavings: false,
      highlighted: false
    }
  }
];

export function PricingSettings({ node, updateProps }: PricingSettingsProps) {
  const props = node.props;
  const [activeTab, setActiveTab] = useState('content');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  // Set default values on mount
  React.useEffect(() => {
    const defaults: any = {};
    if (!props.planName) defaults.planName = 'Professional';
    if (!props.price) defaults.price = '49';
    if (!props.currency) defaults.currency = '$';
    if (!props.period) defaults.period = 'month';
    if (!props.ctaText) defaults.ctaText = 'Get Started';
    if (!props.ctaColor) defaults.ctaColor = '#3b82f6';
    if (!props.backgroundColor) defaults.backgroundColor = '#ffffff';
    if (!props.textColor) defaults.textColor = '#1f2937';
    if (!props.borderColor) defaults.borderColor = '#3b82f6';
    if (!props.borderWidth) defaults.borderWidth = 2;
    if (!props.borderRadius) defaults.borderRadius = 12;
    if (props.paddingTop === undefined) defaults.paddingTop = 32;
    if (props.paddingBottom === undefined) defaults.paddingBottom = 32;
    if (props.paddingLeft === undefined) defaults.paddingLeft = 32;
    if (props.paddingRight === undefined) defaults.paddingRight = 32;
    if (!props.features) defaults.features = ['Feature 1', 'Feature 2', 'Feature 3'];
    
    if (Object.keys(defaults).length > 0) {
      updateProps(defaults);
    }
  }, []);

  const features = props.features || ['Feature 1', 'Feature 2', 'Feature 3'];

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
          <div className="grid grid-cols-2 gap-2 mt-3">
            {PRICING_PRESETS.map((preset) => (
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
                  <DollarSign size={12} className="text-foreground" />
                </div>
              </button>
            ))}
          </div>
        )}

        {props.presetId && (
          <div className="mt-3 p-2 bg-primary/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                  Current: {PRICING_PRESETS.find(p => p.id === props.presetId)?.name || 'Custom'}
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
            <DollarSign size={14} className="mr-2" />Content
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
          <SectionCard id="plan" title="Plan Details" icon={DollarSign} onReset={() => updateProps({ planName: 'Professional', price: '49', currency: '$', period: 'month' })}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Plan Name</Label>
                <Input value={props.planName || ''} onChange={(e) => updateProps({ planName: e.target.value })} placeholder="Professional" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">Price</Label>
                  <Input value={props.price || ''} onChange={(e) => updateProps({ price: e.target.value })} placeholder="49" />
                </div>
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">Currency</Label>
                  <Select value={props.currency || '$'} onValueChange={(value) => updateProps({ currency: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">$ USD</SelectItem>
                      <SelectItem value="€">€ EUR</SelectItem>
                      <SelectItem value="£">£ GBP</SelectItem>
                      <SelectItem value="¥">¥ JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Billing Period</Label>
                <Select value={props.period || 'month'} onValueChange={(value) => updateProps({ period: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>

          <SectionCard id="badge" title="Badge" icon={Award} onReset={() => updateProps({ showBadge: false, badge: '', badgeColor: '#3b82f6' })}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Show Badge</Label>
                  <p className="text-xs text-foreground">Display badge label</p>
                </div>
                <Switch checked={props.showBadge || false} onCheckedChange={(checked) => updateProps({ showBadge: checked })} />
              </div>

              {props.showBadge && (
                <>
                  <div>
                    <Label className="text-xs font-medium text-foreground mb-2 block">Badge Text</Label>
                    <Input value={props.badge || ''} onChange={(e) => updateProps({ badge: e.target.value })} placeholder="MOST POPULAR" />
                  </div>
                  <EnhancedColorPicker label="Badge Color" value={props.badgeColor || '#3b82f6'} onChange={(color) => updateProps({ badgeColor: color })} />
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard id="features" title="Features" icon={Check} onReset={() => updateProps({ features: ['Feature 1', 'Feature 2', 'Feature 3'] })}>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">Features List (one per line)</Label>
              <Textarea
                value={features.join('\n')}
                onChange={(e) => updateProps({ features: e.target.value.split('\n').filter(f => f.trim()) })}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={6}
              />
            </div>
          </SectionCard>

          <SectionCard id="cta" title="Call to Action" icon={Sparkles} onReset={() => updateProps({ ctaText: 'Get Started', ctaColor: '#3b82f6' })}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Button Text</Label>
                <Input value={props.ctaText || ''} onChange={(e) => updateProps({ ctaText: e.target.value })} placeholder="Get Started" />
              </div>
              <EnhancedColorPicker label="Button Color" value={props.ctaColor || '#3b82f6'} onChange={(color) => updateProps({ ctaColor: color })} />
            </div>
          </SectionCard>
        </TabsContent>

        {/* DESIGN TAB */}
        <TabsContent value="design" className="p-4 space-y-3 mt-0">
          <SectionCard id="colors" title="Colors" icon={Palette} onReset={() => updateProps({ backgroundColor: '#ffffff', textColor: '#1f2937', borderColor: '#3b82f6' })}>
            <div className="space-y-3">
              <EnhancedColorPicker label="Background Color" value={props.backgroundColor || '#ffffff'} onChange={(color) => updateProps({ backgroundColor: color })} />
              <EnhancedColorPicker label="Text Color" value={props.textColor || '#1f2937'} onChange={(color) => updateProps({ textColor: color })} />
              <EnhancedColorPicker label="Border Color" value={props.borderColor || '#3b82f6'} onChange={(color) => updateProps({ borderColor: color })} />
            </div>
          </SectionCard>

          <SectionCard id="border" title="Border" icon={Sparkles} onReset={() => updateProps({ borderWidth: 2, borderRadius: 12 })}>
            <div className="space-y-3">
              <EnhancedSlider label="Border Width" value={props.borderWidth || 2} onChange={(val) => updateProps({ borderWidth: val })} min={0} max={8} />
              <EnhancedSlider label="Border Radius" value={props.borderRadius || 12} onChange={(val) => updateProps({ borderRadius: val })} min={0} max={32} />
            </div>
          </SectionCard>

          <SectionCard id="spacing" title="Spacing" icon={Sparkles} onReset={() => updateProps({ paddingTop: 32, paddingBottom: 32, paddingLeft: 32, paddingRight: 32 })}>
            <div className="space-y-3">
              <EnhancedSlider label="Top Padding" value={props.paddingTop || 32} onChange={(val) => updateProps({ paddingTop: val })} min={0} max={100} />
              <EnhancedSlider label="Bottom Padding" value={props.paddingBottom || 32} onChange={(val) => updateProps({ paddingBottom: val })} min={0} max={100} />
              <EnhancedSlider label="Left Padding" value={props.paddingLeft || 32} onChange={(val) => updateProps({ paddingLeft: val })} min={0} max={100} />
              <EnhancedSlider label="Right Padding" value={props.paddingRight || 32} onChange={(val) => updateProps({ paddingRight: val })} min={0} max={100} />
            </div>
          </SectionCard>
        </TabsContent>

        {/* BEHAVIOR TAB */}
        <TabsContent value="behavior" className="p-4 space-y-3 mt-0">
          <SectionCard id="savings" title="Annual Savings" icon={Star} onReset={() => updateProps({ showAnnualSavings: false, annualSavings: '20%' })}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Show Annual Savings</Label>
                  <p className="text-xs text-foreground">Display savings message</p>
                </div>
                <Switch checked={props.showAnnualSavings || false} onCheckedChange={(checked) => updateProps({ showAnnualSavings: checked })} />
              </div>

              {props.showAnnualSavings && (
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">Savings Percentage</Label>
                  <Input value={props.annualSavings || ''} onChange={(e) => updateProps({ annualSavings: e.target.value })} placeholder="20%" />
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard id="highlight" title="Highlight" icon={Sparkles} onReset={() => updateProps({ highlighted: false })}>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <Label className="text-xs text-foreground">Highlighted Plan</Label>
                <p className="text-xs text-foreground">Make this plan stand out</p>
              </div>
              <Switch checked={props.highlighted || false} onCheckedChange={(checked) => updateProps({ highlighted: checked })} />
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
