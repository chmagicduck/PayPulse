---
feature_id: time-axis
page_id: time-axis-settings
title_zh: 岁月坐标设置
route: features/time-axis/pages/time-axis-settings/index
prototype: docs/prototype/feature-time-axis/page-time-axis-settings.ts
status: draft
ui_patterns:
  - page-shell
  - section-title
ui_components:
  - pp-card
  - pp-button
storage_keys:
  - time.axis.entries
---

# 页面目标

集中管理重要日期记录，使首页、日历等页面能够消费统一、可维护的时间节点数据。

# 入口条件

| 来源 | 条件 |
| --- | --- |
| 个人基地“岁月坐标设置” | 无 |
| 首页“管理全部/新增坐标” | 无 |

# 信息结构

| 顺序 | 区块 | 说明 |
| --- | --- | --- |
| 1 | 顶部导航 | 返回、标题与新增入口。 |
| 2 | 分组筛选条 | 切换全部或某个分类。 |
| 3 | 坐标列表 | 展示图标、标题、日期、历法、剩余天数和分组。 |
| 4 | 空状态 | 当前筛选下无条目时展示。 |
| 5 | 编辑抽屉 | 新增/编辑条目。 |

# 状态表

| field | type | default | source | notes |
| --- | --- | --- | --- | --- |
| entries | array | 空数组 | time.axis.entries | 全量数据源。 |
| selectedGroup | string | 全部 | page local | 切换筛选维度。 |
| filteredEntries | array | 空数组 | derived | 由 `entries + selectedGroup` 计算。 |
| isModalOpen | boolean | false | page local | 控制编辑抽屉。 |
| editingId | string \| null | null | page local | 当前编辑条目 ID。 |
| formData.title | string | 空 | page local | 必填。 |
| formData.date | string | 空 | page local | 必填。 |
| formData.group | string | 职场生涯 | page local | 分类。 |
| formData.isAnniversary | boolean | true | page local | 周年提醒模式。 |
| formData.iconId | string | star | page local | 预设图标。 |

# 组件结构

1. `page-shell`
2. 顶部操作栏
3. 分组筛选条
4. 坐标列表项
5. 空状态卡
6. 编辑抽屉

# 交互表

| action | condition | state change | UI feedback | persistence |
| --- | --- | --- | --- | --- |
| 点击分组 | 无 | 更新 `selectedGroup` | 列表过滤结果变化 | 否 |
| 点击新增 | 无 | 打开抽屉并重置草稿 | 进入新建态 | 否 |
| 点击列表项 | 条目存在 | 载入条目到草稿并打开抽屉 | 进入编辑态 | 否 |
| 修改草稿字段 | 无 | 更新 `formData` | 表单回显 | 否 |
| 保存条目 | 标题和日期合法 | 写入/更新 `entries` | 关闭抽屉并刷新列表 | `time.axis.entries` |
| 删除条目 | 编辑态 | 从 `entries` 删除 | 列表移除该项 | `time.axis.entries` |
| 关闭抽屉 | 无 | 清空草稿 | 返回列表 | 否 |

# 边界情况

- 当前筛选分组下无数据时，展示空状态和新增入口。
- 标题或日期为空时禁止保存。
- `isAnniversary=false` 且日期已过时，列表需明确显示“已过 N 天”而非负数。
- V1 移除农历选项，所有日期都按公历保存与展示。

# 样式约束

- 编辑抽屉采用底部弹出模式，与首页/战报修正弹层的交互节奏保持一致。
- 图标选择器与分类选择器必须有显著选中态。
- 列表项中的天数强调色由状态驱动，不允许使用零散内联业务色。

# 验收清单

- [ ] 新增、编辑、删除流程完整。
- [ ] 分组筛选与列表结果一致。
- [ ] 周年提醒和普通倒计时文案口径正确。
- [ ] 数据保存后能被首页和日历读取。
