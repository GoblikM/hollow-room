"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#blog", label: "Blog" },
  { href: "#projects", label: "Projects" },
  { href: "#games", label: "Games" },
];

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

function NavLink({ href, label, active, mobile = false, onClick }: NavLinkProps) {
  if (mobile) {
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        onClick={onClick}
        className={active ? "nav-mobile-link nav-mobile-link-active" : "nav-mobile-link"}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={active ? "nav-link nav-link-active" : "nav-link"}
    >
      {label}
    </Link>
  );
}

export default function Nav({ activeSection = "home" }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => href.replace("#", "") === activeSection;

  return (
    <nav className="nav-root">
      {/* Top gradient strip — violet/purple */}
      <div aria-hidden="true" className="nav-gradient-strip" />

      <div className="nav-inner">
        {/* Logo / site name — Silkscreen pixel font, chroma on hover */}
        <Link href="/" aria-label="goblikm home" className="nav-logo logo-link">
          GOBLIKM
        </Link>

        {/* Desktop links */}
        <ul role="list" className="nav-desktop-links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <NavLink href={href} label={label} active={isActive(href)} />
            </li>
          ))}
        </ul>

        {/* Hamburger button — mobile only */}
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className={menuOpen ? "nav-hamburger nav-hamburger-open" : "nav-hamburger"}
        >
          {menuOpen ? (
            // X icon
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="var(--color-accent-bright)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            // Hamburger icon
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

      {/* Mobile dropdown menu */}
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
