"use client";

import React from "react";

interface ElementPickerProps {
  value?: string;
  onChange: (elementId: string) => void;
}

export function ElementPicker({ value, onChange }: ElementPickerProps) {
  // TODO: Connect to actual element tree from store
  const mockElements = [
    { id: "elem-1", label: "CTA Button" },
    { id: "elem-2", label: "Form Section" },
    { id: "elem-3", label: "Testimonial" },
  ];

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
    >
      <option value="">Select element...</option>
      {mockElements.map((elem) => (
        <option key={elem.id} value={elem.id}>
          {elem.label}
        </option>
      ))}
    </select>
  );
}
