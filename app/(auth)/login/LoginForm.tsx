"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowser();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError("Incorrect email or password.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse Staff</p>
        <h1 className="mt-4 font-display text-4xl text-paper">Sign in.</h1>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="border-paper/20 placeholder:text-paper/30 focus:border-paper/60 w-full border-b bg-transparent py-2 text-base text-paper outline-none transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="border-paper/20 placeholder:text-paper/30 focus:border-paper/60 w-full border-b bg-transparent py-2 text-base text-paper outline-none transition-colors"
          />
          {error && <p className="text-[11px] text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="mt-3 w-full bg-paper py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-[480ms] hover:bg-bone disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-paper/30 mt-8 text-[10px] leading-relaxed">
          Access is by invitation. Contact an owner or administrator to be added.
        </p>
      </div>
    </main>
  );
}
