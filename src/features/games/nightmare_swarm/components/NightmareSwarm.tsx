import styles from "./NightmareSwarm.module.css";

const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// The Unity WebGL build ships its own loader/index.html under public/. We embed
// it in an iframe so the engine's own loader runs unchanged.
const BUILD_URL = `${PUBLIC_BASE_PATH}/ns_web_build/index.html`;

export default function NightmareSwarm() {
  return (
    <div className={`${styles.frame} vhs-border`}>
      <iframe
        src={BUILD_URL}
        title="Nightmare Swarm"
        className={styles.embed}
        allow="fullscreen; autoplay"
        allowFullScreen
      />
    </div>
  );
}
