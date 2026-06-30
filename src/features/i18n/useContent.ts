"use client";

import { useLang } from "@/features/i18n/LanguageProvider";
import { HOME } from "@/content/home";
import { ABOUT } from "@/content/about";
import { GAMES } from "@/content/games";
import { PROJECTS } from "@/content/projects";
import { UI } from "@/content/ui";

// Returns every content dictionary resolved to the current language. Components
// read their copy via `const c = useContent(); c.home.hero.title`.
export function useContent() {
  const lang = useLang();
  return {
    home: HOME[lang],
    about: ABOUT[lang],
    games: GAMES[lang],
    projects: PROJECTS[lang],
    ui: UI[lang],
  };
}
