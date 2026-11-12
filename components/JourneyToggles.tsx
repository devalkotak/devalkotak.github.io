"use client";

import { useCallback, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import useHashOpen from "@/components/useHashOpen";
import type { JourneyStop } from "@/lib/home-content";

/** Timeline of collapsed stops. Only the title row shows until opened. */
export default function JourneyToggles({ stops }: { stops: JourneyStop[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const slugs = useMemo(() => stops.map((stop) => stop.slug), [stops]);
  const openOne = useCallback(
    (index: number) => setOpen((current) => new Set(current).add(index)),
    [],
  );
  useHashOpen("journey-", slugs, openOne);

  function toggle(index: number) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <ol className="relative border-l border-border">
      {stops.map((stop, index) => {
        const isOpen = open.has(index);
        const panelId = `journey-${stop.slug}-panel`;
        return (
          <li key={stop.slug} id={`journey-${stop.slug}`} className="relative scroll-mt-24">
            <span
              className={`absolute -left-[4.5px] top-[1.9rem] size-2 rounded-full ${
                stop.now ? "bg-ok ring-4 ring-[var(--color-accent-muted)]" : isOpen ? "bg-accent" : "bg-faint"
              }`}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 py-5 pl-6 pr-2 text-left transition hover:bg-surface sm:pl-8"
            >
              <span className="min-w-0">
                <span className="mono-heading flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-widest text-muted">
                  {stop.dates}
                  {stop.now && <span className="border border-ok/60 px-1.5 text-ok">now</span>}
                </span>
                <span className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="display-heading text-xl font-medium text-foreground transition group-hover:text-accent">
                    {stop.place}
                  </span>
                  <span className="mono-heading text-[11px] uppercase tracking-wider text-accent">
                    {stop.role}
                  </span>
                </span>
              </span>
              <span className="text-muted transition group-hover:text-accent">
                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
              </span>
            </button>

            <div
              id={panelId}
              className={`grid transition-[grid-template-rows] duration-300 ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <dl className="grid gap-5 pb-7 pl-6 pr-2 sm:pl-8 md:grid-cols-3">
                  <Field label="worked on">{stop.workedOn}</Field>
                  <Field label="learned">{stop.learned}</Field>
                  <Field label="contributed">{stop.contributed}</Field>
                </dl>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="mono-heading text-[11px] uppercase tracking-widest text-muted">{label}</dt>
      <dd className="mt-1.5 text-sm leading-6 text-body">{children}</dd>
    </div>
  );
}
