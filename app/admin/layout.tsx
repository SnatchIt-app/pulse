import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";

// /admin is excluded from indexing on every level (robots.ts + middleware + here).
export const metadata: Metadata = {
  title: "Pulse — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user || !user.is_active) redirect("/login");

  return (
    <div className="min-h-screen bg-ink text-paper">
      <AdminHeader email={user.email} role={user.role} />
      {children}
    </div>
  );
}
