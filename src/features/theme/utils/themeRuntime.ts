import {
  DARK_MODE_COLORS,
  DEFAULT_SCHEME_ID,
  DEFAULT_THEME_MODE,
  LIGHT_MODE_COLORS,
  SCHEMES,
  type ColorScheme,
  type ThemeMode,
} from "@/features/theme/constants/themePalette";

export function getInitialSchemeId(): string {
  if (typeof window === "undefined") {
    return DEFAULT_SCHEME_ID;
  }

  const saved = localStorage.getItem("theme-scheme");
  return saved !== null && SCHEMES.some((scheme) => scheme.id === saved) ? saved : DEFAULT_SCHEME_ID;
}

export function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_MODE;
  }

  const savedMode = localStorage.getItem("theme-mode");
  return savedMode === "light" || savedMode === "dark" ? savedMode : DEFAULT_THEME_MODE;
}

export function getInitialDesktopNavEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem("ui-desktop-nav") === "1";
}

export function getSchemeById(schemeId: string): ColorScheme {
  return SCHEMES.find((item) => item.id === schemeId) ?? SCHEMES[0];
}

export function applyScheme(scheme: ColorScheme) {
  const root = document.documentElement;
  root.style.setProperty("--color-accent", scheme.accent);
  root.style.setProperty("--color-accent-bright", scheme.bright);
  root.style.setProperty("--color-accent-dim", scheme.dim);
  root.style.setProperty("--color-outline", scheme.border);
}

export function applyMode(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "light") {
    root.style.setProperty("--color-base", LIGHT_MODE_COLORS.bg);
    root.style.setProperty("--color-surface", LIGHT_MODE_COLORS.surface);
    root.style.setProperty("--color-surface-2", LIGHT_MODE_COLORS.surface2);
    root.style.setProperty("--color-fg", LIGHT_MODE_COLORS.text);
    root.style.setProperty("--color-muted", LIGHT_MODE_COLORS.textMuted);
    document.body.classList.add("light-mode");
    return;
  }

  root.style.setProperty("--color-base", DARK_MODE_COLORS.bg);
  root.style.setProperty("--color-surface", DARK_MODE_COLORS.surface);
  root.style.setProperty("--color-surface-2", DARK_MODE_COLORS.surface2);
  root.style.setProperty("--color-fg", DARK_MODE_COLORS.text);
  root.style.setProperty("--color-muted", DARK_MODE_COLORS.textMuted);
  document.body.classList.remove("light-mode");
}

export function applyDesktopNavEnabled(enabled: boolean) {
  document.body.classList.toggle("desktop-nav-enabled", enabled);
}
