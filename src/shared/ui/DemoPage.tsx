import type { ReactNode } from "react";

type DemoPageProps = {
  title: string;
  blurb: string;
  children: ReactNode;
};

/**
 * Shared page shell for standalone game/project pages: the centered layout plus
 * a title + blurb header. Each page passes its copy and its content as children.
 */
export default function DemoPage({ title, blurb, children }: DemoPageProps) {
  return (
    <main className="page-content min-h-screen px-4 py-10 md:py-14">
      <section className="flex flex-col items-center gap-10 md:gap-14">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-pixel text-3xl md:text-5xl text-accent-bright text-glitch-soft">{title}</h1>
          <p className="font-mono text-base md:text-lg text-muted max-w-130">{blurb}</p>
        </header>
        {children}
      </section>
    </main>
  );
}
