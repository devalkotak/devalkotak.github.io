import projectsPayload from "@/content/generated/projects.json";
import type { PortfolioProject, ProjectLoadState } from "./types";

type ProjectsPayload = {
  generatedAt: string;
  error: string | null;
  projects: PortfolioProject[];
};

const payload = projectsPayload as ProjectsPayload;

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  return payload.projects;
}

export async function getPortfolioProjectState(): Promise<ProjectLoadState> {
  return {
    projects: payload.projects,
    error: payload.error,
  };
}
