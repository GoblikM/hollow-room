"use client";

import Nav from "@/components/Nav";
import ThemePicker from "@/components/ThemePicker";
import BlogPostCard from "@/components/BlogPostCard";
import GameCard from "@/components/GameCard";
import ProjectCard from "@/components/ProjectCard";
import { useActiveSection } from "@/hooks/useActiveSection";

const PLACEHOLDER_PROJECTS = [
  {
    name: "this site",
    description: "Personal portfolio and blog built as a Next.js static export. Retro pixel aesthetic, dark theme, embedded browser games.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "dungeon crawler",
    description: "A top-down dungeon crawler prototype made in Godot. Procedural level generation, simple combat, pixel art sprites.",
    tags: ["Godot", "GDScript", "Pixel Art"],
  },
  {
    name: "type racer",
    description: "In-browser speed-typing game with a leaderboard. Measures WPM and accuracy in real time against random quotes.",
    tags: ["React", "TypeScript", "LocalStorage"],
  },
];

const PLACEHOLDER_BLOG_POSTS = [
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
];

const PLACEHOLDER_GAMES = [
  {
    name: "speed typer",
    description: "Test your typing speed against random quotes. Hit Enter to start a new round and track your WPM over time.",
  },
  {
    name: "snake 8-bit",
    description: "Classic snake in a 20×20 grid. Arrow keys to move, eat the dots, don't bite yourself. How long can you last?",
  },
  {
    name: "memory tiles",
    description: "Flip pairs of tiles to find matches. Six pairs, each game randomised. Finish in as few moves as possible.",
  },
];

const SECTION_IDS = ["home", "blog", "projects", "games"];

export default function Home() {
  const activeSection = useActiveSection(SECTION_IDS);

  return (
    <>
      <Nav activeSection={activeSection} />

      {/* Home section */}
      <main
        id="home"
        className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
      >
        {/* Low-poly geometric background */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 800 600"
        >
          {/* Fragmented terrain silhouette — dark violet polygons */}
          <polygon points="0,600 120,380 200,460 320,300 420,420 500,260 600,380 700,280 800,350 800,600" fill="#0d0a1a" opacity="0.9" />
          <polygon points="0,600 80,450 180,520 260,380 360,480 440,340 540,440 620,360 720,420 800,370 800,600" fill="#16102a" opacity="0.7" />
          <polygon points="120,380 200,460 280,350 200,300" fill="#1e1538" opacity="0.6" />
          <polygon points="420,420 500,260 580,340 500,420" fill="#1e1538" opacity="0.5" />
          <polygon points="620,360 700,280 760,320 700,380" fill="#1e1538" opacity="0.5" />
          <polygon points="0,200 100,320 60,420 0,380" fill="#16102a" opacity="0.4" />
          <polygon points="700,0 800,100 780,220 680,160" fill="#16102a" opacity="0.35" />
          <polygon points="300,0 420,80 360,180 260,100" fill="#1e1538" opacity="0.3" />
          {/* Faint violet accent triangles */}
          <polygon points="500,260 560,180 620,260" fill="#2a1f4a" opacity="0.5" />
          <polygon points="200,300 260,220 320,300" fill="#2a1f4a" opacity="0.4" />
          <polygon points="680,160 720,100 760,160" fill="#2a1f4a" opacity="0.35" />
        </svg>

        {/* Gradient fade overlay — dissolves SVG polygons into the page background */}
        <div className="section-fade-bottom" aria-hidden="true" />

        {/* Hero content */}
        <div className="relative z-10 text-center">
          <h1
            className="text-7xl mb-6 glitch-hover"
            style={{ color: "var(--color-accent-bright)", fontFamily: "var(--font-pixel)", letterSpacing: "0.04em" }}
          >
            <span className="glitch-target chroma">goblikm</span>
          </h1>
          <p
            className="font-mono text-lg tracking-widest uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            blog &amp; portfolio &mdash; coming soon here
          </p>
        </div>
      </main>

      {/* Blog section */}
      <section
        id="blog"
        className="section-plain min-h-screen p-8 flex flex-col items-center justify-center"
      >
        <div style={{ maxWidth: "800px", width: "100%" }}>
          <h2
            className="font-pixel text-5xl mb-10"
            style={{ color: "var(--color-accent-bright)" }}
          >
            blog
          </h2>
          <div>
            {PLACEHOLDER_BLOG_POSTS.map((post) => (
              <BlogPostCard key={post.title} {...post} />
            ))}
          </div>
        </div>
      </section>

      {/* Projects section */}
      <section
        id="projects"
        className="section-plain min-h-screen p-8 flex flex-col items-center justify-center"
      >
        <div style={{ maxWidth: "800px", width: "100%" }}>
          <h2
            className="font-pixel text-5xl mb-10"
            style={{ color: "var(--color-accent-bright)" }}
          >
            projects
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {PLACEHOLDER_PROJECTS.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* Games section */}
      <section
        id="games"
        className="section-plain min-h-screen p-8 flex flex-col items-center justify-center"
      >
        <div style={{ maxWidth: "800px", width: "100%" }}>
          <h2
            className="font-pixel text-5xl mb-10"
            style={{ color: "var(--color-accent-bright)" }}
          >
            games
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {PLACEHOLDER_GAMES.map((game) => (
              <GameCard key={game.name} {...game} />
            ))}
          </div>
        </div>
      </section>

      <footer
        className="section-plain p-4 text-center font-pixel"
        style={{ color: "var(--color-accent-bright)", fontSize: "0.75rem" }}
      >
        &copy; 2026 goblikm. All rights reserved.
      </footer>

      <ThemePicker />
    </>
  );
}
