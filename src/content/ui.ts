// Chrome / UI copy that used to be hardcoded in components (nav, footer,
// settings, timeline, embedded game/solver text), in both languages.

type Method = {
  rank: string;
  name: string;
  tagline: string;
  body: string;
  avgScore: string;
  peakTile: number;
  reach: number;
  reachLabel: string;
};

type UiContent = {
  nav: {
    sections: Record<"home" | "about" | "games" | "projects" | "blog" | "contact", string>;
    back: string;
    logoAria: string;
    openMenu: string;
    closeMenu: string;
    pageNav: string;
    railAria: string;
  };
  footer: { rights: string };
  settings: {
    colorSchemes: string;
    language: string;
    desktopNavbar: string;
    music: string;
    devReset: string;
    openSettings: string;
    pickScheme: string;
    toggleDesktopNav: string;
    toggleMusic: string;
    settingsHint: string;
  };
  misc: { algorithms: string; comingSoon: string };
  timeline: {
    heading: string;
    hint: string;
    types: Record<"education" | "work" | "milestone", string>;
    technologies: string;
    prev: string;
    next: string;
    entries: string;
    entry: string;
    careerTimeline: string;
  };
  nightmareSwarm: {
    controlsTitle: string;
    controls: { action: string; keys: string[] }[];
    originTab: string;
    originText: string;
    fullscreenEnter: string;
    fullscreenExit: string;
  };
  solver: {
    eyebrow: string;
    title: string;
    sub: string;
    methods: Method[];
    avgScore: string;
    reach2048: string;
    typicalPeak: string;
    originTab: string;
    originText: string;
  };
  game2048: {
    stats: { score: string; best: string; moves: string; max: string };
    playHint: string;
    controls: string;
    autoSolve: string;
    stop: string;
    newGame: string;
    solverLabel: string;
    solvers: Record<"random" | "greedy" | "montecarlo", { label: string; blurb: string }>;
    speedLabel: string;
    rollouts: string;
    rolloutsHint: string;
    manual: string;
    board: { aria: string; gameOver: string; youWin: string; keepGoing: string; tryAgain: string; newGame: string };
  };
};

