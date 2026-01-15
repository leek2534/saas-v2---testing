"use client";



import React, { useState } from 'react';
import { ElementNode } from '@/lib/store/test-builder';
import { ContentTab } from './button-tabs/ContentTab';
import { DesignTab } from './button-tabs/DesignTab';
import { BehaviorTab } from './button-tabs/BehaviorTab';
import { LivePreview } from './button-tabs/LivePreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Type, Palette, Zap } from 'lucide-react';

interface ButtonSettingsProps {
  node: ElementNode;
  updateProps: (updates: any) => void;
}

export function ButtonSettings({ node, updateProps }: ButtonSettingsProps) {
  const props = node.props;
  const [activeTab, setActiveTab] = useState('content');

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

  return (
    <div className="h-full flex flex-col">
      <LivePreview props={props} updateProps={updateProps} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-gray-200 dark:border-gray-700 bg-transparent h-12">
          <TabsTrigger value="content" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <Type size={14} className="mr-2" />Content
          </TabsTrigger>
          <TabsTrigger value="design" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <Palette size={14} className="mr-2" />Design
          </TabsTrigger>
          <TabsTrigger value="behavior" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <Zap size={14} className="mr-2" />Behavior
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-1 overflow-y-auto mt-0">
          <ContentTab props={props} updateProps={updateProps} />
        </TabsContent>

        <TabsContent value="design" className="flex-1 overflow-y-auto mt-0">
          <DesignTab props={props} updateProps={updateProps} />
        </TabsContent>

        <TabsContent value="behavior" className="flex-1 overflow-y-auto mt-0">
          <BehaviorTab props={props} updateProps={updateProps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
