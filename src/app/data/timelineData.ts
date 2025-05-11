export type TimelineItem = {
  date: string;
  title: string;
  description: string;
  tags?: string[];
};

export const timelineItems: TimelineItem[] = [
  {
    date: "aug. 2023 - jun. 2026",
    title: "Bachelor i ingeniørfag, data",
    description:
      "Bachelor i ingeniørfag, data med spesialisering innen systemutvikling ved NTNU Trondheim.",
    tags: [
      "Algoritmer og datastrukturer",
      "Full-stack applikasjonsutvikling",
      "Databaser",
      "Operativsystemer",
    ],
  },
  {
    date: "Sommer 2025",
    title: "Internship hos KLP teknologi",
    description:
      "Skal jobbe i avdelingen 'oppgjør' hos KLP Teknologi med forbedringsoppgaver i produksjon, i tillegg til analyse og løsningsdesign.",
    tags: ["React", "Spring-boot"],
  },
  {
    date: "jan. 2025 - jan. 2026",
    title: "Gjengsjef i Regi",
    description:
      "Har stillingen som gjengsjef i Regi for kalenderåret 2025, leder for 25 personer med 20 arbeidstimer i uken hver.",
    tags: ["Endringsledelse", "Personalansvar"],
  },
  {
    date: "nov. 2024 - nå",
    title: "Kulturstyret UKA-25",
    description:
      "Som gjengsjef for Regi sitter jeg i kulturstyret for UKA-25, nordens største kulturfestival.",
    tags: ["Prosjektledelse", "Økonomisk styring"],
  },
  {
    date: "sep. 2023 - nå",
    title: "Lystekniker",
    description:
      "Frivillig i gjengen 'Regi' Studentersamfundet i trondhjems lys- og scenetekniske gjeng. Vi gjør alt av lys og sceneteknikk på verdens 8. største utested.",
    tags: ["Lysdesign", "Sceneteknikk", "Rigging"],
  },
];
