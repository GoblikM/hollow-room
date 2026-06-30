// Project cards (home "projects" section), the per-project page headers shown
// at /project/[slug], and the tab copy for the evolutionary project — both
// languages. `slug`, `tags` and algorithm `id`s are structural, not translated.

type ProjectCard = { name: string; description: string; tags: string[]; slug?: string };

type ProjectContent = {
  cards: ProjectCard[];
  pages: Record<string, { title: string; blurb: string }>;
  algorithms: { id: string; label: string; tagline: string }[];
};

const en: ProjectContent = {
  cards: [
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
  ],
  pages: {
    evolutionary: {
      title: "Evolutionary Optimization",
      blurb:
        "Five metaheuristics, one minimum to find. Pick an algorithm and watch it search a test landscape live in the browser.",
    },
  },
  algorithms: [
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
  ],
};

const cz: ProjectContent = {
  cards: [
    {
      name: "evoluční optimalizace",
      description:
        "Interaktivní vizualizace metaheuristického hledání z mých studijních prací — genetické algoritmy, diferenciální evoluce, hejno částic a simulované žíhání loví minimum testovací krajiny.",
      tags: ["TypeScript", "Canvas", "Algorithms"],
      slug: "evolutionary",
    },
    {
      name: "tento web",
      description:
        "Osobní portfolio a blog postavené jako statický export Next.js. Retro pixelová estetika, tmavé téma, vestavěné hry v prohlížeči.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
  ],
  pages: {
    evolutionary: {
      title: "Evoluční optimalizace",
      blurb:
        "Pět metaheuristik, jedno minimum k nalezení. Vyber algoritmus a sleduj, jak živě v prohlížeči prohledává testovací krajinu.",
    },
  },
  algorithms: [
    {
      id: "ga",
      label: "Genetický algoritmus",
      tagline: "Selekce, křížení a mutace vyvíjejí populaci směrem k optimu.",
    },
    {
      id: "de",
      label: "Diferenciální evoluce",
      tagline: "Mutace pomocí vektorových rozdílů mezi jedinci (rand/1, best/1).",
    },
    {
      id: "pso",
      label: "Hejno částic (PSO)",
      tagline: "Částice se sunou k osobním i globálním nejlepším řešením napříč krajinou.",
    },
    {
      id: "sa",
      label: "Simulované žíhání",
      tagline: "Zpočátku přijímej i horší tahy, postupně chladni a usaď se v minimu.",
    },
  ],
};

export const PROJECTS = { en, cz } as const;
