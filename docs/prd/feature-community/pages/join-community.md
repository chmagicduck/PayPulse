---
feature_id: community
page_id: join-community
title_zh: 加入社区
route: features/community/pages/join/index
prototype: docs/prototype/feature-community/page-join-community.ts
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

以单页方式介绍官方社群价值，并承接用户加入社群的核心转化动作。

# 入口条件

| 来源 | 条件 |
| --- | --- |
| 个人基地“加入社区” | 无 |

# 信息结构

| 顺序 | 区块 | 说明 |
| --- | --- | --- |
| 1 | 顶部导航 | 返回、标题和分享入口。 |
| 2 | 英雄头图区 | 展示官方社群定位、口号和统计数据。 |
| 3 | 加群主卡 | 主 CTA 与加入说明。 |
| 4 | 权益说明区 | 展示社群权益卡片。 |

# 状态表

| field | type | default | source | notes |
| --- | --- | --- | --- | --- |
| communityStats | array | 固定值 | schema | 活跃数、心得数、覆盖地区等。 |
| benefitCards | array | 固定值 | schema | 权益说明。 |
| joinEntryStatus | enum | available | schema | 控制 CTA 是否可用。 |
| joinEntryUrl | string | 企业微信群链接 | schema | 当前使用 `https://work.weixin.qq.com/gm/fd6f1bdd86a54ac96a1254f542d23a8e`。 |
| shareStatus | enum | idle | page local | 分享操作反馈，占位即可。 |

# 组件结构

1. `page-shell`
2. 社区头图区
3. 社群加入主卡
4. 权益卡列表
5. 底部导航

# 交互表

| action | condition | state change | UI feedback | persistence |
| --- | --- | --- | --- | --- |
| 点击立即加入 | 入口可用 | 进入官方加群引导流程 | 通过企业微信插件打开官方群入口 | 否 |
| 点击分享 | 平台支持 | 更新 `shareStatus` | 调起 `onShareAppMessage` 或 `onShareTimeline` | 否 |

# 边界情况

- 若当前加群入口不可用，主 CTA 应降级为“查看加入说明”而非不可解释的失效按钮。
- 分享能力不可用时，保留按钮但给出明确提示。
- 页面统计数据缺失时，仍应保留基础文案与主 CTA。
- `app.json` 需提前注册企业微信插件：
  `plugins.materialPlugin.version = "1.0.13"`
  `plugins.materialPlugin.provider = "wx4d2deeab3aed6e5a"`

# 样式约束

- 主 CTA 必须位于首屏可见区域。
- 权益卡使用统一卡片 recipe，不单独发散视觉风格。
- 背景装饰仅增强氛围，不影响主操作的可识别性。

# 验收清单

- [ ] 用户能清楚理解社群价值。
- [ ] 主 CTA 存在明确的加入承载方式或降级方案。
- [ ] 异常情况下仍能提供可执行的说明路径。
- [ ] 页面从个人基地进入路径稳定。
