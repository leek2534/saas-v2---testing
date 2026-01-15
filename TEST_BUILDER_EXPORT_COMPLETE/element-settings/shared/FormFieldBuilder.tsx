"use client";


import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  GripVertical, Plus, Trash2, ChevronDown, ChevronUp, Copy,
  Type, Mail, Phone, MessageSquare, List, CheckSquare,
  Circle, Calendar, Upload, Hash, Lock, Star, Eye, EyeOff,
  Clock, Globe, Image, PenTool, CreditCard, TrendingUp,
  Grid3x3, BarChart3, FileText, Minus, Heading, AlignLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Comprehensive form field types for forms and surveys
export type FormFieldType = 
  // Basic Input Fields
  | 'text' | 'email' | 'tel' | 'url' | 'password' | 'search'
  // Text Areas
  | 'textarea'
  // Choice Fields
  | 'select' | 'multiselect' | 'radio' | 'checkbox'
  // Number & Date Fields
  | 'number' | 'date' | 'time' | 'datetime' | 'datetime-local' | 'month' | 'week'
  // File Fields
  | 'file' | 'image'
  // Advanced Fields
  | 'signature' | 'payment' | 'hidden'
  // Survey-Specific Fields
  | 'rating' | 'nps' | 'matrix' | 'ranking' | 'slider'
  // Layout Elements
  | 'heading' | 'text-block' | 'divider' | 'pagebreak'
  // Consent
  | 'consent' | 'terms';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  name: string; // Field name for form submission
  placeholder?: string;
  required: boolean;
  width: 'full' | 'half' | 'third' | 'quarter';
  
  // Validation
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number; // For number, date, rating
    max?: number; // For number, date, rating
    pattern?: string; // Regex pattern
    errorMessage?: string;
    custom?: string; // Custom validation function name
  };
  
  // Options for select, radio, checkbox, multiselect
  options?: Array<{ label: string; value: string; icon?: string }>;
  
  // Default value
  defaultValue?: string | number | boolean | string[];
  
  // Help text and description
  helpText?: string;
  description?: string;
  
  // Conditional logic
  conditionalLogic?: {
    showIf?: {
      fieldId: string;
      operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
      value: any;
    };
  };
  
  // Styling
  styling?: {
    labelPosition?: 'top' | 'left' | 'hidden';
    labelStyle?: Record<string, any>;
    fieldStyle?: Record<string, any>;
    className?: string;
  };
  
  // Field-specific props
  props?: {
    // For rating
    maxRating?: number; // Default 5
    icon?: 'star' | 'heart' | 'thumb';
    // For NPS
    minLabel?: string; // Default "Not likely"
    maxLabel?: string; // Default "Very likely"
    // For matrix
    rows?: Array<{ label: string; value: string }>;
    columns?: Array<{ label: string; value: string }>;
    // For slider
    step?: number;
    showValue?: boolean;
    // For file/image
    accept?: string; // e.g., "image/*,.pdf"
    maxSize?: number; // In MB
    multiple?: boolean;
    // For payment
    currency?: string;
    amount?: number;
    // For consent/terms
    linkText?: string;
    linkUrl?: string;
    // For heading/text-block
    level?: 1 | 2 | 3 | 4 | 5 | 6; // Heading level
    align?: 'left' | 'center' | 'right';
    // For pagebreak
    pageTitle?: string;
    showProgress?: boolean;
  };
}

interface FormFieldBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
  formType?: 'form' | 'survey'; // Determines which fields to show
}

const FIELD_TYPE_ICONS: Record<FormFieldType, any> = {
  // Basic
  text: Type,
  email: Mail,
  tel: Phone,
  url: Globe,
  password: Lock,
  search: Type,
  textarea: MessageSquare,
  // Choice
  select: List,
  multiselect: List,
  radio: Circle,
  checkbox: CheckSquare,
  // Number & Date
  number: Hash,
  date: Calendar,
  time: Clock,
  datetime: Calendar,
  'datetime-local': Calendar,
  month: Calendar,
  week: Calendar,
  // File
  file: Upload,
  image: Image,
  // Advanced
  signature: PenTool,
  payment: CreditCard,
  hidden: EyeOff,
  // Survey
  rating: Star,
  nps: TrendingUp,
  matrix: Grid3x3,
  ranking: BarChart3,
  slider: BarChart3,
  // Layout
  heading: Heading,
  'text-block': AlignLeft,
  divider: Minus,
  pagebreak: FileText,
  // Consent
  consent: CheckSquare,
  terms: FileText,
};

