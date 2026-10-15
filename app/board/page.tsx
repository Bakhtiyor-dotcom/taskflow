"use client";

import { useEffect, useMemo, useState, type DragEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WorkspaceShell } from "@/components/taskflow/workspace-shell";
import {
  ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, CircleDot, ClipboardList,
  Clock3, GripVertical, KanbanSquare, Pencil, Plus, Search, Trash2, X,
  AlertCircle, Sparkles, FolderKanban,
} from "lucide-react";

type Status = "To Do" | "In Progress" | "Completed";
type Priority = "Low" | "Medium" | "High";
type Task = {
  id: string;
  title: string;
  project: string;
  status: Status;
  priority: Priority;
  date: string;
};
type TaskRow = {
  id: string;
  title: string;
  project: string;
  status: Status;
  priority: Priority;
  due_date: string | null;
};
type TaskForm = Omit<Task, "id">;

const STATUSES: Status[] = ["To Do", "In Progress", "Completed"];
const PROJECTS = ["Website Redesign", "Mobile App", "Marketing", "Personal"];
const EMPTY_FORM: TaskForm = {
  title: "", project: "Personal", status: "To Do", priority: "Medium", date: "",
};
const LANES: Record<Status, { accent: string; badge: string; dot: string; icon: typeof Clock3 }> = {
  "To Do": {
    accent: "bg-amber-400", badge: "bg-amber-100 text-amber-800", dot: "bg-amber-400", icon: Clock3,
  },
  "In Progress": {
    accent: "bg-indigo-500", badge: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500", icon: CircleDot,
  },
  Completed: {
    accent: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", icon: CheckCircle2,
  },
};
const PRIORITY_STYLES: Record<Priority, string> = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Medium: "bg-amber-50 text-amber-700 ring-amber-100",
  High: "bg-rose-50 text-rose-700 ring-rose-100",
};

function toTask(row: TaskRow): Task {
  return { id: row.id, title: row.title, project: row.project, status: row.status,
    priority: row.priority, date: row.due_date ?? "" };
}
function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "Please try again.";
}
function prettyDate(value: string) {
  if (!value) return "No due date";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })
    .format(new Date(year, month - 1, day));
}

