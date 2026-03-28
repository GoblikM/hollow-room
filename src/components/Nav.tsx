"use client";

import { useScroll } from "@/components/ScrollProvider";
import { NAV_LINKS } from "@/constants/navigation";
import Link from "next/link";
import { useState } from "react";
import type { MouseEvent } from "react";

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

function NavLink({
  href,
  label,
  active,
  mobile = false,
  onClick,
}: NavLinkProps) {
  const scrollController = useScroll();
  const baseClassName = mobile ? "nav-mobile-link" : "nav-link";
  const activeClassName = mobile ? "nav-mobile-link-active" : "nav-link-active";
  const className = `${baseClassName}${active ? ` ${activeClassName}` : ""} hover-text-glitch text-glitch-soft`;
  const isHashLink = href.startsWith("#");

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.();

    if (!isHashLink || !scrollController || isModifiedClick(event)) return;

    const targetElement = document.querySelector<HTMLElement>(href);
    if (!targetElement) return;

    event.preventDefault();
    scrollController.scrollTo(targetElement, {
      offset: href === "#home" ? 0 : -NAV_HEIGHT,
      duration: 0.9,
    });
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={handleClick}
      className={className}
    >
      {label}
    </Link>
  );
}

export default function Nav({ activeSection = "home" }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollController = useScroll();

  const isActive = (href: string) => href.replace("#", "") === activeSection;

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!scrollController || isModifiedClick(event)) return;
    event.preventDefault();
    scrollController.scrollTo(0, { immediate: false, duration: 1 });
  }

  return (
    <nav className="nav-root">
      <div aria-hidden="true" className="nav-ambient-glow" />
      <div aria-hidden="true" className="nav-gradient-strip" />

      <div className="nav-inner">
        <Link
          href="/"
          aria-label="hollow-room home"
          className="nav-logo logo-link"
          onClick={handleLogoClick}
        >
          HOLLOW-ROOM
        </Link>

        <ul role="list" className="nav-desktop-links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <NavLink href={href} label={label} active={isActive(href)} />
            </li>
          ))}
        </ul>

        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className={
            menuOpen ? "nav-hamburger nav-hamburger-open" : "nav-hamburger"
          }
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M3 6h14M3 10h14M3 14h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div id="nav-mobile-menu" className="nav-mobile-menu">
          <ul role="list" className="nav-mobile-links">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <NavLink
                  href={href}
                  label={label}
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
