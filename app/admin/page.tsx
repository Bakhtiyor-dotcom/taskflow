import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FolderKanban,
  LayoutDashboard,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import styles from "./admin.module.css";

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

function dateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function Logo() {
  return (
    <span className={styles.brand}>
      <span className={styles.brandIcon}><FolderKanban size={23} aria-hidden="true" /></span>
      <span className={styles.brandText}>
        <strong>Task<span>Flow</span></strong>
        <small>ADMIN WORKSPACE</small>
      </span>
    </span>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<main className={styles.loading}>Loading admin dashboard...</main>}>
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/auth/login");

  // Keep authorization on the server: never rely on a hidden UI element.
  const { data: adminRole, error: roleError } = await supabase
    .from("app_admins")
    .select("user_id")
    .eq("user_id", authData.user.id)
    .maybeSingle();
  if (roleError || !adminRole) redirect("/access-denied");

  // The Supabase RPC also verifies the admin role server-side.
  const { data, error } = await supabase.rpc("admin_dashboard_data");
  const metrics = !error && data ? (data as AdminData) : null;
  const completionRate = metrics?.total_tasks
    ? Math.round((metrics.completed_tasks / metrics.total_tasks) * 100)
    : 0;

  const cards = [
    { title: "Total users", value: metrics?.total_users ?? 0, detail: "Registered accounts", Icon: Users, tone: styles.violet },
    { title: "Total tasks", value: metrics?.total_tasks ?? 0, detail: "Across all accounts", Icon: ClipboardList, tone: styles.blue },
    { title: "Completed", value: metrics?.completed_tasks ?? 0, detail: `${completionRate}% completion rate`, Icon: CheckCircle2, tone: styles.green },
    { title: "In progress", value: metrics?.in_progress_tasks ?? 0, detail: "Currently underway", Icon: Clock3, tone: styles.purple },
  ];

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logoLink} aria-label="TaskFlow home"><Logo /></Link>
        <nav className={styles.sidebarNav} aria-label="Admin navigation">
          <p className={styles.navCaption}>ADMINISTRATION</p>
          <Link href="/admin" aria-current="page" className={`${styles.navLink} ${styles.navActive}`}><LayoutDashboard size={18} aria-hidden="true" /> Overview</Link>
          <a href="#recent-users" className={styles.navLink}><Users size={18} aria-hidden="true" /> Recent sign-ups</a>
          <a href="#task-metrics" className={styles.navLink}><BarChart3 size={18} aria-hidden="true" /> Task metrics</a>
          <p className={styles.navCaption}>WORKSPACE</p>
          <Link href="/dashboard" className={styles.navLink}><LayoutDashboard size={18} aria-hidden="true" /> My Dashboard</Link>
          <Link href="/board" className={styles.navLink}><FolderKanban size={18} aria-hidden="true" /> Kanban Board</Link>
          <div className={styles.sidebarNote}>
            <ShieldCheck size={23} aria-hidden="true" />
            <strong>Private analytics</strong>
            <p>Statistics are available only to authorized administrators.</p>
          </div>
        </nav>
        <div className={styles.profile}>
          <span className={styles.avatar}>A</span>
          <span className={styles.profileText}><strong>Administrator</strong><small title={authData.user.email || ""}>{authData.user.email || "TaskFlow admin"}</small></span>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarTitle}>
            <div className={styles.mobileLogo}><Logo /></div>
            <span className={styles.breadcrumb}>WORKSPACE / ADMINISTRATION</span>
            <strong>Admin Overview</strong>
          </div>
          <Link className={styles.topbarButton} href="/dashboard"><ArrowLeft size={16} aria-hidden="true" /> My Dashboard</Link>
        </header>

        <div className={styles.content}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <span className={styles.heroEyebrow}><ShieldCheck size={16} aria-hidden="true" /> SECURE ADMIN WORKSPACE</span>
              <h1>Your platform. <span>At a glance.</span></h1>
              <p>Track TaskFlow accounts, task activity, and overall progress in one secure workspace.</p>
              <span className={styles.heroEmail}><LockKeyhole size={14} aria-hidden="true" /> {authData.user.email}</span>
            </div>
            <div className={styles.heroProgress}>
              <div className={styles.ring} style={{ background: `conic-gradient(#a59aff ${completionRate}%, rgba(255,255,255,.15) ${completionRate}% 100%)` }} role="img" aria-label={`${completionRate}% completion rate`}>
                <span>{completionRate}%</span>
              </div>
              <div><strong>Task completion</strong><small>{metrics ? `${metrics.completed_tasks} of ${metrics.total_tasks} tasks done` : "Statistics unavailable"}</small></div>
            </div>
          </section>

          {error && <div role="alert" className={styles.error}>Could not load admin statistics. Check the <code>supabase/admin_dashboard.sql</code> function in Supabase.</div>}

          {metrics && (
            <>
              <section id="task-metrics" className={styles.metrics} aria-label="Platform statistics">
                <div className={styles.sectionHeading}><span><small>LIVE OVERVIEW</small><h2>Platform statistics</h2></span><span className={styles.sectionMeta}><Activity size={16} aria-hidden="true" /> Supabase metrics</span></div>
                <div className={styles.statsGrid}>
                  {cards.map(({ title, value, detail, Icon, tone }) => (
                    <article className={`${styles.statCard} ${tone}`} key={title}>
                      <div className={styles.statTop}><span>{title}</span><span className={styles.statIcon}><Icon size={21} aria-hidden="true" /></span></div>
                      <strong className={styles.statValue}>{value.toLocaleString("en-US")}</strong>
                      <small>{detail}</small>
                    </article>
                  ))}
                </div>
              </section>

              <div className={styles.detailsGrid}>
                <section className={styles.panel} id="recent-users">
                  <div className={styles.panelHeading}>
                    <div className={styles.panelTitle}><span className={styles.panelIcon}><Users size={21} aria-hidden="true" /></span><span><h2>Recent sign-ups</h2><p>The eight most recently registered accounts</p></span></div>
                    <span className={styles.count}>{metrics.recent_users.length} users</span>
                  </div>
                  {metrics.recent_users.length > 0 ? (
                    <ul className={styles.userList}>
                      {metrics.recent_users.map((user, index) => (
                        <li className={styles.userRow} key={`${user.created_at}-${index}`}>
                          <span className={styles.userIcon}><Users size={18} aria-hidden="true" /></span>
                          <div className={styles.userInfo}><strong>{user.email || "No email provided"}</strong><small>Registered account</small></div>
                          <time dateTime={user.created_at}>{dateLabel(user.created_at)}</time>
                        </li>
                      ))}
                    </ul>
                  ) : <p className={styles.empty}>No registered accounts to show.</p>}
                </section>

                <div className={styles.rightColumn}>
                  <section className={styles.panel}>
                    <div className={styles.smallTitle}><span className={`${styles.panelIcon} ${styles.successIcon}`}><BarChart3 size={21} aria-hidden="true" /></span><h2>Task completion</h2></div>
                    <p className={styles.completionNumber}>{completionRate}<span>%</span></p>
                    <div className={styles.progressTrack} role="progressbar" aria-label="Task completion rate" aria-valuenow={completionRate} aria-valuemin={0} aria-valuemax={100}><div style={{ width: `${completionRate}%` }} /></div>
                    <p className={styles.panelDesc}>{metrics.completed_tasks} of {metrics.total_tasks} tasks completed across all accounts.</p>
                  </section>
                  <section className={`${styles.panel} ${styles.overdue}`}>
                    <div className={styles.smallTitle}><span className={`${styles.panelIcon} ${styles.dangerIcon}`}><AlertTriangle size={21} aria-hidden="true" /></span><h2>Overdue tasks</h2></div>
                    <strong className={styles.overdueNumber}>{metrics.overdue_tasks}</strong>
                    <p>Past the due date and not yet completed.</p>
                  </section>
                  <Link className={styles.workspaceLink} href="/dashboard"><span><Sparkles size={18} aria-hidden="true" /> Open your workspace</span><ArrowRight size={19} aria-hidden="true" /></Link>
                </div>
              </div>
            </>
          )}
          <footer className={styles.footer}>TaskFlow Admin · Restricted analytics workspace</footer>
        </div>
      </main>
    </div>
  );
}
