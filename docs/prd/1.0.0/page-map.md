# 页面地图

## 启动与路由总览

来源：跨页推理

| 页面 | 路由 | 类型 | 直接入口 | 前置条件 | 核心依赖 |
| --- | --- | --- | --- | --- | --- |
| 首页 | `features/home/dashboard` | tab | 默认 tab / 设置保存后落地页 | `AppBootstrapState.status = ready` | `ProfileSettings`、`DailyVoyageRecord`、`TimeAxisEntry`、`LabProgress` |
| 战报页 | `features/report/ocean-report` | tab | tab 切换 | 已初始化 | `DailyVoyageRecord`、`ReportViewState` |
| 动力舱 | `features/lab/lab` | tab | tab 切换 | 已初始化 | `LabProgress`、`DailyVoyageRecord` |
| 个人基地 | `features/profile/home` | tab | tab 切换 | 已初始化 | `ProfileSettings`、`ProfileAvatar`、摘要指标 |
| 档案设置 | `features/profile-settings/settings` | page | 首次启动、重置后强制进入、个人页入口 | 无 | `ProfileSettings`、`AppBootstrapState` |
| 时间轴设置 | `features/time-axis/time-axis-settings` | page | 个人页入口 | 已初始化 | `TimeAxisEntry`、系统 notebooks |
| 日历 | `features/calendar/calendar` | page | 个人页入口、首页入口 | 已初始化 | `ProfileSettings`、`TimeAxisEntry`、节假日规则 |
| 加入社区 | `features/community/join` | page | 个人页入口 | 已初始化 | 无核心业务依赖 |
| 关于软件 | `features/about/about` | page | 个人页入口 | 已初始化 | 版本信息 |
| 数据管理中心 | `features/data-center/data-center` | page | 个人页入口 | 已初始化 | 全部持久化数据 |

## 有效启动规则

来源：闭环假设

- 虽然 `app.json` 注册的首页是 `features/home/dashboard`，但运行时必须先检查 `AppBootstrapState`
- 当启动状态缺失或状态为 `needs_setup` 时，应用应立即重定向到 `features/profile-settings/settings`
- 只有设置保存成功并完成初始化后，才允许进入首页或其他 tab

## 关键跳转链

来源：页面直接事实 + 跨页推理

- 个人基地 -> 档案设置 / 时间轴设置 / 日历 / 社区 / 关于 / 数据中心
- 首页 -> 时间修正弹层
- 战报页 -> 历史记录修正弹层
- 数据中心 -> 导出 / 清空数据
- 清空数据完成 -> 设置页

## 页面依赖说明

来源：跨页推理

- 首页和战报页共用 `DailyVoyageRecord`，不能各自维护一套时长数据
- 首页的重要日期、日历提醒与时间轴页面共用 `TimeAxisEntry`
- 档案设置页是所有计算口径的上游输入源
- 动力舱虽然有独立任务体系，但成就进度会读取每日记录或任务日志
