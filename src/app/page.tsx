"use client";

import Nav from "@/components/Nav";
import ScrollRail from "@/components/ScrollRail";
import ThemePicker from "@/components/ThemePicker";
import BlogPostCard from "@/components/BlogPostCard";
import GameCard from "@/components/GameCard";
import ProjectCard from "@/components/ProjectCard";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import Image from "next/image";
import avatar from "@/assets/avatar.png";

const PLACEHOLDER_PROJECTS = [
  {
    name: "this site",
    description:
      "Personal portfolio and blog built as a Next.js static export. Retro pixel aesthetic, dark theme, embedded browser games.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "dungeon crawler",
    description:
      "A top-down dungeon crawler prototype made in Godot. Procedural level generation, simple combat, pixel art sprites.",
    tags: ["Godot", "GDScript", "Pixel Art"],
  },
  {
    name: "type racer",
    description:
      "In-browser speed-typing game with a leaderboard. Measures WPM and accuracy in real time against random quotes.",
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
      "Static exports in Next.js 15 are surprisingly painless once you understand the constraints. No server-side props, no API routes — but you get full React and a great DX. This post walks through the setup I used for this very srqaite.",
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
    description:
      "Test your typing speed against random quotes. Hit Enter to start a new round and track your WPM over time.",
  },
  {
    name: "snake 8-bit",
    description:
      "Classic snake in a 20×20 grid. Arrow keys to move, eat the dots, don&apos;t bite yourself. How long can you last?",
  },
  {
    name: "memory tiles",
    description:
      "Flip pairs of tiles to find matches. Six pairs, each game randomised. Finish in as few moves as possible.",
  },
];

const SECTION_IDS = ["home", "about", "games", "projects", "blog"];

export default function Home() {
  const activeSection = useActiveSection(SECTION_IDS);
  useRevealOnScroll();

  return (
    <>
      <Nav activeSection={activeSection} />
      <ScrollRail />

      <main className="page-content">
        {/* Home section */}
        <section
          id="home"
          className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-visible"
        >
          {/* Hero content */}
          <div className="relative z-10 text-center">
            <div className="hero-title-shell">
              <h1
                className="hero-title text-7xl mb-6 text-glitch text-glitch-soft"
                style={{
                  color: "var(--color-accent-bright)",
                  fontFamily: "var(--font-pixel)",
                  letterSpacing: "0.04em",
                }}
              >
                hollow-room
              </h1>
            </div>
            <p
              className="hero-subtitle font-mono text-lg tracking-widest uppercase"
              style={{ color: "var(--color-text-muted)" }}
            >
              blog &amp; portfolio &mdash; coming soon here
            </p>
          </div>
        </section>

        {/* About section */}
        <section id="about" className="section">
          <div
            className="section-reveal"
            style={{ maxWidth: "800px", width: "100%" }}
          >
            <h2
              className="font-pixel text-5xl mb-10"
              style={{ color: "var(--color-accent-bright)" }}
            >
              about
            </h2>
            <div className="about-layout">
              <div className="about-avatar-frame vhs-border">
                <Image
                  src={avatar}
                  alt="Portrait avatar"
                  className="about-avatar-image"
                  priority
                />
              </div>
              <p
                className="font-mono text-lg leading-relaxed"
                style={{ color: "var(--color-text)" }}
              >
                I&apos;m a hobbyist game developer and web tinkerer. I built this
                site to share my projects, write about what I&apos;m learning, and
                experiment with retro aesthetics. If you like pixel art,
                procedural generation, or just want to say hi, feel free to reach
                out!
              </p>
            </div>
          </div>
        </section>

        {/* Games section */}
        <section id="games" className="section">
          <div
            className="section-reveal"
            style={{ maxWidth: "800px", width: "100%" }}
          >
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

        {/* Projects section */}
        <section id="projects" className="section">
          <div
            className="section-reveal"
            style={{ maxWidth: "800px", width: "100%" }}
          >
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

        {/* Blog section */}
        <section id="blog" className="section section-last">
          <div
            className="section-reveal"
            style={{ maxWidth: "800px", width: "100%" }}
          >
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

        <footer
          className="footer-section p-4 text-center font-pixel"
          style={{ color: "var(--color-accent-bright)", fontSize: "0.75rem" }}
        >
          &copy; 2026 hollow-room. All rights reserved.
        </footer>
      </main>

      <ThemePicker />
    </>
  );
}
