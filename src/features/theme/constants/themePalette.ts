export type ThemeMode = "dark" | "light";

export interface ColorScheme {
  id: string;
  label: string;
  accent: string;
  bright: string;
  dim: string;
  border: string;
}

export const DEFAULT_SCHEME_ID = "void";
export const DEFAULT_THEME_MODE: ThemeMode = "dark";

export const SCHEMES: ColorScheme[] = [
  {
    id: "void",
    label: "Void",
    accent: "#7c3aed",
    bright: "#a855f7",
    dim: "#5b21b6",
    border: "#2a1f4a",
  },
  {
    id: "blood",
    label: "Blood",
    accent: "#9b1c1c",
    bright: "#dc2626",
    dim: "#7f1d1d",
    border: "#3b0a0a",
  },
  {
    id: "toxic",
    label: "Toxic",
    accent: "#15803d",
    bright: "#4ade80",
    dim: "#14532d",
    border: "#052e16",
  },
  {
    id: "abyss",
    label: "Abyss",
    accent: "#1d4ed8",
    bright: "#60a5fa",
    dim: "#1e3a8a",
    border: "#0c1a3e",
  },
  {
    id: "static",
    label: "Static",
    accent: "#4b5563",
    bright: "#9ca3af",
    dim: "#374151",
    border: "#1f2937",
  },
  {
    id: "rust",
    label: "Rust",
    accent: "#b45309",
    bright: "#fbbf24",
    dim: "#92400e",
    border: "#3d1a00",
  },
];

export const LIGHT_MODE_COLORS = {
  bg: "#f5f0e8",
  surface: "#ede6d6",
  surface2: "#e4dcc8",
  text: "#1a0a2e",
  textMuted: "#5a4a7a",
};

export const DARK_MODE_COLORS = {
  bg: "#050508",
  surface: "#0d0a1a",
  surface2: "#16102a",
  text: "#c8b8e8",
  textMuted: "#6b5a8a",
};
