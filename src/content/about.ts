// All copy for the standalone About page (src/app/about/page.tsx) and its
// components (Timeline, HorizontalTimeline, SkillGrid).

export const ABOUT_HERO = {
  title: "about me",
  tagline: "Developer. Tinkerer. Pixel hoarder.",
} as const;

export const ABOUT_HEADINGS = {
  bio: "who am I",
  skills: "tech stack",
  interests: "interests",
} as const;

export const ABOUT_BIO = [
  "I'm a hobbyist game developer, web tinkerer, and occasional pixel pusher. I spend most of my time somewhere between a code editor and a game engine — building things that blink, scroll, and sometimes even work.",
  "I got into programming through modding games and never really stopped. These days I'm drawn to procedural generation, retro aesthetics, and the strange overlap between web tech and game dev. This site is one of those experiments — a static page that pretends it's haunted.",
  "When I'm not staring at a terminal, I'm probably sketching sprite sheets, reading horror fiction, or debugging something that worked five minutes ago.",
];

export type Interest = {
  label: string;
  detail: string;
};

export const INTERESTS: Interest[] = [
  {
    label: "Horror & weird fiction",
    detail: "Junji Ito, Lovecraft, analog horror, liminal spaces. The unsettling is underrated.",
  },
  {
    label: "Retro aesthetics",
    detail: "VHS grain, CRT scanlines, pixel art, old-school UI. Nostalgia as a design language.",
  },
  {
    label: "Procedural generation",
    detail: "Noise functions, wave function collapse, L-systems. Making machines dream landscapes.",
  },
  {
    label: "Game jams",
    detail: "Building something broken but complete in 48 hours. The deadline is the feature.",
  },
  {
    label: "Creative coding",
    detail: "Generative art, shader experiments, interactive web experiences. Code as a creative medium.",
  },
];

export type SkillCategory = {
  name: string;
  skills: string[];
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: "Languages",
    skills: ["TypeScript", "JavaScript", "C#", "GDScript", "HTML", "CSS"],
  },
  {
    name: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "GSAP", "SVG"],
  },
  {
    name: "Backend",
    skills: ["Node.js", "REST APIs", "PostgreSQL", "SQLite"],
  },
  {
    name: "Game Dev",
    skills: ["Godot", "Pixel Art", "Procedural Generation", "Tilemaps"],
  },
  {
    name: "Tools",
    skills: ["Git", "Linux", "VS Code", "Figma", "Aseprite"],
  },
];

export type TimelineEntryType = "education" | "work" | "milestone";

export type TimelineEntry = {
  id: string;
  type: TimelineEntryType;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  tags?: string[];
};

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: "uni",
    type: "education",
    date: "2016 – 2019",
    title: "Computer Science",
    subtitle: "University",
    description:
      "Studied algorithms, systems programming, and computer graphics. Built first game prototypes as side projects between lectures.",
  },
  {
    id: "first-jam",
    type: "milestone",
    date: "2018",
    title: "First Game Jam",
    description:
      "Submitted a barely functional dungeon crawler in 48 hours. It crashed on load for most people, but it shipped.",
  },
  {
    id: "web-dev",
    type: "work",
    date: "2019 – 2021",
    title: "Web Developer",
    subtitle: "Freelance",
    description:
      "Built websites and web apps for small clients. Learned React, fell in love with CSS animations, started tinkering with creative coding.",
    tags: ["React", "TypeScript", "CSS"],
  },
  {
    id: "godot",
    type: "milestone",
    date: "2021",
    title: "Discovered Godot",
    description:
      "Switched from Unity to Godot for hobby projects. The open-source workflow and lightweight engine felt right for small-scale experiments.",
  },
  {
    id: "fullstack",
    type: "work",
    date: "2021 – present",
    title: "Full-Stack Developer",
    description:
      "Building web applications by day, experimenting with game dev and creative web projects by night. Currently deep into Next.js, GSAP, and procedural generation.",
    tags: ["Next.js", "Node.js", "GSAP", "Godot"],
  },
  {
    id: "hollow-room",
    type: "milestone",
    date: "2025",
    title: "hollow-room launched",
    description:
      "This site — a static portfolio with a horror/VHS aesthetic, embedded browser games, and way too many CSS animations.",
  },
];
