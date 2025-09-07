import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import Link from "next/link";

import { PrismaClient } from "@prisma/client";
import AdminTabsWrapper from "./AdminTabsWrapper";

type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  archived: boolean;
};

type TimelineItem = {
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

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Access Denied</h2>
        <p>You must be logged in to view this page.</p>
        <Link href="/admin/login">Go to Login</Link>
      </div>
    );
  }

  // Fetch projects and timeline items from the database

  const projects: Project[] = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      description: true,
      technologies: true,
      imageUrl: true,
      githubUrl: true,
      liveUrl: true,
      createdAt: true,
      updatedAt: true,
      order: true,
      archived: true,
    },
    where: { archived: false },
  });
  const timelineItems: TimelineItem[] = await prisma.timelineItem.findMany({
    orderBy: [{ order: "asc" }, { date: "desc" }],
    select: {
      id: true,
      date: true,
      title: true,
      description: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      order: true,
      archived: true,
    },
    where: { archived: false },
  });

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Admin page</h1>
      <p className="mb-6 text-gray-600">Welcome, {session.user?.email}</p>
      <hr className="my-8" />
      <AdminTabsWrapper projects={projects} timelineItems={timelineItems} />
    </div>
  );
}
