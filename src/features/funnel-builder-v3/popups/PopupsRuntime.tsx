"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useFunnelEditorStore } from "../store/store";
import { RuntimeRenderer } from "../renderer/RuntimeRenderer";
import { cn } from "@/lib/utils";
import type { PopupDefinition } from "../store/types";

type PopupContext = "preview" | "edit";

function parsePatterns(input: string[]): { include: ((s: string) => boolean)[] } {
  const fns = input
    .map((p) => p.trim())
    .filter(Boolean)
    .map((pattern) => {
      // If wrapped like /.../ treat as regex.
      if (pattern.startsWith("/") && pattern.endsWith("/") && pattern.length > 2) {
        try {
          const re = new RegExp(pattern.slice(1, -1));
          return (s: string) => re.test(s);
        } catch {
          // fall through
        }
      }
      return (s: string) => s.includes(pattern);
    });

  return { include: fns };
}

function matchesTargeting(popup: PopupDefinition, pathname: string): boolean {
  const mode = popup.targeting?.mode ?? "all";
  const include = popup.targeting?.include ?? [];
  const exclude = popup.targeting?.exclude ?? [];

  const includeFns = parsePatterns(include).include;
  const excludeFns = parsePatterns(exclude).include;

  const isExcluded = excludeFns.some((fn) => fn(pathname));
  const isIncluded = includeFns.length ? includeFns.some((fn) => fn(pathname)) : true;

  if (mode === "all") return !isExcluded;
  if (mode === "include") return isIncluded && !isExcluded;
  if (mode === "exclude") return !isExcluded;
  return true;
}

function popupStorageKey(id: string) {
  return `funnel-builder-v3:popup:${id}`;
}

type PopupSeenState = {
  count: number;
  lastShownAt: number;
};

function readSeenState(popupId: string): PopupSeenState {
  try {
    const raw = localStorage.getItem(popupStorageKey(popupId));
    if (!raw) return { count: 0, lastShownAt: 0 };
    const json = JSON.parse(raw);
    return {
      count: typeof json.count === "number" ? json.count : 0,
      lastShownAt: typeof json.lastShownAt === "number" ? json.lastShownAt : 0,
    };
  } catch {
    return { count: 0, lastShownAt: 0 };
  }
}

function writeSeenState(popupId: string, next: PopupSeenState) {
  try {
    localStorage.setItem(popupStorageKey(popupId), JSON.stringify(next));
  } catch {
    // ignore
  }
}

function frequencyAllowsAuto(popupId: string, freq: PopupDefinition["frequency"]): boolean {
  if (!freq) return true;
  const state = readSeenState(popupId);
  const maxShows = typeof freq.maxShows === "number" ? freq.maxShows : undefined;
  if (typeof maxShows === "number" && maxShows > 0 && state.count >= maxShows) return false;

  if (freq.mode === "every_visit") return true;
  if (freq.mode === "once") return state.count === 0;
  if (freq.mode === "cooldown") {
    const hours = typeof freq.cooldownHours === "number" ? freq.cooldownHours : 24;
    const ms = hours * 60 * 60 * 1000;
    return Date.now() - state.lastShownAt >= ms;
  }
  return true;
}

function recordShown(popupId: string) {
  const state = readSeenState(popupId);
  writeSeenState(popupId, { count: state.count + 1, lastShownAt: Date.now() });
}

function getPathname(): string {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
}

function getAnimationClasses(animation: PopupDefinition["animation"]) {
  if (animation === "slide") {
    return {
      overlay: "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
      content:
        "data-[state=open]:translate-y-0 data-[state=closed]:translate-y-2 data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
    };
  }

  if (animation === "fade") {
    return {
      overlay: "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
      content: "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
    };
  }

  return { overlay: "", content: "" };
}

