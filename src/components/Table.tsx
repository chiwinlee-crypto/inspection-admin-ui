import React from "react";
import { cn } from "../lib/utils";

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("w-full text-sm", className)} {...props} />;
}
export function Th({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("text-left font-semibold text-slate-700 px-4 py-3 bg-slate-50 border-b border-slate-100", className)} {...props} />;
}
export function Td({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 border-b border-slate-100 text-slate-700", className)} {...props} />;
}
