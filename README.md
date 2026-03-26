# hollow-room

> A personal blog, portfolio, and retro arcade — built with pixels and passion.

<!-- ![Build Status](https://github.com/GoblikM/hollow-room/actions/workflows/ci.yml/badge.svg) -->

---

## About

This is my corner of the internet — part blog, part portfolio, part pixel arcade. The whole thing runs as a **fully static site** (no server required), so it loads fast and deploys anywhere.

What's inside:
- **Blog** — thoughts, dev logs, and whatever else ends up here
- **Projects** — a showcase of things I've built
- **Games** — small Godot web exports playable right in the browser, no install needed

The aesthetic is deliberate: pixel fonts, grunge textures, dark backgrounds, scanline overlays. It's retro on purpose and modern under the hood.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS for retro effects |
| Fonts | Press Start 2P, VT323 (Google Fonts) |
| Testing | Jest + React Testing Library |
| Hosting | TBD — GitHub Pages or Vercel |

---

## Getting started

**Prerequisites:** Node.js 18+

```bash
# 1. Clone the repo
git clone https://github.com/GoblikM/hollow-room.git
cd hollow-room

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The dev server supports hot reload, so changes appear instantly.

---

## Running tests

```bash
# Run all tests once
npm test

# Watch mode — reruns on file changes
npm run test:watch
```

Tests live in `__tests__/` and mirror the `src/` structure. The focus is on component rendering and basic interactions — quick feedback, no fluff.

---

## Deployment

The site is a **static export** — `npm run build` generates a ready-to-serve `out/` directory with plain HTML, CSS, and JS files.

```bash
npm run build
# Output → out/
```

The `out/` directory can be dropped onto:
- **GitHub Pages** — push and go
- **Vercel** — connect the repo and it handles the rest

Both are fully compatible with static exports. The hosting choice is TBD — either works without any code changes.

> Note: this project uses `output: 'export'` in `next.config.ts`. There are no API routes or server-side features — everything is static.

---

## Contributing

Not a team project, but suggestions and bug reports are welcome. If you spot something broken or have an idea:

1. Open an issue to discuss it
2. Fork the repo, create a branch (`feature/your-idea`)
3. Submit a pull request

Keep it civil, keep it constructive. That's about it.

---

## License

MIT — see [LICENSE](LICENSE) for details.

> Note: LICENSE file not yet added. Coming soon.
