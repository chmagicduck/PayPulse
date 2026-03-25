# 页面地图

## 页面路由与原型映射

| 页面 | route | prototype | 主要入口 |
| --- | --- | --- | --- |
| 首页 | `features/home/pages/dashboard` | `docs/prototype/1.0.0/features.home.pages.dashboard.ts` | 默认 tab、冷启动 |
| 日历 | `features/calendar/pages/calendar` | `docs/prototype/1.0.0/features.calendar.pages.calendar.ts` | 个人基地、首页/岁月坐标日期入口 |
| 洋流战报 | `features/report/pages/ocean-report` | `docs/prototype/1.0.0/features.report.pages.ocean-report.ts` | 首页、底部导航、个人基地 |
| 动力室 | `features/lab/pages/lab` | `docs/prototype/1.0.0/features.lab.pages.lab.ts` | 个人基地、首页任务预览、底部导航 |
| 个人基地 | `features/profile/pages/home` | `docs/prototype/1.0.0/features.profile.pages.home.ts` | 底部导航 |
| 航行档案设置 | `features/profile-settings/pages/settings` | `docs/prototype/1.0.0/features.profile-settings.pages.settings.ts` | 个人基地、首次引导 |
| 岁月坐标设置 | `features/time-axis/pages/time-axis-settings` | `docs/prototype/1.0.0/features.time-axis.pages.time-axis-settings.ts` | 个人基地、首页管理全部/新增坐标 |
| 数据管理中心 | `features/data-center/pages/data-center` | `docs/prototype/1.0.0/features.data-center.pages.data-center.ts` | 个人基地 |
| 加入社区 | `features/community/pages/join` | `docs/prototype/1.0.0/features.community.pages.join.ts` | 个人基地 |
| 关于软件 | `features/about/pages/about` | `docs/prototype/1.0.0/features.about.pages.about.ts` | 个人基地 |

## 主路径流转

```text
冷启动
-> 首页
-> 个人基地
-> 航行档案设置 / 岁月坐标设置 / 日历 / 动力室 / 数据管理中心 / 加入社区 / 关于软件
```

```text
首页
-> 洋流战报
-> 动力室
-> 岁月坐标设置
-> 日历
```

## 共享依赖关系

| 页面 | 读取 | 写入 |
| --- | --- | --- |
| 首页 | `profile.settings`、`lab.progress`、`time.axis.entries` | `home.daily.session`、`home.amount.visibility` |
| 日历 | `profile.settings`、`time.axis.entries`、节假日预置 | 无 |
| 洋流战报 | `profile.settings`、`home.daily.session`、`report.history.adjustments` | `report.history.adjustments` |
| 动力室 | `lab.progress` | `lab.progress` |
| 个人基地 | `profile.settings`、`profile.avatar`、`lab.progress` | `profile.avatar` |
| 航行档案设置 | `profile.settings` | `profile.settings` |
| 岁月坐标设置 | `time.axis.entries` | `time.axis.entries` |
| 数据管理中心 | 全部正式业务 key | 通过导出/重置影响全部正式业务 key |
| 加入社区 | 固定 schema | 无 |
| 关于软件 | 固定 schema | 无 |

## 页面间责任边界

- 首页只预览岁月坐标和任务摘要，不在首页维护完整列表。
- 个人基地只承接导航和摘要展示，不修改其他 feature 的业务内容。
- 日历只消费档案与日期事实源，不拥有独立业务 key。
- 数据管理中心统一负责导出与重置，不分散到其他页面实现。
