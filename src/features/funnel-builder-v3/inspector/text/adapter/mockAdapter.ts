import { useState } from "react";
import { getDefaultTextSettings } from "../defaults";
import type { TextSettings, TextSubtype } from "../types";

/**
 * Mock adapter for demo/testing purposes
 * Simulates the store integration without requiring the full funnel editor
 */
export function useMockTextInspectorAdapter(subtype: TextSubtype) {
  const [settings, setSettings] = useState<TextSettings>(() => 
    getDefaultTextSettings(subtype)
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (newSettings: TextSettings) => {
    setSettings(newSettings);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => setIsEditing(false), 2000); // Auto-close after 2s for demo
  };

  return {
    settings,
    onChange: handleChange,
    onEditClick: handleEditClick,
    isEditing,
  };
}
