"use client";

import React, { useCallback, useMemo, useState } from "react";
import type { ElementNode } from "../../store/types";
import { useDomRegistry } from "../../overlays/DomRegistry";
import { useFunnelEditorStore } from "../../store/store";
import { cn } from "@/lib/utils";
import type { JSONContent } from "@tiptap/core";
import { RichText } from "../../editor/RichText";
import { CheckoutFormMockup } from "../../elements/CheckoutFormMockup";
import { CheckoutPreview } from "../../elements/CheckoutPreview";
import { CheckoutStepIndicator } from "../../elements/CheckoutStepIndicator";
import { CheckoutStepsMockup } from "../../elements/checkout/CheckoutStepsMockup";
import { CheckoutContactMockup } from "../../elements/checkout/CheckoutContactMockup";
import { CheckoutContactRuntime } from "../../elements/checkout/CheckoutContactRuntime";
import { CheckoutProductsMockup } from "../../elements/checkout/CheckoutProductsMockup";
import { CheckoutProductsRuntime } from "../../elements/checkout/CheckoutProductsRuntime";
import { CheckoutSummaryMockup } from "../../elements/checkout/CheckoutSummaryMockup";
import { CheckoutSummaryRuntime } from "../../elements/checkout/CheckoutSummaryRuntime";
import { CheckoutPaymentMockup } from "../../elements/checkout/CheckoutPaymentMockup";
import { CheckoutPaymentRuntime } from "../../elements/checkout/CheckoutPaymentRuntime";
import { CheckoutBumpMockup } from "../../elements/checkout/CheckoutBumpMockup";
import { CheckoutButtonMockup } from "../../elements/checkout/CheckoutButtonMockup";
import { HeroMockup } from "../../elements/website/HeroMockup";
import { NavbarMockup } from "../../elements/website/NavbarMockup";
import { FooterMockup } from "../../elements/website/FooterMockup";
import { FeatureGridMockup } from "../../elements/website/FeatureGridMockup";
import { CTASectionMockup } from "../../elements/website/CTASectionMockup";

const SHADOW: Record<string, string> = {
  none: "none",
  sm: "0 1px 2px rgba(2,6,23,0.08)",
  md: "0 8px 20px rgba(2,6,23,0.10)",
  lg: "0 18px 40px rgba(2,6,23,0.14)",
};

function defaultDoc(text: string): JSONContent {
  return {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  } as any;
}

function richDefault(kind: string): JSONContent {
  if (kind === "heading") return defaultDoc("Heading");
  if (kind === "subheading") return defaultDoc("Subheading");
  return defaultDoc("Paragraph");
}

