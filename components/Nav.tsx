"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import CommandPalette from "@/components/CommandPalette";
import ThemeToggle from "@/components/ThemeToggle";
import { FEATURES } from "@/lib/features";

// Homepage sections first, then the standalone pages.
const links = [
  { href: "/#work", label: "Work" },
  { href: "/#journey", label: "Journey" },
  { href: "/#method", label: "Method" },
  { href: "/#off-duty", label: "Off duty" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
];

const moreLinks = [
  { href: "/resources", label: "Resources" },
  { href: "/optiverse", label: "Optiverse" },
  { href: "/security", label: "Security" },
].filter((link) => FEATURES.resources || link.href !== "/resources");

// Homepage sections the nav links to, watched for scroll-spy.
const SPY_IDS = links
  .filter((link) => link.href.startsWith("/#"))
  .map((link) => link.href.slice(2));

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const activeSection = useActiveSection(pathname === "/" ? SPY_IDS : []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href.startsWith("/#")) return pathname === "/" && activeSection === href.slice(2);
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <nav className="wide-shell flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="Deval Kotak, home"
          className="display-heading flex items-center gap-2 text-base text-foreground transition hover:text-accent"
        >
          Deval Kotak
          <span className="inline-flex size-1.5 rounded-full bg-signal" aria-hidden="true" />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} active={isActive(link.href)}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <CommandPalette />
          <ThemeToggle />
          <Link
            href="/#contact"
            className="hidden h-9 items-center border border-accent/60 bg-[var(--color-accent-muted)] px-4 text-sm font-medium text-accent transition hover:border-accent sm:inline-flex"
          >
            Say hi
          </Link>
          <button
            type="button"
            className="grid size-9 place-items-center border border-border text-body transition hover:border-accent/60 hover:text-accent lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed right-0 top-16 h-[calc(100vh-4rem)] w-64 border-l border-border bg-background px-6 py-8 transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          {[...links, ...moreLinks, { href: "/#contact", label: "Say hi" }].map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={isActive(link.href)}
              onNavigate={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}

/**
 * Which of the given section ids sits in the middle band of the viewport.
 * Null when none does (hero, or below the last watched section).
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const sections = key
      .split(",")
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (sections.length === 0) {
      setActive(null);
      return;
    }

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Sections are in page order, so the first visible one wins.
        setActive(sections.find((section) => visible.has(section.id))?.id ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

function NavLink({
  href,
  active,
  onNavigate,
  children,
}: {
  href: string;
  active?: boolean;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "location" : undefined}
      className={`group relative text-sm transition hover:text-foreground ${
        active ? "text-foreground" : "text-muted"
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-px w-full origin-left transition-transform duration-200 group-hover:scale-x-100 ${
          active ? "scale-x-100 bg-accent" : "scale-x-0 bg-foreground/40"
        }`}
      />
    </Link>
  );
}
