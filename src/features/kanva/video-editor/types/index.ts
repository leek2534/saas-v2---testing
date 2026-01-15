export interface VideoClip {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
  trimStart: number;
  trimEnd: number;
  volume: number;
  muted: boolean;
}

export interface VideoTrack {
  id: string;
  clips: VideoClip[];
  type: 'video' | 'audio' | 'text';
}

export interface VideoProject {
  id: string;
  name: string;
  tracks: VideoTrack[];
  duration: number;
  fps: number;
  resolution: {
    width: number;
    height: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface ExportSettings {
  format: 'mp4' | 'webm' | 'mov';
  quality: 'SD' | 'HD' | 'FHD' | '2K' | '4K';
  fps: 24 | 30 | 60;
  codec: 'h264' | 'vp9' | 'av1';
}

export interface TimelineState {
  currentTime: number;
  zoom: number;
  playing: boolean;
  selectedClipId: string | null;
}
