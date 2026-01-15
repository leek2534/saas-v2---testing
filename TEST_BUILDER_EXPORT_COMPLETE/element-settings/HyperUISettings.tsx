'use client';

import React from 'react';
import { Element } from '../store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Sparkles, Check } from 'lucide-react';
import {
  ANNOUNCEMENT_PRESETS,
  CONTACT_FORM_PRESETS,
  CTA_BLOCK_PRESETS,
  NEWSLETTER_PRESETS,
  HEADER_BLOCK_PRESETS,
  FEATURE_GRID_PRESETS,
  BUTTON_GROUP_PRESETS,
  LOGO_CLOUD_PRESETS,
  BANNER_PRESETS,
  POLL_PRESETS,
  TEAM_SECTION_PRESETS,
  STEPS_PRESETS,
  PRODUCT_COLLECTION_PRESETS,
} from '../elements/hyperui';

interface SettingsPanelProps {
  element: Element;
  onUpdate: (props: Record<string, any>) => void;
}

function PresetSelector({ 
  presets, 
  currentPreset,
  onSelect 
}: { 
  presets: Record<string, any>;
  currentPreset?: string;
  onSelect: (presetKey: string, presetValues: any) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-500" />
        Presets
      </Label>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(presets).map(([key, values]) => (
          <button
            key={key}
            onClick={() => onSelect(key, values)}
            className={cn(
              "px-3 py-2 text-xs font-medium rounded-lg border transition-all text-left",
              currentPreset === key
                ? "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}
          >
            <div className="flex items-center gap-1">
              {currentPreset === key && <Check className="w-3 h-3" />}
              <span className="capitalize">{key.replace(/-/g, ' ')}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-gray-200" />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 font-mono text-xs" />
      </div>
    </div>
  );
}

export function AnnouncementSettings({ element, onUpdate }: SettingsPanelProps) {
  const props = element.props;
  return (
    <div className="space-y-4 p-4">
      <PresetSelector presets={ANNOUNCEMENT_PRESETS} currentPreset={props.preset} onSelect={(key, values) => onUpdate({ ...values, preset: key })} />
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select value={props.variant || 'base'} onValueChange={(v) => onUpdate({ variant: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="base">Base</SelectItem>
            <SelectItem value="base-dark">Base Dark</SelectItem>
            <SelectItem value="dismissible">Dismissible</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="floating">Floating</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Text</Label>
        <Textarea value={props.text || ''} onChange={(e) => onUpdate({ text: e.target.value })} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Link Text</Label><Input value={props.linkText || ''} onChange={(e) => onUpdate({ linkText: e.target.value })} /></div>
        <div className="space-y-2"><Label>Link URL</Label><Input value={props.linkUrl || ''} onChange={(e) => onUpdate({ linkUrl: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ColorInput label="Background" value={props.backgroundColor || '#3b82f6'} onChange={(v) => onUpdate({ backgroundColor: v })} />
        <ColorInput label="Text Color" value={props.textColor || '#ffffff'} onChange={(v) => onUpdate({ textColor: v })} />
      </div>
      <div className="flex items-center justify-between"><Label>Show Icon</Label><Switch checked={props.showIcon ?? true} onCheckedChange={(v) => onUpdate({ showIcon: v })} /></div>
      <div className="flex items-center justify-between"><Label>Dismissible</Label><Switch checked={props.dismissible ?? false} onCheckedChange={(v) => onUpdate({ dismissible: v })} /></div>
    </div>
  );
}

export function ContactFormSettings({ element, onUpdate }: SettingsPanelProps) {
  const props = element.props;
  return (
    <div className="space-y-4 p-4">
      <PresetSelector presets={CONTACT_FORM_PRESETS} currentPreset={props.preset} onSelect={(key, values) => onUpdate({ ...values, preset: key })} />
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select value={props.variant || 'simple'} onValueChange={(v) => onUpdate({ variant: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="with-info">With Info</SelectItem>
            <SelectItem value="split">Split</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Title</Label><Input value={props.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} /></div>
      <div className="space-y-2"><Label>Subtitle</Label><Textarea value={props.subtitle || ''} onChange={(e) => onUpdate({ subtitle: e.target.value })} rows={2} /></div>
      <div className="space-y-2"><Label>Button Text</Label><Input value={props.buttonText || 'Send Message'} onChange={(e) => onUpdate({ buttonText: e.target.value })} /></div>
      <ColorInput label="Button Color" value={props.buttonColor || '#3b82f6'} onChange={(v) => onUpdate({ buttonColor: v })} />
      <ColorInput label="Background" value={props.backgroundColor || '#ffffff'} onChange={(v) => onUpdate({ backgroundColor: v })} />
    </div>
  );
}

export function CTABlockSettings({ element, onUpdate }: SettingsPanelProps) {
  const props = element.props;
  return (
    <div className="space-y-4 p-4">
      <PresetSelector presets={CTA_BLOCK_PRESETS} currentPreset={props.preset} onSelect={(key, values) => onUpdate({ ...values, preset: key })} />
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select value={props.variant || 'centered'} onValueChange={(v) => onUpdate({ variant: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="centered">Centered</SelectItem>
            <SelectItem value="split">Split</SelectItem>
            <SelectItem value="with-image">With Image</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Title</Label><Input value={props.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} /></div>
      <div className="space-y-2"><Label>Subtitle</Label><Textarea value={props.subtitle || ''} onChange={(e) => onUpdate({ subtitle: e.target.value })} rows={2} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Primary Button</Label><Input value={props.primaryButtonText || 'Get Started'} onChange={(e) => onUpdate({ primaryButtonText: e.target.value })} /></div>
        <div className="space-y-2"><Label>Secondary Button</Label><Input value={props.secondaryButtonText || ''} onChange={(e) => onUpdate({ secondaryButtonText: e.target.value })} placeholder="Optional" /></div>
      </div>
      <ColorInput label="Primary Button Color" value={props.primaryButtonColor || '#3b82f6'} onChange={(v) => onUpdate({ primaryButtonColor: v })} />
      {props.variant === 'gradient' && (
        <div className="grid grid-cols-2 gap-4">
          <ColorInput label="Gradient From" value={props.gradientFrom || '#667eea'} onChange={(v) => onUpdate({ gradientFrom: v })} />
          <ColorInput label="Gradient To" value={props.gradientTo || '#764ba2'} onChange={(v) => onUpdate({ gradientTo: v })} />
        </div>
      )}
    </div>
  );
}

export function NewsletterSettings({ element, onUpdate }: SettingsPanelProps) {
  const props = element.props;
  return (
    <div className="space-y-4 p-4">
      <PresetSelector presets={NEWSLETTER_PRESETS} currentPreset={props.preset} onSelect={(key, values) => onUpdate({ ...values, preset: key })} />
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select value={props.variant || 'simple'} onValueChange={(v) => onUpdate({ variant: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="with-benefits">With Benefits</SelectItem>
            <SelectItem value="inline">Inline</SelectItem>
            <SelectItem value="card">Card</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Title</Label><Input value={props.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} /></div>
      <div className="space-y-2"><Label>Subtitle</Label><Textarea value={props.subtitle || ''} onChange={(e) => onUpdate({ subtitle: e.target.value })} rows={2} /></div>
      <div className="space-y-2"><Label>Button Text</Label><Input value={props.buttonText || 'Subscribe'} onChange={(e) => onUpdate({ buttonText: e.target.value })} /></div>
      <ColorInput label="Button Color" value={props.buttonColor || '#3b82f6'} onChange={(v) => onUpdate({ buttonColor: v })} />
      <ColorInput label="Background" value={props.backgroundColor || '#f9fafb'} onChange={(v) => onUpdate({ backgroundColor: v })} />
    </div>
  );
}

export function HeaderBlockSettings({ element, onUpdate }: SettingsPanelProps) {
  const props = element.props;
  return (
    <div className="space-y-4 p-4">
      <PresetSelector presets={HEADER_BLOCK_PRESETS} currentPreset={props.preset} onSelect={(key, values) => onUpdate({ ...values, preset: key })} />
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select value={props.variant || 'centered'} onValueChange={(v) => onUpdate({ variant: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="centered">Centered</SelectItem>
            <SelectItem value="left-aligned">Left Aligned</SelectItem>
            <SelectItem value="with-eyebrow">With Eyebrow</SelectItem>
            <SelectItem value="with-badge">With Badge</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Title</Label><Input value={props.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} /></div>
      <div className="space-y-2"><Label>Subtitle</Label><Textarea value={props.subtitle || ''} onChange={(e) => onUpdate({ subtitle: e.target.value })} rows={2} /></div>
      <div className="space-y-2"><Label>Eyebrow</Label><Input value={props.eyebrow || ''} onChange={(e) => onUpdate({ eyebrow: e.target.value })} placeholder="Optional" /></div>
      <div className="space-y-2"><Label>Badge</Label><Input value={props.badge || ''} onChange={(e) => onUpdate({ badge: e.target.value })} placeholder="Optional" /></div>
      <div className="grid grid-cols-2 gap-4">
        <ColorInput label="Title Color" value={props.titleColor || '#1f2937'} onChange={(v) => onUpdate({ titleColor: v })} />
        <ColorInput label="Subtitle Color" value={props.subtitleColor || '#6b7280'} onChange={(v) => onUpdate({ subtitleColor: v })} />
      </div>
    </div>
  );
}

export function FeatureGridSettings({ element, onUpdate }: SettingsPanelProps) {
  const props = element.props;
  return (
    <div className="space-y-4 p-4">
      <PresetSelector presets={FEATURE_GRID_PRESETS} currentPreset={props.preset} onSelect={(key, values) => onUpdate({ ...values, preset: key })} />
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select value={props.variant || '3-column'} onValueChange={(v) => onUpdate({ variant: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="3-column">3 Column</SelectItem>
            <SelectItem value="2-column">2 Column</SelectItem>
            <SelectItem value="4-column">4 Column</SelectItem>
            <SelectItem value="with-icons">With Icons</SelectItem>
            <SelectItem value="cards">Cards</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ColorInput label="Background" value={props.backgroundColor || '#ffffff'} onChange={(v) => onUpdate({ backgroundColor: v })} />
      <ColorInput label="Icon Color" value={props.iconColor || '#3b82f6'} onChange={(v) => onUpdate({ iconColor: v })} />
    </div>
  );
}

export function ButtonGroupSettings({ element, onUpdate }: SettingsPanelProps) {
  const props = element.props;
  return (
    <div className="space-y-4 p-4">
      <PresetSelector presets={BUTTON_GROUP_PRESETS} currentPreset={props.preset} onSelect={(key, values) => onUpdate({ ...values, preset: key })} />
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select value={props.variant || 'horizontal'} onValueChange={(v) => onUpdate({ variant: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">Horizontal</SelectItem>
            <SelectItem value="vertical">Vertical</SelectItem>
            <SelectItem value="stacked">Stacked</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Alignment</Label>
        <Select value={props.alignment || 'center'} onValueChange={(v) => onUpdate({ alignment: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Size</Label>
        <Select value={props.size || 'md'} onValueChange={(v) => onUpdate({ size: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ColorInput label="Primary Color" value={props.primaryColor || '#3b82f6'} onChange={(v) => onUpdate({ primaryColor: v })} />
    </div>
  );
}

export function LogoCloudSettings({ element, onUpdate }: SettingsPanelProps) {
  const props = element.props;
  return (
    <div className="space-y-4 p-4">
      <PresetSelector presets={LOGO_CLOUD_PRESETS} currentPreset={props.preset} onSelect={(key, values) => onUpdate({ ...values, preset: key })} />
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select value={props.variant || 'simple'} onValueChange={(v) => onUpdate({ variant: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="with-title">With Title</SelectItem>
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="marquee">Marquee</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Title</Label><Input value={props.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Optional" /></div>
      <div className="flex items-center justify-between"><Label>Grayscale</Label><Switch checked={props.grayscale ?? true} onCheckedChange={(v) => onUpdate({ grayscale: v })} /></div>
      <ColorInput label="Background" value={props.backgroundColor || '#ffffff'} onChange={(v) => onUpdate({ backgroundColor: v })} />
    </div>
  );
}

export function BannerSettings({ element, onUpdate }: SettingsPanelProps) {
  const props = element.props;
  return (
    <div className="space-y-4 p-4">
      <PresetSelector presets={BANNER_PRESETS} currentPreset={props.preset} onSelect={(key, values) => onUpdate({ ...values, preset: key })} />
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select value={props.variant || 'info'} onValueChange={(v) => onUpdate({ variant: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="promo">Promo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Text</Label><Textarea value={props.text || ''} onChange={(e) => onUpdate({ text: e.target.value })} rows={2} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Link Text</Label><Input value={props.linkText || ''} onChange={(e) => onUpdate({ linkText: e.target.value })} /></div>
        <div className="space-y-2"><Label>Link URL</Label><Input value={props.linkUrl || ''} onChange={(e) => onUpdate({ linkUrl: e.target.value })} /></div>
      </div>
      <div className="flex items-center justify-between"><Label>Dismissible</Label><Switch checked={props.dismissible ?? true} onCheckedChange={(v) => onUpdate({ dismissible: v })} /></div>
      <div className="flex items-center justify-between"><Label>Show Icon</Label><Switch checked={props.icon ?? true} onCheckedChange={(v) => onUpdate({ icon: v })} /></div>
    </div>
  );
}

export function PollSettings({ element, onUpdate }: SettingsPanelProps) {
  const props = element.props;
  return (
    <div className="space-y-4 p-4">
      <PresetSelector presets={POLL_PRESETS} currentPreset={props.preset} onSelect={(key, values) => onUpdate({ ...values, preset: key })} />
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select value={props.variant || 'simple'} onValueChange={(v) => onUpdate({ variant: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="with-results">With Results</SelectItem>
            <SelectItem value="card">Card</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Question</Label><Input value={props.question || ''} onChange={(e) => onUpdate({ question: e.target.value })} /></div>
      <div className="flex items-center justify-between"><Label>Show Results</Label><Switch checked={props.showResults ?? false} onCheckedChange={(v) => onUpdate({ showResults: v })} /></div>
      <ColorInput label="Background" value={props.backgroundColor || '#ffffff'} onChange={(v) => onUpdate({ backgroundColor: v })} />
      <ColorInput label="Accent Color" value={props.accentColor || '#3b82f6'} onChange={(v) => onUpdate({ accentColor: v })} />
    </div>
  );
}

export function TeamSectionSettings({ element, onUpdate }: SettingsPanelProps) {
  const props = element.props;
  return (
    <div className="space-y-4 p-4">
      <PresetSelector presets={TEAM_SECTION_PRESETS} currentPreset={props.preset} onSelect={(key, values) => onUpdate({ ...values, preset: key })} />
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select value={props.variant || 'grid'} onValueChange={(v) => onUpdate({ variant: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="cards">Cards</SelectItem>
            <SelectItem value="list">List</SelectItem>
            <SelectItem value="compact">Compact</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Title</Label><Input value={props.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} /></div>
      <div className="space-y-2"><Label>Subtitle</Label><Textarea value={props.subtitle || ''} onChange={(e) => onUpdate({ subtitle: e.target.value })} rows={2} /></div>
      <div className="space-y-2">
        <Label>Columns</Label>
        <Select value={String(props.columns || 3)} onValueChange={(v) => onUpdate({ columns: parseInt(v) })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ColorInput label="Background" value={props.backgroundColor || '#ffffff'} onChange={(v) => onUpdate({ backgroundColor: v })} />
    </div>
  );
}

export function StepsSettings({ element, onUpdate }: SettingsPanelProps) {
  const props = element.props;
  return (
    <div className="space-y-4 p-4">
      <PresetSelector presets={STEPS_PRESETS} currentPreset={props.preset} onSelect={(key, values) => onUpdate({ ...values, preset: key })} />
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select value={props.variant || 'numbered'} onValueChange={(v) => onUpdate({ variant: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="numbered">Numbered</SelectItem>
            <SelectItem value="icons">Icons</SelectItem>
            <SelectItem value="timeline">Timeline</SelectItem>
            <SelectItem value="cards">Cards</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Title</Label><Input value={props.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} /></div>
      <ColorInput label="Accent Color" value={props.accentColor || '#3b82f6'} onChange={(v) => onUpdate({ accentColor: v })} />
      <ColorInput label="Background" value={props.backgroundColor || '#ffffff'} onChange={(v) => onUpdate({ backgroundColor: v })} />
    </div>
  );
}

export function ProductCollectionSettings({ element, onUpdate }: SettingsPanelProps) {
  const props = element.props;
  return (
    <div className="space-y-4 p-4">
      <PresetSelector presets={PRODUCT_COLLECTION_PRESETS} currentPreset={props.preset} onSelect={(key, values) => onUpdate({ ...values, preset: key })} />
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select value={props.variant || 'grid'} onValueChange={(v) => onUpdate({ variant: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="carousel">Carousel</SelectItem>
            <SelectItem value="list">List</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Title</Label><Input value={props.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} /></div>
      <div className="space-y-2">
        <Label>Columns</Label>
        <Select value={String(props.columns || 3)} onValueChange={(v) => onUpdate({ columns: parseInt(v) })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ColorInput label="Background" value={props.backgroundColor || '#ffffff'} onChange={(v) => onUpdate({ backgroundColor: v })} />
    </div>
  );
}
