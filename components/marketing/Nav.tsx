"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const links: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Fleet", href: "/fleet" },
  { label: "Jets", href: "/jets" },
  { label: "Yachts", href: "/yachts" },
  { label: "Residences", href: "/residences" },
  { label: "Concierge", href: "/concierge" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="border-ink/10 bg-paper/80 sticky top-0 z-50 border-b backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-container items-center justify-between px-6 md:px-24">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Pulse — home">
            <Logo className="h-9 w-auto md:h-10" />
            <span className="sr-only">Pulse</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden gap-8 text-[11px] uppercase tracking-[0.22em] md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-opacity hover:opacity-60">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-5">
            <Link
              href="/request"
              className="border border-ink px-4 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors duration-pulse ease-pulse hover:bg-ink hover:text-paper"
            >
              Request Access
            </Link>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <span
                className={`block h-px w-5 bg-ink transition-transform duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px bg-ink transition-opacity duration-[360ms] ${
                  open ? "w-0 opacity-0" : "w-5"
                }`}
              />
              <span
                className={`block h-px w-5 bg-ink transition-transform duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer — sits below the sticky header (z-40 < z-50) */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={`fixed inset-0 z-40 flex flex-col bg-paper transition-opacity duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Spacer clears the sticky header */}
        <div className="h-16 shrink-0" aria-hidden="true" />

        {/* Nav links */}
        <div className="flex flex-1 flex-col justify-center overflow-y-auto px-8 pb-8">
          <ul className="space-y-0.5" role="list">
            {links.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block py-3 font-display text-[clamp(2rem,9vw,3.25rem)] leading-none text-ink"
                  style={{
                    opacity: open ? 1 : 0,
                    transform: open ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity 420ms ease ${open ? i * 40 : 0}ms, transform 420ms cubic-bezier(0.16,1,0.3,1) ${open ? i * 40 : 0}ms`,
                  }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Bottom row — CTA + contact info */}
          <div
            className="border-ink/10 mt-10 space-y-5 border-t pt-8"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 420ms ease ${open ? links.length * 40 + 60 : 0}ms, transform 420ms cubic-bezier(0.16,1,0.3,1) ${open ? links.length * 40 + 60 : 0}ms`,
            }}
          >
            <Link
              href="/request"
              className="block w-full bg-ink py-4 text-center text-[10px] uppercase tracking-[0.26em] text-paper transition-opacity hover:opacity-80"
            >
              Request Access
            </Link>
            <div className="space-y-1.5">
              <a
                href="tel:+17869188895"
                className="text-ink/50 block text-[11px] tracking-[0.14em] transition-opacity hover:text-ink"
              >
                (786) 918-8895
              </a>
              <a
                href="mailto:pulsexotics@exoticsinfo.com"
                className="text-ink/50 block text-[11px] tracking-[0.14em] transition-opacity hover:text-ink"
              >
                pulsexotics@exoticsinfo.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
