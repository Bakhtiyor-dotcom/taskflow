"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import {
  Activity, ArrowRight, ArrowUpRight, CalendarDays, CheckCircle2,
  ChevronRight, ClipboardList, Clock3, FolderKanban, LayoutDashboard,
  LogOut, Menu, Plus, Search, ShieldCheck, SlidersHorizontal,
  Sparkles, Target, Trash2, X, Pencil, AlertCircle,
} from "lucide-react";
import styles from "./dashboard.module.css";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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
    { label: "Total Tasks", value: taskList.length, note: "Across all projects", icon: ClipboardList, color: "bg-blue-50 text-blue-600", accent: "bg-blue-500" },
    { label: "Completed", value: completed, note: `${completionRate}% completion rate`, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600", accent: "bg-emerald-500" },
    { label: "In Progress", value: inProgress, note: "Currently underway", icon: Clock3, color: "bg-violet-50 text-violet-600", accent: "bg-violet-500" },
    { label: "Overdue", value: overdue, note: "Needs attention", icon: AlertCircle, color: "bg-rose-50 text-rose-600", accent: "bg-rose-500" },
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6fc]">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-500 shadow-sm">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          Loading your workspace...
        </div>
      </div>
    );
  }

  const firstName = email ? email.split("@")[0].split(/[._-]/)[0] : "there";
  const upcomingTask = taskList
    .filter((task) => task.status !== "Completed")
    .slice()
    .sort((a, b) => (a.date || "9999-12-31").localeCompare(b.date || "9999-12-31"))[0];
  const navItems = [
    { label: "Overview", href: "#dashboard", icon: LayoutDashboard, count: null },
    { label: "My Tasks", href: "#tasks", icon: ClipboardList, count: taskList.length },
    { label: "Projects", href: "#projects", icon: FolderKanban, count: null },
    { label: "Activity", href: "#activity", icon: Activity, count: null },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f5f6fc] text-slate-800 md:flex">
      {/* Desktop sidebar and compact mobile navigation. */}
      <aside className="relative z-30 w-full shrink-0 bg-[#10132b] text-white md:fixed md:inset-y-0 md:left-0 md:flex md:w-[250px] md:flex-col xl:w-[270px]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 md:px-6 md:py-7">
          <a href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-extrabold shadow-lg shadow-indigo-900/50">T</div>
            <div className="min-w-0">
              <p className="text-xl font-extrabold tracking-tight">TaskFlow</p>
              <p className="text-[11px] font-medium tracking-wide text-indigo-200/60">YOUR WORKSPACE</p>
            </div>
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
            aria-controls="taskflow-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-white md:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav id="taskflow-navigation" aria-label="Workspace navigation" className={`${mobileMenuOpen ? "flex" : "hidden"} flex-col gap-1 px-3 py-4 md:flex md:flex-1 md:px-4 md:py-6`}>
          <p className="mb-3 hidden px-4 text-[10px] font-bold uppercase tracking-[0.24em] text-indigo-200/40 md:block">Workspace</p>
          {navItems.map(({ label, href, icon: Icon, count }, index) => (
            <a
              href={href}
              key={label}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${index === 0 ? "border border-indigo-400/20 bg-indigo-500/20 text-white" : "text-slate-400 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon className={index === 0 ? "h-[18px] w-[18px] text-indigo-300" : "h-[18px] w-[18px]"} strokeWidth={1.9} />
              <span>{label}</span>
              {count !== null && <span className="ml-auto rounded-lg bg-white/10 px-2 py-0.5 text-xs text-indigo-100">{count}</span>}
            </a>
          ))}

          <div className="mt-5 hidden rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-transparent p-4 md:block">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-400/20"><Sparkles size={19} className="text-indigo-200" /></div>
            <p className="text-sm font-semibold text-white">Keep your momentum</p>
            <p className="mt-1 text-xs leading-5 text-indigo-100/60">Small steps add up to big wins.</p>
            <div className="mt-5 flex items-end justify-between"><span className="text-2xl font-bold">{completionRate}%</span><span className="text-[11px] text-indigo-100/60">Completed</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300 transition-all duration-700" style={{ width: `${completionRate}%` }} /></div>
          </div>
        </nav>
        <div className="hidden items-center gap-3 border-t border-white/10 px-5 py-5 md:flex">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">{(firstName[0] || "T").toUpperCase()}</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold capitalize text-white">{firstName}</p>
            <p className="truncate text-xs text-indigo-100/50" title={email}>{email || "Personal workspace"}</p>
          </div>
          <button onClick={logOut} type="button" aria-label="Log out" title="Log out" className="ml-auto rounded-lg p-2 text-indigo-100/60 transition hover:bg-white/10 hover:text-white"><LogOut size={17} /></button>
        </div>
      </aside>

      <main id="dashboard" className="w-full min-w-0 flex-1 scroll-mt-0 md:ml-[250px] xl:ml-[270px]">
        <header className="flex min-w-0 items-center justify-between gap-4 border-b border-slate-200/70 bg-white/80 px-4 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-slate-400">Workspace <span className="mx-2 text-slate-300">/</span> Overview</p>
            <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Private workspace</span>
            <button type="button" onClick={logOut} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 sm:text-sm"><LogOut size={15} /> Log out</button>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1500px] min-w-0 space-y-6 px-4 py-6 sm:space-y-7 sm:px-8 sm:py-8 lg:px-10">
          {/* High-impact, responsive hero card. */}
          <section className={`relative isolate overflow-hidden rounded-[28px] bg-[#15183b] px-6 py-8 text-white shadow-[0_22px_70px_-26px_rgba(48,42,131,0.6)] sm:px-9 sm:py-10 lg:px-11 ${styles.enter}`}>
            <div className="pointer-events-none absolute -right-16 -top-32 h-80 w-80 rounded-full bg-indigo-500/40 blur-[85px]" />
            <div className={`pointer-events-none absolute -bottom-36 right-1/4 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-[78px] ${styles.float}`} />
            <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />
            <div className="relative z-10 grid items-center gap-7 lg:grid-cols-[minmax(0,1fr)_250px]">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-100 backdrop-blur-sm"><Sparkles size={13} /> Your productivity hub</span>
                <p className="mt-5 text-sm font-medium text-indigo-200">{todayLabel}</p>
                <h2 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">Stay focused. <span className="text-indigo-300">Make progress.</span></h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100/70 sm:text-base">Welcome back, <span className="font-semibold capitalize text-white">{firstName}</span>. Keep your projects moving, one task at a time.</p>
                <button onClick={openCreate} type="button" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-indigo-700 shadow-lg shadow-indigo-950/30 transition hover:-translate-y-0.5 hover:bg-indigo-50 sm:w-auto"><Plus size={18} strokeWidth={2.5} /> Create new task <ArrowRight size={16} /></button>
              </div>
              <div className="relative rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:max-w-[300px] lg:max-w-none">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(#a5b4fc ${completionRate}%, rgba(255,255,255,.12) ${completionRate}% 100%)` }}>
                    <div className="flex h-[65px] w-[65px] items-center justify-center rounded-full bg-[#25274c] text-lg font-extrabold">{completionRate}%</div>
                  </div>
                  <div><p className="text-sm font-semibold">Your progress</p><p className="mt-1 text-xs leading-5 text-indigo-100/65">{completed} of {taskList.length} tasks done</p></div>
                </div>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-indigo-200/70">Next in focus</p>
                  <p className="mt-2 line-clamp-2 text-sm font-semibold text-white">{upcomingTask?.title || "Your next win starts here"}</p>
                  <p className="mt-1 text-xs text-indigo-100/60">{upcomingTask ? `${upcomingTask.project} · ${formatDate(upcomingTask.date)}` : "Add a task to get started"}</p>
                </div>
              </div>
            </div>
          </section>

          {(error || saving) && (
            <div role={error ? "alert" : "status"} className={`rounded-2xl border px-4 py-3 text-sm ${error ? "border-rose-200 bg-rose-50 text-rose-700" : "border-indigo-100 bg-indigo-50 text-indigo-700"}`}>
              {error || "Saving changes to Supabase..."}
            </div>
          )}

          {/* Statistics use live task data; no decorative fake numbers. */}
          <section aria-label="Task statistics" className={`grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 ${styles.enterDelayed}`}>
            {stats.map(({ label, value, note, icon: Icon, color, accent }) => (
              <div key={label} className="group relative min-w-0 overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_10px_30px_-20px_rgba(14,24,60,.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(14,24,60,.25)] sm:p-5">
                <div className={`absolute left-0 top-0 h-1 w-full ${accent}`} />
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 text-xs font-semibold text-slate-500 sm:text-sm">{label}</p>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${color}`}><Icon size={20} strokeWidth={2} /></div>
                </div>
                <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-[36px]">{value}</p>
                <p className="mt-1 hidden text-xs text-slate-400 sm:block">{note}</p>
              </div>
            ))}
          </section>

          <section id="projects" className="min-w-0 scroll-mt-6 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><div className="flex items-center gap-2"><FolderKanban size={20} className="text-indigo-600" /><h3 className="text-xl font-bold tracking-tight text-slate-900">Your projects</h3></div><p className="mt-1.5 text-sm text-slate-500">A quick view of everything you&apos;re working on.</p></div>
              <button type="button" onClick={() => { setProjectFilter("All"); document.getElementById("tasks")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50">View all <ArrowUpRight size={16} /></button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
              {PROJECTS.map((project, index) => {
                const tasks = taskList.filter((task) => task.project === project.name);
                const done = tasks.filter((task) => task.status === "Completed").length;
                const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
                const gradients = ["from-violet-500 to-fuchsia-500", "from-blue-500 to-cyan-500", "from-emerald-500 to-teal-500", "from-amber-500 to-orange-500"];
                return (
                  <button key={project.name} type="button" onClick={() => { setProjectFilter(project.name); document.getElementById("tasks")?.scrollIntoView({ behavior: "smooth" }); }} className={`group min-w-0 rounded-2xl border p-3.5 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-100/40 sm:p-5 ${projectFilter === project.name ? "border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-100" : "border-slate-200 bg-slate-50/40 hover:border-indigo-200 hover:bg-white"}`}>
                    <div className="flex items-center justify-between gap-1">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradients[index]} text-white shadow-sm`}><FolderKanban size={19} /></span>
                      <ChevronRight size={17} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
                    </div>
                    <h4 className="mt-4 min-h-[2.5rem] break-words text-sm font-bold leading-5 text-slate-900 sm:min-h-0 sm:text-base">{project.name}</h4>
                    <p className="mt-1 text-xs text-slate-500">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</p>
                    <div className="mt-4 flex items-center justify-between gap-2 text-[11px] sm:text-xs"><span className="text-slate-500">Progress</span><span className="font-bold text-slate-700">{progress}%</span></div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/70"><div className={`h-full rounded-full transition-all duration-700 ${project.color}`} style={{ width: `${progress}%` }} /></div>
                  </button>
                );
              })}
            </div>
          </section>

          <section id="tasks" className="min-w-0 scroll-mt-6 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 px-4 pb-4 pt-5 sm:px-6 sm:pt-6">
              <div><div className="flex items-center gap-2"><Target size={20} className="text-indigo-600" /><h3 className="text-xl font-bold tracking-tight text-slate-900">My tasks</h3></div><p className="mt-1.5 text-xs text-slate-500 sm:text-sm">{visibleTasks.length} of {taskList.length} tasks shown. Tap a status to change it.</p></div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700 sm:text-sm"><Plus size={16} /> New task</button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto px-4 pb-4 sm:px-6">
              {[{ label: "All tasks", value: "All" }, { label: "In progress", value: "In Progress" }, { label: "Completed", value: "Completed" }, { label: "To do", value: "To Do" }].map((tab) => (
                <button type="button" key={tab.value} onClick={() => setStatusFilter(tab.value)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${statusFilter === tab.value ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200" : "bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"}`}>{tab.label}</button>
              ))}
            </div>
            <div className="grid min-w-0 gap-3 border-t border-slate-100 bg-slate-50/30 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
              <label className="relative block min-w-0">
                <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input aria-label="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." className="w-full min-w-0 rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
              </label>
              <button type="button" aria-expanded={mobileFiltersOpen} onClick={() => setMobileFiltersOpen((open) => !open)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-600 sm:justify-start md:hidden"><SlidersHorizontal size={16} /> {mobileFiltersOpen ? "Hide filters" : "More filters"}</button>
              <select aria-label="Filter priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className={`${mobileFiltersOpen ? "block" : "hidden"} min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400 md:block`}><option value="All">All priorities</option><option>High</option><option>Medium</option><option>Low</option></select>
              <select aria-label="Filter project" value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} className={`${mobileFiltersOpen ? "block" : "hidden"} min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400 md:block`}><option value="All">All projects</option>{PROJECTS.map((project) => <option key={project.name}>{project.name}</option>)}</select>
              <select aria-label="Sort tasks" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={`${mobileFiltersOpen ? "block" : "hidden"} min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400 md:block`}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="due">Due date</option><option value="priority">Priority</option></select>
              <button type="button" onClick={clearFilters} className={`${mobileFiltersOpen ? "inline-flex" : "hidden"} items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-semibold text-slate-500 transition hover:text-indigo-600 md:inline-flex`}>Clear filters</button>
            </div>

            {/* Mobile-first task cards. Desktop gets a full table. */}
            <div className="divide-y divide-slate-100 md:hidden">
              {visibleTasks.map((task) => (
                <article key={task.id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1"><h4 className="break-words text-sm font-bold text-slate-900">{task.title}</h4><p className="mt-1 text-xs text-slate-400">{task.project}</p></div>
                    <span className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2"><button type="button" title="Tap to change status" disabled={saving} onClick={() => cycleStatus(task)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition hover:opacity-80 ${STATUS_COLORS[task.status]}`}>{task.status} ↻</button><span className={`flex items-center gap-1 text-xs ${task.date && task.date < today && task.status !== "Completed" ? "font-semibold text-rose-600" : "text-slate-500"}`}><CalendarDays size={13} /> {formatDate(task.date)}</span></div>
                  <div className="flex gap-2 border-t border-slate-100 pt-3"><button type="button" disabled={saving} onClick={() => openEdit(task)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"><Pencil size={14} /> Edit</button><button type="button" disabled={saving} onClick={() => deleteTask(task)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-rose-100 text-xs font-semibold text-rose-600"><Trash2 size={14} /> Delete</button></div>
                </article>
              ))}
              {visibleTasks.length === 0 && <EmptyTasks onAdd={openCreate} hasTasks={taskList.length > 0} />}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-y border-slate-100 bg-slate-50/60 text-xs text-slate-400"><tr><th className="px-6 py-4 font-semibold">Task name</th><th className="px-5 py-4 font-semibold">Priority</th><th className="px-5 py-4 font-semibold">Status</th><th className="px-5 py-4 font-semibold">Due date</th><th className="px-6 py-4 text-right font-semibold">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleTasks.map((task) => (
                    <tr key={task.id} className="transition hover:bg-indigo-50/30">
                      <td className="px-6 py-4"><p className="font-bold text-slate-800">{task.title}</p><p className="mt-1 text-xs text-slate-400">{task.project}</p></td>
                      <td className="px-5 py-4"><span className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span></td>
                      <td className="px-5 py-4"><button type="button" title="Click to change status" disabled={saving} onClick={() => cycleStatus(task)} className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition hover:opacity-80 ${STATUS_COLORS[task.status]}`}>{task.status}</button></td>
                      <td className={`px-5 py-4 text-xs ${task.date && task.date < today && task.status !== "Completed" ? "font-semibold text-rose-600" : "text-slate-500"}`}>{formatDate(task.date)}</td>
                      <td className="px-6 py-4"><div className="flex justify-end gap-2"><button type="button" disabled={saving} onClick={() => openEdit(task)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-white"><Pencil size={13} /> Edit</button><button type="button" disabled={saving} onClick={() => deleteTask(task)} className="inline-flex items-center gap-1 rounded-lg border border-rose-100 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"><Trash2 size={13} /> Delete</button></div></td>
                    </tr>
                  ))}
                  {visibleTasks.length === 0 && <tr><td colSpan={5} className="px-6 py-10"><EmptyTasks onAdd={openCreate} hasTasks={taskList.length > 0} /></td></tr>}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:px-6"><span className="inline-flex items-center gap-2 text-xs text-slate-400"><ShieldCheck size={14} className="text-emerald-500" /> Your tasks are saved securely in Supabase.</span><button type="button" onClick={openCreate} className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"><Plus size={16} /> Add another task <ArrowRight size={15} /></button></div>
          </section>

          <section id="activity" className="min-w-0 scroll-mt-6 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2"><Activity size={20} className="text-indigo-600" /><h3 className="text-xl font-bold tracking-tight text-slate-900">Recent activity</h3></div>
            <p className="mt-1.5 text-sm text-slate-500">Actions from your current session.</p>
            {activity.length ? (
              <ul className="mt-5 divide-y divide-slate-100">
                {activity.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-start justify-between gap-3 py-3.5 text-sm">
                    <span className="flex min-w-0 items-start gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" /><span>{item.message}</span></span>
                    <span className="shrink-0 pl-5 text-xs text-slate-400">{item.time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Activity size={19} /></div><p className="pt-1 text-sm leading-6 text-slate-500">Your latest activity will appear here after you create, edit, or complete a task.</p></div>
            )}
          </section>
          <footer className="pb-4 text-center text-xs text-slate-400">TaskFlow · A calmer way to get things done.</footer>
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-[3px] sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setModalOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="task-dialog-title" className="max-h-[94dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-[28px] bg-white p-5 pb-8 shadow-2xl sm:max-h-[90vh] sm:rounded-[24px] sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-3"><div><span className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-500">Task details</span><h2 id="task-dialog-title" className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{editingId ? "Edit task" : "Create new task"}</h2><p className="mt-1 text-sm text-slate-500">Give your next win a name.</p></div><button type="button" aria-label="Close dialog" disabled={saving} onClick={() => setModalOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={20} /></button></div>
            {error && <p role="alert" className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            <form onSubmit={saveTask} className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Task name<input autoFocus required maxLength={120} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="What needs to be done?" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" /></label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">Project<select value={form.project} onChange={(event) => setForm({ ...form, project: event.target.value })} className="mt-2 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3.5 font-normal focus:border-indigo-500">{PROJECTS.map((project) => <option key={project.name}>{project.name}</option>)}</select></label>
                <label className="block text-sm font-semibold text-slate-700">Priority<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as Priority })} className="mt-2 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3.5 font-normal focus:border-indigo-500"><option>Low</option><option>Medium</option><option>High</option></select></label>
                <label className="block text-sm font-semibold text-slate-700">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Status })} className="mt-2 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3.5 font-normal focus:border-indigo-500"><option>To Do</option><option>In Progress</option><option>Completed</option></select></label>
                <label className="block text-sm font-semibold text-slate-700">Due date<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="mt-2 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3.5 font-normal focus:border-indigo-500" /></label>
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" disabled={saving} onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60">{saving ? "Saving..." : editingId ? "Save changes" : "Create task"}<ArrowRight size={17} /></button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyTasks({ onAdd, hasTasks }: { onAdd: () => void; hasTasks: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500"><ClipboardList size={27} /></div>
      <h4 className="mt-4 text-base font-bold text-slate-900">{hasTasks ? "No matching tasks" : "Your workspace is ready"}</h4>
      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">{hasTasks ? "Try clearing your filters to see more tasks." : "Create your first task and start making progress."}</p>
      {!hasTasks && <button type="button" onClick={onAdd} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"><Plus size={16} /> Add your first task</button>}
    </div>
  );
}
