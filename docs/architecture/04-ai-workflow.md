# AI 协作流程

## 新功能开发

1. 读取 `docs/prototype/manifest.json`
2. 创建 `docs/prd/<feature-id>/overview.md`
3. 在 `docs/prd/<feature-id>/pages/` 中补页面 PRD
4. 脚手架化 `miniprogram/features/<feature-id>/`
5. 在 `miniprogram/config/` 中补路由与功能清单

## UI 调整

1. 先读目标页面 PRD
2. 先检查是否能复用现有 `ui` 或 `patterns` 组件
3. 只有在变更确实属于页面局部时才改页面文件
4. 至少出现两个真实复用点后，再把结构上提到全局层

## 主题调整

1. 先改 token 或具名主题文件
2. 如需视觉变体调整，再改组件 recipe
3. 避免直接在单页里散落颜色修补

## 交互逻辑调整

1. 先更新页面 PRD 中的状态表与交互表
2. 再修改 `model/actions.ts`、`model/state.ts`、`model/storage.ts`
3. 页面文件只保留事件绑定和数据装配相关改动
