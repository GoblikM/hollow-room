"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import { ABOUT_BIO, ABOUT_TAGLINE } from "@/features/about/data/bioContent";
import { INTERESTS } from "@/features/about/data/interestsData";
import Timeline from "@/features/about/components/Timeline";
import SkillGrid from "@/features/about/components/SkillGrid";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useTypeHeadingsOnScroll } from "@/hooks/useTypeHeadingsOnScroll";
const GUIDED_FLOW_COMPLETED_KEY = "ui-guided-flow-completed";

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem(GUIDED_FLOW_COMPLETED_KEY) !== "1") {
      router.replace("/#about");
    }
  }, [router]);

  useRevealOnScroll();
  useTypeHeadingsOnScroll(".about-page .section-reveal h2", 28);

  return (
    <main className="page-content about-page">
      {/* Hero */}
      <section className="about-hero section">
        <div className="section-reveal about-hero-inner">
          <div className="about-hero-avatar-frame vhs-border">
            <Image src={avatar} alt="Portrait avatar" className="about-hero-avatar" priority />
          </div>
          <h1 className="about-hero-title font-pixel text-accent-bright">about me</h1>
          <p className="about-hero-tagline font-mono text-muted">{ABOUT_TAGLINE}</p>
        </div>
        <div className="scroll-hint" aria-hidden="true">
          <svg className="scroll-hint-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 13l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* Bio */}
      <section className="about-bio section">
        <div className="section-reveal max-w-200 w-full">
          <h2 className="font-pixel text-5xl mb-10 text-accent-bright">who am I</h2>
          <div className="about-bio-text">
            {ABOUT_BIO.map((paragraph, i) => (
              <p key={i} className="font-mono text-lg leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="about-timeline section">
        <div className="section-reveal max-w-200 w-full">
          <h2 className="font-pixel text-5xl mb-10 text-accent-bright">timeline</h2>
          <Timeline />
        </div>
      </section>

      {/* Skills */}
      <section className="about-skills section">
        <div className="section-reveal max-w-200 w-full">
          <h2 className="font-pixel text-5xl mb-10 text-accent-bright">tech stack</h2>
          <SkillGrid />
        </div>
      </section>

      {/* Interests */}
      <section className="about-interests section">
        <div className="section-reveal max-w-200 w-full">
          <h2 className="font-pixel text-5xl mb-10 text-accent-bright">interests</h2>
          <div className="interests-grid">
            {INTERESTS.map((interest) => (
              <div key={interest.label} className="interest-card vhs-border section-reveal">
                <h3 className="interest-label font-pixel">{interest.label}</h3>
                <p className="interest-detail font-mono">{interest.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom back link */}
      <div className="about-back section-reveal">
        <Link href="/#about" className="about-back-link font-mono hover-text-glitch text-glitch-soft">
          &lt;- back to home
        </Link>
      </div>
    </main>
  );
}
