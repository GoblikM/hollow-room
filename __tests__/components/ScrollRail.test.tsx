import { fireEvent, render, screen } from "@testing-library/react";
import ScrollRail from "@/features/navigation/components/ScrollRail";

const scrollMocks = {
  scrollTo: jest.fn(),
  subscribe: jest.fn(),
  getScrollValues: jest.fn(),
  resize: jest.fn(),
};

jest.mock("@/app/providers/ScrollProvider", () => ({
  useScroll: () => ({
    scrollTo: scrollMocks.scrollTo,
    subscribe: scrollMocks.subscribe,
    getScrollValues: scrollMocks.getScrollValues,
    resize: scrollMocks.resize,
  }),
}));

describe("ScrollRail", () => {
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    scrollMocks.scrollTo.mockReset();
    scrollMocks.resize.mockReset();
    scrollMocks.subscribe.mockReset();
    scrollMocks.getScrollValues.mockReset();

    scrollMocks.subscribe.mockImplementation((listener) => {
      listener({
        scroll: 0,
        limit: 700,
        velocity: 0,
        direction: 0,
        progress: 0,
      });
      return () => undefined;
    });
    scrollMocks.getScrollValues.mockReturnValue({
      scroll: 0,
      limit: 700,
      velocity: 0,
      direction: 0,
      progress: 0,
    });

    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    }) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = (() =>
      undefined) as typeof window.cancelAnimationFrame;

    Object.defineProperty(window, "innerHeight", {
      value: 1000,
      configurable: true,
      writable: true,
    });

    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 2400,
      configurable: true,
    });

    document.body.innerHTML = '<section id="blog"></section>';
    const blogSection = document.getElementById("blog") as HTMLElement;
    Object.defineProperty(blogSection, "offsetTop", {
      value: 1200,
      configurable: true,
    });
    Object.defineProperty(blogSection, "offsetHeight", {
      value: 400,
      configurable: true,
    });
  });

  afterEach(() => {
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
    Object.defineProperty(window, "innerHeight", {
      value: originalInnerHeight,
      configurable: true,
      writable: true,
    });
    document.body.innerHTML = "";
  });

  it("scrolls to centered section target when clicking a label", () => {
    render(
      <ScrollRail
        sections={[{ id: "blog", label: "Blog" }]}
        revealSectionId={null}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Blog" }));

    expect(scrollMocks.scrollTo).toHaveBeenCalledWith(700);
  });
});
