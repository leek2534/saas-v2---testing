"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Share2, Languages, Trash2, Film } from "lucide-react";
import { useEditorStore } from "../lib/editor/store";
import { CanvasSizeSelector } from "./CanvasSizeSelector";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { CollaboratorsList } from "../collab/PresenceIndicators";

/**
 * TopBar - Main navigation header (TopBar 1)
 * Clean rebuild with: Back, Canvas Size, Project Name, Theme, Translate, Save, Share
 */
export function TopBar() {
  const params = useParams();
  const teamSlug = params.teamSlug as string;
  const meta = useEditorStore((state) => state.meta);
  const updateMeta = useEditorStore((state) => state.updateMeta);
  const elements = useEditorStore((state) => state.elements);
  const deleteElements = useEditorStore((state) => state.deleteElements);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const videoEditorMode = useEditorStore((state) => state.videoEditorMode);
  const setVideoEditorMode = useEditorStore((state) => state.setVideoEditorMode);
  const [saving, setSaving] = useState(false);
  
  // Check if there are any video elements
  const hasVideos = elements.some(el => el.type === 'video');

  const handleRename = (value: string) => {
    updateMeta({ projectName: value });
  };

  const handleManualSave = async () => {
    setSaving(true);
    window.dispatchEvent(new CustomEvent("kanva-export-json"));
    setTimeout(() => setSaving(false), 800);
  };

  const handleClearCanvas = () => {
    if (elements.length === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to clear the canvas? This will remove all ${elements.length} element${elements.length === 1 ? '' : 's'}.`
    );
    
    if (confirmed) {
      const elementIds = elements.map(el => el.id);
      deleteElements(elementIds);
      clearSelection();
    }
  };

  return (
    <div className="w-full h-16 border-b border-border/30 bg-gradient-to-b from-background via-background to-muted/20 backdrop-blur-xl flex items-center px-6 shadow-sm">
      {/* LEFT: Back Button + Canvas Size */}
      <div className="flex items-center gap-4">
        <Link href={`/t/${teamSlug}`}>
          <Button 
            variant="ghost" 
            size="sm"
            className="gap-2 rounded-xl hover:bg-accent/50 hover:scale-110 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back</span>
          </Button>
        </Link>
        
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        
        <CanvasSizeSelector />
      </div>

      {/* CENTER: Project Name */}
      <div className="flex-1 flex justify-center px-8">
        <div className="relative group">
          <Input
            value={meta.projectName}
            onChange={(e) => handleRename(e.target.value)}
            className="h-9 w-80 text-center text-sm font-semibold border-none bg-transparent hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
            placeholder="Untitled Design"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-xl" />
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-2">
        {/* Collaborators */}
        <CollaboratorsList />
        
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent mx-2" />
        
        <div className="flex items-center gap-1 mr-2">
          <ThemeSwitcher />
          
          <Button 
            variant="ghost" 
            size="sm"
            className="h-9 w-9 rounded-xl hover:bg-accent/50 hover:scale-110 transition-all duration-300"
          >
            <Languages className="h-4 w-4" />
          </Button>
          
          {/* Video Editor Toggle - Only show if there are videos */}
          {hasVideos && (
            <Button
              variant={videoEditorMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setVideoEditorMode(!videoEditorMode)}
              title={videoEditorMode ? "Exit Video Editor" : "Open Video Editor"}
              className="h-9 w-9 rounded-xl hover:scale-110 transition-all duration-300"
            >
              <Film className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCanvas}
            disabled={elements.length === 0}
            title="Clear Canvas"
            className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive hover:scale-110 transition-all duration-300 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent mx-1" />
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualSave}
          disabled={saving}
          className="gap-2 h-9 px-4 rounded-xl border-border/50 hover:border-primary/50 hover:bg-accent/50 hover:scale-105 transition-all duration-300 font-medium"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save"}
        </Button>
        
        <Button 
          variant="default" 
          size="sm"
          className="relative gap-2 h-9 px-4 rounded-xl bg-gradient-to-br from-primary to-primary/80 hover:scale-105 shadow-lg shadow-primary/30 transition-all duration-300 font-medium overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent blur-xl -z-10 opacity-75" />
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
