import { create } from 'zustand';
import { VideoProject, VideoClip, VideoTrack, TimelineState, ExportSettings } from './types';

interface VideoXStore {
  project: VideoProject | null;
  timeline: TimelineState;
  exportSettings: ExportSettings;
  
  // Project actions
  createProject: (name: string) => void;
  loadProject: (project: VideoProject) => void;
  updateProject: (updates: Partial<VideoProject>) => void;
  
  // Clip actions
  addClip: (trackId: string, clip: Omit<VideoClip, 'id'>) => void;
  removeClip: (clipId: string) => void;
  updateClip: (clipId: string, updates: Partial<VideoClip>) => void;
  
  // Timeline actions
  setCurrentTime: (time: number) => void;
  setPlaying: (playing: boolean) => void;
  setZoom: (zoom: number) => void;
  selectClip: (clipId: string | null) => void;
  
  // Export actions
  setExportSettings: (settings: Partial<ExportSettings>) => void;
}

export const useVideoXStore = create<VideoXStore>((set) => ({
  project: null,
  timeline: {
    currentTime: 0,
    zoom: 1,
    playing: false,
    selectedClipId: null,
  },
  exportSettings: {
    format: 'mp4',
    quality: 'FHD',
    fps: 30,
    codec: 'h264',
  },
  
  createProject: (name) => set({
    project: {
      id: `project-${Date.now()}`,
      name,
      tracks: [
        { id: 'track-video-1', clips: [], type: 'video' },
        { id: 'track-audio-1', clips: [], type: 'audio' },
      ],
      duration: 0,
      fps: 30,
      resolution: { width: 1920, height: 1080 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  }),
  
  loadProject: (project) => set({ project }),
  
  updateProject: (updates) => set((state) => ({
    project: state.project ? { ...state.project, ...updates, updatedAt: Date.now() } : null,
  })),
  
  addClip: (trackId, clipData) => set((state) => {
    if (!state.project) return state;
    
    const newClip: VideoClip = {
      ...clipData,
      id: `clip-${Date.now()}`,
    };
    
    return {
      project: {
        ...state.project,
        tracks: state.project.tracks.map((track) =>
          track.id === trackId
            ? { ...track, clips: [...track.clips, newClip] }
            : track
        ),
        updatedAt: Date.now(),
      },
    };
  }),
  
  removeClip: (clipId) => set((state) => {
    if (!state.project) return state;
    
    return {
      project: {
        ...state.project,
        tracks: state.project.tracks.map((track) => ({
          ...track,
          clips: track.clips.filter((clip) => clip.id !== clipId),
        })),
        updatedAt: Date.now(),
      },
    };
  }),
  
  updateClip: (clipId, updates) => set((state) => {
    if (!state.project) return state;
    
    return {
      project: {
        ...state.project,
        tracks: state.project.tracks.map((track) => ({
          ...track,
          clips: track.clips.map((clip) =>
            clip.id === clipId ? { ...clip, ...updates } : clip
          ),
        })),
        updatedAt: Date.now(),
      },
    };
  }),
  
  setCurrentTime: (time) => set((state) => ({
    timeline: { ...state.timeline, currentTime: time },
  })),
  
  setPlaying: (playing) => set((state) => ({
    timeline: { ...state.timeline, playing },
  })),
  
  setZoom: (zoom) => set((state) => ({
    timeline: { ...state.timeline, zoom },
  })),
  
  selectClip: (clipId) => set((state) => ({
    timeline: { ...state.timeline, selectedClipId: clipId },
  })),
  
  setExportSettings: (settings) => set((state) => ({
    exportSettings: { ...state.exportSettings, ...settings },
  })),
}));
