"use client";

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GripVertical, ChevronDown, Palette, Settings } from 'lucide-react';
import { EnhancedColorPicker } from './shared/EnhancedColorPicker';
import { SectionCard } from './shared/SectionCard';

interface AccordionSettingsProps {
  node: { id: string; type: string; props: Record<string, any> };
  updateProps: (updates: Record<string, any>) => void;
}

export function AccordionSettings({ node, updateProps }: AccordionSettingsProps) {
  const props = node.props;
  const items = props.items || [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
  ];

  const addItem = () => {
    updateProps({
      items: [...items, { title: `Section ${items.length + 1}`, content: 'Add your content here...' }]
    });
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      updateProps({ items: items.filter((_: any, i: number) => i !== index) });
    }
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateProps({ items: newItems });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Items Section */}
      <SectionCard id="accordion-items" title="Accordion Items" icon={ChevronDown}>
        <div className="space-y-3">
          {items.map((item: any, index: number) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border/50 space-y-2">
              <div className="flex items-center gap-2">
                <GripVertical size={14} className="text-muted-foreground cursor-grab" />
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  placeholder="Section title"
                  className="flex-1 h-8 text-sm"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(index)}
                  disabled={items.length <= 1}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <Textarea
                value={item.content}
                onChange={(e) => updateItem(index, 'content', e.target.value)}
                placeholder="Section content"
                className="text-sm min-h-[60px]"
              />
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={addItem}
          >
            <Plus size={14} className="mr-2" />
            Add Item
          </Button>
        </div>
      </SectionCard>

      {/* Behavior */}
      <SectionCard id="accordion-behavior" title="Behavior" icon={Settings}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Allow Multiple Open</Label>
            <Switch
              checked={props.allowMultiple || false}
              onCheckedChange={(checked) => updateProps({ allowMultiple: checked })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Default Open</Label>
            <Select
              value={String(props.defaultOpen ?? 0)}
              onValueChange={(value) => updateProps({ defaultOpen: parseInt(value) })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-1">None</SelectItem>
                {items.map((_: any, i: number) => (
                  <SelectItem key={i} value={String(i)}>Item {i + 1}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      {/* Style */}
      <SectionCard id="accordion-style" title="Style" icon={Palette}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Variant</Label>
            <Select
              value={props.variant || 'default'}
              onValueChange={(value) => updateProps({ variant: value })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <EnhancedColorPicker
            label="Header Color"
            value={props.headerColor || '#f3f4f6'}
            onChange={(color) => updateProps({ headerColor: color })}
          />
          <EnhancedColorPicker
            label="Content Background"
            value={props.contentBg || '#ffffff'}
            onChange={(color) => updateProps({ contentBg: color })}
          />
        </div>
      </SectionCard>
    </div>
  );
}
