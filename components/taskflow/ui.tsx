import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type SurfaceProps = { children: ReactNode; className?: string };
export function Surface({ children, className = "" }: SurfaceProps) {
  return <section className={`tf-surface min-w-0 ${className}`}>{children}</section>;
}

type StatCardProps = {
  label: string;
  value: string | number;
  note: string;
  icon: LucideIcon;
  color: string;
  accent: string;
};
export function StatCard({ label, value, note, icon: Icon, color, accent }: StatCardProps) {
  return (
    <div className="tf-surface group relative min-w-0 overflow-hidden p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-5">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-xs font-semibold text-slate-500 sm:text-sm">{label}</p>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] ${color}`}><Icon size={20} strokeWidth={2} /></span>
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-tight text-[#20233e] sm:text-[36px]">{value}</p>
      <p className="mt-1 hidden text-xs text-slate-400 sm:block">{note}</p>
    </div>
  );
}

export function SectionTitle({ title, description, icon: Icon, action }: {
  title: string; description?: string; icon?: LucideIcon; action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          {Icon && <Icon size={20} className="text-violet-600" />}{title}
        </h2>
        {description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