const FIELD_TYPE_LABELS: Record<FormFieldType, string> = {
  text: 'Text Input',
  email: 'Email',
  tel: 'Phone',
  url: 'Website URL',
  password: 'Password',
  search: 'Search',
  textarea: 'Text Area',
  select: 'Dropdown',
  multiselect: 'Multi-Select',
  radio: 'Radio Buttons',
  checkbox: 'Checkboxes',
  number: 'Number',
  date: 'Date',
  time: 'Time',
  datetime: 'Date & Time',
  'datetime-local': 'Date & Time (Local)',
  month: 'Month',
  week: 'Week',
  file: 'File Upload',
  image: 'Image Upload',
  signature: 'Signature',
  payment: 'Payment',
  hidden: 'Hidden Field',
  rating: 'Star Rating',
  nps: 'NPS Score',
  matrix: 'Matrix/Grid',
  ranking: 'Ranking',
  slider: 'Slider',
  heading: 'Heading',
  'text-block': 'Text Block',
  divider: 'Divider',
  pagebreak: 'Page Break',
  consent: 'Consent Checkbox',
  terms: 'Terms & Conditions',
};

// Field categories for organized display
const FIELD_CATEGORIES = [
  {
    id: 'basic',
    label: 'Basic Fields',
    fields: ['text', 'email', 'tel', 'url', 'textarea', 'number'] as FormFieldType[],
  },
  {
    id: 'choice',
    label: 'Choice Fields',
    fields: ['select', 'multiselect', 'radio', 'checkbox'] as FormFieldType[],
  },
  {
    id: 'date',
    label: 'Date & Time',
    fields: ['date', 'time', 'datetime', 'datetime-local', 'month', 'week'] as FormFieldType[],
  },
  {
    id: 'file',
    label: 'File Upload',
    fields: ['file', 'image'] as FormFieldType[],
  },
  {
    id: 'survey',
    label: 'Survey Fields',
    fields: ['rating', 'nps', 'matrix', 'ranking', 'slider'] as FormFieldType[],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    fields: ['signature', 'payment', 'hidden'] as FormFieldType[],
  },
  {
    id: 'layout',
    label: 'Layout',
    fields: ['heading', 'text-block', 'divider', 'pagebreak'] as FormFieldType[],
  },
  {
    id: 'consent',
    label: 'Consent',
    fields: ['consent', 'terms'] as FormFieldType[],
  },
];

