"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/components/ThemeProvider";
import LogoutButton from "./LogoutButton";

export default function AdminHeader({ email }: { email: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex justify-between items-start mb-1">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-foreground/50">Welcome, {email}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <LogoutButton />
      </div>
    </div>
  );
}
