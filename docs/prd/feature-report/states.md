# 状态定义

## 持久化 Key

| key | owner | default | notes |
| --- | --- | --- | --- |
| report.history.adjustments | feature-report | 空数组 | 保存用户对近 7 日避风明细的手动修正结果。 |

## Feature 共享状态

| field | type | default | derived_from | notes |
| --- | --- | --- | --- | --- |
| historyDetails | ReportHistoryItem[] | 空数组 | report.history.adjustments + home.daily.session | 优先展示用户修正后的结果。 |
| activeMetric | enum | income | page local | `income` 或 `duration`。 |
| timeRange | enum | week | page local | `day/week/month/year`。 |
| trendSeries | TrendPoint[] | 空数组 | derived | 由历史记录与档案配置聚合。 |
| annualHighlights | object | 空摘要 | derived | 展示年度累计收益、打卡天数等。 |

## 不变量

- 历史时长修正值必须满足合法的时分秒范围。
- 趋势图与明细列表的数据口径保持一致，均基于同一份历史记录。
- 页面切换查看维度或时间范围不会修改历史数据本身。
