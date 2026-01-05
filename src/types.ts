export type Role = "ADMIN" | "AUDITOR" | "RECTIFIER";

export type AreaType = "DISTRICT" | "STREET" | "COMMUNITY" | "UNIT";

export type IssueStatus =
  | "REGISTERED"
  | "PENDING_ASSIGN"
  | "RECTIFYING"
  | "PENDING_RECHECK"
  | "DONE"
  | "ARCHIVED"
  | "CANCELLED";

export type FlowStage =
  | "INITIAL"
  | "ASSIGN"
  | "RECTIFY"
  | "RECHECK"
  | "APPROVAL"
  | "END";

export type AppealStatus = "NONE" | "SUBMITTED" | "PROCESSING" | "APPROVED" | "REJECTED";

export type User = {
  id: string;
  name: string;
  username: string;
  role: Role;
  disabled?: boolean;
};

export type AreaNode = {
  id: string;
  type: AreaType;
  name: string;
  children?: AreaNode[];
};

export type AreaGrant = {
  id: string;
  userId: string;
  areaType: AreaType;
  areaId: string;
  includeChildren: boolean;
};

export type Org = { id: string; name: string; parentId?: string | null; status: "ACTIVE" | "DISABLED" };
export type Project = { id: string; name: string; orgId: string; status: "ACTIVE" | "DISABLED" };

export type Photo = { id: string; url: string; label: "主图" | "远景" | "整改图" | "证据图" };

export type Issue = {
  id: string;           // WT...
  inspectionId: string; // JC...
  reportAt: string;
  inspectorName: string;
  targetName: string;  // 检查对象
  unitId: string;      // for area filter
  unitName: string;    // 检查单位
  cityOrgPath: string; // 组织路径
  orgId: string;
  projectId: string;
  dept: string;        // 科室
  major: string;       // 大类
  minor: string;       // 小类
  description: string;
  locationDesc?: string;
  scoreDeduct: number;
  status: IssueStatus;
  stage: FlowStage;
  deadlineAt?: string;
  assignedAt?: string;
  overdue: boolean;
  appealStatus: AppealStatus;
  photos: Photo[];
  lat?: number;
  lng?: number;
};

export type ExportTask = {
  id: string;
  name: string;
  createdAt: string;
  filename: string;
  status: "GENERATING" | "DONE" | "FAILED";
};

export type Inspection = {
  id: string; // JC...
  projectId: string;
  orgId: string;
  orgPath: string;
  targetName: string;
  score: number;
  inspectedAt: string;
  inspectorName: string;
};
