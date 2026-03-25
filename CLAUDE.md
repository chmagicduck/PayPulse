# CLAUDE.md

本仓库的目标不是“让 AI 看很多文档”，而是“让 AI 只看最少内容也能安全改动”。

## 先读什么

1. `docs/architecture/00-system-overview.md`
2. `docs/architecture/01-directory-contract.md`
3. 目标版本 PRD：`docs/prd/<version>/README.md`
4. 目标 feature 的 `model/` 和 `pages/`

如果任务只是静态还原，可以跳过大部分业务代码，只看目标原型和目标页面。

## 现在的三种角色

- 产品经理：只读 `docs/prototype/<version>/` 里必要的原型文件，结合少量现状代码，输出一套 `docs/prd/<version>/`
- 画图程序员：只读目标原型、目标页面、少量共享组件和 `miniprogram/theme/`
- 逻辑程序员：只读 `README.md`、`domain-model.md`、`data-model.md`、目标页面文档，以及目标 feature 的 `model/` 与目标页面

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
    model/
    components/
    pages/
      home.ts
      home.wxml
      home.less
      home.json
```

## 必须遵守的规则

- 页面必须平铺在 `miniprogram/features/<feature-id>/pages/` 下，不要再建 `pages/<page-id>/index.*`
- 页面文件只做装配和视觉交互，业务逻辑放 `model/`
- 视觉基础只维护一套，统一改 `miniprogram/theme/`
- 新原型放进 `docs/prototype/<version>/`，文件名直接映射代码路径
- PRD 里的共享业务规则统一收口到 `domain-model.md`
- PRD 里的共享数据结构统一收口到 `data-model.md`

文件名规则：
`features.profile.pages.home.ts` -> `miniprogram/features/profile/pages/home.*`

## 开发与验证

- 用微信开发者工具打开项目根目录（appid: `wx17bd33e979aa3dba`）
- TypeScript 和 Less 由开发者工具编译
- 类型检查：`npx tsc --noEmit`
- JSON 文件必须保存为 UTF-8 无 BOM，避免微信开发者工具解析失败

## 高保真还原的默认原则

- 最新原型是唯一视觉基准
- 静态阶段只做视觉和演示级交互
- 页面结构变化时，要同步清理 `model/static.ts`、页面 TS、WXML、Less
- 图标继续走 `image + base64` 方案，详见 `docs/conventions/prototype-to-miniprogram.md`
