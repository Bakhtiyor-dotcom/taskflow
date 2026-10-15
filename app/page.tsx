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
  Layers3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
  ListTodo,
} from "lucide-react";
import { TaskFlowBrand } from "@/components/taskflow/brand";
import styles from "./landing.module.css";

// These are illustrative tasks for the public landing page, not user data.
const previewColumns = [
  {
    label: "To do",
    count: 2,
    dot: "bg-[#fbbf70]",
    badge: "text-amber-200 bg-amber-300/10",
    tasks: [
      {
        title: "Plan launch checklist",
        project: "Marketing",
        priority: "High",
        badge: "bg-rose-400/15 text-rose-200",
        progress: 25,
        bar: "bg-[#fb6b87]",
      },
      {
        title: "Prepare design assets",
        project: "Website Redesign",
        priority: "Medium",
        badge: "bg-amber-400/15 text-amber-200",
        progress: 15,
        bar: "bg-[#f6ba66]",
      },
    ],
  },
  {
    label: "In progress",
    count: 2,
    dot: "bg-[#7c91ff]",
    badge: "text-indigo-200 bg-indigo-300/10",
    tasks: [
      {
        title: "Build new landing page",
        project: "Website Redesign",
        priority: "High",
        badge: "bg-rose-400/15 text-rose-200",
        progress: 68,
        bar: "bg-[#7e8eff]",
      },
      {
        title: "Review app layout",
        project: "Mobile App",
        priority: "Medium",
        badge: "bg-amber-400/15 text-amber-200",
        progress: 45,
        bar: "bg-[#a987fc]",
      },
    ],
  },
  {
    label: "Completed",
    count: 2,
    dot: "bg-[#50d5aa]",
    badge: "text-emerald-200 bg-emerald-300/10",
    tasks: [
      {
        title: "Set up workspace",
        project: "Personal",
        priority: "Low",
        badge: "bg-emerald-400/15 text-emerald-200",
        progress: 100,
        bar: "bg-[#42cca4]",
      },
      {
        title: "Define project goals",
        project: "Marketing",
        priority: "Low",
        badge: "bg-emerald-400/15 text-emerald-200",
        progress: 100,
        bar: "bg-[#42cca4]",
      },
    ],
  },
];

const features = [
  {
    Icon: ListTodo,
    title: "Everything in its place",
    description: "Keep all your tasks together and move work forward with clear status updates.",
    number: "01",
    tone: "from-indigo-500/20 to-blue-500/10",
    icon: "text-indigo-200",
  },
  {
    Icon: FolderKanban,
    title: "Projects, simplified",
    description: "Organize tasks by project and see the progress you are making at a glance.",
    number: "02",
    tone: "from-violet-500/20 to-fuchsia-500/10",
    icon: "text-violet-200",
  },
  {
    Icon: CalendarDays,
    title: "Stay ahead of deadlines",
    description: "Set due dates and priorities to focus on the work that matters most.",
    number: "03",
    tone: "from-cyan-500/20 to-sky-500/10",
    icon: "text-cyan-200",
  },
];

function TaskPreviewCard({
  title,
  project,
  priority,
  badge,
  progress,
  bar,
}: {
  title: string;
  project: string;
  priority: string;
  badge: string;
  progress: number;
  bar: string;
}) {
  return (
    <div className="rounded-[15px] border border-white/[0.08] bg-[#181f3b] px-3.5 py-3.5 shadow-[0_10px_26px_rgba(0,0,0,.15)]">
      <div className="flex items-center justify-between gap-2">
        <span className={`rounded-md px-2 py-1 text-[9px] font-bold ${badge}`}>{priority}</span>
        <span className="truncate text-[9px] text-[#8792b2]">{project}</span>
      </div>
      <p className="mt-3 min-h-[34px] text-[11px] font-bold leading-[17px] tracking-[-.01em] text-[#f5f6ff]">
        {title}
      </p>
      <div className="mt-3 flex items-center justify-between text-[9px] text-[#909bbc]">
        <span>Progress</span>
        <span className="font-semibold text-white/80">{progress}%</span>
      </div>
      <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-white/[0.07]">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-3.5 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
        <span className="flex -space-x-1.5" aria-hidden="true">
          <span className="h-5 w-5 rounded-full border-2 border-[#181f3b] bg-[#7286ee]" />
          <span className="h-5 w-5 rounded-full border-2 border-[#181f3b] bg-[#bb74dc]" />
        </span>
        <span className="flex items-center gap-1 text-[9px] text-[#9aa5c5]">
          {progress === 100 ? <Check size={12} /> : <Clock3 size={12} />}
          {progress === 100 ? "Done" : "Active"}
        </span>
      </div>
    </div>
  );
}

