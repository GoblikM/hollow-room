export const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#games", label: "Games" },
  { href: "#projects", label: "Projects" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
] as const;

export const SECTION_IDS = NAV_LINKS.map(({ href }) => href.replace("#", ""));
