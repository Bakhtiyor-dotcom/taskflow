"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type Priority = "Low" | "Medium" | "High";
type Status = "To Do" | "In Progress" | "Completed";
type Task = {
  id: string;
  title: string;
  project: string;
  priority: Priority;
  status: Status;
  date: string;
};
type TaskForm = Omit<Task, "id">;
type Activity = { id: string; message: string; time: string };
type TaskRow = {
  id: string;
  title: string;
  project: string;
  priority: Priority;
  status: Status;
  due_date: string | null;
};

function fromDatabase(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    project: row.project,
    priority: row.priority,
    status: row.status,
    date: row.due_date ?? "",
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

const PROJECTS = [
  { name: "Website Redesign", category: "Design", color: "bg-violet-500", tint: "bg-violet-50 text-violet-700" },
  { name: "Mobile App", category: "Development", color: "bg-blue-500", tint: "bg-blue-50 text-blue-700" },
  { name: "Marketing", category: "Marketing", color: "bg-emerald-500", tint: "bg-emerald-50 text-emerald-700" },
  { name: "Personal", category: "Personal", color: "bg-amber-500", tint: "bg-amber-50 text-amber-700" },
];

const EMPTY_FORM: TaskForm = {
  title: "",
  project: "Personal",
  priority: "Medium",
  status: "To Do",
  date: "",
};

function localDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const STATUS_COLORS: Record<Status, string> = {
  "To Do": "bg-amber-100 text-amber-700",
  "In Progress": "bg-violet-100 text-violet-700",
  Completed: "bg-emerald-100 text-emerald-700",
};
const PRIORITY_COLORS: Record<Priority, string> = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-blue-50 text-blue-700",
  High: "bg-rose-50 text-rose-700",
};

function formatDate(value: string) {
  if (!value) return "No deadline";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(year, month - 1, day)
  );
}

function nextStatus(status: Status): Status {
  if (status === "To Do") return "In Progress";
  if (status === "In Progress") return "Completed";
  return "To Do";
}

