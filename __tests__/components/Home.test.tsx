import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

jest.mock("@/features/audio/context/AudioContext", () => ({
  useAudio: () => ({
    audioRef: { current: null },
    isPlaying: false,
    setIsPlaying: jest.fn(),
    play: jest.fn(),
    togglePlayback: jest.fn(),
  }),
}));

jest.mock("@/app/providers/ScrollProvider", () => ({
  useScroll: () => ({
    scrollTo: jest.fn(),
    resize: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
    getScrollValues: () => ({ scroll: 0, limit: 0, velocity: 0, direction: 0, progress: 0 }),
  }),
}));

// Mock IntersectionObserver — not implemented in Jest/jsdom
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.history.replaceState
window.history.replaceState = jest.fn();

// Mock next/link to render a plain <a>
jest.mock("next/link", () => {
  const MockLink = ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("Home page", () => {
  afterEach(() => {
    window.location.hash = "";
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it("renders the site title", () => {
    render(<Home />);
    expect(screen.getByText("hollow-room")).toBeInTheDocument();
  });

  it("renders the home section", () => {
    render(<Home />);
    expect(document.getElementById("home")).toBeInTheDocument();
  });

  it("renders the blog section", () => {
    render(<Home />);
    expect(document.getElementById("blog")).toBeInTheDocument();
  });

  it("renders the projects section", () => {
    render(<Home />);
    expect(document.getElementById("projects")).toBeInTheDocument();
  });

  it("renders the games section", () => {
    render(<Home />);
    expect(document.getElementById("games")).toBeInTheDocument();
  });

  it("restores guided flow step from hash after refresh", async () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    window.location.hash = "#about";

    render(<Home />);

    expect(await screen.findByRole("button", { name: /descend deeper ->/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /click to play ->/i })).not.toBeInTheDocument();
  });
});
