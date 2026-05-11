"use client";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import type { Project, TimelineItem } from "@/types";
import Dialog from "./Dialog";
import { Button } from "@/components/ui/button";
import ProjectCard from "./ProjectCard";
import TimelineCard from "./TimelineCard";
import ProjectDialog from "./ProjectDialog";
import TimelineDialog from "./TimelineDialog";

export type { Project, TimelineItem };

function GripIcon() {
  return (
    <span
      aria-hidden="true"
      className="font-mono text-accent-yellow leading-none select-none"
      title="Drag to reorder"
    >
      ::
    </span>
  );
}

export default function AdminTabs({
  projects,
  timelineItems,
}: {
  projects: Project[];
  timelineItems: TimelineItem[];
}) {
  const [tab, setTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminTab") || "projects";
    }
    return "projects";
  });

  const [projectItems, setProjectItems] = useState<Project[]>(projects);
  const [timelineList, setTimelineList] =
    useState<TimelineItem[]>(timelineItems);
  const [isSaving, setIsSaving] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Project dialog
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Timeline dialog
  const [showTimelineDialog, setShowTimelineDialog] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(
    null,
  );

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "project" | "timeline";
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminTab", tab);
    }
  }, [tab]);

  const openProjectDialog = (project: Project | null = null) => {
    setEditingProject(project);
    setShowProjectDialog(true);
  };
  const closeProjectDialog = () => {
    setShowProjectDialog(false);
    setTimeout(() => setEditingProject(null), 100);
  };
  const handleProjectSaved = (project: Project, isNew: boolean) => {
    if (isNew) {
      setProjectItems((prev) => [...prev, project]);
    } else {
      setProjectItems((prev) =>
        prev.map((p) => (p.id === project.id ? project : p)),
      );
    }
  };

  const openTimelineDialog = (item: TimelineItem | null = null) => {
    setEditingTimeline(item);
    setShowTimelineDialog(true);
  };
  const closeTimelineDialog = () => {
    setShowTimelineDialog(false);
    setTimeout(() => setEditingTimeline(null), 100);
  };
  const handleTimelineSaved = (item: TimelineItem, isNew: boolean) => {
    if (isNew) {
      setTimelineList((prev) => [...prev, item]);
    } else {
      setTimelineList((prev) => prev.map((t) => (t.id === item.id ? item : t)));
    }
  };

  const openDeleteDialog = (
    type: "project" | "timeline",
    id: string,
    title: string,
  ) => {
    setDeleteTarget({ type, id, title });
    setShowDeleteDialog(true);
  };
  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setTimeout(() => setDeleteTarget(null), 100);
  };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const url =
      deleteTarget.type === "project" ? "/api/projects" : "/api/timeline";
    await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id }),
    });
    if (deleteTarget.type === "project") {
      setProjectItems((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } else {
      setTimelineList((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    }
    closeDeleteDialog();
  };

  async function handleArchive(
    type: "project" | "timeline",
    id: string,
    archived: boolean,
  ) {
    setIsSaving(true);
    const url = type === "project" ? "/api/projects" : "/api/timeline";
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id, archived }] }),
    });
    if (type === "project") {
      setProjectItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, archived } : p)),
      );
    } else {
      setTimelineList((prev) =>
        prev.map((t) => (t.id === id ? { ...t, archived } : t)),
      );
    }
    setIsSaving(false);
  }

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    setIsSaving(true);
    if (tab === "projects") {
      const reordered = Array.from(projectItems);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      setProjectItems(reordered);
      await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: reordered.map((p, i) => ({ id: p.id, order: i })),
        }),
      });
    } else if (tab === "timeline") {
      const reordered = Array.from(timelineList);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      setTimelineList(reordered);
      await fetch("/api/timeline", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: reordered.map((t, i) => ({ id: t.id, order: i })),
        }),
      });
    }
    setIsSaving(false);
  }

  return (
    <div className="font-[var(--font-vt323)] crt-glow">
      {/* Tab navigation styled as DOS menu */}
      <div className="flex gap-1 mb-4 border-b border-foreground/60">
        {(["projects", "timeline"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 uppercase tracking-wider text-base ${
              tab === t
                ? "bg-accent-yellow text-black"
                : "text-foreground hover:bg-blue-900"
            }`}
          >
            [{t === "projects" ? "P" : "T"}] {t}
          </button>
        ))}
      </div>

      <div className="mb-4 flex justify-between items-center flex-wrap gap-3">
        <label className="inline-flex items-center gap-2 text-base text-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={() => setShowArchived((v) => !v)}
          />
          Show archived
        </label>
        {tab === "projects" ? (
          <Button onClick={() => openProjectDialog()}>+ New Project</Button>
        ) : (
          <Button onClick={() => openTimelineDialog()}>
            + New Timeline Item
          </Button>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        {tab === "projects" ? (
          <Droppable droppableId="projects-droppable">
            {(provided) => (
              <ul
                className="mb-6 border border-foreground/40 bg-black/30"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {projectItems
                  .filter((p) => (showArchived ? p.archived : !p.archived))
                  .map((project, index) => (
                    <Draggable
                      key={project.id}
                      draggableId={project.id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border-b border-foreground/30 last:border-b-0 px-2 py-1 flex items-center gap-3"
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab shrink-0"
                          >
                            <GripIcon />
                          </div>
                          <ProjectCard
                            project={project}
                            onEdit={() => openProjectDialog(project)}
                            onArchive={() =>
                              handleArchive(
                                "project",
                                project.id,
                                !project.archived,
                              )
                            }
                            onDelete={() =>
                              openDeleteDialog(
                                "project",
                                project.id,
                                project.title,
                              )
                            }
                          />
                        </li>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        ) : (
          <Droppable droppableId="timeline-droppable">
            {(provided) => (
              <ul
                className="mb-6 border border-foreground/40 bg-black/30"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {timelineList
                  .filter((item) =>
                    showArchived ? item.archived : !item.archived,
                  )
                  .map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border-b border-foreground/30 last:border-b-0 px-2 py-1 flex items-center gap-3"
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab shrink-0"
                          >
                            <GripIcon />
                          </div>
                          <TimelineCard
                            item={item}
                            onEdit={() => openTimelineDialog(item)}
                            onArchive={() =>
                              handleArchive("timeline", item.id, !item.archived)
                            }
                            onDelete={() =>
                              openDeleteDialog("timeline", item.id, item.title)
                            }
                          />
                        </li>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        )}
      </DragDropContext>

      <ProjectDialog
        isOpen={showProjectDialog}
        onClose={closeProjectDialog}
        editingProject={editingProject}
        onSaved={handleProjectSaved}
      />
      <TimelineDialog
        isOpen={showTimelineDialog}
        onClose={closeTimelineDialog}
        editingItem={editingTimeline}
        onSaved={handleTimelineSaved}
      />

      <Dialog
        isOpen={showDeleteDialog}
        onClose={closeDeleteDialog}
        title="Confirm Delete"
      >
        <div className="flex flex-col gap-3">
          <p className="text-base">
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.title}</strong>?
          </p>
          <p className="text-sm text-black/70">
            WARNING: This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end pt-2 border-t border-black mt-2">
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>

      {isSaving && (
        <div className="fixed bottom-8 right-4 bg-accent-yellow text-black border-2 border-black crt-bevel-out-thin px-3 py-1 text-base flex items-center gap-2 z-50">
          <span className="crt-cursor" /> SAVING...
        </div>
      )}
    </div>
  );
}
