# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
Personal blog and portfolio website. Features a horror/VHS retro aesthetic, a blog section, project showcase, and embedded browser games. Built as a Next.js static export — no server required.

## Commands

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Static export to out/
npm run lint       # ESLint
npm test           # Run all Jest tests
npm run test:watch # Jest watch mode

# Run a single test file
npx jest __tests__/components/Nav.test.tsx
```

## Architecture

The site is currently a **single-page app** — all sections (home, about, games, projects, blog) live in `src/app/page.tsx` as `<section id="...">` elements with in-page hash navigation. There are no sub-routes yet; blog/projects/games show placeholder data arrays defined at the top of `page.tsx`.

**Scroll system** — `LocomotiveScrollProvider` (wraps the entire app in `layout.tsx`) initialises Lenis smooth scroll and exposes a React context (`ScrollContext`) with `scrollTo`, `subscribe`, `resize`, and `getScrollValues`. Components that need to programmatically scroll (Nav, etc.) call `useLocomotiveScroll()` to get the controller. Respects `prefers-reduced-motion`.

**Active section tracking** — `useActiveSection` hook uses `IntersectionObserver` on section elements and updates the URL hash via `window.history.replaceState` (no router push, so no full re-render).

**Theme system** — `ThemePicker` (fixed bottom-right) writes CSS custom properties directly to `document.documentElement` and persists scheme + dark/light mode to `localStorage`. Themes (Void, Blood, Toxic, Abyss, Static, Rust) only change accent colors; background/text colors swap between two fixed dark/light palettes.

**CSS design tokens** — all colors and fonts are CSS variables defined in `globals.css`:
- `--color-accent`, `--color-accent-bright`, `--color-accent-dim`, `--color-border`
- `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-text`, `--color-text-muted`
- `--font-heading` (IM Fell English), `--font-pixel` (Silkscreen), `--font-mono` (Share Tech Mono), `--font-body` (Crimson Text)

**Tailwind plugin** — `src/app/plugins/text-glitch-plugin.ts` is a local Tailwind CSS v4 plugin (imported via `@plugin` in `globals.css`) that generates a `@keyframes glitch` animation and utility classes: `.text-glitch`, `.hover-text-glitch`, `.text-glitch-soft`, `.text-glitch-balanced`, `.text-glitch-strong`. Tuned via CSS variables `--tg-rgb-r/g/b`, `--tg-rgb-blur`, `--tg-rgb-duration`.

**Deployment** — static export goes to `out/`. Set `SITE_BASE_PATH=hollow-room` at build time to enable GitHub Pages subpath deployment (`/hollow-room/`). Without it, the site deploys at the root. App version is injected from `package.json` into `NEXT_PUBLIC_APP_VERSION`.

## Conventions
- TypeScript everywhere; `@/` alias maps to `src/`
- Components in `PascalCase.tsx`, utilities/hooks in `camelCase.ts`
- Tailwind for layout/spacing; custom CSS classes for retro effects (scanlines, grunge, pixel borders)
- Keep components small — one per file
- No server-side features (`output: 'export'` is set in `next.config.ts`)
- Fonts are loaded via `<link>` in `layout.tsx` head (not `next/font`) — the `no-page-custom-font` ESLint rule is suppressed there
- Test files mirror `src/` under `__tests__/` (e.g. `__tests__/components/Nav.test.tsx`)
