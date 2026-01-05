import { useState } from "react";
import { Button } from "../../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card";
import { Input, Select } from "../../components/Input";
import { Table, Td, Th } from "../../components/Table";
import { listOrgs, listProjects, saveProjects } from "../../services/data";
import { Project } from "../../types";
import { uuid } from "../../lib/utils";

export default function AdminProjects() {
  const orgs = listOrgs();
  const [projects, setProjects] = useState<Project[]>(() => listProjects());

  const add = () => {
    setProjects((s) => [...s, { id: uuid("proj_"), name: "新项目", orgId: orgs[0]?.id || "", status: "ACTIVE" }]);
  };

  const save = () => {
    saveProjects(projects);
    alert("已保存项目（演示）");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>项目管理</CardTitle>
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
                  <Th>归属组织</Th>
                  <Th>状态</Th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <Td><Input value={p.name} onChange={(e) => setProjects((s) => s.map((x) => x.id === p.id ? { ...x, name: e.target.value } : x))} /></Td>
                    <Td>
                      <Select value={p.orgId} onChange={(e) => setProjects((s) => s.map((x) => x.id === p.id ? { ...x, orgId: e.target.value } : x))}>
                        {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </Select>
                    </Td>
                    <Td>
                      <Select value={p.status} onChange={(e) => setProjects((s) => s.map((x) => x.id === p.id ? { ...x, status: e.target.value as any } : x))}>
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
