// All copy for the standalone About page (src/app/about/page.tsx) and its
// components (Timeline, HorizontalTimeline, SkillGrid), in both languages.

export type Interest = {
  label: string;
  detail: string;
};

export type SkillCategory = {
  name: string;
  skills: string[];
};

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

type AboutContent = {
  hero: { title: string; tagline: string };
  headings: { bio: string; skills: string; interests: string };
  bio: string[];
  interests: Interest[];
  skills: SkillCategory[];
  timeline: TimelineEntry[];
};

const en: AboutContent = {
  hero: {
    title: "about me",
    tagline: "Software engineering student. Game dev by night, web tinkerer always.",
  },
  headings: { bio: "who am I", skills: "tech stack", interests: "interests" },
  bio: [
    "I'm a software-engineering student at Tomas Bata University and a developer who's happiest somewhere between a code editor and a game engine. I like learning new things, shipping personal projects, and finding any excuse to turn an idea into something you can actually click on.",
    "These days I'm building an interactive educational game for teaching Czech in the Godot engine — game logic in GDScript, the UI, optimization, the mobile build, all of it. Off the clock I drift toward web experiments, retro aesthetics, and the fast-moving world of large language models — my master's thesis digs into how LLMs can be abused by 'infection' mechanisms and how to defend against them.",
    "When I'm not staring at a terminal I'm probably working out, falling down an AI-research rabbit hole, or unwinding with music, films, and games. This site is one of those side experiments — a static page that pretends it's haunted.",
  ],
  interests: [
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
  ],
  skills: [
    { name: "Languages", skills: ["C#", "C++", "Python", "JavaScript", "TypeScript", "GDScript", "HTML", "CSS"] },
    { name: "Game Dev", skills: ["Godot Engine", "GDScript", "UI Design", "Mobile Builds"] },
    { name: "Web", skills: ["React", "Next.js", "Tailwind CSS", "GSAP"] },
    { name: "Tools", skills: ["Git", "Linux", "Microsoft Office", "Video Editing"] },
  ],
  timeline: [
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
  ],
};

const cz: AboutContent = {
  hero: {
    title: "o mně",
    tagline: "Student softwarového inženýrství. Po nocích herní vývoj, kutilství s webem pořád.",
  },
  headings: { bio: "kdo jsem", skills: "technologie", interests: "zájmy" },
  bio: [
    "Jsem student softwarového inženýrství na Univerzitě Tomáše Bati a vývojář, kterému je nejlíp někde mezi editorem kódu a herním enginem. Rád se učím nové věci, dotahuju osobní projekty a hledám každou záminku, jak proměnit nápad v něco, na co se dá fakt kliknout.",
    "Teď stavím interaktivní výukovou hru pro výuku češtiny v enginu Godot — herní logika v GDScriptu, UI, optimalizace, mobilní build, prostě všechno. Mimo to mě to táhne k webovým experimentům, retro estetice a rychle se měnícímu světu velkých jazykových modelů — moje diplomka zkoumá, jak se dají LLM zneužít „infekčními“ mechanismy a jak se proti nim bránit.",
    "Když zrovna nezírám do terminálu, nejspíš cvičím, propadám se do králičí nory AI výzkumu, nebo vypínám u hudby, filmů a her. Tenhle web je jeden z těch vedlejších experimentů — statická stránka, co předstírá, že je prokletá.",
  ],
  interests: [
    {
      label: "Cvičení & workout",
      detail: "Trénink mi drží energii a čistou hlavu — nejlepší debugging se často děje daleko od klávesnice.",
    },
    {
      label: "AI & nové technologie",
      detail: "Sleduju, kam míří IT, hlavně velké jazykové modely — natolik zblízka, že se z toho stala moje diplomka.",
    },
    {
      label: "Hry, hudba & film",
      detail: "Můj výchozí způsob, jak vypnout. Zároveň tichý výzkum: každá hra je hromada designových rozhodnutí, co stojí za ukradnutí.",
    },
    {
      label: "Retro estetika",
      detail: "VHS zrno, CRT řádky, pixel art, staromódní UI. Nostalgie jako designový jazyk.",
    },
    {
      label: "Kreativní kódění",
      detail: "Generativní umění, experimenty se shadery, interaktivní webové kousky. Kód jako tvůrčí médium.",
    },
  ],
  skills: [
    { name: "Jazyky", skills: ["C#", "C++", "Python", "JavaScript", "TypeScript", "GDScript", "HTML", "CSS"] },
    { name: "Herní vývoj", skills: ["Godot Engine", "GDScript", "UI Design", "Mobile Builds"] },
    { name: "Web", skills: ["React", "Next.js", "Tailwind CSS", "GSAP"] },
    { name: "Nástroje", skills: ["Git", "Linux", "Microsoft Office", "Střih videa"] },
  ],
  timeline: [
    {
      id: "gymnasium",
      type: "education",
      date: "2011 – 2019",
      title: "Gymnázium",
      subtitle: "Gymnázium Jana Pivečky, Slavičín",
      description:
        "Osmileté gymnázium. Tady to s programováním začalo svrbět.",
    },
    {
      id: "bachelor",
      type: "education",
      date: "2020 – 2023",
      title: "Bc., Softwarové inženýrství",
      subtitle: "Univerzita Tomáše Bati — Fakulta aplikované informatiky",
      description:
        "Bakalářský titul ze softwarového inženýrství — algoritmy, systémy a stálý proud vedlejších projektů mezi přednáškami.",
      tags: ["C#", "C++", "Python"],
    },
    {
      id: "master",
      type: "education",
      date: "2023 – 2026",
      title: "Ing., Informační technologie — Softwarové inženýrství",
      subtitle: "Univerzita Tomáše Bati — Fakulta aplikované informatiky",
      description:
        "Inženýrské studium softwarového inženýrství. Diplomka: výzkum chování a obranných opatření proti infekčním mechanismům zneužívajícím velké jazykové modely.",
      tags: ["LLM", "Bezpečnost", "Výzkum"],
    },
    {
      id: "hore-hrou",
      type: "work",
      date: "úno 2025 – současnost",
      title: "Programátor (na IČO)",
      subtitle: "Hore Hrou s.r.o., Valašské Klobouky",
      description:
        "Stavba interaktivní výukové hry pro výuku češtiny v enginu Godot — herní logika v GDScriptu, UI, technická optimalizace a mobilní build. Naživo na cestynak.cz.",
      tags: ["Godot", "GDScript", "Herní vývoj", "Mobil"],
    },
  ],
};

export const ABOUT = { en, cz } as const;
