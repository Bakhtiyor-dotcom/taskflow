import Link from "next/link";
import { ArrowLeft, House, LockKeyhole, ShieldX } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";

export const metadata = {
  title: "Access Denied | TaskFlow",
  description: "You do not have permission to view this page.",
};

export default function AccessDeniedPage() {
  return (
    <AuthShell mode="notice">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <ShieldX size={30} aria-hidden="true" />
        </span>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-rose-500">Access denied</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">This area is restricted</h1>
        <p className="mt-4 text-sm leading-7 text-slate-500">
          Only TaskFlow administrators can access the admin console. Your personal workspace remains available.
        </p>
        <p className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
          <LockKeyhole size={15} /> Your tasks are still available.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#526bff] to-[#8251f6] px-4 py-3 text-sm font-bold text-white transition hover:brightness-110">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <Link href="/" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
            <House size={16} /> Home
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
