export type TextSubtype = "heading" | "subheading" | "paragraph";
export type Device = "desktop" | "tablet" | "mobile";

export type TextSemanticTag =
  | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  | "p" | "lead" | "small";

export type TextActionType = "none" | "url" | "scroll" | "popup" | "next_step" | "form_step";

export interface TextAction {
  type: TextActionType;
  url?: string;
  openNewTab?: boolean;
  nofollow?: boolean;
  sectionId?: string;
  popupId?: string;
  stepId?: string;
  formStepId?: string;
  utmPassthrough?: boolean;
}

export interface LinkStyle {
  enabled: boolean;
  color?: string;
  underline?: "always" | "hover" | "never";
  hoverColor?: string;
}

export interface TextTypography {
  fontFamily: string;
  fontWeight: number;
  fontSize: { value: number; unit: "px" | "rem" };
  lineHeight: { value: number; unit: "unitless" | "px" };
  letterSpacing: { value: number; unit: "px" | "em" };
  align: "left" | "center" | "right" | "justify";
  transform: "none" | "uppercase" | "lowercase" | "capitalize";
  wrap: "normal" | "break-word" | "balance" | "nowrap";
  hyphenation?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
}

export interface TextColorEffects {
  color: string;
  opacity: number;
  highlight?: { enabled: boolean; color: string };
  shadow?: { enabled: boolean; x: number; y: number; blur: number; color: string; opacity: number };
  stroke?: { enabled: boolean; width: number; color: string };
}

export interface SpacingBox {
  top: number;
  right: number;
  bottom: number;
  left: number;
  unit: "px";
}

export interface TextLayout {
  widthMode: "auto" | "full" | "custom";
  width?: { value: number; unit: "px" | "%" };
  maxWidth?: { value: number; unit: "px" | "%" };
  alignSelf?: "left" | "center" | "right";
  margin?: SpacingBox;
  padding?: SpacingBox;
  display?: "block" | "inline-block";
  whiteSpace?: "normal" | "pre-wrap";
  overflow?: "visible" | "hidden";
  columns?: { enabled: boolean; count: number; gap: number };
  clamp?: { enabled: boolean; lines: number };
}

export interface WrapperStyle {
  useSiteStyles: boolean;
  background?: { enabled: boolean; color: string };
  border?: { enabled: boolean; width: number; style: "solid" | "dashed" | "dotted"; color: string };
  radius?: number;
  shadow?: "none" | "sm" | "md" | "lg" | "custom";
}

export interface ResponsiveRules {
  hiddenOn: { desktop: boolean; tablet: boolean; mobile: boolean };
  responsiveScale?: {
    enabled: boolean;
    minFontPx: number;
    maxFontPx: number;
    minViewportPx: number;
    maxViewportPx: number;
  };
  mobileReadability?: { enabled: boolean };
}

export interface SEOA11y {
  ariaLabel?: string;
  lang?: string;
}

export interface AdvancedSettings {
  classes?: string;
  dataAttrs?: Array<{ key: string; value: string }>;
  tracking?: { enabled: boolean; eventName?: string };
}

export interface TextContent {
  text: string;
  placeholder?: string;
  richTextEnabled?: boolean;
  allowLineBreaks?: boolean;
  dynamicTokens?: { enabled: boolean; fallback?: string };
}

export interface TextSettings {
  subtype: TextSubtype;
  semanticTag: TextSemanticTag;
  content: TextContent;
  typography: TextTypography;
  colorEffects: TextColorEffects;
  layout: TextLayout;
  wrapper: WrapperStyle;
  actions: { blockClick: TextAction; linkStyle: LinkStyle; ctaBadge?: any };
  responsive: ResponsiveRules;
  seoA11y: SEOA11y;
  advanced: AdvancedSettings;
  overrides?: Partial<Record<Device, Partial<TextSettings>>>;
}

export interface PresetDefinition {
  id: string;
  name: string;
  description: string;
  subtypes: TextSubtype[];
  patch: Partial<TextSettings>;
}
