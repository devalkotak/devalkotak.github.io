"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Search } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { BlogEntry, TrackGroup } from "@/lib/blog-meta";

const ALL = "all";

/**
 * Blog index: a row of track cards that jump to their section, then every
 * entry grouped by track. Groups, topics and filters all come from the data,
 * so a page published under a new source or tag shows up on its own.
 */
export default function BlogIndex({ groups }: { groups: TrackGroup[] }) {
  const [filter, setFilter] = useState<string>(ALL);
  const [query, setQuery] = useState("");

  const total = groups.reduce((sum, group) => sum + group.entries.length, 0);
  const withEntries = useMemo(() => groups.filter((group) => group.entries.length > 0), [groups]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return withEntries
      .filter((group) => filter === ALL || group.id === filter)
      .map((group) => ({
        ...group,
        entries: needle
          ? group.entries.filter((entry) =>
              [entry.title, entry.category, entry.topic ?? "", ...entry.tags, ...entry.covers]
                .join(" ")
                .toLowerCase()
                .includes(needle),
            )
          : group.entries,
      }))
      .filter((group) => group.entries.length > 0);
  }, [withEntries, filter, query]);

  // Cards always land on their section, so clear anything that would hide it first.
  function jumpTo(id: string) {
    setFilter(ALL);
    setQuery("");
    requestAnimationFrame(() => document.getElementById(`track-${id}`)?.scrollIntoView({ behavior: "smooth" }));
  }

  return (
    <div>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
        {groups
          .filter((group) => group.featured)
          .map((group, index) => (
            <TrackCard key={group.id} group={group} index={index} onJump={() => jumpTo(group.id)} />
          ))}
      </div>

      <section className="mt-16 sm:mt-20" aria-labelledby="index-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="index-heading" className="display-heading text-2xl text-foreground sm:text-3xl">
            Every entry
          </h2>
          <label className="relative block w-full sm:w-72">
            <span className="sr-only">Search writeups</span>
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, tags, topics"
              className="h-10 w-full rounded-full border border-border bg-transparent pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent/60 focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by track">
          <Chip active={filter === ALL} onClick={() => setFilter(ALL)} label="All" count={total} />
          {withEntries.map((group) => (
            <Chip
              key={group.id}
              active={filter === group.id}
              onClick={() => setFilter(group.id)}
              label={group.name}
              count={group.entries.length}
            />
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mt-8 text-sm text-muted">Nothing matches &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="mt-10 space-y-14">
            {visible.map((group) => (
              <div key={group.id} id={`track-${group.id}`} className="scroll-mt-24">
                <GroupHeading group={group} />
                {group.id === "wsa" ? (
                  <TopicGroups entries={group.entries} />
                ) : group.id === "bandit" ? (
                  <LevelTiles entries={group.entries} />
                ) : (
                  <EntryRows entries={group.entries} />
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TrackCard({ group, index, onJump }: { group: TrackGroup; index: number; onJump: () => void }) {
  const count = group.entries.length;
  const body = (
    <>
      <span className="flex items-start justify-between gap-3">
        <span className="label-text text-xs text-accent">{group.source}</span>
        <span className="display-heading text-sm text-foreground/30" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </span>
      <span className="display-heading mt-8 block text-[1.35rem] leading-tight text-foreground">{group.name}</span>
      <span className="mt-2 block text-sm leading-6 text-muted">{group.blurb}</span>
      <span className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm">
        {count > 0 ? (
          <>
            <span className="text-body">
              <span className="font-semibold text-signal">{count}</span> {count === 1 ? "entry" : "entries"}
            </span>
            <span className="grid size-8 place-items-center rounded-full border border-accent/40 text-accent transition group-hover:border-accent group-hover:bg-accent group-hover:text-background">
              <ArrowDown size={15} />
            </span>
          </>
        ) : (
          <span className="label-text text-xs text-muted">First posts soon</span>
        )}
      </span>
    </>
  );

  const shell =
    "track-card group flex min-h-[15rem] w-[78%] shrink-0 snap-start flex-col p-5 text-left transition sm:w-[45%] md:w-auto";

  return count > 0 ? (
    <a
      href={`#track-${group.id}`}
      onClick={(event) => {
        event.preventDefault();
        onJump();
      }}
      className={`${shell} hover:-translate-y-0.5 hover:border-accent/60 hover:bg-surfaceHover`}
    >
      {body}
    </a>
  ) : (
    // Not faded: dimming the whole card made its text hard to read.
    <div className={`${shell} border-dashed before:hidden`}>{body}</div>
  );
}

function GroupHeading({ group }: { group: TrackGroup }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-border pb-3">
      <h3 className="display-heading text-xl text-foreground">{group.name}</h3>
      <span className="label-text text-xs text-accent">{group.source}</span>
      <span className="label-text ml-auto text-xs text-muted">{group.entries.length}</span>
    </div>
  );
}

/** Web Security Academy: one block per vulnerability class, notes first, then its labs. */
function TopicGroups({ entries }: { entries: BlogEntry[] }) {
  const topics = new Map<string, BlogEntry[]>();
  for (const entry of entries) {
    const topic = entry.topic ?? "Other";
    topics.set(topic, [...(topics.get(topic) ?? []), entry]);
  }

  return (
    <div className="space-y-8">
      {Array.from(topics.entries()).map(([topic, items]) => {
        const notes = items.filter((entry) => entry.kind === "notes");
        const labs = items.filter((entry) => entry.kind !== "notes");
        return (
          <div key={topic} className="pt-5">
            <p className="label-text flex items-baseline gap-3 text-xs text-muted">
              <span className="text-foreground">{topic}</span>
              {notes.length > 0 && <span>notes</span>}
              {labs.length > 0 && (
                <span>
                  {labs.length} {labs.length === 1 ? "lab" : "labs"}
                </span>
              )}
            </p>
            {notes.length > 0 && <EntryRows entries={notes} />}
            {labs.length > 0 && <LabTiles entries={labs} />}
          </div>
        );
      })}
    </div>
  );
}

function EntryRows({ entries }: { entries: BlogEntry[] }) {
  return (
    <ol className="mt-2 divide-y divide-border">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link
            href={`/blog/${entry.slug}`}
            className="group -mx-3 grid grid-cols-[1fr_auto] gap-x-4 rounded-2xl px-3 py-5 transition hover:bg-surface"
          >
            <span className="min-w-0">
              <span className="display-heading block text-lg leading-snug text-foreground transition group-hover:text-accent">
                {entry.title}
              </span>
              {entry.covers.length > 0 && (
                <span className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-6 text-muted">
                  {entry.covers.join(" · ")}
                </span>
              )}
              <span className="label-text mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                <span>{entry.minutes} min read</span>
              </span>
            </span>
            <ArrowUpRight
              size={16}
              className="mt-1.5 text-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            />
          </Link>
        </li>
      ))}
    </ol>
  );
}

function LabTiles({ entries }: { entries: BlogEntry[] }) {
  return (
    <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link
            href={`/blog/${entry.slug}`}
            className="group flex h-full flex-col gap-2 rounded-xl border border-border p-3.5 transition hover:border-accent/50 hover:bg-surface"
          >
            <span className="text-sm font-medium leading-snug text-foreground transition group-hover:text-accent">
              {entry.title}
            </span>
            <span className="label-text mt-auto flex justify-between text-[11px] text-muted">
              <span>{entry.category}</span>
              <span>{entry.minutes} min</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function LevelTiles({ entries }: { entries: BlogEntry[] }) {
  return (
    <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link
            href={`/blog/${entry.slug}`}
            className="group flex h-full items-center justify-between gap-2 rounded-xl border border-border px-3.5 py-3 transition hover:border-accent/50 hover:bg-surface"
          >
            <span className="text-sm font-medium text-foreground transition group-hover:text-accent">
              {entry.level !== undefined ? `Level ${entry.level} → ${entry.level + 1}` : entry.title}
            </span>
            <span className="label-text text-[11px] text-muted">{entry.minutes} min</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function Chip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`label-text inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
        active
          ? "border-accent/70 bg-[var(--color-accent-muted)] text-accent"
          : "border-border text-muted hover:border-accent/40 hover:text-accent"
      }`}
    >
      {label}
      <span className={active ? "text-accent" : "text-muted"}>{count}</span>
    </button>
  );
}
