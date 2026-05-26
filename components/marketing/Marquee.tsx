import { FLEET_MARQUEE } from "@/data/fleet-preview";

// Silent infinite marquee of fleet nameplates. CSS keyframes (no JS).
// Track contains two copies so the loop is seamless.
export default function Marquee() {
  const items = [...FLEET_MARQUEE, ...FLEET_MARQUEE];
  return (
    <div
      aria-hidden="true"
      className="border-ink/10 relative isolate overflow-hidden border-y bg-paper py-6"
    >
      <div className="pulse-marquee-track flex w-max gap-12 whitespace-nowrap">
        {items.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="text-ink/75 inline-flex items-center gap-12 font-display text-sm uppercase tracking-[0.3em]"
          >
            {label}
            <span className="inline-block h-1 w-1 rounded-full bg-brass opacity-70" />
          </span>
        ))}
      </div>
    </div>
  );
}
