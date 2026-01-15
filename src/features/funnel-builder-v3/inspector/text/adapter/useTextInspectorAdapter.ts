import { useMemo } from "react";
import { useFunnelEditorStore } from "../../../store/store";
import { getDefaultTextSettings } from "../defaults";
import type { TextSettings, TextSubtype } from "../types";
import type { ElementNode } from "../../../store/types";

/**
 * Adapter hook to connect TextSettingsPanel to the funnel editor store
 * Converts between ElementNode props and TextSettings format
 */
export function useTextInspectorAdapter(node: ElementNode) {
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);
  const setEditingElement = useFunnelEditorStore((s) => s.setEditingElement);
  const editingElementId = useFunnelEditorStore((s) => s.editingElementId);

  const subtype: TextSubtype = 
    node.props.kind === "heading" ? "heading" :
    node.props.kind === "subheading" ? "subheading" :
    "paragraph";

  const settings: TextSettings = useMemo(() => {
    const defaults = getDefaultTextSettings(subtype);
    
    // Map ElementNode props to TextSettings
    return {
      ...defaults,
      subtype,
      content: {
        ...defaults.content,
        // Content is stored as TipTap JSON, extract plain text for display
        text: node.props.textContent || extractTextFromContent(node.props.content) || defaults.content.text,
        placeholder: node.props.placeholder ?? defaults.content.placeholder,
        allowLineBreaks: node.props.allowLineBreaks ?? defaults.content.allowLineBreaks,
        richTextEnabled: node.props.richTextEnabled ?? defaults.content.richTextEnabled,
        dynamicTokens: {
          enabled: node.props.dynamicTokensEnabled ?? defaults.content.dynamicTokens?.enabled ?? false,
          fallback: node.props.dynamicTokensFallback ?? defaults.content.dynamicTokens?.fallback,
        },
      },
      semanticTag: node.props.semanticTag ?? defaults.semanticTag,
      typography: {
        ...defaults.typography,
        fontSize: node.props.fontSize 
          ? { value: node.props.fontSize, unit: "px" as const }
          : defaults.typography.fontSize,
        fontWeight: node.props.fontWeight ?? defaults.typography.fontWeight,
        lineHeight: node.props.lineHeight
          ? { value: node.props.lineHeight, unit: "unitless" as const }
          : defaults.typography.lineHeight,
        align: node.props.align ?? defaults.typography.align,
        letterSpacing: node.props.letterSpacing
          ? { value: node.props.letterSpacing, unit: "px" as const }
          : defaults.typography.letterSpacing,
        transform: node.props.textTransform ?? defaults.typography.transform,
      },
      colorEffects: {
        ...defaults.colorEffects,
        color: node.props.color ?? defaults.colorEffects.color,
        opacity: node.props.opacity ?? defaults.colorEffects.opacity,
        highlight: node.props.highlightColor ? {
          enabled: true,
          color: node.props.highlightColor,
        } : defaults.colorEffects.highlight,
        shadow: node.props.textShadow ? {
          enabled: true,
          x: node.props.shadowX ?? 2,
          y: node.props.shadowY ?? 2,
          blur: node.props.shadowBlur ?? 4,
          color: node.props.shadowColor ?? "#000000",
          opacity: node.props.shadowOpacity ?? 0.3,
        } : defaults.colorEffects.shadow,
        stroke: node.props.textStrokeWidth ? {
          enabled: true,
          width: node.props.textStrokeWidth,
          color: node.props.textStrokeColor ?? "#000000",
        } : defaults.colorEffects.stroke,
      },
      layout: {
        ...defaults.layout,
        widthMode: node.props.widthMode ?? defaults.layout.widthMode,
        width: node.props.width ? {
          value: node.props.width,
          unit: node.props.widthUnit ?? "px",
        } : defaults.layout.width,
        maxWidth: node.props.maxWidth ? {
          value: node.props.maxWidth,
          unit: node.props.maxWidthUnit ?? "px",
        } : defaults.layout.maxWidth,
        padding: {
          top: node.props.paddingTop ?? defaults.layout.padding?.top ?? 12,
          right: node.props.paddingRight ?? defaults.layout.padding?.right ?? 16,
          bottom: node.props.paddingBottom ?? defaults.layout.padding?.bottom ?? 12,
          left: node.props.paddingLeft ?? defaults.layout.padding?.left ?? 16,
          unit: "px" as const,
        },
        margin: {
          top: node.props.marginTop ?? defaults.layout.margin?.top ?? 0,
          right: node.props.marginRight ?? defaults.layout.margin?.right ?? 0,
          bottom: node.props.marginBottom ?? defaults.layout.margin?.bottom ?? 0,
          left: node.props.marginLeft ?? defaults.layout.margin?.left ?? 0,
          unit: "px" as const,
        },
        clamp: node.props.lineClamp ? {
          enabled: true,
          lines: node.props.lineClamp,
        } : defaults.layout.clamp,
        whiteSpace: node.props.whiteSpace ?? defaults.layout.whiteSpace,
      },
      wrapper: {
        ...defaults.wrapper,
        background: node.props.wrapperBackgroundColor ? {
          enabled: true,
          color: node.props.wrapperBackgroundColor,
        } : defaults.wrapper.background,
        border: node.props.wrapperBorderWidth ? {
          enabled: true,
          width: node.props.wrapperBorderWidth,
          style: (node.props.wrapperBorderStyle ?? "solid") as any,
          color: node.props.wrapperBorderColor ?? "#e2e8f0",
        } : defaults.wrapper.border,
        shadow: node.props.wrapperShadow ?? defaults.wrapper.shadow,
        radius: node.props.wrapperBorderRadius ?? defaults.wrapper.radius,
      },
      responsive: {
        ...defaults.responsive,
        hiddenOn: {
          desktop: node.props.hideOnDesktop ?? false,
          tablet: node.props.hideOnTablet ?? false,
          mobile: node.props.hideOnMobile ?? false,
        },
        responsiveScale: node.props.responsiveScaleEnabled ? {
          enabled: true,
          minFontPx: node.props.responsiveMinFont ?? 24,
          maxFontPx: node.props.responsiveMaxFont ?? 64,
          minViewportPx: node.props.responsiveMinViewport ?? 375,
          maxViewportPx: node.props.responsiveMaxViewport ?? 1440,
        } : defaults.responsive.responsiveScale,
        mobileReadability: node.props.mobileReadabilityEnabled ? {
          enabled: true,
        } : defaults.responsive.mobileReadability,
      },
      actions: {
        ...defaults.actions,
        blockClick: {
          type: node.props.clickActionType ?? "none",
          url: node.props.clickActionUrl,
          openNewTab: node.props.clickActionNewTab,
          nofollow: node.props.clickActionNofollow,
          utmPassthrough: node.props.clickActionUtmPassthrough,
          sectionId: node.props.clickActionSectionId,
          popupId: node.props.clickActionPopupId,
        },
        linkStyle: {
          enabled: node.props.linkStyleEnabled ?? false,
          color: node.props.linkColor ?? "#3b82f6",
          underline: node.props.linkUnderline ?? "hover",
          hoverColor: node.props.linkHoverColor ?? "#2563eb",
        },
      },
      seoA11y: {
        ...defaults.seoA11y,
        ariaLabel: node.props.ariaLabel,
        lang: node.props.lang,
      },
      advanced: {
        ...defaults.advanced,
        classes: node.props.customClasses,
        dataAttrs: node.props.dataAttrs ?? [],
        tracking: node.props.trackingEnabled ? {
          enabled: true,
          eventName: node.props.trackingEventName,
        } : defaults.advanced.tracking,
      },
    };
  }, [node.props, subtype]);

  // Helper to extract plain text from TipTap JSON content
  function extractTextFromContent(content: any): string {
    if (!content || !content.content) return "";
    return content.content
      .map((node: any) => {
        if (node.type === "paragraph" && node.content) {
          return node.content.map((n: any) => n.text || "").join("");
        }
        return "";
      })
      .join("\n");
  }

  const handleChange = (newSettings: TextSettings) => {
    // Convert TextSettings back to ElementNode props format
    const updates: Record<string, any> = {
      // Typography
      fontSize: newSettings.typography.fontSize.value,
      fontWeight: newSettings.typography.fontWeight,
      lineHeight: newSettings.typography.lineHeight.value,
      align: newSettings.typography.align,
      letterSpacing: newSettings.typography.letterSpacing.value,
      textTransform: newSettings.typography.transform,
      
      // Color & Effects
      color: newSettings.colorEffects.color,
      opacity: newSettings.colorEffects.opacity,
      
      // Highlight
      highlightColor: newSettings.colorEffects.highlight?.enabled ? newSettings.colorEffects.highlight.color : undefined,
      
      // Text Shadow
      textShadow: newSettings.colorEffects.shadow?.enabled 
        ? `${newSettings.colorEffects.shadow.x}px ${newSettings.colorEffects.shadow.y}px ${newSettings.colorEffects.shadow.blur}px ${newSettings.colorEffects.shadow.color}`
        : undefined,
      shadowX: newSettings.colorEffects.shadow?.enabled ? newSettings.colorEffects.shadow.x : undefined,
      shadowY: newSettings.colorEffects.shadow?.enabled ? newSettings.colorEffects.shadow.y : undefined,
      shadowBlur: newSettings.colorEffects.shadow?.enabled ? newSettings.colorEffects.shadow.blur : undefined,
      shadowColor: newSettings.colorEffects.shadow?.enabled ? newSettings.colorEffects.shadow.color : undefined,
      shadowOpacity: newSettings.colorEffects.shadow?.enabled ? newSettings.colorEffects.shadow.opacity : undefined,
      
      // Text Stroke
      textStrokeWidth: newSettings.colorEffects.stroke?.enabled ? newSettings.colorEffects.stroke.width : undefined,
      textStrokeColor: newSettings.colorEffects.stroke?.enabled ? newSettings.colorEffects.stroke.color : undefined,
      
      // Layout - Width
      widthMode: newSettings.layout.widthMode,
      width: newSettings.layout.widthMode === "custom" ? newSettings.layout.width?.value : undefined,
      widthUnit: newSettings.layout.widthMode === "custom" ? newSettings.layout.width?.unit : undefined,
      maxWidth: newSettings.layout.maxWidth?.value,
      maxWidthUnit: newSettings.layout.maxWidth?.unit,
      
      // Layout - Padding
      paddingTop: newSettings.layout.padding?.top,
      paddingRight: newSettings.layout.padding?.right,
      paddingBottom: newSettings.layout.padding?.bottom,
      paddingLeft: newSettings.layout.padding?.left,
      
      // Layout - Margin
      marginTop: newSettings.layout.margin?.top,
      marginRight: newSettings.layout.margin?.right,
      marginBottom: newSettings.layout.margin?.bottom,
      marginLeft: newSettings.layout.margin?.left,
      
      // Layout - Line Clamp
      lineClamp: newSettings.layout.clamp?.enabled ? newSettings.layout.clamp.lines : undefined,
      
      // Layout - Whitespace
      whiteSpace: newSettings.layout.whiteSpace,
      
      // Wrapper
      wrapperBackgroundColor: newSettings.wrapper.background?.enabled ? newSettings.wrapper.background.color : undefined,
      wrapperBorderWidth: newSettings.wrapper.border?.enabled ? newSettings.wrapper.border.width : undefined,
      wrapperBorderStyle: newSettings.wrapper.border?.enabled ? newSettings.wrapper.border.style : undefined,
      wrapperBorderColor: newSettings.wrapper.border?.enabled ? newSettings.wrapper.border.color : undefined,
      wrapperShadow: newSettings.wrapper.shadow,
      wrapperBorderRadius: newSettings.wrapper.radius,
      
      // Content
      textContent: newSettings.content.text,
      placeholder: newSettings.content.placeholder,
      allowLineBreaks: newSettings.content.allowLineBreaks,
      richTextEnabled: newSettings.content.richTextEnabled,
      
      // Dynamic Variables
      dynamicTokensEnabled: newSettings.content.dynamicTokens?.enabled,
      dynamicTokensFallback: newSettings.content.dynamicTokens?.fallback,
      
      // Semantic Tag
      semanticTag: newSettings.semanticTag,
      
      // Responsive & Visibility
      hideOnDesktop: newSettings.responsive.hiddenOn.desktop,
      hideOnTablet: newSettings.responsive.hiddenOn.tablet,
      hideOnMobile: newSettings.responsive.hiddenOn.mobile,
      responsiveScaleEnabled: newSettings.responsive.responsiveScale?.enabled,
      responsiveMinFont: newSettings.responsive.responsiveScale?.minFontPx,
      responsiveMaxFont: newSettings.responsive.responsiveScale?.maxFontPx,
      responsiveMinViewport: newSettings.responsive.responsiveScale?.minViewportPx,
      responsiveMaxViewport: newSettings.responsive.responsiveScale?.maxViewportPx,
      mobileReadabilityEnabled: newSettings.responsive.mobileReadability?.enabled,
      
      // Actions & Links
      clickActionType: newSettings.actions.blockClick.type,
      clickActionUrl: newSettings.actions.blockClick.url,
      clickActionNewTab: newSettings.actions.blockClick.openNewTab,
      clickActionNofollow: newSettings.actions.blockClick.nofollow,
      clickActionUtmPassthrough: newSettings.actions.blockClick.utmPassthrough,
      clickActionSectionId: newSettings.actions.blockClick.sectionId,
      clickActionPopupId: newSettings.actions.blockClick.popupId,
      linkStyleEnabled: newSettings.actions.linkStyle.enabled,
      linkColor: newSettings.actions.linkStyle.color,
      linkUnderline: newSettings.actions.linkStyle.underline,
      linkHoverColor: newSettings.actions.linkStyle.hoverColor,
      
      // SEO & Accessibility
      ariaLabel: newSettings.seoA11y.ariaLabel,
      lang: newSettings.seoA11y.lang,
      
      // Advanced
      customClasses: newSettings.advanced.classes,
      dataAttrs: newSettings.advanced.dataAttrs,
      trackingEnabled: newSettings.advanced.tracking?.enabled,
      trackingEventName: newSettings.advanced.tracking?.eventName,
    };

    updateNodeProps(node.id, updates);
  };

  const handleEditClick = () => {
    setEditingElement(node.id);
  };

  const handleContentChange = (newContent: any) => {
    updateNodeProps(node.id, { content: newContent });
  };

  const isEditing = editingElementId === node.id;

  return {
    settings,
    onChange: handleChange,
    onEditClick: handleEditClick,
    isEditing,
    content: node.props.content,
    onContentChange: handleContentChange,
  };
}
