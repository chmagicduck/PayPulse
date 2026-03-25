# 数据模型

## 持久化 Key 一览

| key | owner | 默认值 | 写入时机 | 主要读取方 |
| --- | --- | --- | --- | --- |
| `profile.settings` | 航行档案设置 | 基础默认档案 | 用户保存档案时 | 首页、日历、战报、个人基地 |
| `profile.avatar` | 个人基地 | `preset-1` | 用户确认头像时 | 个人基地 |
| `home.daily.session` | 首页 | 当日空会话 | 计时推进、切换模式、修正时长时 | 首页、洋流战报 |
| `home.amount.visibility` | 首页 | `true` | 用户切换收益显隐时 | 首页 |
| `time.axis.entries` | 岁月坐标设置 | 空数组 | 新增、编辑、删除坐标时 | 岁月坐标、首页、日历 |
| `lab.progress` | 动力室 | 默认等级进度 | 完成任务或跨日重置时 | 动力室、个人基地、首页预览 |
| `report.history.adjustments` | 洋流战报 | 空数组 | 保存近 7 日修正时 | 洋流战报 |

## 共享存储结构

### `profile.settings`

| 字段 | 类型 | 默认值 | 约束 |
| --- | --- | --- | --- |
| `nickname` | string | 默认昵称 | 必填 |
| `birthday` | string | 空 | `YYYY-MM-DD` |
| `gender` | enum | `male` | 本版仅 `male/female` |
| `careerStartDate` | string | 空 | `YYYY-MM-DD` |
| `retirementAge` | number | `60` | 正整数 |
| `expectedLifespan` | number | `85` | 正整数且大于退休年龄 |
| `monthlySalary` | number | `0` | 必须大于 `0` |
| `payDay` | number | `10` | `1-31` |
| `workMode` | enum | `double` | `double/single-sat/single-sun/big-small` |
| `isCurrentBigWeek` | boolean | `true` | 仅在 `big-small` 下生效 |
| `startTime` | string | `09:00` | `HH:mm` |
| `endTime` | string | `18:00` | 晚于 `startTime` |
| `lunchBreakEnabled` | boolean | `false` | 控制午休字段显隐 |
| `lunchStartTime` | string | `12:00` | 启用午休后必填 |
| `lunchEndTime` | string | `13:30` | 晚于 `lunchStartTime` |

### `profile.avatar`

| 字段 | 类型 | 默认值 | 约束 |
| --- | --- | --- | --- |
| `avatarId` | string | `preset-1` | 使用预设头像 ID 或受控资源标识 |

### `home.daily.session`

| 字段 | 类型 | 默认值 | 约束 |
| --- | --- | --- | --- |
| `date` | string | 当地今天 | 用于跨日识别 |
| `workSeconds` | number | `0` | 非负整数 |
| `moyuSeconds` | number | `0` | 非负整数 |
| `mode` | enum | `work` | `work/moyu` |
| `lastTickAt` | string | 当前时间 | ISO 时间戳或等价格式 |

### `home.amount.visibility`

| 字段 | 类型 | 默认值 | 约束 |
| --- | --- | --- | --- |
| `visible` | boolean | `true` | 仅影响显示，不影响计算 |

### `time.axis.entries`

| 字段 | 类型 | 默认值 | 约束 |
| --- | --- | --- | --- |
| `id` | string | 自动生成 | 唯一 ID |
| `title` | string | 空 | 必填 |
| `date` | string | 空 | `YYYY-MM-DD` |
| `group` | string | `职场生涯` | 来自受控分组或用户自定义分组 |
| `iconId` | string | `star` | 来自预设图标集 |
| `isAnniversary` | boolean | `true` | 决定提醒口径 |
| `note` | string | 空 | 可选补充信息 |

### `lab.progress`

| 字段 | 类型 | 默认值 | 约束 |
| --- | --- | --- | --- |
| `date` | string | 当地今天 | 用于跨日重置 |
| `totalHappiness` | number | `0` | 非负整数 |
| `todayHappiness` | number | `0` | 非负整数 |
| `dailyTasks` | array | 默认任务集 | `count <= limit` |
| `achievements` | array | 默认勋章集 | 非负进度 |

`dailyTasks[]` 字段要求：

| 字段 | 类型 | 约束 |
| --- | --- | --- |
| `id` | string | 唯一 ID |
| `title` | string | 必填 |
| `reward` | number | 正整数 |
| `count` | number | `0 <= count <= limit` |
| `limit` | number | 正整数 |

### `report.history.adjustments`

| 字段 | 类型 | 默认值 | 约束 |
| --- | --- | --- | --- |
| `date` | string | 空 | 唯一到日粒度 |
| `durationSeconds` | number | `0` | 非负整数 |
| `updatedAt` | string | 当前时间 | 最近修改时间 |

## 派生读模型

### `PaySnapshot`

| 字段 | 来源 | 说明 |
| --- | --- | --- |
| `hourRate` | `profile.settings.monthlySalary` + 作息配置 | 首页和战报统一使用 |
| `secondRate` | `hourRate` | 作为收益换算基础 |
| `monthlyEarned` | `secondRate` + 聚合时长 | 可用于首页和战报摘要 |

### `LifeJourneySummary`

| 字段 | 来源 | 说明 |
| --- | --- | --- |
| `careerYears` | `careerStartDate` | 已航行工龄 |
| `retirementCountdown` | `retirementAge` + `birthday` | 距离退休 |
| `lifespanProgress` | `expectedLifespan` + `birthday` | 总航程与余辉摘要 |

### `CalendarDayMeta`

| 字段 | 来源 | 说明 |
| --- | --- | --- |
| `date` | 月游标 | 某天日期 |
| `status` | 档案 + 节假日预置 | `workday/holiday/weekend/makeup/payday` |
| `tags` | 坐标 + 发薪 + 假期 | 页面展示标签 |

### `RankSummary`

| 字段 | 来源 | 说明 |
| --- | --- | --- |
| `level` | `lab.progress.totalHappiness` | 当前等级 |
| `currentValue` | `lab.progress.totalHappiness` | 当前累计值 |
| `nextThreshold` | 等级配置 | 下一等级门槛 |
| `remainingToNext` | 当前值 + 门槛 | 距下一等级差值 |

### `TaskPreview`

| 字段 | 来源 | 说明 |
| --- | --- | --- |
| `completedCount` | `lab.progress.dailyTasks` | 首页只展示摘要 |
| `totalCount` | `lab.progress.dailyTasks` | 首页只展示摘要 |

### `StorageUsage`

| 字段 | 来源 | 说明 |
| --- | --- | --- |
| `usedMB` | 微信存储 API | 当前已用容量 |
| `capacityMB` | 平台约束 | 本版按 10MB 展示 |
| `usagePercent` | `usedMB / capacityMB` | 数据管理中心展示用 |

## 页面局部状态归属

- 页面局部状态不进入共享存储。
- 局部状态只在页面 PRD 中定义，例如：
  - 首页 `showEditModal`、`editDurationDraft`
  - 战报 `activeMetric`、`timeRange`、`showEditModal`
  - 岁月坐标 `selectedGroup`、`editingId`、`formDraft`
  - 数据中心 `exportStatus`、`showResetModal`

## 数据治理边界

- 数据管理中心不新增自己的业务 key。
- 备份导出应覆盖 1.0.0 正式业务 key。
- 重置默认清空所有正式业务 key，不清理平台基础配置和无关系统字段。
