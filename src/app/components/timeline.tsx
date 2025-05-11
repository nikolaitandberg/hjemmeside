import React from "react";

type TimelineItem = {
  date: string;
  title: string;
  description: string;
  tags?: string[];
};

type TimelineProps = {
  items: TimelineItem[];
};

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      {items.map((item, index) => (
        <div key={index} className="mb-12 relative">
          {/* Timeline line */}
          {index < items.length - 1 && (
            <div className="absolute left-[7px] top-6 w-[2px] h-full bg-primary/30"></div>
          )}

          {/* Content */}
          <div className="flex gap-6">
            {/* Circle and date */}
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-primary mt-1"></div>
              <div className="text-sm font-mono mt-2 text-primary">
                {item.date}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
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
  );
};

export default Timeline;
