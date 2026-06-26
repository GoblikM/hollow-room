import DemoPage from "@/shared/ui/DemoPage";
import EvolutionaryProject from "@/features/projects/evolutionary/EvolutionaryProject";
import { PROJECT_PAGE_CONTENT } from "@/content/projects";

export default function Page() {
  return (
    <DemoPage {...PROJECT_PAGE_CONTENT.evolutionary}>
      <EvolutionaryProject />
    </DemoPage>
  );
}
