"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import ScrollProvider from "@/app/providers/ScrollProvider";
import Nav from "@/features/navigation/components/Nav";
import ScrollRail from "@/features/navigation/components/ScrollRail";
import SettingsPicker from "@/features/theme/components/SettingsPicker";
import { useActiveSection } from "@/hooks/useActiveSection";
import { usePathname } from "next/navigation";
import { SECTION_IDS } from "@/features/navigation/constants/navigation";

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHomepage = pathname === "/" || pathname === "";
  const activeSection = useActiveSection(isHomepage ? SECTION_IDS : []);

  return (
    <ScrollProvider
      fixedChildren={
        <>
          <Nav activeSection={isHomepage ? activeSection : undefined} />
          {isHomepage && <ScrollRail />}
          {!isHomepage && (
            <Link href="/" className="about-fixed-back font-mono hover-text-glitch text-glitch-soft">
              &lt;- home
            </Link>
          )}
          <SettingsPicker />
        </>
      }
    >
      {children}
    </ScrollProvider>
  );
}
