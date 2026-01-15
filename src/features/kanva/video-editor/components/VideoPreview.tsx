"use client";

import { useVideoXStore } from '../store';
import { Play, Pause } from 'lucide-react';

export function VideoPreview() {
  const { timeline, setCurrentTime, setPlaying } = useVideoXStore();
  const { currentTime, playing } = timeline;

  return (
    <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Play className="w-12 h-12 text-white" />
        </div>
        <p className="text-gray-400 text-sm">Video preview will appear here</p>
        <p className="text-gray-500 text-xs mt-2">Import a video to get started</p>
      </div>
      
      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 bg-black/50 backdrop-blur-sm p-3 rounded-lg">
        <button
          onClick={() => setPlaying(!playing)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{playing ? 'Pause' : 'Play'}</span>
        </button>
        
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={100}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
        
        <span className="text-white text-sm font-mono">
          {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
