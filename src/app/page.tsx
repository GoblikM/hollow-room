"use client";

import BlogPostCard from "@/features/home/components/BlogPostCard";
import { HOME_BLOG_SECTION_POSTS } from "@/features/home/data/blogSectionContent";
import { HOME_CONTACT_SECTION } from "@/features/home/data/contactSectionContent";
import GameCard from "@/features/home/components/GameCard";
import { HOME_GAMES_SECTION_ITEMS } from "@/features/home/data/gamesSectionContent";
import ProjectCard from "@/features/home/components/ProjectCard";
import { HOME_PROJECTS_SECTION_ITEMS } from "@/features/home/data/projectsSectionContent";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useTypeHeadingsOnScroll } from "@/hooks/useTypeHeadingsOnScroll";
import Image from "next/image";
import avatar from "@/assets/avatar.png";

const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";

export default function Home() {
  useRevealOnScroll();
  useTypeHeadingsOnScroll(".section .section-reveal h2", 18);
  useTypeHeadingsOnScroll("#about .about-layout p", 100);

  return (
    <>
      <main className="page-content">
        {/* Home section */}
        <section
          id="home"
          className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-visible"
        >
          {/* Hero content */}
          <div className="relative z-10 text-center">
            <div className="hero-title-shell">
              <h1 className="hero-title text-7xl mb-6 text-glitch text-glitch-soft font-pixel text-accent-bright tracking-[0.04em]">
                hollow-room
              </h1>
            </div>
            <p className="hero-subtitle font-mono text-lg tracking-widest uppercase text-muted">
              blog &amp; portfolio &mdash; coming soon here
            </p>
          </div>
        </section>

        {/* About section */}
        <section id="about" className="section">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">
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
              <p className="font-mono text-lg leading-relaxed">
                I&apos;m a hobbyist game developer and web tinkerer. I built
                this site to share my projects, write about what I&apos;m
                learning, and experiment with retro aesthetics. If you like
                pixel art, procedural generation, or just want to say hi, feel
                free to reach out!
              </p>
            </div>
          </div>
        </section>

        {/* Games section */}
        <section id="games" className="section">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">
              games
            </h2>
            <div className="card-grid">
              {HOME_GAMES_SECTION_ITEMS.map((game) => (
                <GameCard key={game.name} {...game} />
              ))}
            </div>
          </div>
        </section>

        {/* Projects section */}
        <section id="projects" className="section">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">
              projects
            </h2>
            <div className="card-grid">
              {HOME_PROJECTS_SECTION_ITEMS.map((project) => (
                <ProjectCard key={project.name} {...project} />
              ))}
            </div>
          </div>
        </section>

        {/* Blog section */}
        <section id="blog" className="section">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">
              blog
            </h2>
            <div>
              {HOME_BLOG_SECTION_POSTS.map((post) => (
                <BlogPostCard key={post.title} {...post} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section id="contact" className="section section-last">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">
              contact
            </h2>

            <div className="contact-shell vhs-border">
              <div className="contact-shell-left">
                <p className="contact-kicker">reach out</p>
                <p className="contact-copy">
                  Open for collabs, game jams, and weird web experiments. If you
                  have an idea, send a message and I&apos;ll get back to you.
                </p>

                <a
                  className="contact-email-link"
                  href={`mailto:${HOME_CONTACT_SECTION.email}`}
                >
                  <span className="contact-email-label">email</span>
                  <span className="contact-email-value">
                    {HOME_CONTACT_SECTION.email}
                  </span>
                </a>
              </div>

              <div className="contact-shell-right">
                <p className="contact-links-title">social links</p>
                <ul className="contact-links-list">
                  {HOME_CONTACT_SECTION.socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="contact-link-chip"
                      >
                        <span className="contact-link-arrow" aria-hidden="true">
                          &gt;
                        </span>
                        <span>{social.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer-section p-4 text-center font-pixel text-accent-bright text-xs">
          &copy; 2026 hollow-room. All rights reserved.{" "}
          <span className="text-muted text-[0.65rem] tracking-[0.08em]">
            v{appVersion}
          </span>
        </footer>
      </main>
    </>
  );
}
