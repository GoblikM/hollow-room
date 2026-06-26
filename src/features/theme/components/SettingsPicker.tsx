"use client";

import { useState, useEffect, useRef } from "react";
import { SCHEMES, type ColorScheme, type ThemeMode } from "@/features/theme/constants/themePalette";
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
import { useScroll } from "@/app/providers/ScrollProvider";
import { SECTION_IDS } from "@/features/navigation/constants/navigation";
import styles from "./SettingsPicker.module.css";

export default function SettingsPicker() {
  const isDev = process.env.NODE_ENV !== "production";
  const [open, setOpen] = useState(false);
  const [openSchemes, setOpenSchemes] = useState(false);
  const [activeId, setActiveId] = useState(getInitialSchemeId);
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const [desktopNavEnabled, setDesktopNavEnabled] = useState(getInitialDesktopNavEnabled);
  const [isFlowLocked, setIsFlowLocked] = useState(false);
  const [isGuidedEnabled, setIsGuidedEnabled] = useState(false);
  const [flowStepIndex, setFlowStepIndex] = useState(0);
  const [hasOpenedSettingsInFlow, setHasOpenedSettingsInFlow] = useState(false);
  const { isPlaying, togglePlayback } = useAudio();
  const { resize } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scheme = getSchemeById(activeId);
    applyScheme(scheme);
    applyMode(mode);
    applyDesktopNavEnabled(desktopNavEnabled);
  }, [activeId, desktopNavEnabled, mode]);

  useEffect(() => {
    // padding-top on #smooth-content changes when navbar is toggled —
    // wait one frame for layout to settle, then refresh scroll measurements.
    requestAnimationFrame(() => resize());
  }, [desktopNavEnabled, resize]);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  useEffect(() => {
    const syncLockState = () => {
      setIsFlowLocked(document.body.classList.contains("guided-flow-pending"));
    };

    const handleGuidedFlowLockChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ locked?: boolean }>;
      setIsFlowLocked(Boolean(customEvent.detail?.locked));
    };

    syncLockState();
    window.addEventListener("guidedFlowLockChanged", handleGuidedFlowLockChange);

    return () => {
      window.removeEventListener("guidedFlowLockChanged", handleGuidedFlowLockChange);
    };
  }, []);

  useEffect(() => {
    const handleFlowStateChange = (event: Event) => {
      const customEvent = event as CustomEvent<{
        isGuidedEnabled?: boolean;
        flowStepIndex?: number;
        hasOpenedSettingsInFlow?: boolean;
      }>;
      if (customEvent.detail?.isGuidedEnabled !== undefined) {
        setIsGuidedEnabled(customEvent.detail.isGuidedEnabled);
      }
      if (customEvent.detail?.flowStepIndex !== undefined) {
        setFlowStepIndex(customEvent.detail.flowStepIndex);
      }
      if (customEvent.detail?.hasOpenedSettingsInFlow !== undefined) {
        setHasOpenedSettingsInFlow(customEvent.detail.hasOpenedSettingsInFlow);
      }
    };

    window.addEventListener("flowStateChanged", handleFlowStateChange);
    return () => {
      window.removeEventListener("flowStateChanged", handleFlowStateChange);
    };
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
    if (isFlowLocked) {
      return;
    }

    setDesktopNavEnabled((current) => {
      const next = !current;
      applyDesktopNavEnabled(next);
      localStorage.setItem("ui-desktop-nav", next ? "1" : "0");
      return next;
    });
  }

  function handleMusicToggle() {
    togglePlayback();
  }

  function handleDevResetStorage() {
    localStorage.clear();
    window.location.reload();
  }

  function handleToggleSettingsPanel() {
    setOpen((current) => !current);
  }

  useEffect(() => {
    if (open) {
      window.dispatchEvent(new CustomEvent("settingsPanelOpened"));
    }
  }, [open]);

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-1000 overflow-visible">
      {open && (
        <div className={styles.themePickerPanel}>
          <div className={styles.modeToggleRow}>
            {(["dark", "light"] as const).map((m) => (
              <button
                key={m}
                className={`${styles.modeToggleBtn}${mode === m ? ` ${styles.active}` : ""}`}
                onClick={() => handleModeChange(m)}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          <button className={styles.schemesToggleBtn} onClick={() => setOpenSchemes((v) => !v)} aria-expanded={openSchemes}>
            <span>Color schemes</span>
            <svg className={styles.schemesToggleIcon} width="14" height="14" viewBox="0 0 12 12" fill="currentColor">
              <polygon points={openSchemes ? "10 2 2 10 2 2" : "2 2 10 2 6 8"} />
            </svg>
          </button>

          {openSchemes && (
            <div className={styles.schemesList}>
              {SCHEMES.map((scheme) => (
                <button
                  key={scheme.id}
                  className={styles.themeSwatch}
                  onClick={() => handleSwatchClick(scheme)}
                  aria-label={scheme.label}
                >
                  <span
                    className={`${styles.themeSwatchCircle}${activeId === scheme.id ? ` ${styles.active}` : ""}`}
                    style={{ backgroundColor: scheme.accent }}
                  />
                  <span>{scheme.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className={`${styles.themeToggleRow} ui-desktop-nav-row`}>
            <span className={styles.themeToggleMeta}>
              <span className={styles.themeToggleTitle}>Desktop navbar</span>
            </span>

            <label className={styles.themeSwitch} aria-label="Toggle desktop navbar">
              <input
                className={styles.themeSwitchInput}
                type="checkbox"
                checked={desktopNavEnabled}
                disabled={isFlowLocked}
                onChange={handleDesktopNavToggle}
              />
              <span className={styles.themeSwitchTrack} aria-hidden="true">
                <span className={styles.themeSwitchThumb} />
              </span>
            </label>
          </div>

          <div className={styles.audioControlRow}>
            <span className={styles.themeToggleMeta}>
              <span className={styles.themeToggleTitle}>Music</span>
            </span>

            <label className={styles.themeSwitch} aria-label="Toggle music">
              <input className={styles.themeSwitchInput} type="checkbox" checked={isPlaying} onChange={handleMusicToggle} />
              <span className={styles.themeSwitchTrack} aria-hidden="true">
                <span className={styles.themeSwitchThumb} />
              </span>
            </label>
          </div>

          {isDev && (
            <button type="button" className={styles.devResetBtn} onClick={handleDevResetStorage}>
              DEV: clear localStorage
            </button>
          )}
        </div>
      )}
      <div className="relative inline-block z-1001">
        {isGuidedEnabled && !hasOpenedSettingsInFlow && SECTION_IDS[flowStepIndex] === "contact" && (
          <button
            type="button"
            className="hero-play-trigger absolute right-full mr-1 whitespace-nowrap z-1001"
            aria-label="Settings panel hint"
            tabIndex={-1}
          >
            open settings &gt;
          </button>
        )}
        <button
          className={`${styles.themePickerBtn}${isPlaying ? ` ${styles.isPlaying}` : ""}`}
          onClick={handleToggleSettingsPanel}
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
    </div>
  );
}
