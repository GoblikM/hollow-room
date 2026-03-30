export const NAV_SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "games", label: "Games" },
  { id: "projects", label: "Projects" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof NAV_SECTIONS)[number]["id"];

export const NAV_LINKS = NAV_SECTIONS.map(({ id, label }) => ({
  href: `/#${id}`,
  label,
  id,
}));

export const SECTION_IDS = NAV_SECTIONS.map(({ id }) => id);
