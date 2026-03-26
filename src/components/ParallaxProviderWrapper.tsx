"use client";

import { ParallaxProvider } from "react-scroll-parallax";

type ParallaxProviderWrapperProps = {
  children: React.ReactNode;
};

export default function ParallaxProviderWrapper({
  children,
}: ParallaxProviderWrapperProps) {
  return <ParallaxProvider>{children}</ParallaxProvider>;
}