import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "goblikm",
  description: "Personal blog and portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
