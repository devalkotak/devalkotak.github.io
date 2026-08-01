"use client";

import { useState } from "react";
import { Bug } from "lucide-react";

const SUSPICIOUS =
  /<\s*(script|img|svg|iframe|object|embed|body|style)|on\w+\s*=|javascript:|alert\s*\(|document\.|window\.|srcdoc|expression\(/i;

const SASS: string[] = [
  "Nice payload. Rendered as inert text, like everything else here.",
  "Again? React escapes this by default. It is doing exactly what it should.",
  "Third attempt logged. (No it isn't. There's nothing to log to.)",
  "At this point I'd hire you for persistence. The input still doesn't execute.",
];

export default function BreakMeBox() {
  const [value, setValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const suspicious = SUSPICIOUS.test(value);

  return (
    <div>
      <label
        htmlFor="breakme"
        className="mono-heading flex items-center gap-2 text-xs text-muted"
      >
        <Bug size={14} className="text-accent" />
        type anything and it gets reflected onto the page, raw and unsanitized*
      </label>
      <input
        id="breakme"
        type="text"
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          if (
            SUSPICIOUS.test(next) &&
            !SUSPICIOUS.test(value)
          ) {
            setAttempts((count) => count + 1);
          }
          setValue(next);
        }}
        placeholder='try something friendly, or something with angle brackets'
        autoComplete="off"
        spellCheck={false}
        className="mt-3 h-10 w-full border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-faint focus:border-accent/60"
      />
      {value && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="mono-heading text-[11px] uppercase tracking-wider text-muted">
            reflected output
          </p>
          <p className="mt-2 break-words text-sm leading-6 text-foreground">
            {value}
          </p>
          <p
            className={`mt-3 text-xs leading-5 ${suspicious ? "text-warn" : "text-muted"}`}
          >
            {suspicious
              ? SASS[Math.min(attempts - 1, SASS.length - 1)]
              : "Rendered as text. As it should be."}
          </p>
        </div>
      )}
      <p className="mt-4 text-[11px] leading-5 text-faint">
        *it is sanitized. It always was. The asterisk should have given it
        away.
      </p>
    </div>
  );
}
