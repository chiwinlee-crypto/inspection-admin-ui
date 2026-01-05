import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { listIssues, listExports } from "../services/data";
import { useAuth } from "../state/auth";
import { Badge } from "../components/Badge";
import { fmtDateTime } from "../lib/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const issues = user ? listIssues(user.role, user.id, {}) : [];
  const exports = listExports();

  const stats = {
    total: issues.length,
    pendingAssign: issues.filter((i) => i.status === "PENDING_ASSIGN").length,
    rectify: issues.filter((i) => i.status === "RECTIFYING").length,
    recheck: issues.filter((i) => i.status === "PENDING_RECHECK").length,
    overdue: issues.filter((i) => i.overdue).length,
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-slate-100 shadow-soft p-6 bg-grid">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">欢迎回来</div>
            <div className="text-xl font-semibold text-slate-900 mt-1">{user?.name}</div>
            <div className="text-xs text-slate-500 mt-1">当前角色：{user?.role}</div>
          </div>
          <div className="rounded-2xl bg-blue-600 text-white px-4 py-3 shadow-soft">
            <div className="text-xs opacity-90">今日概览</div>
            <div className="text-lg font-semibold">{stats.total} 条问题</div>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-3 mt-6">
          <Card><CardContent className="pt-5">
            <div className="text-xs text-slate-500">待交办</div>
            <div className="text-2xl font-semibold mt-1">{stats.pendingAssign}</div>
          </CardContent></Card>
          <Card><CardContent className="pt-5">
            <div className="text-xs text-slate-500">整改中</div>
            <div className="text-2xl font-semibold mt-1">{stats.rectify}</div>
          </CardContent></Card>
          <Card><CardContent className="pt-5">
            <div className="text-xs text-slate-500">待复检</div>
            <div className="text-2xl font-semibold mt-1">{stats.recheck}</div>
          </CardContent></Card>
          <Card><CardContent className="pt-5">
            <div className="text-xs text-slate-500">超期</div>
            <div className="text-2xl font-semibold mt-1">{stats.overdue}</div>
          </CardContent></Card>
          <Card><CardContent className="pt-5">
            <div className="text-xs text-slate-500">导出文件</div>
            <div className="text-2xl font-semibold mt-1">{exports.length}</div>
          </CardContent></Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>最近问题（示例）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {issues.slice(0, 5).map((i) => (
                <div key={i.id} className="flex items-start justify-between rounded-2xl border border-slate-100 p-4">
                  <div>
                    <div className="text-sm font-semibold">{i.id} · {i.unitName}</div>
                    <div className="text-xs text-slate-500 mt-1">{i.description}</div>
                    <div className="text-xs text-slate-400 mt-2">{fmtDateTime(i.reportAt)}</div>
                  </div>
                  <Badge tone={i.status === "RECTIFYING" ? "amber" : i.status === "PENDING_ASSIGN" ? "blue" : "slate"}>
                    {i.status}
                  </Badge>
                </div>
              ))}
              {issues.length === 0 && <div className="text-sm text-slate-500">暂无数据（可能尚未分配负责区域）。</div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近导出</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exports.slice(0, 6).map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                  <div>
                    <div className="text-sm font-semibold">{e.filename}</div>
                    <div className="text-xs text-slate-500 mt-1">{e.name} · {fmtDateTime(e.createdAt)}</div>
                  </div>
                  <Badge tone="green">{e.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
