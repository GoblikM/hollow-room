"use client";

import { useEffect, useState } from "react";
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
import { getCenteredScrollTarget } from "@/shared/utils/scrollRailMath";
import Image from "next/image";
import avatar from "@/assets/avatar.png";

const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";
const FLOW_SECTION_IDS = ["home", "about", "games", "projects", "blog", "contact"] as const;
const GUIDED_FLOW_COMPLETED_KEY = "ui-guided-flow-completed";

function getFlowStepIndexFromHash(hash: string): number {
  if (!hash.startsWith("#")) return -1;

  const normalizedHash = hash.slice(1).trim().toLowerCase();
  return FLOW_SECTION_IDS.findIndex((sectionId) => sectionId === normalizedHash);
}

function getFlowStepIndexFromScrollPosition(): number {
  const viewportCenter = window.scrollY + window.innerHeight * 0.5;
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  FLOW_SECTION_IDS.forEach((sectionId, index) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const sectionCenter = section.offsetTop + section.offsetHeight * 0.5;
    const distance = Math.abs(sectionCenter - viewportCenter);

    if (distance >= bestDistance) return;

    bestDistance = distance;
    bestIndex = index;
  });

  return bestIndex;
}

async function waitForSectionTypingDone(sectionId: string): Promise<void> {
  const section = document.getElementById(sectionId);
  const intro = section?.querySelector<HTMLElement>(".section-intro");

  if (!intro) return;

  const resolveIfDone = () => !intro.classList.contains("typing-heading");
  if (resolveIfDone()) return;

  await new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!resolveIfDone()) return;
      observer.disconnect();
      resolve();
    });

    const timeout = window.setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 7000);

    observer.observe(intro, { attributes: true, attributeFilter: ["class"] });

    if (resolveIfDone()) {
      window.clearTimeout(timeout);
      observer.disconnect();
      resolve();
    }
  });
}

