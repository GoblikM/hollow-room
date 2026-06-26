import DemoPage from "@/shared/ui/DemoPage";

import { GAME_PAGE_CONTENT } from "@/content/games";
import Placeholder from "@/features/projects/evolutionary/algorithms/Placeholder";

export default function Page() {
  return (
    <DemoPage {...GAME_PAGE_CONTENT["nightmare_swarm"]}>
        <Placeholder name="Nightmare Swarm" />
    </DemoPage>
  );
}
