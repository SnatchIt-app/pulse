"use client";

import { useState } from "react";

// Reusable inline task creator for entity drawers (lead, booking, client, asset).
export default function QuickAddTask({
  entityType,
  entityId,
  defaultAssignee,
}: {
  entityType: "lead" | "booking" | "client" | "asset";
  entityId: string;
  defaultAssignee?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          due_at: dueAt ? new Date(dueAt).toISOString() : undefined,
          entity_type: entityType,
          entity_id: entityId,
          assignee: defaultAssignee || undefined,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setTitle("");
      setDueAt("");
      setOpen(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Could not create task. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-paper/35 text-[9px] uppercase tracking-[0.22em]">Follow-up Task</p>
        {saved && (
          <span className="text-[9px] uppercase tracking-[0.18em] text-emerald-400">Created</span>
        )}
      </div>

      {open ? (
        <div className="border-paper/10 space-y-3 border p-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title…"
            autoFocus
            className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-1.5 text-[12px] text-paper outline-none transition-colors"
          />
          <div>
            <p className="text-paper/25 mb-1 text-[8px] uppercase tracking-[0.18em]">Due</p>
            <input
              type="datetime-local"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="border-paper/15 focus:border-paper/35 w-full border-b bg-transparent py-1.5 text-[11px] text-paper outline-none transition-colors"
            />
          </div>
          {error && <p className="text-[10px] text-red-400">{error}</p>}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={saving}
              className="bg-paper px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError(null);
              }}
              className="text-paper/30 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border-paper/15 text-paper/40 hover:border-paper/30 border px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          + Add Task
        </button>
      )}
    </div>
  );
}
