---
feature_id: about
page_id: about
title_zh: 关于软件
route: features/about/pages/about/index
prototype: docs/prototype/feature-about/page-about.ts
status: draft
ui_patterns:
  - page-shell
  - section-title
ui_components:
  - pp-card
  - pp-button
  - pp-nav-bar
storage_keys: []
---

# 页面目标

向用户清晰介绍产品品牌、当前版本、更新历史和设计理念，增强信任感与产品理解。

# 入口条件

| 来源 | 条件 |
| --- | --- |
| 个人基地“关于软件” | 无 |

# 信息结构

| 顺序 | 区块 | 说明 |
| --- | --- | --- |
| 1 | 顶部导航 | 返回与标题。 |
| 2 | 品牌头图区 | Logo、产品名、口号、版本和能力标签。 |
| 3 | 标签切换区 | 在更新日志与设计理念之间切换。 |
| 4 | 内容区 | 更新日志时间线或理念卡片。 |
| 5 | 页尾版权区 | 展示版权和品牌归属。 |

# 状态表

| field | type | default | source | notes |
| --- | --- | --- | --- | --- |
| activeTab | enum | changelog | page local | 双标签切换。 |
| releaseNotes | array | 当前版本清单 | schema | 更新日志数据源。 |
| conceptCards | array | 固定清单 | schema | 理念说明数据源。 |
| currentVersion | string | 1.0.0 | schema | 展示于头图区。 |

# 组件结构

1. `page-shell`
2. 品牌头图卡
3. 双标签切换条
4. 更新日志时间线
5. 理念说明卡组
6. 页尾版权区

# 交互表

| action | condition | state change | UI feedback | persistence |
| --- | --- | --- | --- | --- |
| 点击“更新日志” | 当前不在该标签 | `activeTab=changelog` | 显示时间线内容 | 否 |
| 点击“设计理念” | 当前不在该标签 | `activeTab=concept` | 显示理念卡片 | 否 |

# 边界情况

- 若更新日志仅有当前版本，也要完整展示版本、日期和摘要。
- 若某一标签下暂无内容，需要展示占位说明而不是空白区域。
- 版本号更新时，头图区和更新日志首条需保持一致。

# 样式约束

- 品牌头图区允许更强的品牌表达，但仍使用主题 token 管理颜色和圆角。
- 标签切换条与内容区之间保持明显层级，不做多层 tab 嵌套。
- 时间线与理念卡在移动端都应单列可读。

# 验收清单

- [ ] 头图区、标签切换和内容区都可正常展示。
- [ ] 两个标签切换流畅且内容正确。
- [ ] 当前版本号与日志首条一致。
- [ ] 空内容和单版本场景已处理。
