# 状态定义

## 持久化 Key

| key | owner | default | notes |
| --- | --- | --- | --- |
| - | - | - | 当前 feature 无独立持久化 key，日历展示以档案配置和派生规则为主。 |

## Feature 共享状态

| field | type | default | derived_from | notes |
| --- | --- | --- | --- | --- |
| monthCursor | string | 当前月 | page local | 控制月视图翻页。 |
| selectedDate | string | 今天 | page local | 控制详情区展示。 |
| calendarMeta | CalendarDayMeta[] | 空数组 | profile.settings + time.axis.entries + holidayPreset2026 | 推导发薪日、休息日、节假日等。 |
| reminderSummary | object | 空摘要 | derived | 底部提示区的下一关键日提示。 |

## 不变量

- 发薪日由 `profile.settings.payDay` 推导，跨月时自动取该月合法日期。
- 工作制决定周末/大小周的工作与休息标记口径。
- 2026 年法定节假日与调休日期由本地预置常量驱动，不在页面内硬编码。
- 选中日期必须始终落在当前月可见日期范围内。
