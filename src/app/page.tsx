"use client";

import BlogPostCard from "@/features/home/components/BlogPostCard";
import HomeSection from "@/features/home/components/HomeSection";
import {
  HOME_ABOUT_TEASER,
  HOME_ABOUT_CTA,
  HOME_HERO,
  HOME_SECTION_HEADINGS,
  HOME_SECTION_INTRO,
  HOME_FLOW_BUTTONS,
  HOME_CONTACT,
  HOME_BLOG_POSTS,
} from "@/content/home";
import GameCard from "@/features/home/components/GameCard";
import { GAMES } from "@/content/games";
import ProjectCard from "@/features/home/components/ProjectCard";
import { PROJECTS } from "@/content/projects";
import { useScroll } from "@/app/providers/ScrollProvider";
import { useAudio } from "@/features/audio/context/AudioContext";
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
            {HOME_FLOW_BUTTONS.home}
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
                {HOME_HERO.title}
              </h1>
            </div>
            <p className="hero-subtitle font-mono text-lg tracking-widest uppercase text-muted">
              {HOME_HERO.subtitle}
            </p>
            {renderFlowButton("home", HOME_FLOW_BUTTONS.home)}
          </div>
        </section>

        {/* About section */}
        <HomeSection id="about" heading={HOME_SECTION_HEADINGS.about} intro={HOME_SECTION_INTRO.about}>
          <div className={styles.aboutLayout}>
            <div className={`${styles.aboutAvatarFrame} vhs-border`}>
              <Image src={avatar} alt="Portrait avatar" className={styles.aboutAvatarImage} priority />
            </div>
            <div>
              <p className="font-mono text-lg leading-relaxed mb-6">{HOME_ABOUT_TEASER}</p>
              {(!isGuidedEnabled || isScrollUnlocked) && (
                <Link href="/about" className={`${styles.aboutCtaLink} font-mono hover-text-glitch text-glitch-soft`}>
                  {HOME_ABOUT_CTA}
                </Link>
              )}
            </div>
          </div>
          {renderFlowButton("about", HOME_FLOW_BUTTONS.about, "flow-continue-anchor")}
        </HomeSection>

        {/* Games section */}
        <HomeSection id="games" heading={HOME_SECTION_HEADINGS.games} intro={HOME_SECTION_INTRO.games}>
          <div className={styles.cardGrid}>
            {GAMES.map((game) => (
              <GameCard key={game.name} {...game} />
            ))}
          </div>
          {renderFlowButton("games", HOME_FLOW_BUTTONS.games, "flow-continue-anchor")}
        </HomeSection>

        {/* Projects section */}
        <HomeSection id="projects" heading={HOME_SECTION_HEADINGS.projects} intro={HOME_SECTION_INTRO.projects}>
          <div className={styles.cardGrid}>
            {PROJECTS.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </div>
          {renderFlowButton("projects", HOME_FLOW_BUTTONS.projects, "flow-continue-anchor")}
        </HomeSection>

        {/* Blog section */}
        <HomeSection id="blog" heading={HOME_SECTION_HEADINGS.blog} intro={HOME_SECTION_INTRO.blog}>
          <div>
            {HOME_BLOG_POSTS.map((post) => (
              <BlogPostCard key={post.title} {...post} />
            ))}
          </div>
          {renderFlowButton("blog", HOME_FLOW_BUTTONS.blog, "flow-continue-anchor")}
        </HomeSection>

        {/* Contact section */}
        <HomeSection
          id="contact"
          heading={HOME_SECTION_HEADINGS.contact}
          intro={HOME_SECTION_INTRO.contact}
          className="section-last"
        >
          <div className={`${styles.contactShell} vhs-border`}>
            <div className={styles.contactShellLeft}>
              <p className={styles.contactKicker}>{HOME_CONTACT.kicker}</p>
              <p className={styles.contactCopy}>{HOME_CONTACT.copy}</p>

              <a className={styles.contactEmailLink} href={`mailto:${HOME_CONTACT.email}`}>
                <span className={styles.contactEmailLabel}>{HOME_CONTACT.emailLabel}</span>
                <span className={styles.contactEmailValue}>{HOME_CONTACT.email}</span>
              </a>
            </div>

            <div className={styles.contactShellRight}>
              <p className={styles.contactLinksTitle}>{HOME_CONTACT.socialsLabel}</p>
              <ul className={styles.contactLinksList}>
                {HOME_CONTACT.socials.map((social) => (
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

          {renderFlowButton("contact", HOME_FLOW_BUTTONS.contact, "flow-continue-anchor")}
        </HomeSection>
      </main>

      {/* Escape hatch for the guided tour. Portaled to <body> so position:fixed
          isn't broken by ScrollSmoother's transform on #smooth-content. */}
      {isGuidedEnabled &&
        !isScrollUnlocked &&
        typeof document !== "undefined" &&
        createPortal(
          <button type="button" className={styles.skipTour} onClick={skip}>
            {HOME_FLOW_BUTTONS.skip}
          </button>,
          document.body,
        )}
    </>
  );
}
