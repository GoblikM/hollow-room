// All copy for the home single-page app (src/app/page.tsx), in both languages.
// Section card lists for games/projects live in ./games and ./projects.

const en = {
  hero: {
    title: "hollow-room",
    subtitle: "blog & portfolio — coming soon here",
  },
  sectionHeadings: {
    about: "about",
    games: "games",
    projects: "projects",
    blog: "blog",
    contact: "contact",
  },
  sectionIntro: {
    about:
      "A hollow room is just an empty vessel. Here's what fills mine—circuits, curiosity, and the occasional existential crisis.",
    games:
      "Small entities that haunt the edges of play. Prototypes born from late-night debugging sessions and restless experiments.",
    projects: "Shelves of unfinished things. Tools that solve problems I didn't know I had. Ideas preserved in code.",
    blog: "Whispers from the development void. Notes scratched while staring at screens. Lessons learned the hard way.",
    contact:
      "Send a signal into the void. If it reaches me, I'll respond. Collabs, game jams, weird experiments—all welcome here.",
  },
  aboutTeaser:
    "Developer, tinkerer, pixel hoarder. I build things that blink, scroll, and sometimes even work.",
  aboutCta: "explore full story ->",
  flowButtons: {
    home: "click to play ->",
    about: "descend deeper ->",
    games: "step through static ->",
    projects: "keep drifting ->",
    blog: "open final gate ->",
    contact: "break the seal ->",
    skip: "skip intro",
  },
  contact: {
    email: "goblikm@gmail.com",
    kicker: "reach out",
    copy: "Open for collabs, game jams, and weird web experiments. If you have an idea, send a message and I'll get back to you.",
    emailLabel: "email",
    socialsLabel: "social links",
    socials: [
      { label: "GitHub", href: "https://github.com/GoblikM" },
      { label: "X / Twitter", href: "https://x.com/" },
      { label: "Instagram", href: "https://instagram.com/" },
    ],
  },
  blogPosts: [
    {
      title: "why I picked Godot over Unity",
      date: "2025-03-01",
      excerpt:
        "After a few weeks of dabbling with Unity, I switched to Godot and never looked back. The node tree model clicked instantly, GDScript feels light, and the engine ships as a single 80 MB binary. Here is what I learned in the process.",
    },
    {
      title: "building a static site with Next.js App Router",
      date: "2025-02-14",
      excerpt:
        "Static exports in Next.js 15 are surprisingly painless once you understand the constraints. No server-side props, no API routes — but you get full React and a great DX. This post walks through the setup I used for this very site.",
    },
    {
      title: "pixel fonts and the art of retro UI",
      date: "2025-01-28",
      excerpt:
        "Press Start 2P is iconic, but it is nearly unreadable at body text sizes. I spent an afternoon testing a dozen pixel and mono fonts before settling on Silkscreen for headings and Share Tech Mono for everything else.",
    },
  ],
};

const cz: typeof en = {
  hero: {
    title: "hollow-room",
    subtitle: "blog & portfolio — již brzy zde",
  },
  sectionHeadings: {
    about: "o mně",
    games: "hry",
    projects: "projekty",
    blog: "blog",
    contact: "kontakt",
  },
  sectionIntro: {
    about:
      "Prázdná místnost je jen nádoba. Tohle plní tu moji — obvody, zvědavost a občasná existenciální krize.",
    games:
      "Malé entity, co straší na okrajích hraní. Prototypy zrozené z nočního debugování a neklidných experimentů.",
    projects: "Police plné nedodělků. Nástroje, co řeší problémy, o kterých jsem nevěděl. Nápady zakonzervované v kódu.",
    blog: "Šepoty z vývojářské prázdnoty. Poznámky naškrábané při zírání do obrazovek. Lekce získané tou těžší cestou.",
    contact:
      "Vyšli signál do prázdnoty. Když mě dostihne, odpovím. Spolupráce, game jamy, divné experimenty — všechno je tu vítané.",
  },
  aboutTeaser:
    "Vývojář, kutil, hromadič pixelů. Tvořím věci, co blikají, scrollují a občas i fungují.",
  aboutCta: "prozkoumat celý příběh ->",
  flowButtons: {
    home: "klikni pro hru ->",
    about: "sestup hlouběji ->",
    games: "projdi statikou ->",
    projects: "pluj dál ->",
    blog: "otevři poslední bránu ->",
    contact: "rozlom pečeť ->",
    skip: "přeskočit intro",
  },
  contact: {
    email: "goblikm@gmail.com",
    kicker: "ozvi se",
    copy: "Otevřený spolupracím, game jamům a divným webovým experimentům. Máš nápad? Napiš a já se ti ozvu.",
    emailLabel: "e-mail",
    socialsLabel: "sociální sítě",
    socials: [
      { label: "GitHub", href: "https://github.com/GoblikM" },
      { label: "X / Twitter", href: "https://x.com/" },
      { label: "Instagram", href: "https://instagram.com/" },
    ],
  },
  blogPosts: [
    {
      title: "proč jsem zvolil Godot místo Unity",
      date: "2025-03-01",
      excerpt:
        "Po pár týdnech hraní si s Unity jsem přešel na Godot a už se neohlédl. Model stromu uzlů mi okamžitě sedl, GDScript je odlehčený a engine se veze jako jediná 80MB binárka. Tady je, co jsem se přitom naučil.",
    },
    {
      title: "stavba statického webu s Next.js App Routerem",
      date: "2025-02-14",
      excerpt:
        "Statické exporty v Next.js 15 jsou překvapivě bezbolestné, jakmile pochopíš jejich omezení. Žádné server-side props, žádné API routy — ale máš plný React a skvělé DX. Tenhle příspěvek provází nastavením, které jsem použil přesně pro tenhle web.",
    },
    {
      title: "pixelové fonty a umění retro UI",
      date: "2025-01-28",
      excerpt:
        "Press Start 2P je ikonický, ale v textových velikostech skoro nečitelný. Strávil jsem odpoledne testováním tuctu pixelových a mono fontů, než jsem se ustálil na Silkscreen pro nadpisy a Share Tech Mono pro vše ostatní.",
    },
  ],
};

export const HOME = { en, cz } as const;
