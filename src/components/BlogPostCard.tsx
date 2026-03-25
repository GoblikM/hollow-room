type BlogPostCardProps = {
  title: string;
  date: string;
  excerpt: string;
};

export default function BlogPostCard({ title, date, excerpt }: BlogPostCardProps) {
  return (
    <article
      style={{
        borderBottom: "1px solid var(--color-border)",
        paddingBottom: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <p
        className="font-mono"
        style={{ color: "var(--color-text-muted)", fontSize: "0.7rem", marginBottom: "0.4rem" }}
      >
        {date}
      </p>
      <h3
        className="font-pixel"
        style={{ color: "var(--color-accent-bright)", fontSize: "0.8rem", marginBottom: "0.75rem", lineHeight: 1.5 }}
      >
        {title}
      </h3>
      <p
        className="font-mono"
        style={{ color: "var(--color-text)", fontSize: "0.85rem", lineHeight: 1.7 }}
      >
        {excerpt}
      </p>
    </article>
  );
}