export function FormFieldBuilder({ fields, onChange, formType = 'form' }: FormFieldBuilderProps) {
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const addField = (type: FormFieldType) => {
    const fieldName = `field_${type}_${Date.now()}`;
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: FIELD_TYPE_LABELS[type],
      name: fieldName,
      placeholder: type === 'textarea' ? 'Enter your message...' : `Enter ${FIELD_TYPE_LABELS[type].toLowerCase()}`,
      required: false,
      width: 'full',
    };

    // Add default options for choice fields
    if (['select', 'radio', 'checkbox', 'multiselect'].includes(type)) {
      newField.options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ];
    }

    // Add default props for specific field types
    if (type === 'rating') {
      newField.props = { maxRating: 5, icon: 'star' };
    } else if (type === 'nps') {
      newField.props = { minLabel: 'Not likely', maxLabel: 'Very likely' };
    } else if (type === 'matrix') {
      newField.props = {
        rows: [
          { label: 'Row 1', value: 'row1' },
          { label: 'Row 2', value: 'row2' },
        ],
        columns: [
          { label: 'Excellent', value: 'excellent' },
          { label: 'Good', value: 'good' },
          { label: 'Fair', value: 'fair' },
          { label: 'Poor', value: 'poor' },
        ],
      };
    } else if (type === 'slider') {
      newField.props = { step: 1, showValue: true };
      newField.validation = { min: 0, max: 100 };
    } else if (type === 'heading') {
      newField.props = { level: 2, align: 'left' };
      newField.label = 'Heading Text';
    } else if (type === 'text-block') {
      newField.props = { align: 'left' };
      newField.label = 'Text Content';
    } else if (type === 'pagebreak') {
      newField.props = { pageTitle: 'Page 2', showProgress: true };
      newField.label = 'Page Break';
    } else if (type === 'consent' || type === 'terms') {
      newField.props = { linkText: 'Terms & Conditions', linkUrl: '#' };
    }

    onChange([...fields, newField]);
    setExpandedField(newField.id);
    setShowAddMenu(false);
    setSelectedCategory(null);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(fields.map(field => field.id === id ? { ...field, ...updates } : field));
  };

  const deleteField = (id: string) => {
    onChange(fields.filter(field => field.id !== id));
    if (expandedField === id) {
      setExpandedField(null);
    }
  };

  const duplicateField = (id: string) => {
    const field = fields.find(f => f.id === id);
    if (field) {
      const newField = { 
        ...field, 
        id: `field-${Date.now()}`, 
        label: `${field.label} (Copy)`,
        name: `${field.name}_copy_${Date.now()}`,
      };
      const index = fields.findIndex(f => f.id === id);
      const newFields = [...fields];
      newFields.splice(index + 1, 0, newField);
      onChange(newFields);
    }
  };

  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = fields.findIndex(f => f.id === id);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      const newFields = [...fields];
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
      onChange(newFields);
    } else if (direction === 'down' && index < fields.length - 1) {
      const newFields = [...fields];
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
      onChange(newFields);
    }
  };

  // Filter fields based on form type
  const getAvailableFields = () => {
    if (formType === 'survey') {
      // Surveys get all fields including survey-specific ones
      return FIELD_CATEGORIES;
    } else {
      // Forms get all except survey-specific (can still use them if needed)
      return FIELD_CATEGORIES;
    }
  };

  const availableCategories = getAvailableFields();

  return (
    <div className="space-y-3">
      {/* Field List */}
      {fields.length === 0 ? (
        <div className="text-center py-8 px-4 border-2 border-dashed border-border rounded-lg">
          <Type size={32} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-3">No fields added yet</p>
          <Button size="sm" onClick={() => setShowAddMenu(true)}>
            <Plus size={14} className="mr-2" />
            Add First Field
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field, index) => {
            const Icon = FIELD_TYPE_ICONS[field.type];
            const isExpanded = expandedField === field.id;

            return (
              <div
                key={field.id}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                {/* Field Header */}
                <div className="flex items-center gap-2 p-3 hover:bg-accent transition-colors">
                  <GripVertical size={16} className="text-muted-foreground cursor-move" />
                  <Icon size={16} className="text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {field.label}
                      </span>
                      {field.required && (
                        <span className="text-xs text-red-500 font-bold">*</span>
                      )}
                      {field.conditionalLogic?.showIf && (
                        <span className="text-xs text-blue-500" title="Has conditional logic">
                          🔗
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{FIELD_TYPE_LABELS[field.type]}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => moveField(field.id, 'up')}
                      disabled={index === 0}
                      title="Move up"
                    >
                      <ChevronUp size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => moveField(field.id, 'down')}
                      disabled={index === fields.length - 1}
                      title="Move down"
                    >
                      <ChevronDown size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => duplicateField(field.id)}
                      title="Duplicate"
                    >
                      <Copy size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={() => deleteField(field.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => setExpandedField(isExpanded ? null : field.id)}
                      title={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </Button>
                  </div>
                </div>

                {/* Field Configuration */}
                {isExpanded && (
                  <div className="p-4 border-t border-border space-y-3 bg-muted/30">
                    {/* Label */}
                    <div>
                      <Label className="text-xs font-medium text-foreground mb-2 block">
                        Field Label *
                      </Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        placeholder="Enter field label"
                      />
                    </div>

                    {/* Field Name (for form submission) */}
                    <div>
                      <Label className="text-xs font-medium text-foreground mb-2 block">
                        Field Name (for submissions)
                      </Label>
                      <Input
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value.replace(/\s+/g, '_').toLowerCase() })}
                        placeholder="field_name"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Used to identify this field in submissions</p>
                    </div>

                    {/* Placeholder (not for certain field types) */}
                    {!['radio', 'checkbox', 'consent', 'terms', 'rating', 'nps', 'matrix', 'ranking', 'hidden', 'heading', 'text-block', 'divider', 'pagebreak'].includes(field.type) && (
                      <div>
                        <Label className="text-xs font-medium text-foreground mb-2 block">
                          Placeholder
                        </Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                          placeholder="Enter placeholder text"
                        />
                      </div>
                    )}

                    {/* Description/Help Text */}
                    <div>
                      <Label className="text-xs font-medium text-foreground mb-2 block">
                        Help Text / Description
                      </Label>
                      <Input
                        value={field.helpText || ''}
                        onChange={(e) => updateField(field.id, { helpText: e.target.value })}
                        placeholder="Optional help text shown below field"
                      />
                    </div>

                    {/* Options for select, radio, checkbox, multiselect */}
                    {['select', 'radio', 'checkbox', 'multiselect'].includes(field.type) && (
                      <div>
                        <Label className="text-xs font-medium text-foreground mb-2 block">
                          Options (one per line, format: Label|value or just Label)
                        </Label>
                        <Textarea
                          value={(field.options || []).map(opt => 
                            opt.value !== opt.label ? `${opt.label}|${opt.value}` : opt.label
                          ).join('\n')}
                          onChange={(e) => {
                            const lines = e.target.value.split('\n').filter(l => l.trim());
                            const options = lines.map(line => {
                              const [label, value] = line.split('|');
                              return {
                                label: label?.trim() || line.trim(),
                                value: value?.trim() || line.trim().toLowerCase().replace(/\s+/g, '_'),
                              };
                            });
                            updateField(field.id, { options });
                          }}
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          rows={4}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Format: "Label" or "Label|value" (value is optional)
                        </p>
                      </div>
                    )}

                    {/* Matrix rows and columns */}
                    {field.type === 'matrix' && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Rows (Questions)
                          </Label>
                          <Textarea
                            value={(field.props?.rows || []).map((r: any) => r.label).join('\n')}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n').filter(l => l.trim());
                              const rows = lines.map((line, i) => ({
                                label: line.trim(),
                                value: `row_${i + 1}`,
                              }));
                              updateField(field.id, {
                                props: { ...field.props, rows },
                              });
                            }}
                            placeholder="Question 1&#10;Question 2"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Columns (Answer Options)
                          </Label>
                          <Textarea
                            value={(field.props?.columns || []).map((c: any) => c.label).join('\n')}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n').filter(l => l.trim());
                              const columns = lines.map((line, i) => ({
                                label: line.trim(),
                                value: `col_${i + 1}`,
                              }));
                              updateField(field.id, {
                                props: { ...field.props, columns },
                              });
                            }}
                            placeholder="Excellent&#10;Good&#10;Fair&#10;Poor"
                            rows={3}
                          />
                        </div>
                      </div>
                    )}

                    {/* Rating props */}
                    {field.type === 'rating' && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Max Rating
                          </Label>
                          <Input
                            type="number"
                            value={field.props?.maxRating || 5}
                            onChange={(e) => updateField(field.id, {
                              props: { ...field.props, maxRating: parseInt(e.target.value) || 5 },
                            })}
                            min={1}
                            max={10}
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Icon Type
                          </Label>
                          <Select
                            value={field.props?.icon || 'star'}
                            onValueChange={(value) => updateField(field.id, {
                              props: { ...field.props, icon: value },
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="star">Star</SelectItem>
                              <SelectItem value="heart">Heart</SelectItem>
                              <SelectItem value="thumb">Thumb</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* NPS props */}
                    {field.type === 'nps' && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Minimum Label
                          </Label>
                          <Input
                            value={field.props?.minLabel || 'Not likely'}
                            onChange={(e) => updateField(field.id, {
                              props: { ...field.props, minLabel: e.target.value },
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Maximum Label
                          </Label>
                          <Input
                            value={field.props?.maxLabel || 'Very likely'}
                            onChange={(e) => updateField(field.id, {
                              props: { ...field.props, maxLabel: e.target.value },
                            })}
                          />
                        </div>
                      </div>
                    )}

                    {/* Slider props */}
                    {field.type === 'slider' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs font-medium text-foreground mb-2 block">
                              Min Value
                            </Label>
                            <Input
                              type="number"
                              value={field.validation?.min || 0}
                              onChange={(e) => updateField(field.id, {
                                validation: { ...field.validation, min: parseInt(e.target.value) || 0 },
                              })}
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-foreground mb-2 block">
                              Max Value
                            </Label>
                            <Input
                              type="number"
                              value={field.validation?.max || 100}
                              onChange={(e) => updateField(field.id, {
                                validation: { ...field.validation, max: parseInt(e.target.value) || 100 },
                              })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Step
                          </Label>
                          <Input
                            type="number"
                            value={field.props?.step || 1}
                            onChange={(e) => updateField(field.id, {
                              props: { ...field.props, step: parseFloat(e.target.value) || 1 },
                            })}
                            min={0.1}
                            step={0.1}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                          <Label className="text-xs font-medium text-foreground">Show Current Value</Label>
                          <Switch
                            checked={field.props?.showValue ?? true}
                            onCheckedChange={(checked) => updateField(field.id, {
                              props: { ...field.props, showValue: checked },
                            })}
                          />
                        </div>
                      </div>
                    )}

                    {/* File/Image upload props */}
                    {['file', 'image'].includes(field.type) && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Accepted File Types
                          </Label>
                          <Input
                            value={field.props?.accept || (field.type === 'image' ? 'image/*' : '*/*')}
                            onChange={(e) => updateField(field.id, {
                              props: { ...field.props, accept: e.target.value },
                            })}
                            placeholder="image/*,.pdf,.doc"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            e.g., "image/*" or ".pdf,.doc" or "*/*"
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Max File Size (MB)
                          </Label>
                          <Input
                            type="number"
                            value={field.props?.maxSize || 10}
                            onChange={(e) => updateField(field.id, {
                              props: { ...field.props, maxSize: parseInt(e.target.value) || 10 },
                            })}
                            min={1}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                          <Label className="text-xs font-medium text-foreground">Allow Multiple Files</Label>
                          <Switch
                            checked={field.props?.multiple || false}
                            onCheckedChange={(checked) => updateField(field.id, {
                              props: { ...field.props, multiple: checked },
                            })}
                          />
                        </div>
                      </div>
                    )}

                    {/* Payment props */}
                    {field.type === 'payment' && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Currency
                          </Label>
                          <Select
                            value={field.props?.currency || 'USD'}
                            onValueChange={(value) => updateField(field.id, {
                              props: { ...field.props, currency: value },
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="JPY">JPY (¥)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Amount
                          </Label>
                          <Input
                            type="number"
                            value={field.props?.amount || 0}
                            onChange={(e) => updateField(field.id, {
                              props: { ...field.props, amount: parseFloat(e.target.value) || 0 },
                            })}
                            step="0.01"
                            min={0}
                          />
                        </div>
                      </div>
                    )}

                    {/* Heading props */}
                    {field.type === 'heading' && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Heading Level
                          </Label>
                          <Select
                            value={String(field.props?.level || 2)}
                            onValueChange={(value) => updateField(field.id, {
                              props: { ...field.props, level: parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6 },
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">H1 (Largest)</SelectItem>
                              <SelectItem value="2">H2</SelectItem>
                              <SelectItem value="3">H3</SelectItem>
                              <SelectItem value="4">H4</SelectItem>
                              <SelectItem value="5">H5</SelectItem>
                              <SelectItem value="6">H6 (Smallest)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Alignment
                          </Label>
                          <Select
                            value={field.props?.align || 'left'}
                            onValueChange={(value) => updateField(field.id, {
                              props: { ...field.props, align: value as 'left' | 'center' | 'right' },
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Left</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Text block props */}
                    {field.type === 'text-block' && (
                      <div>
                        <Label className="text-xs font-medium text-foreground mb-2 block">
                          Alignment
                        </Label>
                        <Select
                          value={field.props?.align || 'left'}
                          onValueChange={(value) => updateField(field.id, {
                            props: { ...field.props, align: value as 'left' | 'center' | 'right' },
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Page break props */}
                    {field.type === 'pagebreak' && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Page Title
                          </Label>
                          <Input
                            value={field.props?.pageTitle || 'Page 2'}
                            onChange={(e) => updateField(field.id, {
                              props: { ...field.props, pageTitle: e.target.value },
                            })}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                          <Label className="text-xs font-medium text-foreground">Show Progress Bar</Label>
                          <Switch
                            checked={field.props?.showProgress ?? true}
                            onCheckedChange={(checked) => updateField(field.id, {
                              props: { ...field.props, showProgress: checked },
                            })}
                          />
                        </div>
                      </div>
                    )}

                    {/* Consent/Terms props */}
                    {(field.type === 'consent' || field.type === 'terms') && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Link Text
                          </Label>
                          <Input
                            value={field.props?.linkText || 'Terms & Conditions'}
                            onChange={(e) => updateField(field.id, {
                              props: { ...field.props, linkText: e.target.value },
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-foreground mb-2 block">
                            Link URL
                          </Label>
                          <Input
                            value={field.props?.linkUrl || '#'}
                            onChange={(e) => updateField(field.id, {
                              props: { ...field.props, linkUrl: e.target.value },
                            })}
                            placeholder="https://example.com/terms"
                          />
                        </div>
                      </div>
                    )}

                    {/* Default Value */}
                    {!['heading', 'text-block', 'divider', 'pagebreak', 'consent', 'terms'].includes(field.type) && (
                      <div>
                        <Label className="text-xs font-medium text-foreground mb-2 block">
                          Default Value
                        </Label>
                        <Input
                          value={field.defaultValue?.toString() || ''}
                          onChange={(e) => {
                            let value: any = e.target.value;
                            if (field.type === 'number') {
                              value = parseFloat(value) || undefined;
                            } else if (field.type === 'checkbox') {
                              value = e.target.checked;
                            }
                            updateField(field.id, { defaultValue: value });
                          }}
                          type={field.type === 'number' ? 'number' : 'text'}
                          placeholder="Optional default value"
                        />
                      </div>
                    )}

                    {/* Width */}
                    <div>
                      <Label className="text-xs font-medium text-foreground mb-2 block">
                        Field Width
                      </Label>
                      <Select
                        value={field.width}
                        onValueChange={(value: 'full' | 'half' | 'third' | 'quarter') => updateField(field.id, { width: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Width (100%)</SelectItem>
                          <SelectItem value="half">Half Width (50%)</SelectItem>
                          <SelectItem value="third">Third Width (33%)</SelectItem>
                          <SelectItem value="quarter">Quarter Width (25%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Required */}
                    {!['heading', 'text-block', 'divider', 'pagebreak', 'hidden'].includes(field.type) && (
                      <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                        <div>
                          <Label className="text-xs font-medium text-foreground">Required Field</Label>
                          <p className="text-xs text-muted-foreground">User must fill this field</p>
                        </div>
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                        />
                      </div>
                    )}

                    {/* Validation (for applicable fields) */}
                    {['text', 'email', 'tel', 'url', 'textarea', 'number', 'date', 'time'].includes(field.type) && (
                      <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                        <Label className="text-xs font-semibold text-blue-900 dark:text-blue-300">Validation Rules</Label>
                        
                        {['text', 'email', 'tel', 'url', 'textarea'].includes(field.type) && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs text-foreground mb-1 block">Min Length</Label>
                              <Input
                                type="number"
                                value={field.validation?.minLength || ''}
                                onChange={(e) => updateField(field.id, {
                                  validation: { ...field.validation, minLength: parseInt(e.target.value) || undefined }
                                })}
                                placeholder="0"
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-foreground mb-1 block">Max Length</Label>
                              <Input
                                type="number"
                                value={field.validation?.maxLength || ''}
                                onChange={(e) => updateField(field.id, {
                                  validation: { ...field.validation, maxLength: parseInt(e.target.value) || undefined }
                                })}
                                placeholder="∞"
                                className="h-8"
                              />
                            </div>
                          </div>
                        )}

                        {field.type === 'number' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs text-foreground mb-1 block">Min Value</Label>
                              <Input
                                type="number"
                                value={field.validation?.min || ''}
                                onChange={(e) => updateField(field.id, {
                                  validation: { ...field.validation, min: parseFloat(e.target.value) || undefined }
                                })}
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-foreground mb-1 block">Max Value</Label>
                              <Input
                                type="number"
                                value={field.validation?.max || ''}
                                onChange={(e) => updateField(field.id, {
                                  validation: { ...field.validation, max: parseFloat(e.target.value) || undefined }
                                })}
                                className="h-8"
                              />
                            </div>
                          </div>
                        )}

                        {['text', 'email', 'tel', 'url'].includes(field.type) && (
                          <div>
                            <Label className="text-xs text-foreground mb-1 block">Regex Pattern</Label>
                            <Input
                              value={field.validation?.pattern || ''}
                              onChange={(e) => updateField(field.id, {
                                validation: { ...field.validation, pattern: e.target.value }
                              })}
                              placeholder="^[a-zA-Z0-9]+$"
                              className="h-8"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Optional regex validation pattern</p>
                          </div>
                        )}

                        <div>
                          <Label className="text-xs text-foreground mb-1 block">Custom Error Message</Label>
                          <Input
                            value={field.validation?.errorMessage || ''}
                            onChange={(e) => updateField(field.id, {
                              validation: { ...field.validation, errorMessage: e.target.value }
                            })}
                            placeholder="This field is invalid"
                            className="h-8"
                          />
                        </div>
                      </div>
                    )}

                    {/* Conditional Logic */}
                    {index > 0 && (
                      <div className="space-y-3 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold text-purple-900 dark:text-purple-300">
                            Conditional Logic
                          </Label>
                          <Switch
                            checked={!!field.conditionalLogic?.showIf}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateField(field.id, {
                                  conditionalLogic: {
                                    showIf: {
                                      fieldId: fields[index - 1]?.id || '',
                                      operator: 'equals',
                                      value: '',
                                    },
                                  },
                                });
                              } else {
                                updateField(field.id, { conditionalLogic: undefined });
                              }
                            }}
                          />
                        </div>
                        {field.conditionalLogic?.showIf && (
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs text-foreground mb-1 block">Show this field if:</Label>
                              <Select
                                value={field.conditionalLogic.showIf.fieldId}
                                onValueChange={(value) => updateField(field.id, {
                                  conditionalLogic: {
                                    showIf: {
                                      ...field.conditionalLogic.showIf,
                                      fieldId: value,
                                    },
                                  },
                                })}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {fields.slice(0, index).map((f) => (
                                    <SelectItem key={f.id} value={f.id}>
                                      {f.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs text-foreground mb-1 block">Operator:</Label>
                              <Select
                                value={field.conditionalLogic.showIf.operator}
                                onValueChange={(value: any) => updateField(field.id, {
                                  conditionalLogic: {
                                    showIf: {
                                      ...field.conditionalLogic.showIf,
                                      operator: value,
                                    },
                                  },
                                })}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="equals">Equals</SelectItem>
                                  <SelectItem value="notEquals">Not Equals</SelectItem>
                                  <SelectItem value="contains">Contains</SelectItem>
                                  <SelectItem value="greaterThan">Greater Than</SelectItem>
                                  <SelectItem value="lessThan">Less Than</SelectItem>
                                  <SelectItem value="isEmpty">Is Empty</SelectItem>
                                  <SelectItem value="isNotEmpty">Is Not Empty</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {!['isEmpty', 'isNotEmpty'].includes(field.conditionalLogic.showIf.operator) && (
                              <div>
                                <Label className="text-xs text-foreground mb-1 block">Value:</Label>
                                <Input
                                  value={field.conditionalLogic.showIf.value || ''}
                                  onChange={(e) => updateField(field.id, {
                                    conditionalLogic: {
                                      showIf: {
                                        ...field.conditionalLogic.showIf,
                                        value: e.target.value,
                                      },
                                    },
                                  })}
                                  className="h-8"
                                  placeholder="Enter value"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Field Button */}
      {fields.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full"
        >
          <Plus size={14} className="mr-2" />
          Add Field
        </Button>
      )}

      {/* Add Field Menu with Categories */}
      {showAddMenu && (
        <div className="p-3 bg-card border border-border rounded-lg space-y-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="text-xs"
            >
              All
            </Button>
            {availableCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-xs"
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Field Grid */}
          <div className="grid grid-cols-2 gap-2">
            {availableCategories
              .filter(cat => !selectedCategory || cat.id === selectedCategory)
              .flatMap(cat => cat.fields)
              .map((type) => {
                const Icon = FIELD_TYPE_ICONS[type];
                return (
                  <Button
                    key={type}
                    variant="ghost"
                    size="sm"
                    onClick={() => addField(type)}
                    className="justify-start h-auto py-2 hover:bg-accent"
                  >
                    <Icon size={14} className="mr-2 text-primary flex-shrink-0" />
                    <span className="text-xs text-left">{FIELD_TYPE_LABELS[type]}</span>
                  </Button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
