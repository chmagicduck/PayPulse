---
feature_id: profile
title_zh: 个人基地
status: draft
---

# 功能目标

个人基地负责沉淀用户身份、薪资与作息等基础配置，并作为通往日历、岁月坐标、动力室、社区、关于页与数据管理中心的统一入口。

# 页面清单

| page_id | route | prototype |
| --- | --- | --- |
| profile-home | features/profile/pages/home/index | docs/prototype/feature-profile/page-profile-home.ts |
| profile-settings | features/profile/pages/settings/index | docs/prototype/feature-profile/page-profile-settings.ts |

# 共享领域概念

| 名词 | 说明 |
| --- | --- |
| 航行档案 | 用户昵称、生日、入行日期、薪资、工作制、作息等基础配置。 |
| 个人基地身份 | 头像、昵称、用户 ID 与等级摘要的组合展示。 |
| 航行控制台 | 从个人基地进入其他配置页和工具页的导航分组。 |
| 等级摘要 | 基于动力室累计快乐值映射出的当前等级与进度。 |

# 共享组件

- 个人身份头图卡片
- 导航入口卡片
- 列表型设置入口
- 头像选择弹层
