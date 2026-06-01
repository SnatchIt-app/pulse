"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import type { Task } from "./page";

// ─── Constants ────────────────────────────────────────────────────────────────

type FilterValue = "overdue" | "today" | "upcoming" | "open" | "done" | "all";

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "open", label: "Open" },
  { value: "done", label: "Done" },
  { value: "all", label: "All" },
];

const ENTITY_LINKS: Record<string, string> = {
  lead: "/admin/leads",
  booking: "/admin/bookings",
  client: "/admin/clients",
  asset: "/admin/assets",
};

const ENTITY_LABELS: Record<string, string> = {
  lead: "Lead",
  booking: "Booking",
  client: "Client",
  asset: "Asset",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

function formatDue(iso: string | null): string {
  if (!iso) return "No due date";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  });
}

function isOverdue(task: Task): boolean {
  if (task.status === "done" || !task.due_at) return false;
  return new Date(task.due_at) < startOfToday();
}

function isToday(task: Task): boolean {
  if (!task.due_at) return false;
  const due = new Date(task.due_at);
  return due >= startOfToday() && due <= endOfToday();
}

function isUpcoming(task: Task): boolean {
  if (!task.due_at) return false;
  return new Date(task.due_at) > endOfToday();
}

// ─── Task Row ─────────────────────────────────────────────────────────────────

