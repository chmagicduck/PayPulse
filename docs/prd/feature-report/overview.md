---
feature_id: report
title_zh: 洋流战报
status: draft
---

# 功能目标

洋流战报负责以图表和统计卡的形式展示收益与时长趋势，并允许用户修正近 7 日避风明细，形成复盘入口。

# 页面清单

| page_id | route | prototype |
| --- | --- | --- |
| ocean-report | features/report/pages/ocean-report/index | docs/prototype/feature-report/page-ocean-report.ts |

# 共享领域概念

| 名词 | 说明 |
| --- | --- |
| 趋势指标 | 收益与时长两类查看维度。 |
| 时间范围 | 日、周、月、年四种统计范围。 |
| 近 7 日明细 | 最近若干天的避风时长与对应收益。 |
| 年度成就 | 对累计收益、天数、排名等摘要指标的展示。 |

# 共享组件

- 趋势图卡
- 统计数字卡
- 占比图卡
- 历史明细列表项
- 时长修正弹层
