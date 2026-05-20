import type { Metadata } from "next";

// /admin is excluded from indexing on every level (robots.ts + middleware + here).
export const metadata: Metadata = {
  title: "Pulse — Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-ink text-paper">{children}</div>;
}
