import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/db";
import { parseJsonArray } from "@/utils/jsonArray";
import AdminTabsWrapper from "./AdminTabsWrapper";
import AdminHeader from "./AdminHeader";
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
    <div className="max-w-4xl mx-auto px-6 py-10">
      <AdminHeader email={session.user?.email ?? ""} />
      <hr className="my-6 border-foreground/10" />
      <AdminTabsWrapper projects={projects} timelineItems={timelineItems} />
    </div>
  );
}
