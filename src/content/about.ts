// All copy for the standalone About page (src/app/about/page.tsx) and its
// components (Timeline, HorizontalTimeline, SkillGrid).

export const ABOUT_HERO = {
  title: "about me",
  tagline: "Software engineering student. Game dev by night, web tinkerer always.",
} as const;

export const ABOUT_HEADINGS = {
  bio: "who am I",
  skills: "tech stack",
  interests: "interests",
} as const;

export const ABOUT_BIO = [
  "I'm a software-engineering student at Tomas Bata University and a developer who's happiest somewhere between a code editor and a game engine. I like learning new things, shipping personal projects, and finding any excuse to turn an idea into something you can actually click on.",
  "These days I'm building an interactive educational game for teaching Czech in the Godot engine — game logic in GDScript, the UI, optimization, the mobile build, all of it. Off the clock I drift toward web experiments, retro aesthetics, and the fast-moving world of large language models — my master's thesis digs into how LLMs can be abused by 'infection' mechanisms and how to defend against them.",
  "When I'm not staring at a terminal I'm probably working out, falling down an AI-research rabbit hole, or unwinding with music, films, and games. This site is one of those side experiments — a static page that pretends it's haunted.",
];

export type Interest = {
  label: string;
  detail: string;
};

export const INTERESTS: Interest[] = [
  {
    label: "Fitness & workout",
    detail: "Training keeps the energy up and the head clear — some of the best debugging happens away from the keyboard.",
  },
  {
    label: "AI & emerging tech",
    detail: "Following where IT is heading, large language models most of all — close enough to it that it became my thesis.",
  },
  {
    label: "Games, music & film",
    detail: "My default way to switch off. Also quiet research: every game is a pile of design decisions worth stealing.",
  },
  {
    label: "Retro aesthetics",
    detail: "VHS grain, CRT scanlines, pixel art, old-school UI. Nostalgia as a design language.",
  },
  {
    label: "Creative coding",
    detail: "Generative art, shader experiments, interactive web pieces. Code as a creative medium.",
  },
];

export type SkillCategory = {
  name: string;
  skills: string[];
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: "Languages",
    skills: ["C#", "C++", "Python", "JavaScript", "TypeScript", "GDScript", "HTML", "CSS"],
  },
  {
    name: "Game Dev",
    skills: ["Godot Engine", "GDScript", "UI Design", "Mobile Builds"],
  },
  {
    name: "Web",
    skills: ["React", "Next.js", "Tailwind CSS", "GSAP"],
  },
  {
    name: "Tools",
    skills: ["Git", "Linux", "Microsoft Office", "Video Editing"],
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
    id: "gymnasium",
    type: "education",
    date: "2011 – 2019",
    title: "Grammar School",
    subtitle: "Jan Pivečka Grammar School, Slavičín",
    description:
      "Eight-year gymnázium (academic secondary school). Where the programming itch first started.",
  },
  {
    id: "bachelor",
    type: "education",
    date: "2020 – 2023",
    title: "BSc, Software Engineering",
    subtitle: "Tomas Bata University — Faculty of Applied Informatics",
    description:
      "Bachelor's degree in software engineering — algorithms, systems, and a steady stream of side projects between lectures.",
    tags: ["C#", "C++", "Python"],
  },
  {
    id: "master",
    type: "education",
    date: "2023 – 2026",
    title: "MSc (Ing.), Information Technologies — Software Engineering",
    subtitle: "Tomas Bata University — Faculty of Applied Informatics",
    description:
      "Master's studies in software engineering. Thesis: research into the behavior of, and defenses against, infection mechanisms that exploit large language models.",
    tags: ["LLM", "Security", "Research"],
  },
  {
    id: "hore-hrou",
    type: "work",
    date: "Feb 2025 – present",
    title: "Programmer (Contractor)",
    subtitle: "Hore Hrou s.r.o., Valašské Klobouky",
    description:
      "Building an interactive educational game for teaching Czech in the Godot engine — game logic in GDScript, UI, technical optimization, and the mobile build. Live at cestynak.cz.",
    tags: ["Godot", "GDScript", "Game Dev", "Mobile"],
  },
];
