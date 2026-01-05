import { cn } from "../lib/utils";

export function Badge({ tone = "blue", children }: { tone?: "blue" | "amber" | "rose" | "slate" | "green"; children: any }) {
  const cls =
    tone === "blue"
      ? "bg-blue-50 text-blue-700 border-blue-100"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : tone === "rose"
      ? "bg-rose-50 text-rose-700 border-rose-100"
      : tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-slate-50 text-slate-700 border-slate-100";
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", cls)}>{children}</span>;
}
