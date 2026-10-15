import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  Layers3,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { TaskFlowBrand } from "@/components/taskflow/brand";

type AuthShellProps = {
  children: ReactNode;
  mode: "login" | "signup" | "recovery" | "notice";
};

const kanban = [
  {
    label: "To do",
    count: 2,
    color: "#f5c66b",
    tasks: [
      { title: "Plan next milestone", project: "Website Redesign", priority: "High", priorityStyle: "bg-rose-400/15 text-rose-200", progress: "30%", bar: "bg-rose-400" },
      { title: "Organize project notes", project: "Personal", priority: "Medium", priorityStyle: "bg-amber-400/15 text-amber-200", progress: "10%", bar: "bg-amber-400" },
    ],
  },
  {
    label: "In progress",
    count: 1,
    color: "#8d89ff",
    tasks: [
      { title: "Design new dashboard", project: "Mobile App", priority: "High", priorityStyle: "bg-rose-400/15 text-rose-200", progress: "65%", bar: "bg-indigo-400" },
    ],
  },
  {
    label: "Completed",
    count: 1,
    color: "#34d399",
    tasks: [
      { title: "Set up workspace", project: "Marketing", priority: "Low", priorityStyle: "bg-emerald-400/15 text-emerald-200", progress: "100%", bar: "bg-emerald-400" },
    ],
  },
];

function PreviewBoard() {
  return (
    <div className="relative mt-10 w-full overflow-hidden rounded-[25px] border border-white/[0.12] bg-[#111932]/95 shadow-[0_28px_80px_rgba(0,0,0,0.35)] ring-1 ring-indigo-400/10 xl:mt-12">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-[#fb6a89]" />
          <span className="h-2 w-2 rounded-full bg-[#ffc66c]" />
          <span className="h-2 w-2 rounded-full bg-[#42d6aa]" />
        </div>
        <span className="text-[10px] font-semibold tracking-[0.13em] text-slate-500">WORKSPACE PREVIEW</span>
        <span className="h-2 w-8 rounded-full bg-white/10" />
      </div>
      <div className="p-4 xl:p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-indigo-300">Your space</p>
            <p className="mt-1.5 text-lg font-extrabold text-white">Project board</p>
          </div>
          <span className="rounded-lg bg-indigo-500/20 px-3 py-1.5 text-[10px] font-bold text-indigo-200">4 tasks</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {kanban.map((column) => (
            <div key={column.label} className="min-w-0 rounded-xl border border-white/[0.075] bg-[#0c142d] p-2 sm:p-2.5">
              <div className="mb-2 flex items-center justify-between gap-1.5">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: column.color }} />
                  <span className="truncate text-[9px] font-bold text-slate-200 sm:text-[10px]">{column.label}</span>
                </div>
                <span className="rounded-md bg-white/[0.08] px-1.5 py-0.5 text-[9px] text-slate-300">{column.count}</span>
              </div>
              <div className="space-y-2">
                {column.tasks.map((task) => (
                  <div key={task.title} className="rounded-xl border border-white/[0.08] bg-[#1a2546] p-2.5 shadow-sm sm:p-3">
                    <div className="mb-2.5 flex items-center justify-between gap-1.5">
                      <span className={`rounded px-1.5 py-1 text-[8px] font-bold ${task.priorityStyle}`}>{task.priority}</span>
                    </div>
                    <p className="min-h-[2.5rem] text-[10px] font-semibold leading-4 text-white sm:text-[11px]">{task.title}</p>
                    <p className="mt-1 truncate text-[9px] text-slate-400">{task.project}</p>
                    <div className="mt-3 flex justify-between text-[8px] text-slate-400"><span>Progress</span><span>{task.progress}</span></div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${task.bar}`} style={{ width: task.progress }} /></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AuthShell({ children, mode }: AuthShellProps) {
  const signup = mode === "signup";
  const recovery = mode === "recovery";
  const notice = mode === "notice";

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#0a1025] font-sans text-white lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(80,85,220,.16),transparent_34%),radial-gradient(circle_at_78%_75%,rgba(142,74,235,.15),transparent_36%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(165,174,255,0.35)_1px,transparent_1px)] [background-size:28px_28px]" />

      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-white/[0.08] px-8 py-10 lg:flex xl:px-14 xl:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-28 h-[470px] w-[470px] rounded-full bg-indigo-500/20 blur-[130px]" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-20 right-[-200px] h-[450px] w-[450px] rounded-full bg-violet-500/20 blur-[120px]" />
        <TaskFlowBrand light />

        <div className="relative z-10 mx-auto w-full max-w-[600px] py-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-300/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-indigo-200">
            <Sparkles size={14} /> A clearer way to get things done
          </p>
          <h1 className="mt-7 max-w-[540px] text-4xl font-black leading-[1.13] tracking-[-0.045em] text-white xl:text-[54px]">
            {signup ? "A better workflow starts here." : recovery ? "Get back to what matters." : notice ? "You're one step closer." : "Your work, beautifully organized."}
          </h1>
          <p className="mt-5 max-w-[475px] text-base leading-8 text-[#a6afd0]">
            Keep tasks, priorities, and projects in one calm workspace. Less clutter, more momentum.
          </p>
          <PreviewBoard />
          <div className="mt-7 flex flex-wrap items-center gap-5 text-xs font-medium text-slate-300">
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Project organization</span>
            <span className="inline-flex items-center gap-2"><Clock3 size={16} className="text-indigo-300" /> Deadline tracking</span>
            <span className="inline-flex items-center gap-2"><LockKeyhole size={16} className="text-violet-300" /> Secure access</span>
          </div>
        </div>
        <div className="relative flex items-center justify-between gap-4 text-xs text-slate-500">
          <span>© TaskFlow</span>
          <span>Built for focused work.</span>
        </div>
      </section>

      <section className="relative z-10 flex min-h-screen min-w-0 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:bg-[#f7f7fc] lg:px-10 lg:text-slate-900 xl:px-14">
        <header className="flex items-center justify-between gap-3">
          <TaskFlowBrand light className="lg:hidden" />
          <Link href="/" className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 lg:border-slate-200 lg:bg-white lg:text-slate-500 lg:hover:border-indigo-200 lg:hover:text-indigo-600">
            <ArrowLeft size={14} /> Back to home
          </Link>
        </header>

        <div className="mx-auto flex w-full max-w-[455px] flex-1 flex-col justify-center py-10 sm:py-14">
          <div className="relative rounded-[28px] border border-white/15 bg-white p-6 text-slate-900 shadow-[0_25px_75px_rgba(2,4,20,0.3)] sm:p-9 lg:border-slate-200/80 lg:shadow-[0_25px_75px_rgba(55,53,125,0.09)]">
            <div className="pointer-events-none absolute -top-px left-10 h-[2px] w-[45%] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" aria-hidden="true" />
            {children}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-[#b0b6d2] lg:text-slate-400">
            <Layers3 size={15} /> Your workspace is waiting.
          </div>
        </div>
        <div className="text-center text-[11px] text-[#878faa] lg:text-slate-400">
          <span className="inline-flex items-center gap-2"><Check size={13} /> Secure sign-in powered by Supabase</span>
          <span className="mx-2 opacity-40">•</span>
          <Link href="/auth/login" className="hover:underline">Account access</Link>
        </div>
      </section>
    </main>
  );
}
