import Image from "next/image";
import Navigation from "./components/Navigation";
import Timeline from "./components/timeline";
import Projects from "./components/projects";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="mx-auto w-11/12 md:w-5/6 lg:w-4/6 mt-8 sm:mt-12 md:mt-16">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Hei! Jeg heter Nikolai
        </h1>
        <p className="my-4">
          Takk for at du sjekker innom hjemmesiden min, ta en titt nedenfor for
          å se hva jeg holder på med for tiden. Ønsker du å ta kontakt finner du
          min e-post og linkedin øverst på siden, ellers kan du sjekke ut noen
          av prosjektene mine på github.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-24">
          <section className="col-span-1 flex flex-col items-center md:items-start">
            <Image
              src="/images/diggn5998-min.jpg"
              alt="Pressefoto av Nikolai Tandberg fra brystet og opp, blå genser, rødt nøkkel-bånd rundt halsen"
              width={416.7}
              height={278.8}
              className="max-w-full shadow-lg rounded-lg"
            />
            <p className="text-xs mt-2">
              foto:{" "}
              <a
                href="https://foto.samfundet.no"
                className="transition-colors duration-300 ease-in-out hover:text-secondary"
              >
                foto.samfundet.no
              </a>
            </p>
            <ul className="mt-6 md:mt-12 self-start">
              <li>Navn: Nikolai Tandberg</li>
              <li>Fødselsdato: 21.12.04</li>
              <li>Sted: Trondheim</li>
            </ul>
          </section>

          <section className="col-span-1 md:col-span-2 mt-8 md:mt-0">
            <Timeline />
          </section>
        </div>
        <div className="w-full mt-16">
          <Projects />
        </div>
      </main>
      <footer className="mt-12 pb-6 text-center text-sm text-foreground/70">
        © {new Date().getFullYear()} Nikolai Tandberg
      </footer>
    </div>
  );
}
