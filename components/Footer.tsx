import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <p className="content-shell text-center text-xs text-faint">
        deval kotak / built with next.js /{" "}
        <Link href="/security" className="transition hover:text-accent">
          how this site is secured
        </Link>
      </p>
    </footer>
  );
}
