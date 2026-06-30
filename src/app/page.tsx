"use client";

import BlogPostCard from "@/features/home/components/BlogPostCard";
import GameCard from "@/features/home/components/GameCard";
import ProjectCard from "@/features/home/components/ProjectCard";
import { useScroll } from "@/app/providers/ScrollProvider";
import { useAudio } from "@/features/audio/context/AudioContext";
import { useContent } from "@/features/i18n/useContent";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useTypeHeadingsOnScroll } from "@/hooks/useTypeHeadingsOnScroll";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import avatar from "@/assets/avatar.png";
import { useGuidedFlow } from "@/hooks/useGuidedFlow";
import { SECTION_IDS, type SectionId } from "@/features/navigation/constants/navigation";
import styles from "./page.module.css";
export default function Home() {
  const scrollController = useScroll();
  const { isPlaying, play: playMusic } = useAudio();
  const { home, games, projects } = useContent();

  useRevealOnScroll();
  useTypeHeadingsOnScroll(".section .section-reveal .section-intro", 34);
  useTypeHeadingsOnScroll(".hero-subtitle", 10);

  const { currentSectionId, isGuidedEnabled, isScrollUnlocked, isStepReady, advance, skip } = useGuidedFlow({
    sectionIds: SECTION_IDS as SectionId[],
    scrollController,
    onFreeAdvance: playMusic,
    onStartStep: playMusic,
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
            onClick={playMusic}
            aria-hidden={hidden}
            tabIndex={hidden ? -1 : 0}
          >
            {home.flowButtons.home}
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
            <div className={styles.heroTitleShell}>
              <h1 className={`${styles.heroTitle} text-7xl mb-6 text-glitch text-glitch-soft font-pixel text-accent-bright tracking-[0.04em]`}>
                {home.hero.title}
              </h1>
            </div>
            <p className="hero-subtitle font-mono text-lg tracking-widest uppercase text-muted">
              {home.hero.subtitle}
            </p>
            {renderFlowButton("home", home.flowButtons.home)}
          </div>
        </section>

        {/* About section */}
        <section id="about" className="section">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">{home.sectionHeadings.about}</h2>
            <p className="section-intro">{home.sectionIntro.about}</p>
            <div className={styles.aboutLayout}>
              <div className={`${styles.aboutAvatarFrame} vhs-border`}>
                <Image src={avatar} alt="Portrait avatar" className={styles.aboutAvatarImage} priority />
              </div>
              <div>
                <p className="font-mono text-lg leading-relaxed mb-6">{home.aboutTeaser}</p>
                {(!isGuidedEnabled || isScrollUnlocked) && (
                  <Link href="/about" className={`${styles.aboutCtaLink} font-mono hover-text-glitch text-glitch-soft`}>
                    {home.aboutCta}
                  </Link>
                )}
              </div>
            </div>
            {renderFlowButton("about", home.flowButtons.about, "flow-continue-anchor")}
          </div>
        </section>

        {/* Games section */}
        <section id="games" className="section">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">{home.sectionHeadings.games}</h2>
            <p className="section-intro">{home.sectionIntro.games}</p>
            <div className={styles.cardGrid}>
              {games.cards.map((game) => (
                <GameCard key={game.slug} {...game} />
              ))}
            </div>
            {renderFlowButton("games", home.flowButtons.games, "flow-continue-anchor")}
          </div>
        </section>

        {/* Projects section */}
        <section id="projects" className="section">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">{home.sectionHeadings.projects}</h2>
            <p className="section-intro">{home.sectionIntro.projects}</p>
            <div className={styles.cardGrid}>
              {projects.cards.map((project) => (
                <ProjectCard key={project.name} {...project} />
              ))}
            </div>
            {renderFlowButton("projects", home.flowButtons.projects, "flow-continue-anchor")}
          </div>
        </section>

        {/* Blog section */}
        <section id="blog" className="section">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">{home.sectionHeadings.blog}</h2>
            <p className="section-intro">{home.sectionIntro.blog}</p>
            <div>
              {home.blogPosts.map((post) => (
                <BlogPostCard key={post.title} {...post} />
              ))}
            </div>
            {renderFlowButton("blog", home.flowButtons.blog, "flow-continue-anchor")}
          </div>
        </section>

        {/* Contact section */}
        <section id="contact" className="section section-last">
          <div className="section-reveal max-w-200 w-full">
            <h2 className="font-pixel text-5xl mb-10 text-accent-bright">{home.sectionHeadings.contact}</h2>
            <p className="section-intro">{home.sectionIntro.contact}</p>

            <div className={`${styles.contactShell} vhs-border`}>
              <div className={styles.contactShellLeft}>
                <p className={styles.contactKicker}>{home.contact.kicker}</p>
                <p className={styles.contactCopy}>{home.contact.copy}</p>

                <a className={styles.contactEmailLink} href={`mailto:${home.contact.email}`}>
                  <span className={styles.contactEmailLabel}>{home.contact.emailLabel}</span>
                  <span className={styles.contactEmailValue}>{home.contact.email}</span>
                </a>
              </div>

              <div className={styles.contactShellRight}>
                <p className={styles.contactLinksTitle}>{home.contact.socialsLabel}</p>
                <ul className={styles.contactLinksList}>
                  {home.contact.socials.map((social) => (
                    <li key={social.label}>
                      <a href={social.href} target="_blank" rel="noreferrer" className={styles.contactLinkChip}>
                        <span className={styles.contactLinkArrow} aria-hidden="true">
                          &gt;
                        </span>
                        <span>{social.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {renderFlowButton("contact", home.flowButtons.contact, "flow-continue-anchor")}
          </div>
        </section>
      </main>

      {/* Escape hatch for the guided tour. Portaled to <body> so position:fixed
          isn't broken by ScrollSmoother's transform on #smooth-content. */}
      {isGuidedEnabled &&
        !isScrollUnlocked &&
        typeof document !== "undefined" &&
        createPortal(
          <button type="button" className={styles.skipTour} onClick={skip}>
            {home.flowButtons.skip}
          </button>,
          document.body,
        )}
    </>
  );
}
