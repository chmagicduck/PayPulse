---
feature_id: data-center
page_id: data-center
title_zh: 数据管理中心
route: features/data-center/pages/data-center/index
prototype: docs/prototype/feature-data-center/page-data-center.ts
status: draft
ui_patterns:
  - page-shell
  - section-title
ui_components:
  - pp-card
  - pp-button
storage_keys: []
---

# 页面目标

提供数据查看、导出和清理入口，帮助用户理解本地数据占用并安全执行敏感操作。

# 入口条件

| 来源 | 条件 |
| --- | --- |
| 个人基地“数据管理中心” | 无 |

# 信息结构

| 顺序 | 区块 | 说明 |
| --- | --- | --- |
| 1 | 顶部导航 | 返回与标题。 |
| 2 | 存储指标 | 本地空间、占比和云端同步占位。 |
| 3 | 核心操作 | 导出备份、重置所有数据。 |
| 4 | 风险提示 | 说明本地优先与不可撤销性。 |
| 5 | 重置确认弹层 | 二次确认危险操作。 |

# 状态表

| field | type | default | source | notes |
| --- | --- | --- | --- | --- |
| storageUsage.usedMB | number | 0 | derived | 实时读取。 |
| storageUsage.capacityMB | number | 10 | derived | 小程序容量上限。 |
| exportStatus | enum | idle | page local | 控制按钮文案与图标。 |
| showResetModal | boolean | false | page local | 控制确认弹层。 |
| syncCapabilityStatus | enum | planned | schema | 仅展示“敬请期待”。 |

# 组件结构

1. `page-shell`
2. 本地存储指标卡
3. 云端同步占位卡
4. 操作列表卡
5. 风险提示卡
6. 重置确认弹层

# 交互表

| action | condition | state change | UI feedback | persistence |
| --- | --- | --- | --- | --- |
| 点击导出备份 | 当前未导出中 | `exportStatus=exporting` | 显示处理中态 | 否 |
| 导出完成 | 导出成功 | `exportStatus=success` | 成功提示“备份 JSON 已复制到剪切板” | 否 |
| 导出失败 | 异常 | `exportStatus=failure` | 错误提示 | 否 |
| 点击重置所有数据 | 无 | `showResetModal=true` | 打开确认弹层 | 否 |
| 取消重置 | 弹层已开 | `showResetModal=false` | 关闭弹层 | 否 |
| 确认重置 | 用户二次确认 | 清空业务存储 | 数据归零并关闭弹层 | 全局存储 |

# 边界情况

- 无可导出数据时仍允许导出，但备份内容应为空对象或空集合。
- 本轮导出形式固定为复制 JSON 文本，不生成下载文件。
- 重置过程中若部分 key 删除失败，必须返回失败提示，不得误报成功。
- 云端同步入口在本轮仅展示占位文案，不触发真实网络流程。

# 样式约束

- 危险操作统一使用风险色，并与普通备份动作保持明显区分。
- 存储占比卡使用主题语义色，避免把系统容量信息写成业务硬编码样式。
- 确认弹层遵循统一的弹层结构和按钮层级。

# 验收清单

- [ ] 存储占用数据可读且数值自洽。
- [ ] 导出有完整状态反馈。
- [ ] 重置必须经过确认，且执行后能清空业务数据。
- [ ] 占位中的云端同步不误导为可用功能。
