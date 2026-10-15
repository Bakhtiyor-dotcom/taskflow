import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import styles from "./landing.module.css";

const features = [
  {
    icon: ListTodo,
    title: "All your tasks. One clear view.",
    description:
      "Capture to-dos, update their status, and find exactly what needs your attention.",
    gradient: "from-violet-500 to-indigo-600",
    tint: "bg-violet-50",
  },
  {
    icon: FolderKanban,
    title: "Projects without the chaos.",
    description:
      "Keep work organized by project and watch your progress take shape.",
    gradient: "from-sky-500 to-cyan-500",
    tint: "bg-sky-50",
  },
  {
    icon: CalendarDays,
    title: "Deadlines under control.",
    description:
      "Set due dates and priorities so the important things never get lost.",
    gradient: "from-fuchsia-500 to-pink-500",
    tint: "bg-fuchsia-50",
  },
];

const previewTasks = [
  {
    title: "Design new landing page",
    project: "Website Redesign",
    tag: "In Progress",
    tagStyle: "bg-indigo-50 text-indigo-600",
    iconStyle: "bg-indigo-100 text-indigo-600",
    Icon: CircleDot,
  },
  {
    title: "Review project feedback",
    project: "Mobile App",
    tag: "To Do",
    tagStyle: "bg-amber-50 text-amber-700",
    iconStyle: "bg-amber-100 text-amber-700",
    Icon: Clock3,
  },
  {
    title: "Prepare launch checklist",
    project: "Marketing",
    tag: "Completed",
    tagStyle: "bg-emerald-50 text-emerald-700",
    iconStyle: "bg-emerald-100 text-emerald-600",
    Icon: Check,
  },
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="TaskFlow home">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-gradient-to-br from-[#8678ff] via-[#6256f7] to-[#4436ce] text-lg font-extrabold text-white shadow-lg shadow-indigo-500/20 sm:h-11 sm:w-11">
        <span className="absolute -right-2 -top-3 h-8 w-8 rounded-full bg-white/20 blur-md" />
        <span className="relative">T</span>
      </span>
      <span className={`text-xl font-extrabold tracking-[-0.055em] ${light ? "text-white" : "text-[#151b35]"}`}>
        Task<span className={light ? "text-[#a69fff]" : "text-indigo-600"}>Flow</span>
      </span>
    </Link>
  );
}

