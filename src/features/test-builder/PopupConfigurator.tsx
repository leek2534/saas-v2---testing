"use client";



import React, { useState } from 'react';
import { useTestBuilderV2Store } from './store';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';

interface PopupConfiguratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PopupConfigurator({ isOpen, onClose }: PopupConfiguratorProps) {
  const { popup, updatePopup, sections } = useTestBuilderV2Store();
  const [expandedSections, setExpandedSections] = useState<string[]>(['trigger', 'backdrop']);
  const [showBackdropColorPicker, setShowBackdropColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);
  const [showShadowColorPicker, setShowShadowColorPicker] = useState(false);
  
  // Position options
  const positions = [
    { id: 'top-left', label: 'Top Left' },
    { id: 'top-center', label: 'Top Center' },
    { id: 'top-right', label: 'Top Right' },
    { id: 'center-left', label: 'Center Left' },
    { id: 'center', label: 'Center' },
    { id: 'center-right', label: 'Center Right' },
    { id: 'bottom-left', label: 'Bottom Left' },
    { id: 'bottom-center', label: 'Bottom Center' },
    { id: 'bottom-right', label: 'Bottom Right' },
  ];

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({ id, title }: { id: string; title: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
    >
      <span className="font-semibold text-sm text-gray-900 dark:text-white">{title}</span>
      {expandedSections.includes(id) ? (
        <ChevronUp size={16} className="text-gray-400" />
      ) : (
        <ChevronDown size={16} className="text-gray-400" />
      )}
    </button>
  );

  const ColorPicker = ({ 
    label, 
    value, 
    onChange, 
    showPicker, 
    setShowPicker 
  }: { 
    label: string; 
    value: string; 
    onChange: (color: string) => void;
    showPicker: boolean;
    setShowPicker: (show: boolean) => void;
  }) => (
    <div>
      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">{label}</Label>
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <div
            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm font-mono">{value}</span>
        </button>
        {showPicker && (
          <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
            <HexColorPicker color={value} onChange={onChange} />
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-2 text-xs font-mono"
            />
            <button
              onClick={() => setShowPicker(false)}
              className="w-full mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Get all elements from all sections for the element visibility trigger
  const allElements: Array<{ id: string; label: string }> = [];
  sections.forEach(section => {
    section.rows.forEach(row => {
      row.columns.forEach(column => {
        column.elements.forEach(element => {
          allElements.push({
            id: element.id,
            label: `${section.name} > ${row.name} > ${element.type}`
          });
        });
      });
    });
  });

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-[70] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Popup Settings</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Configure popup behavior and appearance</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Enable Popup */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <Label className="text-sm font-medium">Enable Popup</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Show popup on your funnel</p>
            </div>
            <Switch
              checked={popup.enabled}
              onCheckedChange={(checked) => updatePopup({ enabled: checked })}
            />
          </div>

          {/* Trigger Settings */}
          <div>
            <SectionHeader id="trigger" title="Trigger" />
            {expandedSections.includes('trigger') && (
              <div className="p-3 space-y-4">
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Trigger Type</Label>
                  <Select
                    value={popup.trigger}
                    onValueChange={(value: 'exit' | 'pageLoad' | 'elementVisible' | 'delay') => 
                      updatePopup({ trigger: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exit">Exit Intent</SelectItem>
                      <SelectItem value="pageLoad">Page Load</SelectItem>
                      <SelectItem value="delay">Time Delay</SelectItem>
                      <SelectItem value="elementVisible">Element Visible</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {popup.trigger === 'exit' && 'Show when user tries to leave'}
                    {popup.trigger === 'pageLoad' && 'Show immediately on page load'}
                    {popup.trigger === 'delay' && 'Show after specified time'}
                    {popup.trigger === 'elementVisible' && 'Show when scrolling to element'}
                  </p>
                </div>

                {popup.trigger === 'delay' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Delay Value</Label>
                      <Input
                        type="number"
                        value={popup.delay?.value || 5}
                        onChange={(e) => updatePopup({ 
                          delay: { ...popup.delay, value: parseInt(e.target.value) || 5, unit: popup.delay?.unit || 'seconds' } 
                        })}
                        min="1"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Unit</Label>
                      <Select
                        value={popup.delay?.unit || 'seconds'}
                        onValueChange={(value: 'seconds' | 'minutes') => 
                          updatePopup({ delay: { ...popup.delay, value: popup.delay?.value || 5, unit: value } })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="seconds">Seconds</SelectItem>
                          <SelectItem value="minutes">Minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {popup.trigger === 'elementVisible' && (
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Target Element</Label>
                    <Select
                      value={popup.elementId}
                      onValueChange={(value) => updatePopup({ elementId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select element..." />
                      </SelectTrigger>
                      <SelectContent>
                        {allElements.map(el => (
                          <SelectItem key={el.id} value={el.id}>{el.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Backdrop Settings */}
          <div>
            <SectionHeader id="backdrop" title="Backdrop" />
            {expandedSections.includes('backdrop') && (
              <div className="p-3 space-y-4">
                <ColorPicker
                  label="Backdrop Color"
                  value={popup.backdrop.color}
                  onChange={(color) => updatePopup({ backdrop: { ...popup.backdrop, color } })}
                  showPicker={showBackdropColorPicker}
                  setShowPicker={setShowBackdropColorPicker}
                />

                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                    Opacity: {popup.backdrop.opacity}%
                  </Label>
                  <Slider
                    value={[popup.backdrop.opacity]}
                    onValueChange={([value]) => updatePopup({ backdrop: { ...popup.backdrop, opacity: value } })}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Padding Settings */}
          <div>
            <SectionHeader id="padding" title="Padding" />
            {expandedSections.includes('padding') && (
              <div className="p-3 space-y-4">
                {/* Left Padding */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Left: {popup.padding.left}px</Label>
                    <Input
                      type="number"
                      value={popup.padding.left}
                      onChange={(e) => updatePopup({ 
                        padding: { ...popup.padding, left: parseInt(e.target.value) || 0 } 
                      })}
                      className="text-sm w-20"
                    />
                  </div>
                  <Slider
                    value={[popup.padding.left]}
                    onValueChange={([value]) => updatePopup({ padding: { ...popup.padding, left: value } })}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>

                {/* Right Padding */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Right: {popup.padding.right}px</Label>
                    <Input
                      type="number"
                      value={popup.padding.right}
                      onChange={(e) => updatePopup({ 
                        padding: { ...popup.padding, right: parseInt(e.target.value) || 0 } 
                      })}
                      className="text-sm w-20"
                    />
                  </div>
                  <Slider
                    value={[popup.padding.right]}
                    onValueChange={([value]) => updatePopup({ padding: { ...popup.padding, right: value } })}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>

                {/* Top Padding */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Top: {popup.padding.top}px</Label>
                    <Input
                      type="number"
                      value={popup.padding.top}
                      onChange={(e) => updatePopup({ 
                        padding: { ...popup.padding, top: parseInt(e.target.value) || 0 } 
                      })}
                      className="text-sm w-20"
                    />
                  </div>
                  <Slider
                    value={[popup.padding.top]}
                    onValueChange={([value]) => updatePopup({ padding: { ...popup.padding, top: value } })}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>

                {/* Bottom Padding */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Bottom: {popup.padding.bottom}px</Label>
                    <Input
                      type="number"
                      value={popup.padding.bottom}
                      onChange={(e) => updatePopup({ 
                        padding: { ...popup.padding, bottom: parseInt(e.target.value) || 0 } 
                      })}
                      className="text-sm w-20"
                    />
                  </div>
                  <Slider
                    value={[popup.padding.bottom]}
                    onValueChange={([value]) => updatePopup({ padding: { ...popup.padding, bottom: value } })}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Size Settings */}
          <div>
            <SectionHeader id="size" title="Size" />
            {expandedSections.includes('size') && (
              <div className="p-3 space-y-4">
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                    Width: {popup.size.width}%
                  </Label>
                  <Slider
                    value={[popup.size.width]}
                    onValueChange={([value]) => updatePopup({ size: { ...popup.size, width: value } })}
                    min={20}
                    max={100}
                    step={5}
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Max Width (px)</Label>
                  <Input
                    type="number"
                    value={popup.size.maxWidth}
                    onChange={(e) => updatePopup({ 
                      size: { ...popup.size, maxWidth: parseInt(e.target.value) || 600 } 
                    })}
                    className="text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Position Settings */}
          <div>
            <SectionHeader id="position" title="Position" />
            {expandedSections.includes('position') && (
              <div className="p-3">
                <Label className="text-xs text-gray-600 dark:text-gray-400 mb-3 block">Popup Position</Label>
                <div className="grid grid-cols-3 gap-2">
                  {positions.map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => updatePopup({ position: pos.id as any })}
                      className={cn(
                        'p-3 rounded-lg border-2 text-xs font-medium transition-all',
                        popup.position === pos.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 text-gray-600 dark:text-gray-400'
                      )}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Background Settings */}
          <div>
            <SectionHeader id="background" title="Background" />
            {expandedSections.includes('background') && (
              <div className="p-3 space-y-4">
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Background Type</Label>
                  <Select
                    value={popup.background.type}
                    onValueChange={(value: 'color' | 'image' | 'gradient' | 'video') => 
                      updatePopup({ background: { ...popup.background, type: value } })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">Color</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {popup.background.type === 'color' && (
                  <ColorPicker
                    label="Background Color"
                    value={popup.background.color || '#ffffff'}
                    onChange={(color) => updatePopup({ background: { ...popup.background, color } })}
                    showPicker={showBgColorPicker}
                    setShowPicker={setShowBgColorPicker}
                  />
                )}

                {popup.background.type === 'gradient' && (
                  <>
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Gradient Type</Label>
                      <Select
                        value={popup.background.gradient?.type || 'linear'}
                        onValueChange={(value: 'linear' | 'radial') => 
                          updatePopup({ 
                            background: { 
                              ...popup.background, 
                              gradient: { ...popup.background.gradient!, type: value } 
                            } 
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linear">Linear</SelectItem>
                          <SelectItem value="radial">Radial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {popup.background.gradient?.type === 'linear' && (
                      <div>
                        <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                          Angle: {popup.background.gradient.angle}°
                        </Label>
                        <Slider
                          value={[popup.background.gradient.angle]}
                          onValueChange={([value]) => updatePopup({ 
                            background: { 
                              ...popup.background, 
                              gradient: { ...popup.background.gradient!, angle: value } 
                            } 
                          })}
                          min={0}
                          max={360}
                          step={1}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Gradient Colors</Label>
                      {popup.background.gradient?.colors.map((colorStop, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="color"
                            value={colorStop.color}
                            onChange={(e) => {
                              const newColors = [...popup.background.gradient!.colors];
                              newColors[index] = { ...newColors[index], color: e.target.value };
                              updatePopup({ 
                                background: { 
                                  ...popup.background, 
                                  gradient: { ...popup.background.gradient!, colors: newColors } 
                                } 
                              });
                            }}
                            className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                          <Input
                            type="number"
                            value={colorStop.position}
                            onChange={(e) => {
                              const newColors = [...popup.background.gradient!.colors];
                              newColors[index] = { ...newColors[index], position: parseInt(e.target.value) || 0 };
                              updatePopup({ 
                                background: { 
                                  ...popup.background, 
                                  gradient: { ...popup.background.gradient!, colors: newColors } 
                                } 
                              });
                            }}
                            min="0"
                            max="100"
                            className="text-sm flex-1"
                            placeholder="Position %"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {popup.background.type === 'image' && (
                  <>
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Image URL</Label>
                      <Input
                        type="text"
                        value={popup.background.image || ''}
                        onChange={(e) => updatePopup({ background: { ...popup.background, image: e.target.value } })}
                        placeholder="https://..."
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Image Style</Label>
                      <Select
                        value={popup.background.imageStyle}
                        onValueChange={(value: 'cover' | 'contain' | 'parallax') => 
                          updatePopup({ background: { ...popup.background, imageStyle: value } })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cover">Cover</SelectItem>
                          <SelectItem value="contain">Contain</SelectItem>
                          <SelectItem value="parallax">Parallax</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Image Fit</Label>
                      <Input
                        type="text"
                        value={popup.background.imageFit || 'center'}
                        onChange={(e) => updatePopup({ background: { ...popup.background, imageFit: e.target.value } })}
                        placeholder="center, top, bottom, etc."
                        className="text-sm"
                      />
                    </div>
                  </>
                )}

                {popup.background.type === 'video' && (
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Video URL</Label>
                    <Input
                      type="text"
                      value={popup.background.video || ''}
                      onChange={(e) => updatePopup({ background: { ...popup.background, video: e.target.value } })}
                      placeholder="https://... (MP4, WebM)"
                      className="text-sm"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Video will autoplay, loop, and be muted
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Border Settings */}
          <div>
            <SectionHeader id="border" title="Border" />
            {expandedSections.includes('border') && (
              <div className="p-3 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Enable Border</Label>
                  <Switch
                    checked={popup.border.enabled}
                    onCheckedChange={(checked) => updatePopup({ border: { ...popup.border, enabled: checked } })}
                  />
                </div>

                {popup.border.enabled && (
                  <>
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Border Width (px)</Label>
                      <Input
                        type="number"
                        value={popup.border.width}
                        onChange={(e) => updatePopup({ 
                          border: { ...popup.border, width: parseInt(e.target.value) || 1 } 
                        })}
                        className="text-sm"
                      />
                    </div>

                    <ColorPicker
                      label="Border Color"
                      value={popup.border.color}
                      onChange={(color) => updatePopup({ border: { ...popup.border, color } })}
                      showPicker={showBorderColorPicker}
                      setShowPicker={setShowBorderColorPicker}
                    />

                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Border Style</Label>
                      <Select
                        value={popup.border.style}
                        onValueChange={(value: 'solid' | 'dashed' | 'dotted') => 
                          updatePopup({ border: { ...popup.border, style: value } })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="dashed">Dashed</SelectItem>
                          <SelectItem value="dotted">Dotted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Shadow Settings */}
          <div>
            <SectionHeader id="shadow" title="Shadow" />
            {expandedSections.includes('shadow') && (
              <div className="p-3 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Enable Shadow</Label>
                  <Switch
                    checked={popup.shadow.enabled}
                    onCheckedChange={(checked) => updatePopup({ shadow: { ...popup.shadow, enabled: checked } })}
                  />
                </div>

                {popup.shadow.enabled && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">X Offset</Label>
                        <Input
                          type="number"
                          value={popup.shadow.x}
                          onChange={(e) => updatePopup({ 
                            shadow: { ...popup.shadow, x: parseInt(e.target.value) || 0 } 
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Y Offset</Label>
                        <Input
                          type="number"
                          value={popup.shadow.y}
                          onChange={(e) => updatePopup({ 
                            shadow: { ...popup.shadow, y: parseInt(e.target.value) || 0 } 
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Blur</Label>
                        <Input
                          type="number"
                          value={popup.shadow.blur}
                          onChange={(e) => updatePopup({ 
                            shadow: { ...popup.shadow, blur: parseInt(e.target.value) || 0 } 
                          })}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <ColorPicker
                      label="Shadow Color"
                      value={popup.shadow.color}
                      onChange={(color) => updatePopup({ shadow: { ...popup.shadow, color } })}
                      showPicker={showShadowColorPicker}
                      setShowPicker={setShowShadowColorPicker}
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Corners Settings */}
          <div>
            <SectionHeader id="corners" title="Corners" />
            {expandedSections.includes('corners') && (
              <div className="p-3 space-y-4">
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                    Border Radius: {popup.corners.radius}px
                  </Label>
                  <Slider
                    value={[popup.corners.radius]}
                    onValueChange={([value]) => updatePopup({ corners: { radius: value } })}
                    min={0}
                    max={50}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Square</span>
                    <span>Rounded</span>
                    <span>Circle</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
