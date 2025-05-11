import Image from "next/image";
import Timeline from "./components/timeline";
import { timelineItems } from "./data/timelineData";

export default function Home() {
  return (
    <div className="min-h-screen mx-auto">
      <header className="flex h-10 justify-around mt-4">
        <a
          href="https://github.com/nikolaitandberg"
          className="transition-colors duration-300 ease-in-out hover:text-secondary "
        >
          github
        </a>
        <a
          href="mailto:nikolai.tandbe@gmail.com"
          className="transition-colors duration-300 ease-in-out hover:text-secondary "
        >
          nikolai.tandbe@gmail.com
        </a>
        <a
          href="https://linkedin.com/in/nikolaitandberg"
          className="transition-colors duration-300 ease-in-out hover:text-secondary "
        >
          linkedin
        </a>
      </header>
      <main className="mx-auto mt-24 w-4/6">
        <h1 className="text-4xl font-bold">Hei! Jeg heter Nikolai</h1>
        <p className="my-4">
          Takk for at du sjekker innom hjemmesiden min, ta en titt nedenfor for
          å se hva jeg holder på med for tiden. Ønsker du å ta kontakt finner du
          min e-post og linkedin øverst på siden, ellers kan du sjekke ut noen
          av prosjektene mine på github.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-24">
          <section className="col-span-1">
            <Image
              src="/images/diggn5998-min.jpg"
              alt="Pressefoto av Nikolai Tandberg fra brystet og opp, blå genser, rødt nøkkel-bånd rundt halsen"
              width={250}
              height={300}
            />
            <p className="text-xs mt-2">
              foto:{" "}
              <a
                href="https://foto.samfundet.no"
                className="transition-colors duration-300 ease-in-out hover:text-secondary "
              >
                foto.samfundet.no
              </a>
            </p>
            <ul className="mt-12">
              <li>Navn: Nikolai Tandberg</li>
              <li>Fødselsdato: 21.12.04</li>
              <li>E-post: nikolai.tandbe@gmail.com</li>
            </ul>
          </section>

          <section className="col-span-2">
            <h2 className="text-2xl font-bold">Min tidslinje</h2>
            <Timeline items={timelineItems} />
          </section>
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
