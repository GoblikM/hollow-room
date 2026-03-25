import { render, screen, fireEvent } from "@testing-library/react";
import Nav from "@/components/Nav";

// Mock next/navigation
const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

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

describe("Nav component", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
  });

  it("renders without crashing", () => {
    render(<Nav />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Nav />);
    expect(screen.getAllByRole("link", { name: /home/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /blog/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /projects/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /games/i }).length).toBeGreaterThan(0);
  });

  it("marks the active page link with aria-current='page' on home route", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);

    // All links with href="/" should have aria-current="page"
    const homeLinks = screen.getAllByRole("link", { name: /home/i });
    const activeHomeLinks = homeLinks.filter(
      (link) => link.getAttribute("aria-current") === "page"
    );
    expect(activeHomeLinks.length).toBeGreaterThan(0);
  });

  it("marks the active page link with aria-current='page' on blog route", () => {
    mockUsePathname.mockReturnValue("/blog");
    render(<Nav />);

    const blogLinks = screen.getAllByRole("link", { name: /blog/i });
    const activeLinks = blogLinks.filter(
      (link) => link.getAttribute("aria-current") === "page"
    );
    expect(activeLinks.length).toBeGreaterThan(0);
  });

  it("does not mark non-active links with aria-current", () => {
    mockUsePathname.mockReturnValue("/blog");
    render(<Nav />);

    const projectLinks = screen.getAllByRole("link", { name: /projects/i });
    projectLinks.forEach((link) => {
      expect(link.getAttribute("aria-current")).toBeNull();
    });
  });

  it("toggles mobile menu when hamburger button is clicked", () => {
    render(<Nav />);

    // The hamburger button is always in the DOM (hidden via CSS on desktop)
    // Use getByLabelText to find it regardless of display:none
    const hamburger = screen.getByLabelText(/open menu/i);
    expect(hamburger).toBeInTheDocument();
    expect(hamburger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(hamburger);

    // After click, aria-expanded toggles and aria-label changes
    expect(hamburger).toHaveAttribute("aria-expanded", "true");
    expect(hamburger).toHaveAttribute("aria-label", "Close menu");
  });

  it("closes mobile menu when a link is clicked", () => {
    render(<Nav />);

    const hamburger = screen.getByLabelText(/open menu/i);
    fireEvent.click(hamburger);

    expect(hamburger).toHaveAttribute("aria-expanded", "true");

    // Mobile menu is rendered — click a link inside it
    const mobileMenu = screen.getByRole("menu");
    const blogMenuLink = mobileMenu.querySelector('a[href="/blog"]');
    expect(blogMenuLink).not.toBeNull();
    fireEvent.click(blogMenuLink!);

    // After clicking, menu collapses
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
    expect(hamburger).toHaveAttribute("aria-label", "Open menu");
  });
});
