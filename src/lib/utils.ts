import clsx from "clsx";

export function cn(...args: any[]) {
  return clsx(args);
}

export function fmtDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function uuid(prefix = "") {
  return prefix + Math.random().toString(16).slice(2) + Date.now().toString(16);
}
