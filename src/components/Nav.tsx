"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/games", label: "Games" },
];

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="nav-root"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(13, 13, 13, 0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: "0 0 16px 0 rgba(0,255,136,0.08)",
      }}
    >
      {/* Scanline accent strip */}
      <div
        aria-hidden="true"
        style={{
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          opacity: 0.4,
        }}
      />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px",
        }}
      >
        {/* Logo / site name */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "0.65rem",
            color: "var(--color-accent)",
            textDecoration: "none",
            letterSpacing: "0.05em",
            textShadow: "0 0 8px var(--color-accent)",
          }}
          aria-label="goblikm home"
        >
          goblikm
        </Link>

        {/* Desktop links */}
        <ul
          role="list"
          style={{
            display: "flex",
            gap: "0.25rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="nav-desktop-links"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  style={{
                    display: "inline-block",
                    padding: "0.35rem 0.75rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 400,
                    color: active
                      ? "var(--color-accent)"
                      : "var(--color-text-muted)",
                    textDecoration: "none",
                    borderRadius: "4px",
                    border: active
                      ? "1px solid var(--color-accent)"
                      : "1px solid transparent",
                    boxShadow: active
                      ? "0 0 6px 0 rgba(0,255,136,0.25)"
                      : "none",
                    transition: "color 0.15s, border-color 0.15s, box-shadow 0.15s",
                  }}
                  className={active ? "nav-link-active" : "nav-link"}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Hamburger button — mobile only */}
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "none",
            background: "none",
            border: "1px solid var(--color-border)",
            borderRadius: "4px",
            padding: "6px 8px",
            cursor: "pointer",
            color: "var(--color-text)",
          }}
          className="nav-hamburger"
        >
          {menuOpen ? (
            // X icon
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
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
        <div
          id="nav-mobile-menu"
          style={{
            borderTop: "1px solid var(--color-border)",
            background: "rgba(26,26,26,0.97)",
          }}
          className="nav-mobile-menu"
        >
          <ul
            role="list"
            style={{
              listStyle: "none",
              margin: 0,
              padding: "0.5rem 1.25rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "0.6rem 0.75rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      fontWeight: active ? 600 : 400,
                      color: active
                        ? "var(--color-accent)"
                        : "var(--color-text)",
                      textDecoration: "none",
                      borderLeft: active
                        ? "2px solid var(--color-accent)"
                        : "2px solid transparent",
                      borderRadius: "0 4px 4px 0",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
