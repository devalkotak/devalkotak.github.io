"use client";

import { useMemo, useState } from "react";
import { ExternalLink, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import type { ResourceItem } from "@/lib/types";

type ResourceExplorerProps = {
  resources: ResourceItem[];
};

type ResourceSort = "title-asc" | "title-desc" | "kind" | "newest" | "oldest";

export default function ResourceExplorer({ resources }: ResourceExplorerProps) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState<ResourceSort>("title-asc");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const kinds = useMemo(
    () => uniqueOptions(resources.map((resource) => resource.kind)),
    [resources],
  );
  const categories = useMemo(
    () => uniqueOptions(resources.map((resource) => resource.category)),
    [resources],
  );
  const tags = useMemo(
    () => uniqueOptions(resources.flatMap((resource) => resource.tags)),
    [resources],
  );

  const filteredResources = useMemo(() => {
    const normalizedQuery = normalize(query);

    return resources
      .filter((resource) => {
        if (kind !== "all" && resource.kind !== kind) {
          return false;
        }
        if (category !== "all" && resource.category !== category) {
          return false;
        }
        if (tag !== "all" && !resource.tags.includes(tag)) {
          return false;
        }
        if (!normalizedQuery) {
          return true;
        }

        return searchText([
          resource.title,
          resource.description,
          resource.kind,
          resource.category,
          resource.href ?? "",
          ...resource.tags,
          ...propertyValues(resource.properties),
        ]).includes(normalizedQuery);
      })
      .sort((left, right) => compareResources(left, right, sort));
  }, [category, kind, query, resources, sort, tag]);

  const hasActiveFilters =
    query.trim() !== "" ||
    kind !== "all" ||
    category !== "all" ||
    tag !== "all" ||
    sort !== "title-asc";
  const activeControlCount =
    Number(kind !== "all") +
    Number(category !== "all") +
    Number(tag !== "all") +
    Number(sort !== "title-asc");

  return (
    <section className="mt-8">
      <div className="panel-3d border border-border p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="search resources"
              className="h-10 w-full border border-border bg-code pl-10 pr-3 text-sm text-body outline-none transition placeholder:text-muted focus:border-accent/60"
              type="search"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {hasActiveFilters ? (
              <span className="mono-heading whitespace-nowrap border border-border bg-code px-3 py-2 text-xs text-muted">
                {filteredResources.length}/{resources.length}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => setFiltersOpen((value) => !value)}
              className="inline-flex h-10 items-center gap-2 border border-border px-3 text-sm text-body transition hover:border-accent/60 hover:text-accent"
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeControlCount > 0 ? (
                <span className="mono-heading text-accent">{activeControlCount}</span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setKind("all");
                setCategory("all");
                setTag("all");
                setSort("title-asc");
              }}
              disabled={!hasActiveFilters}
              className="grid h-10 w-10 place-items-center border border-border text-body transition hover:border-accent/60 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-body"
              aria-label="Reset resource filters"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {filtersOpen ? (
          <div className="mt-3 grid gap-3 border-t border-border pt-3 sm:grid-cols-2 lg:grid-cols-4">
            <select
              aria-label="Filter resources by kind"
              value={kind}
              onChange={(event) => setKind(event.target.value)}
              className="h-10 border border-border bg-code px-3 text-sm text-body outline-none transition focus:border-accent/60"
            >
              <option value="all">All kinds</option>
              {kinds.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter resources by category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-10 border border-border bg-code px-3 text-sm text-body outline-none transition focus:border-accent/60"
            >
              <option value="all">All categories</option>
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter resources by tag"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              className="h-10 border border-border bg-code px-3 text-sm text-body outline-none transition focus:border-accent/60"
            >
              <option value="all">All tags</option>
              {tags.map((value) => (
                <option key={value} value={value}>
                  #{value}
                </option>
              ))}
            </select>

            <select
              aria-label="Sort resources"
              value={sort}
              onChange={(event) => setSort(event.target.value as ResourceSort)}
              className="h-10 border border-border bg-code px-3 text-sm text-body outline-none transition focus:border-accent/60"
            >
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="kind">Kind</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        ) : null}
      </div>

      {filteredResources.length === 0 ? (
        <p className="mt-6 border border-border bg-surface p-5 text-sm text-muted">
          {resources.length === 0
            ? "No resources published yet."
            : "No resources match these filters."}
        </p>
      ) : null}

      {filteredResources.length > 0 ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource) => (
            <ResourceRow key={resource.id} resource={resource} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ResourceRow({ resource }: { resource: ResourceItem }) {
  const content = (
    <>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="mono-heading border border-accent/30 bg-[var(--color-accent-muted)] px-2 py-1 text-[11px] text-accent">
            {resource.kind}
          </span>
          <span className="border border-border bg-code px-2 py-1 text-[11px] text-muted">
            {resource.category}
          </span>
        </span>
        <span className="mt-3 block text-sm font-medium text-foreground transition group-hover:text-accent">
          {resource.title}
        </span>
        <span className="mt-2 block text-sm leading-6 text-muted">
          {resource.description}
        </span>
        {resource.tags.length > 0 ? (
          <span className="mt-3 flex flex-wrap gap-2">
            {resource.tags.map((resourceTag) => (
              <span key={resourceTag} className="text-xs text-muted">
                #{resourceTag}
              </span>
            ))}
          </span>
        ) : null}
      </span>
      {resource.href ? (
        <ExternalLink
          size={15}
          className="mt-1 shrink-0 text-muted transition group-hover:text-accent"
        />
      ) : null}
    </>
  );

  if (resource.href) {
    return (
      <a
        href={resource.href}
        target="_blank"
        rel="noopener noreferrer"
        className="panel-3d group flex min-h-40 items-start justify-between gap-4 border border-border p-5 transition hover:border-accent/50"
      >
        {content}
      </a>
    );
  }

  return (
    <article className="panel-3d flex min-h-40 items-start justify-between gap-4 border border-border p-5">
      {content}
    </article>
  );
}

function compareResources(left: ResourceItem, right: ResourceItem, sort: ResourceSort) {
  if (sort === "title-asc") {
    return left.title.localeCompare(right.title);
  }
  if (sort === "title-desc") {
    return right.title.localeCompare(left.title);
  }
  if (sort === "kind") {
    return (
      left.kind.localeCompare(right.kind) ||
      left.category.localeCompare(right.category) ||
      left.title.localeCompare(right.title)
    );
  }

  const leftTime = Date.parse(left.date) || 0;
  const rightTime = Date.parse(right.date) || 0;
  return sort === "oldest" ? leftTime - rightTime : rightTime - leftTime;
}

function uniqueOptions(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((left, right) =>
    left.localeCompare(right),
  );
}

function searchText(values: string[]) {
  return normalize(values.join(" "));
}

function propertyValues(properties: ResourceItem["properties"]): string[] {
  if (!properties) {
    return [];
  }

  return Object.values(properties).flatMap((value) => {
    if (Array.isArray(value)) {
      return value.map(String);
    }
    return value == null ? [] : [String(value)];
  });
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}
