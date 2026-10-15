import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Clock3,
  ShieldCheck,
  Users,
  AlertCircle,
} from "lucide-react";

type RecentUser = {
  email: string | null;
  created_at: string;
};

type AdminData = {
  total_users: number;
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  overdue_tasks: number;
  recent_users: RecentUser[];
};

function dateLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-6 text-center text-sm text-slate-500">
          Loading admin dashboard...
        </main>
      }
    >
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/auth/login");
  }

  // Server-side page authorization. This is not just a hidden menu item.
  const { data: adminRole, error: roleError } = await supabase
    .from("app_admins")
    .select("user_id")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (roleError || !adminRole) {
    redirect("/access-denied");

  }
  // The database function checks app_admins AGAIN before returning any
  // cross-user statistics. No service-role key is sent to the browser.
  const { data, error } = await supabase.rpc("admin_dashboard_data");
  const metrics = !error && data ? (data as AdminData) : null;

  const completionRate = metrics?.total_tasks
    ? Math.round((metrics.completed_tasks / metrics.total_tasks) * 100)
    : 0;

  const cards = [
    {
      title: "Total users",
      value: metrics?.total_users ?? 0,
      subtitle: "Registered accounts",
      icon: Users,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Total tasks",
      value: metrics?.total_tasks ?? 0,
      subtitle: "Across all accounts",
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Completed",
      value: metrics?.completed_tasks ?? 0,
      subtitle: `${completionRate}% completion rate`,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "In progress",
      value: metrics?.in_progress_tasks ?? 0,
      subtitle: "Currently underway",
      icon: Clock3,
      color: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-100">
              T
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight">
                TaskFlow
              </span>
              <span className="block text-xs text-slate-400">Admin console</span>
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            My Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-7 px-5 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              ADMIN ONLY
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Administration overview
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Key metrics across TaskFlow accounts. Accessible only to authorized administrators.
            </p>
          </div>
          <span className="max-w-full break-all rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
            {authData.user.email}
          </span>
        </div>

        {error && (
          <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
            Could not load admin statistics. Check that you ran
            <code className="mx-1 font-bold">supabase/admin_dashboard.sql</code>
            in your Supabase SQL Editor.
          </div>
        )}

        {metrics && (
          <>
            <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" aria-label="Application statistics">
              {cards.map(({ title, value, subtitle, icon: Icon, color }) => (
                <div key={title} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-xs font-semibold text-slate-500 sm:text-sm">{title}</p>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl">
                    {value.toLocaleString("en-US")}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{subtitle}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
              <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                  <h2 className="text-lg font-bold">Recent sign-ups</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Up to eight most recently created accounts
                  </p>
                </div>
                {metrics.recent_users.length ? (
                  <ul className="divide-y divide-slate-100">
                    {metrics.recent_users.map((user, index) => (
                      <li key={`${user.created_at}-${index}`} className="flex min-w-0 flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
                        <div className="min-w-0">
                          <p className="break-all text-sm font-semibold text-slate-800">
                            {user.email || "No email provided"}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">Registered account</p>
                        </div>
                        <time className="shrink-0 text-xs font-medium text-slate-500">
                          {dateLabel(user.created_at)}
                        </time>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-6 py-8 text-sm text-slate-400">No users yet.</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-bold">Task completion</h2>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold tabular-nums">{completionRate}%</span>
                    <span className="text-sm text-slate-400">completed</span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={completionRate} aria-valuemin={0} aria-valuemax={100} aria-label="Task completion rate">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${completionRate}%` }} />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    {metrics.completed_tasks} of {metrics.total_tasks} tasks completed.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-5 sm:p-6">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" aria-hidden="true" />
                  <div>
                    <h2 className="text-sm font-bold text-rose-900">Overdue tasks</h2>
                    <p className="mt-2 text-3xl font-extrabold tabular-nums text-rose-700">
                      {metrics.overdue_tasks}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-rose-700">
                      Tasks past their due date that are not completed.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        <p className="pb-4 text-center text-xs text-slate-400">
          TaskFlow Admin · Protected statistics
        </p>
      </div>
    </main>
  );
}
