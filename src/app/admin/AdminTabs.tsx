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

export type { Project, TimelineItem };

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

  // Dialog states
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showTimelineDialog, setShowTimelineDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "project" | "timeline";
    id: string;
    title: string;
  } | null>(null);

  // Persist tab selection in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminTab", tab);
    }
  }, [tab]);

  // Open dialogs for create/edit
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
    // Small delay to allow dialog animation before clearing state
    setTimeout(() => setEditingProject(null), 100);
  };

  const closeTimelineDialog = () => {
    setShowTimelineDialog(false);
    // Small delay to allow dialog animation before clearing state
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

  // Archive/unarchive handler
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

  // Drag-and-drop handler
  async function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    setIsSaving(true);
    if (tab === "projects") {
      const reordered = Array.from(projectItems);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      setProjectItems(reordered);
      // Persist new order
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
      // Persist new order
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

  // Project form submit handler
  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      // Update existing
      await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setProjectItems((prev) =>
        prev.map((p) => (p.id === editingProject.id ? { ...p, ...data } : p)),
      );
    } else {
      // Create new
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

  // Timeline form submit handler
  const handleTimelineSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      // Update existing
      await fetch("/api/timeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setTimelineList((prev) =>
        prev.map((t) => (t.id === editingTimeline.id ? { ...t, ...data } : t)),
      );
    } else {
      // Create new
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
      <div className="flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-t ${tab === "projects" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setTab("projects")}
        >
          Projects
        </button>
        <button
          className={`px-4 py-2 rounded-t ${tab === "timeline" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setTab("timeline")}
        >
          Timeline Items
        </button>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={() => setShowArchived((v) => !v)}
            className="mr-2"
          />
          Show archived {tab === "projects" ? "projects" : "timeline items"}
        </label>

        {tab === "projects" ? (
          <button
            onClick={() => openProjectDialog()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
          >
            + Add Project
          </button>
        ) : (
          <button
            onClick={() => openTimelineDialog()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
          >
            + Add Timeline Item
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        {tab === "projects" ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <Droppable droppableId="projects-droppable">
              {(provided) => (
                <ul
                  className="mb-8"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {projectItems
                    .filter((project) =>
                      showArchived ? project.archived : !project.archived,
                    )
                    .map((project: Project, index: number) => (
                      <Draggable
                        key={project.id}
                        draggableId={project.id}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-4 p-4 bg-white rounded shadow flex flex-col gap-2"
                          >
                            <div>
                              <span className="font-bold text-lg">
                                {project.title}
                              </span>
                              <span className="ml-2 text-gray-500">
                                {project.description}
                              </span>
                              {project.archived && (
                                <span className="ml-2 text-xs text-red-500">
                                  (Archived)
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
                                onClick={() => openProjectDialog(project)}
                              >
                                Edit
                              </button>
                              <button
                                className="px-3 py-1 bg-quaternary text-white rounded hover:bg-red-700"
                                onClick={() =>
                                  openDeleteDialog(
                                    "project",
                                    project.id,
                                    project.title,
                                  )
                                }
                              >
                                Delete
                              </button>
                              <button
                                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-600"
                                onClick={() =>
                                  handleArchive(
                                    "project",
                                    project.id,
                                    !project.archived,
                                  )
                                }
                              >
                                {project.archived ? "Unarchive" : "Archive"}
                              </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Timeline Items</h2>
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
                    .map((item: TimelineItem, index: number) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-4 p-4 bg-white rounded shadow flex flex-col gap-2"
                          >
                            <div>
                              <span className="font-bold text-lg">
                                {item.title}
                              </span>
                              <span className="ml-2 text-gray-500">
                                ({item.date})
                              </span>
                              <span className="ml-2 text-gray-500">
                                {item.description}
                              </span>
                              {item.archived && (
                                <span className="ml-2 text-xs text-red-500">
                                  (Archived)
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
                                onClick={() => openTimelineDialog(item)}
                              >
                                Edit
                              </button>
                              <button
                                className="px-3 py-1 bg-quaternary text-white rounded hover:bg-red-700"
                                onClick={() =>
                                  openDeleteDialog(
                                    "timeline",
                                    item.id,
                                    item.title,
                                  )
                                }
                              >
                                Delete
                              </button>
                              <button
                                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-600"
                                onClick={() =>
                                  handleArchive(
                                    "timeline",
                                    item.id,
                                    !item.archived,
                                  )
                                }
                              >
                                {item.archived ? "Unarchive" : "Archive"}
                              </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
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
            className="border p-2 rounded"
            required
          />
          <textarea
            key={`description-${editingProject?.id || "new"}`}
            name="description"
            placeholder="Description"
            defaultValue={editingProject?.description || ""}
            className="border p-2 rounded min-h-[100px]"
            required
            rows={4}
          />
          <input
            key={`technologies-${editingProject?.id || "new"}`}
            name="technologies"
            placeholder="Technologies (comma separated)"
            defaultValue={editingProject?.technologies.join(", ") || ""}
            className="border p-2 rounded"
            required
          />
          <input
            key={`imageUrl-${editingProject?.id || "new"}`}
            name="imageUrl"
            placeholder="Image URL"
            defaultValue={editingProject?.imageUrl || ""}
            className="border p-2 rounded"
          />
          <input
            key={`githubUrl-${editingProject?.id || "new"}`}
            name="githubUrl"
            placeholder="GitHub URL"
            defaultValue={editingProject?.githubUrl || ""}
            className="border p-2 rounded"
          />
          <input
            key={`liveUrl-${editingProject?.id || "new"}`}
            name="liveUrl"
            placeholder="Live URL"
            defaultValue={editingProject?.liveUrl || ""}
            className="border p-2 rounded"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={closeProjectDialog}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
            >
              {editingProject ? "Update" : "Create"}
            </button>
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
            className="border p-2 rounded"
            required
          />
          <input
            key={`date-${editingTimeline?.id || "new"}`}
            name="date"
            placeholder="Date (e.g. Aug. 2023 - Aug. 2024)"
            defaultValue={editingTimeline?.date || ""}
            className="border p-2 rounded"
            required
          />
          <textarea
            key={`description-${editingTimeline?.id || "new"}`}
            name="description"
            placeholder="Description"
            defaultValue={editingTimeline?.description || ""}
            className="border p-2 rounded min-h-[100px]"
            required
            rows={4}
          />
          <input
            key={`tags-${editingTimeline?.id || "new"}`}
            name="tags"
            placeholder="Tags (comma separated)"
            defaultValue={editingTimeline?.tags.join(", ") || ""}
            className="border p-2 rounded"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={closeTimelineDialog}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
            >
              {editingTimeline ? "Update" : "Create"}
            </button>
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
          <p className="text-sm text-gray-600">This action cannot be undone.</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={closeDeleteDialog}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>

      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-yellow-200 px-4 py-2 rounded shadow">
          Saving...
        </div>
      )}
    </div>
  );
}
