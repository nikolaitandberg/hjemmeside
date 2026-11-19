"use client";
import dynamic from "next/dynamic";
import type { Project, TimelineItem } from "@/types";

const AdminTabs = dynamic(() => import("./AdminTabs"), { ssr: false });

export default function AdminTabsWrapper({
  projects,
  timelineItems,
  profileImageVersion,
}: {
  projects: Project[];
  timelineItems: TimelineItem[];
  profileImageVersion: number;
}) {
  return (
    <AdminTabs
      projects={projects}
      timelineItems={timelineItems}
      profileImageVersion={profileImageVersion}
    />
  );
}
