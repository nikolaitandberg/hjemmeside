"use client";

import { useState } from "react";
import Image from "next/image";
import type { Project } from "@/types";
import TerminalWindow from "./crt/TerminalWindow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function pad(n: number, len: number) {
  return String(n).padStart(len, "0");
}

function slugFromTitle(title: string) {
  return (
    title
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "")
      .slice(0, 8) || "PROJECT"
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");

  if (projects.length === 0) {
    return (
      <div className="text-foreground crt-glow">
        File not found: PROJECTS\*.*
      </div>
    );
  }

  const active = projects.find((p) => p.id === activeId) ?? projects[0];

  return (
    <div className="font-[var(--font-vt323)] text-foreground crt-glow">
      <div className="text-base mb-2 text-accent-cyan">
        Directory of C:\NIKOLAI\PROJECTS
      </div>

      {/* File listing — selectable rows like a DOS file manager */}
      <ul className="border border-foreground/40 bg-black/30">
        {projects.map((project, i) => {
          const isActive = project.id === active.id;
          const filename = `${slugFromTitle(project.title)}.EXE`;
          const date = new Date(project.createdAt);
          const datestr = `${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}-${String(date.getFullYear()).slice(2)}`;
          return (
            <li key={project.id}>
              <button
                type="button"
                onClick={() => setActiveId(project.id)}
                className={`w-full text-left px-2 py-0.5 flex items-baseline gap-3 transition-none ${
                  isActive ? "bg-accent-yellow text-black" : "hover:bg-blue-900"
                }`}
              >
                <span className="w-8 text-right tabular-nums">
                  [{pad(i + 1, 2)}]
                </span>
                <span className="w-28 font-bold tracking-wider">
                  {filename}
                </span>
                <span className="hidden sm:inline w-24 text-right tabular-nums">
                  {pad(project.title.length * 137 + i * 41, 6)}
                </span>
                <span className="hidden md:inline text-sm opacity-80">
                  {datestr}
                </span>
                <span className="ml-auto truncate opacity-90">
                  {project.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-1 mb-4 text-base text-dim">
        {projects.length} file(s). Use ↑/↓ or click to select. ENTER to open.
      </div>

      {/* Opened "window" for the selected project */}
      <TerminalWindow
        title={`${slugFromTitle(active.title)}.EXE`}
        buttons={["min", "max", "close"]}
        footer={
          <div className="flex items-center justify-between">
            <span>F4=Open in Browser &nbsp; F5=GitHub &nbsp; ESC=Close</span>
            <span className="tabular-nums">
              [{active.technologies.length} tech]
            </span>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {active.imageUrl && (
            <div className="border border-black crt-bevel-in-thin bg-black">
              <Image
                src={active.imageUrl}
                alt={active.title}
                width={600}
                height={400}
                className="w-full h-auto block"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          )}
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl uppercase tracking-wider">
              {active.title}
            </h3>
            <p className="text-base leading-snug">{active.description}</p>

            <div>
              <div className="text-base uppercase font-bold mb-1">
                — Teknologier —
              </div>
              <div className="flex flex-wrap gap-1.5">
                {active.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-1">
              {active.githubUrl && (
                <Button asChild>
                  <a
                    href={active.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [F5] GITHUB
                  </a>
                </Button>
              )}
              {active.liveUrl && (
                <Button asChild>
                  <a
                    href={active.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [F4] OPEN
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </TerminalWindow>
    </div>
  );
}
