"use client";

import { createContext, useContext, useRef, useState, ReactNode, useEffect } from "react";

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement> | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return <AudioContext.Provider value={{ audioRef, isPlaying, setIsPlaying }}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
}
