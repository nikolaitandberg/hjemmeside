"use client";
import type { TimelineItem } from "@/types";
import Dialog from "./Dialog";
import Button from "@/app/components/Button";

const inputClass =
  "w-full border border-foreground/20 bg-background text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-foreground/40 transition-colors";

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
      title={editingItem ? "Edit Timeline Item" : "Add New Timeline Item"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          key={`title-${editingItem?.id || "new"}`}
          name="title"
          placeholder="Title"
          defaultValue={editingItem?.title || ""}
          className={inputClass}
          required
        />
        <input
          key={`date-${editingItem?.id || "new"}`}
          name="date"
          placeholder="Date (e.g. Aug. 2023 - Aug. 2024)"
          defaultValue={editingItem?.date || ""}
          className={inputClass}
          required
        />
        <textarea
          key={`description-${editingItem?.id || "new"}`}
          name="description"
          placeholder="Description"
          defaultValue={editingItem?.description || ""}
          className={`${inputClass} min-h-[100px]`}
          required
          rows={4}
        />
        <input
          key={`tags-${editingItem?.id || "new"}`}
          name="tags"
          placeholder="Tags (comma separated)"
          defaultValue={editingItem?.tags.join(", ") || ""}
          className={inputClass}
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {editingItem ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
