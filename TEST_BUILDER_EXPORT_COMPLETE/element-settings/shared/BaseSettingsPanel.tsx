"use client";



/**
 * Base Settings Panel
 * 
 * Universal settings panel with Content/Design/Behavior tabs
 * Provides consistent structure for all element settings
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Type, Palette, Zap, Search, Wand2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PresetDefinition {
  id: string;
  name: string;
  description: string;
  props: Record<string, any>;
  preview?: React.ReactNode;
}

export interface BaseSettingsPanelProps {
  node: { id: string; props: Record<string, any> };
  updateProps: (updates: any) => void;
  tabs: {
    content?: React.ReactNode;
    design?: React.ReactNode;
    behavior?: React.ReactNode;
  };
  presets?: PresetDefinition[];
  defaultTab?: 'content' | 'design' | 'behavior';
  showSearch?: boolean;
  onSave?: () => void;
}

export function BaseSettingsPanel({
  node,
  updateProps,
  tabs,
  presets,
  defaultTab = 'content',
  showSearch = true,
  onSave,
}: BaseSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleUpdateProps = (updates: any) => {
    updateProps(updates);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    setHasChanges(false);
  };

  const handlePresetSelect = (preset: PresetDefinition) => {
    handleUpdateProps({ ...preset.props, presetId: preset.id });
    setShowPresets(false);
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Search Bar */}
      {showSearch && (
        <div className="p-3 bg-card border-b border-border">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
              className="pl-9 h-9 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Presets Section */}
      {presets && presets.length > 0 && (
        <div className="p-3 bg-card border-b border-border">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="w-full flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <Wand2 size={14} className="text-primary" />
              <span className="text-xs font-semibold text-foreground">
                Style Presets
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{showPresets ? 'Hide' : 'Show'}</span>
          </button>

          {showPresets && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    'p-3 border-2 rounded-lg text-left transition-all hover:border-primary hover:shadow-md',
                    node.props.presetId === preset.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card'
                  )}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground">
                      {preset.name}
                    </span>
                    {node.props.presetId === preset.id && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {node.props.presetId && (
            <div className="mt-3 p-2 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">
                  Current: {presets.find((p) => p.id === node.props.presetId)?.name || 'Custom'}
                </p>
                <button
                  onClick={() => handleUpdateProps({ presetId: null })}
                  className="text-xs text-primary hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1">
        <TabsList className="w-full justify-start rounded-none border-b bg-card px-4">
          {tabs.content && (
            <TabsTrigger
              value="content"
              className="data-[state=active]:bg-accent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              <Type size={14} className="mr-2" />
              Content
            </TabsTrigger>
          )}
          {tabs.design && (
            <TabsTrigger
              value="design"
              className="data-[state=active]:bg-accent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              <Palette size={14} className="mr-2" />
              Design
            </TabsTrigger>
          )}
          {tabs.behavior && (
            <TabsTrigger
              value="behavior"
              className="data-[state=active]:bg-accent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              <Zap size={14} className="mr-2" />
              Behavior
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto">
          {tabs.content && (
            <TabsContent value="content" className="p-4 space-y-3 mt-0">
              {React.cloneElement(tabs.content as React.ReactElement, {
                updateProps: handleUpdateProps,
              })}
            </TabsContent>
          )}

          {tabs.design && (
            <TabsContent value="design" className="p-4 space-y-3 mt-0">
              {React.cloneElement(tabs.design as React.ReactElement, {
                updateProps: handleUpdateProps,
              })}
            </TabsContent>
          )}

          {tabs.behavior && (
            <TabsContent value="behavior" className="p-4 space-y-3 mt-0">
              {React.cloneElement(tabs.behavior as React.ReactElement, {
                updateProps: handleUpdateProps,
              })}
            </TabsContent>
          )}
        </div>
      </Tabs>

      {/* Save Indicator */}
      {hasChanges && (
        <div className="p-3 bg-card border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Unsaved changes</span>
            <Button size="sm" onClick={handleSave} className="h-8">
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Auto-save indicator */}
      {!hasChanges && onSave && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium animate-in slide-in-from-bottom-5 fade-in-0">
          ✓ Auto-Saved
        </div>
      )}
    </div>
  );
}
