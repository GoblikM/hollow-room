// Game cards (home "games" section) and the per-game page headers shown at
// /game/[slug], in both languages. `slug` is structural — not translated.

const en = {
  cards: [
    {
      name: "2048 solver",
      description:
        "A 2048 clone with an AI solver. Use arrow keys to play, or watch the AI make moves for you. Can you beat the AI?",
      slug: "2048",
    },
    {
      name: "Nightmare Swarm",
      description:
        "A Unity-based game inspired by the Vampire Survivors genre. Outlast the swarm until dawn breaks — play it right here in the browser.",
      slug: "nightmare_swarm",
    },
  ],
  pages: {
    "2048": {
      title: "2048 Solver",
      blurb:
        "A 2048 clone with a built-in AI. Play it yourself with the arrow keys, or hand it over to one of three solvers and watch it run — at the speed you choose.",
    },
    nightmare_swarm: {
      title: "Nightmare Swarm",
      blurb:
        "A Unity WebGL game inspired by the Vampire Survivors genre. Survive the relentless swarm until dawn breaks — move to stay alive and don't get cornered. Runs straight in your browser; best on desktop.",
    },
  },
};

const cz: typeof en = {
  cards: [
    {
      name: "2048 solver",
      description:
        "Klon hry 2048 s AI řešičem. Hraj šipkami, nebo sleduj, jak za tebe táhne AI. Porazíš AI?",
      slug: "2048",
    },
    {
      name: "Nightmare Swarm",
      description:
        "Hra postavená v Unity, inspirovaná žánrem Vampire Survivors. Přežij roj, než se rozední — zahraj si ji přímo v prohlížeči.",
      slug: "nightmare_swarm",
    },
  ],
  pages: {
    "2048": {
      title: "2048 Solver",
      blurb:
        "Klon hry 2048 s vestavěnou AI. Zahraj si ji sám šipkami, nebo ji předej jednomu ze tří řešičů a sleduj, jak hraje — rychlostí, kterou si zvolíš.",
    },
    nightmare_swarm: {
      title: "Nightmare Swarm",
      blurb:
        "Hra v Unity (WebGL) inspirovaná žánrem Vampire Survivors. Přežij neúnavný roj, než se rozední — pohybuj se, ať zůstaneš naživu, a nenech se zahnat do kouta. Běží přímo v prohlížeči; nejlepší na desktopu.",
    },
  },
};

export const GAMES = { en, cz } as const;
