import Link from "next/link";

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
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-container items-center justify-between px-6 md:px-24">
        <Link href="/" className="font-display text-xl tracking-wide">
          Pulse
        </Link>
        <ul className="hidden gap-8 text-sm md:flex">
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
          className="border border-ink px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
        >
          Request Access
        </Link>
      </nav>
    </header>
  );
}
