"use client";

import DemoPage from "@/shared/ui/DemoPage";
import Game2048 from "@/features/games/2048/components/Game2048";
import SolverGuide from "@/features/games/2048/components/SolverGuide";
import { useContent } from "@/features/i18n/useContent";

export default function Page() {
  const { games } = useContent();
  return (
    <DemoPage {...games.pages["2048"]}>
      <Game2048 />
      <SolverGuide />
    </DemoPage>
  );
}
