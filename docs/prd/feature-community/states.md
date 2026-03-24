# 状态定义

## 持久化 Key

| key | owner | default | notes |
| --- | --- | --- | --- |
| - | - | - | 当前 feature 无独立持久化 key。 |

## Feature 共享状态

| field | type | default | derived_from | notes |
| --- | --- | --- | --- | --- |
| communityStats | array | 固定展示数据 | schema | 展示活跃用户、心得数量等。 |
| benefitCards | array | 固定权益清单 | schema | 展示加入社群的价值。 |
| joinEntryStatus | enum | available | schema | 控制加入入口是否可点击。 |

## 不变量

- 社区页必须指向官方入口，不得跳转到未审核的第三方地址。
- 统计数据属于展示内容，可由运营维护，但不参与业务计算。
