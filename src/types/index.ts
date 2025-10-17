// Types matching Prisma schema
export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  archived: boolean;
};

export type TimelineItem = {
  id: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  order: number;
  archived: boolean;
};
