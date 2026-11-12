"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { onThemeChange, toggleTheme, type Theme } from "@/lib/theme";

/**
 * Flips the theme for this visit only. Nothing is stored, to stay consistent
 * with the zero-cookie banner: reload and you are back in dark.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // The command palette can flip the theme too, so follow the shared event.
  useEffect(() => onThemeChange(setTheme), []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="grid size-9 place-items-center border border-border text-muted transition hover:border-accent/60 hover:text-accent"
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
