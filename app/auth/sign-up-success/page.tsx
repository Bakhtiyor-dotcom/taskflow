import Link from "next/link";
import { ArrowRight, MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";

export default function Page() {
  return (
    <AuthShell mode="notice">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <MailCheck size={30} aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">Check your email</h1>
        <p className="mt-4 text-sm leading-7 text-slate-500">
          If this email is eligible for registration, you will receive a confirmation link.
        </p>
        <p className="mt-3 text-sm text-slate-500">Already registered? Sign in below.</p>
        <Link href="/auth/login" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#526bff] to-[#8251f6] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/15 transition hover:brightness-110">
          Log in <ArrowRight size={16} />
        </Link>
        <Link href="/" className="mt-5 inline-block text-sm font-medium text-slate-500 hover:text-indigo-600">Back to home</Link>
      </div>
    </AuthShell>
  );
}
