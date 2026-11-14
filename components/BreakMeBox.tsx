"use client";

import { useState } from "react";
import { Bug } from "lucide-react";

const SUSPICIOUS =
  /<\s*(script|img|svg|iframe|object|embed|body|style)|on\w+\s*=|javascript:|alert\s*\(|document\.|window\.|srcdoc|expression\(/i;

// Payload classes that are not XSS get their own reply instead of the
// generic "rendered as text", so each hint teaches why it goes nowhere here.
const TEMPLATE = /\{\{.*\}\}|\$\{.*\}|<%.*%>/;
const SQL = /('|")\s*(or|and)\s+\S+\s*=\s*\S+|union\s+select|;\s*drop\s+table|--\s*$/i;

const SASS: string[] = [
  "Nice payload. Rendered as inert text, like everything else here.",
  "Again? React escapes this by default. It is doing exactly what it should.",
  "Third attempt logged. (No, it isn’t. There’s nothing to log to.)",
  "Persistence noted, and genuinely respected. The input still doesn’t execute.",
];

const HINTS: { payload: string; label: string }[] = [
  { payload: "<script>alert(1)</script>", label: "Script tag" },
  { payload: "<img src=x onerror=alert(1)>", label: "Event handler" },
  { payload: "\"><svg onload=alert(1)>", label: "Attribute breakout" },
  { payload: "javascript:alert(1)", label: "URL scheme" },
  { payload: "{{7*7}}", label: "Template injection" },
  { payload: "' OR 1=1--", label: "SQL injection" },
];

function verdict(value: string, attempts: number) {
  if (SUSPICIOUS.test(value)) return { text: SASS[Math.min(attempts - 1, SASS.length - 1)], warn: true };
  if (TEMPLATE.test(value))
    return { text: "No template engine renders this box, so 7*7 stays 7*7.", warn: true };
  if (SQL.test(value))
    return { text: "There is no database behind this box. Nothing to OR your way into.", warn: true };
  return { text: "Rendered as text. As it should be.", warn: false };
}

export default function BreakMeBox() {
  const [value, setValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const result = verdict(value, attempts);

  // Typing counts one attempt when the input first turns suspicious, not one
  // per keystroke. A hint click swaps in a whole new payload, so it counts
  // every time and the replies move on.
  function apply(next: string, fromHint = false) {
    const fresh = fromHint ? next !== value : !SUSPICIOUS.test(value);
    if (SUSPICIOUS.test(next) && fresh) {
      setAttempts((count) => count + 1);
    }
    setValue(next);
  }

  return (
    <div>
      <label
        htmlFor="breakme"
        className="label-text flex items-center gap-2 text-xs text-muted"
      >
        <Bug size={14} className="text-accent" />
        Type anything and it gets reflected onto the page, raw and unsanitized*
      </label>
      <input
        id="breakme"
        type="text"
        value={value}
        onChange={(event) => apply(event.target.value)}
        placeholder="Try something friendly, or something with angle brackets"
        autoComplete="off"
        spellCheck={false}
        className="mt-3 h-10 w-full border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-faint focus:border-accent/60"
      />

      <div className="mt-3">
        <p className="label-text text-xs text-muted">No ideas? Borrow one:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {HINTS.map((hint) => (
            <button
              key={hint.payload}
              type="button"
              onClick={() => apply(hint.payload, true)}
              title={hint.payload}
              aria-label={`Try a ${hint.label.toLowerCase()} payload: ${hint.payload}`}
              className={`label-text border px-2.5 py-1 text-xs transition ${
                value === hint.payload
                  ? "border-accent/70 text-accent"
                  : "border-border text-muted hover:border-accent/50 hover:text-accent"
              }`}
            >
              {hint.label}
            </button>
          ))}
        </div>
      </div>

      {value && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="label-text text-xs text-muted">
            Reflected output
          </p>
          <p className="mt-2 break-words text-sm leading-6 text-foreground">
            {value}
          </p>
          <p className={`mt-3 text-xs leading-5 ${result.warn ? "text-warn" : "text-muted"}`}>
            {result.text}
          </p>
        </div>
      )}
      <p className="mt-4 text-xs leading-5 text-faint">
        *It is sanitized, and always was. The asterisk was the tell.
      </p>
    </div>
  );
}
