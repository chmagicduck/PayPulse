# 数据模型

## 1. 核心实体

来源：跨页推理 + 闭环假设

```ts
type SourceTag = '页面直接事实' | '跨页推理' | '闭环假设'

interface AppBootstrapState {
  schemaVersion: '1.0.0'
  status: 'needs_setup' | 'ready'
  initializedAt: string | null
  lastResetAt: string | null
}

interface ProfileSettings {
  nickname: string
  birthday: string
  gender: 'male' | 'female'
  careerStartDate: string
  retirementAge: number
  expectedLifespan: number
  monthlySalaryCents: number
  payDay: number
  workMode: 'double' | 'single-sat' | 'single-sun' | 'big-small'
  isCurrentBigWeek: boolean
  startTime: string
  endTime: string
  lunchBreakEnabled: boolean
  lunchStartTime: string | null
  lunchEndTime: string | null
}

interface DailyVoyageRecord {
  date: string
  scheduledWorkDurationSec: number
  moyuDurationSec: number
  manualAdjustmentDurationSec: number
  adjustmentSource: 'none' | 'home' | 'report'
  derivedIncomeCents: number
  calendarStatus: 'workday' | 'weekend' | 'holiday' | 'makeup'
  updatedAt: string
}

interface TimeAxisNotebook {
  id: 'all' | 'commemorative' | 'travel' | 'life' | 'career'
  name: string
  iconId: string
  tone: string
}

interface TimeAxisEntry {
  id: string
  title: string
  date: string
  notebookId: Exclude<TimeAxisNotebook['id'], 'all'>
  isAnniversary: boolean
  createdAt: string
  updatedAt: string
}

interface LabTaskState {
  taskId: string
  count: number
  limit: number
  rewardPoints: number
  updatedAt: string
}

interface AchievementState {
  achievementId: string
  progress: number
  target: number
  completed: boolean
  rewarded: boolean
}

interface LabProgress {
  totalPoints: number
  todayPoints: number
  selectedRankIndex: number
  lastDailyResetDate: string
  tasks: LabTaskState[]
  achievements: AchievementState[]
}

interface DataExportPackage {
  schemaVersion: '1.0.0'
  exportedAt: string
  bootstrap: AppBootstrapState
  settings: ProfileSettings | null
  avatar: string | null
  dailyRecords: DailyVoyageRecord[]
  timeAxisEntries: TimeAxisEntry[]
  labProgress: LabProgress | null
  reportAdjustments: Record<string, number>
  preferences: {
    amountVisible: boolean
  }
}
```

## 2. 字段口径

来源：闭环假设

| 实体 | 字段 | 说明 |
| --- | --- | --- |
| `ProfileSettings` | `monthlySalaryCents` | 正式存储统一用分；页面输入时使用元 |
| `DailyVoyageRecord` | `scheduledWorkDurationSec` | 扣除午休后的计划工作时长 |
| `DailyVoyageRecord` | `moyuDurationSec` | 当天最终有效摸鱼时长 |
| `DailyVoyageRecord` | `manualAdjustmentDurationSec` | 手动修正写入的最终值，单位秒 |
| `DailyVoyageRecord` | `adjustmentSource` | 最近一次修正来源，便于回溯页面行为 |
| `TimeAxisEntry` | `isAnniversary` | 是否按下一次周年日派生倒计时 |
| `LabProgress` | `lastDailyResetDate` | 用于判断是否需要日切重置 |
| `DataExportPackage` | `reportAdjustments` | 以日期为键记录历史修正值 |

## 3. 派生关系

来源：跨页推理

- 首页收益卡 <- 当日 `DailyVoyageRecord`
- 首页常规波动 <- `ProfileSettings` + 日历规则
- 首页岁月坐标 <- `TimeAxisEntry`
- 首页人生航程 <- `ProfileSettings`
- 战报趋势图 <- 最近 30 条 `DailyVoyageRecord`
- 战报近 5 日列表 <- 最近 5 条 `DailyVoyageRecord`
- 战报占比卡 <- 不同时间范围聚合后的 `DailyVoyageRecord`
- 日历页 <- `ProfileSettings` + 官方节假日数据 + `TimeAxisEntry`
- 个人页累计摸鱼打卡 <- `DailyVoyageRecord` 中 `moyuDurationSec > 0` 的自然日计数
- 动力舱成就 <- `LabProgress` + `DailyVoyageRecord`

## 4. 持久化 key

来源：页面直接事实 + 闭环假设

| Key | 用途 | 说明 |
| --- | --- | --- |
| `app.bootstrap.state` | 启动门禁 | 新增 key，承载是否完成初始化 |
| `profile.settings` | 用户设置 | 已存在 |
| `profile.avatar` | 头像 | 已存在 |
| `home.daily.session` | 每日记录 | 现有 key 名沿用，但正式承载 `DailyVoyageRecord[]` 或日期索引 |
| `home.amount.visibility` | 首页金额可见性 | 已存在 |
| `lab.progress` | 动力舱进度 | 已存在 |
| `time.axis.entries` | 时间轴事件 | 已存在 |
| `report.history.adjustments` | 历史修正映射 | 已存在 |

## 5. 初始化默认值

来源：闭环假设

- `AppBootstrapState` 默认视为不存在，等价于 `needs_setup`
- 头像默认取第一个预设头像
- `TimeAxisNotebook` 为系统常量，不持久化
- 初始化后生成当月骨架 `DailyVoyageRecord`
- 初始化后生成 3 条默认时间轴事件
- 初始化后 `LabProgress.totalPoints = 0`、`todayPoints = 0`

## 6. 约束与边界

来源：闭环假设

- 日期统一使用本地时区 `YYYY-MM-DD`
- 时间统一使用 `HH:mm`
- 金额存储统一使用分，展示统一保留两位小数
- 时长存储统一使用秒，展示统一格式化为 `HH:mm:ss`
- 所有正式持久化结构必须兼容导出包恢复
