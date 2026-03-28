"use client";

import { useEffect, useState } from "react";
import { useAudio } from "@/features/audio/context/AudioContext";
import { getInitialMode } from "@/features/theme/utils/themeRuntime";
import { DEFAULT_THEME_MODE, type ThemeMode } from "@/features/theme/constants/themePalette";

function getAudioSource(mode: ThemeMode): string {
  return mode === "light" ? "/audio/light.mp3" : "/audio/dark.mp3";
}

const AUDIO_VOLUME = 0.02;

export default function AutoPlayMusic() {
  const { audioRef, setIsPlaying } = useAudio();
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_THEME_MODE);

  useEffect(() => {
    setMode(getInitialMode());
  }, []);

  useEffect(() => {
    const audioEl = audioRef?.current;
    if (!audioEl) {
      return;
    }

    // Set volume - eslint-disable because this is necessary imperative DOM manipulation
    // eslint-disable-next-line
    audioEl.volume = AUDIO_VOLUME;

    const tryPlay = () => {
      void audioEl.play().catch(() => {
        // Autoplay can be blocked; first user interaction will retry.
      });
    };

    const handleFirstInteraction = () => {
      tryPlay();
      setIsPlaying(true);
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    tryPlay();
    setIsPlaying(true);

    window.addEventListener("pointerdown", handleFirstInteraction, {
      once: true,
    });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, {
      once: true,
    });

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audioEl.addEventListener("play", handlePlay);
    audioEl.addEventListener("pause", handlePause);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.mode) {
        setMode(customEvent.detail.mode as ThemeMode);
      }
    };

    window.addEventListener("themeChanged", handleThemeChange);

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      audioEl.removeEventListener("play", handlePlay);
      audioEl.removeEventListener("pause", handlePause);
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, [audioRef, setIsPlaying]);

  // Handle mode changes to reload audio with new theme track
  useEffect(() => {
    const audioEl = audioRef?.current;
    if (!audioEl) return;

    const wasPlaying = !audioEl.paused;
    audioEl.load();

    // Resume playback if it was playing before
    if (wasPlaying) {
      void audioEl.play().catch(() => {
        // Handle autoplay block
      });
    }
  }, [audioRef, mode]);

  return (
    <audio
      ref={audioRef}
      src={getAudioSource(mode)}
      loop
      preload="auto"
      style={{ display: "none" }}
      aria-hidden="true"
    />
  );
}