export function Element({ node }: { node: ElementNode }) {
  const register = useDomRegistry((s) => s.register);
  const select = useFunnelEditorStore((s) => s.select);
  const mode = useFunnelEditorStore((s) => s.mode);
  const editingElementId = useFunnelEditorStore((s) => s.editingElementId);
  const setEditingElement = useFunnelEditorStore((s) => s.setEditingElement);
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);
  const openPopup = useFunnelEditorStore((s) => s.openPopup);
  const closePopup = useFunnelEditorStore((s) => s.closePopup);

  const kind = node.props.kind;
  const isPreview = mode === "preview";
  const isEditing = !isPreview && editingElementId === node.id;

  const refCb = useCallback((el: HTMLElement | null) => register(node.id, el), [node.id, register]);

  const pX = node.props.paddingX ?? 0;
  const pY = node.props.paddingY ?? 0;

  const align = node.props.align ?? "left";
  const alignClass = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  const wrapperStyle: React.CSSProperties = useMemo(
    () => ({
      paddingTop: node.props.paddingTop ?? pY,
      paddingBottom: node.props.paddingBottom ?? pY,
      paddingLeft: node.props.paddingLeft ?? pX,
      paddingRight: node.props.paddingRight ?? pX,
      background: node.props.background,
      boxShadow: node.props.boxShadow || (node.props.shadow ? SHADOW[node.props.shadow] : undefined),
      marginTop: node.props.marginTop ?? 0,
      marginBottom: node.props.gapToNext ? node.props.gapToNext : (node.props.marginBottom ?? 0),
      marginLeft: node.props.marginLeft ?? 0,
      marginRight: node.props.marginRight ?? 0,
      minHeight: 0,
    }),
    [pY, pX, node.props]
  );

  const [copied, setCopied] = useState(false);

  const selectedId = useFunnelEditorStore((s) => s.selectedId);

  const onClick = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    
    // Clear any existing editing state when clicking a different element
    const st = useFunnelEditorStore.getState();
    if (st.editingElementId && st.editingElementId !== node.id) {
      setEditingElement(null);
    }
    
    // Always select this element on click
    select(node.id);
    
    // For text elements, second click starts editing if already selected
    if ((kind === "heading" || kind === "subheading" || kind === "text" || kind === "paragraph") && selectedId === node.id) {
      setEditingElement(node.id);
    }
  };

  const onWrapperDoubleClick = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    e.preventDefault();
  };

  const commonTextStyle: React.CSSProperties = {
    color: node.props.color ?? "#334155",
    fontSize: node.props.fontSize ?? (kind === "heading" ? 36 : kind === "subheading" ? 20 : 16),
    fontWeight: node.props.fontWeight ?? (kind === "heading" ? 700 : kind === "subheading" ? 600 : 400),
    lineHeight: node.props.lineHeight ?? (kind === "heading" ? 1.1 : kind === "subheading" ? 1.2 : 1.5),
    letterSpacing: node.props.letterSpacing,
    opacity: node.props.opacity ?? 1,
  };

  const textInlineStyle: React.CSSProperties = {
    backgroundColor: node.props.highlightColor,
    WebkitTextStroke: node.props.textStrokeWidth 
      ? `${node.props.textStrokeWidth}px ${node.props.textStrokeColor ?? '#000000'}`
      : undefined,
  };

  const content = (node.props.content ?? richDefault(kind)) as JSONContent;

  // Handle click actions
  const handleBlockClick = (e: React.MouseEvent) => {
    if (isPreview && node.props.clickActionType && node.props.clickActionType !== 'none') {
      e.preventDefault();
      const actionType = node.props.clickActionType;
      
      if (actionType === 'url' && node.props.clickActionUrl) {
        const target = node.props.clickActionNewTab ? '_blank' : '_self';
        const rel = node.props.clickActionNofollow ? 'nofollow' : undefined;
        window.open(node.props.clickActionUrl, target, rel ? `rel=${rel}` : undefined);
      } else if (actionType === 'scroll' && node.props.clickActionSectionId) {
        const element = document.getElementById(node.props.clickActionSectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
      // Add more action types as needed
    }
  };

  const renderContent = () => {
    switch (kind) {
      case "heading":
      case "subheading":
      case "text":
      case "paragraph":
        // Check responsive visibility
        const isHidden = 
          (node.props.hideOnDesktop && !isPreview) ||
          (node.props.hideOnTablet && !isPreview) ||
          (node.props.hideOnMobile && !isPreview);
        
        if (isHidden) return null;
        
        const hasClickAction = node.props.clickActionType && node.props.clickActionType !== 'none';
        
        return (
          <div
            ref={refCb}
            data-node-id={isPreview ? undefined : node.id}
            data-node-type={isPreview ? undefined : "element"}
            className={cn(
              "w-full pointer-events-auto",
              node.props.customClasses,
              alignClass,
              node.props.lineClamp && `line-clamp-${node.props.lineClamp}`,
              hasClickAction && isPreview && "cursor-pointer"
            )}
            onClick={hasClickAction ? handleBlockClick : undefined}
            aria-label={node.props.ariaLabel}
            lang={node.props.lang}
            {...(node.props.dataAttrs?.reduce((acc: any, attr: any) => {
              acc[`data-${attr.key}`] = attr.value;
              return acc;
            }, {}) ?? {})}
            style={{
              ...commonTextStyle,
              display: node.props.lineClamp ? '-webkit-box' : 'block',
              WebkitLineClamp: node.props.lineClamp,
              WebkitBoxOrient: node.props.lineClamp ? 'vertical' : undefined,
              overflow: node.props.lineClamp ? 'hidden' : undefined,
              width: node.props.widthMode === 'full' ? '100%' : node.props.widthMode === 'custom' && node.props.width ? `${node.props.width}${node.props.widthUnit ?? 'px'}` : 'auto',
              maxWidth: node.props.maxWidth ? `${node.props.maxWidth}${node.props.maxWidthUnit ?? 'px'}` : undefined,
              paddingTop: node.props.paddingTop ?? 12,
              paddingBottom: node.props.paddingBottom ?? 12,
              paddingLeft: node.props.paddingLeft ?? 16,
              paddingRight: node.props.paddingRight ?? 16,
              marginTop: node.props.marginTop ?? 0,
              marginRight: node.props.marginRight ?? 0,
              marginBottom: node.props.marginBottom ?? 0,
              marginLeft: node.props.marginLeft ?? 0,
              border: node.props.wrapperBorderWidth ? `${node.props.wrapperBorderWidth}px ${node.props.wrapperBorderStyle ?? 'solid'} ${node.props.wrapperBorderColor ?? '#e2e8f0'}` : undefined,
              textTransform: node.props.textTransform as any,
              textDecoration: node.props.textDecoration,
              backgroundColor: node.props.wrapperBackgroundColor,
              textShadow: node.props.textShadow,
              borderRadius: node.props.wrapperBorderRadius ?? 0,
              boxShadow: node.props.wrapperShadow === 'sm' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' :
                         node.props.wrapperShadow === 'md' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' :
                         node.props.wrapperShadow === 'lg' ? '0 10px 15px -3px rgb(0 0 0 / 0.1)' : undefined,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: node.props.whiteSpace ?? 'normal',
            } as React.CSSProperties}
            onKeyDown={(e) => {
              if (e.key === "Escape") setEditingElement(null);
            }}
            onClick={!hasClickAction ? onClick : undefined}
            onDoubleClick={!hasClickAction ? onWrapperDoubleClick : undefined}
          >
            <div 
              style={{
                ...textInlineStyle,
                // Apply link styles if enabled
                ...(node.props.linkStyleEnabled && {
                  '--link-color': node.props.linkColor ?? '#3b82f6',
                  '--link-hover-color': node.props.linkHoverColor ?? '#2563eb',
                } as any),
              }}
              className={cn(
                node.props.linkStyleEnabled && "[&_a]:transition-colors",
                node.props.linkStyleEnabled && node.props.linkUnderline === 'always' && "[&_a]:underline",
                node.props.linkStyleEnabled && node.props.linkUnderline === 'hover' && "[&_a]:hover:underline",
                node.props.linkStyleEnabled && "[&_a]:text-[var(--link-color)] [&_a:hover]:text-[var(--link-hover-color)]"
              )}
            >
              <RichText
                value={content}
                editable={isEditing}
                onChange={(next) => updateNodeProps(node.id, { content: next})}
                className={cn(
                  "w-full",
                  isEditing 
                    ? "min-h-[1em]" 
                    : !hasClickAction && "cursor-pointer hover:bg-slate-50/50 rounded transition-colors"
                )}
              />
            </div>
          </div>
        );

      case "button":
        {
          const action = node.props.action ?? "link";
          const isLink = action === "link";
          const isOpenPopup = action === "popup";
          const isClosePopup = action === "closePopup";

          const Base = (
            <span
              className={cn(
                "inline-flex items-center justify-center transition",
                node.props.fullWidth ? "w-full" : ""
              )}
              style={{
                background: node.props.background ?? "#2563eb",
                color: node.props.color ?? "#ffffff",
                borderRadius: node.props.borderRadius ?? 10,
                paddingLeft: node.props.paddingX ?? 18,
                paddingRight: node.props.paddingX ?? 18,
                paddingTop: node.props.paddingY ?? 12,
                paddingBottom: node.props.paddingY ?? 12,
                fontWeight: 600,
                border: node.props.borderWidth
                  ? `${node.props.borderWidth}px solid ${node.props.borderColor ?? "transparent"}`
                  : undefined,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as any;
                if (node.props.hoverBackground) el.style.background = node.props.hoverBackground;
                if (node.props.hoverColor) el.style.color = node.props.hoverColor;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as any;
                el.style.background = node.props.background ?? "#2563eb";
                el.style.color = node.props.color ?? "#ffffff";
              }}
            >
              {node.props.text ?? "Button"}
            </span>
          );

          const onClick = () => {
            if (!isPreview) return;
            if (isOpenPopup && node.props.popupId) openPopup(node.props.popupId, "manual");
            if (isClosePopup) closePopup();
          };

          return (
          <div
            className={cn(
              align === "center" ? "flex justify-center" : align === "right" ? "flex justify-end" : "flex justify-start"
            )}
          >
            {isLink ? (
              <a
                href={node.props.href ?? "#"}
                target={node.props.targetBlank ? "_blank" : undefined}
                rel={node.props.targetBlank ? "noopener noreferrer" : undefined}
                className={cn(node.props.fullWidth ? "w-full" : "")}
              >
                {Base}
              </a>
            ) : (
              <button
                type="button"
                className={cn(node.props.fullWidth ? "w-full" : "")}
                onClick={onClick}
              >
                {Base}
              </button>
            )}
          </div>
          );
        }

      case "couponCode":
        return (
          <div className={cn("w-full", alignClass)}>
            {node.props.label ? (
              <div className="mb-2 text-xs font-medium text-slate-500">{node.props.label}</div>
            ) : null}
            <div className="flex items-center gap-2">
              <div
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800"
                style={{
                  background: node.props.background ?? "#f8fafc",
                  borderColor: node.props.borderColor ?? "#e2e8f0",
                  borderWidth: node.props.borderWidth ?? 1,
                  borderRadius: node.props.borderRadius ?? 14,
                }}
              >
                {node.props.code ?? "SAVE20"}
              </div>
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={async () => {
                  const code = node.props.code ?? "";
                  if (!code) return;
                  try {
                    await navigator.clipboard.writeText(code);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 900);
                  } catch {
                    // fallback
                    try {
                      const ta = document.createElement("textarea");
                      ta.value = code;
                      ta.style.position = "fixed";
                      ta.style.opacity = "0";
                      document.body.appendChild(ta);
                      ta.select();
                      document.execCommand("copy");
                      document.body.removeChild(ta);
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 900);
                    } catch {
                      // ignore
                    }
                  }
                }}
              >
                {copied ? node.props.copiedText ?? "Copied" : node.props.copyText ?? "Copy"}
              </button>
            </div>
          </div>
        );

      case "image":
        {
          const justify =
            align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
          
          const fit = node.props.objectFit ?? "cover";
          const frameWidth = node.props.maxWidth ? `${node.props.maxWidth}px` : "100%";
          const ratio = node.props.aspectRatio ?? "auto";
          const borderWidth = node.props.borderWidth ?? 0;
          const borderColor = node.props.borderColor ?? "#e2e8f0";
          const radius = node.props.borderRadius ?? 12;

          const frameStyle: React.CSSProperties = {
            width: frameWidth,
            maxWidth: "100%",
            border: borderWidth ? `${borderWidth}px solid ${borderColor}` : undefined,
            borderRadius: radius,
            overflow: "hidden",
            background: node.props.frameBackground ?? (fit === "contain" ? "#f1f5f9" : "transparent"),
            boxSizing: "border-box",
            paddingTop: node.props.paddingTop ?? 0,
            paddingBottom: node.props.paddingBottom ?? 0,
            paddingLeft: node.props.paddingLeft ?? 0,
            paddingRight: node.props.paddingRight ?? 0,
            marginTop: node.props.marginTop ?? 0,
            marginBottom: node.props.marginBottom ?? 0,
            marginLeft: node.props.marginLeft ?? 0,
            marginRight: node.props.marginRight ?? 0,
          };

          if (ratio !== "auto") {
            frameStyle.aspectRatio = ratio;
          }

          const imgStyle: React.CSSProperties = {
            display: "block",
            width: "100%",
            height: ratio === "auto" ? "auto" : "100%",
            objectFit: fit,
          };

          const imageAlignmentContainerStyle: React.CSSProperties = {
            display: "flex",
            justifyContent: justify,
            width: "100%",
          };

          return (
            <div style={imageAlignmentContainerStyle}>
              <div style={frameStyle}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={node.props.src ?? "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=800&fit=crop"}
                  alt={node.props.alt ?? ""}
                  style={imgStyle}
                />
              </div>
            </div>
          );
        }

      case "video": {
        // Get settings from new videoSettings object or fall back to old props
        const videoSettings = node.props.videoSettings as any;
        const source = videoSettings?.source || {};
        const playback = videoSettings?.playback || {};
        const controls = videoSettings?.controls || {};
        const layout = videoSettings?.layout || {};
        
        // SOURCE SETTINGS
        const videoUrl = source.url || node.props.src || "";
        const aspectRatio = source.aspectRatio || node.props.aspectRatio || "16/9";
        const posterUrl = source.poster?.mode === 'custom' ? source.poster.customUrl : undefined;
        
        // LAYOUT SETTINGS
        const widthMode = layout.width?.mode || 'auto';
        const widthValue = layout.width?.value || 800;
        const widthUnit = layout.width?.unit || 'px';
        const containerWidth = widthMode === 'full' ? '100%' : 
                              widthMode === 'custom' ? `${widthValue}${widthUnit}` :
                              node.props.width ? `${node.props.width}px` : '800px';
        const maxWidth = layout.maxWidth ? `${layout.maxWidth}px` : '100%';
        const alignment = layout.alignment || node.props.align || 'center';
        const justifyContent = alignment === 'left' ? 'flex-start' : 
                              alignment === 'right' ? 'flex-end' : 'center';
        
        // SPACING
        const spacing = layout.spacing || {};
        const marginTop = spacing.marginTop ?? node.props.marginTop ?? 0;
        const marginBottom = spacing.marginBottom ?? node.props.marginBottom ?? 0;
        const marginLeft = spacing.marginLeft ?? node.props.marginLeft ?? 0;
        const marginRight = spacing.marginRight ?? node.props.marginRight ?? 0;
        const paddingTop = spacing.paddingTop ?? 0;
        const paddingBottom = spacing.paddingBottom ?? 0;
        const paddingLeft = spacing.paddingLeft ?? 0;
        const paddingRight = spacing.paddingRight ?? 0;
        
        // BORDER & STYLING
        const cornerRadius = layout.cornerRadius ?? node.props.borderRadius ?? 12;
        const border = layout.border || {};
        const borderEnabled = border.enabled ?? false;
        const borderWidth = borderEnabled ? (border.width ?? 2) : 0;
        const borderStyle = border.style || 'solid';
        const borderColor = border.color || '#e2e8f0';
        
        // SHADOW
        const shadow = layout.shadow || { size: 'none' };
        let boxShadow = 'none';
        if (shadow.size !== 'none') {
          if (shadow.size === 'sm') boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          else if (shadow.size === 'md') boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          else if (shadow.size === 'lg') boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
          else if (shadow.size === 'custom' && shadow.custom) {
            const c = shadow.custom;
            boxShadow = `${c.x}px ${c.y}px ${c.blur}px ${c.spread}px ${c.color}`;
          }
        }
        
        const backgroundColor = layout.backgroundColor || node.props.frameBackground || '#000000';
        const fitMode = layout.fitMode || 'contain';
        
        // PLAYBACK SETTINGS
        const autoplay = playback.autoplay ?? (node.props.autoPlay === true);
        const muted = playback.muted ?? (node.props.muted === true);
        const loop = playback.loop ?? (node.props.loop === true);
        const playsInline = playback.playsInline ?? true;
        const playbackSpeed = playback.playbackSpeed ?? 1;
        const preload = playback.preload || 'metadata';
        
        // CONTROLS SETTINGS
        const showControls = controls.showControls ?? (node.props.controls !== false);
        const allowFullscreen = controls.allowFullscreen ?? true;
        const pictureInPicture = controls.pictureInPicture ?? true;
        
        const getAspectRatioPadding = (ratio: string) => {
          switch (ratio) {
            case "16/9": return "56.25%";
            case "4/3": return "75%";
            case "1/1": return "100%";
            case "21/9": return "42.86%";
            case "9/16": return "177.78%";
            default: return "56.25%";
          }
        };
        
        // Container styles
        const containerStyle: React.CSSProperties = {
          display: 'flex',
          justifyContent: justifyContent,
          width: '100%',
          marginTop,
          marginBottom,
          marginLeft,
          marginRight,
        };
        
        const frameStyle: React.CSSProperties = {
          width: containerWidth,
          maxWidth: maxWidth,
          borderRadius: `${cornerRadius}px`,
          overflow: 'hidden',
          background: backgroundColor,
          border: borderEnabled ? `${borderWidth}px ${borderStyle} ${borderColor}` : undefined,
          boxShadow,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
        };
        
        // Video wrapper to enforce aspect ratio
        const videoWrapperStyle: React.CSSProperties = aspectRatio === 'auto' ? {
          width: '100%',
        } : {
          width: '100%',
          paddingBottom: getAspectRatioPadding(aspectRatio),
          position: 'relative',
          height: 0,
        };
        
        const videoStyle: React.CSSProperties = aspectRatio === 'auto' ? {
          display: 'block',
          width: '100%',
          height: 'auto',
          objectFit: fitMode as any,
        } : {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: fitMode as any,
        };
        
        return (
          <div style={containerStyle}>
            <div style={frameStyle}>
              {videoUrl ? (
                <div style={videoWrapperStyle}>
                  <video
                    src={videoUrl}
                    controls={showControls}
                    autoPlay={autoplay}
                    loop={loop}
                    muted={muted}
                    playsInline={playsInline}
                    poster={posterUrl}
                    preload={preload}
                    controlsList={!allowFullscreen ? 'nofullscreen' : undefined}
                    disablePictureInPicture={!pictureInPicture}
                    style={videoStyle}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div style={{
                  width: "100%",
                  paddingBottom: getAspectRatioPadding(aspectRatio),
                  position: "relative",
                  backgroundColor: "#0f172a"
                }}>
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8"
                  }}>
                    <svg 
                      width="48" 
                      height="48" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                      style={{ marginBottom: "12px", opacity: 0.5 }}
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>
                      Add a video
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.7 }}>
                      Enter a video URL in the settings panel
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      case "divider":
        return <hr className="my-3 border-slate-200" />;

      case "checkout":
      case "funnel.checkout":
        // In preview mode, show real Stripe form; in edit mode, show mockup
        return isPreview ? <CheckoutPreview /> : <CheckoutFormMockup />;

      case "checkout.steps":
        return <CheckoutStepsMockup props={node.props} />;

      case "checkout.contact":
        return isPreview ? (
          <CheckoutContactRuntime props={node.props} />
        ) : (
          <CheckoutContactMockup props={node.props} />
        );

      case "checkout.products":
        return isPreview ? (
          <CheckoutProductsRuntime props={node.props} />
        ) : (
          <CheckoutProductsMockup props={node.props} />
        );

      case "checkout.summary":
        return isPreview ? (
          <CheckoutSummaryRuntime props={node.props} />
        ) : (
          <CheckoutSummaryMockup props={node.props} />
        );

      case "checkout.payment":
        return isPreview ? (
          <CheckoutPaymentRuntime props={node.props} />
        ) : (
          <CheckoutPaymentMockup props={node.props} />
        );

      case "checkout.bump":
        return <CheckoutBumpMockup props={node.props} />;

      case "checkout.button":
        return <CheckoutButtonMockup props={node.props} />;

      // Website Elements
      case "hero":
      case "hero.centered":
      case "hero.split":
      case "hero.fullwidth":
        return <HeroMockup props={node.props} />;

      case "navbar":
        return <NavbarMockup props={node.props} />;

      case "footer":
        return <FooterMockup props={node.props} />;

      case "feature-grid":
        return <FeatureGridMockup props={node.props} />;

      case "cta-section":
        return <CTASectionMockup props={node.props} />;

      case "stepIndicator":
        return (
          <CheckoutStepIndicator
            currentStep={node.props.currentStep ?? 1}
            totalSteps={node.props.totalSteps ?? 3}
            steps={node.props.steps ?? ['Cart', 'Information', 'Payment']}
            variant={node.props.variant ?? 'numbers'}
          />
        );

      case "offer":
      case "funnel.offer":
        return (
          <div className="w-full max-w-2xl mx-auto rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Special Offer!</h2>
            <p className="text-slate-600 mb-6">
              Get this exclusive offer with one-click checkout using your saved payment method.
            </p>

            {/* Offer Details */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <div className="text-lg font-semibold text-purple-900">Limited Time Offer</div>
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">$XX.XX</div>
              <div className="text-sm text-purple-700">One-time payment</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-4">
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-md">
                Yes, Add to My Order!
              </button>
              <button className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition">
                No Thanks
              </button>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your saved payment method will be charged immediately</span>
            </div>

            {/* Preview Badge */}
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full border border-purple-200">
                Preview - Real one-click offer will appear at runtime
              </span>
            </div>
          </div>
        );

      default:
        return <div className="text-sm text-slate-500">Unknown element</div>;
    }
  };

  // For text elements, return content directly without wrapper to eliminate gaps
  if (kind === "heading" || kind === "subheading" || kind === "text" || kind === "paragraph") {
    return renderContent();
  }

  return (
    <div
      ref={refCb}
      data-node-id={isPreview ? undefined : node.id}
      data-node-type={isPreview ? undefined : "element"}
      className="relative w-full"
      style={wrapperStyle}
      onClick={onClick}
      onDoubleClick={onWrapperDoubleClick}
    >
      {renderContent()}
    </div>
  );
}
