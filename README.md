# Personlig hjemmeside/e-portefølje

En minimalistisk e-portefølje laget med Next.js for å vise frem min utdanning, erfaring og mine prosjekter.

## Teknologier

- Next.js 15
- TypeScript
- Tailwind CSS

## Kom i gang

1. Klon repoet
2. Installer avhengigheter:
   ```bash
   npm install
   ```
3. Kjør utviklingsserveren:
   ```bash
   npm run dev
   ```
4. Åpne [http://localhost:3000](http://localhost:3000) in nettleseren din

## Bygge og kjøre containeren

1. Bygg docker imaget

```bash
docker build -t hjemmeside:latest .
```

2. Kjør docker containeren

```bash
docker run -p 3000:3000 hjemmeside:latest
```

3. Åpne nettleseren og gå til:

```bash
http://localhost:3000
```

4. Stopp containeren

For å stoppe containeren trykk `ctrl+c` i terminalen der den kjører, eventuelt kan du liste opp containeren som kjører og stoppe rikti container med:

```bash
docker ps
docker stop <container-id>
```

5. Valgfritt: Kjør i 'detached' modus

```bash
docker run -d -p 3000:3000 hjemmeside:latest
```

du kan stoppe den senere med `docker stop` kommandoen.

## Lisens

MIT, sjekk LICENSE.md-filen for mer informasjon
