"use client";

import React from "react";
import { TextSettingsPanel } from "../../inspector/text/TextSettingsPanel";
import { useTextInspectorAdapter } from "../../inspector/text/adapter/useTextInspectorAdapter";
import type { ElementNode } from "../../store/types";

interface TextPanelWrapperProps {
  node: ElementNode;
  breadcrumbs: Array<{ id: string; type: string; label: string }>;
  onBreadcrumbClick: (id: string) => void;
  onCollapse: () => void;
}

export function TextPanelWrapper({ 
  node, 
  breadcrumbs, 
  onBreadcrumbClick, 
  onCollapse 
}: TextPanelWrapperProps) {
  // Hook is always called unconditionally in this component
  const textAdapter = useTextInspectorAdapter(node);

  return (
    <TextSettingsPanel
      {...textAdapter}
      breadcrumbs={breadcrumbs}
      onBreadcrumbClick={onBreadcrumbClick}
      onCollapse={onCollapse}
    />
  );
}