function BoardPreview() {
  return (
    <div className={`relative w-full ${styles.boardEntrance}`}>
      <div className={`pointer-events-none absolute -inset-7 rounded-[35px] ${styles.boardHalo}`} aria-hidden="true" />
      <div className={`relative overflow-hidden rounded-[21px] border border-[#535f9c]/40 bg-[#0d142b] shadow-[0_32px_100px_rgba(0,0,0,.52)] ${styles.boardFrame}`}>
        <div className="flex h-12 items-center gap-3 border-b border-white/[0.075] bg-[#141b34] px-4">
          <div className="flex shrink-0 gap-[5px]" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#fa6680]" />
            <span className="h-2 w-2 rounded-full bg-[#ffc56c]" />
            <span className="h-2 w-2 rounded-full bg-[#46caa2]" />
          </div>
          <div className="mx-auto h-[21px] w-[50%] rounded-md border border-white/[0.045] bg-[#202946]" />
          <span className="rounded-md bg-indigo-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-200">Preview</span>
        </div>
        <div className="border-b border-white/[0.055] px-4 py-3.5 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#9b9ff0]">YOUR WORKSPACE</p>
              <h3 className="mt-1 text-[18px] font-extrabold leading-6 text-white">Project board</h3>
            </div>
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#5e65ef] px-2.5 py-2 text-[10px] font-semibold text-white">
              <Zap size={11} /> Tasks
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4 border-b border-white/[0.07] pb-2 text-[10px]">
            <span className="border-b-2 border-[#9995ff] pb-2 font-bold text-[#c4c3ff]">Board</span>
            <span className="pb-2 text-[#818dab]">Projects</span>
            <span className="pb-2 text-[#818dab]">Overview</span>
          </div>
        </div>
        <div className={`${styles.boardScroll} overflow-x-auto px-3 pb-4 pt-4 sm:px-4`}>
          <div className="grid min-w-[495px] grid-cols-3 gap-2.5">
            {previewColumns.map((column) => (
              <div key={column.label} className="min-w-0 rounded-xl border border-white/[0.05] bg-[#111831] p-2.5">
                <div className="mb-3 flex items-center justify-between gap-1.5">
                  <span className="flex items-center gap-1.5 truncate text-[10px] font-bold text-[#dbe0f3]">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${column.dot}`} />
                    {column.label}
                  </span>
                  <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${column.badge}`}>{column.count}</span>
                </div>
                <div className="space-y-2.5">
                  {column.tasks.map((task) => <TaskPreviewCard key={task.title} {...task} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`pointer-events-none absolute -bottom-5 -left-3 hidden items-center gap-2.5 rounded-xl border border-white/15 bg-[#1e2850]/95 p-3 shadow-2xl backdrop-blur sm:flex ${styles.floatingBadge}`}>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300"><CheckCircle2 size={19} /></span>
        <div><p className="text-xs font-bold text-white">Keep work moving</p><p className="text-[10px] text-[#adb6d4]">From to-do to done</p></div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090e22] text-white">
      <div className="relative isolate overflow-hidden">
        <div className={`pointer-events-none absolute inset-0 ${styles.dotGrid}`} aria-hidden="true" />
        <div className={`pointer-events-none absolute -left-[380px] -top-[430px] h-[850px] w-[900px] rounded-full ${styles.blueGlow}`} aria-hidden="true" />
        <div className={`pointer-events-none absolute -right-[450px] top-[35px] h-[850px] w-[900px] rounded-full ${styles.purpleGlow}`} aria-hidden="true" />

        <header className="relative z-20 border-b border-white/[0.075] bg-[#090e22]/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1340px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
            <TaskFlowBrand light compact className="sm:hidden" />
            <TaskFlowBrand light className="hidden sm:inline-flex" />
            <nav className="hidden items-center gap-8 text-[13px] font-semibold text-[#a4aecb] md:flex" aria-label="Main navigation">
              <a href="#features" className="transition hover:text-white">Features</a>
              <a href="#how-it-works" className="transition hover:text-white">How it works</a>
              <a href="#about" className="transition hover:text-white">About</a>
            </nav>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/auth/login" className="rounded-xl px-2 py-2.5 text-xs font-semibold text-[#d9def2] transition hover:text-white sm:px-3 sm:text-sm">Log in</Link>
              <Link href="/auth/sign-up" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#526fff] to-[#7f56fc] px-3.5 py-2.5 text-xs font-bold text-white shadow-[0_10px_25px_rgba(94,90,255,.22)] transition hover:brightness-110 sm:px-5 sm:text-sm">Sign up free <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </div>
          </div>
        </header>

        <section className="relative mx-auto grid max-w-[1340px] items-center gap-14 px-5 pb-28 pt-16 sm:px-8 lg:grid-cols-[.84fr_1.16fr] lg:gap-10 lg:px-10 lg:pb-40 lg:pt-28">
          <div className={styles.revealOne}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#9c9bfd]/25 bg-[#7773ec]/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[.13em] text-[#b5b6ff]">
              <Sparkles size={14} /> Clear space for better work
            </span>
            <h1 className="mt-7 max-w-[630px] text-[clamp(3rem,5.3vw,5.8rem)] font-black leading-[1.06] tracking-[-.065em] text-white">
              Organize work.<br />
              <span className={styles.gradientText}>Make it happen.</span>
            </h1>
            <p className="mt-7 max-w-[490px] text-[16px] leading-[1.85] text-[#a8b2cf] sm:text-lg">
              One beautiful space to manage tasks, organize projects, set priorities, and make progress every day.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/auth/sign-up" className={`inline-flex min-h-[52px] items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#4d7aff] via-[#6264fb] to-[#8152f8] px-6 py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:brightness-110 ${styles.primaryButton}`}>
                Get started — it&apos;s free <ArrowRight size={17} />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.055] px-6 py-3.5 text-sm font-bold text-[#e8ebff] transition hover:bg-white/10">
                Open dashboard <ChevronRight size={17} />
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#9ba9ca]">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-[#6ee5bd]" /> Secure account</span>
              <span className="inline-flex items-center gap-2"><Layers3 size={16} className="text-[#a99cff]" /> Organized projects</span>
              <span className="inline-flex items-center gap-2"><Target size={16} className="text-[#80bbff]" /> Clear priorities</span>
            </div>
          </div>
          <div className="min-w-0 lg:pl-3">
            <BoardPreview />
            <p className="mt-8 text-center text-[11px] text-[#7885a5]">Illustrative interface preview · Your own tasks appear after signing in</p>
          </div>
        </section>
      </div>

      <section id="features" className="relative border-t border-white/[0.055] bg-[#0b1128] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1260px]">
          <div className="mx-auto max-w-[710px] text-center">
            <span className="text-[12px] font-bold uppercase tracking-[.25em] text-[#999dff]">WHY TASKFLOW</span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-[-.045em] sm:text-5xl">Less chaos. <span className={styles.gradientText}>More progress.</span></h2>
            <p className="mt-5 text-base leading-8 text-[#9da9c7]">Thoughtful tools that help you plan your work, see what matters, and finish with confidence.</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map(({ Icon, title, description, number, tone, icon }) => (
              <article key={title} className="group relative overflow-hidden rounded-[25px] border border-white/[0.08] bg-[#131a36] p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/35 hover:bg-[#172042] sm:p-8">
                <div className={`absolute -right-10 -top-12 h-44 w-44 rounded-full bg-gradient-to-br blur-2xl ${tone}`} aria-hidden="true" />
                <div className="relative flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]"><Icon size={27} className={icon} strokeWidth={1.7} /></span>
                  <span className="text-sm font-extrabold text-white/20">{number}</span>
                </div>
                <h3 className="relative mt-8 text-xl font-extrabold tracking-tight text-white">{title}</h3>
                <p className="relative mt-3 text-sm leading-7 text-[#9faac8]">{description}</p>
                <div className="relative mt-7 inline-flex items-center gap-1 text-xs font-bold text-[#9e9eff]">Built for focus <ArrowUpRight size={14} /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1260px] items-center gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
          <div>
            <span className="text-[12px] font-bold uppercase tracking-[.25em] text-[#999dff]">YOUR WORKFLOW, SIMPLIFIED</span>
            <h2 className="mt-4 text-4xl font-extrabold leading-[1.12] tracking-[-.045em] sm:text-5xl">From ideas to <span className={styles.gradientText}>done.</span></h2>
            <p className="mt-5 max-w-[480px] text-base leading-8 text-[#9da9c7]">Get started with a personal workspace and turn bigger projects into manageable tasks.</p>
            <Link href="/auth/sign-up" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#b3afff] transition hover:text-white">Create your workspace <ArrowRight size={17} /></Link>
          </div>
          <div className="grid gap-4">
            {[
              { Icon: FolderKanban, n: "01", title: "Choose a project", desc: "Keep different parts of your work organized." },
              { Icon: CircleDot, n: "02", title: "Set priorities and dates", desc: "Give each task a clear next step and deadline." },
              { Icon: CheckCircle2, n: "03", title: "Track your progress", desc: "Update task status and watch your completion rate grow." },
            ].map(({ Icon, n, title, desc }) => (
              <div key={n} className="flex items-center gap-4 rounded-[20px] border border-white/[0.08] bg-white/[0.035] p-5 transition hover:bg-white/[0.06] sm:gap-6 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-400/10 text-[#aaa6ff]"><Icon size={22} /></div>
                <div className="min-w-0 flex-1"><h3 className="font-bold text-white">{title}</h3><p className="mt-1 text-sm leading-6 text-[#9da9c7]">{desc}</p></div>
                <span className="hidden text-sm font-extrabold text-white/25 sm:block">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-5 pb-24 pt-2 sm:px-8 lg:px-10 lg:pb-32">
        <div className={`relative mx-auto max-w-[1260px] overflow-hidden rounded-[32px] border border-indigo-300/20 bg-gradient-to-br from-[#353d8b] via-[#272665] to-[#191947] px-6 py-14 text-center sm:px-12 sm:py-20 ${styles.ctaPanel}`}>
          <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-[#7169ff]/25 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-[#36a9ff]/15 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#d8d8ff]"><LockKeyhole size={13} /> Your workspace awaits</span>
            <h2 className="mx-auto mt-5 max-w-[750px] text-4xl font-extrabold leading-[1.14] tracking-[-.045em] sm:text-5xl">Your next great project starts with a single task.</h2>
            <p className="mx-auto mt-5 max-w-[560px] text-sm leading-7 text-[#c4cafa] sm:text-base">Plan clearly, stay focused, and make steady progress with TaskFlow.</p>
            <Link href="/auth/sign-up" className="mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-white px-7 py-3.5 text-sm font-extrabold text-[#403ac8] shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#f3f2ff]">Get started free <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1260px] flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <TaskFlowBrand light />
          <p className="text-xs text-[#8290b3]">TaskFlow · Built for a clearer workday.</p>
          <div className="flex gap-5 text-xs font-semibold text-[#a3aec9]"><Link href="/auth/login" className="hover:text-white">Log in</Link><Link href="/auth/sign-up" className="hover:text-white">Sign up</Link><Link href="/dashboard" className="hover:text-white">Dashboard</Link></div>
        </div>
      </footer>
    </main>
  );
}
