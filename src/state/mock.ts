import { AreaNode, Issue, Inspection, Org, Project, User, AreaGrant, ExportTask } from "../types";
import { uuid } from "../lib/utils";

export const DEFAULT_USERS: User[] = [
  { id: "u_admin", name: "管理员", username: "admin", role: "ADMIN" },
  { id: "u_auditor", name: "核审员A", username: "auditor", role: "AUDITOR" },
  { id: "u_rect1", name: "整改员-东涌", username: "rect1", role: "RECTIFIER" },
];

export const DEFAULT_AREAS: AreaNode[] = [
  {
    id: "d_nansha",
    type: "DISTRICT",
    name: "南沙区",
    children: [
      {
        id: "s_dongyong",
        type: "STREET",
        name: "东涌镇",
        children: [
          {
            id: "c_demo",
            type: "COMMUNITY",
            name: "示范社区",
            children: [
              { id: "unit_yumi", type: "UNIT", name: "鱼米之家（鱼窝头城场店）" },
              { id: "unit_tiandi", type: "UNIT", name: "天汇百汇（富强路9号）" },
              { id: "unit_108", type: "UNIT", name: "108公寓（禾田西街44号）" },
            ],
          },
        ],
      },
    ],
  },
];

export const DEFAULT_ORGS: Org[] = [
  { id: "org_gz", name: "广东省/广州市", parentId: null, status: "ACTIVE" },
  { id: "org_nansha", name: "南沙区", parentId: "org_gz", status: "ACTIVE" },
  { id: "org_dongyong", name: "东涌镇", parentId: "org_nansha", status: "ACTIVE" },
];

export const DEFAULT_PROJECTS: Project[] = [
  { id: "proj_daily", name: "垃圾分类日常检查评价项目", orgId: "org_dongyong", status: "ACTIVE" },
  { id: "proj_rural", name: "农村垃圾分类检查", orgId: "org_dongyong", status: "ACTIVE" },
];

export const DEFAULT_GRANTS: AreaGrant[] = [
  { id: "g1", userId: "u_rect1", areaType: "STREET", areaId: "s_dongyong", includeChildren: true },
];

const baseIssue = (n: number, unitId: string, unitName: string, desc: string, minor: string, status: Issue["status"]): Issue => {
  const now = new Date();
  const reportAt = new Date(now.getTime() - n * 3600_000).toISOString();
  const deadline = new Date(now.getTime() + 3 * 24 * 3600_000).toISOString();
  const overdue = false;
  return {
    id: `WT260100${60 + n}`,
    inspectionId: "JC26010003",
    reportAt,
    inspectorName: "郭少霞",
    targetName: "东涌镇",
    unitId,
    unitName,
    cityOrgPath: "广东省/广州市/南沙区/东涌镇",
    orgId: "org_dongyong",
    projectId: "proj_daily",
    dept: "暗检",
    major: "三类单位",
    minor,
    description: desc,
    locationDesc: "",
    scoreDeduct: 0.5,
    status,
    stage: status === "PENDING_RECHECK" ? "RECHECK" : status === "RECTIFYING" ? "RECTIFY" : "INITIAL",
    deadlineAt: deadline,
    assignedAt: status === "RECTIFYING" ? new Date(now.getTime() - 2 * 3600_000).toISOString() : "",
    overdue,
    appealStatus: "NONE",
    photos: [
      { id: uuid("p_"), url: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1200&q=70", label: "主图" },
      { id: uuid("p_"), url: "https://images.unsplash.com/photo-1550565118-3a14e8d0386f?auto=format&fit=crop&w=1200&q=70", label: "远景" },
    ],
    lat: 22.80,
    lng: 113.54,
  };
};

export const DEFAULT_ISSUES: Issue[] = [
  baseIssue(2, "unit_tiandi", "天汇百汇（富强路9号）", "分类收集容器无标识或标识不清", "容器设置", "RECTIFYING"),
  baseIssue(3, "unit_tiandi", "天汇百汇（富强路9号）", "分类收集容器无标识或标识不清", "容器设置", "RECTIFYING"),
  baseIssue(4, "unit_yumi", "鱼米之家（鱼窝头城场店）", "（经营区域）厨余垃圾收集容器，投放不准确", "分类效果", "PENDING_ASSIGN"),
  baseIssue(5, "unit_108", "108公寓（禾田西街44号）", "应配置但未配置分类容器", "容器设置", "PENDING_ASSIGN"),
];

export const DEFAULT_INSPECTIONS: Inspection[] = [
  { id: "JC26010004", projectId: "proj_daily", orgId: "org_dongyong", orgPath: "广东省/广州市/南沙区/东涌镇", targetName: "东涌镇", score: 0, inspectedAt: "2026-01-05T09:36:11.000Z", inspectorName: "郭少霞" },
  { id: "JC26010003", projectId: "proj_daily", orgId: "org_dongyong", orgPath: "广东省/广州市/南沙区/东涌镇", targetName: "东涌镇", score: 413.5, inspectedAt: "2026-01-05T07:13:53.000Z", inspectorName: "郭少霞" },
];

export const DEFAULT_EXPORTS: ExportTask[] = [
  { id: "e1", name: "王锦焕", createdAt: "2025-06-30T10:14:42.000Z", filename: "问题导出_1761812863bf4f4.xlsx", status: "DONE" },
  { id: "e2", name: "王锦焕", createdAt: "2025-05-29T10:18:11.000Z", filename: "问题导出_d12549d704c34e14a4c674fd422b2113.xlsx", status: "DONE" },
];
