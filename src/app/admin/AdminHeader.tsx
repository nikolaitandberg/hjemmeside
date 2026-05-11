"use client";
import { useDisplayMode } from "@/app/components/ThemeProvider";
import LogoutButton from "./LogoutButton";
import { Button } from "@/components/ui/button";

export default function AdminHeader({ email }: { email: string }) {
  const { mode, toggleMode } = useDisplayMode();

  return (
    <div className="flex flex-wrap justify-between items-end gap-3 mb-3 border-b border-foreground/40 pb-2">
      <div>
        <h1 className="text-3xl text-accent-yellow crt-glow-strong uppercase tracking-wider">
          ▓▒░ ADMIN.EXE ░▒▓
        </h1>
        <p className="mt-0.5 text-base text-accent-cyan crt-glow">
          Logged in as: {email}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={toggleMode}>
          [F10] {mode === "crt" ? "Accessible" : "CRT"} Mode
        </Button>
        <LogoutButton />
      </div>
    </div>
  );
}
