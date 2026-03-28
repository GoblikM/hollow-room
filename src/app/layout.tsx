import type { Metadata } from "next";

import "@/app/globals.css";
import SiteShell from "@/app/providers/SiteShell";
import CustomCursor from "@/shared/ui/CustomCursor";
import { fontVariables } from "@/assets/fonts";

export const metadata: Metadata = {
  title: "Hollow-room",
  description: "Personal blog and portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <CustomCursor />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
