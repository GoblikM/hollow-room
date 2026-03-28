"use client";

import { type ReactNode } from "react";
import ScrollProvider from "@/app/providers/ScrollProvider";
import Nav from "@/features/navigation/components/Nav";
import ScrollRail from "@/features/navigation/components/ScrollRail";
import ThemePicker from "@/components/ThemePicker";
import { useActiveSection } from "@/hooks/useActiveSection";
import { SECTION_IDS } from "@/features/navigation/constants/navigation";

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
