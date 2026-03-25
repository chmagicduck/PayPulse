# PRD 目录

新的 PRD 统一使用目录式版本文档：

- `docs/prd/<version>/README.md`

例如：

- `docs/prd/1.0.0/README.md`

## 当前约定

- 一个版本对应一个 PRD 目录
- PRD 的主事实源是 `miniprogram/features/` 下已经完成的静态页面
- 原型只在静态页事实不足时作为补充
- 共享业务规则只写一次，统一放 `domain-model.md`
- 共享数据结构只写一次，统一放 `data-model.md`
- 页面文档只写页面目标、信息结构、交互、页面局部状态和验收点
- 所有关键结论都要区分 `页面直接事实`、`跨页推理`、`闭环假设`
