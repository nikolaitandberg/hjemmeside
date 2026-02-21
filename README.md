# hjemmeside

Personal e-portfolio with an admin panel. Next.js + SQLite (via Prisma), deployed with Docker.

## Local dev

```sh
npm install

# First run only — create the SQLite DB and tables
npx prisma migrate dev

# Create admin user
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword node scripts/create-admin.mjs

npm run dev   # → http://localhost:3000
```

`.env` (gitignored, already present locally):

```env
DATABASE_URL="file:./data/hjemmeside-dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<secret>
```

Prisma Studio: `npx prisma studio` → `http://localhost:5555`

Schema: [`prisma/schema.prisma`](prisma/schema.prisma)

---

## Docker dev

Builds the production image with source bind-mounted, plus Prisma Studio as a sidecar.

```sh
docker compose -f docker-compose.dev.yml up --build
```

See [`docker-compose.dev.yml`](docker-compose.dev.yml).

---

## Production

Deployed via GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) — trigger manually from the Actions tab.

The workflow SSHs into the server and runs:
```
git reset --hard origin/main → docker compose up --build -d → prisma migrate deploy
```

**Before the first deploy**, create `.env` on the server:

```env
DATABASE_URL="file:/app/data/hjemmeside.db"
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<secret>   # openssl rand -base64 32
```

**After the first deploy**, create the admin user:

```sh
docker compose exec -e ADMIN_EMAIL=you@example.com -e ADMIN_PASSWORD=yourpassword hjemmeside node scripts/create-admin.mjs
```

SQLite data persists in a named Docker volume (`sqlite_data`). See [`docker-compose.yml`](docker-compose.yml) and [`Dockerfile`](Dockerfile).

---

## Schema changes

```sh
npx prisma migrate dev --name describe_change
```

## License

[MIT](LICENSE)
