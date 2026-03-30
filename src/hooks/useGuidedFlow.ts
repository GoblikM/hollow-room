"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ScrollContextValue } from "@/app/providers/ScrollProvider";
import { SECTION_IDS, type SectionId } from "@/features/navigation/constants/navigation";
import { getCenteredScrollTarget } from "@/shared/utils/scrollRailMath";

const GUIDED_FLOW_COMPLETED_KEY = "ui-guided-flow-completed";

type UseGuidedFlowOptions = {
  sectionIds?: SectionId[];
  scrollController: ScrollContextValue;
  onFreeAdvance?: () => void;
  onStartStep?: () => void;
};

type UseGuidedFlowResult = {
  sectionIds: SectionId[];
  flowStepIndex: number;
  currentSectionId: SectionId;
  isGuidedEnabled: boolean;
  isScrollUnlocked: boolean;
  isStepReady: boolean;
  hasOpenedSettingsInFlow: boolean;
  advance: () => Promise<void> | void;
};

function getFlowStepIndexFromHash(hash: string, sectionIds: SectionId[]): number {
  if (!hash.startsWith("#")) return -1;

  const normalizedHash = hash.slice(1).trim().toLowerCase();
  return sectionIds.findIndex((sectionId) => sectionId === normalizedHash);
}

function getFlowStepIndexFromScrollPosition(sectionIds: SectionId[]): number {
  const viewportCenter = window.scrollY + window.innerHeight * 0.5;
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  sectionIds.forEach((sectionId, index) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const sectionCenter = section.offsetTop + section.offsetHeight * 0.5;
    const distance = Math.abs(sectionCenter - viewportCenter);

    if (distance >= bestDistance) return;

    bestDistance = distance;
    bestIndex = index;
  });

  return bestIndex;
}

async function waitForSectionTypingDone(sectionId: SectionId): Promise<void> {
  const section = document.getElementById(sectionId);
  const intro = section?.querySelector<HTMLElement>(".section-intro");

  if (!intro) return;

  const resolveIfDone = () => !intro.classList.contains("typing-heading");
  if (resolveIfDone()) return;

  await new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!resolveIfDone()) return;
      observer.disconnect();
      resolve();
    });

    const timeout = window.setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 7000);

    observer.observe(intro, { attributes: true, attributeFilter: ["class"] });

    if (resolveIfDone()) {
      window.clearTimeout(timeout);
      observer.disconnect();
      resolve();
    }
  });
}

export function useGuidedFlow({
  sectionIds,
  scrollController,
  onFreeAdvance,
  onStartStep,
}: UseGuidedFlowOptions): UseGuidedFlowResult {
  const resolvedSectionIds = useMemo(() => {
    if (sectionIds && sectionIds.length > 0) return sectionIds;
    return SECTION_IDS as SectionId[];
  }, [sectionIds]);

  const [flowStepIndex, setFlowStepIndex] = useState(() => {
    if (typeof window === "undefined") return 0;

    const hashStepIndex = getFlowStepIndexFromHash(window.location.hash, resolvedSectionIds);
    return hashStepIndex >= 0 ? hashStepIndex : getFlowStepIndexFromScrollPosition(resolvedSectionIds);
  });
  const [isStepReady, setIsStepReady] = useState(true);
  const [isScrollUnlocked, setIsScrollUnlocked] = useState(false);
  const [isGuidedEnabled, setIsGuidedEnabled] = useState(false);
  const [hasOpenedSettingsInFlow, setHasOpenedSettingsInFlow] = useState(false);

  const currentSectionId = resolvedSectionIds[flowStepIndex] ?? resolvedSectionIds[0] ?? "home";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 641px)");

    const syncGuidedMode = () => {
      const hasCompletedGuidedFlow = localStorage.getItem(GUIDED_FLOW_COMPLETED_KEY) === "1";
      setIsGuidedEnabled(mediaQuery.matches && !hasCompletedGuidedFlow);
    };

    syncGuidedMode();
    mediaQuery.addEventListener("change", syncGuidedMode);

    return () => {
      mediaQuery.removeEventListener("change", syncGuidedMode);
    };
  }, []);

  useEffect(() => {
    if (!isGuidedEnabled || isScrollUnlocked) {
      document.body.classList.remove("guided-scroll-locked");
      return;
    }

    document.body.classList.add("guided-scroll-locked");

    const prevent = (event: Event) => {
      event.preventDefault();
    };

    const preventKeyboardScroll = (event: KeyboardEvent) => {
      const blockedKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
      if (!blockedKeys.includes(event.key)) return;
      event.preventDefault();
    };

    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });
    window.addEventListener("keydown", preventKeyboardScroll, { passive: false });

    return () => {
      document.body.classList.remove("guided-scroll-locked");
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      window.removeEventListener("keydown", preventKeyboardScroll);
    };
  }, [isGuidedEnabled, isScrollUnlocked]);

  useEffect(() => {
    const flowLocked = isGuidedEnabled && !isScrollUnlocked;
    document.body.classList.toggle("guided-flow-pending", flowLocked);
    window.dispatchEvent(new CustomEvent("guidedFlowLockChanged", { detail: { locked: flowLocked } }));

    return () => {
      document.body.classList.remove("guided-flow-pending");
    };
  }, [isGuidedEnabled, isScrollUnlocked]);

  useEffect(() => {
    const handleSettingsPanelOpened = () => {
      setHasOpenedSettingsInFlow(true);
    };

    window.addEventListener("settingsPanelOpened", handleSettingsPanelOpened);

    return () => {
      window.removeEventListener("settingsPanelOpened", handleSettingsPanelOpened);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("flowStateChanged", {
        detail: {
          isGuidedEnabled,
          flowStepIndex,
          hasOpenedSettingsInFlow,
        },
      }),
    );
  }, [isGuidedEnabled, flowStepIndex, hasOpenedSettingsInFlow]);

  const advance = useCallback(async () => {
    if (!isGuidedEnabled) {
      onFreeAdvance?.();
      return;
    }

    if (!isStepReady) return;

    const isFinalStep = flowStepIndex === resolvedSectionIds.length - 1;
    if (isFinalStep) {
      setIsScrollUnlocked(true);
      localStorage.setItem(GUIDED_FLOW_COMPLETED_KEY, "1");
      return;
    }

    if (flowStepIndex === 0) {
      onStartStep?.();
    }

    const nextStepIndex = flowStepIndex + 1;
    const nextSectionId = resolvedSectionIds[nextStepIndex];
    const nextSectionEl = nextSectionId ? document.getElementById(nextSectionId) : null;

    setIsStepReady(false);
    setFlowStepIndex(nextStepIndex);

    if (nextSectionEl) {
      const controllerLimit = scrollController.getScrollValues().limit;
      const scrollLimit =
        controllerLimit > 0 ? controllerLimit : Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      const centeredTarget = getCenteredScrollTarget(
        nextSectionEl.offsetTop,
        nextSectionEl.offsetHeight,
        window.innerHeight,
        scrollLimit,
      );

      scrollController.scrollTo(centeredTarget, {
        immediate: false,
        duration: 1.1,
      });
    }

    if (nextSectionId) {
      await waitForSectionTypingDone(nextSectionId);
    }

    setIsStepReady(true);
  }, [flowStepIndex, isGuidedEnabled, isStepReady, onFreeAdvance, onStartStep, resolvedSectionIds, scrollController]);

  return {
    sectionIds: resolvedSectionIds,
    flowStepIndex,
    currentSectionId,
    isGuidedEnabled,
    isScrollUnlocked,
    isStepReady,
    hasOpenedSettingsInFlow,
    advance,
  };
}
