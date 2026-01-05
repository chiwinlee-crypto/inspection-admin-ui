# Inspection Admin UI Pack (Blue)

用于在 meku.dev 快速展示 UI 与逻辑（不依赖后端）：
- 核审员：问题查询/交办/复检（入口）、导出（示例）
- 整改员：仅整改/申诉，且仅可见自己负责区域（后端数据域过滤在本包用 localStorage 模拟）
- 管理员：最高权限，账号/角色（单角色）/区域授权（多选 + 包含下级）/组织管理/项目管理

## 运行
```bash
npm i
npm run dev
```

## 演示账号
- admin (ADMIN)
- auditor (AUDITOR)
- rect1 (RECTIFIER，已分配“东涌镇（含下级）”)

## 说明
本包用 localStorage 保存“模拟数据库”。在登录页可一键重置演示数据。
