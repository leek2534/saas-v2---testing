"use client";



import React, { useState } from 'react';
import { ElementNode } from '@/lib/store/test-builder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Type, Palette, Zap, 
  Link2, Send, Download, Phone, Mail, ArrowRight, Maximize2,
  AlignLeft, AlignCenter, AlignRight, Sparkles, Eye
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';
import { IconPicker } from '../IconPicker';
import { PaddingControl } from '../PaddingControl';

interface ButtonSettingsProps {
  node: ElementNode;
  updateProps: (updates: any) => void;
}

export function ButtonSettings({ node, updateProps }: ButtonSettingsProps) {
  const props = node.props;
  const [activeTab, setActiveTab] = useState('content');
  const [showCustomPadding, setShowCustomPadding] = useState(false);

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (color: string) => void }) => {
    const [showPicker, setShowPicker] = useState(false);

    return (
      <div>
        <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">{label}</Label>
        <div className="relative">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 transition-colors bg-white dark:bg-gray-800"
          >
            <div
              className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: value || '#3b82f6' }}
            />
            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{value || '#3b82f6'}</span>
          </button>
          {showPicker && (
            <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <HexColorPicker color={value || '#3b82f6'} onChange={onChange} />
              <Input
                type="text"
                value={value || '#3b82f6'}
                onChange={(e) => onChange(e.target.value)}
                className="mt-2 text-xs font-mono"
                placeholder="#3b82f6"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPicker(false)}
                className="w-full mt-2"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Live Preview Button */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Eye size={14} className="text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Live Preview</span>
        </div>
        <div className="flex justify-center">
          <button
            className={cn(
              "transition-all duration-300 font-medium flex items-center gap-2",
              // Size
              props.buttonSize === 'small' && "py-2 px-4 text-sm",
              props.buttonSize === 'medium' && "py-3 px-6 text-base",
              props.buttonSize === 'large' && "py-4 px-8 text-lg",
              props.buttonSize === 'xlarge' && "py-5 px-10 text-xl",
              props.buttonSize === 'full' && "w-full py-3 px-6 text-base",
              (!props.buttonSize || props.buttonSize === 'custom') && "py-3 px-6 text-base",
              // Style
              props.buttonStyle === 'filled' && "bg-blue-600 text-white",
              props.buttonStyle === 'outline' && "border-2 border-blue-600 text-blue-600 bg-transparent",
              props.buttonStyle === 'ghost' && "text-blue-600 bg-transparent",
              props.buttonStyle === 'gradient' && "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
              props.buttonStyle === 'glass' && "bg-white/20 backdrop-blur-lg text-gray-900 dark:text-white",
              !props.buttonStyle && "bg-blue-600 text-white"
            )}
            style={{
              backgroundColor: props.buttonStyle === 'filled' ? props.backgroundColor : undefined,
              color: props.textColor,
              borderRadius: `${props.borderRadius || 8}px`,
              borderWidth: props.borderWidth ? `${props.borderWidth}px` : undefined,
              borderColor: props.borderColor,
              textAlign: props.textAlign || 'center',
            }}
          >
            {props.showIcon && props.iconPosition === 'left' && <Sparkles size={16} />}
            <div className="flex flex-col">
              <span>{props.text || 'Button Text'}</span>
              {props.subtext && (
                <span className="text-xs opacity-80 mt-0.5">{props.subtext}</span>
              )}
            </div>
            {props.showIcon && props.iconPosition === 'right' && <Sparkles size={16} />}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-gray-200 dark:border-gray-700 bg-transparent h-12">
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
        <TabsContent value="content" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            
            {/* Button Text */}
            <div>
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Button Text
              </Label>
              <Input
                value={props.text || ''}
                onChange={(e) => updateProps({ text: e.target.value })}
                placeholder="Click Here"
                className="font-medium"
              />
            </div>

            {/* Subtext */}
            <div>
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Subtext (Optional)
              </Label>
              <Input
                value={props.subtext || ''}
                onChange={(e) => updateProps({ subtext: e.target.value })}
                placeholder="Additional info..."
                className="text-sm"
              />
            </div>

            <Separator className="my-3" />

            {/* Text Color */}
            <ColorPicker
              label="Text Color"
              value={props.textColor || '#ffffff'}
              onChange={(color) => updateProps({ textColor: color })}
            />

            <Separator className="my-3" />

            {/* Icon Configuration */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Icon (Optional)
              </Label>
              
              <div className="flex items-center justify-between">
                <Label className="text-xs text-gray-600 dark:text-gray-400">Show Icon</Label>
                <Switch
                  checked={props.showIcon || false}
                  onCheckedChange={(checked) => updateProps({ showIcon: checked })}
                />
              </div>

              {props.showIcon && (
                <>
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Icon Position</Label>
                    <Select 
                      value={props.iconPosition || 'left'} 
                      onValueChange={(value) => updateProps({ iconPosition: value })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Select Icon</Label>
                    <IconPicker
                      value={props.icon || 'ArrowRight'}
                      onChange={(icon) => updateProps({ icon })}
                    />
                  </div>
                </>
              )}
            </div>

            <Separator className="my-3" />

            {/* Button Size Presets */}
            <div>
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Button Size
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Small', value: 'small' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Large', value: 'large' },
                  { label: 'X-Large', value: 'xlarge' },
                  { label: 'Full Width', value: 'full' },
                  { label: 'Custom', value: 'custom' },
                ].map(({ label, value }) => (
                  <Button
                    key={value}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateProps({ buttonSize: value });
                      if (value === 'custom') {
                        setShowCustomPadding(true);
                      } else {
                        setShowCustomPadding(false);
                      }
                    }}
                    className={cn(
                      "h-9 text-xs",
                      props.buttonSize === value && "bg-blue-50 dark:bg-blue-900/30 border-blue-500",
                      value === 'full' && "col-span-2"
                    )}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Padding Toggle */}
            {(props.buttonSize === 'custom' || showCustomPadding) && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <PaddingControl
                  values={{
                    top: props.paddingTop || 12,
                    right: props.paddingRight || 24,
                    bottom: props.paddingBottom || 12,
                    left: props.paddingLeft || 24,
                  }}
                  onChange={(values) => updateProps({
                    paddingTop: values.top,
                    paddingRight: values.right,
                    paddingBottom: values.bottom,
                    paddingLeft: values.left,
                  })}
                  min={0}
                  max={100}
                  step={1}
                  unit="px"
                  label="Custom Padding"
                />
              </div>
            )}

            <Separator className="my-3" />

            {/* Text Alignment */}
            <div>
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Text Alignment
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: AlignLeft, value: 'left', label: 'Left' },
                  { icon: AlignCenter, value: 'center', label: 'Center' },
                  { icon: AlignRight, value: 'right', label: 'Right' },
                ].map(({ icon: Icon, value, label }) => (
                  <Button
                    key={value}
                    variant="outline"
                    size="sm"
                    onClick={() => updateProps({ textAlign: value })}
                    className={cn(
                      "h-9",
                      props.textAlign === value && "bg-blue-50 dark:bg-blue-900/30 border-blue-500"
                    )}
                    title={label}
                  >
                    <Icon size={16} />
                  </Button>
                ))}
              </div>
            </div>

          </div>
        </TabsContent>

      {/* Style Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="style" title="Style & Colors" icon={Palette} />
        {expandedSections.includes('style') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            
            {/* Button Style Type */}
            <div>
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Button Style
              </Label>
              <Select 
                value={props.buttonStyle || 'filled'} 
                onValueChange={(value) => updateProps({ buttonStyle: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="filled">Filled (Solid)</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost (Minimal)</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="glass">Glass (Blur)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Background Color */}
            <ColorPicker
              label="Background Color"
              value={props.backgroundColor || '#3b82f6'}
              onChange={(color) => updateProps({ backgroundColor: color })}
            />

            {/* Border Settings */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Border
              </Label>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Width (px)</Label>
                  <Input
                    type="number"
                    value={props.borderWidth || 0}
                    onChange={(e) => updateProps({ borderWidth: parseInt(e.target.value) || 0 })}
                    min={0}
                    max={10}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Radius (px)</Label>
                  <Input
                    type="number"
                    value={props.borderRadius || 8}
                    onChange={(e) => updateProps({ borderRadius: parseInt(e.target.value) || 0 })}
                    min={0}
                    max={50}
                    className="text-sm"
                  />
                </div>
              </div>

              {props.borderWidth > 0 && (
                <ColorPicker
                  label="Border Color"
                  value={props.borderColor || '#3b82f6'}
                  onChange={(color) => updateProps({ borderColor: color })}
                />
              )}
            </div>

            {/* Shadow */}
            <div>
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Shadow
              </Label>
              <Select 
                value={props.shadow || 'none'} 
                onValueChange={(value) => updateProps({ shadow: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        )}
      </div>

        {/* DESIGN TAB */}
        <TabsContent value="design" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            {/* Style Section */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 space-y-4">
                {/* Button Style Type */}
                <div>
                  <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Button Style
                  </Label>
                  <Select 
                    value={props.buttonStyle || 'filled'} 
                    onValueChange={(value) => updateProps({ buttonStyle: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="filled">Filled (Solid)</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="ghost">Ghost (Minimal)</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="glass">Glass (Blur)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Add other design settings here */}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* BEHAVIOR TAB */}
        <TabsContent value="behavior" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            {/* Actions Section */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="actions" title="Button Actions" icon={Zap} />
        {expandedSections.includes('actions') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            
            {/* Action Type */}
            <div>
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Click Action
              </Label>
              <Select 
                value={props.actionType || 'link'} 
                onValueChange={(value) => updateProps({ actionType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">
                    <div className="flex items-center gap-2">
                      <Link2 size={14} />
                      <span>Open Link</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="submit">
                    <div className="flex items-center gap-2">
                      <Send size={14} />
                      <span>Submit Form</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="download">
                    <div className="flex items-center gap-2">
                      <Download size={14} />
                      <span>Download File</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      <span>Call Phone</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      <span>Send Email</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="scroll">
                    <div className="flex items-center gap-2">
                      <ArrowRight size={14} />
                      <span>Scroll to Section</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="popup">
                    <div className="flex items-center gap-2">
                      <Maximize2 size={14} />
                      <span>Open Popup</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action-specific fields */}
            {props.actionType === 'link' && (
              <>
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">URL</Label>
                  <Input
                    value={props.url || ''}
                    onChange={(e) => updateProps({ url: e.target.value })}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600 dark:text-gray-400">Open in New Tab</Label>
                  <Switch
                    checked={props.openInNewTab || false}
                    onCheckedChange={(checked) => updateProps({ openInNewTab: checked })}
                  />
                </div>
              </>
            )}

            {props.actionType === 'download' && (
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">File URL</Label>
                <Input
                  value={props.downloadUrl || ''}
                  onChange={(e) => updateProps({ downloadUrl: e.target.value })}
                  placeholder="https://example.com/file.pdf"
                  type="url"
                />
              </div>
            )}

            {props.actionType === 'phone' && (
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Phone Number</Label>
                <Input
                  value={props.phoneNumber || ''}
                  onChange={(e) => updateProps({ phoneNumber: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                />
              </div>
            )}

            {props.actionType === 'email' && (
              <>
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Email Address</Label>
                  <Input
                    value={props.emailAddress || ''}
                    onChange={(e) => updateProps({ emailAddress: e.target.value })}
                    placeholder="contact@example.com"
                    type="email"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Subject (Optional)</Label>
                  <Input
                    value={props.emailSubject || ''}
                    onChange={(e) => updateProps({ emailSubject: e.target.value })}
                    placeholder="Email subject"
                  />
                </div>
              </>
            )}

            {props.actionType === 'scroll' && (
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Section ID</Label>
                <Input
                  value={props.scrollTarget || ''}
                  onChange={(e) => updateProps({ scrollTarget: e.target.value })}
                  placeholder="section-id"
                />
              </div>
            )}

            {props.actionType === 'popup' && (
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Popup ID</Label>
                <Input
                  value={props.popupId || ''}
                  onChange={(e) => updateProps({ popupId: e.target.value })}
                  placeholder="popup-id"
                />
              </div>
            )}

          </div>
        )}
      </div>

      {/* Animations Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <SectionHeader id="animations" title="Hover & Animations" icon={Play} />
        {expandedSections.includes('animations') && (
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
            
            {/* Hover Effect */}
            <div>
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Hover Effect
              </Label>
              <Select 
                value={props.hoverEffect || 'scale'} 
                onValueChange={(value) => updateProps({ hoverEffect: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="scale">Scale Up</SelectItem>
                  <SelectItem value="lift">Lift (Shadow)</SelectItem>
                  <SelectItem value="glow">Glow</SelectItem>
                  <SelectItem value="shine">Shine Effect</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="bounce">Bounce</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Click Animation */}
            <div>
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Click Animation
              </Label>
              <Select 
                value={props.clickAnimation || 'press'} 
                onValueChange={(value) => updateProps({ clickAnimation: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="press">Press Down</SelectItem>
                  <SelectItem value="ripple">Ripple Effect</SelectItem>
                  <SelectItem value="pulse">Pulse</SelectItem>
                  <SelectItem value="shake">Shake</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hover Colors */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Hover Colors (Optional)
              </Label>
              
              <div className="flex items-center justify-between">
                <Label className="text-xs text-gray-600 dark:text-gray-400">Custom Hover Colors</Label>
                <Switch
                  checked={props.useHoverColors || false}
                  onCheckedChange={(checked) => updateProps({ useHoverColors: checked })}
                />
              </div>

              {props.useHoverColors && (
                <>
                  <ColorPicker
                    label="Hover Background"
                    value={props.hoverBackgroundColor || '#2563eb'}
                    onChange={(color) => updateProps({ hoverBackgroundColor: color })}
                  />
                  <ColorPicker
                    label="Hover Text Color"
                    value={props.hoverTextColor || '#ffffff'}
                    onChange={(color) => updateProps({ hoverTextColor: color })}
                  />
                </>
              )}
            </div>

            {/* Transition Speed */}
            <div>
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Transition Speed
              </Label>
              <Select 
                value={props.transitionSpeed || 'normal'} 
                onValueChange={(value) => updateProps({ transitionSpeed: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Fast (150ms)</SelectItem>
                  <SelectItem value="normal">Normal (300ms)</SelectItem>
                  <SelectItem value="slow">Slow (500ms)</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
}
