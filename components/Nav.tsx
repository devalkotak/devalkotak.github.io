"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, Menu, X } from "lucide-react";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#articles", label: "Articles" },
  { href: "/#life", label: "Life" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <nav className="content-shell flex h-16 items-center justify-between">
        <Link
          href="/"
          className="mono-heading text-sm font-semibold text-foreground transition hover:text-accent"
        >
          ~/dk
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-sm text-body transition hover:text-accent"
          >
            Resume
            <ExternalLink size={13} />
          </a>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center border border-border text-body transition hover:border-accent/60 hover:text-accent md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <div
        className={`fixed right-0 top-16 h-[calc(100vh-4rem)] w-64 border-l border-border bg-background px-6 py-8 transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} onNavigate={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-body transition hover:text-accent"
          >
            Resume
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group relative text-sm text-body transition hover:text-foreground"
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100" />
    </Link>
  );
}
