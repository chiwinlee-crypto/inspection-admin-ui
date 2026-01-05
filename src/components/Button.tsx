import React from "react";
import { cn } from "../lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};
export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 font-medium transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "h-9 text-sm px-3",
    md: "h-10 text-sm",
  }[size];
  const v = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-soft",
    secondary: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-soft",
  }[variant];
  return <button className={cn(base, sizes, v, className)} {...props} />;
}
