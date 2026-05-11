import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  title: string;
  className?: string;
  bodyClassName?: string;
  footer?: React.ReactNode;
  buttons?: ("min" | "max" | "close")[];
  variant?: "window" | "screen";
  children: React.ReactNode;
}

/**
 * DOS / Win 3.1-style window chrome with title bar and beveled body.
 *
 * - `window` variant: grey body, black text (Norton Commander dialog look).
 * - `screen` variant: blue body, white text (looks like a console window).
 */
export default function TerminalWindow({
  title,
  className,
  bodyClassName,
  footer,
  buttons = ["close"],
  variant = "window",
  children,
}: TerminalWindowProps) {
  const isScreen = variant === "screen";
  return (
    <div
      className={cn(
        "border border-black crt-bevel-out shadow-[4px_4px_0_0_var(--shadow)]",
        isScreen
          ? "bg-background text-foreground"
          : "bg-window text-window-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between bg-accent-yellow text-black border-b border-black px-2 py-0.5">
        <span className="font-bold uppercase tracking-wider truncate">
          ▓▒░ {title} ░▒▓
        </span>
        <span className="flex gap-1 shrink-0">
          {buttons.includes("min") && <WindowButton label="_" />}
          {buttons.includes("max") && <WindowButton label="■" />}
          {buttons.includes("close") && <WindowButton label="X" />}
        </span>
      </div>
      <div className={cn("p-3", bodyClassName)}>{children}</div>
      {footer && (
        <div className="border-t border-black px-2 py-0.5 text-sm bg-muted-chrome text-black crt-bevel-in-thin">
          {footer}
        </div>
      )}
    </div>
  );
}

function WindowButton({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center w-4 h-4 bg-window text-black border border-black crt-bevel-out-thin text-xs leading-none"
    >
      {label}
    </span>
  );
}
