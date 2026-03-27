"use client";

import { type ReactNode } from "react";
import ScrollProvider from "@/components/ScrollProvider";
import Nav from "@/components/Nav";
import ScrollRail from "@/components/ScrollRail";
import ThemePicker from "@/components/ThemePicker";
import { useActiveSection } from "@/hooks/useActiveSection";
import { SECTION_IDS } from "@/constants/navigation";

export default function SiteShell({ children }: { children: ReactNode }) {
  const activeSection = useActiveSection(SECTION_IDS);

  return (
    <ScrollProvider
      fixedChildren={
        <>
          <Nav activeSection={activeSection} />
          <ScrollRail />
          <ThemePicker />
        </>
      }
    >
      {children}
    </ScrollProvider>
  );
}
