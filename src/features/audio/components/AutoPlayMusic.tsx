"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "@/features/audio/context/AudioContext";
import { getInitialMode } from "@/features/theme/utils/themeRuntime";
import { DEFAULT_THEME_MODE, type ThemeMode } from "@/features/theme/constants/themePalette";

const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function getAudioSource(mode: ThemeMode): string {
  const trackPath = mode === "light" ? "/audio/light.mp3" : "/audio/dark.mp3";
  return `${PUBLIC_BASE_PATH}${trackPath}`;
}

const AUDIO_VOLUME = 0.02;

export default function AutoPlayMusic() {
  const { audioRef, setIsPlaying } = useAudio();
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  const didInitModeEffect = useRef(false);
  const isSwitchingTrack = useRef(false);
  const shouldResumeAfterSwitch = useRef(false);

  const queueModeChange = useCallback(
    (nextMode: ThemeMode) => {
      const audioEl = audioRef?.current;
      shouldResumeAfterSwitch.current = Boolean(audioEl && !audioEl.paused);
      setMode(nextMode);
    },
    [audioRef],
  );

  const syncModeFromDom = () => {
    const isLightMode = document.body.classList.contains("light-mode");
    setMode(isLightMode ? "light" : "dark");
  };

  useEffect(() => {
    setMode(getInitialMode());
    syncModeFromDom();
  }, []);

  useEffect(() => {
    const audioEl = audioRef?.current;
    if (!audioEl) {
      return;
    }

    // eslint-disable-next-line react-hooks/immutability -- setting volume on the DOM element is intentional
    audioEl.volume = AUDIO_VOLUME;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => {
      if (isSwitchingTrack.current) return;
      setIsPlaying(false);
    };

    audioEl.addEventListener("play", handlePlay);
    audioEl.addEventListener("pause", handlePause);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.mode) {
        queueModeChange(customEvent.detail.mode as ThemeMode);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme-mode" && e.newValue) {
        queueModeChange(e.newValue as ThemeMode);
      }
    };

    // Fallback: observe body class changes from applyMode to keep audio mode in sync.
    const observer = new MutationObserver(() => {
      syncModeFromDom();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("themeChanged", handleThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      audioEl.removeEventListener("play", handlePlay);
      audioEl.removeEventListener("pause", handlePause);
      window.removeEventListener("themeChanged", handleThemeChange);
      window.removeEventListener("storage", handleStorageChange);
      observer.disconnect();
    };
  }, [audioRef, queueModeChange, setIsPlaying]);

  // Handle mode changes to reload audio with new theme track
  useEffect(() => {
    if (!didInitModeEffect.current) {
      didInitModeEffect.current = true;
      return;
    }

    const audioEl = audioRef?.current;
    if (!audioEl) return;

    isSwitchingTrack.current = true;
    audioEl.load();

    // Resume playback if it was playing before
    if (shouldResumeAfterSwitch.current) {
      void audioEl
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        })
        .finally(() => {
          isSwitchingTrack.current = false;
          shouldResumeAfterSwitch.current = false;
        });
      return;
    }

    isSwitchingTrack.current = false;
    shouldResumeAfterSwitch.current = false;
  }, [audioRef, mode, setIsPlaying]);

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
