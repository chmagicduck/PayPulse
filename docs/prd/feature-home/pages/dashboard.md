---
feature_id: home
page_id: dashboard
title_zh: 首页
route: features/home/pages/dashboard/index
prototype: docs/prototype/feature-home/page-dashboard.ts
status: draft
ui_patterns:
  - page-shell
  - section-title
ui_components:
  - pp-card
  - pp-button
  - pp-nav-bar
storage_keys:
  - home.daily.session
  - home.amount.visibility
---

# 页面目标

让用户在一个页面内完成当日收益查看、计时操作、近期节点预览和人生进度感知。

# 入口条件

| 来源 | 条件 |
| --- | --- |
| 底部导航默认 tab | 无 |
| 小程序冷启动 | 作为默认首页进入 |

# 信息结构

| 顺序 | 区块 | 说明 |
| --- | --- | --- |
| 1 | 收益总览 | 展示今日累计、时薪换算、月度累计与显示隐藏开关。 |
| 2 | 今日计时控制 | 展示下班倒计时、当前模式、工作/避风时长和修正入口。 |
| 3 | 潮汐任务预览 | 展示今日任务完成数与进度。 |
| 4 | 常规波动 | 展示发薪倒计时与休息日倒计时。 |
| 5 | 岁月坐标预览 | 展示重要日期并进入岁月坐标页。 |
| 6 | 人生航程看板 | 展示工龄、退休倒计时、总航程与余辉等摘要。 |
| 7 | 修正时长弹层 | 编辑避风时长。 |

# 状态表

| field | type | default | source | notes |
| --- | --- | --- | --- | --- |
| workSeconds | number | 0 | home.daily.session | 当日工作累计秒数。 |
| moyuSeconds | number | 0 | home.daily.session | 当日避风累计秒数。 |
| sessionMode | enum | work | home.daily.session | `work` 或 `moyu`。 |
| amountVisible | boolean | true | home.amount.visibility | 控制数字显隐。 |
| todayEarned | number | 0 | derived | 由累计秒数与秒薪计算。 |
| monthlyEarned | number | 0 | derived | 基于档案配置与今日收益估算。 |
| timeLeft | object | 默认空值 | derived | 基于上下班时间计算剩余时长与进度。 |
| taskPreview | object | 空摘要 | lab.progress | 今日任务总数与完成数。 |
| importantDatesPreview | array | 空数组 | time.axis.entries | 展示近期若干条。 |
| lifeJourneySummary | object | 空摘要 | profile.settings | 基于生日、入行日期、退休年龄等计算。 |
| editDurationDraft | object | 0:00:00 | page local | 修正弹层草稿值。 |
| showEditModal | boolean | false | page local | 控制弹层。 |

# 组件结构

1. `page-shell`
2. 收益总览卡
3. 倒计时与计时控制卡
4. 潮汐任务摘要卡
5. 常规波动双卡
6. 岁月坐标列表卡
7. 人生航程四宫格卡组
8. 底部导航
9. 修正时长弹层

# 交互表

| action | condition | state change | UI feedback | persistence |
| --- | --- | --- | --- | --- |
| 点击收益显隐 | 无 | 切换 `amountVisible` | 数字改为明文或掩码 | `home.amount.visibility` |
| 点击“开始/停止避风” | 无 | 切换 `sessionMode` | 主按钮态与计时状态改变 | `home.daily.session` |
| 计时每秒推进 | 页面存活且处于计时态 | 更新对应秒数 | 数字与收益实时刷新 | `home.daily.session` |
| 点击修正入口 | 无 | `showEditModal=true` | 打开底部弹层 | 否 |
| 保存修正时长 | 输入合法 | 更新 `moyuSeconds` | 弹层关闭并刷新统计 | `home.daily.session` |
| 点击“管理全部” | 无 | 跳转岁月坐标页 | 页面跳转 | 否 |
| 点击新增坐标占位入口 | 无 | 跳转岁月坐标页新建态 | 页面跳转 | 否 |

# 边界情况

- 首次使用且缺少档案配置时，页面使用默认薪资与作息占位，并提示尽快补全档案。
- 当当前时间晚于下班时间时，倒计时展示“已离港”类完成态，不再显示负数。
- 岁月坐标为空时，展示空状态入口，不出现空白卡片。
- 当日会话跨日时，需要在进入页面或零点后重置到新的一天。

# 样式约束

- 首页维持高密度摘要卡布局，不改造成表单页。
- 数字类组件使用主题中的强调色与等宽数字风格。
- 自动轮播等级、装饰性 hover 和纯展示动画不作为正式必做项。
- 关键 CTA 使用统一按钮 recipe，避免局部样式分叉。

# 验收清单

- [ ] 收益、倒计时和计时数据能够自洽联动。
- [ ] 收益显隐与时长修正都能落盘。
- [ ] 空状态、跨日状态和下班后状态已处理。
- [ ] 岁月坐标与动力室数据仅做预览，不在首页内复制主数据。
