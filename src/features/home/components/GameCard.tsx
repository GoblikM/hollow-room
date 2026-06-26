import Link from "next/link";

type GameCardProps = {
  name: string;
  description: string;
  slug?: string;
};

export default function GameCard({ name, description, slug }: GameCardProps) {
  const card = (
    <article className="vhs-border bg-surface-2 p-5">
      <h3 className="font-pixel text-xs mb-[0.6rem] text-accent-bright">{name}</h3>
      <p className="font-mono text-[0.8rem] leading-[1.6]">{description}</p>
    </article>
  );

  return slug ? <Link href={`/game/${slug}`}>{card}</Link> : card;
}
