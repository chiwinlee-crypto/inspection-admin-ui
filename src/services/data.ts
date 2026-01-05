import { loadDB, saveDB } from "../state/store";
import { ExportTask, Issue, Org, Project, Role, User } from "../types";
import { expandPermittedUnitIds } from "./area";
import { uuid } from "../lib/utils";

export function listUsers(): User[] {
  return loadDB().users;
}
export function upsertUser(u: User) {
  const db = loadDB();
  const idx = db.users.findIndex((x) => x.id === u.id);
  if (idx >= 0) db.users[idx] = u; else db.users.push(u);
  saveDB(db);
}
export function deleteUser(userId: string) {
  const db = loadDB();
  db.users = db.users.filter((u) => u.id !== userId);
  db.grants = db.grants.filter((g) => g.userId !== userId);
  saveDB(db);
}

export function listOrgs(): Org[] { return loadDB().orgs; }
export function saveOrgs(orgs: Org[]) { const db=loadDB(); db.orgs=orgs; saveDB(db); }

export function listProjects(): Project[] { return loadDB().projects; }
export function saveProjects(projects: Project[]) { const db=loadDB(); db.projects=projects; saveDB(db); }

export type IssueQuery = Partial<{
  keyword: string;
  orgId: string;
  projectId: string;
  status: Issue["status"] | "";
  overdue: "YES" | "NO" | "";
}>;

export function listIssues(role: Role, userId: string, q: IssueQuery): Issue[] {
  const db = loadDB();
  let issues = [...db.issues];

  // Data-scope control (RECTIFIER only)
  if (role === "RECTIFIER") {
    const allowedUnits = new Set(expandPermittedUnitIds(userId));
    issues = issues.filter((i) => allowedUnits.has(i.unitId));
  }

  if (q.keyword) {
    const k = q.keyword.trim();
    issues = issues.filter((i) =>
      [i.id, i.unitName, i.description, i.inspectionId].some((v) => v.includes(k))
    );
  }
  if (q.orgId) issues = issues.filter((i) => i.orgId === q.orgId);
  if (q.projectId) issues = issues.filter((i) => i.projectId === q.projectId);
  if (q.status) issues = issues.filter((i) => i.status === q.status);
  if (q.overdue) issues = issues.filter((i) => (q.overdue === "YES" ? i.overdue : !i.overdue));

  return issues.sort((a, b) => (a.reportAt < b.reportAt ? 1 : -1));
}

export function getIssue(role: Role, userId: string, id: string): Issue | null {
  const issues = listIssues(role, userId, {});
  return issues.find((x) => x.id === id) || null;
}

export function updateIssue(id: string, patch: Partial<Issue>) {
  const db = loadDB();
  const idx = db.issues.findIndex((i) => i.id === id);
  if (idx < 0) return;
  db.issues[idx] = { ...db.issues[idx], ...patch };
  saveDB(db);
}

export function createExportTask(name: string): ExportTask {
  const db = loadDB();
  const t: ExportTask = {
    id: uuid("exp_"),
    name,
    createdAt: new Date().toISOString(),
    filename: `问题导出_${uuid("").slice(0, 8)}.xlsx`,
    status: "DONE",
  };
  db.exports.unshift(t);
  saveDB(db);
  return t;
}

export function listExports(): ExportTask[] {
  return loadDB().exports;
}
