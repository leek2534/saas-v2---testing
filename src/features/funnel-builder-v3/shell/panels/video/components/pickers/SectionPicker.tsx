"use client";

import React from "react";

interface SectionPickerProps {
  value?: string;
  onChange: (sectionId: string) => void;
}

export function SectionPicker({ value, onChange }: SectionPickerProps) {
  // TODO: Connect to actual section tree from store
  const mockSections = [
    { id: "section-1", label: "Hero Section" },
    { id: "section-2", label: "Features Section" },
    { id: "section-3", label: "CTA Section" },
  ];

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
    >
      <option value="">Select section...</option>
      {mockSections.map((section) => (
        <option key={section.id} value={section.id}>
          {section.label}
        </option>
      ))}
    </select>
  );
}
