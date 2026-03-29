"use client";

import BlogPostCard from "@/features/home/components/BlogPostCard";
import { HOME_ABOUT_TEXT } from "@/features/home/data/aboutSectionContent";
import { HOME_BLOG_SECTION_POSTS } from "@/features/home/data/blogSectionContent";
import { HOME_CONTACT_SECTION } from "@/features/home/data/contactSectionContent";
import GameCard from "@/features/home/components/GameCard";
import { HOME_GAMES_SECTION_ITEMS } from "@/features/home/data/gamesSectionContent";
import ProjectCard from "@/features/home/components/ProjectCard";
import { HOME_PROJECTS_SECTION_ITEMS } from "@/features/home/data/projectsSectionContent";
import { HOME_SECTION_INTRO } from "@/features/home/data/sectionIntroContent";
import { useScroll } from "@/app/providers/ScrollProvider";
import { useAudio } from "@/features/audio/context/AudioContext";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useTypeHeadingsOnScroll } from "@/hooks/useTypeHeadingsOnScroll";
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import { useGuidedFlow } from "@/hooks/useGuidedFlow";
import { SECTION_IDS, type SectionId } from "@/features/navigation/constants/navigation";

const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";
export default function Home() {
  const scrollController = useScroll();
  const { audioRef, isPlaying, setIsPlaying } = useAudio();

  useRevealOnScroll();
  useTypeHeadingsOnScroll(".section .section-reveal .section-intro", 34);
  useTypeHeadingsOnScroll(".hero-subtitle", 10);

  const handlePlayMusic = () => {
    const audioEl = audioRef?.current;
    if (!audioEl) return;

    void audioEl.play().then(() => {
      setIsPlaying(true);
    });
  };

  const {
    currentSectionId,
    isGuidedEnabled,
    isScrollUnlocked,
    isStepReady,
    advance,
  } = useGuidedFlow({
    sectionIds: SECTION_IDS as SectionId[],
    scrollController,
    onFreeAdvance: handlePlayMusic,
    onStartStep: handlePlayMusic,
  });

  const renderFlowButton = (sectionId: SectionId, label: string, slotClassName = "") => {
    if (!isGuidedEnabled) {
      if (sectionId !== "home") return null;

      const hidden = isPlaying;
      return (
        <div className={`hero-play-slot ${slotClassName}`.trim()}>
          <button
            type="button"
            className={`hero-play-trigger${hidden ? " is-hidden" : ""}`}
            onClick={handlePlayMusic}
            aria-hidden={hidden}
            tabIndex={hidden ? -1 : 0}
          >
            click to play -&gt;
          </button>
        </div>
      );
    }

    const isCurrent = currentSectionId === sectionId;
    const hidden = !isCurrent || !isStepReady || isScrollUnlocked;

    return (
      <div className={`hero-play-slot ${slotClassName}`.trim()}>
        <button
          type="button"
          className={`hero-play-trigger${hidden ? " is-hidden" : ""}`}
          onClick={advance}
          aria-hidden={hidden}
          tabIndex={hidden ? -1 : 0}
        >
          {label}
        </button>
      </div>
    );
  };

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
            {renderFlowButton("home", "click to play ->")}
          </div>
        </section>

        {/* About section */}
        <section id="about" className="section">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">about</h2>
            <p className="section-intro">{HOME_SECTION_INTRO.about}</p>
            <div className="about-layout">
              <div className="about-avatar-frame vhs-border">
                <Image src={avatar} alt="Portrait avatar" className="about-avatar-image" priority />
              </div>
              <p className="font-mono text-lg leading-relaxed">{HOME_ABOUT_TEXT}</p>
            </div>
            {renderFlowButton("about", "descend deeper ->", "flow-continue-anchor")}
          </div>
        </section>

        {/* Games section */}
        <section id="games" className="section">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">games</h2>
            <p className="section-intro">{HOME_SECTION_INTRO.games}</p>
            <div className="card-grid">
              {HOME_GAMES_SECTION_ITEMS.map((game) => (
                <GameCard key={game.name} {...game} />
              ))}
            </div>
            {renderFlowButton("games", "step through static ->", "flow-continue-anchor")}
          </div>
        </section>

        {/* Projects section */}
        <section id="projects" className="section">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">projects</h2>
            <p className="section-intro">{HOME_SECTION_INTRO.projects}</p>
            <div className="card-grid">
              {HOME_PROJECTS_SECTION_ITEMS.map((project) => (
                <ProjectCard key={project.name} {...project} />
              ))}
            </div>
            {renderFlowButton("projects", "keep drifting ->", "flow-continue-anchor")}
          </div>
        </section>

        {/* Blog section */}
        <section id="blog" className="section">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">blog</h2>
            <p className="section-intro">{HOME_SECTION_INTRO.blog}</p>
            <div>
              {HOME_BLOG_SECTION_POSTS.map((post) => (
                <BlogPostCard key={post.title} {...post} />
              ))}
            </div>
            {renderFlowButton("blog", "open final gate ->", "flow-continue-anchor")}
          </div>
        </section>

        {/* Contact section */}
        <section id="contact" className="section section-last">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">contact</h2>
            <p className="section-intro">{HOME_SECTION_INTRO.contact}</p>

            <div className="contact-shell vhs-border">
              <div className="contact-shell-left">
                <p className="contact-kicker">reach out</p>
                <p className="contact-copy">
                  Open for collabs, game jams, and weird web experiments. If you have an idea, send a message and
                  I&apos;ll get back to you.
                </p>

                <a className="contact-email-link" href={`mailto:${HOME_CONTACT_SECTION.email}`}>
                  <span className="contact-email-label">email</span>
                  <span className="contact-email-value">{HOME_CONTACT_SECTION.email}</span>
                </a>
              </div>

              <div className="contact-shell-right">
                <p className="contact-links-title">social links</p>
                <ul className="contact-links-list">
                  {HOME_CONTACT_SECTION.socials.map((social) => (
                    <li key={social.label}>
                      <a href={social.href} target="_blank" rel="noreferrer" className="contact-link-chip">
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

            {isGuidedEnabled && (
              <div className="hero-play-slot flow-continue-anchor">
                <button
                  type="button"
                  className={`hero-play-trigger${
                    currentSectionId !== "contact" || !isStepReady || isScrollUnlocked
                      ? " is-hidden"
                      : ""
                  }`}
                  onClick={advance}
                  aria-hidden={currentSectionId !== "contact" || !isStepReady || isScrollUnlocked}
                  tabIndex={currentSectionId !== "contact" || !isStepReady || isScrollUnlocked ? -1 : 0}
                >
                  break the seal -&gt;
                </button>
              </div>
            )}
          </div>
        </section>

        <footer className="footer-section p-4 text-center font-pixel text-accent-bright text-xs">
          &copy; 2026 hollow-room. All rights reserved.{" "}
          <span className="text-muted text-[0.65rem] tracking-[0.08em]">v{appVersion}</span>
        </footer>
      </main>
    </>
  );
}
