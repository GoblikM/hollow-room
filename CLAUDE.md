# hollow-room

## Overview
Personal blog and portfolio website for a student developer. Features a light retro aesthetic (pixel fonts, grunge textures, modern layout), a blog section, project showcase, and embedded Godot web export games playable directly in the browser. Built as a Next.js static export — no server required.

## Tech stack
- **Framework:** Next.js 16 (App Router, static export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom CSS for retro effects
- **Fonts:** Pixel/retro fonts (e.g. Press Start 2P, VT323 from Google Fonts)
- **Testing:** Jest + React Testing Library
- **Hosting:** TBD — GitHub Pages or Vercel (static export compatible with both)

## Directory structure
```
src/
  app/              # Next.js App Router pages
    layout.tsx      # Root layout (fonts, global styles)
    page.tsx        # Home / landing page
    globals.css     # Global CSS, retro theme variables
    blog/           # Blog listing + individual posts
    projects/       # Projects showcase
    games/          # Mini browser games (speed typing, etc.)
  components/       # Reusable UI components
public/             # Static assets
__tests__/          # Jest + React Testing Library tests
```

## Conventions
- TypeScript everywhere — no plain `.js` files in `src/`
- Components in `PascalCase.tsx`, utilities in `camelCase.ts`
- Tailwind for layout and spacing; custom CSS classes for retro-specific effects (scanlines, grunge, pixel borders)
- Keep components small and focused — one component per file
- Blog posts as MDX files in `src/app/blog/posts/` or as a data array — decide before adding first post
- Mini games live in `src/app/games/` as regular React components/pages — speed typing, snake, or whatever fits the retro vibe

## Testing
- Run tests: `npm test`
- Watch mode: `npm run test:watch`
- Test files go in `__tests__/` mirroring the `src/` structure (e.g. `__tests__/components/Header.test.tsx`)
- Focus on component rendering and basic interactions — no need for full e2e tests

## Notes
- Static export is configured via `output: 'export'` in `next.config.ts` — do not add server-side features (no `getServerSideProps`, no API routes) without removing this first
- Switching to a server deployment later is easy: just remove `output: 'export'` from config and redeploy
-Retro style guide: pixel fonts only for headings/accents, readable sans-serif for body text; dark background preferred; subtle scanline or noise texture overlay
