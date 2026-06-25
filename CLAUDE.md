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

## Releasing

```bash
npm run release:patch   # 0.2.2 → 0.2.3  (bumps, regenerates CHANGELOG, commits, tags, pushes)
npm run release:minor   # 0.2.2 → 0.3.0
npm run release:major   # 0.2.2 → 1.0.0
```

These wrap `npm version <type> -m "v%s"`. Plain `npm version patch|minor|major` works too — the release scripts just set the commit message to `vX.Y.Z`.

The `version` npm lifecycle hook runs `git-cliff` automatically — it regenerates `CHANGELOG.md` from conventional commits and stages it before npm creates the version commit and tag. The `postversion` hook then runs `git push && git push --tags`. No manual changelog edits needed.

Conventional commit prefixes and how they map to changelog sections (configured in `cliff.toml`):
- `feat:` → 🚀 Features
- `fix:` → 🐛 Bug Fixes
- `refactor:` → 🚜 Refactor
- `perf:` → ⚡ Performance
- `docs:` → 📚 Documentation
- `style:` → 🎨 Styling
- `test:` → 🧪 Testing
- `chore:`, `ci:` → ⚙️ Miscellaneous Tasks
- `revert:` → ◀️ Revert
- anything else → 💼 Other
- skipped: `chore(deps…)`, `chore(release): prepare for`, `chore(pr)`, `chore(pull)`

## Architecture

The site is currently a **single-page app** — all sections (home, about, games, projects, blog) live in `src/app/page.tsx` as `<section id="...">` elements with in-page hash navigation. There are no sub-routes yet; blog/projects/games data lives in `src/features/home/data/` (one file per section).

**Directory structure** — code is organized by domain under `src/features/`:
- `features/audio/` — `AudioContext`, `MusicControls`, `AutoPlayMusic`
- `features/home/` — card components (`BlogPostCard`, `GameCard`, `ProjectCard`) and content data files
- `features/navigation/` — `Nav`, `ScrollRail`, section ID constants
- `features/theme/` — `ThemePicker`, `SettingsPicker`, palette constants, theme runtime utils
- `hooks/` — shared animation/scroll hooks: `useRevealOnScroll`, `useTypeHeadingsOnScroll`, `useGuidedFlow`, `useSnapScroll`, `useActiveSection`
- `shared/ui/` — cross-feature UI components (e.g. `CustomCursor`)
- `shared/utils/` — cross-feature utilities (e.g. `scrollRailMath`)

**Scroll system** — `ScrollProvider` (via `SiteShell` in `layout.tsx`) initialises GSAP ScrollSmoother and exposes a React context with `scrollTo`, `subscribe`, `resize`, and `getScrollValues`. Components that need to programmatically scroll call `useScroll()` to get the controller. Respects `prefers-reduced-motion`. Fixed UI elements (Nav, ScrollRail, ThemePicker) are rendered as `fixedChildren` outside `#smooth-content` to avoid `position: fixed` breaking inside ScrollSmoother's CSS transform.
**Active section tracking** — `useActiveSection` hook uses `IntersectionObserver` on section elements and updates the URL hash via `window.history.replaceState` (no router push, so no full re-render).

**Theme system** — `ThemePicker` (fixed bottom-right) writes CSS custom properties directly to `document.documentElement` and persists scheme + dark/light mode to `localStorage`. Themes (Void, Blood, Toxic, Abyss, Static, Rust) only change accent colors; background/text colors swap between two fixed dark/light palettes.

**CSS structure** — `globals.css` is a thin index: it pulls in Tailwind, the text-glitch `@plugin`, the design tokens (`@theme` / `:root`), and then `@import`s domain partials from `src/app/styles/` (`base`, `utilities`, `scroll-rail`, `nav`, `settings`, `light-mode`, `home`, `contact`, `about`, `timeline`, `game-2048`). Add new component styles to the matching partial — keep `globals.css` to imports + tokens only. Import order is intentional (`base`/`utilities` first, `light-mode` overrides after the things they recolour). Classes are global (no CSS Modules) because JS toggles body/html classes and theme runtime writes vars on the root.

**CSS design tokens** — all colors and fonts are CSS variables defined in `globals.css`:
- `--color-accent`, `--color-accent-bright`, `--color-accent-dim`, `--color-outline`
- `--color-base`, `--color-surface`, `--color-surface-2`, `--color-fg`, `--color-muted`
- `--font-heading` (IM Fell English), `--font-pixel` (Silkscreen), `--font-mono` (Share Tech Mono), `--font-body` (Crimson Text)
- `--radius` — single shared corner radius for every frame/button site-wide

**Tailwind plugin** — `src/app/plugins/text-glitch-plugin.ts` is a local Tailwind CSS v4 plugin (imported via `@plugin` in `globals.css`) that generates a `@keyframes glitch` animation and utility classes: `.text-glitch`, `.hover-text-glitch`, `.text-glitch-soft`, `.text-glitch-balanced`, `.text-glitch-strong`. Tuned via CSS variables `--tg-rgb-r/g/b`, `--tg-rgb-blur`, `--tg-rgb-duration`.

**Deployment** — static export goes to `out/`. Set `SITE_BASE_PATH=hollow-room` at build time to enable GitHub Pages subpath deployment (`/hollow-room/`). Without it, the site deploys at the root. App version is injected from `package.json` into `NEXT_PUBLIC_APP_VERSION`.

## Conventions
- TypeScript everywhere; `@/` alias maps to `src/`
- Components in `PascalCase.tsx`, utilities/hooks in `camelCase.ts`
- Tailwind for layout/spacing; custom CSS classes for retro effects (scanlines, grunge, pixel borders)
- Keep components small — one per file
- No server-side features (`output: 'export'` is set in `next.config.ts`)
- Fonts are loaded via `next/font/google` in `src/assets/fonts.ts` and applied as CSS variable classes on `<html>` in `layout.tsx`
- Test files mirror `src/` under `__tests__/` (e.g. `__tests__/components/Nav.test.tsx`)
