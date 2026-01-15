"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface DataAttrsEditorProps {
  value: Array<{ key: string; value: string }>;
  onChange: (value: Array<{ key: string; value: string }>) => void;
}

export function DataAttrsEditor({ value, onChange }: DataAttrsEditorProps) {
  const addAttr = () => {
    onChange([...value, { key: "", value: "" }]);
  };

  const removeAttr = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateAttr = (index: number, field: "key" | "value", newValue: string) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: newValue };
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      {value.map((attr, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder="key"
            value={attr.key}
            onChange={(e) => updateAttr(index, "key", e.target.value)}
            className="flex-1 text-xs"
          />
          <Input
            placeholder="value"
            value={attr.value}
            onChange={(e) => updateAttr(index, "value", e.target.value)}
            className="flex-1 text-xs"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeAttr(index)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={addAttr}
        className="w-full text-xs"
      >
        <Plus className="h-3 w-3 mr-1" />
        Add Attribute
      </Button>
    </div>
  );
}