const en: UiContent = {
  nav: {
    sections: { home: "Home", about: "About", games: "Games", projects: "Projects", blog: "Blog", contact: "Contact" },
    back: "<- home",
    logoAria: "hollow-room home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    pageNav: "Page navigation",
    railAria: "Section navigation rail",
  },
  footer: { rights: "All rights reserved." },
  settings: {
    colorSchemes: "Color schemes",
    language: "Language",
    desktopNavbar: "Desktop navbar",
    music: "Music",
    devReset: "DEV: clear localStorage",
    openSettings: "open settings >",
    pickScheme: "Pick color scheme",
    toggleDesktopNav: "Toggle desktop navbar",
    toggleMusic: "Toggle music",
    settingsHint: "Settings panel hint",
  },
  misc: { algorithms: "Algorithms", comingSoon: "Coming soon!!" },
  timeline: {
    heading: "timeline",
    hint: "scroll to advance →",
    types: { education: "education", work: "work", milestone: "milestone" },
    technologies: "Technologies",
    prev: "Previous timeline entry",
    next: "Next timeline entry",
    entries: "Timeline entries",
    entry: "Entry",
    careerTimeline: "Career timeline",
  },
  nightmareSwarm: {
    controlsTitle: "Controls",
    controls: [
      { action: "Move", keys: ["W", "A", "S", "D"] },
      { action: "Attack", keys: ["Auto"] },
      { action: "Pause", keys: ["Esc"] },
    ],
    originTab: "Origin",
    originText:
      "Built as coursework for my Computer Game Development module at university. It's an early, rough prototype rather than a finished game — made in Unity to learn the engine and the basics of game feel.",
    fullscreenEnter: "Enter fullscreen",
    fullscreenExit: "Exit fullscreen",
  },
  solver: {
    eyebrow: "The field",
    title: "How the solvers think",
    sub: "Three ways to play the same game — from blind luck to statistical brute force. Pick one in the panel above and watch the gap widen.",
    methods: [
      {
        rank: "01",
        name: "Random",
        tagline: "Blind luck",
        body: "Every turn it picks one of the currently legal moves at random — no look-ahead, no strategy. It earns its place as the yardstick: whatever a real method does, it should comfortably beat this. Tiles scatter, the board clogs, and it never gets close to 2048.",
        avgScore: "1 100",
        peakTile: 128,
        reach: 1,
        reachLabel: "Never reaches 2048",
      },
      {
        rank: "02",
        name: "Greedy corner",
        tagline: "A fixed habit",
        body: "A tiny rule-based player that always tries the same move order — leaning on left and up, dropping to down and right only when forced. That bias pins the biggest tiles into one corner, the oldest trick in the book. No searching, yet it roughly triples the random score.",
        avgScore: "2 850",
        peakTile: 256,
        reach: 2,
        reachLabel: "Reaches 2048 rarely",
      },
      {
        rank: "03",
        name: "Monte Carlo",
        tagline: "Plays the odds",
        body: "For each candidate move it plays out dozens of fast, fully random games and averages the final scores. The move with the brightest random futures wins. It never \"understands\" the board — it just lets statistics speak — but it's strong enough to reach 2048 outright. Use the rollouts slider to trade speed for strength.",
        avgScore: "18 000",
        peakTile: 2048,
        reach: 3,
        reachLabel: "Reaches 2048 often",
      },
    ],
    avgScore: "Avg score",
    reach2048: "2048 rate",
    typicalPeak: "Typical peak",
    originTab: "Origin",
    originText:
      "Built as coursework for my Soft Computing & Data Mining module at university. The game logic and all three solvers began life as a Python notebook — since ported to TypeScript so the whole thing runs live, right here in your browser.",
  },
  game2048: {
    stats: { score: "Score", best: "Best", moves: "Moves", max: "Max" },
    playHint: "Use arrow keys or WASD to play. Auto-solving disables manual input.",
    controls: "Controls",
    autoSolve: "▶ Auto-solve",
    stop: "■ Stop",
    newGame: "↻ New",
    solverLabel: "Solver",
    solvers: {
      random: { label: "Random", blurb: "Picks any legal move at random." },
      greedy: { label: "Greedy corner", blurb: "Fixed priority — packs tiles into a corner." },
      montecarlo: { label: "Monte Carlo", blurb: "Plays out random games per move. Strong, slower." },
    },
    speedLabel: "Speed",
    rollouts: "Rollouts / move",
    rolloutsHint: "More rollouts play smarter but think slower. Monte Carlo only.",
    manual: "Manual",
    board: {
      aria: "2048 board",
      gameOver: "GAME OVER",
      youWin: "YOU WIN",
      keepGoing: "Keep going",
      tryAgain: "Try again",
      newGame: "New game",
    },
  },
};

