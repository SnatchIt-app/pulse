"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error === "invalid_password"
            ? "Incorrect password."
            : data.error === "admin_not_configured"
              ? "Admin not configured. Set ADMIN_PASSWORD in .env.local."
              : "Sign-in failed.",
        );
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse Staff</p>
        <h1 className="mt-4 font-display text-4xl text-paper">Sign in.</h1>

        <form onSubmit={handleSubmit} className="mt-10" noValidate>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="border-paper/20 placeholder:text-paper/30 focus:border-paper/60 w-full border-b bg-transparent py-2 text-base text-paper outline-none transition-colors"
          />
          {error && <p className="mt-3 text-[11px] text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="mt-8 w-full bg-paper py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-[480ms] hover:bg-bone disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
