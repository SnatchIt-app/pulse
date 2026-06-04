"use client";

import { useCallback } from "react";
import { trackWhatsAppClick } from "@/lib/analytics";

const WA_HREF =
  "https://wa.me/17868624436?text=" +
  encodeURIComponent("Hi Pulse, I’m interested in arranging a luxury experience.");

const ARIA_LABEL = "Chat with Pulse on WhatsApp";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function WhatsAppFloatingButton() {
  const handleClick = useCallback(() => {
    trackWhatsAppClick();
    window.open(WA_HREF, "_blank", "noopener,noreferrer");
  }, []);

  const baseInteraction =
    "transition-all duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
    "hover:bg-graphite hover:border-paper/25 hover:shadow-[0_8px_40px_rgba(0,0,0,0.32)] " +
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper/60";

  return (
    <div className="fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8" role="complementary">
      {/*
       * Desktop — icon + label (horizontal pill, sharp corners per Pulse brand)
       * Hidden on mobile.
       */}
      <button
        type="button"
        onClick={handleClick}
        aria-label={ARIA_LABEL}
        className={`border-paper/[0.13] hidden items-center gap-3 border bg-ink px-5 py-[13px] text-paper shadow-[0_4px_28px_rgba(0,0,0,0.24)] md:flex ${baseInteraction}`}
      >
        <WhatsAppIcon className="h-[17px] w-[17px] shrink-0" />
        <span className="text-paper/90 text-[10px] uppercase tracking-[0.24em]">WhatsApp</span>
      </button>

      {/*
       * Mobile — icon only, circular.
       * Hidden on desktop.
       */}
      <button
        type="button"
        onClick={handleClick}
        aria-label={ARIA_LABEL}
        className={`border-paper/[0.13] flex h-12 w-12 items-center justify-center rounded-full border bg-ink text-paper shadow-[0_4px_28px_rgba(0,0,0,0.24)] md:hidden ${baseInteraction}`}
      >
        <WhatsAppIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
