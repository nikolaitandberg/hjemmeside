"use client";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";

interface Props {
  project: Project;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export default function ProjectCard({
  project,
  onEdit,
  onArchive,
  onDelete,
}: Props) {
  return (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold uppercase tracking-wide text-foreground">
            {project.title}
          </span>
          {project.archived && (
            <span className="text-xs uppercase bg-accent-red text-white px-1.5 border border-black">
              ARCHIVED
            </span>
          )}
        </div>
        <p className="text-base text-foreground/80 line-clamp-1">
          {project.description}
        </p>
      </div>
      <div className="flex gap-1 shrink-0 flex-wrap">
        <Button variant="outline" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="outline" onClick={onArchive}>
          {project.archived ? "Unarchive" : "Archive"}
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Del
        </Button>
      </div>
    </>
  );
}
