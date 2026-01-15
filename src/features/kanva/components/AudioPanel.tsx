'use client';

/**
 * AudioPanel - Audio recording and transcription feature
 * Isolated module for audio/STT functionality
 * Can be easily removed if feature doesn't work as intended
 */

import React, { useRef, useState, useEffect } from 'react';
import { Mic, Square, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';

export function AudioPanel() {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob) {
      alert('Please record audio first!');
      return;
    }

    setTranscribing(true);
    setTranscript('');

    try {
      if (mode === 'online') {
        // Online transcription via OpenAI Whisper API
        await transcribeOnline(audioBlob);
      } else {
        // Offline transcription (if Tauri is available)
        await transcribeOffline(audioBlob);
      }
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Transcription failed. Please try again.');
    } finally {
      setTranscribing(false);
    }
  };

  const transcribeOnline = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');
      formData.append('model', 'whisper-1');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${errorText}`);
      }

      const data = await response.json();
      setTranscript(data.transcript || data.text || 'Transcription completed but no text returned.');
    } catch (error) {
      console.error('Online transcription error:', error);
      throw error;
    }
  };

  const transcribeOffline = async (blob: Blob) => {
    // Check if Tauri is available
    if (typeof window !== 'undefined' && (window as any).__TAURI__) {
      try {
        // Optional Tauri import - only available in Tauri desktop app
        const tauriModule = await import("@tauri-apps/api/tauri").catch(
          () => null,
        );
        if (!tauriModule) {
          setTranscript("Offline transcription requires Tauri desktop app");
          return;
        }
        const { invoke } = tauriModule;
        
        // Convert blob to file path (Tauri would handle this)
        // For now, show a message that offline mode requires Tauri
        alert('Offline transcription requires the desktop app. Please use online mode in the browser.');
        setMode('online');
      } catch (error) {
        console.error('Tauri not available:', error);
        alert('Offline mode is only available in the desktop app.');
        setMode('online');
      }
    } else {
      alert('Offline transcription is only available in the desktop app. Please use online mode.');
      setMode('online');
    }
  };

  const downloadTranscript = () => {
    if (!transcript) return;
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-foreground font-semibold flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Audio Transcription
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Record audio and transcribe to text
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Mode Toggle */}
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm text-foreground">Mode:</span>
          <button
            onClick={() => setMode('online')}
            className={cn(
              'flex-1 px-3 py-2 rounded text-sm font-medium transition-colors',
              mode === 'online'
                ? 'bg-blue-600 text-foreground'
                : 'bg-muted/80 text-muted-foreground hover:bg-muted/60'
            )}
          >
            Online
          </button>
          <button
            onClick={() => setMode('offline')}
            className={cn(
              'flex-1 px-3 py-2 rounded text-sm font-medium transition-colors',
              mode === 'offline'
                ? 'bg-blue-600 text-foreground'
                : 'bg-muted/80 text-muted-foreground hover:bg-muted/60'
            )}
          >
            Offline
          </button>
        </div>

        {/* Recording Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              onClick={recording ? stopRecording : startRecording}
              disabled={transcribing}
              className={cn(
                'flex-1 h-12 text-base font-semibold',
                recording
                  ? 'bg-red-600 hover:bg-red-700 text-foreground'
                  : 'bg-green-600 hover:bg-green-700 text-foreground'
              )}
            >
              {recording ? (
                <>
                  <Square className="w-5 h-5 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
          </div>

          {/* Audio Player */}
          {audioUrl && (
            <div className="p-3 bg-muted rounded-lg">
              <audio
                src={audioUrl}
                controls
                className="w-full"
              />
            </div>
          )}

          {/* Transcribe Button */}
          {audioBlob && (
            <Button
              onClick={transcribeAudio}
              disabled={transcribing || !audioBlob}
              className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-foreground"
            >
              {transcribing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Transcribing...
                </>
              ) : (
                'Transcribe Audio'
              )}
            </Button>
          )}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Transcript</h4>
              <Button
                onClick={downloadTranscript}
                size="sm"
                variant="ghost"
                className="h-8 text-muted-foreground hover:text-foreground"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-gray-200 whitespace-pre-wrap">
                {transcript}
              </p>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Online mode:</strong> Uses OpenAI Whisper API for high-quality transcription.
            <br />
            <strong>Offline mode:</strong> Available in desktop app only. Uses local Whisper model.
          </p>
        </div>
      </div>
    </div>
  );
}

