# 状态定义

## 持久化 Key

| key | owner | default | notes |
| --- | --- | --- | --- |
| - | - | - | 当前 feature 无独立持久化 key。 |

## Feature 共享状态

| field | type | default | derived_from | notes |
| --- | --- | --- | --- | --- |
| activeTab | enum | changelog | page local | `changelog/concept`。 |
| releaseNotes | array | 当前版本说明 | schema | 版本信息清单。 |
| conceptCards | array | 固定清单 | schema | 设计理念说明。 |

## 不变量

- 页面至少要展示当前版本号。
- 更新日志与设计理念使用同一套双标签切换，不重复制造多级导航。
