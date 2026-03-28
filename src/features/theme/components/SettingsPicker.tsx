"use client";

import { useState, useEffect, useRef } from "react";
import {
  SCHEMES,
  type ColorScheme,
  type ThemeMode,
} from "@/features/theme/constants/themePalette";
import {
  applyDesktopNavEnabled,
  applyMode,
  applyScheme,
  getInitialDesktopNavEnabled,
  getInitialMode,
  getInitialSchemeId,
  getSchemeById,
} from "@/features/theme/utils/themeRuntime";
import { useAudio } from "@/features/audio/context/AudioContext";

export default function SettingsPicker() {
  const [open, setOpen] = useState(false);
  const [openSchemes, setOpenSchemes] = useState(false);
  const [activeId, setActiveId] = useState(getInitialSchemeId);
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const [desktopNavEnabled, setDesktopNavEnabled] = useState(
    getInitialDesktopNavEnabled,
  );
  const { audioRef, isPlaying, setIsPlaying } = useAudio();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scheme = getSchemeById(activeId);
    applyScheme(scheme);
    applyMode(mode);
    applyDesktopNavEnabled(desktopNavEnabled);
  }, [activeId, desktopNavEnabled, mode]);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  function handleSwatchClick(scheme: ColorScheme) {
    applyScheme(scheme);
    setActiveId(scheme.id);
    localStorage.setItem("theme-scheme", scheme.id);
  }

  function handleModeChange(m: ThemeMode) {
    applyMode(m);
    setMode(m);
    localStorage.setItem("theme-mode", m);
    // Dispatch custom event for audio system to switch tracks
    window.dispatchEvent(new CustomEvent("themeChanged", { detail: { mode: m } }));
  }

  function handleDesktopNavToggle() {
    setDesktopNavEnabled((current) => {
      const next = !current;
      applyDesktopNavEnabled(next);
      localStorage.setItem("ui-desktop-nav", next ? "1" : "0");
      return next;
    });
  }

  function handleMusicToggle() {
    if (!audioRef?.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      void audioRef.current.play().catch(() => {
        // Handle autoplay block
      });
      setIsPlaying(true);
    }
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-1000">
      {open && (
        <div className="theme-picker-panel">
          <div className="mode-toggle-row">
            {(["dark", "light"] as const).map((m) => (
              <button
                key={m}
                className={`mode-toggle-btn${mode === m ? " active" : ""}`}
                onClick={() => handleModeChange(m)}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            className="schemes-toggle-btn"
            onClick={() => setOpenSchemes((v) => !v)}
            aria-expanded={openSchemes}
          >
            <span className="schemes-toggle-title">Color schemes</span>
            <svg
              className="schemes-toggle-icon"
              width="14"
              height="14"
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <polygon points={openSchemes ? "10 2 2 10 2 2" : "2 2 10 2 6 8"} />
            </svg>
          </button>

          {openSchemes && (
            <div className="schemes-list">
              {SCHEMES.map((scheme) => (
                <button
                  key={scheme.id}
                  className="theme-swatch"
                  onClick={() => handleSwatchClick(scheme)}
                  aria-label={scheme.label}
                >
                  <span
                    className={`theme-swatch-circle${activeId === scheme.id ? " active" : ""}`}
                    style={{ backgroundColor: scheme.accent }}
                  />
                  <span>{scheme.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="theme-toggle-row ui-desktop-nav-row">
            <span className="theme-toggle-meta">
              <span className="theme-toggle-title">Desktop navbar</span>
            </span>

            <label className="theme-switch" aria-label="Toggle desktop navbar">
              <input
                className="theme-switch-input"
                type="checkbox"
                checked={desktopNavEnabled}
                onChange={handleDesktopNavToggle}
              />
              <span className="theme-switch-track" aria-hidden="true">
                <span className="theme-switch-thumb" />
              </span>
            </label>
          </div>

          <div className="audio-control-row">
            <span className="theme-toggle-meta">
              <span className="theme-toggle-title">Music</span>
            </span>

            <label className="theme-switch" aria-label="Toggle music">
              <input
                className="theme-switch-input"
                type="checkbox"
                checked={isPlaying}
                onChange={handleMusicToggle}
              />
              <span className="theme-switch-track" aria-hidden="true">
                <span className="theme-switch-thumb" />
              </span>
            </label>
          </div>
        </div>
      )}
      <button
        className="theme-picker-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Pick color scheme"
        aria-expanded={open}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          className="text-accent-bright"
        >
          <circle cx="7" cy="7" r="3" fill="currentColor" opacity="0.9" />
          <circle cx="15" cy="7" r="3" fill="currentColor" opacity="0.6" />
          <circle cx="11" cy="15" r="3" fill="currentColor" opacity="0.75" />
        </svg>
      </button>
    </div>
  );
}