const cz: UiContent = {
  nav: {
    sections: { home: "Domů", about: "O mně", games: "Hry", projects: "Projekty", blog: "Blog", contact: "Kontakt" },
    back: "<- domů",
    logoAria: "hollow-room domů",
    openMenu: "Otevřít menu",
    closeMenu: "Zavřít menu",
    pageNav: "Navigace stránky",
    railAria: "Lišta navigace sekcí",
  },
  footer: { rights: "Všechna práva vyhrazena." },
  settings: {
    colorSchemes: "Barevná schémata",
    language: "Jazyk",
    desktopNavbar: "Desktopová lišta",
    music: "Hudba",
    devReset: "DEV: vymazat localStorage",
    openSettings: "otevřít nastavení >",
    pickScheme: "Vybrat barevné schéma",
    toggleDesktopNav: "Přepnout desktopovou lištu",
    toggleMusic: "Přepnout hudbu",
    settingsHint: "Nápověda k panelu nastavení",
  },
  misc: { algorithms: "Algoritmy", comingSoon: "Už brzy!!" },
  timeline: {
    heading: "timeline",
    hint: "scrolluj pro další →",
    types: { education: "vzdělání", work: "práce", milestone: "milník" },
    technologies: "Technologie",
    prev: "Předchozí záznam",
    next: "Další záznam",
    entries: "Záznamy timeline",
    entry: "Záznam",
    careerTimeline: "Kariérní timeline",
  },
  nightmareSwarm: {
    controlsTitle: "Ovládání",
    controls: [
      { action: "Pohyb", keys: ["W", "A", "S", "D"] },
      { action: "Útok", keys: ["Auto"] },
      { action: "Pauza", keys: ["Esc"] },
    ],
    originTab: "Původ",
    originText:
      "Vzniklo jako práce do předmětu Vývoj počítačových her na vysoké škole. Je to spíš raný, hrubý prototyp než hotová hra — vyrobeno v Unity, abych se naučil engine a základy „game feel“.",
    fullscreenEnter: "Celá obrazovka",
    fullscreenExit: "Zavřít celou obrazovku",
  },
  solver: {
    eyebrow: "Hřiště",
    title: "Jak řešiče přemýšlejí",
    sub: "Tři způsoby, jak hrát tutéž hru — od slepého štěstí po statistickou hrubou sílu. Vyber jeden v panelu výše a sleduj, jak se mezera zvětšuje.",
    methods: [
      {
        rank: "01",
        name: "Náhodný",
        tagline: "Slepé štěstí",
        body: "Každé kolo náhodně vybere jeden z aktuálně legálních tahů — žádný výhled, žádná strategie. Zaslouží si místo coby měřítko: cokoli, co dělá skutečná metoda, by tohle mělo pohodlně překonat. Dlaždice se rozsypou, deska se ucpe a 2048 se ani nepřiblíží.",
        avgScore: "1 100",
        peakTile: 128,
        reach: 1,
        reachLabel: "2048 nikdy nedosáhne",
      },
      {
        rank: "02",
        name: "Hladový roh",
        tagline: "Pevný návyk",
        body: "Drobný hráč na bázi pravidel, co pořád zkouší stejné pořadí tahů — spoléhá na vlevo a nahoru, na dolů a vpravo sáhne jen když musí. Tahle zaujatost přišpendlí největší dlaždice do jednoho rohu, nejstarší trik v knize. Žádné prohledávání, a přesto zhruba ztrojnásobí náhodné skóre.",
        avgScore: "2 850",
        peakTile: 256,
        reach: 2,
        reachLabel: "2048 dosáhne zřídka",
      },
      {
        rank: "03",
        name: "Monte Carlo",
        tagline: "Hraje na pravděpodobnost",
        body: "Pro každý kandidátský tah odehraje desítky rychlých, plně náhodných her a zprůměruje výsledná skóre. Vyhraje tah s nejsvětlejší náhodnou budoucností. Desce nikdy „nerozumí“ — jen nechá mluvit statistiku — ale je dost silný, aby 2048 reálně dosáhl. Posuvníkem rollouts měníš rychlost za sílu.",
        avgScore: "18 000",
        peakTile: 2048,
        reach: 3,
        reachLabel: "2048 dosáhne často",
      },
    ],
    avgScore: "Prům. skóre",
    reach2048: "úspěšnost 2048",
    typicalPeak: "Typické maximum",
    originTab: "Původ",
    originText:
      "Vzniklo jako práce do předmětu Soft Computing & Data Mining na vysoké škole. Herní logika i všechny tři řešiče původně začaly jako Python notebook — od té doby přepsané do TypeScriptu, aby celé běželo živě přímo v tvém prohlížeči.",
  },
  game2048: {
    stats: { score: "Skóre", best: "Nejlepší", moves: "Tahy", max: "Max" },
    playHint: "Hraj šipkami nebo WASD. Auto-řešení vypne manuální ovládání.",
    controls: "Ovládání",
    autoSolve: "▶ Auto-řešení",
    stop: "■ Stop",
    newGame: "↻ Nová",
    solverLabel: "Řešič",
    solvers: {
      random: { label: "Náhodný", blurb: "Vybírá libovolný legální tah náhodně." },
      greedy: { label: "Hladový roh", blurb: "Pevná priorita — cpe dlaždice do rohu." },
      montecarlo: { label: "Monte Carlo", blurb: "Pro každý tah odehraje náhodné hry. Silné, pomalejší." },
    },
    speedLabel: "Rychlost",
    rollouts: "Rolloutů / tah",
    rolloutsHint: "Víc rolloutů hraje chytřeji, ale přemýšlí pomaleji. Jen Monte Carlo.",
    manual: "Manuál",
    board: {
      aria: "Hrací deska 2048",
      gameOver: "KONEC HRY",
      youWin: "VÝHRA",
      keepGoing: "Pokračovat",
      tryAgain: "Zkusit znovu",
      newGame: "Nová hra",
    },
  },
};

export const UI = { en, cz } as const;
