import { useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card";
import { Input, Select } from "../../components/Input";
import { Table, Td, Th } from "../../components/Table";
import { Modal } from "../../components/Modal";
import { listUsers, upsertUser, deleteUser } from "../../services/data";
import { getAreaTree, setUserGrants, getGrantsByUser, flattenAreas } from "../../services/area";
import { Role, User } from "../../types";
import { uuid } from "../../lib/utils";

export default function AdminUsers() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("RECTIFIER");

  const users = useMemo(() => listUsers(), [open]);

  const tree = getAreaTree();
  const flatAreas = flattenAreas(tree);
  const [grantIds, setGrantIds] = useState<Record<string, boolean>>({});
  const [includeChildren, setIncludeChildren] = useState(true);

  const startCreate = () => {
    setEditing(null);
    setName("");
    setUsername("");
    setRole("RECTIFIER");
    setGrantIds({});
    setIncludeChildren(true);
    setOpen(true);
  };

  const startEdit = (u: User) => {
    setEditing(u);
    setName(u.name);
    setUsername(u.username);
    setRole(u.role);
    const gs = getGrantsByUser(u.id);
    const next: any = {};
    gs.forEach((g) => (next[g.areaId] = true));
    setGrantIds(next);
    setIncludeChildren(gs[0]?.includeChildren ?? true);
    setOpen(true);
  };

  const save = () => {
    const id = editing?.id || uuid("u_");
    upsertUser({ id, name: name.trim(), username: username.trim(), role });
    if (role === "RECTIFIER") {
      const selected = Object.entries(grantIds).filter(([, v]) => v).map(([areaId]) => {
        const area = flatAreas.find((a) => a.id === areaId)!;
        return { areaType: area.type, areaId: area.id, includeChildren };
      });
      setUserGrants(id, selected as any);
    } else {
      setUserGrants(id, []);
    }
    setOpen(false);
    alert("已保存（演示）");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>账号管理（管理员最高权限）</CardTitle>
            <Button onClick={startCreate}>+ 新增账号</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-2xl border border-slate-100">
            <Table>
              <thead>
                <tr>
                  <Th>姓名</Th>
                  <Th>用户名</Th>
                  <Th>角色</Th>
                  <Th>负责区域（整改员）</Th>
                  <Th className="text-right">操作</Th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const gs = getGrantsByUser(u.id);
                  const names = gs.map((g) => flatAreas.find((a) => a.id === g.areaId)?.name).filter(Boolean).join("、");
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70">
                      <Td className="font-medium">{u.name}</Td>
                      <Td className="text-slate-500">{u.username}</Td>
                      <Td>{u.role}</Td>
                      <Td className="text-slate-500">{u.role === "RECTIFIER" ? (names || "未分配") : "-"}</Td>
                      <Td className="text-right space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => startEdit(u)}>编辑</Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            if (confirm("确认删除该账号？")) {
                              deleteUser(u.id);
                              location.reload();
                            }
                          }}
                        >
                          删除
                        </Button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <div className="text-xs text-slate-500 mt-3">
            规则：单角色。整改员支持多区域授权（树形多选 + 包含下级）。角色非整改员时不保留区域授权。
          </div>
        </CardContent>
      </Card>

      <Modal
        open={open}
        title={editing ? "编辑账号" : "新增账号"}
        onClose={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={save} disabled={!name.trim() || !username.trim()}>保存</Button>
          </div>
        }
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">姓名</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：整改员-东涌" />
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">用户名</div>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="例如：rect2" />
          </div>
          <div className="md:col-span-2">
            <div className="text-xs text-slate-500 mb-1">角色（单选）</div>
            <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="ADMIN">ADMIN（管理员）</option>
              <option value="AUDITOR">AUDITOR（核审员）</option>
              <option value="RECTIFIER">RECTIFIER（整改员）</option>
            </Select>
          </div>

          {role === "RECTIFIER" && (
            <>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500 mb-1">负责区域（多选）</div>
                  <label className="text-xs text-slate-600 inline-flex items-center gap-2">
                    <input type="checkbox" checked={includeChildren} onChange={(e) => setIncludeChildren(e.target.checked)} />
                    包含下级（建议默认开启）
                  </label>
                </div>
                <div className="max-h-64 overflow-auto rounded-2xl border border-slate-100 p-3 bg-slate-50">
                  {flatAreas.map((a) => (
                    <label key={a.id} className="flex items-center gap-2 py-1 text-sm">
                      <input type="checkbox" checked={!!grantIds[a.id]} onChange={(e) => setGrantIds((s) => ({ ...s, [a.id]: e.target.checked }))} />
                      <span className="text-slate-700">{a.name}</span>
                      <span className="text-xs text-slate-400">{a.type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 text-xs text-slate-500">
                建议：授权节点为街道/社区时勾选“包含下级”，否则由于问题绑定到单位（UNIT），会导致查不到问题。
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
