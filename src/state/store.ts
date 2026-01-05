import { loadJSON, saveJSON } from "../lib/storage";
import { AreaGrant, AreaNode, ExportTask, Inspection, Issue, Org, Project, User } from "../types";
import {
  DEFAULT_AREAS,
  DEFAULT_EXPORTS,
  DEFAULT_GRANTS,
  DEFAULT_INSPECTIONS,
  DEFAULT_ISSUES,
  DEFAULT_ORGS,
  DEFAULT_PROJECTS,
  DEFAULT_USERS,
} from "./mock";

const KEY = "inspection_ui_pack_v1";

export type DB = {
  users: User[];
  areas: AreaNode[];
  grants: AreaGrant[];
  orgs: Org[];
  projects: Project[];
  issues: Issue[];
  inspections: Inspection[];
  exports: ExportTask[];
};

const DEFAULT_DB: DB = {
  users: DEFAULT_USERS,
  areas: DEFAULT_AREAS,
  grants: DEFAULT_GRANTS,
  orgs: DEFAULT_ORGS,
  projects: DEFAULT_PROJECTS,
  issues: DEFAULT_ISSUES,
  inspections: DEFAULT_INSPECTIONS,
  exports: DEFAULT_EXPORTS,
};

export function loadDB(): DB {
  return loadJSON<DB>(KEY, DEFAULT_DB);
}

export function saveDB(db: DB) {
  saveJSON(KEY, db);
}

export function resetDB() {
  saveJSON(KEY, DEFAULT_DB);
}
