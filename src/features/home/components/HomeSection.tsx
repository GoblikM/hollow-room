import type { ReactNode } from "react";

type HomeSectionProps = {
  id: string;
  heading: string;
  intro: string;
  /** Extra class on the <section> (e.g. "section-last" for the final section). */
  className?: string;
  children: ReactNode;
};

/**
 * Shared wrapper for the home page sections (about, games, projects, blog,
 * contact): the scroll-reveal container plus the section heading and intro line.
 * Each section passes its copy and its body (including the guided-flow button)
 * as children. The hero section is bespoke and does not use this.
 */
export default function HomeSection({ id, heading, intro, className = "", children }: HomeSectionProps) {
  return (
    <section id={id} className={`section ${className}`.trim()}>
      <div className="section-reveal max-w-200 w-full">
        <h2 className="font-pixel text-5xl mb-10 text-accent-bright">{heading}</h2>
        <p className="section-intro">{intro}</p>
        {children}
      </div>
    </section>
  );
}
