"use client";

import { useState, useEffect, useRef } from "react";

const SCHEMES = [
  { id: "void",   label: "Void",   accent: "#7c3aed", bright: "#a855f7", dim: "#5b21b6", border: "#2a1f4a" },
  { id: "blood",  label: "Blood",  accent: "#9b1c1c", bright: "#dc2626", dim: "#7f1d1d", border: "#3b0a0a" },
  { id: "toxic",  label: "Toxic",  accent: "#15803d", bright: "#4ade80", dim: "#14532d", border: "#052e16" },
  { id: "abyss",  label: "Abyss",  accent: "#1d4ed8", bright: "#60a5fa", dim: "#1e3a8a", border: "#0c1a3e" },
  { id: "static", label: "Static", accent: "#4b5563", bright: "#9ca3af", dim: "#374151", border: "#1f2937" },
  { id: "rust",   label: "Rust",   accent: "#b45309", bright: "#fbbf24", dim: "#92400e", border: "#3d1a00" },
];

function applyScheme(scheme: typeof SCHEMES[0]) {
  const root = document.documentElement;
  root.style.setProperty("--color-accent", scheme.accent);
  root.style.setProperty("--color-accent-bright", scheme.bright);
  root.style.setProperty("--color-accent-dim", scheme.dim);
  root.style.setProperty("--color-border", scheme.border);
}

function applyMode(m: "dark" | "light") {
  const root = document.documentElement;
  if (m === "light") {
    root.style.setProperty("--color-bg", "#f5f0e8");
    root.style.setProperty("--color-surface", "#ede6d6");
    root.style.setProperty("--color-surface-2", "#e4dcc8");
    root.style.setProperty("--color-text", "#1a0a2e");
    root.style.setProperty("--color-text-muted", "#5a4a7a");
    document.body.classList.add("light-mode");
  } else {
    root.style.setProperty("--color-bg", "#050508");
    root.style.setProperty("--color-surface", "#0d0a1a");
    root.style.setProperty("--color-surface-2", "#16102a");
    root.style.setProperty("--color-text", "#c8b8e8");
    root.style.setProperty("--color-text-muted", "#6b5a8a");
    document.body.classList.remove("light-mode");
  }
}

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("void");
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme-scheme");
    if (saved) {
      const scheme = SCHEMES.find((s) => s.id === saved);
      if (scheme) {
        applyScheme(scheme);
        setActiveId(scheme.id);
      }
    }
    const savedMode = localStorage.getItem("theme-mode");
    if (savedMode === "light" || savedMode === "dark") {
      applyMode(savedMode);
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  function handleSwatchClick(scheme: typeof SCHEMES[0]) {
    applyScheme(scheme);
    setActiveId(scheme.id);
    localStorage.setItem("theme-scheme", scheme.id);
  }

  return (
    <div
      ref={containerRef}
      style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 1000 }}
    >
      {open && (
        <div className="theme-picker-panel">
          <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
            {(["dark", "light"] as const).map((m) => (
              <button
                key={m}
                className={`mode-toggle-btn${mode === m ? " active" : ""}`}
                onClick={() => { applyMode(m); setMode(m); localStorage.setItem("theme-mode", m); }}
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
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="7" cy="7" r="3" fill="currentColor" opacity="0.9"/>
          <circle cx="15" cy="7" r="3" fill="currentColor" opacity="0.6"/>
          <circle cx="11" cy="15" r="3" fill="currentColor" opacity="0.75"/>
        </svg>
      </button>
    </div>
  );
}