export default function KanbanPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("All projects");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<Status | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TaskForm>(EMPTY_FORM);
  const [today, setToday] = useState("");

  useEffect(() => {
    let mounted = true;
    // Compute browser-local dates after mount to respect Next.js prerendering.
    const now = new Date();
    setToday(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`);
    async function load() {
      const supabase = createClient();
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (!mounted) return;
      if (authError || !auth.user) {
        router.replace("/auth/login");
        return;
      }
      setUserId(auth.user.id);
      setEmail(auth.user.email ?? "");
      const { data, error: loadError } = await supabase.from("tasks")
        .select("id,title,project,status,priority,due_date")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false });
      if (!mounted) return;
      if (loadError) setError(`Could not load tasks: ${loadError.message}`);
      else setTasks(((data ?? []) as TaskRow[]).map(toTask));
      setLoading(false);
    }
    void load();
    return () => { mounted = false; };
  }, [router]);

  const completed = tasks.filter((task) => task.status === "Completed").length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const q = search.trim().toLowerCase();
    return (!q || `${task.title} ${task.project}`.toLowerCase().includes(q)) &&
      (projectFilter === "All projects" || task.project === projectFilter) &&
      (priorityFilter === "All priorities" || task.priority === priorityFilter);
  }), [tasks, search, projectFilter, priorityFilter]);

  async function signOut() {
    await createClient().auth.signOut();
    window.location.replace("/auth/login");
  }
  function openCreate(status: Status = "To Do") {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, status, project: projectFilter === "All projects" ? "Personal" : projectFilter });
    setError("");
    setModalOpen(true);
  }
  function openEdit(task: Task) {
    setEditingId(task.id);
    setForm({ title: task.title, project: task.project, status: task.status, priority: task.priority, date: task.date });
    setError("");
    setModalOpen(true);
  }
  async function moveTask(task: Task, status: Status) {
    if (!userId || busy || task.status === status) return;
    setBusy(true);
    setError("");
    try {
      const { data, error: updateError } = await createClient().from("tasks")
        .update({ status }).eq("id", task.id).eq("user_id", userId)
        .select("id,title,project,status,priority,due_date").single();
      if (updateError) throw updateError;
      const updated = toTask(data as TaskRow);
      setTasks((current) => current.map((item) => item.id === task.id ? updated : item));
    } catch (e) {
      setError(`Could not update status: ${messageOf(e)}`);
    } finally {
      setBusy(false);
    }
  }
  function onDragStart(event: DragEvent<HTMLElement>, task: Task) {
    if (busy) { event.preventDefault(); return; }
    setDraggingId(task.id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", task.id);
  }
  function onDrop(event: DragEvent<HTMLElement>, status: Status) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    setDragTarget(null);
    setDraggingId(null);
    const task = tasks.find((item) => item.id === id);
    if (task) void moveTask(task, status);
  }
  async function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId || busy || !form.title.trim()) return;
    setBusy(true);
    setError("");
    const values = {
      title: form.title.trim(), project: form.project,
      status: form.status, priority: form.priority, due_date: form.date || null,
    };
    try {
      const query = createClient().from("tasks");
      const { data, error: saveError } = editingId
        ? await query.update(values).eq("id", editingId).eq("user_id", userId)
          .select("id,title,project,status,priority,due_date").single()
        : await query.insert({ ...values, user_id: userId })
          .select("id,title,project,status,priority,due_date").single();
      if (saveError) throw saveError;
      const saved = toTask(data as TaskRow);
      if (editingId) setTasks((current) => current.map((task) => task.id === saved.id ? saved : task));
      else setTasks((current) => [saved, ...current]);
      setModalOpen(false);
    } catch (e) {
      setError(`Could not save task: ${messageOf(e)}`);
    } finally {
      setBusy(false);
    }
  }
  async function deleteTask(task: Task) {
    if (!userId || busy || !window.confirm(`Delete “${task.title}”?`)) return;
    setBusy(true);
    setError("");
    try {
      const { error: deleteError } = await createClient().from("tasks").delete()
        .eq("id", task.id).eq("user_id", userId);
      if (deleteError) throw deleteError;
      setTasks((current) => current.filter((item) => item.id !== task.id));
    } catch (e) {
      setError(`Could not delete task: ${messageOf(e)}`);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f5f4fb] text-sm font-semibold text-violet-700">
      Loading your board...
    </div>
  );

  return (
    <WorkspaceShell email={email} taskCount={tasks.length} completionRate={completionRate} onSignOut={signOut}>
      <div className="mx-auto max-w-[1720px] space-y-7 px-4 py-6 sm:px-8 sm:py-9 lg:px-10">
        <div className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#111632] px-6 py-8 text-white shadow-[0_22px_55px_-30px_rgba(18,20,64,.75)] sm:px-9 sm:py-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40" style={{backgroundImage:"radial-gradient(#7a74e4 1px, transparent 1px)", backgroundSize:"27px 27px"}} />
          <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-44 h-[440px] w-[440px] rounded-full bg-violet-600/20 blur-3xl" />
          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-indigo-200"><Sparkles size={13} /> Your workflow, visualized</span>
              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Move ideas <span className="text-[#a99dff]">forward.</span></h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100/65 sm:text-base">See what&apos;s next, keep work flowing, and celebrate every finished task.</p>
            </div>
            <button type="button" onClick={() => openCreate()} className="tf-primary-button shrink-0 !px-5 !py-3.5 text-sm"><Plus size={18} /> New task</button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><KanbanSquare size={20} /></span>
            <div><h2 className="text-lg font-extrabold text-[#20233e]">Project board</h2><p className="text-xs">{filteredTasks.length} tasks · {completed} completed overall</p></div>
          </div>
          <Link href="/dashboard#tasks" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900"><ArrowLeft size={16} /> Switch to list view</Link>
        </div>

        <div className="tf-surface flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
          <label className="relative min-w-0 flex-1">
            <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <span className="sr-only">Search tasks</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by task or project..." className="tf-input !pl-11" />
          </label>
          <label className="sr-only" htmlFor="board-project">Filter by project</label>
          <select id="board-project" value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} className="tf-input sm:max-w-[205px]">
            <option>All projects</option>{PROJECTS.map((project) => <option key={project}>{project}</option>)}
          </select>
          <label className="sr-only" htmlFor="board-priority">Filter by priority</label>
          <select id="board-priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="tf-input sm:max-w-[190px]">
            <option>All priorities</option><option>High</option><option>Medium</option><option>Low</option>
          </select>
        </div>

        {error && !modalOpen && <div role="alert" className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><AlertCircle size={17} className="mt-0.5 shrink-0" /> {error}</div>}
        {busy && <p role="status" className="text-xs font-semibold text-indigo-600">Saving changes to Supabase...</p>}

        <div className="grid items-start gap-5 xl:grid-cols-3">
          {STATUSES.map((status) => {
            const lane = LANES[status];
            const Icon = lane.icon;
            const laneTasks = filteredTasks.filter((task) => task.status === status);
            return (
              <section key={status} aria-label={`${status} column`} onDragOver={(e) => { if (draggingId) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragTarget(status); } }} onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragTarget(null); }} onDrop={(e) => onDrop(e, status)} className={`min-w-0 overflow-hidden rounded-[24px] border bg-[#f9f9fe] p-3.5 transition-colors sm:p-4 ${dragTarget === status ? "border-violet-400 bg-[#f0edff] ring-2 ring-violet-200" : "border-[#e8e8f2]"}`}>
                <div className="mb-4 flex items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${lane.badge}`}><Icon size={18} /></span>
                    <h3 className="text-sm font-extrabold text-[#20233e]">{status}</h3>
                    <span className="rounded-full border border-[#ececf7] bg-white px-2.5 py-0.5 text-xs font-bold text-slate-500">{laneTasks.length}</span>
                  </div>
                  <button type="button" onClick={() => openCreate(status)} aria-label={`Add task to ${status}`} className="rounded-xl p-2 text-slate-500 transition hover:bg-white hover:text-violet-700"><Plus size={20} /></button>
                </div>
                <div className={`mb-4 h-1 w-full rounded-full ${lane.accent}`} />
                <div className="space-y-3">
                  {laneTasks.map((task) => (
                    <article key={task.id} draggable={!busy} onDragStart={(e) => onDragStart(e, task)} onDragEnd={() => { setDraggingId(null); setDragTarget(null); }} className={`group relative min-w-0 rounded-[20px] border border-[#e5e7f2] bg-white p-4 shadow-[0_8px_22px_-15px_rgba(15,23,65,.3)] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5 ${draggingId === task.id ? "opacity-40" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <GripVertical aria-hidden="true" size={15} className="hidden shrink-0 cursor-grab text-slate-300 md:block" />
                          <span className={`rounded-lg px-2.5 py-1 text-[10px] font-bold ring-1 ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button type="button" disabled={busy} title="Edit task" aria-label={`Edit ${task.title}`} onClick={() => openEdit(task)} className="rounded-lg p-2 text-slate-400 hover:bg-violet-50 hover:text-violet-600"><Pencil size={15} /></button>
                          <button type="button" disabled={busy} title="Delete task" aria-label={`Delete ${task.title}`} onClick={() => deleteTask(task)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button>
                        </div>
                      </div>
                      <h4 className="mt-3 break-words text-[15px] font-bold leading-6 text-[#20233e]">{task.title}</h4>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500"><FolderKanban size={14} /> <span className="truncate">{task.project}</span></div>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] ${task.date && task.date < today && task.status !== "Completed" ? "font-bold text-rose-600" : "text-slate-400"}`}><CalendarDays size={14} /> {prettyDate(task.date)}</span>
                        {task.status === "Completed" && <span className="text-[11px] font-bold text-emerald-600">Done <CheckCircle2 size={13} className="inline" /></span>}
                      </div>
                      <label className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-500">
                        Move to
                        <select value={task.status} disabled={busy} aria-label={`Change status for ${task.title}`} onChange={(e) => void moveTask(task, e.target.value as Status)} className="max-w-[155px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 focus-visible:outline-violet-500">
                          {STATUSES.map((value) => <option key={value}>{value}</option>)}
                        </select>
                      </label>
                    </article>
                  ))}
                  {laneTasks.length === 0 && (
                    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#d9d7e8] bg-white/55 px-5 text-center">
                      <ClipboardList size={23} className="mb-3 text-violet-300" />
                      <p className="text-sm font-bold text-slate-500">No tasks here yet</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">Create a task or move one into this column.</p>
                      <button type="button" onClick={() => openCreate(status)} className="mt-3 text-xs font-bold text-violet-600 hover:text-violet-800">+ Add task</button>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
        <p className="flex items-center gap-2 pb-4 text-xs text-slate-400"><KanbanSquare size={14} /> Drag tasks between columns on desktop, or use “Move to” on any device. All updates are saved to your workspace.</p>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0b1028]/65 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target && !busy) setModalOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="board-task-dialog" className="max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-[28px] border border-white/60 bg-white p-6 shadow-2xl sm:max-h-[90vh] sm:rounded-[28px] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><h2 id="board-task-dialog" className="text-2xl font-extrabold tracking-tight text-[#20233e]">{editingId ? "Edit task" : "Create a task"}</h2><p className="mt-1 text-sm text-slate-500">Keep the details clear and the work moving.</p></div>
              <button type="button" disabled={busy} aria-label="Close dialog" onClick={() => setModalOpen(false)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={21} /></button>
            </div>
            {error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
            <form onSubmit={saveTask} className="mt-7 space-y-4">
              <label className="block text-sm font-bold text-slate-700">Task name<input autoFocus required maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" className="tf-input mt-2" /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700">Project<select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="tf-input mt-2">{PROJECTS.map((name) => <option key={name}>{name}</option>)}</select></label>
                <label className="block text-sm font-bold text-slate-700">Priority<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })} className="tf-input mt-2"><option>Low</option><option>Medium</option><option>High</option></select></label>
                <label className="block text-sm font-bold text-slate-700">Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className="tf-input mt-2">{STATUSES.map((value) => <option key={value}>{value}</option>)}</select></label>
                <label className="block text-sm font-bold text-slate-700">Due date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="tf-input mt-2" /></label>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" disabled={busy} onClick={() => setModalOpen(false)} className="tf-secondary-button">Cancel</button>
                <button type="submit" disabled={busy} className="tf-primary-button">{busy ? "Saving..." : editingId ? "Save changes" : "Create task"} <ArrowRight size={16}/></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
