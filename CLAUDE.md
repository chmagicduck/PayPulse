# CLAUDE.md

本仓库的目标不是“让 AI 看很多文档”，而是“让 AI 只看最少内容也能安全改动”。

## 先读什么

1. `docs/architecture/00-system-overview.md`
2. `docs/architecture/01-directory-contract.md`
3. 当前任务对应的事实源：
   - 静态还原任务：`docs/prototype/<version>/`
   - PRD 推理任务：`miniprogram/features/<feature-id>/` 与 `docs/prd/<version>/README.md`
   - 逻辑开发任务：`docs/prd/<version>/README.md`
4. 目标 feature 的页面文件和少量共享代码

## 现在的三种角色

- 产品经理：基于 `miniprogram/features/` 里的静态页面、mock 数据、路由和少量共享代码，输出 `docs/prd/<version>/`
- 画图程序员：只读目标原型、目标页面和少量共享样式，先还原静态页面
- 逻辑程序员：只读 `docs/prd/<version>/README.md`、`domain-model.md`、`data-model.md`、目标页面文档，以及目标 feature 的最小实现上下文

默认要求是最小检索，不要为了一次改单页去扫完整个仓库。

## 目录契约

```text
docs/
  prototype/<version>/    # 版本化原型输入
  prd/<version>/          # 目录式版本 PRD
    README.md
    domain-model.md
    data-model.md
    pages/
miniprogram/
  features/<feature-id>/
    README.md
    public.ts
    model.ts
    <page>.ts
    <page>.wxml
    <page>.less
    <page>.json
```

## 必须遵守的规则

- 页面文件直接平铺在 `miniprogram/features/<feature-id>/` 下，不要再建 `pages/<page-id>/index.*`
- 页面文件只做装配和视觉交互，正式业务逻辑放入 feature model
- 视觉基础只维护一套，统一改 `miniprogram/theme/`
- 新原型放进 `docs/prototype/<version>/`，文件名直接映射代码路径
- PRD 里的共享业务规则统一收口到 `domain-model.md`
- PRD 里的共享数据结构统一收口到 `data-model.md`
- 静态页里的 mock 数字和文案只能作为推理线索，不能直接当成真实业务事实

文件名规则：
`features.profile.pages.home.ts` -> `miniprogram/features/profile/home.*`

## 开发与验证

- 用微信开发者工具打开项目根目录（appid: `wx17bd33e979aa3dba`）
- TypeScript 和 Less 由开发者工具编译
- 类型检查：`npx tsc --noEmit`
- JSON 文件必须保存为 UTF-8 无 BOM，避免微信开发者工具解析失败

## 高保真还原的默认原则

- 最新原型是唯一视觉基准
- 静态阶段只做视觉和演示级交互
- 页面结构变化时，要同步清理 `model.ts`、页面 TS、WXML、Less
- 图标继续走 `image + base64` 方案，详见 `docs/conventions/prototype-to-miniprogram.md`
- 静态页完成后，默认下一步不是直接写逻辑，而是先输出版本 PRD
