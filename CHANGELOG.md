# Changelog

All notable changes to this project will be documented in this file.

The format is inspired by Keep a Changelog and follows semantic versioning where practical.

## [Unreleased]

### Added
- Custom cursor with dot + lerp ring, hover states on interactive elements, touch device detection.
- `src/constants/navigation.ts` as single source of truth for `NAV_LINKS` and `SECTION_IDS`.
- `SiteShell` component to render fixed UI (Nav, ScrollRail, ThemePicker) outside ScrollSmoother's transformed content, fixing `position: fixed` elements drifting with the page.
- `ScrollProvider` component (GSAP-backed) with `useScroll` hook.

### Changed
- Replaced `locomotive-scroll` with `gsap` (ScrollSmoother + ScrollTrigger) for smooth scrolling.
- Renamed `LocomotiveScrollProvider` → `ScrollProvider`, `useLocomotiveScroll` → `useScroll`; old file kept as re-export shim.
- `cursor: none` now gated behind `.cursor-custom` class toggled by `CustomCursor` on mount — native cursor stays visible before JS loads or on hydration failure.
- Removed `duration` option from `scrollTo` API — `ScrollSmoother.scrollTo` only accepts a boolean animate flag, so exposing duration was misleading.
- `NAV_HEIGHT` extracted as named constant replacing magic number `-56` in Nav scroll offset.

### Fixed
- `CustomCursor` memory leak: `useEffect([visible])` changed to `[]` with `visibleRef`, preventing repeated event listener registration on visibility state change.
- Hover flicker on cursor ring: replaced `mouseover`/`mouseout` with `pointerover`/`pointerout` and `relatedTarget` check to avoid state changes when moving between child elements inside the same link or button.
- `LocomotiveScrollProvider` shim missing `"use client"` directive, which could break Next.js client/server boundary detection.
- ScrollRail progress calculation now uses `#smooth-content` height instead of `documentElement.scrollHeight`, which was broken by ScrollSmoother's `overflow: hidden`.
- `lang="cs"` corrected to `lang="en"` in layout.
- Typo `srqaite` → `site` in blog post placeholder text.

## [0.1.7] - 2026-03-27

### Changed
- Upgraded GitHub Actions to Node.js 24 compatible versions.
- Replaced `upload-pages-artifact` with manual tar + `upload-artifact@v6` for Node 24 compatibility.
- Updated `CLAUDE.md` with current project architecture and conventions.

## [0.1.6] - 2026-03-27

### Changed
- Unified `ci.yml` into `deploy.yml`, removing the separate PR-based CI trigger.
- Added `npm run lint` step to the lint-build-test job in CI.

### Fixed
- App version display in footer now reads from `package.json` directly instead of `npm_package_version` env variable, with `"0.0.0"` fallback.
- `next.config.ts` updated to correctly inject `NEXT_PUBLIC_APP_VERSION` at build time.

## [0.1.5] - 2026-03-27

### Added
- App version display in the page footer, injected from `package.json` via `NEXT_PUBLIC_APP_VERSION`.
- Vercel deployment workflow and configuration.
- CI workflow for PRs targeting `main`.
- Branch protection rules setup.

### Fixed
- Restored asset module typings (`src/types/assets.d.ts`) that were missing in CI.
- Mocked `matchMedia` in Jest setup to prevent test failures in jsdom.
- Avatar moved to a static `next/image` import from the app assets directory.

## [0.1.4] - 2026-03-27

### Fixed
- Prevented `NOT_FOUND` deployment issues caused by forcing a production `basePath` on all hosts.
- Updated image handling for the avatar so deploys are more robust across hosting targets.
- GitHub Pages workflow now builds with `SITE_BASE_PATH=hollow-room`.

### Added
- Initial `CHANGELOG.md` for tracking project changes across releases.
- Documented different build behavior for Vercel root deploys and GitHub Pages subpath deploys.

## [0.1.3] - 2026-03-27

### Added
- About section with avatar, bio text, and reveal animation.
- Scroll rail progress indicator on the right side.
- Locomotive Scroll (Lenis-based) smooth scrolling with `LocomotiveScrollProvider` and `useRevealOnScroll` hook.
- `useActiveSection` hook using `IntersectionObserver` for hash-based active nav tracking.

### Changed
- Refined hero presentation, glow motion, spacing, and section reveal animations.
- Updated avatar treatment and theme picker behavior.
- Replaced `react-scroll-parallax` with Locomotive Scroll.

### Fixed
- Lint and TypeScript typing issues across components and hooks.

## [0.1.2] - 2026-03-26

### Added
- Animated glitch title on the home page with auto-fire and shake animation.
- Local Tailwind v4 glitch plugin (`src/app/plugins/text-glitch-plugin.ts`) replacing a broken npm dependency.
- Utility classes: `.text-glitch`, `.hover-text-glitch`, `.text-glitch-soft`, `.text-glitch-balanced`, `.text-glitch-strong`.

### Fixed
- Updated JSX compiler setting to `react-jsx` for improved compatibility.
- Replaced broken `tailwindcss-text-glitch` npm dependency with a local plugin implementation.

## [0.1.1] - 2026-03-26

### Added
- README with project overview, setup instructions, and deployment info.
- Dark/light mode toggle in ThemePicker with a parchment-toned light theme.
- Placeholder cards for blog posts, projects, and games sections.
- GitHub Pages deployment workflow triggered by version tags.

### Changed
- Renamed project from `goblikm` to `hollow-room`.
- Converted to single-page scroll layout with hash navigation.
- Aligned project structure with Next.js 16 `create-next-app` conventions.
- Nav logo switched to Silkscreen pixel font; hero title reworked.

### Fixed
- Clean Code violations in `Nav`, `ThemePicker`, and `useActiveSection`.
- Removed incorrect ARIA menu roles from Nav mobile dropdown.
- Corrected `useActiveSection` threshold type; added hook tests.
- ThemePicker hover effect made visible with glow and drop-shadow.

## [0.1.0] - 2026-03-26

### Added
- Initial tagged release of the `hollow-room` project.
- Horror/VHS aesthetic base theme with violet palette, scanline overlay, and grain animation.
- Sticky Nav component with retro styling, mobile hamburger menu, and active section highlighting.
- ThemePicker component with 6 color schemes (Void, Blood, Toxic, Abyss, Static, Rust) and localStorage persistence.
- CSS design tokens for colors and typography in `globals.css`.
- GitHub Pages deployment workflow.
