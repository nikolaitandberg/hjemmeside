import { cn } from "@/lib/utils";

interface PromptProps {
  path?: string;
  command: string;
  showCursor?: boolean;
  className?: string;
}

/**
 * Renders a DOS-style prompt line: `C:\PATH> command`
 * Use as a section header to introduce content via the terminal metaphor.
 */
export default function Prompt({
  path = "C:\\NIKOLAI",
  command,
  showCursor = false,
  className,
}: PromptProps) {
  return (
    <div className={cn("crt-glow font-mono", className)}>
      <span className="text-accent-yellow">{path}&gt;</span>{" "}
      <span className="text-foreground">{command}</span>
      {showCursor && <span className="crt-cursor" />}
    </div>
  );
}
