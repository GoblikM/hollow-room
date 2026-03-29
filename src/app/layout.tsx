import type { Metadata } from "next";

import "@/app/globals.css";
import SiteShell from "@/app/providers/SiteShell";
import { AudioProvider } from "@/features/audio/context/AudioContext";
import AutoPlayMusic from "@/features/audio/components/AutoPlayMusic";
import CustomCursor from "@/shared/ui/CustomCursor";
import { fontVariables } from "@/assets/fonts";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Hollow-room",
  description: "Personal blog and portfolio",
  icons: {
    icon: `${publicBasePath}/icon.svg`,
    shortcut: `${publicBasePath}/icon.svg`,
    apple: `${publicBasePath}/icon.svg`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <AudioProvider>
          <AutoPlayMusic />
          <CustomCursor />
          <SiteShell>{children}</SiteShell>
        </AudioProvider>
      </body>
    </html>
  );
}
