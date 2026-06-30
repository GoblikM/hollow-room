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
import { useContent } from "@/features/i18n/useContent";
import Footer from "@/shared/ui/Footer";

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { ui } = useContent();
  const isHomepage = pathname === "/" || pathname === "";
  const activeSection = useActiveSection(isHomepage ? SECTION_IDS : []);

  return (
    <ScrollProvider
      fixedChildren={
        <>
          <Nav activeSection={isHomepage ? activeSection : undefined} />
          {isHomepage && <ScrollRail />}
          {!isHomepage && (
            <Link href="/" className="subpage-back font-mono hover-text-glitch text-glitch-soft">
              {ui.nav.back}
            </Link>
          )}
          <SettingsPicker />
        </>
      }
    >
      {children}
      <Footer />
    </ScrollProvider>
  );
}
