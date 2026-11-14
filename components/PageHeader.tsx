import Link from "next/link";

type PageHeaderProps = {
  /** Path segments after "deval kotak", e.g. ["blog", "bandit"]. */
  crumbs: { label: string; href?: string }[];
  /** Main heading. */
  title: React.ReactNode;
  /** Optional tail of the heading, set in the muted tone. */
  accent?: string;
  intro?: React.ReactNode;
  /** Right-hand slot: buttons, counts, sync status. */
  aside?: React.ReactNode;
};

/**
 * Inner-page header in the same voice as the homepage hero: a path line,
 * a large two-tone title, then a rule.
 */
export default function PageHeader({ crumbs, title, accent, intro, aside }: PageHeaderProps) {
  return (
    <header className="border-b border-border pb-10">
      <nav aria-label="Breadcrumb" className="label-text text-sm text-muted">
        <Link href="/" className="transition hover:text-accent">
          Deval Kotak
        </Link>
        {crumbs.map((crumb) => (
          <span key={crumb.label}>
            {" "}
            <span className="text-accent">/</span>{" "}
            {crumb.href ? (
              <Link href={crumb.href} className="transition hover:text-accent">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className="min-w-0 max-w-3xl">
          <h1
            className="display-heading text-balance leading-[1.05] text-foreground"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)" }}
          >
            {title}
            {accent && (
              <>
                {" "}
                <span className="text-muted">{accent}</span>
              </>
            )}
          </h1>
          {intro && <p className="mt-5 max-w-2xl text-base leading-7 text-body">{intro}</p>}
        </div>
        {aside && <div className="flex flex-wrap items-center gap-3">{aside}</div>}
      </div>
    </header>
  );
}