function TaskRow({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  onStatusChange: (id: string, status: string, dueAt?: string | null) => void;
  onDelete: (id: string) => void;
}) {
  const overdue = isOverdue(task);
  const done = task.status === "done";

  function snooze() {
    // Push due date 1 day forward (from current due or now)
    const base = task.due_at ? new Date(task.due_at) : new Date();
    base.setDate(base.getDate() + 1);
    onStatusChange(task.id, "snoozed", base.toISOString());
  }

  return (
    <div
      className={`border-paper/[0.06] flex items-start gap-3 border-b py-4 transition-colors ${
        done ? "opacity-40" : ""
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onStatusChange(task.id, done ? "open" : "done")}
        aria-label={done ? "Mark open" : "Mark done"}
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
          done
            ? "border-emerald-400/50 bg-emerald-400/20 text-emerald-400"
            : "border-paper/25 hover:border-paper/50"
        }`}
      >
        {done && <span className="text-[9px] leading-none">✓</span>}
      </button>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <p className={`text-[13px] text-paper ${done ? "line-through" : ""}`}>{task.title}</p>
        {task.description && (
          <p className="text-paper/45 mt-0.5 text-[11px] leading-relaxed">{task.description}</p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            className={`text-[10px] ${
              overdue
                ? "text-red-400"
                : task.status === "snoozed"
                  ? "text-sky-300"
                  : "text-paper/40"
            }`}
          >
            {task.status === "snoozed" && "Snoozed · "}
            {overdue && "Overdue · "}
            {formatDue(task.due_at)}
          </span>
          {task.entity_type && task.entity_id && ENTITY_LINKS[task.entity_type] && (
            <Link
              href={ENTITY_LINKS[task.entity_type]!}
              className="text-paper/30 text-[9px] uppercase tracking-[0.16em] transition-colors hover:text-paper"
            >
              {ENTITY_LABELS[task.entity_type]} →
            </Link>
          )}
          {task.assignee && (
            <span className="text-paper/30 text-[9px] uppercase tracking-[0.16em]">
              {task.assignee}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-3">
        {!done && (
          <button
            type="button"
            onClick={snooze}
            className="text-paper/25 text-[9px] uppercase tracking-[0.16em] transition-colors hover:text-sky-300"
          >
            Snooze
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="text-paper/15 text-[9px] uppercase tracking-[0.16em] transition-colors hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TasksClient({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<FilterValue>("overdue");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDue, setNewDue] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      overdue: tasks.filter(isOverdue).length,
      today: tasks.filter((t) => t.status !== "done" && isToday(t)).length,
      upcoming: tasks.filter((t) => t.status !== "done" && isUpcoming(t)).length,
      open: tasks.filter((t) => t.status === "open").length,
      done: tasks.filter((t) => t.status === "done").length,
      all: tasks.length,
    }),
    [tasks],
  );

  const visible = useMemo(() => {
    switch (filter) {
      case "overdue":
        return tasks.filter(isOverdue);
      case "today":
        return tasks.filter((t) => t.status !== "done" && isToday(t));
      case "upcoming":
        return tasks.filter((t) => t.status !== "done" && isUpcoming(t));
      case "open":
        return tasks.filter((t) => t.status === "open");
      case "done":
        return tasks.filter((t) => t.status === "done");
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const handleStatusChange = useCallback(
    async (id: string, status: string, dueAt?: string | null) => {
      const prev = tasks.find((t) => t.id === id);
      if (!prev) return;
      const patch: Partial<Task> = { status };
      if (dueAt !== undefined) patch.due_at = dueAt;

      setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
      try {
        const body: Record<string, unknown> = { status };
        if (dueAt !== undefined) body.due_at = dueAt;
        const res = await fetch(`/api/admin/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("failed");
      } catch {
        setTasks((ts) => ts.map((t) => (t.id === id ? prev : t)));
      }
    },
    [tasks],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const prev = tasks;
      setTasks((ts) => ts.filter((t) => t.id !== id));
      try {
        const res = await fetch(`/api/admin/tasks/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("failed");
      } catch {
        setTasks(prev);
      }
    },
    [tasks],
  );

  async function handleCreate() {
    if (!newTitle.trim()) {
      setError("Title is required.");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          due_at: newDue ? new Date(newDue).toISOString() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("failed");
      setTasks((ts) => [data.task as Task, ...ts]);
      setNewTitle("");
      setNewDue("");
      setShowAdd(false);
    } catch {
      setError("Could not create task.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      {/* Count cards */}
      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`border p-3 text-left transition-colors duration-[320ms] ${
              filter === f.value
                ? "border-paper/40 bg-paper/5"
                : "border-paper/10 hover:border-paper/25"
            }`}
          >
            <p className="text-paper/35 text-[9px] uppercase tracking-[0.18em]">{f.label}</p>
            <p
              className={`mt-1.5 font-display text-2xl ${
                f.value === "overdue" && counts.overdue > 0 ? "text-red-400" : "text-paper"
              }`}
            >
              {counts[f.value]}
            </p>
          </button>
        ))}
      </div>

      {/* Add task */}
      <div className="mt-8">
        {showAdd ? (
          <div className="border-paper/10 space-y-3 border p-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title…"
              autoFocus
              className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
            />
            <div>
              <p className="text-paper/25 mb-1 text-[8px] uppercase tracking-[0.18em]">Due date</p>
              <input
                type="datetime-local"
                value={newDue}
                onChange={(e) => setNewDue(e.target.value)}
                className="border-paper/15 focus:border-paper/35 border-b bg-transparent py-1.5 text-[12px] text-paper outline-none transition-colors"
              />
            </div>
            {error && <p className="text-[11px] text-red-400">{error}</p>}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => void handleCreate()}
                disabled={creating}
                className="bg-paper px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {creating ? "Saving…" : "Create Task"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
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
            onClick={() => setShowAdd(true)}
            className="border-paper/25 text-paper/70 hover:border-paper/50 border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-paper"
          >
            + New Task
          </button>
        )}
      </div>

      {/* List */}
      <div className="mt-8">
        {visible.length > 0 ? (
          <div>
            {visible.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <p className="text-paper/35 mt-12 text-sm">
            {filter === "overdue"
              ? "No overdue tasks. "
              : filter === "today"
                ? "Nothing due today."
                : "No tasks here."}
          </p>
        )}
      </div>
    </div>
  );
}