function PopupModal({ popup, open, onOpenChange, context, onClose }: { popup: PopupDefinition; open: boolean; onOpenChange: (o: boolean) => void; context: PopupContext; onClose?: () => void }) {
  const anim = getAnimationClasses(popup.animation);

  const overlayStyle: React.CSSProperties = {
    backgroundColor: popup.style.overlayColor ?? "rgba(0,0,0,0.55)",
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: popup.style.background ?? "#ffffff",
    maxWidth: popup.style.maxWidth ?? 540,
    width: "calc(100vw - 32px)",
    padding: popup.style.padding ?? 24,
    borderRadius: popup.style.borderRadius ?? 16,
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Overlay
        style={overlayStyle}
        className={cn(
          "fixed inset-0 z-[50] opacity-0 transition-opacity duration-200",
          anim.overlay
        )}
      />
      <Dialog.Content
        style={contentStyle}
        className={cn(
          "fixed left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2 shadow-xl outline-none",
          "opacity-0 translate-y-0 transition-all duration-200",
          anim.content
        )}
        aria-label={popup.name || "Popup"}
        onPointerDownOutside={(e) => {
          // In edit mode, prevent closing when clicking outside
          if (context === "edit") {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          // In edit mode, prevent closing when interacting outside
          if (context === "edit") {
            e.preventDefault();
          }
        }}
      >
        {(popup.style.showClose !== false || context === "edit") ? (
          context === "edit" && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "absolute right-3 top-3 rounded-md p-2",
                "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
              aria-label="Exit popup editor"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Dialog.Close asChild>
              <button
                type="button"
                className={cn(
                  "absolute right-3 top-3 rounded-md p-2",
                  "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          )
        ) : null}

        <div className="max-h-[80vh] overflow-auto">
          <RuntimeRenderer rootIds={popup.rootIds} />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function PopupsRuntime() {
  const tree = useFunnelEditorStore((s) => s.tree);
  const mode = useFunnelEditorStore((s) => s.mode);
  const workspace = useFunnelEditorStore((s) => s.workspace);
  const activePopupId = useFunnelEditorStore((s) => s.activePopupId);
  const openPopupId = useFunnelEditorStore((s) => s.openPopupId);
  const openPopup = useFunnelEditorStore((s) => s.openPopup);
  const closePopup = useFunnelEditorStore((s) => s.closePopup);
  const backToPage = useFunnelEditorStore((s) => s.backToPage);

  const pathname = useMemo(() => getPathname(), []);
  const timeoutsRef = useRef<number[]>([]);

  // Auto triggers (preview + page workspace only)
  useEffect(() => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];

    if (mode !== "preview") return;
    if (workspace !== "page") return;
    if (openPopupId) return;

    const popups = Object.values(tree.popups);
    for (const popup of popups) {
      if (!popup.enabled) continue;
      if (!matchesTargeting(popup, pathname)) continue;
      if (!frequencyAllowsAuto(popup.id, popup.frequency)) continue;

      for (const trigger of popup.triggers ?? []) {
        if (trigger.type === "on_page_load") {
          const t = window.setTimeout(() => {
            openPopup(popup.id, "auto");
          }, 80);
          timeoutsRef.current.push(t);
        }
        if (trigger.type === "after_seconds") {
          const seconds = Math.max(0, trigger.seconds || 0);
          const t = window.setTimeout(() => {
            openPopup(popup.id, "auto");
          }, seconds * 1000);
          timeoutsRef.current.push(t);
        }
      }
    }

    return () => {
      timeoutsRef.current.forEach((t) => window.clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, [mode, workspace, tree.popups, pathname, openPopupId, openPopup]);

  // Record shows whenever a popup is opened (preview only).
  useEffect(() => {
    if (mode !== "preview") return;
    if (!openPopupId) return;
    recordShown(openPopupId);
  }, [mode, openPopupId]);

  // Preview / runtime popup.
  if (openPopupId) {
    const popup = tree.popups[openPopupId];
    if (!popup) return null;
    return (
      <PopupModal
        popup={popup}
        open={true}
        context="preview"
        onOpenChange={(isOpen) => {
          if (!isOpen) closePopup();
        }}
      />
    );
  }

  return null;
}
