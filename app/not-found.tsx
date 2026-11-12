import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const PLACES = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
];

export default function NotFound() {
  return (
    <div className="wide-shell flex min-h-[calc(100svh-14rem)] flex-col justify-center py-10">
      <p className="mono-heading text-sm text-muted">
        deval kotak <span className="text-accent">/</span> 404
      </p>
      <h1
        className="display-heading mt-8 text-balance font-medium leading-[1.02] text-foreground"
        style={{ fontSize: "clamp(2.6rem, 8vw, 6rem)" }}
      >
        Nothing here.{" "}
        <span className="serif-accent text-accent">Not even a stack trace.</span>
      </h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-body">
        This page is not part of the static export, so there is nothing to
        find. Pick a way back, or press Ctrl K (⌘K on a Mac) to jump anywhere.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {PLACES.map((place) => (
          <Link
            key={place.href}
            href={place.href}
            className="inline-flex h-11 items-center gap-2 border border-border px-5 text-sm text-body transition hover:border-accent/60 hover:text-accent"
          >
            {place.label}
            <ArrowUpRight size={14} />
          </Link>
        ))}
      </div>
    </div>
  );
}
