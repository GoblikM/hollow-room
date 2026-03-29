import { renderHook, act } from "@testing-library/react";
import { useActiveSection } from "../../src/hooks/useActiveSection";

let observerCallback: IntersectionObserverCallback;
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  observerCallback = undefined as unknown as IntersectionObserverCallback;
  window.history.pushState(null, "", "/");
  let nowTick = 0;
  jest.spyOn(performance, "now").mockImplementation(() => {
    nowTick += 130;
    return nowTick;
  });

  global.IntersectionObserver = jest.fn().mockImplementation((cb: IntersectionObserverCallback) => {
    observerCallback = cb;
    return {
      observe: mockObserve,
      unobserve: jest.fn(),
      disconnect: mockDisconnect,
    };
  });

  jest.spyOn(window.history, "replaceState");
});

afterEach(() => {
  jest.restoreAllMocks();
});

const SECTION_IDS = ["home", "about", "blog"];

function makeEntry(id: string, intersectionRatio: number): IntersectionObserverEntry {
  return {
    target: { id } as Element,
    intersectionRatio,
    isIntersecting: intersectionRatio > 0,
  } as IntersectionObserverEntry;
}

function makeObserver(): IntersectionObserver {
  return {} as IntersectionObserver;
}

describe("useActiveSection", () => {
  it("returns first section id as default active section", () => {
    const { result } = renderHook(() => useActiveSection(SECTION_IDS));
    expect(result.current).toBe("home");
  });

  it("returns non-home section id and updates hash when observer fires with ratio > 0", () => {
    const { result } = renderHook(() => useActiveSection(SECTION_IDS));

    act(() => {
      observerCallback([makeEntry("blog", 0.5)], makeObserver());
    });

    expect(result.current).toBe("blog");
    expect(window.history.replaceState).toHaveBeenCalledWith(null, "", "#blog");
  });

  it("calls replaceState with pathname only when home section is most visible", () => {
    const { result } = renderHook(() => useActiveSection(SECTION_IDS));

    // First make blog active
    act(() => {
      observerCallback([makeEntry("blog", 0.5)], makeObserver());
    });

    expect(result.current).toBe("blog");

    // Now make home the most visible
    act(() => {
      observerCallback([makeEntry("home", 0.8), makeEntry("blog", 0.1)], makeObserver());
    });

    expect(result.current).toBe("home");
    expect(window.history.replaceState).toHaveBeenLastCalledWith(null, "", window.location.pathname);
  });
});
