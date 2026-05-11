"use client";
import type { TimelineItem } from "@/types";
import { Button } from "@/components/ui/button";

interface Props {
  item: TimelineItem;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export default function TimelineCard({
  item,
  onEdit,
  onArchive,
  onDelete,
}: Props) {
  return (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-accent-yellow">[{item.date}]</span>
          <span className="font-bold uppercase tracking-wide text-foreground">
            {item.title}
          </span>
          {item.archived && (
            <span className="text-xs uppercase bg-accent-red text-white px-1.5 border border-black">
              ARCHIVED
            </span>
          )}
        </div>
        <p className="text-base text-foreground/80 line-clamp-1">
          {item.description}
        </p>
      </div>
      <div className="flex gap-1 shrink-0 flex-wrap">
        <Button variant="outline" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="outline" onClick={onArchive}>
          {item.archived ? "Unarchive" : "Archive"}
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Del
        </Button>
      </div>
    </>
  );
}
