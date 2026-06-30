// All copy for the home single-page app (src/app/page.tsx).
// Section card lists for games/projects live in ./games and ./projects.

export const HOME_HERO = {
  title: "hollow-room",
  subtitle: "blog & portfolio — coming soon here",
} as const;

export const HOME_SECTION_HEADINGS = {
  about: "about",
  games: "games",
  projects: "projects",
  blog: "blog",
  contact: "contact",
} as const;

export const HOME_SECTION_INTRO = {
  about:
    "A hollow room is just an empty vessel. Here's what fills mine—circuits, curiosity, and the occasional existential crisis.",
  games:
    "Small entities that haunt the edges of play. Prototypes born from late-night debugging sessions and restless experiments.",
  projects: "Shelves of unfinished things. Tools that solve problems I didn't know I had. Ideas preserved in code.",
  blog: "Whispers from the development void. Notes scratched while staring at screens. Lessons learned the hard way.",
  contact:
    "Send a signal into the void. If it reaches me, I'll respond. Collabs, game jams, weird experiments—all welcome here.",
} as const;

export const HOME_ABOUT_TEASER =
  "Developer, tinkerer, pixel hoarder. I build things that blink, scroll, and sometimes even work.";

export const HOME_ABOUT_CTA = "explore full story ->";

// Guided-flow continue button, one label per section step.
export const HOME_FLOW_BUTTONS = {
  home: "click to play ->",
  about: "descend deeper ->",
  games: "step through static ->",
  projects: "keep drifting ->",
  blog: "open final gate ->",
  contact: "break the seal ->",
  skip: "skip intro",
} as const;

export const HOME_CONTACT = {
  email: "goblikm@gmail.com",
  kicker: "reach out",
  copy: "Open for collabs, game jams, and weird web experiments. If you have an idea, send a message and I'll get back to you.",
  emailLabel: "email",
  socialsLabel: "social links",
  socials: [
    { label: "GitHub", href: "https://github.com/GoblikM" },
    { label: "X / Twitter", href: "https://x.com/" },
    { label: "Instagram", href: "https://instagram.com/" },
  ],
} as const;

export const HOME_BLOG_POSTS = [
  {
    title: "why I picked Godot over Unity",
    date: "2025-03-01",
    excerpt:
      "After a few weeks of dabbling with Unity, I switched to Godot and never looked back. The node tree model clicked instantly, GDScript feels light, and the engine ships as a single 80 MB binary. Here is what I learned in the process.",
  },
  {
    title: "building a static site with Next.js App Router",
    date: "2025-02-14",
    excerpt:
      "Static exports in Next.js 15 are surprisingly painless once you understand the constraints. No server-side props, no API routes — but you get full React and a great DX. This post walks through the setup I used for this very site.",
  },
  {
    title: "pixel fonts and the art of retro UI",
    date: "2025-01-28",
    excerpt:
      "Press Start 2P is iconic, but it is nearly unreadable at body text sizes. I spent an afternoon testing a dozen pixel and mono fonts before settling on Silkscreen for headings and Share Tech Mono for everything else.",
  },
] as const;
