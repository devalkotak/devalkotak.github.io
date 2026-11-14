import { ArrowUpRight } from "lucide-react";
import type { Hobby } from "@/lib/home-content";

// One wide card, then two, then four: the grid tapers the same way the
// copy does, so the top interest gets the most room. Small cards pair up
// on tablets and sit four across on wide screens.
const SIZE_CLASS: Record<Hobby["size"], string> = {
  lead: "md:col-span-12 p-6 sm:p-8",
  mid: "md:col-span-6 p-5 sm:p-6",
  small: "md:col-span-6 lg:col-span-3 p-5",
};

const TITLE_SIZE: Record<Hobby["size"], string> = {
  lead: "clamp(1.6rem, 3.4vw, 2.4rem)",
  mid: "1.25rem",
  small: "1.05rem",
};

export default function Hobbies({ hobbies }: { hobbies: Hobby[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-12">
      {hobbies.map((hobby) => (
        <article
          key={hobby.slug}
          id={`hobby-${hobby.slug}`}
          className={`panel-3d group relative flex scroll-mt-24 flex-col overflow-hidden border border-border transition hover:border-accent/40 ${SIZE_CLASS[hobby.size]}`}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="label-text text-xs text-accent">
              {hobby.kicker}
            </p>
            {hobby.slug === "music" && <Equalizer />}
          </div>

          <h3
            className="display-heading mt-3 leading-tight text-foreground"
            style={{ fontSize: TITLE_SIZE[hobby.size] }}
          >
            {hobby.title}
          </h3>

          <p
            className={`mt-3 leading-7 ${
              hobby.size === "lead" ? "max-w-xl text-base text-body" : "text-sm leading-6 text-muted"
            }`}
          >
            {hobby.body}
          </p>

          {hobby.link && (
            <div className="mt-auto pt-5">
              <a
                href={hobby.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-foreground"
              >
                {hobby.link.label}
                <ArrowUpRight size={14} />
              </a>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

/** Decorative level meter. Freezes under prefers-reduced-motion. */
function Equalizer() {
  return (
    <span className="flex h-5 items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((bar) => (
        <span
          key={bar}
          className="eq-bar w-[3px] rounded-full"
          style={{ animationDelay: `${bar * -0.23}s` }}
        />
      ))}
    </span>
  );
}
