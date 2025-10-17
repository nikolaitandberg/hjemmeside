# Personlig hjemmeside/e-portefølje

En minimalistisk e-portefølje laget med Next.js for å vise frem min utdanning, erfaring og mine prosjekter. Applikasjonen har et adminpanel for enkel administrering av innhold.

## 🚀 Teknologier

### Frontend

- **Next.js 15** - React-rammeverk med Turbopack
- **React 19** - Brukergrensesnitt
- **TypeScript** - Type-sikkerhet
- **Tailwind CSS 4** - Styling
- **@hello-pangea/dnd** - Drag-and-drop funksjonalitet

### Backend & Database

- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **NextAuth.js** - Autentisering
- **bcryptjs** - Passord-hashing

### Verktøy

- **ESLint** - Kodekvalitet
- **Prettier** - Kodeformatering
- **Docker** - Containerisering

## 📋 Krav før du kjører applikasjonen

- **Node.js** (versjon 20 eller nyere)
- **npm** eller **yarn**
- **PostgreSQL** database (kan kjøres med Docker)
- **Docker** og **Docker Compose** (valgfritt, for database)

## ⚙️ Oppsett

### 1. Klon prosjektet

```bash
git clone https://github.com/nikolaitandberg/hjemmeside.git
cd hjemmeside
```

### 2. Installer avhengigheter

```bash
npm install
```

### 3. Sett opp miljøvariabler

Opprett en `.env`-fil i rotmappen med følgende innhold:

```env
# Database
DATABASE_URL="postgresql://admin:admin@localhost:5432/hjemmeside_dev?schema=public"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generer-en-sikker-secret>
```

For å generere en sikker `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 4. Start PostgreSQL database

**Med Docker compose:**

lag en docker-compose.yml, kan se slik ut:

```yaml
services:
  # PostgreSQL
  postgres:
    image: postgres
    container_name: postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      PGPASSWORD: admin
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: hjemmeside_dev
    networks:
      - postgres-network
  # Adminer
  adminer:
    image: adminer
    container_name: adminer
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      ADMINER_DEFAULT_SERVER: postgres
    networks:
      - postgres-network

networks:
  postgres-network:
    driver: bridge

volumes:
  postgres-data:
    driver: local
```

Deretter kjører du denne kommandoen i samme mappe som compose-filen ligger i:

```bash
docker-compose up -d postgres
```

**Eller kjør din egen PostgreSQL-instans** og oppdater `DATABASE_URL` i `.env`

### 5. Kjør database-migrasjoner

```bash
npx prisma migrate dev
```

Dette oppretter databasetabellene for prosjekter, tidslinjer og brukere.

### 6. Opprett en admin-bruker

Du må legge til en bruker direkte i databasen. Først, hash passordet ditt:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('ditt-passord', 10));"
```

Deretter, legg til brukeren i databasen:

```sql
INSERT INTO "User" (id, email, password, name, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'din@epost.no', '<hashet-passord>', 'Ditt Navn', NOW(), NOW());
```

## 🏃 Kom i gang

### Utviklingsmodus

```bash
npm run dev
```

Applikasjonen kjører nå på [http://localhost:3000](http://localhost:3000)

### Produksjonsbygg

```bash
npm run build
npm start
```

### Andre nyttige kommandoer

```bash
# Linting
npm run lint

# Formatering med Prettier
npm run prettier

# Åpne Prisma Studio (database GUI)
npx prisma studio
```

## 📁 Prosjektstruktur

```
├── src/
│   ├── app/              # Next.js app router
│   │   ├── admin/        # Admin-panel
│   │   ├── api/          # API-ruter
│   │   └── components/   # React-komponenter
│   ├── types/            # TypeScript type-definisjoner
│   └── utils/            # Hjelpefunksjoner
├── prisma/
│   ├── schema.prisma     # Database-skjema
│   └── migrations/       # Database-migrasjoner
├── public/               # Statiske filer
└── docker-compose.yml    # Docker-konfigurasjon
```

## 🔐 Admin-panel

Adminpanelet er tilgjengelig på `/admin` og krever innlogging.

**Funksjoner:**

- ✏️ Opprett, rediger og slett prosjekter
- 📅 Opprett, rediger og slett tidslinjeoppføringer
- 🔄 Drag-and-drop for å endre rekkefølge
- 📦 Arkiver elementer uten å slette dem
- 🔒 Sikret med NextAuth.js

## 🎨 Funksjoner

- 📱 Responsiv design
- 🌓 Minimalistisk og profesjonell
- ⚡ Rask lasting med Next.js 15 og Turbopack
- 🔒 Sikker autentisering
- 📊 Dynamisk innhold fra database
- 🎯 Type-sikker med TypeScript

## 🛠️ Utvikling

### Database-endringer

Når du gjør endringer i `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name beskrivelse_av_endring
npx prisma generate
```

### Kode-kvalitet

Prosjektet bruker ESLint og Prettier for å sikre konsistent kodekvalitet:

```bash
npm run lint       # Kjør linting
npm run prettier   # Formater kode
```

## 📝 Lisens

MIT - se [LICENSE](LICENSE) for mer informasjon
