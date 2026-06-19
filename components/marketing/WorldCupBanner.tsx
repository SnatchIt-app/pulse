"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "pulse_wc26_banner_dismissed";

// Slim, premium announcement strip. Renders above the homepage hero on first
// visit; dismissal persists in localStorage so it never nags a returning guest.
export default function WorldCupBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="World Cup 26 announcement"
      className="border-brass/25 relative border-b bg-ink text-paper"
    >
      <div className="mx-auto flex max-w-container items-center gap-4 px-6 py-2.5 md:px-24">
        <Link
          href="/experiences/world-cup"
          className="group flex flex-1 flex-col items-start gap-x-3 gap-y-0.5 text-left sm:flex-row sm:items-center"
        >
          <span className="shrink-0 text-[10px] uppercase tracking-[0.28em] text-brass">
            World Cup 26™
          </span>
          <span className="text-paper/85 text-[11px] leading-relaxed tracking-[0.02em] sm:text-xs">
            Pulse is now offering curated FIFA World Cup 26™ experiences.{" "}
            <span className="text-paper/50">Request access at least 1 week before any match.</span>
          </span>
          <span className="hidden shrink-0 text-[10px] uppercase tracking-[0.22em] text-brass transition-opacity group-hover:opacity-70 sm:inline">
            Explore →
          </span>
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="text-paper/40 shrink-0 px-1 text-base leading-none transition-opacity hover:text-paper"
        >
          ×
        </button>
      </div>
    </aside>
  );
}
