import { render, screen, fireEvent } from "@testing-library/react";
import ThemePicker from "@/features/theme/components/ThemePicker";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string): string | null => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const setPropertyMock = jest.fn();
Object.defineProperty(document.documentElement, "style", {
  value: { setProperty: setPropertyMock },
  writable: true,
});

beforeEach(() => {
  localStorageMock.clear();
  jest.clearAllMocks();
});

describe("ThemePicker component", () => {
  it("renders without crashing — button visible, panel hidden", () => {
    render(<ThemePicker />);
    const btn = screen.getByRole("button", { name: /pick color scheme/i });
    expect(btn).toBeInTheDocument();
    // Panel should not be visible on initial render
    expect(screen.queryByRole("button", { name: /void/i })).not.toBeInTheDocument();
  });

  it("clicking button shows the panel", () => {
    render(<ThemePicker />);
    const btn = screen.getByRole("button", { name: /pick color scheme/i });
    fireEvent.click(btn);
    expect(screen.getByRole("button", { name: /void/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /blood/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /toxic/i })).toBeInTheDocument();
  });

  it("clicking button again hides the panel", () => {
    render(<ThemePicker />);
    const btn = screen.getByRole("button", { name: /pick color scheme/i });
    fireEvent.click(btn);
    expect(screen.getByRole("button", { name: /void/i })).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.queryByRole("button", { name: /void/i })).not.toBeInTheDocument();
  });

  it("clicking a swatch calls setProperty with --color-accent and the correct value", () => {
    render(<ThemePicker />);
    const btn = screen.getByRole("button", { name: /pick color scheme/i });
    fireEvent.click(btn);
    const bloodSwatch = screen.getByRole("button", { name: /blood/i });
    fireEvent.click(bloodSwatch);
    expect(setPropertyMock).toHaveBeenCalledWith("--color-accent", "#9b1c1c");
  });

  it("clicking a swatch saves scheme id to localStorage", () => {
    render(<ThemePicker />);
    const btn = screen.getByRole("button", { name: /pick color scheme/i });
    fireEvent.click(btn);
    const toxicSwatch = screen.getByRole("button", { name: /toxic/i });
    fireEvent.click(toxicSwatch);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme-scheme", "toxic");
  });

  it("on mount, reads localStorage and applies saved scheme", () => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === "theme-scheme") return "abyss";
      return null;
    });
    render(<ThemePicker />);
    expect(setPropertyMock).toHaveBeenCalledWith("--color-accent", "#1d4ed8");
    expect(setPropertyMock).toHaveBeenCalledWith("--color-accent-bright", "#60a5fa");
  });

  it("clicking LIGHT button sets --color-base to parchment", () => {
    render(<ThemePicker />);
    fireEvent.click(screen.getByRole("button", { name: /pick color scheme/i }));
    fireEvent.click(screen.getByRole("button", { name: /light/i }));
    expect(setPropertyMock).toHaveBeenCalledWith("--color-base", "#f5f0e8");
  });

  it("clicking DARK button restores --color-base to dark", () => {
    render(<ThemePicker />);
    fireEvent.click(screen.getByRole("button", { name: /pick color scheme/i }));
    fireEvent.click(screen.getByRole("button", { name: /light/i }));
    fireEvent.click(screen.getByRole("button", { name: /dark/i }));
    expect(setPropertyMock).toHaveBeenCalledWith("--color-base", "#050508");
  });

  it("clicking LIGHT adds light-mode class to document.body", () => {
    render(<ThemePicker />);
    fireEvent.click(screen.getByRole("button", { name: /pick color scheme/i }));
    fireEvent.click(screen.getByRole("button", { name: /light/i }));
    expect(document.body.classList.contains("light-mode")).toBe(true);
  });

  it("clicking DARK removes light-mode class from document.body", () => {
    document.body.classList.add("light-mode");
    render(<ThemePicker />);
    fireEvent.click(screen.getByRole("button", { name: /pick color scheme/i }));
    fireEvent.click(screen.getByRole("button", { name: /dark/i }));
    expect(document.body.classList.contains("light-mode")).toBe(false);
  });

  it("mode toggle saves theme-mode to localStorage", () => {
    render(<ThemePicker />);
    fireEvent.click(screen.getByRole("button", { name: /pick color scheme/i }));
    fireEvent.click(screen.getByRole("button", { name: /light/i }));
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme-mode", "light");
  });

  it("reads theme-mode from localStorage on mount and applies light mode", () => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === "theme-mode") return "light";
      return null;
    });
    render(<ThemePicker />);
    expect(setPropertyMock).toHaveBeenCalledWith("--color-base", "#f5f0e8");
  });
});
