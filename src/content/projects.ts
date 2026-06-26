// Project cards (home "projects" section), the per-project page headers shown
// at /project/[slug], and the tab copy for the evolutionary project.

export const PROJECTS = [
  {
    name: "evolutionary optimization",
    description:
      "Interactive visualizations of metaheuristic search from my CS coursework — genetic algorithms, differential evolution, particle swarm and simulated annealing hunting for the minimum of a test landscape.",
    tags: ["TypeScript", "Canvas", "Algorithms"],
    slug: "evolutionary",
  },
  {
    name: "this site",
    description:
      "Personal portfolio and blog built as a Next.js static export. Retro pixel aesthetic, dark theme, embedded browser games.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
];

// Header copy per project page (keyed by slug). The registry pairs these with
// the component that renders the project.
export const PROJECT_PAGE_CONTENT = {
  evolutionary: {
    title: "Evolutionary Optimization",
    blurb:
      "Five metaheuristics, one minimum to find. Pick an algorithm and watch it search a test landscape live in the browser.",
  },
} as const;

// Tab copy for the Evolutionary Optimization project. The component registry in
// the feature pairs each id with its visualization.
export const EVOLUTIONARY_ALGORITHM_CONTENT = [
  {
    id: "ga",
    label: "Genetic Algorithm",
    tagline: "Selection, crossover and mutation evolve a population toward the optimum.",
  },
  {
    id: "de",
    label: "Differential Evolution",
    tagline: "Mutate by vector differences between individuals (rand/1, best/1).",
  },
  {
    id: "pso",
    label: "Particle Swarm",
    tagline: "Particles drift toward personal and global bests across the landscape.",
  },
  {
    id: "sa",
    label: "Simulated Annealing",
    tagline: "Accept worse moves early, cool down, and settle into the minimum.",
  },
] as const;
