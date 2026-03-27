# Changelog

All notable changes to this project will be documented in this file.

The format is inspired by Keep a Changelog and follows semantic versioning where practical.

## [Unreleased]

### Added
- Placeholder section for upcoming changes before the next tagged release.

## [0.1.4] - 2026-03-27

### Changed
- Placeholder avatar now uses a static `next/image` import instead of a hardcoded public path string.
- Documented different build behavior for Vercel root deploys and GitHub Pages subpath deploys.

### Fixed
- Prevented `NOT_FOUND` deployment issues caused by forcing a production `basePath` on all hosts.
- Updated image handling for the avatar so deploys are more robust across hosting targets.
- GitHub Pages workflow now builds with `SITE_BASE_PATH=hollow-room`.

### Added
- Initial `CHANGELOG.md` for tracking project changes across releases.

## [0.1.3] - 2026-03-27

### Added
- About section for the homepage.
- Scroll rail progress indicator.
- Locomotive Scroll based navigation and scroll effects.

### Changed
- Refined hero presentation, navbar styling, reveal animations, spacing, avatar treatment, glow motion, and theme picker behavior.

### Fixed
- Lint and test typing issues.
- Removed the earlier `react-scroll-parallax` integration in favor of the new scroll setup.

## [0.1.2] - 2026-03-26

### Added
- Animated glitch title on the home page.
- Local Tailwind v4 glitch plugin support.

### Changed
- Replaced the earlier custom glitch styling approach with the new glitch component and plugin-based implementation.

### Fixed
- Updated the JSX compiler setting for better React compatibility.
- Replaced a broken `tailwindcss-text-glitch` npm dependency with a local plugin implementation.

## [0.1.1] - 2026-03-26

### Changed
- Renamed the project from `goblikm` to `hollow-room`.
- Updated the README and project naming to match the new repository identity.

### Fixed
- Adjusted deployment workflow behavior and modernized the GitHub Actions Node.js setup.
- Corrected project title capitalization.

## [0.1.0] - 2026-03-26

### Added
- Initial tagged release of the `hollow-room` project.
- GitHub Pages deployment workflow triggered by version tags.
