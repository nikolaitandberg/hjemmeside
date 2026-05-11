"use client";

import {
  Dialog as ShadDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Dialog({
  isOpen,
  onClose,
  title,
  children,
}: DialogProps) {
  return (
    <ShadDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader className="bg-accent-yellow text-black border-b border-black px-2 py-0.5 flex flex-row items-center justify-between">
          <DialogTitle className="uppercase tracking-wider font-bold text-base">
            ▓▒░ {title} ░▒▓
          </DialogTitle>
        </DialogHeader>
        <div className="p-3 bg-window text-window-foreground">{children}</div>
      </DialogContent>
    </ShadDialog>
  );
}
