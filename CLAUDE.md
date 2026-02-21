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

## Best practices

- **Next.js**: use Server Components by default; add `"use client"` only when needed (state, effects, event handlers).
- **Tailwind v4**: utility-first, no arbitrary values unless necessary. Responsive via `sm:`/`md:`/`lg:` breakpoints.
- **Prisma**: never use raw SQL when the Prisma client covers it. Schema changes → `npx prisma migrate dev --name <name>`.
- **NextAuth**: keep auth logic in `src/lib/auth.ts`; never expose session secrets.
- **TypeScript**: no `any`; use strict types.
- Keep components small and co-located under [src/app/components/](src/app/components/).
