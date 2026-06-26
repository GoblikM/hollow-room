import DemoPage from "@/shared/ui/DemoPage";
import Game2048 from "@/features/games/2048/components/Game2048";
import SolverGuide from "@/features/games/2048/components/SolverGuide";
import { GAME_PAGE_CONTENT } from "@/content/games";

export default function Page() {
  return (
    <DemoPage {...GAME_PAGE_CONTENT["2048"]}>
      <Game2048 />
      <SolverGuide />
    </DemoPage>
  );
}
