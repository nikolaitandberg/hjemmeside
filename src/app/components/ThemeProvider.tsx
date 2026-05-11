"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type DisplayMode = "crt" | "accessible";

interface ThemeContextType {
  mode: DisplayMode;
  setMode: (mode: DisplayMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "display-mode";

function applyMode(mode: DisplayMode) {
  const root = document.documentElement;
  root.classList.toggle("crt", mode === "crt");
  root.classList.toggle("accessible", mode === "accessible");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<DisplayMode>("crt");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const saved = (
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    ) as DisplayMode | null;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const initial: DisplayMode =
      saved ?? (prefersReducedMotion ? "accessible" : "crt");
    setModeState(initial);
    applyMode(initial);
  }, []);

  const setMode = (next: DisplayMode) => {
    setModeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyMode(next);
  };

  const toggleMode = () => setMode(mode === "crt" ? "accessible" : "crt");

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useDisplayMode() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return {
      mode: "crt" as DisplayMode,
      setMode: () => {},
      toggleMode: () => {},
    };
  }
  return context;
}
