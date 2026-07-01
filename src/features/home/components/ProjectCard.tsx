import Link from "next/link";
import styles from "./HomeCard.module.css";

type ProjectCardProps = {
  name: string;
  description: string;
  tags: string[];
  slug?: string;
};

export default function ProjectCard({ name, description, tags, slug }: ProjectCardProps) {
  const card = (
    <article className={`pixel-border bg-surface p-5 ${slug ? styles.interactiveCard : ""}`.trim()}>
      <h3 className="font-pixel text-xs mb-2 text-accent-bright">{name}</h3>
      <p className="font-mono text-[0.8rem] leading-[1.6] mb-4">{description}</p>
      <ul className="flex flex-wrap gap-[0.4rem] list-none m-0 p-0">
        {tags.map((tag) => (
          <li key={tag} className="font-mono text-[0.65rem] px-2 py-[0.15rem] border border-accent-dim text-muted">
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );

  return slug ? <Link href={`/project/${slug}`}>{card}</Link> : card;
}
