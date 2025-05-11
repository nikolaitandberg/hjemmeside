import Image from "next/image";
import Timeline from "./components/timeline";
import { timelineItems } from "./data/timelineData";

export default function Home() {
  return (
    <div className="min-h-screen mx-auto">
      <header className="flex h-10 justify-around mt-4">
        <a href="https://github.com/nikolaitandberg">github</a>
        <a href="mailto:nikolai.tandbe@gmail.com">nikolai.tandbe@gmail.com</a>
        <a href="https://linkedin.com/in/nikolaitandberg">linkedin</a>
      </header>
      <main className="mx-auto mt-24 w-4/6">
        <h1 className="text-4xl font-bold">Hei! Jeg heter Nikolai</h1>
        <p className="my-4">Takk for at du sjekker innom hjemmesiden min, ta en titt nedenfor for å se hva jeg holder på meg for tiden. <br /> Hvis du vil komme i kontakt finner du meg gjennom en av lenkene øverst.</p>
        <div className="grid grid-cols-2 gap-2 mt-12">
          <section className="">
            <Image
              src="/images/diggn5998-min.jpg"
              alt="Pressefoto av Nikolai Tandberg fra brystet og opp, blå genser, rødt nøkkel-bånd rundt halsen"
              width={200}
              height={300}
            />
            <p className="text-xs mt-2">
              foto: <a href="https://foto.samfundet.no">foto.samfundet.no</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Min tidslinje</h2>
            <Timeline items={timelineItems} />
          </section>
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
