type BlogPostCardProps = {
  title: string;
  date: string;
  excerpt: string;
};

export default function BlogPostCard({ title, date, excerpt }: BlogPostCardProps) {
  return (
    <article className="border-b border-outline pb-6 mb-6">
      <p className="font-mono text-[0.7rem] mb-[0.4rem] text-muted">{date}</p>
      <h3 className="font-pixel text-xs mb-3 leading-normal text-accent-bright">{title}</h3>
      <p className="font-mono text-[0.85rem] leading-[1.7]">{excerpt}</p>
    </article>
  );
}
