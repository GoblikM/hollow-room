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
