# CLAUDE.md

本文件只维护仓库代码侧协作信息。
`docs/` 默认禁读，除非用户明确指定要看哪个文档或目录。

## 默认范围

- 优先查看和修改 `miniprogram/`、`scripts/`、`typings/` 和根目录配置文件
- 不主动把 `docs/` 当作默认事实源
- `README.md` 不作为维护入口

## 代码结构

```text
miniprogram/
  features/     按 feature 放页面、model 和局部实现
  components/   共享 UI 组件
  theme/        全局 Less 主题、tokens 和基础样式
  lib/          通用工具、领域函数、平台封装
  store/        应用级状态与启动逻辑
scripts/        脚手架、校验、同步脚本
typings/        小程序类型声明
```

- `miniprogram/features/` 是默认工作区，优先在目标 feature 内闭环修改
- 页面文件、`model.ts`、feature 内 helper 保持就近组织
- 跨 feature 的复用代码再进入 `components/`、`lib/` 或 `theme/`

## 开发约束

- 页面文件直接放在 `miniprogram/features/<feature-id>/`
- 页面层只做视图装配与轻量交互
- 公共逻辑优先沉淀到 feature model、`lib/` 或共享组件
- 新增样式优先复用 `miniprogram/theme/`

## 验证

- 类型检查：`npx tsc --noEmit`
