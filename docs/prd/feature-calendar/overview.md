---
feature_id: calendar
title_zh: 日历
status: draft
---

# 功能目标

日历页负责以月视图方式展示工作日、休息日、补班日与发薪日，让用户快速理解当前月的节奏与关键日期。

# 页面清单

| page_id | route | prototype |
| --- | --- | --- |
| calendar | features/calendar/pages/calendar/index | docs/prototype/feature-calendar/page-calendar.ts |

# 共享领域概念

| 名词 | 说明 |
| --- | --- |
| 日历状态 | 某日对应的普通工作、法定节假日、周末休息、补班、发薪等类型。 |
| 选中日期详情 | 当前选中日期的状态说明和行动提示。 |
| 月游标 | 当前展示年月。 |

# 共享组件

- 月切换头部
- 日历网格
- 状态图例
- 日期详情卡
