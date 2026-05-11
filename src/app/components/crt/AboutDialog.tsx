"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AboutDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-about", handler);
    return () => window.removeEventListener("open-about", handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="p-0 w-auto min-w-64 sm:max-w-sm gap-0"
      >
        <div className="bg-accent-yellow text-black px-2 py-0.5 flex items-center justify-between gap-4">
          <DialogTitle className="text-base font-bold uppercase tracking-wider">
            ▓▒░ ABOUT NIKOLAI.SYS ░▒▓
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              className="px-1 border border-black font-bold hover:bg-black hover:text-accent-yellow leading-none text-lg"
            >
              ×
            </button>
          </DialogClose>
        </div>
        <div className="bg-window text-black p-4 font-[var(--font-vt323)] text-base crt-bevel-out space-y-1">
          <div className="text-xl font-bold uppercase tracking-wide">
            NIKOLAI.SYS&nbsp;&nbsp;v1.0
          </div>
          <div>(c) 2026 Nikolai Tandberg</div>
          <div className="border-t border-black/20 pt-2 mt-2 space-y-0.5 text-sm">
            <div>STACK: Next.js · Tailwind CSS · Prisma · shadcn</div>
            <div className="opacity-60">
              [F10] = Toggle CRT / Accessible mode
            </div>
          </div>
          <div className="pt-3 flex justify-center">
            <DialogClose asChild>
              <Button>[ OK ]</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
