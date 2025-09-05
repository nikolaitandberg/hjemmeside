# Personlig hjemmeside/e-portefølje

En minimalistisk e-portefølje laget med Next.js for å vise frem min utdanning, erfaring og mine prosjekter.

## Teknologier

- Next.js 15
- NextAuth.js
- TypeScript
- Tailwind CSS
- Prismadb


## Utviklingsworkflow med Docker Compose

For en optimal utviklingsopplevelse med hot-reloading, bruk `docker-compose.dev.yml`:

1. Start utviklingsmiljøet:
   ```bash
   docker compose -f docker-compose.dev.yml up
   ```
   Dette starter Next.js i utviklingsmodus med hot-reloading. Endringer i kildekoden reflekteres umiddelbart.

2. Åpne [http://localhost:3000](http://localhost:3000) i nettleseren din.

3. For å stoppe miljøet, trykk `ctrl+c` i terminalen eller bruk:
   ```bash
   docker compose -f docker-compose.dev.yml down
   ```

## Lisens

MIT, sjekk LICENSE.md-filen for mer informasjon
