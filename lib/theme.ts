// Theme lives on <html data-theme> for the current visit only; nothing is
// stored, to match the zero-cookie banner. Anything that flips it goes
// through toggleTheme() so every listener (the nav button, the palette)
// stays in sync.

export type Theme = "dark" | "light";

const EVENT = "themechange";

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  window.dispatchEvent(new CustomEvent<Theme>(EVENT, { detail: next }));
  return next;
}

export function onThemeChange(listener: (theme: Theme) => void): () => void {
  const handler = (event: Event) => listener((event as CustomEvent<Theme>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
