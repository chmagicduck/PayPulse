# 状态定义

## 持久化 Key

| key | owner | default | notes |
| --- | --- | --- | --- |
| lab.progress | feature-lab | 默认等级进度 | 保存快乐值、日任务完成次数和勋章进度。 |

## Feature 共享状态

| field | type | default | derived_from | notes |
| --- | --- | --- | --- | --- |
| totalHappiness | number | 0 | lab.progress | 累计快乐值。 |
| todayHappiness | number | 0 | lab.progress | 今日获得，跨日清零。 |
| dailyTasks | LabTask[] | 默认任务集 | lab.progress | 包含当前次数与上限。 |
| achievements | Achievement[] | 默认勋章集 | lab.progress | 长周期目标进度。 |
| currentRank | RankSummary | Lv.1 | derived | 由 `totalHappiness` 推导。 |
| selectedRankPreview | number | current rank | page local | 用于查看某一等级节点。 |

## 不变量

- 任务奖励必须为正数。
- `task.count` 不得超过 `task.limit`。
- 每次完成任务时，`totalHappiness` 与 `todayHappiness` 同步增加。
- 日任务次数在本地日期切换到次日时重置，勋章进度不重置。
