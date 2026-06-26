import Game2048 from "@/features/2048/components/Game2048";
import SolverGuide from "@/features/2048/components/SolverGuide";

export default function Page() {
  return (
    <main className="page-content min-h-screen px-4 py-10 md:py-14">
      <section className="flex flex-col items-center gap-10 md:gap-14">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-pixel text-3xl md:text-5xl text-accent-bright text-glitch-soft">2048 Solver</h1>
          <p className="font-mono text-base md:text-lg text-muted max-w-130">
            A 2048 clone with a built-in AI. Play it yourself with the arrow keys, or hand it over to one of three
            solvers and watch it run — at the speed you choose.
          </p>
        </header>
        <Game2048 />
        <SolverGuide />
      </section>
    </main>
  );
}
