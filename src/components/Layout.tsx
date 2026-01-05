import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ROLE_MENUS } from "../state/rbac";
import { useAuth } from "../state/auth";
import { cn } from "../lib/utils";
import { Button } from "./Button";

function groupMenus(items: any[]) {
  const groups: Record<string, any[]> = {};
  for (const it of items) {
    const g = it.group || "_";
    groups[g] = groups[g] || [];
    groups[g].push(it);
  }
  return groups;
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const menus = user ? ROLE_MENUS[user.role] : [];
  const grouped = groupMenus(menus);

  return (
    <div className="min-h-screen">
      <div className="flex">
        <aside className="w-64 shrink-0 bg-slate-900 text-slate-100 min-h-screen">
          <div className="px-5 py-5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-blue-600 grid place-items-center font-bold">🦆>ydiv>
              <div>
                <div className="text-sm font-semibold leading-5">bad鸭>/div>
                <div className="text-xs text-slate-400">{user?.role === "ADMIN" ? "管理员" : user?.role === "AUDITOR" ? "核审员" : "整改员"}</div>
              </div>
            </div>
          </div>

          <nav className="px-3 py-4 space-y-4">
            {Object.entries(grouped).map(([g, items]) => (
              <div key={g}>
                {g !== "_" && <div className="px-3 mb-2 text-xs text-slate-400">{g}</div>}
                <div className="space-y-1">
                  {(items as any[]).map((m) => (
                    <NavLink
                      key={m.key}
                      to={m.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/80",
                          isActive && "bg-slate-800 text-white"
                        )
                      }
                    >
                      <span className="h-2 w-2 rounded-full bg-blue-500/80" />
                      {m.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="px-4 pb-6 mt-auto">
            <div className="rounded-2xl bg-slate-800/60 p-3 border border-slate-800">
              <div className="text-xs text-slate-300">当前账号</div>
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => { logout(); nav("/login"); }}>退出</Button>
                <Button size="sm" variant="ghost" onClick={() => nav("/login")}>切换</Button>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-slate-50 min-h-screen">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">Inspection / 巡查核审后台</div>
                <div className="text-xs text-slate-500">{loc.pathname}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">主题</span>
                <div className="h-9 rounded-xl bg-blue-50 border border-blue-100 px-3 grid place-items-center text-xs text-blue-700">Blue</div>
              </div>
            </div>
          </header>

          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
