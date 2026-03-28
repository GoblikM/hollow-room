"use client";

import { useState, useEffect, useRef } from "react";
import { SCHEMES, type ColorScheme, type ThemeMode } from "@/features/theme/constants/themePalette";
import {
  applyMode,
  applyScheme,
  getInitialMode,
  getInitialSchemeId,
  getSchemeById,
} from "@/features/theme/utils/themeRuntime";

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(getInitialSchemeId);
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scheme = getSchemeById(activeId);
    applyScheme(scheme);
    applyMode(mode);
  }, [activeId, mode]);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-1000">
      {open && (
        <div className="theme-picker-panel">
          <div className="flex gap-1 mb-2">
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
      <button
        className="theme-picker-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Pick color scheme"
        aria-expanded={open}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-accent-bright">
          <circle cx="7" cy="7" r="3" fill="currentColor" opacity="0.9" />
          <circle cx="15" cy="7" r="3" fill="currentColor" opacity="0.6" />
          <circle cx="11" cy="15" r="3" fill="currentColor" opacity="0.75" />
        </svg>
      </button>
    </div>
  );
}
