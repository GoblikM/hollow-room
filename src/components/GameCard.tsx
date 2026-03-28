type GameCardProps = {
  name: string;
  description: string;
};

export default function GameCard({ name, description }: GameCardProps) {
  return (
    <article className="vhs-border bg-surface-2 p-5">
      <h3 className="font-pixel text-xs mb-[0.6rem] text-accent-bright">
        {name}
      </h3>
      <p className="font-mono text-[0.8rem] leading-[1.6]">
        {description}
      </p>
    </article>
  );
}
