"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import CountUp from "@/components/CountUp";
import useHashOpen from "@/components/useHashOpen";
import type { CaseStudy } from "@/lib/home-content";

/**
 * Work cards. The headline number lives on the title row, which is the only
 * place it appears on the page; the opened panel tells the story around it.
 */
export default function CaseStudies({ studies }: { studies: CaseStudy[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const slugs = useMemo(() => studies.map((study) => study.slug), [studies]);
  const openOne = useCallback((index: number) => setOpen(index), []);
  useHashOpen("case-", slugs, openOne);

  return (
    <div className="divide-y divide-border border-y border-border">
      {studies.map((study, index) => {
        const isOpen = open === index;
        const panelId = `case-${study.slug}-panel`;
        return (
          <article key={study.slug} id={`case-${study.slug}`} className="scroll-mt-24">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="group grid w-full grid-cols-[2rem_1fr_auto] items-center gap-x-4 px-2 py-6 text-left transition hover:bg-surface sm:grid-cols-[3rem_1fr_auto_auto]"
            >
              <span className="mono-heading self-start pt-0.5 text-xs text-faint transition group-hover:text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="mono-heading block text-[11px] uppercase tracking-wider text-accent">
                  {study.tag}
                </span>
                <span
                  className="display-heading mt-1.5 block font-medium leading-tight text-foreground"
                  style={{ fontSize: "clamp(1.15rem, 2.4vw, 1.55rem)" }}
                >
                  {study.title}
                </span>
                <Metric study={study} className="mt-3 sm:hidden" />
              </span>
              <Metric study={study} className="hidden text-right sm:block" />
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
                <div className="grid gap-x-10 gap-y-6 px-2 pb-8 sm:pl-[4rem] md:grid-cols-2">
                  <Field label="the problem">{study.problem}</Field>
                  <Field label="the outcome" accent>
                    {study.outcome}
                  </Field>
                  <Field label="what I did">{study.did}</Field>
                  <Field label="how I approached it">{study.approach}</Field>

                  <div className="flex flex-wrap items-center gap-2 md:col-span-2">
                    {study.stack.map((item) => (
                      <span
                        key={item}
                        className="mono-heading border border-border px-2.5 py-1 text-[11px] text-muted"
                      >
                        {item}
                      </span>
                    ))}
                    <span className="mono-heading ml-auto text-[11px] uppercase tracking-widest text-ok">
                      {study.source === "repo" ? "✓ check it in the repo" : "✓ on the resume"}
                    </span>
                    {study.link && (
                      <a
                        href={study.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-foreground"
                      >
                        {study.link.label}
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Metric({ study, className }: { study: CaseStudy; className: string }) {
  const { value, from, suffix, display, label } = study.metric;
  return (
    <span className={className}>
      <span
        className="display-heading block font-medium leading-none text-foreground"
        style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.2rem)" }}
      >
        <CountUp to={value} from={from} suffix={suffix} display={display} />
      </span>
      <span className="mono-heading mt-1.5 block text-[10px] uppercase tracking-widest text-muted">
        {label}
      </span>
    </span>
  );
}

function Field({
  label,
  accent,
  children,
}: {
  label: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mono-heading text-[11px] uppercase tracking-widest text-muted">{label}</p>
      <p className={`mt-2 text-sm leading-6 ${accent ? "text-foreground" : "text-body"}`}>
        {children}
      </p>
    </div>
  );
}
