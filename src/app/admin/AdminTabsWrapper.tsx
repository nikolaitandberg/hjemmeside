"use client";
import dynamic from "next/dynamic";
import type { Project, TimelineItem } from "./AdminTabs";

const AdminTabs = dynamic(() => import("./AdminTabs"), { ssr: false });

export default function AdminTabsWrapper({ projects, timelineItems }: { projects: Project[]; timelineItems: TimelineItem[] }) {
  return <AdminTabs projects={projects} timelineItems={timelineItems} />;
}
