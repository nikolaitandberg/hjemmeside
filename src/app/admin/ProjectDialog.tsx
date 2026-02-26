"use client";
import type { Project } from "@/types";
import Dialog from "./Dialog";
import Button from "@/app/components/Button";

const inputClass =
  "w-full border border-foreground/20 bg-background text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-foreground/40 transition-colors";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingProject: Project | null;
  onSaved: (project: Project, isNew: boolean) => void;
}

export default function ProjectDialog({
  isOpen,
  onClose,
  editingProject,
  onSaved,
}: Props) {
  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
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
        .map((t: string) => t.trim())
        .filter((t) => t),
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
      onSaved({ ...editingProject, ...data }, false);
    } else {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const newProject = await res.json();
      onSaved(newProject, true);
    }

    onClose();
    form.reset();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={editingProject ? "Edit Project" : "Add New Project"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {editingProject ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
