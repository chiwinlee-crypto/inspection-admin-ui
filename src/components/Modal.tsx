import React from "react";
import { cn } from "../lib/utils";
import { Button } from "./Button";

export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  className,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-soft border border-slate-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="text-sm font-semibold">{title}</div>
          <Button variant="ghost" size="sm" onClick={onClose}>关闭</Button>
        </div>
        <div className={cn("p-5", className)}>{children}</div>
        <div className="px-5 pb-5">{footer}</div>
      </div>
    </div>
  );
}
