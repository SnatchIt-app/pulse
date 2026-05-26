"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <p className="text-ink/60 text-xs uppercase tracking-[0.2em]">Error</p>
        <h1 className="mt-2 font-display text-5xl">Something went wrong</h1>
        <button
          onClick={() => reset()}
          className="mt-6 underline underline-offset-4 hover:opacity-70"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
