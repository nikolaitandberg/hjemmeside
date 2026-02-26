"use client";
import type { Project } from "@/types";
import Button from "@/app/components/Button";

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
        <div className="flex items-center gap-2">
          <span className="font-semibold">{project.title}</span>
          {project.archived && (
            <span className="text-xs bg-quaternary/15 text-quaternary px-1.5 py-0.5 rounded">
              Archived
            </span>
          )}
        </div>
        <p className="text-sm text-foreground/50 mt-0.5 line-clamp-1">
          {project.description}
        </p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <Button
          variant="ghost"
          className="px-2.5 py-1 text-sm"
          onClick={onEdit}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          className="px-2.5 py-1 text-sm"
          onClick={onArchive}
        >
          {project.archived ? "Unarchive" : "Archive"}
        </Button>
        <Button
          variant="danger"
          className="px-2.5 py-1 text-sm"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </>
  );
}
