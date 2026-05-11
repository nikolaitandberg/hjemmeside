# CLAUDE.md

## Stack

Next.js 16 + React 19 + TypeScript, Tailwind CSS v4, Prisma + SQLite, NextAuth v4. See [package.json](package.json) and [prisma/schema.prisma](prisma/schema.prisma).

## Before committing

Always run in order:

```sh
npx prettier --write .
npm run lint        # eslint.config.mjs
npm run build       # must pass with zero errors
```

## Commits

Short conventional commit messages: `type: description` (e.g. `fix: dropdown bottom border clipped by overflow-hidden`).
Types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`.

## Design system

The site is themed as an **IBM PC EGA / DOS terminal** — full read of the system in [DESIGN.md](DESIGN.md). Key rules:

- Palette is the 16-color EGA set. Tokens live in [src/app/globals.css](src/app/globals.css) (`--background`, `--foreground`, `--accent-yellow`, `--accent-cyan`, `--window`, etc.). Do not introduce colors outside this palette.
- Fonts are `VT323` (everything) and `IBM Plex Mono` (fine print fallback). No system sans-serif.
- `--radius: 0` everywhere. Sharp corners only.
- shadcn components are restyled globally via `[data-slot="..."]` selectors in `globals.css` — they look DOS automatically once installed.
- CRT primitives in [src/app/components/crt/](src/app/components/crt/): `TerminalWindow`, `Prompt`, `MenuBar`, `StatusBar`, `BootSequence`, `CRTOverlay`. Reuse these rather than re-implementing chrome.
- `ThemeProvider` toggles `html.crt` ↔ `html.accessible`. In `accessible` mode the global CRT overlay + glow are disabled but palette and bevels stay. Auto-applied for `prefers-reduced-motion: reduce`.

## Best practices

- **Next.js**: use Server Components by default; add `"use client"` only when needed (state, effects, event handlers).
- **Tailwind v4**: utility-first, no arbitrary values unless necessary. Responsive via `sm:`/`md:`/`lg:` breakpoints.
- **shadcn**: add components via `npx shadcn@latest add <name>`. After adding, verify the global overrides in `globals.css` cover the new component — if not, extend them rather than passing per-instance classes.
- **Prisma**: never use raw SQL when the Prisma client covers it. Schema changes → `npx prisma migrate dev --name <name>`. Migrations run automatically at container startup via `CMD` in the Dockerfile — no manual step needed after deploy.
- **NextAuth**: keep auth logic in `src/lib/auth.ts`; never expose session secrets.
- **TypeScript**: no `any`; use strict types.
- Keep components small and co-located under [src/app/components/](src/app/components/).

## Docker

The production image copies the full `node_modules` from the builder stage (not just the Next.js standalone subset). This is intentional: the Prisma 6.x CLI needs a deep transitive dependency tree (`@prisma/config` → `effect` → `fast-check` → …) that the standalone output omits. Cherry-picking packages breaks on every Prisma upgrade, so we accept the larger image size in exchange for a maintenance-free setup. Do not "optimise" this back to selective copies without verifying the full Prisma CLI dependency tree still works.
