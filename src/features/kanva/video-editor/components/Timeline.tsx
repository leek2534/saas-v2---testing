"use client";

import { useVideoXStore } from '../store';

export function Timeline() {
  const { project, timeline, selectClip } = useVideoXStore();
  const { zoom, selectedClipId } = timeline;

  if (!project) return null;

  return (
    <div className="w-full bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Timeline</h3>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
            -
          </button>
          <span className="text-white text-sm">{Math.round(zoom * 100)}%</span>
          <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
            +
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {project.tracks.map((track) => (
          <div key={track.id} className="bg-gray-800 rounded p-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-xs uppercase font-semibold">
                {track.type}
              </span>
            </div>
            
            <div className="relative h-16 bg-gray-700 rounded overflow-x-auto">
              {track.clips.map((clip) => (
                <div
                  key={clip.id}
                  onClick={() => selectClip(clip.id)}
                  className={`absolute h-full bg-blue-600 hover:bg-blue-500 cursor-pointer transition-colors rounded ${
                    selectedClipId === clip.id ? 'ring-2 ring-blue-400' : ''
                  }`}
                  style={{
                    left: `${(clip.startTime / project.duration) * 100}%`,
                    width: `${((clip.endTime - clip.startTime) / project.duration) * 100}%`,
                  }}
                >
                  <div className="p-2 text-white text-xs truncate">
                    {clip.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
