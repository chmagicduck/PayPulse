# 状态定义

## 持久化 Key

| key | owner | default | notes |
| --- | --- | --- | --- |
| profile.settings | feature-profile | 基础默认档案 | 保存昵称、生日、工龄、薪资、工作制、上下班时间与午休配置。 |
| profile.avatar | feature-profile | 预设头像 1 | 保存当前头像选择。 |

## Feature 共享状态

| field | type | default | derived_from | notes |
| --- | --- | --- | --- | --- |
| profileSettings | ProfileSettings | 默认档案 | profile.settings | 被首页、日历、战报、岁月坐标复用。 |
| currentAvatar | string | preset-1 | profile.avatar | 仅保存已选头像地址或预设 ID。 |
| rankSummary | RankSummary | 空摘要 | lab.progress | 个人基地只展示，不负责计算等级。 |
| entryLinks | ProfileEntryLink[] | 固定清单 | schema | 控制台入口清单与排序。 |

## 不变量

- `monthlySalary` 必须大于 `0`。
- `payDay` 必须在 `1-31` 范围内。
- `endTime` 必须晚于 `startTime`。
- 启用午休时，`lunchStartTime` 与 `lunchEndTime` 必须落在工作时段内，且结束时间晚于开始时间。
- 个人基地页不直接修改跨 feature 数据，只负责导航和读取摘要。
