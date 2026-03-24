---
feature_id: lab
page_id: lab
title_zh: 动力室
route: features/lab/pages/lab/index
prototype: docs/prototype/feature-lab/page-lab.ts
status: draft
ui_patterns:
  - page-shell
  - section-title
ui_components:
  - pp-card
  - pp-button
  - pp-nav-bar
storage_keys:
  - lab.progress
---

# 页面目标

通过等级、任务与勋章反馈增强用户的持续使用动力，并向其他页面输出统一的成长摘要。

# 入口条件

| 来源 | 条件 |
| --- | --- |
| 个人基地“任务中心设置” | 无 |
| 底部导航或首页任务预览 | 无 |

# 信息结构

| 顺序 | 区块 | 说明 |
| --- | --- | --- |
| 1 | 顶部栏 | 标题与等级预览开关。 |
| 2 | 等级进度卡 | 展示当前等级、今日快乐值、累计值、下一等级距离。 |
| 3 | 日常巡航任务 | 展示任务列表、奖励和完成进度。 |
| 4 | 荣誉勋章 | 展示长周期目标与完成度。 |

# 状态表

| field | type | default | source | notes |
| --- | --- | --- | --- | --- |
| totalHappiness | number | 0 | lab.progress | 累计值。 |
| todayHappiness | number | 0 | lab.progress | 今日值。 |
| dailyTasks | array | 默认任务集 | lab.progress | 包含奖励、次数和上限。 |
| achievements | array | 默认勋章集 | lab.progress | 勋章进度。 |
| currentRank | object | Lv.1 | derived | 由累计快乐值推导。 |
| nextRank | object | null | derived | 用于显示升级差值。 |
| selectedRankPreview | number | current rank | page local | 点击等级节点时切换。 |
| previewModeEnabled | boolean | false | page local | 是否展示等级路线预览。 |

# 组件结构

1. `page-shell`
2. 等级进度卡
3. 等级节点预览条
4. 日任务列表
5. 勋章列表
6. 底部导航

# 交互表

| action | condition | state change | UI feedback | persistence |
| --- | --- | --- | --- | --- |
| 点击任务卡 | `count < limit` | 任务次数 +1，快乐值累加 | 进度条与数字刷新 | `lab.progress` |
| 点击任务卡 | `count >= limit` | 无 | 展示已达上限态 | 否 |
| 点击等级节点 | 节点存在 | 更新 `selectedRankPreview` | 切换预览焦点 | 否 |
| 切换预览开关 | 无 | 更新 `previewModeEnabled` | 开关态改变 | 否 |

# 边界情况

- 所有任务都达到上限时，仍保留列表但显示已完成态。
- 已到最高等级时，不再显示下一等级距离。
- 跨日进入页面时，需要先重置日任务次数和 `todayHappiness`，再渲染页面。

# 样式约束

- 等级进度卡是页面视觉焦点，使用主题强调色，但不引入纯原型演示动画作为必需逻辑。
- 任务卡与勋章卡采用统一卡片 recipe，避免局部样式分裂。
- 奖励值、进度值等核心数字使用等宽数字样式。

# 验收清单

- [ ] 任务完成会增加快乐值并更新等级摘要。
- [ ] 等级与下一等级距离计算正确。
- [ ] 最高等级、全任务完成和跨日重置场景已处理。
- [ ] 个人基地读取到的等级摘要与动力室一致。
