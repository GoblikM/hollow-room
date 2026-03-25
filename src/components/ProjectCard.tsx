type ProjectCardProps = {
  name: string;
  description: string;
  tags: string[];
};

export default function ProjectCard({ name, description, tags }: ProjectCardProps) {
  return (
    <article className="pixel-border" style={{ background: "var(--color-surface)", padding: "1.25rem" }}>
      <h3
        className="font-pixel"
        style={{ color: "var(--color-accent-bright)", fontSize: "0.75rem", marginBottom: "0.5rem" }}
      >
        {name}
      </h3>
      <p
        className="font-mono"
        style={{ color: "var(--color-text)", fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "1rem" }}
      >
        {description}
      </p>
      <ul style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", listStyle: "none", margin: 0, padding: 0 }}>
        {tags.map((tag) => (
          <li
            key={tag}
            className="font-mono"
            style={{
              fontSize: "0.65rem",
              padding: "0.15rem 0.5rem",
              border: "1px solid var(--color-accent-dim)",
              color: "var(--color-text-muted)",
            }}
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
