import {
  collectSectionMetrics,
  findCenterSection,
  getCenteredScrollTarget,
  getRailProgressFromSections,
  type SectionMetrics,
} from "@/shared/utils/scrollRailMath";

describe("scrollRailMath", () => {
  it("collects metrics only for sections present in the DOM", () => {
    document.body.innerHTML = '<section id="home"></section>';
    const home = document.getElementById("home") as HTMLElement;

    Object.defineProperty(home, "offsetTop", {
      value: 120,
      configurable: true,
    });
    Object.defineProperty(home, "offsetHeight", {
      value: 400,
      configurable: true,
    });

    const metrics = collectSectionMetrics(["home", "missing"]);

    expect(metrics).toEqual([
      {
        id: "home",
        top: 120,
        bottom: 520,
        center: 320,
      },
    ]);
  });

  it("finds the section containing viewport center and falls back to nearest center", () => {
    const sections: SectionMetrics[] = [
      { id: "home", top: 0, bottom: 300, center: 150 },
      { id: "about", top: 500, bottom: 800, center: 650 },
    ];

    expect(findCenterSection(100, sections, "home", 400)).toBe("home");
    expect(findCenterSection(350, sections, "home", 200)).toBe("about");
  });

  it("maps progress to 1 when the last center is unreachable", () => {
    const sections: SectionMetrics[] = [
      { id: "home", top: 0, bottom: 500, center: 250 },
      { id: "about", top: 600, bottom: 1100, center: 850 },
      { id: "blog", top: 1300, bottom: 1900, center: 1600 },
    ];

    const progressAtBottom = getRailProgressFromSections(1000, sections, 800, 1800);

    expect(progressAtBottom).toBe(1);
  });

  it("returns a clamped target for centered scroll", () => {
    expect(getCenteredScrollTarget(1500, 400, 1000, 700)).toBe(700);
    expect(getCenteredScrollTarget(100, 300, 1000, 2000)).toBe(0);
  });
});
