---
feature_id: calendar
page_id: calendar
title_zh: 日历
route: features/calendar/pages/calendar/index
prototype: docs/prototype/feature-calendar/page-calendar.ts
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

用月视图帮助用户查看发薪日、休息日、补班与节假日，并通过日期详情强化当前月节奏感知。

# 入口条件

| 来源 | 条件 |
| --- | --- |
| 个人基地“查看日历” | 无 |
| 岁月坐标或首页的日期入口 | 可带选中日期进入 |

# 信息结构

| 顺序 | 区块 | 说明 |
| --- | --- | --- |
| 1 | 顶部导航 | 返回与标题。 |
| 2 | 月份切换区 | 展示当前年月并支持翻页。 |
| 3 | 日历卡片 | 周标题、日期网格和图例。 |
| 4 | 选中日期详情 | 展示当前选中日的状态说明。 |
| 5 | 下一关键日提醒 | 展示距离下一发薪日或关键节点的提示。 |

# 状态表

| field | type | default | source | notes |
| --- | --- | --- | --- | --- |
| monthCursor | string | 当前月 | page local | 格式建议 `YYYY-MM`。 |
| selectedDate | string | 今天 | page local | 当前详情区对应日期。 |
| calendarMeta | array | 空数组 | derived | 日历网格显示源。 |
| dayStatus | enum | workday | derived | `workday/holiday/weekend/makeup/payday`。 |
| selectedDayDetail | object | 空摘要 | derived | 由 `selectedDate` 映射。 |
| nextReminder | object | 空摘要 | derived | 底部提示文案。 |

# 组件结构

1. `page-shell`
2. 月切换头部
3. 日历卡片
4. 图例组
5. 详情说明卡
6. 底部导航

# 交互表

| action | condition | state change | UI feedback | persistence |
| --- | --- | --- | --- | --- |
| 点击上一个月 | 无 | 更新 `monthCursor` | 网格与标题切换 | 否 |
| 点击下一个月 | 无 | 更新 `monthCursor` | 网格与标题切换 | 否 |
| 点击具体日期 | 日期可选 | 更新 `selectedDate` | 高亮选中态并刷新详情 | 否 |
| 从其他页面带日期进入 | 入参合法 | 设置 `monthCursor/selectedDate` | 直接定位到目标日期 | 否 |

# 边界情况

- 当前月没有节假日或补班配置时，仅展示普通工作日和发薪日逻辑。
- 当 `payDay` 大于当月天数时，发薪日取当月最后一天。
- 若用户尚未完成档案设置，则使用默认工作制与发薪日生成基础日历。

# 样式约束

- 月份切换区与日历卡片使用统一卡片边界和圆角。
- 状态图例与网格颜色使用主题语义 token，不在页面中写散乱状态色。
- 日期状态需在无 hover 条件下可识别，兼容移动端触摸环境。

# 验收清单

- [ ] 月份切换正确。
- [ ] 选中态与详情卡同步更新。
- [ ] 发薪日、休息日、补班日与节假日有清晰区分。
- [ ] 默认配置与异常月份边界都可稳定显示。
