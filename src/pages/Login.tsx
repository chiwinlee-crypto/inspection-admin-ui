import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Input } from "../components/Input";
import { useAuth } from "../state/auth";
import { loadDB, resetDB } from "../state/store";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const users = useMemo(() => loadDB().users, []);
  const [username, setUsername] = useState(users[0]?.username || "");

  return (
    <div className="min-h-screen bg-slate-950 grid place-items-center p-6">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        <div className="text-slate-100">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-600/20 border border-blue-500/30 px-4 py-2 text-xs text-blue-200">
            UI Pack · Blue Theme
          </div>
          <h1 className="mt-4 text-2xl font-semibold">巡查核审系统（演示包）</h1>
          <p className="mt-3 text-slate-300 text-sm leading-6">
            该包用于在 meku.dev 快速呈现：<br/>
            ① 核审员（问题查询/交办/复检/导出）<br/>
            ② 整改员（仅整改/申诉，且仅自己负责区域）<br/>
            ③ 管理员（最高权限，账号/角色/区域/组织/项目管理）
          </p>
          <div className="mt-6 flex gap-2">
            <Button variant="secondary" onClick={() => { resetDB(); location.reload(); }}>
              重置演示数据
            </Button>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900 text-slate-100">
          <CardHeader>
            <CardTitle>登录（选择演示账号）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs text-slate-300">账号（username）</div>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-slate-950 border-slate-800 text-slate-100" />
            <div className="grid grid-cols-3 gap-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setUsername(u.username)}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-left hover:bg-slate-950"
                >
                  <div className="text-xs text-slate-400">{u.role}</div>
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-xs text-slate-500">{u.username}</div>
                </button>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => {
                login(username.trim());
                nav("/");
              }}
            >
              进入系统
            </Button>
            <div className="text-xs text-slate-500">
              提示：本演示包使用本地 localStorage 模拟“后端控制权限与数据域过滤”。
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