function DashboardPreview() {
  return (
    <div className={`relative mx-auto w-full max-w-[585px] ${styles.previewEntrance}`}>
      <div className={`pointer-events-none absolute -left-8 top-1/3 h-36 w-36 rounded-full bg-indigo-400/30 blur-[75px] ${styles.floatSlow}`} />
      <div className="pointer-events-none absolute -right-4 -top-4 h-48 w-48 rounded-full bg-sky-400/20 blur-[80px]" />

      {/* Static example UI — not the signed-in user's data. */}
      <div className={`relative overflow-hidden rounded-[22px] border border-white/30 bg-[#f9faff] shadow-[0_35px_90px_rgba(5,8,30,0.45)] ring-1 ring-indigo-200/20 sm:rounded-[26px] ${styles.previewCard}`}>
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-[7px] w-[7px] rounded-full bg-[#ff6b72]" />
            <span className="h-[7px] w-[7px] rounded-full bg-[#ffcb57]" />
            <span className="h-[7px] w-[7px] rounded-full bg-[#46c792]" />
          </div>
          <span className="text-[10px] font-semibold tracking-wide text-slate-400 sm:text-xs">
            TaskFlow / Dashboard preview
          </span>
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50 text-indigo-500">
            <LayoutDashboard className="h-3 w-3" />
          </div>
        </div>

        <div className="flex min-h-[323px] sm:min-h-[385px]">
          <aside className="hidden w-[112px] shrink-0 border-r border-slate-100 bg-white px-3 py-5 sm:block">
            <div className="mb-7 flex items-center gap-2 pl-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">T</span>
              <span className="text-[11px] font-extrabold text-slate-800">TaskFlow</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-2 py-2 text-[10px] font-semibold text-indigo-600">
                <LayoutDashboard className="h-3 w-3" /> Overview
              </div>
              <div className="flex items-center gap-2 px-2 py-2 text-[10px] font-medium text-slate-400">
                <ListTodo className="h-3 w-3" /> My Tasks
              </div>
              <div className="flex items-center gap-2 px-2 py-2 text-[10px] font-medium text-slate-400">
                <FolderKanban className="h-3 w-3" /> Projects
              </div>
            </div>
            <div className="mt-[80px] rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 p-2.5 text-[9px] font-semibold text-white">
              Make today count ✦
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/30"><div className="h-full w-2/3 rounded-full bg-white" /></div>
            </div>
          </aside>

          <div className="min-w-0 flex-1 px-4 pb-4 pt-5 sm:px-5 sm:pt-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-indigo-500 sm:text-[10px]">YOUR WORKSPACE</p>
                <h3 className="text-[20px] font-extrabold tracking-tight text-[#151b35] sm:text-[23px]">Good morning 👋</h3>
                <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">Make progress, one task at a time.</p>
              </div>
              <span className="hidden rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-semibold text-white shadow-md shadow-indigo-200 sm:block">+ New Task</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: "Total Tasks", value: "12", accent: "bg-indigo-50 text-indigo-600" },
                { label: "Completed", value: "08", accent: "bg-emerald-50 text-emerald-600" },
                { label: "In Progress", value: "04", accent: "bg-sky-50 text-sky-600" },
              ].map((item) => (
                <div key={item.label} className="min-w-0 rounded-[13px] border border-[#edf0f8] bg-white px-2.5 py-3 shadow-[0_3px_14px_rgba(35,44,90,0.03)] sm:px-3.5 sm:py-4">
                  <p className="whitespace-nowrap text-[8px] font-semibold text-slate-400 sm:text-[10px]">{item.label}</p>
                  <div className="mt-2 flex items-end justify-between gap-1">
                    <span className="text-xl font-extrabold leading-none text-[#202746] sm:text-2xl">{item.value}</span>
                    <span className={`hidden h-5 w-5 items-center justify-center rounded-md text-xs sm:flex ${item.accent}`}>
                      <Check className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-[13px] border border-[#edf0f8] bg-white p-3 sm:mt-4 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h4 className="text-[11px] font-bold text-[#202746] sm:text-xs">Recent tasks</h4>
                <span className="text-[9px] font-semibold text-indigo-500">View all <span aria-hidden="true">→</span></span>
              </div>
              <div className="space-y-0.5">
                {previewTasks.map((task) => (
                  <div key={task.title} className="flex min-w-0 items-center gap-2 border-t border-slate-50 py-2 sm:gap-3 sm:py-2.5">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${task.iconStyle}`}>
                      <task.Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-semibold text-slate-700 sm:text-[11px]">{task.title}</p>
                      <p className="mt-0.5 truncate text-[9px] text-slate-400">{task.project}</p>
                    </div>
                    <span className={`hidden shrink-0 rounded-md px-2 py-1 text-[9px] font-semibold sm:inline-flex ${task.tagStyle}`}>{task.tag}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/80 px-3 py-2 text-[10px] text-indigo-500 sm:mt-4">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> Your work, neatly organized.
            </div>
          </div>
        </div>
      </div>

      <div className={`absolute -right-2 -top-7 hidden items-center gap-2 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-[0_16px_42px_rgba(9,10,40,0.2)] backdrop-blur-md sm:flex lg:-right-8 ${styles.floatCardOne}`}>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><CheckCircle2 className="h-5 w-5" /></span>
        <span><span className="block text-xs font-bold text-slate-800">Looking good!</span><span className="mt-0.5 block text-[10px] text-slate-500">Your progress is adding up</span></span>
      </div>
      <div className={`absolute -bottom-6 -left-3 hidden items-center gap-2 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-[0_16px_42px_rgba(9,10,40,0.2)] backdrop-blur-md sm:flex lg:-left-9 ${styles.floatCardTwo}`}>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600"><Target className="h-5 w-5" /></span>
        <span><span className="block text-xs font-bold text-slate-800">Stay focused</span><span className="mt-0.5 block text-[10px] text-slate-500">One step at a time</span></span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f9ff] text-[#151b35]">
      <div className="relative isolate overflow-hidden bg-[#090e26] text-white">
        <div className={`pointer-events-none absolute inset-0 ${styles.heroGrid}`} aria-hidden="true" />
        <div className={`pointer-events-none absolute -left-[260px] -top-[360px] h-[700px] w-[700px] rounded-full ${styles.glowPurple}`} aria-hidden="true" />
        <div className={`pointer-events-none absolute -right-[340px] top-[25px] h-[740px] w-[740px] rounded-full ${styles.glowBlue}`} aria-hidden="true" />
        <div className={`pointer-events-none absolute bottom-[-450px] left-[22%] h-[650px] w-[650px] rounded-full ${styles.glowPink}`} aria-hidden="true" />
        <div className={`pointer-events-none absolute left-1/2 top-[165px] h-[520px] w-[760px] -translate-x-1/2 rounded-full border border-white/[0.035] ${styles.orbit}`} aria-hidden="true" />

        <header className="relative z-20 border-b border-white/[0.07]">
          <div className="mx-auto flex max-w-[1220px] items-center justify-between gap-3 px-5 py-5 sm:px-8 lg:px-10">
            <Brand light />
            <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
              <a href="#features" className="text-sm font-medium text-slate-300 transition hover:text-white">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-300 transition hover:text-white">How it works</a>
              <a href="#about" className="text-sm font-medium text-slate-300 transition hover:text-white">About</a>
            </nav>
            <div className="flex items-center gap-1.5 sm:gap-3">
              <Link href="/auth/login" className="rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white sm:px-4 sm:text-sm">Log In</Link>
              <Link href="/auth/sign-up" className="group inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white px-3.5 py-2.5 text-xs font-bold text-[#25234a] shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition hover:-translate-y-0.5 hover:bg-[#f1efff] sm:gap-2 sm:px-5 sm:text-sm">
                Sign Up <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </header>

        <section className="relative z-10 mx-auto grid max-w-[1220px] items-center gap-14 px-5 pb-28 pt-16 sm:px-8 sm:pb-32 sm:pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-10 lg:pb-44 lg:pt-28">
          <div className={styles.revealOne}>
            <div className="mb-7 inline-flex max-w-full items-center gap-2 rounded-full border border-violet-300/25 bg-violet-400/10 px-3.5 py-2 text-[11px] font-semibold tracking-wide text-[#dedbff] backdrop-blur-xl sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#b9adff]" />
              Your calm corner for productive work
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-70" />
            </div>

            <h1 className="max-w-[680px] text-[clamp(2.9rem,7vw,5.1rem)] font-extrabold leading-[1.07] tracking-[-0.067em] text-white">
              Big ideas.<br />
              <span className={styles.gradientText}>Clear priorities.</span><br />
              Real progress.
            </h1>
            <p className="mt-7 max-w-[530px] text-[15px] leading-[1.85] text-[#aab5d0] sm:text-[17px]">
              A beautiful place to plan your day, manage projects, and turn your to-dos into done. Less clutter. More momentum.
            </p>

            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link href="/auth/sign-up" className={`group inline-flex items-center justify-center gap-2.5 rounded-[15px] bg-gradient-to-r from-[#7667ff] via-[#6655f5] to-[#7f5dff] px-7 py-[17px] text-[15px] font-bold text-white transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(105,86,250,0.38)] ${styles.primaryCta}`}>
                Get started free <ArrowRight className="h-[18px] w-[18px] transition group-hover:translate-x-1" />
              </Link>
              <a href="#preview" className="inline-flex items-center justify-center gap-2.5 rounded-[15px] border border-white/20 bg-white/[0.055] px-7 py-[17px] text-[15px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/10">
                Explore TaskFlow <ArrowUpRight className="h-4 w-4 text-slate-300" />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-[#b3bdd4] sm:mt-12">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#72dec9]" /> Organized projects</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#72dec9]" /> Secure sign-in</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#72dec9]" /> Made for any screen</span>
            </div>
          </div>

          <div id="preview" className={`relative min-w-0 scroll-mt-20 py-6 sm:px-4 lg:py-9 ${styles.revealTwo}`}>
            <DashboardPreview />
          </div>
        </section>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f8f9ff] to-transparent" aria-hidden="true" />
      </div>

      <section id="features" className="relative mx-auto max-w-[1220px] scroll-mt-20 px-5 pb-24 pt-12 sm:px-8 sm:pb-32 lg:px-10 lg:pt-16">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-indigo-600">
            <Zap className="h-3.5 w-3.5" /> Everything in sync
          </div>
          <h2 className="text-[clamp(2rem,4.8vw,3.7rem)] font-extrabold leading-[1.12] tracking-[-0.06em] text-[#151b35]">Your workflow, <span className="text-indigo-600">beautifully simple.</span></h2>
          <p className="mx-auto mt-5 max-w-[580px] text-[15px] leading-8 text-slate-500 sm:text-base">The essentials you need to keep moving forward, without the noise that gets in your way.</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3 lg:gap-6">
          {features.map(({ icon: Icon, title, description, gradient, tint }, i) => (
            <div key={title} className={`group relative overflow-hidden rounded-[26px] border border-[#e9ebf7] bg-white p-7 shadow-[0_10px_40px_rgba(31,38,90,0.035)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(54,54,140,0.10)] sm:p-8 `}>
              <div className={`mb-7 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-indigo-500/10`}><Icon className="h-6 w-6" /></div>
              <div className="mb-3 text-[11px] font-bold tracking-[0.17em] text-slate-400">0{i + 1} / FEATURE</div>
              <h3 className="max-w-[250px] text-[22px] font-extrabold leading-snug tracking-[-0.04em] text-[#151b35]">{title}</h3>
              <p className="mt-4 max-w-[320px] text-[14px] leading-[1.85] text-slate-500">{description}</p>
              <div className={`absolute -bottom-16 -right-14 h-44 w-44 rounded-full ${tint} opacity-50 blur-2xl transition duration-300 group-hover:opacity-100`} aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1220px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-violet-600"><Target className="h-3.5 w-3.5" /> Find your flow</div>
            <h2 className="max-w-[530px] text-[clamp(2rem,4.2vw,3.6rem)] font-extrabold leading-[1.13] tracking-[-0.06em] text-[#151b35]">From scattered thoughts to <span className="text-indigo-600">getting things done.</span></h2>
            <p className="mt-6 max-w-[490px] text-[15px] leading-8 text-slate-500">Simple enough for your daily to-dos. Structured enough to keep every project moving in the right direction.</p>
            <Link href="/auth/sign-up" className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 transition hover:gap-3">Start organizing today <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="rounded-[28px] border border-[#eef0f9] bg-[#f8f9ff] p-5 sm:p-8">
            {[
              { number: "01", title: "Capture what's on your mind", text: "Add a task before a great idea slips away.", icon: ListTodo },
              { number: "02", title: "Give it a place and priority", text: "Choose a project, set a deadline, stay clear.", icon: FolderKanban },
              { number: "03", title: "Make progress visible", text: "Move work forward and celebrate what's done.", icon: CheckCircle2 },
            ].map(({ number, title, text, icon: Icon }, index) => (
              <div key={number} className={`flex items-start gap-4 py-5 sm:gap-5 ${index !== 0 ? "border-t border-[#e8eaf5]" : ""}`}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm sm:h-14 sm:w-14"><Icon className="h-5 w-5 sm:h-6 sm:w-6" /></span>
                <div className="min-w-0 flex-1"><div className="mb-1 text-[11px] font-bold tracking-widest text-indigo-500">STEP {number}</div><h3 className="text-[17px] font-bold tracking-tight text-[#202743] sm:text-lg">{title}</h3><p className="mt-1.5 text-sm leading-6 text-slate-500">{text}</p></div>
                <ChevronRight className="mt-3 hidden h-5 w-5 text-slate-300 sm:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className={`relative mx-auto max-w-[1140px] overflow-hidden rounded-[30px] bg-[#141438] px-6 py-16 text-center text-white sm:rounded-[36px] sm:px-12 sm:py-20 ${styles.ctaPanel}`}>
          <div className="pointer-events-none absolute -left-16 -top-40 h-80 w-80 rounded-full bg-indigo-500/30 blur-[85px]" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-48 -right-20 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-[90px]" aria-hidden="true" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-[#dedbff]"><Sparkles className="h-3.5 w-3.5" /> Your next chapter starts here</span>
            <h2 className="mx-auto mt-6 max-w-[730px] text-[clamp(2.15rem,5vw,4rem)] font-extrabold leading-[1.12] tracking-[-0.06em]">More focus. Less busywork.<br /><span className={styles.gradientText}>Better days ahead.</span></h2>
            <p className="mx-auto mt-5 max-w-[530px] text-[15px] leading-8 text-slate-300">Your next big project starts with one small step. Give it the space it deserves.</p>
            <Link href="/auth/sign-up" className="group mt-9 inline-flex items-center gap-2.5 rounded-[15px] bg-white px-7 py-4 text-sm font-bold text-[#26234c] shadow-xl transition hover:-translate-y-1 hover:bg-[#f1efff]">Create your workspace <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e9ebf6] bg-white">
        <div className="mx-auto flex max-w-[1220px] flex-col items-center justify-between gap-5 px-5 py-8 sm:flex-row sm:px-8 lg:px-10">
          <Brand />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
            <a href="#features" className="transition hover:text-indigo-600">Features</a>
            <a href="#how-it-works" className="transition hover:text-indigo-600">How it works</a>
            <Link href="/auth/login" className="transition hover:text-indigo-600">Log In</Link>
            <Link href="/auth/sign-up" className="transition hover:text-indigo-600">Sign Up</Link>
          </div>
          <span className="text-xs text-slate-400">© TaskFlow</span>
        </div>
      </footer>
    </main>
  );
}
