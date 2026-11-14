import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Star } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import PageHeader from "@/components/PageHeader";
import { getPortfolioProjectState } from "@/lib/github";
import { CASE_STUDIES, HOBBIES } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Security tooling, market experiments and everything else, pulled from GitHub at build time.",
};

// Repos that already have a story on the homepage, found from the links the
// homepage cards carry, so this list never has to be kept in sync by hand.
const STORIES = new Map<string, { href: string; label: string }>([
  ...CASE_STUDIES.flatMap((study) =>
    study.link ? [[repoName(study.link.href), { href: `/#case-${study.slug}`, label: "Case study" }] as const] : [],
  ),
  ...HOBBIES.flatMap((hobby) =>
    hobby.link ? [[repoName(hobby.link.href), { href: `/#hobby-${hobby.slug}`, label: "Why I built it" }] as const] : [],
  ),
]);

function repoName(url: string) {
  return url.replace(/\/+$/, "").split("/").pop()?.toLowerCase() ?? "";
}

export default async function ProjectsPage() {
  const { projects, error } = await getPortfolioProjectState();
  // No ranking: every repo appears in the order GitHub returns it.
  const ordered = projects;

  return (
    <AnimatedPage className="wide-shell">
      <PageHeader
        crumbs={[{ label: "Projects" }]}
        title="Code that"
        accent="made it out."
        intro="Every public repo, pulled from GitHub at build time. Nothing here is a stale screenshot or a description someone forgot to update."
        aside={
          projects.length > 0 && (
            <span className="label-text text-xs text-muted">
              {projects.length} public repos
            </span>
          )
        }
      />

      {error ? (
        <p className="mt-7 sm:mt-10 border border-border bg-surface p-5 text-sm text-muted">
          Couldn’t reach GitHub during the last build: {error}
        </p>
      ) : ordered.length > 0 ? (
        <div className="mt-7 sm:mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((project) => {
            const story = STORIES.get(project.name.toLowerCase());
            return (
              <article
                key={project.id}
                className="panel-3d group flex flex-col border border-border p-5 transition hover:border-accent/40"
              >
                <div className="flex items-baseline justify-end gap-3 empty:hidden">
                </div>
                <h2 className="display-heading mt-3 break-words text-lg leading-snug text-foreground">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-accent"
                  >
                    {project.name}
                  </a>
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {project.description || "No description yet."}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                  {project.language && (
                    <span className="label-text border border-border px-2 py-0.5 text-xs text-body">
                      {project.language}
                    </span>
                  )}
                  {project.topics
                    .filter((topic) => topic.toLowerCase() !== project.language?.toLowerCase())
                    .slice(0, 2)
                    .map((topic) => (
                    <span
                      key={topic}
                      className="label-text border border-border px-2 py-0.5 text-xs text-muted"
                    >
                      {topic}
                    </span>
                  ))}
                  {project.stars > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                      <Star size={12} />
                      {project.stars}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-body transition hover:text-accent"
                  >
                    GitHub
                    <ArrowUpRight size={14} />
                  </a>
                  {story && (
                    <Link
                      href={story.href}
                      className="inline-flex items-center gap-1.5 text-accent transition hover:text-foreground"
                    >
                      {story.label}
                      <ArrowDownRight size={14} />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-7 sm:mt-10 border border-border bg-surface p-5 text-sm text-muted">
          No public repos to show yet.
        </p>
      )}
    </AnimatedPage>
  );
}