export default function Home() {
  const scrollController = useScroll();
  const { audioRef, isPlaying, setIsPlaying } = useAudio();
  const [flowStepIndex, setFlowStepIndex] = useState(() => {
    if (typeof window === "undefined") return 0;

    const hashStepIndex = getFlowStepIndexFromHash(window.location.hash);
    return hashStepIndex >= 0 ? hashStepIndex : getFlowStepIndexFromScrollPosition();
  });
  const [isStepReady, setIsStepReady] = useState(true);
  const [isScrollUnlocked, setIsScrollUnlocked] = useState(false);
  const [isGuidedEnabled, setIsGuidedEnabled] = useState(false);
  const [hasOpenedSettingsInFlow, setHasOpenedSettingsInFlow] = useState(false);

  useRevealOnScroll();
  useTypeHeadingsOnScroll(".section .section-reveal .section-intro", 34);
  useTypeHeadingsOnScroll(".hero-subtitle", 10);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 641px)");

    const syncGuidedMode = () => {
      const hasCompletedGuidedFlow = localStorage.getItem(GUIDED_FLOW_COMPLETED_KEY) === "1";
      setIsGuidedEnabled(mediaQuery.matches && !hasCompletedGuidedFlow);
    };

    syncGuidedMode();
    mediaQuery.addEventListener("change", syncGuidedMode);

    return () => {
      mediaQuery.removeEventListener("change", syncGuidedMode);
    };
  }, []);

  useEffect(() => {
    if (!isGuidedEnabled || isScrollUnlocked) {
      document.body.classList.remove("guided-scroll-locked");
      return;
    }

    document.body.classList.add("guided-scroll-locked");

    const prevent = (event: Event) => {
      event.preventDefault();
    };

    const preventKeyboardScroll = (event: KeyboardEvent) => {
      const blockedKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
      if (!blockedKeys.includes(event.key)) return;
      event.preventDefault();
    };

    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });
    window.addEventListener("keydown", preventKeyboardScroll, { passive: false });

    return () => {
      document.body.classList.remove("guided-scroll-locked");
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      window.removeEventListener("keydown", preventKeyboardScroll);
    };
  }, [isGuidedEnabled, isScrollUnlocked]);

  useEffect(() => {
    const flowLocked = isGuidedEnabled && !isScrollUnlocked;
    document.body.classList.toggle("guided-flow-pending", flowLocked);
    window.dispatchEvent(new CustomEvent("guidedFlowLockChanged", { detail: { locked: flowLocked } }));

    return () => {
      document.body.classList.remove("guided-flow-pending");
    };
  }, [isGuidedEnabled, isScrollUnlocked]);

  useEffect(() => {
    const handleSettingsPanelOpened = () => {
      setHasOpenedSettingsInFlow(true);
    };

    window.addEventListener("settingsPanelOpened", handleSettingsPanelOpened);

    return () => {
      window.removeEventListener("settingsPanelOpened", handleSettingsPanelOpened);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("flowStateChanged", {
        detail: {
          isGuidedEnabled,
          flowStepIndex,
          hasOpenedSettingsInFlow,
        },
      }),
    );
  }, [isGuidedEnabled, flowStepIndex, hasOpenedSettingsInFlow]);

  const handlePlayMusic = () => {
    const audioEl = audioRef?.current;
    if (!audioEl) return;

    void audioEl.play().then(() => {
      setIsPlaying(true);
    });
  };

  const handleFlowAdvance = async () => {
    if (!isGuidedEnabled) {
      handlePlayMusic();
      return;
    }

    if (!isStepReady) return;

    const isFinalStep = flowStepIndex === FLOW_SECTION_IDS.length - 1;
    if (isFinalStep) {
      setIsScrollUnlocked(true);
      localStorage.setItem(GUIDED_FLOW_COMPLETED_KEY, "1");
      return;
    }

    if (flowStepIndex === 0) {
      handlePlayMusic();
    }

    const nextStepIndex = flowStepIndex + 1;
    const nextSectionId = FLOW_SECTION_IDS[nextStepIndex];
    const nextSectionEl = document.getElementById(nextSectionId);

    setIsStepReady(false);
    setFlowStepIndex(nextStepIndex);

    if (nextSectionEl) {
      const controllerLimit = scrollController?.getScrollValues().limit ?? 0;
      const docScrollLimit = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      const scrollLimit = controllerLimit > 0 ? controllerLimit : docScrollLimit;
      const centeredTarget = getCenteredScrollTarget(
        nextSectionEl.offsetTop,
        nextSectionEl.offsetHeight,
        window.innerHeight,
        scrollLimit,
      );

      scrollController?.scrollTo(centeredTarget, {
        immediate: false,
        duration: 1.1,
      });
    }

    await waitForSectionTypingDone(nextSectionId);
    setIsStepReady(true);
  };

  const renderFlowButton = (sectionId: (typeof FLOW_SECTION_IDS)[number], label: string, slotClassName = "") => {
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

    const currentSectionId = FLOW_SECTION_IDS[flowStepIndex];
    const isCurrent = currentSectionId === sectionId;
    const hidden = !isCurrent || !isStepReady || isScrollUnlocked;

    return (
      <div className={`hero-play-slot ${slotClassName}`.trim()}>
        <button
          type="button"
          className={`hero-play-trigger${hidden ? " is-hidden" : ""}`}
          onClick={handleFlowAdvance}
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
                    FLOW_SECTION_IDS[flowStepIndex] !== "contact" || !isStepReady || isScrollUnlocked
                      ? " is-hidden"
                      : ""
                  }`}
                  onClick={handleFlowAdvance}
                  aria-hidden={FLOW_SECTION_IDS[flowStepIndex] !== "contact" || !isStepReady || isScrollUnlocked}
                  tabIndex={FLOW_SECTION_IDS[flowStepIndex] !== "contact" || !isStepReady || isScrollUnlocked ? -1 : 0}
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
