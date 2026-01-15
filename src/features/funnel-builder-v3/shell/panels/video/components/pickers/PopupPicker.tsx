"use client";

import React from "react";

interface PopupPickerProps {
  value?: string;
  onChange: (popupId: string) => void;
}

export function PopupPicker({ value, onChange }: PopupPickerProps) {
  // TODO: Connect to actual popup tree from store
  const mockPopups = [
    { id: "popup-1", label: "Exit Intent Popup" },
    { id: "popup-2", label: "Special Offer Popup" },
    { id: "popup-3", label: "Newsletter Signup" },
  ];

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
    >
      <option value="">Select popup...</option>
      {mockPopups.map((popup) => (
        <option key={popup.id} value={popup.id}>
          {popup.label}
        </option>
      ))}
    </select>
  );
}
