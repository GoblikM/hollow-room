import { render, screen, fireEvent } from "@testing-library/react";
import Nav from "@/features/navigation/components/Nav";

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

  it("uses hash hrefs for nav links", () => {
    render(<Nav />);
    const blogLinks = screen.getAllByRole("link", { name: /blog/i });
    const blogNavLink = blogLinks.find((link) => link.getAttribute("href") === "#blog");
    expect(blogNavLink).toBeTruthy();

    const projectLinks = screen.getAllByRole("link", { name: /projects/i });
    const projectNavLink = projectLinks.find((link) => link.getAttribute("href") === "#projects");
    expect(projectNavLink).toBeTruthy();

    const gamesLinks = screen.getAllByRole("link", { name: /games/i });
    const gamesNavLink = gamesLinks.find((link) => link.getAttribute("href") === "#games");
    expect(gamesNavLink).toBeTruthy();
  });

  it("marks the active page link with aria-current='page' on home section", () => {
    render(<Nav activeSection="home" />);

    const homeLinks = screen.getAllByRole("link", { name: /home/i });
    const activeHomeLinks = homeLinks.filter(
      (link) => link.getAttribute("aria-current") === "page"
    );
    expect(activeHomeLinks.length).toBeGreaterThan(0);
  });

  it("marks the active page link with aria-current='page' on blog section", () => {
    render(<Nav activeSection="blog" />);

    const blogLinks = screen.getAllByRole("link", { name: /blog/i });
    const activeLinks = blogLinks.filter(
      (link) => link.getAttribute("aria-current") === "page"
    );
    expect(activeLinks.length).toBeGreaterThan(0);
  });

  it("does not mark non-active links with aria-current", () => {
    render(<Nav activeSection="blog" />);

    const projectLinks = screen.getAllByRole("link", { name: /projects/i });
    projectLinks.forEach((link) => {
      expect(link.getAttribute("aria-current")).toBeNull();
    });
  });

  it("toggles mobile menu when hamburger button is clicked", () => {
    render(<Nav />);

    const hamburger = screen.getByLabelText(/open menu/i);
    expect(hamburger).toBeInTheDocument();
    expect(hamburger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(hamburger);

    expect(hamburger).toHaveAttribute("aria-expanded", "true");
    expect(hamburger).toHaveAttribute("aria-label", "Close menu");
  });

  it("closes mobile menu when a link is clicked", () => {
    render(<Nav />);

    const hamburger = screen.getByLabelText(/open menu/i);
    fireEvent.click(hamburger);

    expect(hamburger).toHaveAttribute("aria-expanded", "true");

    const mobileMenu = document.getElementById("nav-mobile-menu");
    expect(mobileMenu).not.toBeNull();
    const blogMenuLink = mobileMenu!.querySelector('a[href="#blog"]');
    expect(blogMenuLink).not.toBeNull();
    fireEvent.click(blogMenuLink!);

    expect(hamburger).toHaveAttribute("aria-expanded", "false");
    expect(hamburger).toHaveAttribute("aria-label", "Open menu");
  });
});
