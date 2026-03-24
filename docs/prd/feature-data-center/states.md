# 状态定义

## 持久化 Key

| key | owner | default | notes |
| --- | --- | --- | --- |
| - | - | - | 数据管理中心不新增业务持久化 key，直接读取和操作全局存储。 |

## Feature 共享状态

| field | type | default | derived_from | notes |
| --- | --- | --- | --- | --- |
| storageUsage | object | 0 MB | derived | 由微信存储 API 获取。 |
| exportStatus | enum | idle | page local | `idle/exporting/success/failure`。 |
| showResetModal | boolean | false | page local | 控制危险操作确认。 |
| syncCapabilityStatus | enum | planned | schema | 云端同步能力占位。 |

## 不变量

- 重置操作必须经过二次确认。
- 导出成功或失败都不能影响原始业务数据。
- 本轮仅支持本地数据治理，不引入真实云端同步流程。
