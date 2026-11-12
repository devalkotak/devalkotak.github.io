"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Concept, MethodStep } from "@/lib/home-content";

type MethodFlowProps = {
  steps: MethodStep[];
  concepts: Concept[];
};

/**
 * Six-step chain plus a concept grid. Picking a step highlights the concepts
 * it leans on; picking a concept shows its take and where it was used. On
 * wide screens the detail sits in a sticky side panel; on narrow screens it
 * opens directly under the card that was tapped, so it never lands off screen.
 */
export default function MethodFlow({ steps, concepts }: MethodFlowProps) {
  const [step, setStep] = useState(0);
  const [conceptName, setConceptName] = useState(steps[0].concepts[0]);

  const groups = useMemo(() => {
    const map = new Map<string, Concept[]>();
    for (const concept of concepts) {
      map.set(concept.group, [...(map.get(concept.group) ?? []), concept]);
    }
    return Array.from(map.entries());
  }, [concepts]);

  const active = steps[step];
  const concept = concepts.find((c) => c.name === conceptName) ?? concepts[0];

  function pickStep(index: number) {
    setStep(index);
    setConceptName(steps[index].concepts[0]);
  }

  return (
    <div className="space-y-8">
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((item, index) => {
          const selected = index === step;
          return (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => pickStep(index)}
                aria-pressed={selected}
                className={`flex h-full w-full flex-col gap-2 border p-3 text-left transition ${
                  selected
                    ? "border-accent/70 bg-[var(--color-accent-muted)]"
                    : "border-border hover:border-accent/40 hover:bg-surface"
                }`}
              >
                <span className={`mono-heading text-[11px] ${selected ? "text-accent" : "text-muted"}`}>
                  step {index + 1}
                </span>
                <span className="text-sm font-medium leading-snug text-foreground">
                  {item.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="border-l-2 border-accent/60 pl-5">
        <p className="max-w-2xl text-base leading-7 text-body">{active.body}</p>
        <p className="mono-heading mt-3 text-[11px] uppercase tracking-widest text-muted">
          leans on: <span className="text-accent">{active.concepts.join(" · ")}</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="grid gap-6 sm:grid-cols-2">
          {groups.map(([group, items]) => (
            <div key={group}>
              <p className="mono-heading text-[11px] uppercase tracking-widest text-muted">
                {group}
              </p>
              <div className="mt-3 space-y-2">
                {items.map((item) => {
                  const related = active.concepts.includes(item.name);
                  const selected = item.name === concept.name;
                  return (
                    <div key={item.name}>
                      <button
                        type="button"
                        onClick={() => setConceptName(item.name)}
                        aria-pressed={selected}
                        className={`block w-full border p-3 text-left transition ${
                          selected
                            ? "border-accent/70 bg-surfaceHover"
                            : related
                              ? "border-accent/30 bg-surface hover:border-accent/50"
                              : "border-border hover:border-accent/30"
                        }`}
                      >
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-medium text-foreground">{item.name}</span>
                          {related && (
                            <span className="mono-heading text-[10px] text-accent">this step</span>
                          )}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted">{item.take}</span>
                      </button>
                      {selected && (
                        <div className="border-x border-b border-accent/40 p-4 lg:hidden">
                          <ConceptDetail concept={item} onPick={setConceptName} compact />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <aside className="panel-3d hidden self-start border border-border p-5 lg:sticky lg:top-24 lg:block">
          <p className="mono-heading text-[11px] uppercase tracking-widest text-accent">
            how I think about it
          </p>
          <ConceptDetail concept={concept} onPick={setConceptName} />
        </aside>
      </div>
    </div>
  );
}

function ConceptDetail({
  concept,
  onPick,
  compact,
}: {
  concept: Concept;
  onPick: (name: string) => void;
  compact?: boolean;
}) {
  return (
    <>
      {!compact && (
        // Only the name is announced on change, not the whole panel.
        <h3
          className="display-heading mt-2 text-xl font-medium text-foreground"
          aria-live="polite"
        >
          {concept.name}
        </h3>
      )}
      {!compact && (
        <p className="mt-2 text-sm italic leading-6 text-body">“{concept.take}”</p>
      )}
      <p className={`mono-heading text-[11px] uppercase tracking-widest text-muted ${compact ? "" : "mt-5"}`}>
        where I used it
      </p>
      <ul className="mt-2 space-y-1.5">
        {concept.usedIn.map((use) => {
          // In-page jumps point down, links that leave the page point out.
          const Icon = use.href.startsWith("#") ? ArrowDownRight : ArrowUpRight;
          return (
            <li key={use.href + use.label}>
              <a
                href={use.href}
                className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-foreground"
              >
                {use.label}
                <Icon size={13} />
              </a>
            </li>
          );
        })}
      </ul>
      <p className="mono-heading mt-5 text-[11px] uppercase tracking-widest text-muted">
        connects to
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {concept.connects.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onPick(name)}
            className="mono-heading border border-border px-2.5 py-1 text-[11px] text-muted transition hover:border-accent/60 hover:text-accent"
          >
            {name}
          </button>
        ))}
      </div>
    </>
  );
}
