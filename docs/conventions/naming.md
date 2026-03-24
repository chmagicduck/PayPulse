# 命名规范

## ID 规范

- feature id：使用 kebab-case，例如 `time-axis`
- page id：使用 kebab-case，例如 `join-community`
- storage key：使用 dot.case，例如 `profile.settings`

## 文件命名

- 页面原型：`page-<page-id>.ts`
- 页面 PRD：`<page-id>.md`
- feature 公共出口：`public.ts`
- feature 文档入口：`README.md`

## 目录命名

- `docs/` 下的 feature 目录：`feature-<feature-id>`
- `miniprogram/features/` 下的 feature 目录：`<feature-id>`

## 避免

- 在稳定文件 ID 中使用中文括号与中文标点
- 用 `utils.ts` 承载多个不相关职责
- 使用 `index2.ts`、`new.ts`、`temp.ts` 这类无语义命名
