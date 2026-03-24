# 状态定义

## 持久化 Key

| key | owner | default | notes |
| --- | --- | --- | --- |
| time.axis.entries | feature-time-axis | 空数组 | 保存全部坐标条目。 |

## Feature 共享状态

| field | type | default | derived_from | notes |
| --- | --- | --- | --- | --- |
| entries | TimeAxisEntry[] | 空数组 | time.axis.entries | 供首页、日历等页面读取。 |
| selectedGroup | string | 全部 | page local | 控制筛选。 |
| editingEntry | TimeAxisEntry \| null | null | page local | 当前编辑项。 |
| formDraft | object | 默认空草稿 | page local | 编辑抽屉草稿。 |

## 不变量

- 坐标条目至少包含 `title`、`date`、`type`、`group`、`iconId`。
- `isAnniversary=true` 时按周年逻辑计算剩余天数。
- `isAnniversary=false` 时允许展示已过天数。
- 农历类型先按原始输入保存；正式换算能力可在后续实现中补充。
