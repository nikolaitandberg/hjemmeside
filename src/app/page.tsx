import Image from "next/image";
import Navigation from "./components/Navigation";
import Timeline from "./components/timeline";
import Projects from "./components/projects";
import Prompt from "./components/crt/Prompt";
import TerminalWindow from "./components/crt/TerminalWindow";
import prisma from "@/utils/db";
import { parseJsonArray } from "@/utils/jsonArray";
import type { Project, TimelineItem } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rawProjects = await prisma.project.findMany({
    where: { archived: false },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  const projects: Project[] = rawProjects.map((p) => ({
    ...p,
    technologies: parseJsonArray(p.technologies),
  }));

  const rawTimelineItems = await prisma.timelineItem.findMany({
    where: { archived: false },
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });
  const timelineItems: TimelineItem[] = rawTimelineItems.map((t) => ({
    ...t,
    tags: parseJsonArray(t.tags),
  }));

  return (
    <div className="min-h-screen pb-12">
      <Navigation />

      <main className="mx-auto w-11/12 md:w-5/6 lg:w-4/6 pt-4 pb-16 space-y-10">
        {/* ===== header: whoami + about (left) / profile photo (right) ===== */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* text + timeline — left 2 cols */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <Prompt path="C:\NIKOLAI" command="whoami" />
              <h1 className="mt-2 text-4xl sm:text-5xl text-accent-yellow crt-glow-strong">
                &gt; Nikolai Tandberg
              </h1>
            </div>

            <div>
              <Prompt path="C:\NIKOLAI" command="type ABOUT.TXT" />
              <pre className="mt-2 whitespace-pre-wrap font-[var(--font-vt323)] text-foreground crt-glow leading-snug">
                {`Hei! Jeg heter Nikolai.

Takk for at du sjekker innom hjemmesiden min. Ta en titt
nedenfor for å se hva jeg holder på med for tiden.

Ønsker du å ta kontakt finner du min e-post og LinkedIn
i toppmenyen (Goto >), ellers kan du sjekke ut noen av
prosjektene mine på GitHub.`}
              </pre>
            </div>

            <div>
              <Prompt path="C:\NIKOLAI" command="dir TIMELINE\ /S" />
              <TerminalWindow
                title="TIMELINE.SYS"
                buttons={["min", "max", "close"]}
                variant="screen"
              >
                <Timeline items={timelineItems} />
              </TerminalWindow>
            </div>
          </div>

          {/* photo — right 1 col */}
          <div className="col-span-1 space-y-3">
            <Prompt path="C:\NIKOLAI" command="dir PROFILE\" />
            <TerminalWindow
              title="PROFILE.BMP"
              buttons={["min", "max", "close"]}
              bodyClassName="p-0"
              footer={
                <span className="text-xs">
                  FOTO:{" "}
                  <a href="https://foto.samfundet.no" className="underline">
                    foto.samfundet.no
                  </a>
                </span>
              }
            >
              <Image
                src="/images/diggn5998-min.jpg"
                alt="Pressefoto av Nikolai Tandberg fra brystet og opp, blå genser, rødt nøkkel-bånd rundt halsen"
                width={416}
                height={279}
                priority
                loading="eager"
                className="w-full h-auto block"
                style={{ imageRendering: "pixelated" }}
              />
            </TerminalWindow>
          </div>
        </section>

        {/* ===== ./projects --list ===== */}
        <section>
          <Prompt path="C:\NIKOLAI" command="./projects.exe --list" />
          <Projects projects={projects} />
        </section>

        {/* ===== footer ===== */}
        <footer className="pt-6 text-center text-sm text-dim crt-glow">
          [EOF] (c) {new Date().getFullYear()} Nikolai Tandberg &mdash; All
          sectors verified.
        </footer>
      </main>
    </div>
  );
}
