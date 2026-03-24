---
feature_id: time-axis
title_zh: 岁月坐标
status: draft
---

# 功能目标

岁月坐标用于维护重要日期、纪念日与里程碑，支持分组筛选、增删改查和周年提醒，是全局日期类内容的事实源。V1 仅支持公历录入。

# 页面清单

| page_id | route | prototype |
| --- | --- | --- |
| time-axis-settings | features/time-axis/pages/time-axis-settings/index | docs/prototype/feature-time-axis/page-time-axis-settings.ts |

# 共享领域概念

| 名词 | 说明 |
| --- | --- |
| 坐标条目 | 一条重要日期记录，含标题、日期、分组、图标和提醒模式。 |
| 周年提醒 | 以每年重复的方式提醒同一日期。 |
| 普通倒计时 | 只针对某个固定日期，允许显示已过天数。 |
| 分组筛选 | 全部、职场生涯、财富增长、生活印记、自定义等分类。 |

# 共享组件

- 坐标列表项
- 分组筛选条
- 坐标编辑抽屉
- 图标选择器
