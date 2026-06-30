"use client";

import { useScroll } from "@/app/providers/ScrollProvider";
import { NAV_LINKS } from "@/features/navigation/constants/navigation";
import { useContent } from "@/features/i18n/useContent";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { MouseEvent } from "react";
import styles from "./Nav.module.css";

export const NAV_HEIGHT = 56;

interface NavProps {
  activeSection?: string;
}

interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
  mobile?: boolean;
  onClick?: () => void;
}

function isModifiedClick(e: MouseEvent<HTMLAnchorElement>): boolean {
  return e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
}

function extractHash(href: string): string | null {
  const hashIndex = href.indexOf("#");
  return hashIndex >= 0 ? href.slice(hashIndex) : null;
}

function NavLink({ href, label, active, mobile = false, onClick }: NavLinkProps) {
  const scrollController = useScroll();
  const pathname = usePathname();
  const baseClassName = mobile ? "nav-mobile-link" : "nav-link";
  const activeClassName = mobile ? "nav-mobile-link-active" : "nav-link-active";
  const className = `${baseClassName}${active ? ` ${activeClassName}` : ""} hover-text-glitch text-glitch-soft`;
  const hash = extractHash(href);
  const isHomepage = pathname === "/" || pathname === "";

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.();

    if (!hash || !isHomepage || isModifiedClick(event)) return;

    const targetElement = document.querySelector<HTMLElement>(hash);
    if (!targetElement) return;

    event.preventDefault();
    scrollController.scrollTo(targetElement, {
      offset: hash === "#home" ? 0 : -NAV_HEIGHT,
      duration: 1.5,
    });
  }

  return (
    <Link href={href} aria-current={active ? "page" : undefined} onClick={handleClick} className={className}>
      {label}
    </Link>
  );
}

function SubPageNav() {
  const { ui } = useContent();
  return (
    <nav className={styles.navRoot} aria-label={ui.nav.pageNav}>
      <div aria-hidden="true" className={styles.navAmbientGlow} />
      <div aria-hidden="true" className={styles.navGradientStrip} />
      <div className={styles.navInner}>
        <Link href="/#about" className={`${styles.navBackLink} hover-text-glitch text-glitch-soft font-mono`}>
          {ui.nav.back}
        </Link>
      </div>
    </nav>
  );
}

export default function Nav({ activeSection = "home" }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollController = useScroll();
  const pathname = usePathname();
  const { ui } = useContent();
  const isHomepage = pathname === "/" || pathname === "";

  if (!isHomepage) {
    return <SubPageNav />;
  }

  const isActive = (href: string) => {
    const hash = extractHash(href);
    if (hash) return hash.slice(1) === activeSection;
    return pathname === href;
  };

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    if (isModifiedClick(event)) return;
    event.preventDefault();
    scrollController.scrollTo(0, { immediate: false, duration: 1.6 });
  }

  return (
    <nav className={styles.navRoot}>
      <div aria-hidden="true" className={styles.navAmbientGlow} />
      <div aria-hidden="true" className={styles.navGradientStrip} />

      <div className={styles.navInner}>
        <Link
          href="/"
          aria-label={ui.nav.logoAria}
          className={`${styles.navLogo} ${styles.logoLink}`}
          onClick={handleLogoClick}
        >
          HOLLOW-ROOM
        </Link>

        <ul role="list" className={styles.navDesktopLinks}>
          {NAV_LINKS.map(({ href, id }) => (
            <li key={href}>
              <NavLink href={href} label={ui.nav.sections[id]} active={isActive(href)} />
            </li>
          ))}
        </ul>

        <button
          aria-label={menuOpen ? ui.nav.closeMenu : ui.nav.openMenu}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className={menuOpen ? `${styles.navHamburger} ${styles.navHamburgerOpen}` : styles.navHamburger}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div id="nav-mobile-menu" className={styles.navMobileMenu}>
          <ul role="list" className={styles.navMobileLinks}>
            {NAV_LINKS.map(({ href, id }) => (
              <li key={href}>
                <NavLink
                  href={href}
                  label={ui.nav.sections[id]}
                  active={isActive(href)}
                  mobile
                  onClick={() => setMenuOpen(false)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
