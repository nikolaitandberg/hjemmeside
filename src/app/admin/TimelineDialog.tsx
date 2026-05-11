"use client";
import type { TimelineItem } from "@/types";
import Dialog from "./Dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingItem: TimelineItem | null;
  onSaved: (item: TimelineItem, isNew: boolean) => void;
}

export default function TimelineDialog({
  isOpen,
  onClose,
  editingItem,
  onSaved,
}: Props) {
  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value || "";

    const data = {
      ...(editingItem && { id: editingItem.id }),
      title: getValue("title"),
      date: getValue("date"),
      description: getValue("description"),
      tags: getValue("tags")
        .split(",")
        .map((t: string) => t.trim())
        .filter((t) => t),
    };

    if (editingItem) {
      await fetch("/api/timeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      onSaved({ ...editingItem, ...data }, false);
    } else {
      const res = await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const newItem = await res.json();
      onSaved(newItem, true);
    }

    onClose();
    form.reset();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? "Edit Timeline Item" : "Add Timeline Item"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field label="Title">
          <Input
            key={`title-${editingItem?.id || "new"}`}
            name="title"
            placeholder="Started at..."
            defaultValue={editingItem?.title || ""}
            required
          />
        </Field>
        <Field label="Date">
          <Input
            key={`date-${editingItem?.id || "new"}`}
            name="date"
            placeholder="Aug. 2023 - Aug. 2024"
            defaultValue={editingItem?.date || ""}
            required
          />
        </Field>
        <Field label="Description">
          <Textarea
            key={`description-${editingItem?.id || "new"}`}
            name="description"
            placeholder="Details..."
            defaultValue={editingItem?.description || ""}
            required
            rows={4}
          />
        </Field>
        <Field label="Tags (comma separated)">
          <Input
            key={`tags-${editingItem?.id || "new"}`}
            name="tags"
            placeholder="react, typescript"
            defaultValue={editingItem?.tags.join(", ") || ""}
          />
        </Field>
        <div className="flex gap-2 justify-end pt-2 border-t border-black mt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{editingItem ? "Update" : "Create"}</Button>
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
