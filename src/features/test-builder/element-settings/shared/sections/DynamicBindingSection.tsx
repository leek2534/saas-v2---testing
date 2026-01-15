"use client";



/**
 * Dynamic Binding Section
 * 
 * Allows binding element content to CRM variables
 */

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Plus, X } from 'lucide-react';
import { SectionCard } from '../SectionCard';

interface DynamicBindingSectionProps {
  props: Record<string, any>;
  updateProps: (updates: any) => void;
}

const CRM_VARIABLES = [
  { value: '{{user.name}}', label: 'User Name', category: 'User' },
  { value: '{{user.email}}', label: 'User Email', category: 'User' },
  { value: '{{user.phone}}', label: 'User Phone', category: 'User' },
  { value: '{{user.company}}', label: 'User Company', category: 'User' },
  { value: '{{contact.firstName}}', label: 'Contact First Name', category: 'Contact' },
  { value: '{{contact.lastName}}', label: 'Contact Last Name', category: 'Contact' },
  { value: '{{contact.email}}', label: 'Contact Email', category: 'Contact' },
  { value: '{{contact.phone}}', label: 'Contact Phone', category: 'Contact' },
  { value: '{{deal.name}}', label: 'Deal Name', category: 'Deal' },
  { value: '{{deal.value}}', label: 'Deal Value', category: 'Deal' },
  { value: '{{deal.stage}}', label: 'Deal Stage', category: 'Deal' },
  { value: '{{booking.date}}', label: 'Booking Date', category: 'Booking' },
  { value: '{{booking.time}}', label: 'Booking Time', category: 'Booking' },
  { value: '{{booking.service}}', label: 'Booking Service', category: 'Booking' },
];

export function DynamicBindingSection({ props, updateProps }: DynamicBindingSectionProps) {
  const [showVariablePicker, setShowVariablePicker] = useState(false);

  const handleToggleDynamic = (checked: boolean) => {
    updateProps({ 
      dynamicContent: checked,
      dynamicVariable: checked ? '{{user.name}}' : undefined
    });
  };

  const handleVariableSelect = (variable: string) => {
    updateProps({ dynamicVariable: variable });
    setShowVariablePicker(false);
  };

  return (
    <SectionCard id="dynamic-binding" title="Dynamic Content" icon={Database}>
      <div className="space-y-3">
        {/* Toggle Dynamic Content */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <Label className="text-xs text-gray-700 dark:text-gray-300">Dynamic Content</Label>
            <p className="text-xs text-gray-500">Bind to CRM variable</p>
          </div>
          <Switch
            checked={props.dynamicContent || false}
            onCheckedChange={handleToggleDynamic}
          />
        </div>

        {/* Variable Selector */}
        {props.dynamicContent && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Variable
            </Label>
            
            {!showVariablePicker ? (
              <div className="flex gap-2">
                <Input
                  value={props.dynamicVariable || ''}
                  onChange={(e) => updateProps({ dynamicVariable: e.target.value })}
                  placeholder="{{variable_name}}"
                  className="font-mono text-sm flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowVariablePicker(true)}
                  className="h-9"
                >
                  <Database size={14} />
                </Button>
              </div>
            ) : (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Select Variable
                  </span>
                  <button
                    onClick={() => setShowVariablePicker(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {CRM_VARIABLES.map((variable) => (
                    <button
                      key={variable.value}
                      onClick={() => handleVariableSelect(variable.value)}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        {variable.label}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        {variable.value}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Preview */}
            {props.dynamicVariable && (
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-blue-900 dark:text-blue-100">
                  <span className="font-semibold">Preview: </span>
                  <span className="font-mono">{props.dynamicVariable}</span>
                </div>
                <p className="text-[10px] text-blue-700 dark:text-blue-300 mt-1">
                  This will be replaced with actual data at runtime
                </p>
              </div>
            )}

            {/* Fallback Text */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Fallback Text
              </Label>
              <Input
                value={props.fallbackText || ''}
                onChange={(e) => updateProps({ fallbackText: e.target.value })}
                placeholder="Shown if variable is empty"
                className="text-sm"
              />
              <p className="text-xs text-gray-500">
                Displayed when the variable has no value
              </p>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
