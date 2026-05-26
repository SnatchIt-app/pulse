import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <p className="text-ink/60 text-xs uppercase tracking-[0.2em]">404</p>
        <h1 className="mt-2 font-display text-5xl">Page not found</h1>
        <Link href="/" className="mt-6 inline-block underline underline-offset-4 hover:opacity-70">
          Return home
        </Link>
      </div>
    </main>
  );
}
