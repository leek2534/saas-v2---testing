import { KeyboardShortcuts } from "./Canvas/KeyboardShortcuts";
import { DOMCanvas } from "./Canvas/DOMCanvas";
import { CursorTrackingArea } from "../collab/PresenceIndicators";

/**
 * CanvasArea - Main canvas rendering area
 * Contains the canvas viewport for the currently active page
 * 
 * Multi-page navigation is handled by the PageNavigator in the BottomBar.
 * Each page's elements are stored separately and loaded when switching pages.
 * 
 * Note: Element toolbars are handled by:
 * - FloatingToolbar (inside DOMCanvas) - for selection actions, grouping, layer controls
 * - ElementToolbar (in top Toolbar) - for element-specific editing (text, shape, image properties)
 */
export function CanvasArea() {
  return (
    <div className="flex-1 flex flex-col bg-muted/10 min-h-0 overflow-hidden">
      <KeyboardShortcuts />
      <CursorTrackingArea className="relative flex-1 min-h-0 overflow-hidden">
        <DOMCanvas />
      </CursorTrackingArea>
    </div>
  );
}
