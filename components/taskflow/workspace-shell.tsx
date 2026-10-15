"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, ChevronRight, ClipboardList, FolderKanban, LayoutDashboard, KanbanSquare,
  LogOut, Menu, ShieldCheck, Sparkles, X,
} from "lucide-react";
import { TaskFlowBrand } from "./brand";

type WorkspaceShellProps = {
  children: ReactNode;
  email: string;
  taskCount: number;
  completionRate: number;
  onSignOut: () => void | Promise<void>;
};

const nav = [
  { href: "#dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/board", label: "Kanban Board", icon: KanbanSquare },
  { href: "#tasks", label: "My Tasks", icon: ClipboardList },
  { href: "#projects", label: "Projects", icon: FolderKanban },
  { href: "#activity", label: "Activity", icon: Activity },
] as const;

export function WorkspaceShell({ children, email, taskCount, completionRate, onSignOut }: WorkspaceShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isBoard = pathname === "/board";
  const [selected, setSelected] = useState<string>("#dashboard");
  const username = email.split("@")[0]?.split(/[._-]/)[0] || "TaskFlow user";
  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="tf-app tf-app-backdrop w-full min-w-0 overflow-x-clip">
      <aside className="tf-sidebar relative z-30 w-full border-b border-white/10 text-white md:fixed md:inset-y-0 md:left-0 md:flex md:h-dvh md:w-[250px] md:flex-col md:border-b-0 md:border-r md:border-white/10 xl:w-[270px]">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5 py-4 md:px-6 md:py-6">
          <TaskFlowBrand light />
          <button type="button" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 text-white md:hidden" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="tf-workspace-navigation" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        <nav id="tf-workspace-navigation" aria-label="Workspace navigation" className={`${menuOpen ? "flex" : "hidden"} min-h-0 flex-col gap-1 px-3 py-4 md:flex md:flex-1 md:overflow-y-auto md:px-4 md:py-6`}>
          <p className="mb-3 hidden px-4 text-[10px] font-bold uppercase tracking-[0.24em] text-indigo-100/40 md:block">Workspace</p>
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/board" ? isBoard : !isBoard && selected === href;
            const destination = isBoard && href.startsWith("#") ? `/dashboard${href}` : href;
            return (
              <Link key={href} href={destination} onClick={() => { setSelected(href); setMenuOpen(false); }} aria-current={active ? "page" : undefined} className={`group flex min-h-12 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${active ? "tf-nav-active text-white" : "border-transparent text-indigo-100/60 hover:bg-white/[0.07] hover:text-white"}`}>
                <Icon size={19} strokeWidth={1.9} className={active ? "text-[#b6aaff]" : "text-indigo-100/50 group-hover:text-white"} />
                <span>{label}</span>
                {href === "#tasks" ? <span className="ml-auto rounded-lg bg-white/10 px-2 py-0.5 text-[11px] text-indigo-100">{taskCount}</span> : active ? <ChevronRight size={15} className="ml-auto text-indigo-300/70" /> : null}
              </Link>
            );
          })}

          <div className="mt-7 hidden overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-[#2b285e] via-[#1d214e] to-[#161b39] p-4 md:block">
            <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#c6b9ff]"><Sparkles size={19} /></div>
            <p className="text-sm font-bold">Your momentum</p>
            <p className="mt-1 text-xs leading-5 text-indigo-100/55">One task at a time, progress adds up.</p>
            <div className="mt-5 flex items-end justify-between"><strong className="text-2xl">{completionRate}%</strong><span className="text-[11px] text-indigo-100/55">Completed</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400 transition-[width] duration-500" style={{ width: `${completionRate}%` }} /></div>
          </div>
          <div className="mt-4 flex items-center gap-2 px-3 text-xs text-indigo-100/50 md:mt-auto"><ShieldCheck size={14} /> Private workspace</div>
          <button type="button" onClick={() => { setMenuOpen(false); void onSignOut(); }} className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white md:hidden"><LogOut size={16} /> Log out</button>
        </nav>

        <div className="hidden shrink-0 items-center gap-3 border-t border-white/10 px-5 py-5 md:flex">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-extrabold text-white">{initial}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold capitalize text-white">{username}</p>
            <p className="truncate text-xs text-indigo-200/50" title={email}>{email || "Personal workspace"}</p>
          </div>
          <button type="button" aria-label="Log out" title="Log out" onClick={() => void onSignOut()} className="rounded-lg p-2 text-indigo-100/60 transition hover:bg-white/10 hover:text-white"><LogOut size={18} /></button>
        </div>
      </aside>

      <div className="min-w-0 md:pl-[250px] xl:pl-[270px]">
        <header className="sticky top-0 z-20 flex min-w-0 items-center justify-between gap-4 border-b border-[#e9e8f3] bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace <span className="mx-2 text-slate-300">/</span> {isBoard ? "Board" : "Overview"}</p>
            <h1 className="mt-1 text-lg font-extrabold tracking-tight text-[#20233e]">{isBoard ? "Kanban Board" : "Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href={isBoard ? "/dashboard#tasks" : "/board"} className="hidden items-center gap-2 rounded-xl border border-[#e9e8f3] bg-white px-3.5 py-2.5 text-xs font-bold text-[#5945c9] transition hover:bg-violet-50 sm:inline-flex">{isBoard ? <ClipboardList size={16} /> : <KanbanSquare size={16} />} {isBoard ? "Task list" : "Kanban Board"}</Link>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xs font-bold text-white sm:h-10 sm:w-10" title={email} aria-label="Account avatar">{initial}</span>
          </div>
        </header>
        <main id={isBoard ? "board" : "dashboard"} className="min-w-0 scroll-mt-16">{children}</main>
      </div>
    </div>
  );
}
