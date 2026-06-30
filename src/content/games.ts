// Game cards (home "games" section) and the per-game page headers shown at
// /game/[slug]. The registry in features/games pairs each slug with its game.

export const GAMES = [
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
];

// Header copy per game page (keyed by slug).
export const GAME_PAGE_CONTENT = {
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
} as const;
