## [0.1.8] - 2026-03-27

### 🐛 Bug Fixes

- Address Copilot review — cursor, shim boundary, hover flicker
- Improve custom cursor behavior for touch devices and precise hover support
- Correct syntax in media query for custom cursor support

### 🚜 Refactor

- Migrate to GSAP ScrollSmoother, add custom cursor, clean up codebase

### 📚 Documentation

- Update CHANGELOG for GSAP migration and code quality changes
- Fill in full changelog history for all versions 0.1.0–0.1.7
- Update CLAUDE.md with release workflow and GSAP scroll system

### ⚙️ Miscellaneous Tasks

- Add git-cliff for automated changelog generation
## [0.1.7] - 2026-03-27

### ⚙️ Miscellaneous Tasks

- Upgrade GitHub Actions to Node.js 24 compatible versions
- Replace upload-pages-artifact with manual tar + upload-artifact@v6 for Node 24
## [0.1.6] - 2026-03-27

### 🐛 Bug Fixes

- Read app version from package.json directly instead of npm_package_version
- Add fallback "0.0.0" for NEXT_PUBLIC_APP_VERSION
## [0.1.5] - 2026-03-27

### 🚀 Features

- Add Vercel deployment workflow and configuration

### 🐛 Bug Fixes

- Restore asset module typings for CI

### 🚜 Refactor

- Move avatar to app asset import

### 🧪 Testing

- Mock matchMedia in Jest setup

### ⚙️ Miscellaneous Tasks

- Add CI workflow for PRs targeting main and dev
## [0.1.3] - 2026-03-27

### 🚀 Features

- Add ParallaxProviderWrapper component and integrate it into layout

### 🐛 Bug Fixes

- Update version to 0.1.2 in package.json and package-lock.json
## [0.1.2] - 2026-03-26

### 🚀 Features

- Add GlitchText component with auto-fire and shake animation

### 🐛 Bug Fixes

- Replace broken tailwindcss-text-glitch npm plugin with local Tailwind v4 plugin
- Update JSX setting to use react-jsx for improved compatibility

### 🚜 Refactor

- Replace custom glitch CSS with tailwindcss-text-glitch plugin

### 📚 Documentation

- Add plugins/ directory to CLAUDE.md structure
## [0.1.1] - 2026-03-26

### 🚀 Features

- Rename project from goblikm to hollow-room

### 🐛 Bug Fixes

- Trigger deploy on main push, update node to 22, suppress Node20 warning
- Revert trigger to tags, keep Node24 warning fix

### 📚 Documentation

- Update README for repository rename to hollow-room

### ⚙️ Miscellaneous Tasks

- Realease v0.1.1
## [0.1.0] - 2026-03-26

### 🚀 Features

- Add sticky Nav component with retro styling and mobile hamburger
- Overhaul base theme to horror/VHS/low-poly aesthetic
- Restyle Nav to horror/VHS aesthetic with violet palette
- Restyle all pages with horror/VHS aesthetic
- Switch hero title to Silkscreen font and rework nav active/hover styles
- Use Silkscreen on page headings and remove mobile nav active border
- Change nav logo font from IM Fell English to Silkscreen
- Convert to single-page scroll layout with IntersectionObserver nav
- Add gradient fade overlay on home section and explicit bg for content sections
- Add ThemePicker component with 6 color schemes and localStorage persistence
- Add dark/light mode toggle to ThemePicker with parchment light theme
- Align project structure with Next.js 16 create-next-app convention
- Publish to GitHub Pages
- Add placeholder cards for blog, projects, and games sections

### 🐛 Bug Fixes

- Remove incorrect ARIA menu roles from Nav mobile dropdown
- Chroma effect on hover only, merge vhs-border shadow into nav inline style
- Uppercase nav logo, larger font, translate placeholder copy to English
- Correct threshold type in useActiveSection and add hook tests
- Keep ThemePicker button clickable during glitch animation
- Replace glitch with chroma hover on theme picker button
- Make theme picker hover effect visible with glow and drop-shadow
- Update footer text and adjust GameCard description color

### 💼 Other

- Resolve conflicts between one-page-layout and theme-picker

### 🚜 Refactor

- Fix Clean Code violations in Nav, ThemePicker, and useActiveSection

### 📚 Documentation

- Add README with project overview, setup, and deployment info

### ⚙️ Miscellaneous Tasks

- Initial commit
- Scaffold project
- Deploy only on tag push (v*.*.*)

### ◀️ Revert

- Theme picker hover back to simple border change
