---
feature_id: example-feature
page_id: example-page
title_zh: 示例页面
route: features/example-feature/pages/example-page/index
prototype: docs/prototype/feature-example/page-example-page.ts
status: draft
ui_patterns:
  - page-shell
ui_components:
  - pp-card
storage_keys: []
---

# 页面目标

说明该页面存在的业务目的。

# 入口条件

说明页面从哪里进入，是否有前置条件。

# 信息结构

按视觉顺序列出页面区块。

# 状态表

| field | type | default | source | notes |
| --- | --- | --- | --- | --- |

# 组件结构

1. page-shell
2. 页面业务区块

# 交互表

| action | condition | state change | UI feedback | persistence |
| --- | --- | --- | --- | --- |

# 边界情况

- 首次使用
- 空状态
- 被中断流程

# 样式约束

- 推荐 token
- 允许的组件变体
- 禁止的局部覆盖方式
