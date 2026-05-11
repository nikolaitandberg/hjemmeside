import type { TimelineItem } from "@/types";
import { Badge } from "@/components/ui/badge";

/**
 * Renders the timeline as a DOS `dir /s` tree listing.
 * Each item is a "folder" with date, title, description, and tag badges.
 */
export default function Timeline({ items }: { items: TimelineItem[] }) {
  if (!items.length) {
    return (
      <div className="text-foreground crt-glow">
        File not found: TIMELINE\*.*
      </div>
    );
  }

  return (
    <div className="w-full font-[var(--font-vt323)] text-foreground crt-glow">
      <div className="text-base mb-2 text-accent-cyan">
        Directory of C:\NIKOLAI\TIMELINE
      </div>
      <ul className="space-y-1 max-h-80 overflow-y-auto pr-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const branch = isLast ? "└──" : "├──";
          const stem = isLast ? "   " : "│  ";
          return (
            <li key={item.id} className="leading-tight">
              <div className="flex items-baseline gap-2">
                <span className="text-accent-yellow whitespace-pre">
                  {branch}
                </span>
                <span className="text-accent-yellow font-bold">
                  [{item.date}]
                </span>
                <span className="text-foreground font-bold uppercase tracking-wide">
                  {item.title}
                </span>
              </div>
              <div className="ml-6 flex">
                <span className="text-accent-yellow whitespace-pre">
                  {stem}
                </span>
                <p className="ml-1 text-foreground/95">{item.description}</p>
              </div>
              {item.tags.length > 0 && (
                <div className="ml-6 flex items-start">
                  <span className="text-accent-yellow whitespace-pre">
                    {stem}
                  </span>
                  <div className="ml-1 flex flex-wrap gap-1.5 mb-2">
                    {item.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-base text-dim">
        {items.length} folder(s) listed. 640K bytes free.
      </div>
    </div>
  );
}
