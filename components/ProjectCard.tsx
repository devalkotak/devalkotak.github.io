"use client";

import { ExternalLink, FolderGit2, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { PortfolioProject } from "@/lib/types";

type ProjectCardProps = {
  project: PortfolioProject;
};

const languageColors: Record<string, string> = {
  Python: "#3572a5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  SQL: "#dad8d8",
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const languageColor = project.language
    ? languageColors[project.language] ?? "#666666"
    : "#666666";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.5 }}
      className="panel-3d group flex min-h-48 flex-col justify-between border border-border p-5 hover:border-accent/40"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <h2 className="mono-heading break-words text-base font-semibold text-foreground">
            {project.name}
          </h2>
          <FolderGit2 className="mt-0.5 shrink-0 text-muted group-hover:text-accent" size={17} />
        </div>
        <p className="mt-4 text-sm leading-6 text-body">{project.description}</p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 text-xs text-muted">
        <div className="flex min-w-0 items-center gap-3">
          {project.language ? (
            <span className="inline-flex min-w-0 items-center gap-2">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: languageColor }}
              />
              <span className="truncate">{project.language}</span>
            </span>
          ) : null}
          {project.stars > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Star size={13} />
              {project.stars}
            </span>
          ) : null}
        </div>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-body transition hover:text-accent"
        >
          GitHub
          <ExternalLink size={13} />
        </a>
      </div>
    </motion.article>
  );
}
