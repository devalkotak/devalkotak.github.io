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
 * wide screens the detail sits in a sticky side panel beside the grid; on
 * phones the grid collapses to chips with one detail card directly below.
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
                <span className={`label-text text-xs ${selected ? "text-accent" : "text-muted"}`}>
                  Step {index + 1}
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
        <p className="label-text mt-3 text-xs text-muted">
          Leans on <span className="text-accent">{active.concepts.join(", ")}</span>
        </p>
      </div>

      {/* Phones: one row of topic chips and a single card under it, so a tap
          never opens something far down the page. */}
      <div className="lg:hidden">
        <p className="label-text text-xs text-muted">Topics</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {concepts.map((item) => {
            const related = active.concepts.includes(item.name);
            const selected = item.name === concept.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setConceptName(item.name)}
                aria-pressed={selected}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  selected
                    ? "border-accent bg-[var(--color-accent-muted)] text-accent"
                    : related
                      ? "border-accent/50 text-foreground"
                      : "border-border text-muted"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
        <div className="panel-3d mt-4 border border-accent/40 p-5">
          <p className="label-text text-xs text-accent">
            {active.concepts.includes(concept.name) ? "Used in this step" : concept.group}
          </p>
          <ConceptDetail concept={concept} onPick={setConceptName} />
        </div>
      </div>

      <div className="hidden gap-6 lg:grid lg:grid-cols-[1fr_20rem]">
        <div className="grid grid-cols-2 gap-6">
          {groups.map(([group, items]) => (
            <div key={group}>
              <p className="label-text text-xs text-muted">{group}</p>
              <div className="mt-3 space-y-2">
                {items.map((item) => {
                  const related = active.concepts.includes(item.name);
                  const selected = item.name === concept.name;
                  return (
                    <button
                      key={item.name}
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
                        {related && <span className="label-text text-[11px] text-accent">This step</span>}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted">{item.take}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <aside className="panel-3d self-start border border-border p-5 lg:sticky lg:top-24">
          <p className="label-text text-xs text-accent">
            How I think about it
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
}: {
  concept: Concept;
  onPick: (name: string) => void;
}) {
  return (
    <>
      {/* Only the name is announced on change, not the whole panel. */}
      <h3 className="display-heading mt-2 text-xl text-foreground" aria-live="polite">
        {concept.name}
      </h3>
      <p className="mt-2 text-sm italic leading-6 text-body">“{concept.take}”</p>
      <p className="label-text mt-5 text-xs text-muted">
        Where I used it
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
      <p className="label-text mt-5 text-xs text-muted">
        Connects to
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {concept.connects.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onPick(name)}
            className="label-text border border-border px-2.5 py-1 text-xs text-muted transition hover:border-accent/60 hover:text-accent"
          >
            {name}
          </button>
        ))}
      </div>
    </>
  );
}
