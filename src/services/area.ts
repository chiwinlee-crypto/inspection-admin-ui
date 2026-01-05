import { AreaNode, AreaGrant, AreaType } from "../types";
import { loadDB, saveDB } from "../state/store";
import { uuid } from "../lib/utils";

export function flattenAreas(nodes: AreaNode[]): { id: string; type: AreaType; name: string; parentId?: string }[] {
  const out: any[] = [];
  const walk = (n: AreaNode, parentId?: string) => {
    out.push({ id: n.id, type: n.type, name: n.name, parentId });
    n.children?.forEach((c) => walk(c, n.id));
  };
  nodes.forEach((n) => walk(n));
  return out;
}

export function getAreaTree(): AreaNode[] {
  return loadDB().areas;
}

export function setAreaTree(tree: AreaNode[]) {
  const db = loadDB();
  db.areas = tree;
  saveDB(db);
}

export function getGrantsByUser(userId: string): AreaGrant[] {
  return loadDB().grants.filter((g) => g.userId === userId);
}

export function setUserGrants(userId: string, grants: Omit<AreaGrant, "id" | "userId">[]) {
  const db = loadDB();
  db.grants = db.grants.filter((g) => g.userId !== userId);
  db.grants.push(...grants.map((g) => ({ id: uuid("g_"), userId, ...g })));
  saveDB(db);
}

export function expandPermittedUnitIds(userId: string): string[] {
  const db = loadDB();
  const grants = db.grants.filter((g) => g.userId === userId);
  const flat = flattenAreas(db.areas);
  const childrenMap = new Map<string, string[]>();
  for (const a of flat) {
    if (!a.parentId) continue;
    childrenMap.set(a.parentId, [...(childrenMap.get(a.parentId) || []), a.id]);
  }
  const getDesc = (id: string): string[] => {
    const res: string[] = [];
    const stack = [id];
    while (stack.length) {
      const cur = stack.pop()!;
      res.push(cur);
      const kids = childrenMap.get(cur) || [];
      for (const k of kids) stack.push(k);
    }
    return res;
  };

  const unitIds = new Set<string>();
  for (const g of grants) {
    if (g.areaType === "UNIT") {
      unitIds.add(g.areaId);
      continue;
    }
    if (!g.includeChildren) continue; // non-unit without children -> no unit visibility
    for (const id of getDesc(g.areaId)) {
      const node = flat.find((x) => x.id === id);
      if (node?.type === "UNIT") unitIds.add(node.id);
    }
  }
  return [...unitIds];
}
