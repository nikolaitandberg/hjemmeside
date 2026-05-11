"use client";

import { useEffect, useRef, useState } from "react";
import { useDisplayMode } from "../ThemeProvider";

const GITHUB_URL = "https://github.com/nikolaitandberg";
const LINKEDIN_URL = "https://linkedin.com/in/nikolaitandberg";
const MAIL_URL = "mailto:nikolai.tandbe@gmail.com";

function FKey({
  fkey,
  label,
  onClick,
}: {
  fkey: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="whitespace-nowrap hover:bg-blue-700 hover:text-white px-0.5 transition-none cursor-pointer"
    >
      <span className="bg-black text-accent-yellow px-1 mr-0.5">{fkey}</span>
      {label}
    </button>
  );
}

export default function StatusBar() {
  const [clock, setClock] = useState("");
  const { toggleMode } = useDisplayMode();
  const toggleModeRef = useRef(toggleMode);

  useEffect(() => {
    toggleModeRef.current = toggleMode;
  }, [toggleMode]);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      setClock(`${hh}:${mm}:${ss}`);
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "F1":
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("open-about"));
          break;
        case "F2":
          e.preventDefault();
          window.open(GITHUB_URL, "_blank", "noopener,noreferrer");
          break;
        case "F3":
          e.preventDefault();
          window.open(MAIL_URL);
          break;
        case "F4":
          e.preventDefault();
          window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer");
          break;
        case "F10":
          e.preventDefault();
          toggleModeRef.current();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-muted-chrome text-black border-t-2 border-black crt-bevel-out-thin px-2 py-0.5 flex items-center gap-3 text-base">
      <span className="shrink-0 text-sm opacity-50 hidden sm:inline select-none tracking-tight font-[var(--font-ibm-plex-mono)]">
        C:\NIKOLAI&gt;
      </span>
      <div className="flex items-center gap-1 overflow-x-auto flex-1">
        <FKey
          fkey="F1"
          label="Help"
          onClick={() => window.dispatchEvent(new CustomEvent("open-about"))}
        />
        <FKey
          fkey="F2"
          label="GitHub"
          onClick={() =>
            window.open(GITHUB_URL, "_blank", "noopener,noreferrer")
          }
        />
        <FKey fkey="F3" label="Mail" onClick={() => window.open(MAIL_URL)} />
        <FKey
          fkey="F4"
          label="LinkedIn"
          onClick={() =>
            window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer")
          }
        />
        <FKey fkey="F10" label="Display" onClick={toggleMode} />
      </div>
      <div className="shrink-0 font-mono tabular-nums text-sm">
        {clock || "--:--:--"}
      </div>
    </div>
  );
}
