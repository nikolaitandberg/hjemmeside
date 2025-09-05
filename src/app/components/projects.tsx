"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
};

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<string>("");

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        setActiveProject(data[0]?.id || "");
      }
    }
    fetchProjects();
  }, []);

  if (projects.length === 0) {
    return <div className="w-full">Ingen prosjekter funnet.</div>;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Prosjekter</h2>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-foreground/10">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => setActiveProject(project.id)}
            className={`px-4 py-2 rounded-t-md transition-colors duration-300 ease-in-out
              ${
                activeProject === project.id
                  ? "bg-secondary/10 text-secondary border-b-2 border-secondary"
                  : "hover:bg-secondary/5"
              }`}
          >
            {project.title}
          </button>
        ))}
      </div>

      {projects.map((project) => (
        <div
          key={project.id}
          className={`${activeProject === project.id ? "block" : "hidden"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {project.imageUrl && (
              <div className="border border-foreground/10 rounded-md overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-auto"
                />
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="mb-4 text-foreground/80">{project.description}</p>

              <div className="mb-6">
                <h4 className="text-sm font-bold mb-2">Teknologier</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity duration-300"
                  >
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary text-background rounded-md hover:opacity-90 transition-opacity duration-300"
                  >
                    Vis prosjekt
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Projects;
