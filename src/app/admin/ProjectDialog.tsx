"use client";
import type { Project } from "@/types";
import Dialog from "./Dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field label="Title">
          <Input
            key={`title-${editingProject?.id || "new"}`}
            name="title"
            placeholder="My Awesome Project"
            defaultValue={editingProject?.title || ""}
            required
          />
        </Field>
        <Field label="Description">
          <Textarea
            key={`description-${editingProject?.id || "new"}`}
            name="description"
            placeholder="What it does..."
            defaultValue={editingProject?.description || ""}
            required
            rows={4}
          />
        </Field>
        <Field label="Technologies (comma separated)">
          <Input
            key={`technologies-${editingProject?.id || "new"}`}
            name="technologies"
            placeholder="Next.js, Prisma, TypeScript"
            defaultValue={editingProject?.technologies.join(", ") || ""}
            required
          />
        </Field>
        <Field label="Image URL">
          <Input
            key={`imageUrl-${editingProject?.id || "new"}`}
            name="imageUrl"
            placeholder="/images/foo.png"
            defaultValue={editingProject?.imageUrl || ""}
          />
        </Field>
        <Field label="GitHub URL">
          <Input
            key={`githubUrl-${editingProject?.id || "new"}`}
            name="githubUrl"
            placeholder="https://github.com/..."
            defaultValue={editingProject?.githubUrl || ""}
          />
        </Field>
        <Field label="Live URL">
          <Input
            key={`liveUrl-${editingProject?.id || "new"}`}
            name="liveUrl"
            placeholder="https://..."
            defaultValue={editingProject?.liveUrl || ""}
          />
        </Field>
        <div className="flex gap-2 justify-end pt-2 border-t border-black mt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{editingProject ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <Label className="uppercase text-base text-black tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}
