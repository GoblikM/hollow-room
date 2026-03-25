export default function BlogPage() {
  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1
        className="font-pixel text-5xl mb-10"
        style={{ color: "var(--color-accent-bright)" }}
      >
        blog
      </h1>
      <p
        className="font-mono text-base"
        style={{ color: "var(--color-text-muted)" }}
      >
        // žádné posty zatím
      </p>
    </main>
  );
}
