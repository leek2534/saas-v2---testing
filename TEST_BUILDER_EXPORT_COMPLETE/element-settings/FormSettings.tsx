"use client";



import React, { useState } from 'react';
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
  node: {
    id: string;
    type: string;
    props: Record<string, any>;
  };
  updateProps: (updates: any) => void;
}

export function FormSettings({ node, updateProps }: FormSettingsProps) {
  const props = node.props;
  const [activeTab, setActiveTab] = useState('content');
  const [searchQuery, setSearchQuery] = useState('');

  // Form type (form or survey)
  const formType = props.formType || 'form';

  // Initialize default fields if none exist
  const defaultFields: FormField[] = props.fields || [
    { 
      id: 'field-1', 
      type: 'text', 
      label: 'Name', 
      name: 'name',
      placeholder: 'Enter your name', 
      required: true, 
      width: 'full' 
    },
    { 
      id: 'field-2', 
      type: 'email', 
      label: 'Email', 
      name: 'email',
      placeholder: 'your@email.com', 
      required: true, 
      width: 'full' 
    },
  ];

  const updateFields = (fields: FormField[]) => {
    updateProps({ fields });
  };

  // Form presets
  const presets = {
    leadCapture: {
      formType: 'form',
      fields: [
        { id: 'f1', type: 'text' as const, label: 'Full Name', name: 'full_name', placeholder: 'John Doe', required: true, width: 'full' as const },
        { id: 'f2', type: 'email' as const, label: 'Email Address', name: 'email', placeholder: 'john@example.com', required: true, width: 'full' as const },
        { id: 'f3', type: 'tel' as const, label: 'Phone Number', name: 'phone', placeholder: '(555) 123-4567', required: false, width: 'full' as const },
      ],
      submitText: 'Get Started',
      submitBackgroundColor: '#3b82f6',
      submitTextColor: '#ffffff',
    },
    contactForm: {
      formType: 'form',
      fields: [
        { id: 'f1', type: 'text' as const, label: 'Name', name: 'name', placeholder: 'Your name', required: true, width: 'full' as const },
        { id: 'f2', type: 'email' as const, label: 'Email', name: 'email', placeholder: 'your@email.com', required: true, width: 'full' as const },
        { id: 'f3', type: 'text' as const, label: 'Subject', name: 'subject', placeholder: 'How can we help?', required: false, width: 'full' as const },
        { id: 'f4', type: 'textarea' as const, label: 'Message', name: 'message', placeholder: 'Your message...', required: true, width: 'full' as const },
      ],
      submitText: 'Send Message',
      submitBackgroundColor: '#10b981',
      submitTextColor: '#ffffff',
    },
    newsletter: {
      formType: 'form',
      fields: [
        { id: 'f1', type: 'email' as const, label: 'Email Address', name: 'email', placeholder: 'Enter your email', required: true, width: 'full' as const },
      ],
      submitText: 'Subscribe',
      submitBackgroundColor: '#8b5cf6',
      submitTextColor: '#ffffff',
    },
    customerSurvey: {
      formType: 'survey',
      fields: [
        { id: 'f1', type: 'heading' as const, label: 'Customer Satisfaction Survey', name: 'heading', width: 'full' as const, props: { level: 2, align: 'center' } },
        { id: 'f2', type: 'text' as const, label: 'Name', name: 'name', placeholder: 'Your name', required: true, width: 'full' as const },
        { id: 'f3', type: 'rating' as const, label: 'Overall Rating', name: 'rating', required: true, width: 'full' as const, props: { maxRating: 5, icon: 'star' } },
        { id: 'f4', type: 'nps' as const, label: 'How likely are you to recommend us?', name: 'nps', required: true, width: 'full' as const, props: { minLabel: 'Not likely', maxLabel: 'Very likely' } },
        { id: 'f5', type: 'textarea' as const, label: 'Additional Comments', name: 'comments', placeholder: 'Tell us more...', required: false, width: 'full' as const },
      ],
      submitText: 'Submit Survey',
      submitBackgroundColor: '#8b5cf6',
      submitTextColor: '#ffffff',
    },
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    updateProps(presets[presetName]);
  };

  return (
    <div className="flex flex-col bg-card">
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

      {/* 3 Tabs */}
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
          
          {/* Form Type Selector */}
          <SectionCard id="formType" title="Form Type" icon={FileText}>
            <div>
              <Label className="text-xs font-medium text-foreground mb-2 block">
                Form Type
              </Label>
              <Select 
                value={formType} 
                onValueChange={(value) => updateProps({ formType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="form">Form (Lead Capture)</SelectItem>
                  <SelectItem value="survey">Survey (Feedback)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {formType === 'form' 
                  ? 'Forms are designed for lead capture and data collection'
                  : 'Surveys include rating, NPS, and matrix fields for feedback'}
              </p>
            </div>
          </SectionCard>

          {/* Form Fields Section */}
          <SectionCard id="fields" title="Form Fields" icon={FileText} onReset={() => updateProps({ fields: defaultFields })}>
            <FormFieldBuilder 
              fields={defaultFields} 
              onChange={updateFields} 
              formType={formType}
            />
          </SectionCard>

          {/* Submit Button Section */}
          <SectionCard id="submit" title="Submit Button" icon={Settings}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">
                  Button Text
                </Label>
                <Input
                  value={props.submitText || 'Submit'}
                  onChange={(e) => updateProps({ submitText: e.target.value })}
                  placeholder="Submit"
                />
              </div>
            </div>
          </SectionCard>

          {/* Messages Section */}
          <SectionCard id="messages" title="Messages" icon={Mail}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">
                  Success Message
                </Label>
                <Textarea
                  value={props.successMessage || 'Thank you! Your submission has been received.'}
                  onChange={(e) => updateProps({ successMessage: e.target.value })}
                  placeholder="Thank you! Your submission has been received."
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">
                  Error Message
                </Label>
                <Textarea
                  value={props.errorMessage || 'Oops! Something went wrong. Please try again.'}
                  onChange={(e) => updateProps({ errorMessage: e.target.value })}
                  placeholder="Oops! Something went wrong. Please try again."
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">
                  Redirect URL (Optional)
                </Label>
                <Input
                  value={props.redirectUrl || ''}
                  onChange={(e) => updateProps({ redirectUrl: e.target.value })}
                  placeholder="https://example.com/thank-you"
                />
              </div>
            </div>
          </SectionCard>

        </TabsContent>

        {/* DESIGN TAB */}
        <TabsContent value="design" className="p-4 space-y-3 mt-0">
          
          {/* Presets Gallery */}
          <SectionCard id="presets" title="Quick Presets" icon={Wand2}>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(presets).map(([key, preset]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(key as keyof typeof presets)}
                  className="h-auto py-3 flex flex-col items-start gap-1 hover:bg-accent"
                >
                  <span className="text-xs font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-xs text-foreground">{preset.fields.length} fields</span>
                </Button>
              ))}
            </div>
          </SectionCard>

          {/* Layout Section */}
          <SectionCard id="layout" title="Layout" icon={Settings}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Form Layout</Label>
                <Select value={props.layout || 'single-column'} onValueChange={(value) => updateProps({ layout: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-column">Single Column</SelectItem>
                    <SelectItem value="two-column">Two Column</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <EnhancedSlider
                label="Field Spacing"
                value={props.fieldSpacing || 16}
                onChange={(val) => updateProps({ fieldSpacing: val })}
                min={8}
                max={32}
                tooltip="Space between form fields"
              />
            </div>
          </SectionCard>

          {/* Field Styling Section */}
          <SectionCard id="fieldStyling" title="Field Styling" icon={Palette}>
            <div className="space-y-3">
              <EnhancedColorPicker
                label="Field Border Color"
                value={props.fieldBorderColor || '#d1d5db'}
                onChange={(color) => updateProps({ fieldBorderColor: color })}
              />

              <EnhancedColorPicker
                label="Field Focus Color"
                value={props.fieldFocusColor || '#3b82f6'}
                onChange={(color) => updateProps({ fieldFocusColor: color })}
              />

              <EnhancedSlider
                label="Border Radius"
                value={props.fieldBorderRadius || 8}
                onChange={(val) => updateProps({ fieldBorderRadius: val })}
                min={0}
                max={20}
                tooltip="Roundness of field corners"
              />
            </div>
          </SectionCard>

          {/* Submit Button Styling */}
          <SectionCard id="buttonStyling" title="Submit Button Styling" icon={Palette}>
            <div className="space-y-3">
              <EnhancedColorPicker
                label="Button Background"
                value={props.submitBackgroundColor || '#3b82f6'}
                onChange={(color) => updateProps({ submitBackgroundColor: color })}
              />

              <EnhancedColorPicker
                label="Button Text Color"
                value={props.submitTextColor || '#ffffff'}
                onChange={(color) => updateProps({ submitTextColor: color })}
              />
            </div>
          </SectionCard>

        </TabsContent>

        {/* BEHAVIOR TAB */}
        <TabsContent value="behavior" className="p-4 space-y-3 mt-0">
          
          {/* Submission Section */}
          <SectionCard id="submission" title="Form Submission" icon={Webhook}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Submission Type</Label>
                <Select value={props.submissionType || 'webhook'} onValueChange={(value) => updateProps({ submissionType: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webhook">Webhook URL</SelectItem>
                    <SelectItem value="email">Email Notification</SelectItem>
                    <SelectItem value="zapier">Zapier Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {props.submissionType === 'webhook' && (
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">Webhook URL</Label>
                  <Input
                    value={props.webhookUrl || ''}
                    onChange={(e) => updateProps({ webhookUrl: e.target.value })}
                    placeholder="https://api.example.com/webhook"
                  />
                </div>
              )}

              {props.submissionType === 'email' && (
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">Send To Email</Label>
                  <Input
                    value={props.emailTo || ''}
                    onChange={(e) => updateProps({ emailTo: e.target.value })}
                    placeholder="notifications@example.com"
                  />
                </div>
              )}
            </div>
          </SectionCard>

          {/* Spam Protection Section */}
          <SectionCard id="spam" title="Spam Protection" icon={Shield}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Protection Type</Label>
                <Select value={props.spamProtection || 'none'} onValueChange={(value) => updateProps({ spamProtection: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="honeypot">Honeypot Field</SelectItem>
                    <SelectItem value="recaptcha">reCAPTCHA v3</SelectItem>
                    <SelectItem value="turnstile">Cloudflare Turnstile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>

          {/* Analytics Section */}
          <SectionCard id="analytics" title="Analytics & Tracking" icon={BarChart}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs font-medium text-foreground">Track Form Submissions</Label>
                  <p className="text-xs text-foreground">Send events to analytics</p>
                </div>
                <Switch
                  checked={props.trackAnalytics || false}
                  onCheckedChange={(checked) => updateProps({ trackAnalytics: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs font-medium text-foreground">Auto-Save Progress</Label>
                  <p className="text-xs text-foreground">Save form data locally</p>
                </div>
                <Switch
                  checked={props.enableAutoSave || false}
                  onCheckedChange={(checked) => updateProps({ enableAutoSave: checked })}
                />
              </div>
            </div>
          </SectionCard>

        </TabsContent>
      </Tabs>
    </div>
  );
}
