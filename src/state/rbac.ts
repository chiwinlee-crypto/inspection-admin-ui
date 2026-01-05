import { Role } from "../types";

export type MenuItem = { key: string; label: string; to: string; group?: string };

export const ROLE_MENUS: Record<Role, MenuItem[]> = {
  ADMIN: [
    { key: "dashboard", label: "首页", to: "/" },
    { key: "issues", label: "问题查询", to: "/issues" },
    { key: "assign", label: "问题交办", to: "/issues?tab=assign" },
    { key: "recheck", label: "问题复检", to: "/issues?tab=recheck" },
    { key: "inspections", label: "检查查询", to: "/inspections" },
    { key: "areas", label: "检查单位", to: "/areas" },
    { key: "exports", label: "文件下载", to: "/exports" },
    { key: "sys_users", label: "账号管理", to: "/admin/users", group: "系统管理" },
    { key: "sys_orgs", label: "组织管理", to: "/admin/orgs", group: "系统管理" },
    { key: "sys_projects", label: "项目管理", to: "/admin/projects", group: "系统管理" },
  ],
  AUDITOR: [
    { key: "dashboard", label: "首页", to: "/" },
    { key: "issues", label: "问题查询", to: "/issues" },
    { key: "assign", label: "问题交办", to: "/issues?tab=assign" },
    { key: "recheck", label: "问题复检", to: "/issues?tab=recheck" },
    { key: "inspections", label: "检查查询", to: "/inspections" },
    { key: "areas", label: "检查单位", to: "/areas" },
    { key: "exports", label: "文件下载", to: "/exports" },
  ],
  RECTIFIER: [
    { key: "dashboard", label: "首页", to: "/" },
    { key: "my_issues", label: "我的问题", to: "/issues" },
  ],
};

export const ROLE_PERMS: Record<Role, string[]> = {
  ADMIN: ["*"],
  AUDITOR: [
    "ISSUE_VIEW",
    "ISSUE_ASSIGN",
    "ISSUE_EXTEND",
    "ISSUE_RECHECK",
    "ISSUE_APPROVE",
    "ISSUE_ARCHIVE",
    "ISSUE_EXPORT",
    "ISSUE_EDIT",
    "ISSUE_DELETE",
  ],
  RECTIFIER: ["ISSUE_VIEW", "ISSUE_RECTIFY", "ISSUE_APPEAL"],
};

export function can(role: Role, perm: string) {
  const p = ROLE_PERMS[role] || [];
  return p.includes("*") || p.includes(perm);
}
