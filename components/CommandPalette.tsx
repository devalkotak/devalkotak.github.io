"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CASE_STUDIES, HOBBIES, JOURNEY } from "@/lib/home-content";
import { FEATURES } from "@/lib/features";
import { toggleTheme } from "@/lib/theme";

const EMAIL = "devalktk@gmail.com";

type Command = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  /** Extra words that should match, beyond the label and group. */
  keywords?: string;
  run: () => void;
};

/**
 * Terminal-style jump menu. Ctrl+K / Cmd+K (or the nav button) opens it;
 * arrows move, Enter runs, Esc closes. Everything it lists already exists on
 * the site, so it adds no content of its own.
 */
export default function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  const go = useCallback(
    (href: string) => {
      // Same-page anchors change only the hash, which scrolls and lets the
      // accordions open themselves (useHashOpen). Anything else is a route.
      if (href.startsWith("/#") && pathname === "/") {
        const id = href.slice(2);
        if (window.location.hash === `#${id}`) {
          document.getElementById(id)?.scrollIntoView({ block: "start" });
        } else {
          window.location.hash = id;
        }
      } else {
        router.push(href);
      }
    },
    [pathname, router],
  );

  const commands = useMemo<Command[]>(() => {
    const section = (id: string, label: string, keywords?: string): Command => ({
      id: `section-${id}`,
      group: "sections",
      label,
      keywords,
      run: () => go(`/#${id}`),
    });

    const pages: Command[] = [
      { id: "page-projects", group: "pages", label: "Projects", hint: "/projects", run: () => go("/projects") },
      { id: "page-blog", group: "pages", label: "Blog", hint: "/blog", keywords: "writeups labs", run: () => go("/blog") },
      { id: "page-resume", group: "pages", label: "Resume", hint: "/resume", keywords: "cv", run: () => go("/resume") },
      { id: "page-optiverse", group: "pages", label: "Optiverse", hint: "/optiverse", run: () => go("/optiverse") },
      { id: "page-security", group: "pages", label: "Site threat model", hint: "/security", run: () => go("/security") },
    ];
    if (FEATURES.resources) {
      pages.push({ id: "page-resources", group: "pages", label: "Resources", hint: "/resources", run: () => go("/resources") });
    }

    return [
      section("top", "Top of the page", "home hero"),
      section("about", "whoami", "about"),
      section("work", "Problems I solved", "work case studies"),
      section("journey", "Journey", "experience timeline"),
      section("method", "How I think it through", "method approach"),
      section("proof", "See for yourself", "demo audit xss"),
      section("off-duty", "Off duty", "hobbies music sports"),
      section("contact", "Contact", "email hire"),
      ...CASE_STUDIES.map<Command>((study) => ({
        id: `case-${study.slug}`,
        group: "work",
        label: study.title,
        hint: study.tag,
        keywords: study.stack.join(" "),
        run: () => go(`/#case-${study.slug}`),
      })),
      ...JOURNEY.map<Command>((stop) => ({
        id: `journey-${stop.slug}`,
        group: "journey",
        label: stop.place,
        hint: stop.dates,
        keywords: stop.role,
        run: () => go(`/#journey-${stop.slug}`),
      })),
      ...HOBBIES.map<Command>((hobby) => ({
        id: `hobby-${hobby.slug}`,
        group: "off duty",
        label: hobby.title,
        hint: hobby.kicker,
        keywords: hobby.keywords?.join(" "),
        run: () => go(`/#hobby-${hobby.slug}`),
      })),
      ...pages,
      {
        id: "action-email",
        group: "actions",
        label: "Copy email address",
        hint: EMAIL,
        keywords: "contact mail",
        run: () => {
          navigator.clipboard
            .writeText(EMAIL)
            .then(() => setToast("Email copied"))
            .catch(() => (window.location.href = `mailto:${EMAIL}`));
        },
      },
      {
        id: "action-theme",
        group: "actions",
        label: "Toggle light / dark theme",
        keywords: "mode colour color",
        run: () => {
          toggleTheme();
        },
      },
      {
        id: "link-github",
        group: "elsewhere",
        label: "GitHub",
        hint: "github.com/devalkotak",
        run: () => window.open("https://github.com/devalkotak", "_blank", "noopener,noreferrer"),
      },
      {
        id: "link-linkedin",
        group: "elsewhere",
        label: "LinkedIn",
        hint: "linkedin.com/in/devalkotak",
        run: () => window.open("https://linkedin.com/in/devalkotak", "_blank", "noopener,noreferrer"),
      },
    ];
  }, [go]);

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return commands;
    return commands.filter((command) => {
      const haystack = `${command.label} ${command.group} ${command.hint ?? ""} ${command.keywords ?? ""}`.toLowerCase();
      return words.every((word) => haystack.includes(word));
    });
  }, [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus();
  }, []);

  const show = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) close();
        else show();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, show]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function runAt(index: number) {
    const command = results[index];
    if (!command) return;
    setOpen(false);
    command.run();
  }

  function onInputKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (results.length ? (index + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (results.length ? (index - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      runAt(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  }

  let lastGroup = "";

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-label="Open command menu"
        className="flex h-9 items-center gap-2 border border-border px-2.5 text-muted transition hover:border-accent/60 hover:text-accent"
      >
        <Search size={14} />
        <kbd className="hidden font-mono text-xs sm:inline">{isMac ? "⌘K" : "Ctrl K"}</kbd>
      </button>

      {toast && (
        <div
          role="status"
          className="label-text fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 border border-accent/60 bg-background px-4 py-2 text-xs text-accent"
        >
          {toast}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-background/70 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className="w-full max-w-xl overflow-hidden border border-border bg-background font-mono shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <span className="label-text text-sm text-accent" aria-hidden="true">
                &gt;
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="jump to a section, project or page…"
                aria-label="Search commands"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-results"
                aria-activedescendant={results[active] ? `command-${results[active].id}` : undefined}
                className="label-text h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
                spellCheck={false}
                autoComplete="off"
              />
              <kbd className="label-text text-[11px] text-muted">esc</kbd>
            </div>

            <ul
              ref={listRef}
              id="command-results"
              role="listbox"
              className="max-h-[50vh] overflow-y-auto py-2"
            >
              {results.length === 0 && (
                <li className="label-text px-4 py-6 text-center text-xs text-muted">
                  command not found: {query}
                </li>
              )}
              {results.map((command, index) => {
                const heading = command.group !== lastGroup ? command.group : null;
                lastGroup = command.group;
                const selected = index === active;
                return (
                  <li key={command.id} role="presentation">
                    {heading && (
                      <p className="label-text px-4 pb-1 pt-3 text-[11px] text-muted">
                        {heading}
                      </p>
                    )}
                    <div
                      id={`command-${command.id}`}
                      role="option"
                      aria-selected={selected}
                      data-index={index}
                      onMouseMove={() => setActive(index)}
                      onClick={() => runAt(index)}
                      className={`mx-2 flex cursor-pointer items-baseline justify-between gap-4 px-3 py-2 text-sm ${
                        selected ? "bg-[var(--color-accent-muted)] text-accent" : "text-body"
                      }`}
                    >
                      <span className="truncate">{command.label}</span>
                      {command.hint && (
                        <span className="label-text shrink-0 truncate text-xs text-muted">
                          {command.hint}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="label-text flex gap-4 border-t border-border px-4 py-2 text-[11px] text-muted">
              <span>↑↓ move</span>
              <span>↵ open</span>
              <span>esc close</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
