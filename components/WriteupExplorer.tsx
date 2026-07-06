"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import type { WriteupSummary } from "@/lib/types";
import WriteupRow from "./WriteupRow";

type WriteupExplorerProps = {
  writeups: WriteupSummary[];
};

type WriteupSort = "newest" | "oldest" | "title-asc" | "title-desc";

export default function WriteupExplorer({ writeups }: WriteupExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState<WriteupSort>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = useMemo(
    () => uniqueOptions(writeups.map((writeup) => writeup.category)),
    [writeups],
  );
  const tags = useMemo(
    () => uniqueOptions(writeups.flatMap((writeup) => writeup.tags)),
    [writeups],
  );

  const filteredWriteups = useMemo(() => {
    const normalizedQuery = normalize(query);

    return writeups
      .filter((writeup) => {
        if (category !== "all" && writeup.category !== category) {
          return false;
        }
        if (tag !== "all" && !writeup.tags.includes(tag)) {
          return false;
        }
        if (!normalizedQuery) {
          return true;
        }

        return searchText([
          writeup.title,
          writeup.category,
          ...writeup.tags,
          ...propertyValues(writeup.properties),
        ]).includes(normalizedQuery);
      })
      .sort((left, right) => compareWriteups(left, right, sort));
  }, [category, query, sort, tag, writeups]);

  const hasActiveFilters =
    query.trim() !== "" || category !== "all" || tag !== "all" || sort !== "newest";
  const activeControlCount =
    Number(category !== "all") + Number(tag !== "all") + Number(sort !== "newest");

  return (
    <section className="mt-8">
      <div className="border border-border bg-surface p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="search writeups"
              className="h-10 w-full border border-border bg-code pl-10 pr-3 text-sm text-body outline-none transition placeholder:text-muted focus:border-accent/60"
              type="search"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="mono-heading whitespace-nowrap border border-border bg-code px-3 py-2 text-xs text-muted">
              {filteredWriteups.length}/{writeups.length}
            </span>
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
                setCategory("all");
                setTag("all");
                setSort("newest");
              }}
              disabled={!hasActiveFilters}
              className="grid h-10 w-10 place-items-center border border-border text-body transition hover:border-accent/60 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-body"
              aria-label="Reset writeup filters"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {filtersOpen ? (
          <div className="mt-3 grid gap-3 border-t border-border pt-3 sm:grid-cols-3">
            <select
              aria-label="Filter writeups by category"
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
              aria-label="Filter writeups by tag"
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
              aria-label="Sort writeups"
              value={sort}
              onChange={(event) => setSort(event.target.value as WriteupSort)}
              className="h-10 border border-border bg-code px-3 text-sm text-body outline-none transition focus:border-accent/60"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        {filteredWriteups.length > 0 ? (
          filteredWriteups.map((writeup) => (
            <WriteupRow key={writeup.id} writeup={writeup} />
          ))
        ) : (
          <p className="border border-border bg-surface p-5 text-sm text-muted xl:col-span-2">
            No writeups match these filters.
          </p>
        )}
      </div>
    </section>
  );
}

function compareWriteups(
  left: WriteupSummary,
  right: WriteupSummary,
  sort: WriteupSort,
) {
  if (sort === "title-asc") {
    return left.title.localeCompare(right.title);
  }
  if (sort === "title-desc") {
    return right.title.localeCompare(left.title);
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

function propertyValues(
  properties: WriteupSummary["properties"],
): string[] {
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
