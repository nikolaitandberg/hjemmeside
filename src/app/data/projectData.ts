export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
};

export const projectData: Project[] = [
  {
    id: "portfolio",
    title: "Personlig hjemmeside",
    description:
      "Min egen hjemmeside og e-portefølje bygget med Next.js, TypeScript og Tailwind CSS.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    imageUrl: "/images/portfolio.jpg",
    githubUrl: "https://github.com/nikolaitandberg/hjemmeside",
    liveUrl: "https://nikolaitandberg.no",
  },
  {
    id: "project2",
    title: "Prosjekt 2",
    description: "Beskrivelse av prosjekt 2 går her...",
    technologies: ["JavaScript", "Express", "MongoDB"],
    githubUrl: "https://github.com/nikolaitandberg/project2",
  },
];
// This file is now unused. Projects are fetched from the database via API.
