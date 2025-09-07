"use client";
import React, { useEffect, useState } from "react";

type TimelineItem = {
  id?: string | number;
  date: string;
  title: string;
  description: string;
  tags?: string[];
};

function Timeline() {
  const [items, setItems] = useState<TimelineItem[]>([]);

  useEffect(() => {
    fetch("/api/timeline")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Tidslinje</h2>
      <div className="w-full max-w-3xl mx-auto my-8 flex flex-col items-center">
        {items.map((item, index) => (
          <div key={item.id ?? index} className="relative w-full">
            {/* Absolutely positioned line that goes through the margin */}
            <div className="flex flex-row w-full">
              {/* Dot/line column */}
              <div className="flex flex-col items-center justify-start relative z-10 w-10">
                <div className="w-4 h-4 rounded-full bg-primary z-10 mb-4"></div>
                {/* Only render the vertical line for non-last items */}
                {index !== items.length - 1 && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-primary/40 z-0"
                    aria-hidden="true"
                  />
                )}
              </div>
              {/* Info column */}
              <div className="flex-1 flex flex-col min-w-0 pl-4 mb-12">
                <div className="text-xs font-mono text-primary whitespace-nowrap mb-1">
                  {item.date}
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-1 text-foreground/80">{item.description}</p>
                {item.tags && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
