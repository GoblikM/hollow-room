"use client";

import React from "react";

const ROWS = 4;
const COLS = 4;

export default function Page() {
  const [board, setBoard] = React.useState<number[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));

  return (
    <main className="page-content min-h-screen">
      <section className="flex flex-col items-center justify-center gap-4 p-8">
        <h1 className="font-pixel text-5xl text-accent-bright">2048 Solver</h1>
        <p className="font-mono text-lg text-muted max-w-120 text-center">
          A 2048 clone with an AI solver. Use arrow keys to play, or watch the AI make moves for you. Can you beat the
          AI?
        </p>
        <div className="w-full max-w-120 aspect-square bg-surface-2 rounded-lg shadow-lg">
          <div className="grid grid-cols-4 grid-rows-4 w-full h-full">
            {Array.from({ length: ROWS * COLS }).map((_, index) => (
              <div
                key={index}
                className="border border-surface-3 flex items-center justify-center text-accent-bright font-pixel text-2xl"
              >
                {board[Math.floor(index / 4)][index % 4]}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
