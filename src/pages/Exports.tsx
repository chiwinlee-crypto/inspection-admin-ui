import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Table, Td, Th } from "../components/Table";
import { listExports } from "../services/data";
import { Badge } from "../components/Badge";
import { fmtDateTime } from "../lib/utils";
import { Button } from "../components/Button";

export default function Exports() {
  const exports = listExports();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>文件下载</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-2xl border border-slate-100">
            <Table>
              <thead>
                <tr>
                  <Th>编号</Th>
                  <Th>名称</Th>
                  <Th>创建时间</Th>
                  <Th>文件名</Th>
                  <Th>文件状态</Th>
                  <Th className="text-right">操作</Th>
                </tr>
              </thead>
              <tbody>
                {exports.map((x) => (
                  <tr key={x.id} className="hover:bg-slate-50/70">
                    <Td>{x.id}</Td>
                    <Td>{x.name}</Td>
                    <Td className="text-slate-500">{fmtDateTime(x.createdAt)}</Td>
                    <Td className="font-mono text-xs">{x.filename}</Td>
                    <Td><Badge tone={x.status === "DONE" ? "green" : "amber"}>{x.status}</Badge></Td>
                    <Td className="text-right">
                      <Button size="sm" variant="secondary" onClick={() => alert("演示包：下载按钮（可接真实文件URL）")}>下载</Button>
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
