import DemoPage from "@/shared/ui/DemoPage";

import { GAME_PAGE_CONTENT } from "@/content/games";
import NightmareSwarm from "@/features/games/nightmare_swarm/components/NightmareSwarm";

export default function Page() {
  return (
    <DemoPage {...GAME_PAGE_CONTENT["nightmare_swarm"]}>
      <NightmareSwarm />
    </DemoPage>
  );
}
