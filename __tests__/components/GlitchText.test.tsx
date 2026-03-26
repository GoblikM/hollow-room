import { render, screen, fireEvent, act } from "@testing-library/react";
import GlitchText from "@/components/GlitchText";

describe("GlitchText component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders children text", () => {
    render(<GlitchText>hello world</GlitchText>);
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("renders as span by default", () => {
    render(<GlitchText>test</GlitchText>);
    const wrapper = screen.getByText("test").closest(".glitch-text");
    expect(wrapper?.tagName).toBe("SPAN");
  });

  it("renders as h1 when as='h1'", () => {
    render(<GlitchText as="h1">heading</GlitchText>);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("glitch-text");
  });

  it("applies glitch-active class after auto-timer fires", () => {
    // Force Math.random to return 0 so delay = GLITCH_MIN_DELAY_MS (3000)
    const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0);

    render(<GlitchText>auto</GlitchText>);
    const wrapper = screen.getByText("auto").closest(".glitch-text")!;

    expect(wrapper).not.toHaveClass("glitch-active");

    act(() => {
      jest.advanceTimersByTime(3001);
    });

    expect(wrapper).toHaveClass("glitch-active");

    randomSpy.mockRestore();
  });

  it("applies glitch-active class on mouse enter", () => {
    render(<GlitchText>hover me</GlitchText>);
    const wrapper = screen.getByText("hover me").closest(".glitch-text")!;

    expect(wrapper).not.toHaveClass("glitch-active");

    fireEvent.mouseEnter(wrapper);

    expect(wrapper).toHaveClass("glitch-active");
  });

  it("removes glitch-active class on animation end", () => {
    render(<GlitchText>animate</GlitchText>);
    const wrapper = screen.getByText("animate").closest(".glitch-text")!;

    fireEvent.mouseEnter(wrapper);
    expect(wrapper).toHaveClass("glitch-active");

    fireEvent.animationEnd(wrapper);
    expect(wrapper).not.toHaveClass("glitch-active");
  });

  it("cleans up timers on unmount without warnings", () => {
    const { unmount } = render(<GlitchText>cleanup</GlitchText>);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    unmount();

    // Advancing timers after unmount should not cause act() warnings
    act(() => {
      jest.advanceTimersByTime(10000);
    });
  });

  it("applies custom className", () => {
    render(<GlitchText className="text-7xl mb-6">styled</GlitchText>);
    const wrapper = screen.getByText("styled").closest(".glitch-text")!;
    expect(wrapper).toHaveClass("text-7xl");
    expect(wrapper).toHaveClass("mb-6");
  });

  it("wraps children in glitch-target chroma span", () => {
    render(<GlitchText>inner</GlitchText>);
    const innerSpan = screen.getByText("inner");
    expect(innerSpan.tagName).toBe("SPAN");
    expect(innerSpan).toHaveClass("glitch-target");
    expect(innerSpan).toHaveClass("chroma");
  });
});
