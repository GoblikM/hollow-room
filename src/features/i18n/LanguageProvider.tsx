"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

export type Lang = "en" | "cz";

// The current language is an external store: SettingsPicker writes `ui-lang` to
// localStorage and dispatches `languageChanged`. useSyncExternalStore hydrates
// with the server snapshot ("en", matching the static HTML) then resyncs to the
// stored value — no hydration mismatch, no setState-in-effect.
function subscribe(callback: () => void) {
  window.addEventListener("languageChanged", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("languageChanged", callback);
    window.removeEventListener("storage", callback);
  };
}
const getSnapshot = (): Lang => (localStorage.getItem("ui-lang") === "cz" ? "cz" : "en");
const getServerSnapshot = (): Lang => "en";

const LangContext = createContext<Lang>("en");

export function useLang(): Lang {
  return useContext(LangContext);
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}
