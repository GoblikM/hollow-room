export type SectionMetrics = {
  id: string;
  top: number;
  bottom: number;
  center: number;
};

export function collectSectionMetrics(
  sectionIds: string[],
  doc: Document = document,
): SectionMetrics[] {
  return sectionIds
    .map((id) => {
      const section = doc.getElementById(id);
      if (!section) return null;

      const top = section.offsetTop;
      const height = section.offsetHeight;
      return {
        id,
        top,
        bottom: top + height,
        center: top + height / 2,
      };
    })
    .filter((section): section is SectionMetrics => section !== null);
}

export function findCenterSection(
  scrollY: number,
  sections: SectionMetrics[],
  fallbackId: string,
  viewportHeight: number = window.innerHeight,
): string {
  if (sections.length === 0) return fallbackId;

  const viewportCenter = scrollY + viewportHeight / 2;

  for (const section of sections) {
    if (viewportCenter >= section.top && viewportCenter < section.bottom) {
      return section.id;
    }
  }

  let nearestId = sections[0].id;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const section of sections) {
    const distance = Math.abs(section.center - viewportCenter);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestId = section.id;
    }
  }

  return nearestId;
}

export function getRailProgressFromSections(
  scrollY: number,
  sections: SectionMetrics[],
  viewportHeight: number = window.innerHeight,
  documentHeight: number = document.documentElement.scrollHeight,
): number {
  if (sections.length <= 1) return 0;

  const viewportCenter = scrollY + viewportHeight / 2;
  const maxViewportCenter =
    Math.max(documentHeight - viewportHeight, 0) + viewportHeight / 2;
  const sectionCenters = sections.map((section) => section.center);
  const lastIndex = sectionCenters.length - 1;
  const firstStopCenter = sectionCenters[0];
  const lastStopCenter = Math.min(sectionCenters[lastIndex], maxViewportCenter);

  if (viewportCenter <= firstStopCenter) return 0;
  if (viewportCenter >= lastStopCenter) return 1;

  for (let i = 1; i < sectionCenters.length; i += 1) {
    const previousCenter = Math.min(sectionCenters[i - 1], maxViewportCenter);
    const currentCenter = Math.min(sectionCenters[i], maxViewportCenter);

    if (currentCenter <= previousCenter) continue;

    if (viewportCenter <= currentCenter) {
      const segmentLength = Math.max(currentCenter - previousCenter, 1);
      const segmentProgress = (viewportCenter - previousCenter) / segmentLength;
      return (i - 1 + segmentProgress) / lastIndex;
    }
  }

  return 1;
}

export function getCenteredScrollTarget(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number,
  scrollLimit: number,
): number {
  const sectionCenterTarget = sectionTop + sectionHeight / 2 - viewportHeight / 2;
  return Math.max(0, Math.min(sectionCenterTarget, scrollLimit));
}
