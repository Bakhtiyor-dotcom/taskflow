import Link from "next/link";
import { Layers3 } from "lucide-react";

type BrandProps = {
  light?: boolean;
  compact?: boolean;
  className?: string;
};

export function TaskFlowBrand({ light = false, compact = false, className = "" }: BrandProps) {
  return (
    <Link href="/" aria-label="TaskFlow home" className={`inline-flex min-w-0 items-center gap-3 ${className}`}>
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[15px] bg-gradient-to-br from-[#4b83ff] via-[#6456f7] to-[#a354fd] text-white shadow-lg shadow-indigo-500/20">
        <Layers3 size={23} strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className={`block text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>Task<span className={light ? "text-[#ada2ff]" : "text-violet-600"}>Flow</span></span>
          <span className={`block text-[10px] font-semibold uppercase tracking-[0.22em] ${light ? "text-indigo-200/60" : "text-slate-400"}`}>Your workspace</span>
        </span>
      )}
    </Link>
  );
}
