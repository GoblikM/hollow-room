import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

jest.mock("@/features/audio/context/AudioContext", () => ({
  useAudio: () => ({
    audioRef: { current: null },
    isPlaying: false,
    setIsPlaying: jest.fn(),
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
});
