"use client";

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GripVertical, Columns, Palette } from 'lucide-react';
import { EnhancedColorPicker } from './shared/EnhancedColorPicker';
import { SectionCard } from './shared/SectionCard';

interface TabsSettingsProps {
  node: { id: string; type: string; props: Record<string, any> };
  updateProps: (updates: Record<string, any>) => void;
}

export function TabsSettings({ node, updateProps }: TabsSettingsProps) {
  const props = node.props;
  const tabs = props.tabs || [
    { id: 'tab1', label: 'Tab 1', content: 'Content for Tab 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content for Tab 2' },
  ];

  const addTab = () => {
    const newId = `tab${tabs.length + 1}`;
    updateProps({
      tabs: [...tabs, { id: newId, label: `Tab ${tabs.length + 1}`, content: 'Add your content here...' }]
    });
  };

  const removeTab = (index: number) => {
    if (tabs.length > 1) {
      updateProps({ tabs: tabs.filter((_: any, i: number) => i !== index) });
    }
  };

  const updateTab = (index: number, field: string, value: string) => {
    const newTabs = [...tabs];
    newTabs[index] = { ...newTabs[index], [field]: value };
    updateProps({ tabs: newTabs });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Tabs Items */}
      <SectionCard id="tabs-items" title="Tab Items" icon={Columns}>
        <div className="space-y-3">
          {tabs.map((tab: any, index: number) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border/50 space-y-2">
              <div className="flex items-center gap-2">
                <GripVertical size={14} className="text-muted-foreground cursor-grab" />
                <Input
                  value={tab.label}
                  onChange={(e) => updateTab(index, 'label', e.target.value)}
                  placeholder="Tab label"
                  className="flex-1 h-8 text-sm"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeTab(index)}
                  disabled={tabs.length <= 1}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <Textarea
                value={tab.content}
                onChange={(e) => updateTab(index, 'content', e.target.value)}
                placeholder="Tab content"
                className="text-sm min-h-[60px]"
              />
            </div>
          ))}
          <Button size="sm" variant="outline" className="w-full" onClick={addTab}>
            <Plus size={14} className="mr-2" />
            Add Tab
          </Button>
        </div>
      </SectionCard>

      {/* Style */}
      <SectionCard id="tabs-style" title="Style" icon={Palette}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Tab Style</Label>
            <Select
              value={props.style || 'underline'}
              onValueChange={(value) => updateProps({ style: value })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="underline">Underline</SelectItem>
                <SelectItem value="pills">Pills</SelectItem>
                <SelectItem value="boxed">Boxed</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Default Tab</Label>
            <Select
              value={props.defaultTab || tabs[0]?.id}
              onValueChange={(value) => updateProps({ defaultTab: value })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tabs.map((tab: any) => (
                  <SelectItem key={tab.id} value={tab.id}>{tab.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <EnhancedColorPicker
            label="Active Tab Color"
            value={props.activeColor || '#3b82f6'}
            onChange={(color) => updateProps({ activeColor: color })}
          />
        </div>
      </SectionCard>
    </div>
  );
}
