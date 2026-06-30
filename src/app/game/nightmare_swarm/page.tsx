"use client";

import DemoPage from "@/shared/ui/DemoPage";
import { useContent } from "@/features/i18n/useContent";
import NightmareSwarm from "@/features/games/nightmare_swarm/components/NightmareSwarm";

export default function Page() {
  const { games } = useContent();
  return (
    <DemoPage {...games.pages.nightmare_swarm}>
      <NightmareSwarm />
    </DemoPage>
  );
}
