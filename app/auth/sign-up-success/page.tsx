
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-5 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60 sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-3xl text-indigo-600">
          ✉
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          Check your email
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-500">
          If this email is eligible for registration, you will
          receive a confirmation link.
        </p>

        <p className="mt-3 text-sm text-slate-500">
          Already have an account? You can sign in below.
        </p>

        <Link
          href="/auth/login"
          className="mt-8 flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Log In
        </Link>

        <Link
          href="/"
          className="mt-5 inline-block text-sm font-medium text-slate-500 hover:text-indigo-600"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
