# PRD 目录

新的 PRD 统一使用目录式版本文档：

- `docs/prd/<version>/README.md`

例如：

- `docs/prd/1.0.0/README.md`

## 当前约定

- 一个版本对应一个 PRD 目录
- 版本目录至少包含 `README.md`、`overview.md`、`glossary.md`、`domain-model.md`、`data-model.md`、`page-map.md`、`acceptance.md` 和 `pages/*.md`
- 共享业务规则只写一次，统一放 `domain-model.md`
- 共享数据结构只写一次，统一放 `data-model.md`
- 页面文档只写页面目标、信息结构、交互、页面局部状态和验收点
- `feature-*` 目录中的旧 PRD 已废弃，不再继续沿用
