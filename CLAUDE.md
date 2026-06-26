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

The home page is a **single-page app** — all sections (home, about, games, projects, blog) live in `src/app/page.tsx` as `<section id="...">` elements with in-page hash navigation; section data lives in `src/features/home/data/` (one file per section). Two standalone sub-routes exist: `src/app/about/` (full about page) and `src/app/2048/` (embedded game).

**Directory structure** — code is organized by domain under `src/features/`. Each feature groups its parts into subfolders (`components/`, `hooks/`, `data/`, `constants/`, `utils/`, `context/`, `logic/`). Component-local styles are co-located CSS Modules (`Component.module.css`); see the CSS structure section below.
- `features/audio/` — `components/` (`AutoPlayMusic`), `context/` (`AudioContext`)
- `features/home/` — `components/` (cards: `BlogPostCard`, `GameCard`, `ProjectCard`), `data/` (section content)
- `features/about/` — `components/` (`Timeline`, `HorizontalTimeline`, `SkillGrid`), `data/`, `hooks/` (`useHorizontalTimelineScroll`)
- `features/2048/` — `components/` (`Board`, `Game2048`, `SolverGuide` + shared `Game2048.module.css`), `logic/` (`engine`, `solvers`), `hooks/` (`useGame2048`)
- `features/navigation/` — `components/` (`Nav`, `ScrollRail`), `constants/` (section IDs)
- `features/theme/` — `components/` (`SettingsPicker`), `constants/` (palette), `utils/` (theme runtime)
- `hooks/` — *app-wide* animation/scroll hooks: `useRevealOnScroll`, `useTypeHeadingsOnScroll`, `useGuidedFlow`, `useSnapScroll`, `useActiveSection` (feature-specific hooks live under the feature)
- `shared/ui/` — cross-feature UI components (e.g. `CustomCursor`, `Footer`, `ScrollArrow`)
- `shared/utils/` — cross-feature utilities (e.g. `scrollRailMath`)

**Scroll system** — `ScrollProvider` (via `SiteShell` in `layout.tsx`) initialises GSAP ScrollSmoother and exposes a React context with `scrollTo`, `subscribe`, `resize`, and `getScrollValues`. Components that need to programmatically scroll call `useScroll()` to get the controller. Respects `prefers-reduced-motion`. Fixed UI elements (Nav, ScrollRail, SettingsPicker) are rendered as `fixedChildren` outside `#smooth-content` to avoid `position: fixed` breaking inside ScrollSmoother's CSS transform.
**Active section tracking** — `useActiveSection` hook uses `IntersectionObserver` on section elements and updates the URL hash via `window.history.replaceState` (no router push, so no full re-render).

**Theme system** — `ThemePicker` (fixed bottom-right) writes CSS custom properties directly to `document.documentElement` and persists scheme + dark/light mode to `localStorage`. Themes (Void, Blood, Toxic, Abyss, Static, Rust) only change accent colors; background/text colors swap between two fixed dark/light palettes.

**CSS structure** — styling uses **CSS Modules** (`Component.module.css`, co-located with the component, classes named in `camelCase` and referenced as `styles.fooBar`). Component-local presentational styles live in modules; a thin **global layer** holds everything that must stay global.

`globals.css` is a thin index: it pulls in Tailwind, the text-glitch `@plugin`, the design tokens (`@theme` / `:root`), and then `@import`s the remaining global partials from `src/app/styles/` (`base`, `utilities`, `nav`, `light-mode`, `home`, `about`). Import order is intentional (`base`/`utilities` first, `light-mode` overrides after the things they recolour).

What stays **global** (hybrid model):
- **Design tokens / `@theme`** and the text-glitch plugin utilities (`.text-glitch*`, `.hover-text-glitch`).
- **Shared utilities** used across many components: `.vhs-border`, `.pixel-border`.
- **Shared link family** used by both Nav and ScrollRail: `.nav-link`, `.nav-link-active`, `.nav-mobile-link*` (in `nav.css`), plus `.ui-desktop-nav-row` and `.subpage-back`.
- **Any class referenced from a JS string** (hashing would break the selector): the `.section*` family, `.section-reveal`, `.section-intro`, `.hero-subtitle`, `.page-content`, `.about-page`/`.about-snap-layout`, `.scroll-arrow-animated`, the guided-flow play button (`.hero-play-*`, `.flow-continue-anchor`, `.is-hidden`), and the JS-toggled state classes `.light-mode`, `.desktop-nav-enabled`, `.guided-scroll-locked`, `.guided-flow-pending`, `.typing-heading`, `.tl-dot--active`, `.cursor-custom`.
- **Keyframes** referenced by both global and module classes (e.g. `hero-shell-flicker`, `g2048-spawn`) and base element/cursor rules (`base.css`).

Rules of thumb when adding styles: a new component gets a co-located `*.module.css`. If a class is queried/toggled by JS via a string, or shared across unrelated components, put it in the matching global partial instead. State/light-mode overrides for a module class are co-located in the module using a `:global()` wrapper, e.g. `:global(body.light-mode) .heroTitle { … }`.

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
- Tailwind for layout/spacing (kept inline on elements); component-local visuals in co-located CSS Modules (`camelCase` classes); a slim global layer for shared/JS-driven classes (see CSS structure above)
- Keep components small — one per file
- No server-side features (`output: 'export'` is set in `next.config.ts`)
- Fonts are loaded via `next/font/google` in `src/assets/fonts.ts` and applied as CSS variable classes on `<html>` in `layout.tsx`
- Test files mirror `src/` under `__tests__/` (e.g. `__tests__/components/Nav.test.tsx`)
