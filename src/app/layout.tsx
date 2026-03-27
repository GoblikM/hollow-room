/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "@/app/globals.css";
import SiteShell from "@/components/SiteShell";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Hollow-room",
  description: "Personal blog and portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Share+Tech+Mono&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CustomCursor />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
