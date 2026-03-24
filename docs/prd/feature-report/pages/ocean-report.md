---
feature_id: report
page_id: ocean-report
title_zh: 洋流战报
route: features/report/pages/ocean-report/index
prototype: docs/prototype/feature-report/page-ocean-report.ts
status: draft
ui_patterns:
  - page-shell
  - section-title
ui_components:
  - pp-card
  - pp-button
  - pp-nav-bar
storage_keys:
  - report.history.adjustments
---

# 页面目标

为用户提供收益与时长的复盘视角，支持查看趋势、占比、阶段成就，并修正近期历史记录。

# 入口条件

| 来源 | 条件 |
| --- | --- |
| 首页或底部导航“洋流战报” | 无 |
| 个人基地快捷入口 | 无 |

# 信息结构

| 顺序 | 区块 | 说明 |
| --- | --- | --- |
| 1 | 页面头部 | 标题与筛选入口占位。 |
| 2 | 趋势图 | 收益/时长双维度切换的主图表。 |
| 3 | 年度成就 | 展示年度累计收益、天数、排名等摘要。 |
| 4 | 时长占比统计 | 展示不同时间范围的工作/避风占比。 |
| 5 | 近 7 日明细 | 展示日级时长和收益，可进入修正。 |
| 6 | 修正弹层 | 编辑单条历史时长。 |

# 状态表

| field | type | default | source | notes |
| --- | --- | --- | --- | --- |
| activeMetric | enum | income | page local | `income/duration`。 |
| timeRange | enum | week | page local | `day/week/month/year`。 |
| trendSeries | array | 空数组 | derived | 用于趋势图与总计展示。 |
| totalIncome | number | 0 | derived | 当前数据范围总收益。 |
| totalDuration | number | 0 | derived | 当前数据范围总时长。 |
| annualHighlights | object | 空摘要 | derived | 年度概览卡。 |
| ratioStats | object | 空摘要 | derived | 工作/避风占比。 |
| historyDetails | array | 空数组 | report.history.adjustments | 最近 7 日展示源。 |
| editingIndex | number | null | page local | 当前编辑明细索引。 |
| editDurationDraft | object | 0:00:00 | page local | 弹层草稿值。 |
| showEditModal | boolean | false | page local | 控制弹层。 |

# 组件结构

1. `page-shell`
2. 趋势图卡
3. 年度成就卡组
4. 占比环形图卡
5. 历史明细列表
6. 时长修正弹层
7. 底部导航

# 交互表

| action | condition | state change | UI feedback | persistence |
| --- | --- | --- | --- | --- |
| 切换收益/时长 | 无 | 更新 `activeMetric` | 趋势图、总计与颜色切换 | 否 |
| 切换统计范围 | 无 | 更新 `timeRange` | 占比图与标签切换 | 否 |
| 点击历史明细 | 目标记录存在 | 打开修正弹层 | 载入该条时长 | 否 |
| 保存修正时长 | 输入合法 | 更新目标记录时长 | 列表与统计立即刷新 | `report.history.adjustments` |
| 关闭修正弹层 | 无 | 清空草稿并关闭 | 返回列表 | 否 |

# 边界情况

- 无历史记录时，趋势图、成就区和明细区都要展示空状态说明。
- 单条记录被修正为 `00:00:00` 时允许保存，但应保留收益为 `0` 或按规则重算。
- 统计范围切换到无数据范围时，不显示误导性的百分比或趋势涨跌。

# 样式约束

- 收益维度使用蓝/靛系强调，时长维度使用暖色系强调，颜色来自主题语义 token。
- 图表需要兼顾少量数据和横向滚动，不依赖 hover 才能获取关键值。
- 原型中的随机数据与悬浮提示属于展示手法，正式实现需替换为真实聚合数据。

# 验收清单

- [ ] 趋势维度和统计范围切换都能正确刷新展示。
- [ ] 历史修正后，列表与汇总值保持一致。
- [ ] 空状态和零值状态可读。
- [ ] 页面没有重复维护首页的实时会话状态，只消费聚合结果。
