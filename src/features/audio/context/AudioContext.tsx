"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  play: () => void;
  togglePlayback: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => {
    const el = audioRef.current;
    if (!el || !el.paused) return;
    void el.play().then(() => setIsPlaying(true));
  }, []);

  const togglePlayback = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().then(() => setIsPlaying(true));
    } else {
      el.pause();
      setIsPlaying(false);
    }
  }, []);

  return (
    <AudioContext.Provider value={{ audioRef, isPlaying, setIsPlaying, play, togglePlayback }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
}
