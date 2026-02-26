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
import Button from "@/app/components/Button";
import ProjectCard from "./ProjectCard";
import TimelineCard from "./TimelineCard";

export type { Project, TimelineItem };

const inputClass =
  "w-full border border-foreground/20 bg-background text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-foreground/40 transition-colors";

function GripIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
      <circle cx="2" cy="2" r="1.5" />
      <circle cx="8" cy="2" r="1.5" />
      <circle cx="2" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="2" cy="14" r="1.5" />
      <circle cx="8" cy="14" r="1.5" />
    </svg>
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
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(
    null,
  );
  const [projectItems, setProjectItems] = useState<Project[]>(projects);
  const [timelineList, setTimelineList] =
    useState<TimelineItem[]>(timelineItems);
  const [isSaving, setIsSaving] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showTimelineDialog, setShowTimelineDialog] = useState(false);
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

  const openTimelineDialog = (item: TimelineItem | null = null) => {
    setEditingTimeline(item);
    setShowTimelineDialog(true);
  };

  const closeProjectDialog = () => {
    setShowProjectDialog(false);
    setTimeout(() => setEditingProject(null), 100);
  };

  const closeTimelineDialog = () => {
    setShowTimelineDialog(false);
    setTimeout(() => setEditingTimeline(null), 100);
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

  const handleProjectSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value || "";

    const data = {
      ...(editingProject && { id: editingProject.id }),
      title: getValue("title"),
      description: getValue("description"),
      technologies: getValue("technologies")
        .split(",")
        .map((t: string) => t.trim()),
      imageUrl: getValue("imageUrl") || null,
      githubUrl: getValue("githubUrl") || null,
      liveUrl: getValue("liveUrl") || null,
    };

    if (editingProject) {
      await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setProjectItems((prev) =>
        prev.map((p) => (p.id === editingProject.id ? { ...p, ...data } : p)),
      );
    } else {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const newProject = await res.json();
      setProjectItems((prev) => [...prev, newProject]);
    }
    closeProjectDialog();
    form.reset();
  };

  const handleTimelineSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value || "";

    const data = {
      ...(editingTimeline && { id: editingTimeline.id }),
      title: getValue("title"),
      date: getValue("date"),
      description: getValue("description"),
      tags: getValue("tags")
        .split(",")
        .map((t: string) => t.trim())
        .filter((t) => t),
    };

    if (editingTimeline) {
      await fetch("/api/timeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setTimelineList((prev) =>
        prev.map((t) => (t.id === editingTimeline.id ? { ...t, ...data } : t)),
      );
    } else {
      const res = await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const newTimeline = await res.json();
      setTimelineList((prev) => [...prev, newTimeline]);
    }
    closeTimelineDialog();
    form.reset();
  };

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex gap-6 mb-8 border-b border-foreground/10">
        <button
          className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${
            tab === "projects"
              ? "border-b-2 border-primary text-primary"
              : "text-foreground/50 hover:text-foreground"
          }`}
          onClick={() => setTab("projects")}
        >
          Projects
        </button>
        <button
          className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${
            tab === "timeline"
              ? "border-b-2 border-primary text-primary"
              : "text-foreground/50 hover:text-foreground"
          }`}
          onClick={() => setTab("timeline")}
        >
          Timeline
        </button>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex justify-between items-center">
        <label className="inline-flex items-center gap-2 text-sm text-foreground/60 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={() => setShowArchived((v) => !v)}
            className="accent-primary cursor-pointer"
          />
          Show archived
        </label>
        {tab === "projects" ? (
          <Button onClick={() => openProjectDialog()}>+ Add Project</Button>
        ) : (
          <Button onClick={() => openTimelineDialog()}>
            + Add Timeline Item
          </Button>
        )}
      </div>

      {/* Lists */}
      <DragDropContext onDragEnd={onDragEnd}>
        {tab === "projects" ? (
          <Droppable droppableId="projects-droppable">
            {(provided) => (
              <ul
                className="mb-8"
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
                          className="mb-3 rounded-lg border border-foreground/10 bg-background hover:border-foreground/20 transition-colors"
                        >
                          <div className="flex items-start gap-3 p-4">
                            <div
                              {...provided.dragHandleProps}
                              className="mt-1 flex flex-col items-center gap-0.5 cursor-grab text-foreground/30 hover:text-foreground/60 shrink-0"
                              title="Drag to reorder"
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
                          </div>
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
                className="mb-8"
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
                          className="mb-3 rounded-lg border border-foreground/10 bg-background hover:border-foreground/20 transition-colors"
                        >
                          <div className="flex items-start gap-3 p-4">
                            <div
                              {...provided.dragHandleProps}
                              className="mt-1 flex flex-col items-center gap-0.5 cursor-grab text-foreground/30 hover:text-foreground/60 shrink-0"
                              title="Drag to reorder"
                            >
                              <GripIcon />
                            </div>
                            <TimelineCard
                              item={item}
                              onEdit={() => openTimelineDialog(item)}
                              onArchive={() =>
                                handleArchive(
                                  "timeline",
                                  item.id,
                                  !item.archived,
                                )
                              }
                              onDelete={() =>
                                openDeleteDialog(
                                  "timeline",
                                  item.id,
                                  item.title,
                                )
                              }
                            />
                          </div>
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

      {/* Project Dialog */}
      <Dialog
        isOpen={showProjectDialog}
        onClose={closeProjectDialog}
        title={editingProject ? "Edit Project" : "Add New Project"}
      >
        <form onSubmit={handleProjectSubmit} className="flex flex-col gap-4">
          <input
            key={`title-${editingProject?.id || "new"}`}
            name="title"
            placeholder="Title"
            defaultValue={editingProject?.title || ""}
            className={inputClass}
            required
          />
          <textarea
            key={`description-${editingProject?.id || "new"}`}
            name="description"
            placeholder="Description"
            defaultValue={editingProject?.description || ""}
            className={`${inputClass} min-h-[100px]`}
            required
            rows={4}
          />
          <input
            key={`technologies-${editingProject?.id || "new"}`}
            name="technologies"
            placeholder="Technologies (comma separated)"
            defaultValue={editingProject?.technologies.join(", ") || ""}
            className={inputClass}
            required
          />
          <input
            key={`imageUrl-${editingProject?.id || "new"}`}
            name="imageUrl"
            placeholder="Image URL"
            defaultValue={editingProject?.imageUrl || ""}
            className={inputClass}
          />
          <input
            key={`githubUrl-${editingProject?.id || "new"}`}
            name="githubUrl"
            placeholder="GitHub URL"
            defaultValue={editingProject?.githubUrl || ""}
            className={inputClass}
          />
          <input
            key={`liveUrl-${editingProject?.id || "new"}`}
            name="liveUrl"
            placeholder="Live URL"
            defaultValue={editingProject?.liveUrl || ""}
            className={inputClass}
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={closeProjectDialog}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingProject ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Timeline Dialog */}
      <Dialog
        isOpen={showTimelineDialog}
        onClose={closeTimelineDialog}
        title={editingTimeline ? "Edit Timeline Item" : "Add New Timeline Item"}
      >
        <form onSubmit={handleTimelineSubmit} className="flex flex-col gap-4">
          <input
            key={`title-${editingTimeline?.id || "new"}`}
            name="title"
            placeholder="Title"
            defaultValue={editingTimeline?.title || ""}
            className={inputClass}
            required
          />
          <input
            key={`date-${editingTimeline?.id || "new"}`}
            name="date"
            placeholder="Date (e.g. Aug. 2023 - Aug. 2024)"
            defaultValue={editingTimeline?.date || ""}
            className={inputClass}
            required
          />
          <textarea
            key={`description-${editingTimeline?.id || "new"}`}
            name="description"
            placeholder="Description"
            defaultValue={editingTimeline?.description || ""}
            className={`${inputClass} min-h-[100px]`}
            required
            rows={4}
          />
          <input
            key={`tags-${editingTimeline?.id || "new"}`}
            name="tags"
            placeholder="Tags (comma separated)"
            defaultValue={editingTimeline?.tags.join(", ") || ""}
            className={inputClass}
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={closeTimelineDialog}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingTimeline ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={closeDeleteDialog}
        title="Confirm Delete"
      >
        <div className="flex flex-col gap-4">
          <p>
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.title}</strong>?
          </p>
          <p className="text-sm text-foreground/60">
            This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Saving toast */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Saving...
        </div>
      )}
    </div>
  );
}
