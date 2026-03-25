# Features 目录

每个 feature 负责自己的页面、静态模型，以及后续正式业务模型。

## 标准结构

- `README.md`
- `public.ts`
- `model.ts`
- `<page>.ts`
- `<page>.wxml`
- `<page>.less`
- `<page>.json`

页面文件需要直接平铺在 feature 根目录，例如：

- `home.ts`
- `home.wxml`
- `home.less`
- `home.json`

## 工作流位置

- 静态还原阶段：以这里的页面文件和 `model.ts` 为事实源
- PRD 阶段：基于这里的静态页面反推出 `docs/prd/<version>/`
- 逻辑开发阶段：优先依据版本 PRD，再回到目标 feature 最小上下文实现

禁止直接引用其他 feature 的内部文件。
