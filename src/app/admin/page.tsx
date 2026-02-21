import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/db";
import { parseJsonArray } from "@/utils/jsonArray";
import AdminTabsWrapper from "./AdminTabsWrapper";
import LogoutButton from "./LogoutButton";
import type { Project, TimelineItem } from "@/types";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const rawProjects = await prisma.project.findMany({
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
  });
  const projects: Project[] = rawProjects.map((p) => ({
    ...p,
    technologies: parseJsonArray(p.technologies),
  }));
  const rawTimelineItems = await prisma.timelineItem.findMany({
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
  });
  const timelineItems: TimelineItem[] = rawTimelineItems.map((t) => ({
    ...t,
    tags: parseJsonArray(t.tags),
  }));

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Admin page</h1>
        <LogoutButton />
      </div>
      <p className="mb-6 text-foreground/60">Welcome, {session.user?.email}</p>
      <hr className="my-8" />
      <AdminTabsWrapper projects={projects} timelineItems={timelineItems} />
    </div>
  );
}
