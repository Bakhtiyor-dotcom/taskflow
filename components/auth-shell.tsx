import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  LayoutDashboard,
  ListTodo,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type AuthShellProps = {
  children: ReactNode;
  mode: "login" | "signup";
};

export function AuthShell({ children, mode }: AuthShellProps) {
  const signup = mode === "signup";

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900 lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-10 text-white lg:flex xl:p-14">
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/10 bg-white/5" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 -left-28 h-[34rem] w-[34rem] rounded-full border border-white/10 bg-white/5" />

        <Link href="/" className="relative z-10 flex w-fit items-center gap-3 text-xl font-bold tracking-tight">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl font-extrabold text-indigo-700 shadow-lg shadow-indigo-950/10">T</span>
          TaskFlow
        </Link>

        <div className="relative z-10 mx-auto w-full max-w-[530px] py-14">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-indigo-50 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" /> Your productivity workspace
          </div>
          <h1 className="max-w-[450px] text-4xl font-extrabold leading-[1.15] tracking-tight xl:text-5xl">
            {signup ? "Make space for your best work." : "Everything in its place. Finally."}
          </h1>
          <p className="mt-5 max-w-[430px] text-base leading-7 text-indigo-100">
            Plan your day, focus on what matters, and keep your projects moving—all from one calm workspace.
          </p>

          <div className="mt-10 overflow-hidden rounded-[26px] border border-white/20 bg-white p-5 text-slate-900 shadow-2xl shadow-indigo-950/25 xl:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><LayoutDashboard className="h-5 w-5" /></span>
                <div>
                  <p className="text-sm font-bold">My workspace</p>
                  <p className="text-xs text-slate-400">A clear view of your day</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">On track</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-indigo-50 p-3.5"><ListTodo className="h-4 w-4 text-indigo-600" /><p className="mt-3 text-2xl font-extrabold">12</p><p className="mt-1 text-[11px] text-slate-500">Total tasks</p></div>
              <div className="rounded-2xl bg-emerald-50 p-3.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><p className="mt-3 text-2xl font-extrabold">8</p><p className="mt-1 text-[11px] text-slate-500">Completed</p></div>
              <div className="rounded-2xl bg-violet-50 p-3.5"><TrendingUp className="h-4 w-4 text-violet-600" /><p className="mt-3 text-2xl font-extrabold">67%</p><p className="mt-1 text-[11px] text-slate-500">Progress</p></div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 px-3.5 py-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" /><span className="flex-1 text-sm font-medium">Plan the weekly sprint</span><span className="text-xs text-slate-400">Done</span></div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 px-3.5 py-3"><Circle className="h-5 w-5 shrink-0 text-indigo-400" /><span className="flex-1 text-sm font-medium">Review project milestones</span><span className="rounded-md bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">Today</span></div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 px-3.5 py-3"><Circle className="h-5 w-5 shrink-0 text-indigo-400" /><span className="flex-1 text-sm font-medium">Share updates with the team</span><span className="text-xs text-slate-400">Tomorrow</span></div>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-indigo-600"><Check className="h-4 w-4" /> Less busywork. More progress.</div>
          </div>
        </div>
        <p className="relative z-10 text-xs text-indigo-200">© TaskFlow · Organize your work, your way.</p>
      </section>

      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-12 lg:px-14 xl:px-24">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">T</span>
            TaskFlow
          </Link>
          <Link href="/" className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-14">
          {children}
        </div>
        <p className="text-center text-xs text-slate-400">A simpler way to stay organized.</p>
      </section>
    </main>
  );
}
