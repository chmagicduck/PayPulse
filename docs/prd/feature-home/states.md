# 状态定义

## 持久化 Key

| key | owner | default | notes |
| --- | --- | --- | --- |
| home.daily.session | feature-home | 当日空会话 | 保存当日工作/避风累计时长与最后更新时间。 |
| home.amount.visibility | feature-home | true | 保存首页收益数字是否明文展示。 |

## Feature 共享状态

| field | type | default | derived_from | notes |
| --- | --- | --- | --- | --- |
| dailySession | DailySession | 0 秒 | home.daily.session | 包含 `workSeconds`、`moyuSeconds`、`mode`。 |
| amountVisible | boolean | true | home.amount.visibility | 仅控制显示，不影响计算结果。 |
| paySnapshot | PaySnapshot | 默认档案 | profile.settings | 由档案配置映射出的时薪与作息摘要。 |
| milestonePreview | TimeAxisEntry[] | 空数组 | time.axis.entries | 首页最多展示若干条近期记录。 |
| taskPreview | LabTaskSummary | 空摘要 | lab.progress | 只展示今日任务完成数。 |

## 不变量

- `dailySession.workSeconds` 与 `dailySession.moyuSeconds` 均不得为负数。
- `todayEarned = (workSeconds + moyuSeconds) * secondRate`。
- 手动修正时长只允许写入合法的时分秒值。
- 倒计时逻辑依赖 `profile.settings` 的工作开始与结束时间；缺省时使用默认作息。
