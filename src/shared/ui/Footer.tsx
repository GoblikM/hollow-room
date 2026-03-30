const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";

export default function Footer() {
  return (
    <footer className="footer-section p-4 text-center font-pixel text-accent-bright text-xs">
      &copy; 2026 hollow-room. All rights reserved.{" "}
      <span className="text-muted text-[0.65rem] tracking-[0.08em]">v{appVersion}</span>
    </footer>
  );
}
