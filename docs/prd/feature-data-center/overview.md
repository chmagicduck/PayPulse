---
feature_id: data-center
title_zh: 数据管理中心
status: draft
---

# 功能目标

数据管理中心用于汇总本地存储占用、提供备份导出能力，并承载危险操作的确认流程，是隐私与数据治理入口。

# 页面清单

| page_id | route | prototype |
| --- | --- | --- |
| data-center | features/data-center/pages/data-center/index | docs/prototype/feature-data-center/page-data-center.ts |

# 共享领域概念

| 名词 | 说明 |
| --- | --- |
| 本地存储占用 | 当前小程序数据体积及容量占比。 |
| 数据导出 | 将本地业务数据打包为可下载或分享的备份。 |
| 数据重置 | 清空本地业务数据的危险操作。 |
| 云端同步中心 | 未来能力占位，不纳入本轮正式功能范围。 |

# 共享组件

- 存储指标卡
- 操作列表卡
- 危险确认弹层
- 提示信息卡
