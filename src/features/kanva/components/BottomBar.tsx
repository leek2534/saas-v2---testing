'use client';

import { useEditorStore } from '../lib/editor/store';
import { PageNavigator } from '../editor/PageNavigator';

/**
 * BottomBar - Footer with page navigator filmstrip
 * Uses the PageNavigator component for multi-page management
 */
export function BottomBar() {
  const canvas = useEditorStore((state) => state.canvas);

  return (
    <div className="h-auto min-h-[100px] bg-muted/30 border-t border-border flex items-center justify-between px-4 py-3">
      {/* Left: Canvas info */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="text-xs text-muted-foreground">
          {canvas.width} × {canvas.height}
        </span>
      </div>
      
      {/* Center: Page Navigator */}
      <div className="flex-1 flex justify-center overflow-hidden mx-4">
        <PageNavigator />
      </div>
      
      {/* Right: Branding */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-muted-foreground">
          Kanva
        </span>
      </div>
    </div>
  );
}