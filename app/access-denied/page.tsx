import Link from "next/link";
import { ArrowLeft, House, LockKeyhole, ShieldX } from "lucide-react";

export const metadata = {
  title: "Access Denied | TaskFlow",
  description: "You do not have permission to view this page.",
};

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f7f8fc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3 text-lg font-extrabold tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-100">
              T
            </span>
            TaskFlow
          </Link>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 py-12 sm:py-20">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-xl shadow-slate-200/50 sm:px-12 sm:py-12">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
            <ShieldX className="h-10 w-10" aria-hidden="true" />
          </span>
          <p className="mt-7 text-sm font-extrabold uppercase tracking-[0.22em] text-rose-600">403 · Access Denied</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            You don&apos;t have access
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-500 sm:text-base">
            This page is reserved for TaskFlow administrators. Your account does not have permission to view the admin console.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
            <LockKeyhole className="h-4 w-4 shrink-0" aria-hidden="true" />
            Your tasks and personal workspace are still available.
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <House className="h-4 w-4" aria-hidden="true" />
              Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
