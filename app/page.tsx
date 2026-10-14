import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-6">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">T</span>
          TaskFlow
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/auth/login" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Log In</Link>
          <Link href="/auth/sign-up" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Sign Up</Link>
        </nav>
      </header>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-600">Your workspace, organized</p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Work smarter with TaskFlow.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Manage your tasks, set priorities, track deadlines, and keep every project moving in one clean workspace.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/auth/sign-up" className="rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700">Get started free →</Link>
            <Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 hover:bg-slate-50">Open Dashboard</Link>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <div className="mb-6 flex items-center justify-between"><h2 className="font-bold">Task overview</h2><span className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Stay on track</span></div>
          <div className="grid grid-cols-3 gap-3">
            {[{ name: "Plan", number: "01" }, { name: "Prioritize", number: "02" }, { name: "Complete", number: "03" }].map((item) => (
              <div key={item.name} className="rounded-xl bg-slate-50 p-4"><p className="text-2xl font-bold text-indigo-600">{item.number}</p><p className="mt-2 text-xs text-slate-500">{item.name}</p></div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {[{ title: "Organize your projects", done: true }, { title: "Focus on important tasks", done: true }, { title: "Finish work on time", done: false }].map((item) => (
              <div key={item.title} className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-4"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>{item.done ? "✓" : "○"}</span><span className="text-sm font-semibold text-slate-700">{item.title}</span></div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
