import { renderHook, act } from "@testing-library/react";
import { useActiveSection } from "../../src/hooks/useActiveSection";

let observerCallback: IntersectionObserverCallback;
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  observerCallback = undefined as unknown as IntersectionObserverCallback;

  global.IntersectionObserver = jest.fn().mockImplementation((cb) => {
    observerCallback = cb;
    return {
      observe: mockObserve,
      unobserve: jest.fn(),
      disconnect: mockDisconnect,
    };
  });

  window.history.replaceState = jest.fn();
});

const SECTION_IDS = ["home", "about", "blog"];

describe("useActiveSection", () => {
  it("returns first section id as default active section", () => {
    const { result } = renderHook(() => useActiveSection(SECTION_IDS));
    expect(result.current).toBe("home");
  });

  it("returns non-home section id and updates hash when observer fires with ratio > 0", () => {
    const { result } = renderHook(() => useActiveSection(SECTION_IDS));

    act(() => {
      observerCallback(
        [
          {
            target: { id: "blog" },
            intersectionRatio: 0.5,
            isIntersecting: true,
          } as any,
        ],
        {} as any
      );
    });

    expect(result.current).toBe("blog");
    expect(window.history.replaceState).toHaveBeenCalledWith(null, "", "#blog");
  });

  it("calls replaceState with pathname only when home section is most visible", () => {
    const { result } = renderHook(() => useActiveSection(SECTION_IDS));

    // First make blog active
    act(() => {
      observerCallback(
        [
          {
            target: { id: "blog" },
            intersectionRatio: 0.5,
            isIntersecting: true,
          } as any,
        ],
        {} as any
      );
    });

    expect(result.current).toBe("blog");

    // Now make home the most visible
    act(() => {
      observerCallback(
        [
          {
            target: { id: "home" },
            intersectionRatio: 0.8,
            isIntersecting: true,
          } as any,
          {
            target: { id: "blog" },
            intersectionRatio: 0.1,
            isIntersecting: true,
          } as any,
        ],
        {} as any
      );
    });

    expect(result.current).toBe("home");
    expect(window.history.replaceState).toHaveBeenLastCalledWith(
      null,
      "",
      window.location.pathname
    );
  });
});
