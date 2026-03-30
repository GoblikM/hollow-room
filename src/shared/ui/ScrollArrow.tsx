import { useEffect, useState } from "react";

export default function ScrollArrow() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const arrow = document.querySelector('.scroll-arrow-animated');
      if (!arrow) return setHidden(false);
      const rect = arrow.getBoundingClientRect();
      setHidden(rect.bottom < window.innerHeight / 3);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`scroll-arrow-animated${hidden ? " scroll-arrow-hidden" : ""}`} aria-hidden="true">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto animate-bounce">
        <path d="M16 6v20M16 26l-7-7M16 26l7-7" stroke="var(--color-accent, #ff0044)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
