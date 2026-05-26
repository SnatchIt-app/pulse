import Link from "next/link";
import Logo from "./Logo";

const links: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Fleet", href: "/fleet" },
  { label: "Jets", href: "/jets" },
  { label: "Yachts", href: "/yachts" },
  { label: "Residences", href: "/residences" },
  { label: "Concierge", href: "/concierge" },
  { label: "About", href: "/about" },
];

export default function Nav() {
  return (
    <header className="border-ink/10 bg-paper/80 sticky top-0 z-50 border-b backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-container items-center justify-between px-6 md:px-24">
        <Link href="/" className="flex items-center gap-3" aria-label="Pulse — home">
          <Logo className="h-9 w-auto md:h-10" />
          <span className="sr-only">Pulse</span>
        </Link>
        <ul className="hidden gap-8 text-[11px] uppercase tracking-[0.22em] md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-opacity hover:opacity-60">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/request"
          className="border border-ink px-4 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors duration-pulse ease-pulse hover:bg-ink hover:text-paper"
        >
          Request Access
        </Link>
      </nav>
    </header>
  );
}
