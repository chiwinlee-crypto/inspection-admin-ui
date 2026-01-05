import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Badge } from "../components/Badge";
import { MapPlaceholder } from "../components/MapPlaceholder";
import { Textarea } from "../components/Input";
import { useAuth } from "../state/auth";
import { can } from "../state/rbac";
import { getIssue, updateIssue } from "../services/data";
import { fmtDateTime, uuid } from "../lib/utils";

export default function IssueDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "detail";

  const issue = useMemo(() => {
    if (!user || !id) return null;
    return getIssue(user.role, user.id, id);
  }, [user, id]);

  const [rectifyNote, setRectifyNote] = useState("");
  const [appealNote, setAppealNote] = useState("");

  if (!issue) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-slate-500">未找到问题（可能没有负责区域权限）。</div>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => nav("/issues")}>返回列表</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const canRectify = user?.role === "RECTIFIER" && issue.status === "RECTIFYING";
  const canAppeal = user?.role === "RECTIFIER" && (issue.appealStatus === "NONE" || issue.appealStatus === "REJECTED");

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={() => nav(-1)}>返回</Button>

            {user && user.role !== "RECTIFIER" && can(user.role, "ISSUE_ASSIGN") && (
              <Button onClick={() => { updateIssue(issue.id, { status: "RECTIFYING" }); alert("已交办（示例）"); }}>
                交办
              </Button>
            )}

            {user && user.role !== "RECTIFIER" && can(user.role, "ISSUE_EDIT") && (
              <Button variant="secondary" onClick={() => alert("演示包：编辑入口（可接表单）")}>
                编辑
              </Button>
            )}

            {user && user.role !== "RECTIFIER" && can(user.role, "ISSUE_DELETE") && (
              <Button
                variant="danger"
                onClick={() => {
                  alert("演示包：删除入口（建议仅管理员/高级核审员）");
                }}
              >
                删除
              </Button>
            )}

            {user?.role === "RECTIFIER" && (
              <div className="ml-auto flex gap-2">
                <Button
                  disabled={!canRectify}
                  onClick={() => setParams({ tab: "rectify" })}
                >
                  提交整改
                </Button>
                <Button
                  variant="secondary"
                  disabled={!canAppeal}
                  onClick={() => setParams({ tab: "appeal" })}
                >
                  发起申诉
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>问题详情</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-slate-500">报告时间</div>
              <div>{fmtDateTime(issue.reportAt)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-500">检查员</div>
              <div>{issue.inspectorName}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-500">问题编号</div>
              <div className="font-medium text-blue-700">{issue.id}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-500">检查对象</div>
              <div>{issue.targetName}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-500">检查编号</div>
              <div>{issue.inspectionId}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-500">检查单位</div>
              <div>{issue.unitName}</div>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="text-slate-500">城市组织</div>
              <div className="text-right text-slate-700">{issue.cityOrgPath}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-500">科室</div>
              <div>{issue.dept}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-500">分类</div>
              <div>{issue.major} / {issue.minor}</div>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <div className="text-slate-500">现象描述</div>
              <div className="mt-1 text-slate-800">{issue.description}</div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="text-slate-500">检查结果</div>
              <Badge tone="rose">扣 {issue.scoreDeduct.toFixed(1)} 分</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-500">问题状态</div>
              <Badge tone={issue.status === "RECTIFYING" ? "amber" : issue.status === "PENDING_ASSIGN" ? "blue" : "slate"}>
                {issue.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-500">流程环节</div>
              <div>{issue.stage}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-500">整改截止时间</div>
              <div>{issue.deadlineAt ? fmtDateTime(issue.deadlineAt) : "-"}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>图片证据</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {issue.photos.map((p) => (
                <div key={p.id} className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <div className="text-xs text-slate-600">{p.label}</div>
                    <div className="text-xs text-slate-400">{issue.id}</div>
                  </div>
                  <img src={p.url} alt={p.label} className="w-full h-56 object-cover" />
                </div>
              ))}
            </div>

            {user?.role === "RECTIFIER" && (
              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="text-sm font-semibold text-blue-900">整改 / 申诉</div>
                <div className="text-xs text-blue-700 mt-1">
                  请在详情页完成整改提交或发起申诉。此演示包会把动作写回本地数据。
                </div>

                <div className="mt-3 flex gap-2">
                  <Button size="sm" disabled={!canRectify} onClick={() => setParams({ tab: "rectify" })}>去整改</Button>
                  <Button size="sm" variant="secondary" disabled={!canAppeal} onClick={() => setParams({ tab: "appeal" })}>去申诉</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <MapPlaceholder lat={issue.lat} lng={issue.lng} />
      </div>

      {user?.role === "RECTIFIER" && (
        <Card>
          <CardHeader>
            <CardTitle>{tab === "appeal" ? "发起申诉" : "提交整改"}</CardTitle>
          </CardHeader>
          <CardContent>
            {tab !== "appeal" ? (
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-slate-500 mb-1">整改说明（必填）</div>
                  <Textarea value={rectifyNote} onChange={(e) => setRectifyNote(e.target.value)} placeholder="填写整改措施、整改结果、现场说明..." rows={6} />
                  <div className="text-xs text-slate-500 mt-4 mb-1">整改图片（示例：点击按钮模拟上传）</div>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const photo = { id: uuid("fix_"), url: "https://images.unsplash.com/photo-1581579185169-68f7b79f0b2f?auto=format&fit=crop&w=1200&q=70", label: "整改图" as const };
                      updateIssue(issue.id, { photos: [...issue.photos, photo] });
                      alert("已模拟追加整改图");
                      nav(0);
                    }}
                  >
                    + 添加整改图
                  </Button>
                </div>
                <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50">
                  <div className="text-sm font-semibold">提交规则（演示）</div>
                  <ul className="text-xs text-slate-600 mt-2 space-y-2 list-disc pl-5">
                    <li>仅在状态为 <b>RECTIFYING</b> 时允许提交整改。</li>
                    <li>提交后将状态切换为 <b>PENDING_RECHECK</b>（待复检）。</li>
                    <li>核审员在“问题复检”Tab查看并进行通过/不通过。</li>
                  </ul>
                  <div className="mt-4">
                    <Button
                      disabled={!canRectify || !rectifyNote.trim()}
                      onClick={() => {
                        updateIssue(issue.id, { status: "PENDING_RECHECK", stage: "RECHECK" });
                        alert("整改已提交 → 进入待复检（示例）");
                        nav("/issues");
                      }}
                    >
                      确认提交整改
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-slate-500 mb-1">申诉理由（必填）</div>
                  <Textarea value={appealNote} onChange={(e) => setAppealNote(e.target.value)} placeholder="填写申诉理由，例如：不属本单位、问题不成立、已整改但判定不合理..." rows={6} />
                  <div className="mt-4">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const photo = { id: uuid("ap_"), url: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=70", label: "证据图" as const };
                        updateIssue(issue.id, { photos: [...issue.photos, photo] });
                        alert("已模拟追加申诉证据图");
                        nav(0);
                      }}
                    >
                      + 添加证据图
                    </Button>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50">
                  <div className="text-sm font-semibold">申诉规则（演示）</div>
                  <ul className="text-xs text-slate-600 mt-2 space-y-2 list-disc pl-5">
                    <li>整改员可在整改期内发起申诉。</li>
                    <li>申诉提交后申诉状态置为 <b>SUBMITTED</b>（独立于问题状态）。</li>
                    <li>管理员/核审员在后续可做“申诉处理”（演示包未做处理页）。</li>
                  </ul>
                  <div className="mt-4">
                    <Button
                      disabled={!canAppeal || !appealNote.trim()}
                      onClick={() => {
                        updateIssue(issue.id, { appealStatus: "SUBMITTED" });
                        alert("申诉已提交（示例）");
                        nav("/issues");
                      }}
                    >
                      确认提交申诉
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
