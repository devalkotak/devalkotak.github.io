import Link from "next/link";

export default function NotFound() {
  return (
    <div className="content-shell">
      <h1 className="mono-heading text-3xl font-semibold text-foreground">404</h1>
      <p className="mt-4 text-sm text-muted">That page is not in the static export.</p>
      <Link className="mt-6 inline-block text-sm text-accent" href="/">
        return home
      </Link>
    </div>
  );
}
