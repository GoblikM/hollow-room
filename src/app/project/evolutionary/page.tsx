"use client";

import DemoPage from "@/shared/ui/DemoPage";
import EvolutionaryProject from "@/features/projects/evolutionary/EvolutionaryProject";
import { useContent } from "@/features/i18n/useContent";

export default function Page() {
  const { projects } = useContent();
  return (
    <DemoPage {...projects.pages.evolutionary}>
      <EvolutionaryProject />
    </DemoPage>
  );
}
