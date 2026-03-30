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
