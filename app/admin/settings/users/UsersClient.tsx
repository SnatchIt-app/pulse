"use client";

import { useState, useCallback } from "react";
import type { AdminUserRow } from "./page";
import type { AdminRole } from "@/lib/auth";

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_OPTIONS: { value: AdminRole; label: string; hint: string }[] = [
  { value: "owner", label: "Owner", hint: "Full access incl. team management" },
  { value: "admin", label: "Admin", hint: "Full CRM + team management" },
  { value: "agent", label: "Agent", hint: "Full CRM, no team management" },
  { value: "viewer", label: "Viewer", hint: "Read-only" },
];

const ROLE_LABELS: Record<string, string> = Object.fromEntries(
  ROLE_OPTIONS.map((o) => [o.value, o.label]),
);

const ROLE_COLORS: Record<string, string> = {
  owner: "text-amber-400 border-amber-400/30",
  admin: "text-emerald-400 border-emerald-400/30",
  agent: "text-sky-300 border-sky-300/30",
  viewer: "text-paper/40 border-paper/15",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

// ─── Invite Form ──────────────────────────────────────────────────────────────

function InviteForm({
  currentRole,
  onCreated,
}: {
  currentRole: AdminRole;
  onCreated: (user: AdminUserRow, tempPassword: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<AdminRole>("viewer");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only an owner can mint another owner.
  const roleChoices = ROLE_OPTIONS.filter((r) => r.value !== "owner" || currentRole === "owner");

  async function handleInvite() {
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          full_name: fullName.trim() || undefined,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === "email_taken"
            ? "That email already has an account."
            : data.error === "forbidden_owner"
              ? "Only an owner can add another owner."
              : "Could not create user.",
        );
        return;
      }
      onCreated(
        {
          id: data.id,
          email: email.trim(),
          full_name: fullName.trim() || null,
          role,
          is_active: true,
          created_at: new Date().toISOString(),
        },
        data.tempPassword as string,
      );
      setEmail("");
      setFullName("");
      setRole("viewer");
      setOpen(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-paper/25 text-paper/70 hover:border-paper/50 border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-paper"
      >
        + Invite User
      </button>
    );
  }

  return (
    <div className="border-paper/10 space-y-4 border p-5">
      <p className="text-paper/35 text-[9px] uppercase tracking-[0.22em]">Invite a team member</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@pulse.luxury"
          className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
        />
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full name (optional)"
          className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
        />
      </div>
      <div>
        <p className="text-paper/25 mb-2 text-[8px] uppercase tracking-[0.18em]">Role</p>
        <div className="relative inline-flex items-center">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="border-paper/15 focus:border-paper/35 cursor-pointer appearance-none border bg-transparent py-1.5 pl-3 pr-7 text-[11px] text-paper outline-none transition-colors"
          >
            {roleChoices.map((r) => (
              <option key={r.value} value={r.value} className="bg-graphite text-paper">
                {r.label} — {r.hint}
              </option>
            ))}
          </select>
          <span className="text-paper/30 pointer-events-none absolute right-2 text-[8px]">↓</span>
        </div>
      </div>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleInvite}
          disabled={saving}
          className="bg-paper px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {saving ? "Creating…" : "Create User"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="text-paper/30 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UsersClient({
  initialUsers,
  currentUserId,
  currentRole,
}: {
  initialUsers: AdminUserRow[];
  currentUserId: string;
  currentRole: AdminRole;
}) {
  const [users, setUsers] = useState<AdminUserRow[]>(initialUsers);
  const [tempCredential, setTempCredential] = useState<{ email: string; password: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleCreated = useCallback((user: AdminUserRow, tempPassword: string) => {
    setUsers((prev) => [...prev, user]);
    setTempCredential({ email: user.email, password: tempPassword });
  }, []);

  const patchUser = useCallback(
    async (id: string, patch: Partial<AdminUserRow>) => {
      const prev = users;
      setUsers((us) => us.map((u) => (u.id === id ? { ...u, ...patch } : u)));
      setError(null);
      try {
        const res = await fetch(`/api/admin/users/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "failed");
        }
      } catch (e) {
        setUsers(prev);
        setError(
          e instanceof Error && e.message === "forbidden_owner"
            ? "Only an owner can assign the owner role."
            : e instanceof Error && e.message === "cannot_deactivate_self"
              ? "You cannot deactivate your own account."
              : "Update failed.",
        );
      }
    },
    [users],
  );

  async function handleDelete(id: string) {
    const prev = users;
    setUsers((us) => us.filter((u) => u.id !== id));
    setDeleteTarget(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
    } catch {
      setUsers(prev);
      setError("Delete failed.");
    }
  }

  const canAssignOwner = currentRole === "owner";

  return (
    <div className="mt-10">
      <InviteForm currentRole={currentRole} onCreated={handleCreated} />

      {/* One-time temp credential banner */}
      {tempCredential && (
        <div className="mt-6 border border-emerald-400/30 bg-emerald-400/5 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400">User created</p>
          <p className="text-paper/70 mt-2 text-[12px] leading-relaxed">
            Share these one-time credentials securely. The user should reset their password after
            first sign-in.
          </p>
          <p className="mt-3 font-mono text-[12px] text-paper">{tempCredential.email}</p>
          <p className="font-mono text-[12px] text-paper">{tempCredential.password}</p>
          <button
            type="button"
            onClick={() => setTempCredential(null)}
            className="text-paper/40 mt-3 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && <p className="mt-4 text-[11px] text-red-400">{error}</p>}

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-paper/10 border-b">
              {["User", "Role", "Status", "Added", ""].map((h) => (
                <th
                  key={h}
                  className="text-paper/35 pb-3 pr-6 text-[9px] font-normal uppercase tracking-[0.22em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              return (
                <tr
                  key={u.id}
                  className="border-paper/[0.06] hover:bg-paper/[0.03] border-b transition-colors"
                >
                  <td className="py-4 pr-6">
                    <p className="font-display text-base text-paper">
                      {u.full_name || u.email}
                      {isSelf && <span className="text-paper/30 ml-2 text-[10px]">(you)</span>}
                    </p>
                    {u.full_name && <p className="text-paper/45 mt-0.5 text-[10px]">{u.email}</p>}
                  </td>
                  <td className="py-4 pr-6">
                    <div className="relative inline-flex items-center">
                      <select
                        value={u.role}
                        onChange={(e) => patchUser(u.id, { role: e.target.value })}
                        className={`cursor-pointer appearance-none border bg-transparent py-1 pl-2 pr-6 text-[9px] uppercase tracking-[0.18em] outline-none transition-colors ${
                          ROLE_COLORS[u.role] ?? "border-paper/10 text-paper/40"
                        }`}
                      >
                        {ROLE_OPTIONS.filter(
                          (r) => r.value !== "owner" || canAssignOwner || u.role === "owner",
                        ).map((r) => (
                          <option
                            key={r.value}
                            value={r.value}
                            className="bg-graphite normal-case tracking-normal text-paper"
                          >
                            {ROLE_LABELS[r.value]}
                          </option>
                        ))}
                      </select>
                      <span className="text-paper/30 pointer-events-none absolute right-1.5 text-[8px]">
                        ↓
                      </span>
                    </div>
                  </td>
                  <td className="py-4 pr-6">
                    <button
                      type="button"
                      disabled={isSelf}
                      onClick={() => patchUser(u.id, { is_active: !u.is_active })}
                      className={`border px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] transition-colors disabled:opacity-50 ${
                        u.is_active
                          ? "border-emerald-400/30 text-emerald-400"
                          : "border-paper/15 text-paper/30"
                      }`}
                    >
                      {u.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="text-paper/50 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="whitespace-nowrap py-4 pr-2">
                    {isSelf ? (
                      <span className="text-paper/15 text-[9px] uppercase tracking-[0.18em]">
                        —
                      </span>
                    ) : deleteTarget === u.id ? (
                      <span className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleDelete(u.id)}
                          className="text-[9px] uppercase tracking-[0.18em] text-red-400 transition-colors hover:text-red-300"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(null)}
                          className="text-paper/25 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(u.id)}
                        className="text-paper/15 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-red-400"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
