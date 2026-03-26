type GameCardProps = {
  name: string;
  description: string;
};

export default function GameCard({ name, description }: GameCardProps) {
  return (
    <article
      className="vhs-border"
      style={{ background: "var(--color-surface-2)", padding: "1.25rem" }}
    >
      <h3
        className="font-pixel"
        style={{ color: "var(--color-accent-bright)", fontSize: "0.75rem", marginBottom: "0.6rem" }}
      >
        {name}
      </h3>
      <p
        className="font-mono"
        style={{ color: "var(--color-text)", fontSize: "0.8rem", lineHeight: 1.6 }}
      >
        {description}
      </p>
    </article>
  );
}
