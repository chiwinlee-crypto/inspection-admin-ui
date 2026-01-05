import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Table, Td, Th } from "../components/Table";
import { loadDB } from "../state/store";
import { fmtDateTime } from "../lib/utils";

export default function Inspections() {
  const db = loadDB();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>检查查询</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-2xl border border-slate-100">
            <Table>
              <thead>
                <tr>
                  <Th>序号</Th>
                  <Th>编号</Th>
                  <Th>项目名称</Th>
                  <Th>城市组织</Th>
                  <Th>检查对象</Th>
                  <Th>得分</Th>
                  <Th>检查时间</Th>
                  <Th>检查员</Th>
                </tr>
              </thead>
              <tbody>
                {db.inspections.map((x, idx) => (
                  <tr key={x.id} className="hover:bg-slate-50/70">
                    <Td>{idx + 1}</Td>
                    <Td className="font-medium text-blue-700">{x.id}</Td>
                    <Td>{db.projects.find((p) => p.id === x.projectId)?.name || "-"}</Td>
                    <Td className="text-slate-500">{x.orgPath}</Td>
                    <Td>{x.targetName}</Td>
                    <Td>{x.score}</Td>
                    <Td>{fmtDateTime(x.inspectedAt)}</Td>
                    <Td>{x.inspectorName}</Td>
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