export default function DashboardPage() {
  const router = useRouter();
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [today, setToday] = useState("");
  const [todayLabel, setTodayLabel] = useState("Today");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TaskForm>(EMPTY_FORM);
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    setToday(localDate(new Date()));
    setTodayLabel(new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date()));
    let active = true;
    async function loadTasks() {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!active) return;
      if (authError || !authData.user) {
        router.replace("/auth/login");
        return;
      }
      setUserId(authData.user.id);
      setEmail(authData.user.email ?? "");
      const { data, error: loadError } = await supabase
        .from("tasks")
        .select("id,title,project,priority,status,due_date")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false });
      if (!active) return;
      if (loadError) {
        setError(`Could not load tasks: ${loadError.message}`);
      } else {
        setTaskList(((data ?? []) as TaskRow[]).map(fromDatabase));
      }
      setLoading(false);
    }
    void loadTasks();
    return () => { active = false; };
  }, [router]);

  function logAction(message: string) {
    const entry = { id: crypto.randomUUID(), message, time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) };
    setActivity((current) => [entry, ...current].slice(0, 6));
  }

  function openCreate() {
    setError("");
    setEditingId(null);
    setForm({ ...EMPTY_FORM, project: projectFilter !== "All" ? projectFilter : "Personal" });
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setError("");
    setEditingId(task.id);
    setForm({ title: task.title, project: task.project, priority: task.priority, status: task.status, date: task.date });
    setModalOpen(true);
  }

  async function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = form.title.trim();
    if (!title || !userId || saving) return;
    setSaving(true);
    setError("");
    const values = {
      title,
      project: form.project,
      priority: form.priority,
      status: form.status,
      due_date: form.date || null,
    };
    try {
      if (editingId) {
        const { data, error: saveError } = await supabase
          .from("tasks")
          .update(values)
          .eq("id", editingId)
          .eq("user_id", userId)
          .select("id,title,project,priority,status,due_date")
          .single();
        if (saveError) throw saveError;
        const updated = fromDatabase(data as TaskRow);
        setTaskList((current) => current.map((task) => task.id === editingId ? updated : task));
        logAction(`Updated “${title}”`);
      } else {
        const { data, error: saveError } = await supabase
          .from("tasks")
          .insert({ ...values, user_id: userId })
          .select("id,title,project,priority,status,due_date")
          .single();
        if (saveError) throw saveError;
        setTaskList((current) => [fromDatabase(data as TaskRow), ...current]);
        logAction(`Created “${title}”`);
      }
      setModalOpen(false);
    } catch (saveError) {
      setError(`Could not save task: ${errorMessage(saveError)}`);
    } finally {
      setSaving(false);
    }
  }

  async function deleteTask(task: Task) {
    if (!userId || saving || !window.confirm(`Delete “${task.title}”?`)) return;
    setSaving(true);
    setError("");
    try {
      const { error: deleteError } = await supabase
        .from("tasks").delete().eq("id", task.id).eq("user_id", userId);
      if (deleteError) throw deleteError;
      setTaskList((current) => current.filter((item) => item.id !== task.id));
      logAction(`Deleted “${task.title}”`);
    } catch (deleteError) {
      setError(`Could not delete task: ${errorMessage(deleteError)}`);
    } finally {
      setSaving(false);
    }
  }

  async function cycleStatus(task: Task) {
    if (!userId || saving) return;
    const status = nextStatus(task.status);
    setSaving(true);
    setError("");
    try {
      const { data, error: updateError } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", task.id)
        .eq("user_id", userId)
        .select("id,title,project,priority,status,due_date")
        .single();
      if (updateError) throw updateError;
      const updated = fromDatabase(data as TaskRow);
      setTaskList((current) => current.map((item) => item.id === task.id ? updated : item));
      logAction(`Moved “${task.title}” to ${status}`);
    } catch (updateError) {
      setError(`Could not change status: ${errorMessage(updateError)}`);
    } finally {
      setSaving(false);
    }
  }

  async function logOut() {
    await supabase.auth.signOut();
    router.replace("/auth/login");
    router.refresh();
  }

  const completed = taskList.filter((task) => task.status === "Completed").length;
  const inProgress = taskList.filter((task) => task.status === "In Progress").length;
  const overdue = taskList.filter((task) => task.date && task.date < today && task.status !== "Completed").length;
  const completionRate = taskList.length ? Math.round((completed / taskList.length) * 100) : 0;

  const stats = [
    { label: "Total Tasks", value: taskList.length, note: "Across all projects", icon: "▤", color: "bg-blue-50 text-blue-600" },
    { label: "Completed", value: completed, note: `${completionRate}% completion rate`, icon: "✓", color: "bg-emerald-50 text-emerald-600" },
    { label: "In Progress", value: inProgress, note: "Currently underway", icon: "◷", color: "bg-violet-50 text-violet-600" },
    { label: "Overdue", value: overdue, note: "Needs attention", icon: "!", color: "bg-rose-50 text-rose-600" },
  ];

  const visibleTasks = useMemo(() => {
    const result = taskList.filter((task) => {
      const query = search.trim().toLowerCase();
      return (
        (!query || `${task.title} ${task.project}`.toLowerCase().includes(query)) &&
        (statusFilter === "All" || task.status === statusFilter) &&
        (priorityFilter === "All" || task.priority === priorityFilter) &&
        (projectFilter === "All" || task.project === projectFilter)
      );
    });
    if (sortBy === "oldest") return result.reverse();
    if (sortBy === "due") return result.sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
    if (sortBy === "priority") {
      const order: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
      return result.sort((a, b) => order[a.priority] - order[b.priority]);
    }
    return result;
  }, [taskList, search, statusFilter, priorityFilter, projectFilter, sortBy]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setProjectFilter("All");
    setSortBy("newest");
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] text-slate-500">Loading your workspace...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800 md:flex">
      <aside className="flex w-full flex-col border-r border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-200">T</div>
          <div><h1 className="text-xl font-bold tracking-tight">TaskFlow</h1><p className="text-xs text-slate-400">Workspace Manager</p></div>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-4 md:flex-1 md:flex-col">
          <p className="mb-2 hidden px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 md:block">Workspace</p>
          <a href="#dashboard" className="flex shrink-0 items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3 text-sm font-semibold text-indigo-700"><span>▦</span> Overview</a>
          <a href="#tasks" className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"><span>☷</span> My Tasks <span className="ml-auto rounded-md bg-slate-100 px-2 py-0.5 text-xs">{taskList.length}</span></a>
          <a href="#projects" className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"><span>▣</span> Projects</a>
          <a href="#activity" className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"><span>◷</span> Activity</a>
          <div className="mt-auto hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white md:block">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-lg">✦</div>
            <p className="font-semibold">Stay productive</p>
            <p className="mt-1 text-xs leading-5 text-indigo-100">Organize your work and make every day count.</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: `${completionRate}%` }} /></div>
            <p className="mt-2 text-xs text-indigo-100">{completionRate}% of tasks completed</p>
          </div>
        </nav>
        <div className="hidden items-center gap-3 border-t border-slate-100 p-4 md:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">TF</div>
          <div className="min-w-0"><p className="truncate text-sm font-semibold">TaskFlow User</p><p className="truncate text-xs text-slate-400" title={email}>{email || "Personal workspace"}</p></div>
        </div>
      </aside>

      <main id="dashboard" className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-5 py-4 sm:px-8">
          <div><p className="text-xs text-slate-400">Workspace / Overview</p><h2 className="mt-1 text-lg font-bold">Dashboard</h2></div>
          <button type="button" onClick={logOut} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Log out</button>
        </header>

        <div className="mx-auto max-w-[1400px] space-y-8 p-5 sm:p-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-indigo-600">{todayLabel}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Your workspace</h2>
              <p className="mt-2 text-sm text-slate-500">Manage tasks and track progress across your projects.</p>
            </div>
            <button type="button" onClick={openCreate} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">+ New Task</button>
          </section>

          {(error || saving) && (
            <div role={error ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${error ? "border-rose-200 bg-rose-50 text-rose-700" : "border-indigo-100 bg-indigo-50 text-indigo-700"}`}>
              {error || "Saving changes to Supabase..."}
            </div>
          )}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{stat.label}</p><span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${stat.color}`}>{stat.icon}</span></div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</p>
                <p className="mt-2 text-xs text-slate-400">{stat.note}</p>
              </div>
            ))}
          </section>

          <section id="projects" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h3 className="text-lg font-bold text-slate-900">Your Projects</h3><p className="mt-1 text-sm text-slate-500">Click a project to view its tasks.</p></div>
              <button type="button" onClick={() => { setProjectFilter("All"); document.getElementById("tasks")?.scrollIntoView({ behavior: "smooth" }); }} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">View all →</button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {PROJECTS.map((project) => {
                const tasks = taskList.filter((task) => task.project === project.name);
                const done = tasks.filter((task) => task.status === "Completed").length;
                const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
                return (
                  <button key={project.name} type="button" onClick={() => { setProjectFilter(project.name); document.getElementById("tasks")?.scrollIntoView({ behavior: "smooth" }); }} className={`rounded-xl border p-4 text-left transition hover:shadow-sm ${projectFilter === project.name ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-200 hover:border-indigo-200"}`}>
                    <div className="flex items-start justify-between gap-2"><div className={`h-10 w-10 rounded-xl ${project.color}`} /><span className={`rounded-lg px-2.5 py-1 text-xs ${project.tint}`}>{project.category}</span></div>
                    <h4 className="mt-4 font-semibold text-slate-800">{project.name}</h4>
                    <div className="mt-4 flex items-center justify-between text-xs"><span className="text-slate-400">{done} of {tasks.length} completed</span><span className="font-bold text-slate-700">{progress}%</span></div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${project.color}`} style={{ width: `${progress}%` }} /></div>
                  </button>
                );
              })}
            </div>
          </section>

          <section id="tasks" className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
              <div><h3 className="text-lg font-bold text-slate-900">My Tasks</h3><p className="mt-1 text-sm text-slate-500">{visibleTasks.length} of {taskList.length} tasks shown. Click a status to change it.</p></div>
              <button type="button" onClick={clearFilters} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">Clear filters</button>
            </div>
            <div className="grid gap-3 border-t border-slate-100 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-5">
              <input aria-label="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 xl:col-span-1" />
              <select aria-label="Filter status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="All">All statuses</option><option>To Do</option><option>In Progress</option><option>Completed</option></select>
              <select aria-label="Filter priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="All">All priorities</option><option>High</option><option>Medium</option><option>Low</option></select>
              <select aria-label="Filter project" value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="All">All projects</option>{PROJECTS.map((project) => <option key={project.name}>{project.name}</option>)}</select>
              <select aria-label="Sort tasks" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="due">Due date</option><option value="priority">Priority</option></select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-y border-slate-100 bg-slate-50/70 text-xs text-slate-400"><tr><th className="px-6 py-4 font-medium">Task name</th><th className="px-6 py-4 font-medium">Priority</th><th className="px-6 py-4 font-medium">Status</th><th className="px-6 py-4 font-medium">Due date</th><th className="px-6 py-4 text-right font-medium">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleTasks.map((task) => (
                    <tr key={task.id} className="transition hover:bg-slate-50/70">
                      <td className="px-6 py-4"><p className="font-semibold text-slate-800">{task.title}</p><p className="mt-1 text-xs text-slate-400">{task.project}</p></td>
                      <td className="px-6 py-4"><span className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span></td>
                      <td className="px-6 py-4"><button type="button" title="Click to change status" disabled={saving} onClick={() => cycleStatus(task)} className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition hover:opacity-75 ${STATUS_COLORS[task.status]}`}>{task.status}</button></td>
                      <td className={`px-6 py-4 ${task.date && task.date < today && task.status !== "Completed" ? "font-semibold text-rose-600" : "text-slate-500"}`}>{formatDate(task.date)}</td>
                      <td className="px-6 py-4"><div className="flex justify-end gap-2"><button type="button" disabled={saving} onClick={() => openEdit(task)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">Edit</button><button type="button" disabled={saving} onClick={() => deleteTask(task)} className="rounded-lg border border-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50">Delete</button></div></td>
                    </tr>
                  ))}
                  {visibleTasks.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">No tasks found. Try clearing filters or create a new task.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4"><span className="text-xs text-slate-400">Changes are saved securely in Supabase.</span><button type="button" onClick={openCreate} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">+ Add another task →</button></div>
          </section>

          <section id="activity" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <p className="mt-1 text-sm text-slate-500">Actions from this session.</p>
            {activity.length ? <ul className="mt-4 divide-y divide-slate-100">{activity.map((item) => <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm"><span>{item.message}</span><span className="shrink-0 text-xs text-slate-400">{item.time}</span></li>)}</ul> : <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-400">Your activity will appear here after you add, edit, delete, or update a task.</p>}
          </section>
          <footer className="pb-2 text-center text-xs text-slate-400">TaskFlow · Project management made simple</footer>
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="task-dialog-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3"><div><h2 id="task-dialog-title" className="text-xl font-bold text-slate-900">{editingId ? "Edit task" : "Create new task"}</h2><p className="mt-1 text-sm text-slate-500">Set the details of your task.</p></div><button type="button" aria-label="Close dialog" onClick={() => setModalOpen(false)} className="rounded-lg px-2 py-1 text-2xl text-slate-400 hover:bg-slate-100">×</button></div>
            {error && <p role="alert" className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            <form onSubmit={saveTask} className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Task name<input autoFocus required maxLength={120} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="What needs to be done?" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-indigo-500" /></label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">Project<select value={form.project} onChange={(event) => setForm({ ...form, project: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal">{PROJECTS.map((project) => <option key={project.name}>{project.name}</option>)}</select></label>
                <label className="block text-sm font-semibold text-slate-700">Priority<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as Priority })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal"><option>Low</option><option>Medium</option><option>High</option></select></label>
                <label className="block text-sm font-semibold text-slate-700">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Status })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal"><option>To Do</option><option>In Progress</option><option>Completed</option></select></label>
                <label className="block text-sm font-semibold text-slate-700">Due date<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal" /></label>
              </div>
              <div className="flex justify-end gap-3 pt-3"><button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">{saving ? "Saving..." : editingId ? "Save changes" : "Create task"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
