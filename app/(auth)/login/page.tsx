import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPlaceholder() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Pulse Staff Sign-in</p>
        <h1 className="mt-4 font-display text-4xl">Phase 5.</h1>
      </div>
    </main>
  );
}
