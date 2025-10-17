"use client";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import type { Project, TimelineItem } from "@/types";

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

  // Persist tab selection in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminTab", tab);
    }
  }, [tab]);

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
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={() => setShowArchived((v) => !v)}
            className="mr-2"
          />
          Show archived {tab === "projects" ? "projects" : "timeline items"}
        </label>
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
                                onClick={() => setEditingProject(project)}
                              >
                                Edit
                              </button>
                              <button
                                className="px-3 py-1 bg-quaternary text-white rounded hover:bg-red-700"
                                onClick={async () => {
                                  if (
                                    confirm(
                                      `Delete project '${project.title}'?`,
                                    )
                                  ) {
                                    await fetch(`/api/projects`, {
                                      method: "DELETE",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({ id: project.id }),
                                    });
                                    setProjectItems((prev) =>
                                      prev.filter((p) => p.id !== project.id),
                                    );
                                  }
                                }}
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
            {editingProject ? (
              <form
                className="bg-gray-50 p-4 rounded shadow flex flex-col gap-4 mb-8"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const getValue = (name: string) =>
                    (form.elements.namedItem(name) as HTMLInputElement)
                      ?.value || "";
                  const data = {
                    id: editingProject.id,
                    title: getValue("title"),
                    description: getValue("description"),
                    technologies: getValue("technologies")
                      .split(",")
                      .map((t: string) => t.trim()),
                    imageUrl: getValue("imageUrl") || null,
                    githubUrl: getValue("githubUrl") || null,
                    liveUrl: getValue("liveUrl") || null,
                  };
                  await fetch(`/api/projects`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  });
                  setProjectItems((prev) =>
                    prev.map((p) => (p.id === data.id ? { ...p, ...data } : p)),
                  );
                  setEditingProject(null);
                }}
              >
                <h3 className="text-lg font-semibold mb-2">Edit Project</h3>
                <input
                  name="title"
                  defaultValue={editingProject.title}
                  className="border p-2 rounded"
                  required
                />
                <textarea
                  name="description"
                  defaultValue={editingProject.description}
                  className="border p-2 rounded min-h-[100px]"
                  required
                  rows={4}
                />
                <input
                  name="technologies"
                  defaultValue={editingProject.technologies.join(", ")}
                  className="border p-2 rounded"
                  required
                />
                <input
                  name="imageUrl"
                  defaultValue={editingProject.imageUrl || ""}
                  className="border p-2 rounded"
                />
                <input
                  name="githubUrl"
                  defaultValue={editingProject.githubUrl || ""}
                  className="border p-2 rounded"
                />
                <input
                  name="liveUrl"
                  defaultValue={editingProject.liveUrl || ""}
                  className="border p-2 rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                >
                  Update Project
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-black rounded mt-2"
                  onClick={() => setEditingProject(null)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <form
                className="bg-gray-50 p-4 rounded shadow flex flex-col gap-4 mb-8"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const getValue = (name: string) =>
                    (form.elements.namedItem(name) as HTMLInputElement)
                      ?.value || "";
                  const data = {
                    title: getValue("title"),
                    description: getValue("description"),
                    technologies: getValue("technologies")
                      .split(",")
                      .map((t: string) => t.trim()),
                    imageUrl: getValue("imageUrl") || null,
                    githubUrl: getValue("githubUrl") || null,
                    liveUrl: getValue("liveUrl") || null,
                  };
                  const res = await fetch(`/api/projects`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  });
                  const newProject = await res.json();
                  setProjectItems((prev) => [...prev, newProject]);
                  form.reset();
                }}
              >
                <h3 className="text-lg font-semibold mb-2">Add New Project</h3>
                <input
                  name="title"
                  placeholder="Title"
                  className="border p-2 rounded"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  className="border p-2 rounded min-h-[100px]"
                  required
                  rows={4}
                />
                <input
                  name="technologies"
                  placeholder="Technologies (comma separated)"
                  className="border p-2 rounded"
                  required
                />
                <input
                  name="imageUrl"
                  placeholder="Image URL"
                  className="border p-2 rounded"
                />
                <input
                  name="githubUrl"
                  placeholder="GitHub URL"
                  className="border p-2 rounded"
                />
                <input
                  name="liveUrl"
                  placeholder="Live URL"
                  className="border p-2 rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                >
                  Add Project
                </button>
              </form>
            )}
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
                                onClick={() => setEditingTimeline(item)}
                              >
                                Edit
                              </button>
                              <button
                                className="px-3 py-1 bg-quaternary text-white rounded hover:bg-red-700"
                                onClick={async () => {
                                  if (
                                    confirm(
                                      `Delete timeline item '${item.title}'?`,
                                    )
                                  ) {
                                    await fetch(`/api/timeline`, {
                                      method: "DELETE",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({ id: item.id }),
                                    });
                                    setTimelineList((prev) =>
                                      prev.filter((t) => t.id !== item.id),
                                    );
                                  }
                                }}
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
            {editingTimeline ? (
              <form
                className="bg-gray-50 p-4 rounded shadow flex flex-col gap-4 mb-8"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const getValue = (name: string) =>
                    (form.elements.namedItem(name) as HTMLInputElement)
                      ?.value || "";
                  const data = {
                    id: editingTimeline.id,
                    title: getValue("title"),
                    date: getValue("date"),
                    description: getValue("description"),
                    tags: getValue("tags")
                      .split(",")
                      .map((t: string) => t.trim()),
                  };
                  await fetch(`/api/timeline`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  });
                  setTimelineList((prev) =>
                    prev.map((t) => (t.id === data.id ? { ...t, ...data } : t)),
                  );
                  setEditingTimeline(null);
                }}
              >
                <h3 className="text-lg font-semibold mb-2">
                  Edit Timeline Item
                </h3>
                <input
                  name="title"
                  defaultValue={editingTimeline.title}
                  className="border p-2 rounded"
                  required
                />
                <input
                  name="date"
                  defaultValue={editingTimeline.date}
                  className="border p-2 rounded"
                  required
                />
                <textarea
                  name="description"
                  defaultValue={editingTimeline.description}
                  className="border p-2 rounded min-h-[100px]"
                  required
                  rows={4}
                />
                <input
                  name="tags"
                  defaultValue={editingTimeline.tags.join(", ")}
                  className="border p-2 rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                >
                  Update Timeline Item
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-black rounded mt-2"
                  onClick={() => setEditingTimeline(null)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <form
                className="bg-gray-50 p-4 rounded shadow flex flex-col gap-4 mb-8"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const getValue = (name: string) =>
                    (form.elements.namedItem(name) as HTMLInputElement)
                      ?.value || "";
                  const data = {
                    title: getValue("title"),
                    date: getValue("date"),
                    description: getValue("description"),
                    tags: getValue("tags")
                      .split(",")
                      .map((t: string) => t.trim()),
                  };
                  const res = await fetch(`/api/timeline`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  });
                  const newTimeline = await res.json();
                  setTimelineList((prev) => [...prev, newTimeline]);
                  form.reset();
                }}
              >
                <h3 className="text-lg font-semibold mb-2">
                  Add New Timeline Item
                </h3>
                <input
                  name="title"
                  placeholder="Title"
                  className="border p-2 rounded"
                  required
                />
                <input
                  name="date"
                  placeholder="Date (e.g. Aug. 2023 - Aug. 2024)"
                  className="border p-2 rounded"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  className="border p-2 rounded"
                  required
                  rows={4}
                />
                <input
                  name="tags"
                  placeholder="Tags (comma separated)"
                  className="border p-2 rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                >
                  Add Timeline Item
                </button>
              </form>
            )}
          </div>
        )}
      </DragDropContext>
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-yellow-200 px-4 py-2 rounded shadow">
          Saving...
        </div>
      )}
    </div>
  );
}
