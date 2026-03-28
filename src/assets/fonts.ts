import {
  Crimson_Text,
  IM_Fell_English,
  Share_Tech_Mono,
  Silkscreen,
} from "next/font/google";

export const headingFont = IM_Fell_English({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const pixelFont = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
});

export const monoFont = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const bodyFont = Crimson_Text({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const fontVariables = [headingFont, pixelFont, monoFont, bodyFont]
  .map((f) => f.variable)
  .join(" ");
