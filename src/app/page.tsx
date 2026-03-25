export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Low-poly geometric background */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 600"
      >
        {/* Fragmented terrain silhouette — dark violet polygons */}
        <polygon points="0,600 120,380 200,460 320,300 420,420 500,260 600,380 700,280 800,350 800,600" fill="#0d0a1a" opacity="0.9" />
        <polygon points="0,600 80,450 180,520 260,380 360,480 440,340 540,440 620,360 720,420 800,370 800,600" fill="#16102a" opacity="0.7" />
        <polygon points="120,380 200,460 280,350 200,300" fill="#1e1538" opacity="0.6" />
        <polygon points="420,420 500,260 580,340 500,420" fill="#1e1538" opacity="0.5" />
        <polygon points="620,360 700,280 760,320 700,380" fill="#1e1538" opacity="0.5" />
        <polygon points="0,200 100,320 60,420 0,380" fill="#16102a" opacity="0.4" />
        <polygon points="700,0 800,100 780,220 680,160" fill="#16102a" opacity="0.35" />
        <polygon points="300,0 420,80 360,180 260,100" fill="#1e1538" opacity="0.3" />
        {/* Faint violet accent triangles */}
        <polygon points="500,260 560,180 620,260" fill="#2a1f4a" opacity="0.5" />
        <polygon points="200,300 260,220 320,300" fill="#2a1f4a" opacity="0.4" />
        <polygon points="680,160 720,100 760,160" fill="#2a1f4a" opacity="0.35" />
      </svg>

      {/* Hero content */}
      <div className="relative z-10 text-center">
        <h1
          className="text-7xl mb-6 glitch-hover"
          style={{ color: "var(--color-accent-bright)", fontFamily: "var(--font-pixel)", letterSpacing: "0.04em" }}
        >
          <span className="glitch-target chroma">goblikm</span>
        </h1>
        <p
          className="font-mono text-lg tracking-widest uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          blog &amp; portfolio &mdash; coming soon
        </p>
      </div>
    </main>
  );
}
