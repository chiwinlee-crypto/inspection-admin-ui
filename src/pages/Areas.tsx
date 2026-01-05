import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { getAreaTree } from "../services/area";

function Node({ n, depth = 0 }: any) {
  return (
    <div className="pl-4" style={{ marginLeft: depth * 12 }}>
      <div className="py-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-blue-500/80" />
        <div className="text-sm font-medium">{n.name}</div>
        <div className="text-xs text-slate-400">{n.type}</div>
      </div>
      {n.children?.map((c: any) => <Node key={c.id} n={c} depth={depth + 1} />)}
    </div>
  );
}

export default function Areas() {
  const tree = getAreaTree();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>检查单位（区域树）</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-2xl border border-slate-100 p-4">
            {tree.map((n) => <Node key={n.id} n={n} />)}
          </div>
          <div className="text-xs text-slate-500 mt-3">
            说明：本页为“树形授权”的基础数据展示。管理员会在“账号管理”里给整改员分配负责区域（支持多选、包含下级）。
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
