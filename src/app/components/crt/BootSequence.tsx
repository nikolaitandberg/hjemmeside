"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  "Pheonix BIOS 4.0 Release 6.0",
  "Copyright 1985-1995 Phoenix Technologies Ltd.",
  "",
  "CPU = 386DX-40MHz",
  "640K Base Memory, 7168K Extended",
  "",
  "Detecting IDE drives ...",
  "  Master: NIKOLAI.SYS  (12.21.2004)",
  "  Slave : PROJECTS.DAT",
  "",
  "Initializing TIMELINE.SYS ............ [ OK ]",
  "Initializing PROJECTS.SYS ............ [ OK ]",
  "Loading NIKOLAI shell v1.0 ........... [ OK ]",
  "",
  "Starting MS-DOS ...",
];

const STORAGE_KEY = "boot-sequence-seen";

export default function BootSequence() {
  const [visible, setVisible] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (lineCount >= BOOT_LINES.length) {
      const t = setTimeout(() => setDone(true), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLineCount((n) => n + 1), 130);
    return () => clearTimeout(t);
  }, [visible, lineCount]);

  useEffect(() => {
    if (!visible) return;
    const skip = () => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setDone(true);
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, [visible]);

  useEffect(() => {
    if (done) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      const t = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(t);
    }
  }, [done]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-black text-accent-green crt-glow font-[var(--font-vt323)] text-[20px] leading-snug p-6 transition-opacity duration-200 ${
        done ? "opacity-0" : "opacity-100"
      }`}
      style={{ fontFamily: "var(--font-vt323), monospace" }}
      role="status"
      aria-label="Boot sequence"
    >
      <div className="max-w-3xl">
        {BOOT_LINES.slice(0, lineCount).map((line, i) => (
          <div key={i} className="whitespace-pre">
            {line || " "}
          </div>
        ))}
        {lineCount < BOOT_LINES.length && <span className="crt-cursor" />}
      </div>
      <div className="absolute bottom-4 right-6 text-xs opacity-60">
        Press any key to skip
      </div>
    </div>
  );
}
