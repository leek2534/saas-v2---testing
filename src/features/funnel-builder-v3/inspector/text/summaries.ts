import type { TextSettings } from "./types";

/**
 * Generate compact summary strings for section headers
 */

export function computeContentSummary(settings: TextSettings): string {
  const parts: string[] = [];
  
  // Semantic tag
  parts.push(settings.semanticTag.toUpperCase());
  
  // Line clamp
  if (settings.layout.clamp?.enabled) {
    parts.push(`${settings.layout.clamp.lines} line clamp`);
  }
  
  return parts.join(" • ");
}

export function computeTypographySummary(settings: TextSettings): string {
  const t = settings.typography;
  const parts: string[] = [];
  
  // Font family (short)
  parts.push(t.fontFamily);
  
  // Font size
  parts.push(`${t.fontSize.value}${t.fontSize.unit}`);
  
  // Font weight
  parts.push(String(t.fontWeight));
  
  // Line height
  if (t.lineHeight.unit === "unitless") {
    parts.push(String(t.lineHeight.value));
  } else {
    parts.push(`${t.lineHeight.value}${t.lineHeight.unit}`);
  }
  
  return parts.join(" • ");
}

export function computeColorSummary(settings: TextSettings): string {
  const c = settings.colorEffects;
  const parts: string[] = [];
  
  // Color
  parts.push(c.color);
  
  // Opacity
  if (c.opacity < 1) {
    parts.push(`${Math.round(c.opacity * 100)}%`);
  }
  
  // Effects
  if (c.highlight?.enabled) parts.push("Highlight");
  if (c.shadow?.enabled) parts.push("Shadow");
  if (c.stroke?.enabled) parts.push("Stroke");
  
  return parts.join(" • ");
}

export function computeSpacingSummary(settings: TextSettings): string {
  const l = settings.layout;
  const parts: string[] = [];
  
  // Margin bottom (most common)
  if (l.margin && l.margin.bottom > 0) {
    parts.push(`MB ${l.margin.bottom}`);
  }
  
  // Max width
  if (l.maxWidth) {
    parts.push(`MaxW ${l.maxWidth.value}${l.maxWidth.unit}`);
  }
  
  // Width mode
  if (l.widthMode === "full") {
    parts.push("Full Width");
  } else if (l.widthMode === "custom" && l.width) {
    parts.push(`W ${l.width.value}${l.width.unit}`);
  }
  
  return parts.join(" • ") || "Default";
}

export function computeWrapperSummary(settings: TextSettings): string {
  const w = settings.wrapper;
  const parts: string[] = [];
  
  if (w.useSiteStyles) {
    return "Site Styles";
  }
  
  if (w.background?.enabled) parts.push("BG");
  if (w.border?.enabled) parts.push("Border");
  if (w.shadow && w.shadow !== "none") parts.push(`Shadow ${w.shadow}`);
  
  return parts.join(" • ") || "None";
}

export function computeResponsiveSummary(settings: TextSettings): string {
  const r = settings.responsive;
  const parts: string[] = [];
  
  // Hidden devices
  const hidden: string[] = [];
  if (r.hiddenOn.desktop) hidden.push("D");
  if (r.hiddenOn.tablet) hidden.push("T");
  if (r.hiddenOn.mobile) hidden.push("M");
  
  if (hidden.length > 0) {
    parts.push(`Hidden: ${hidden.join(",")}`);
  }
  
  // Responsive scale
  if (r.responsiveScale?.enabled) {
    parts.push("Responsive Scale");
  }
  
  return parts.join(" • ") || "Visible All";
}

export function computeActionsSummary(settings: TextSettings): string {
  const a = settings.actions.blockClick;
  
  if (a.type === "none") {
    return "No Action";
  }
  
  switch (a.type) {
    case "url":
      return `Click: URL${a.openNewTab ? " (new tab)" : ""}`;
    case "scroll":
      return "Click: Scroll";
    case "popup":
      return "Click: Popup";
    case "next_step":
      return "Click: Next Step";
    case "form_step":
      return "Click: Form Step";
    default:
      return "Action Set";
  }
}

export function computeSeoSummary(settings: TextSettings, warnings?: string[]): string {
  if (warnings && warnings.length > 0) {
    return `⚠️ ${warnings.length} issue${warnings.length > 1 ? "s" : ""}`;
  }
  
  if (settings.seoA11y.ariaLabel) {
    return "ARIA Label Set";
  }
  
  return "OK";
}

export function computeAdvancedSummary(settings: TextSettings): string {
  const a = settings.advanced;
  const parts: string[] = [];
  
  if (a.classes) parts.push("Classes");
  if (a.dataAttrs && a.dataAttrs.length > 0) parts.push(`${a.dataAttrs.length} Attrs`);
  if (a.tracking?.enabled) parts.push("Tracking");
  
  return parts.join(" • ") || "None";
}
