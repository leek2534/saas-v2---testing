"use client";

import { useEffect } from 'react';
import { useVideoXStore } from './store';
import { Toolbar } from './components/Toolbar';
import { VideoPreview } from './components/VideoPreview';
import { Timeline } from './components/Timeline';
import { ExportPanel } from './components/ExportPanel';

export { useVideoXStore };

export function VideoXEditor() {
  const { project, createProject } = useVideoXStore();

  useEffect(() => {
    if (!project) {
      createProject('Untitled Project');
    }
  }, [project, createProject]);

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <Toolbar />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          <div className="flex-1 min-h-0">
            <VideoPreview />
          </div>
          
          <div className="h-64">
            <Timeline />
          </div>
        </div>
        
        <ExportPanel />
      </div>
    </div>
  );
}
