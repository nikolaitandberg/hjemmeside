"use client";

import { useEffect, useState } from "react";

interface StatusBarItem {
  key: string;
  label: string;
}

const ITEMS: StatusBarItem[] = [
  { key: "F1", label: "Help" },
  { key: "F2", label: "GitHub" },
  { key: "F3", label: "Mail" },
  { key: "F4", label: "LinkedIn" },
  { key: "F10", label: "Display" },
];

export default function StatusBar() {
  const [clock, setClock] = useState("");

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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-muted-chrome text-black border-t-2 border-black crt-bevel-out-thin px-2 py-0.5 flex items-center justify-between gap-3 text-base">
      <div className="flex items-center gap-2 overflow-x-auto">
        {ITEMS.map((item) => (
          <span key={item.key} className="whitespace-nowrap">
            <span className="bg-black text-accent-yellow px-1 mr-1">
              {item.key}
            </span>
            {item.label}
          </span>
        ))}
      </div>
      <div className="shrink-0 font-mono tabular-nums">
        {clock || "--:--:--"}
      </div>
    </div>
  );
}
