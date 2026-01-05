import { useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card";
import { Input, Select } from "../../components/Input";
import { Table, Td, Th } from "../../components/Table";
import { listOrgs, saveOrgs } from "../../services/data";
import { Org } from "../../types";
import { uuid } from "../../lib/utils";

export default function AdminOrgs() {
  const [orgs, setOrgs] = useState<Org[]>(() => listOrgs());
  const flat = useMemo(() => orgs, [orgs]);

  const add = () => {
    setOrgs((s) => [...s, { id: uuid("org_"), name: "新组织", parentId: null, status: "ACTIVE" }]);
  };

  const save = () => {
    saveOrgs(orgs);
    alert("已保存组织（演示）");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>组织管理</CardTitle>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={add}>+ 新增</Button>
              <Button onClick={save}>保存</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-2xl border border-slate-100">
            <Table>
              <thead>
                <tr>
                  <Th>名称</Th>
                  <Th>父组织</Th>
                  <Th>状态</Th>
                </tr>
              </thead>
              <tbody>
                {orgs.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70">
                    <Td><Input value={o.name} onChange={(e) => setOrgs((s) => s.map((x) => x.id === o.id ? { ...x, name: e.target.value } : x))} /></Td>
                    <Td>
                      <Select value={o.parentId ?? ""} onChange={(e) => setOrgs((s) => s.map((x) => x.id === o.id ? { ...x, parentId: e.target.value || null } : x))}>
                        <option value="">无</option>
                        {flat.filter((x) => x.id !== o.id).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </Select>
                    </Td>
                    <Td>
                      <Select value={o.status} onChange={(e) => setOrgs((s) => s.map((x) => x.id === o.id ? { ...x, status: e.target.value as any } : x))}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DISABLED">DISABLED</option>
                      </Select>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
