import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Input, Select } from "../components/Input";
import { Table, Td, Th } from "../components/Table";
import { Badge } from "../components/Badge";
import { useAuth } from "../state/auth";
import { can } from "../state/rbac";
import { createExportTask, listIssues, listOrgs, listProjects, updateIssue } from "../services/data";
import { Modal } from "../components/Modal";
import { Issue } from "../types";

export default function Issues() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const defaultTab = params.get("tab") || "all";

  const orgs = listOrgs();
  const projects = listProjects();

  const [q, setQ] = useState({ keyword: "", orgId: "", projectId: "", status: "", overdue: "" as any });
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [assignOpen, setAssignOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);

  const issues = useMemo(() => {
    if (!user) return [];
    // tab shortcuts for auditor/admin
    const extra: any = {};
    if (defaultTab === "assign") extra.status = "PENDING_ASSIGN";
    if (defaultTab === "recheck") extra.status = "PENDING_RECHECK";
    return listIssues(user.role, user.id, { ...q, ...extra });
  }, [user, q, defaultTab]);

  const selectedIds = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
  const bulkEnabled = selectedIds.length > 0;

  const bulkPatch = (patch: Partial<Issue>) => {
    for (const id of selectedIds) updateIssue(id, patch as any);
    setSelected({});
    // simple rerender by updating state
    setQ((x) => ({ ...x }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>问题查询</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">单位名称 / 编号 / 对象</div>
              <Input value={q.keyword} onChange={(e) => setQ((x) => ({ ...x, keyword: e.target.value }))} placeholder="请输入编号、单位、对象" />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">城市组织</div>
              <Select value={q.orgId} onChange={(e) => setQ((x) => ({ ...x, orgId: e.target.value }))}>
                <option value="">请选择</option>
                {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </Select>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">项目名称</div>
              <Select value={q.projectId} onChange={(e) => setQ((x) => ({ ...x, projectId: e.target.value }))}>
                <option value="">请选择</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">问题状态</div>
              <Select value={q.status} onChange={(e) => setQ((x) => ({ ...x, status: e.target.value }))}>
                <option value="">请选择</option>
                <option value="PENDING_ASSIGN">待交办</option>
                <option value="RECTIFYING">待整改</option>
                <option value="PENDING_RECHECK">待复检</option>
                <option value="DONE">已完成</option>
                <option value="ARCHIVED">已归档</option>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Button variant="primary" onClick={() => setQ((x) => ({ ...x }))}>搜索</Button>
            <Button variant="secondary" onClick={() => setQ({ keyword: "", orgId: "", projectId: "", status: "", overdue: "" as any })}>重置</Button>

            <div className="ml-auto flex gap-2">
              {user && can(user.role, "ISSUE_EXPORT") && (
                <>
                  <Button
                    variant="secondary"
                    disabled={!bulkEnabled}
                    onClick={() => {
                      createExportTask(user.name);
                      alert("已生成导出任务（示例）");
                    }}
                  >
                    导出
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={!bulkEnabled}
                    onClick={() => {
                      createExportTask(user.name);
                      alert("已生成无图片导出任务（示例）");
                    }}
                  >
                    无图片导出
                  </Button>
                </>
              )}
              {user && can(user.role, "ISSUE_ASSIGN") && (
                <>
                  <Button variant="primary" disabled={!bulkEnabled} onClick={() => setAssignOpen(true)}>交办</Button>
                  <Button variant="secondary" disabled={!bulkEnabled} onClick={() => setExtendOpen(true)}>延期</Button>
                  <Button variant="secondary" disabled={!bulkEnabled} onClick={() => bulkPatch({ status: "ARCHIVED" })}>归档</Button>
                  <Button variant="secondary" disabled={!bulkEnabled} onClick={() => bulkPatch({ status: "DONE" })}>通过</Button>
                  <Button variant="secondary" disabled={!bulkEnabled} onClick={() => bulkPatch({ status: "RECTIFYING" })}>不通过</Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="overflow-auto rounded-2xl border border-slate-100">
            <Table>
              <thead>
                <tr>
                  <Th className="w-10">
                    <input
                      type="checkbox"
                      checked={issues.length > 0 && selectedIds.length === issues.length}
                      onChange={(e) => {
                        const v = e.target.checked;
                        const next: any = {};
                        if (v) issues.forEach((i) => (next[i.id] = true));
                        setSelected(next);
                      }}
                    />
                  </Th>
                  <Th>序号</Th>
                  <Th>编号</Th>
                  <Th>检查对象</Th>
                  <Th>检查编号</Th>
                  <Th>检查单位</Th>
                  <Th>城市组织</Th>
                  <Th>科室</Th>
                  <Th>大类</Th>
                  <Th>小类</Th>
                  <Th className="text-right">操作</Th>
                </tr>
              </thead>
              <tbody>
                {issues.map((i, idx) => (
                  <tr key={i.id} className="hover:bg-slate-50/70">
                    <Td>
                      <input
                        type="checkbox"
                        checked={!!selected[i.id]}
                        onChange={(e) => setSelected((s) => ({ ...s, [i.id]: e.target.checked }))}
                      />
                    </Td>
                    <Td>{idx + 1}</Td>
                    <Td className="font-medium text-blue-700">{i.id}</Td>
                    <Td>{i.targetName}</Td>
                    <Td className="text-slate-500">{i.inspectionId}</Td>
                    <Td>{i.unitName}</Td>
                    <Td className="text-slate-500">{i.cityOrgPath}</Td>
                    <Td>{i.dept}</Td>
                    <Td>{i.major}</Td>
                    <Td>{i.minor}</Td>
                    <Td className="text-right space-x-2">
                      <Link to={`/issues/${i.id}`}>
                        <Button size="sm" variant="secondary">查看</Button>
                      </Link>
                      {user?.role === "RECTIFIER" && i.status === "RECTIFYING" && (
                        <Link to={`/issues/${i.id}?tab=rectify`}>
                          <Button size="sm">去整改</Button>
                        </Link>
                      )}
                      {user?.role === "RECTIFIER" && (
                        <Link to={`/issues/${i.id}?tab=appeal`}>
                          <Button size="sm" variant="secondary">去申诉</Button>
                        </Link>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {issues.length === 0 && <div className="text-sm text-slate-500 py-10 text-center">暂无数据</div>}
        </CardContent>
      </Card>

      <Modal
        open={assignOpen}
        title="批量交办（示例）"
        onClose={() => setAssignOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setAssignOpen(false)}>取消</Button>
            <Button onClick={() => { bulkPatch({ status: "RECTIFYING" }); setAssignOpen(false); }}>确认交办</Button>
          </div>
        }
      >
        <div className="text-sm text-slate-600">
          已选择 <span className="font-semibold text-slate-900">{selectedIds.length}</span> 条问题。确认后将状态置为 <Badge tone="amber">RECTIFYING</Badge>（待整改）。
        </div>
      </Modal>

      <Modal
        open={extendOpen}
        title="批量延期（示例）"
        onClose={() => setExtendOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setExtendOpen(false)}>取消</Button>
            <Button onClick={() => { bulkPatch({ overdue: false }); setExtendOpen(false); }}>确认延期</Button>
          </div>
        }
      >
        <div className="text-sm text-slate-600">
          这里模拟“延期”逻辑：实际应更新 <span className="font-mono">deadlineAt</span>。本演示只做按钮与流程展示。
        </div>
      </Modal>
    </div>
  );
}
