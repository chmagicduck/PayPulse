---
feature_id: profile
page_id: profile-home
title_zh: 个人基地
route: features/profile/pages/home/index
prototype: docs/prototype/feature-profile/page-profile-home.ts
status: draft
ui_patterns:
  - page-shell
  - section-title
ui_components:
  - pp-card
  - pp-button
  - pp-nav-bar
storage_keys:
  - profile.avatar
---

# 页面目标

为用户提供个人身份展示、等级摘要和全局导航入口，成为个人配置与辅助工具的统一中枢。

# 入口条件

| 来源 | 条件 |
| --- | --- |
| 底部导航“个人基地” | 无前置条件 |
| 其他页面返回 | 保留当前已保存头像与摘要 |

# 信息结构

| 顺序 | 区块 | 说明 |
| --- | --- | --- |
| 1 | 身份头图区 | 展示头像、昵称、用户 ID、VIP 标签与头像入口。 |
| 2 | 等级摘要卡 | 展示当前等级、进度条与等级路线预览。 |
| 3 | 航行控制台 | 进入档案设置、岁月坐标、日历、任务中心。 |
| 4 | 关于与社群 | 进入加入社区、关于软件。 |
| 5 | 安全与存储 | 进入数据管理中心。 |
| 6 | 头像选择弹层 | 选择预设头像并确认保存。 |

# 状态表

| field | type | default | source | notes |
| --- | --- | --- | --- | --- |
| profileSummary | object | 默认档案摘要 | profile.settings | 至少包含昵称与用户 ID。 |
| currentAvatar | string | preset-1 | profile.avatar | 进入页面时读取。 |
| rankSummary | object | 空摘要 | lab.progress | 仅展示当前等级与进度。 |
| showAvatarModal | boolean | false | page local | 控制头像选择弹层。 |
| selectedAvatar | string | currentAvatar | page local | 弹层内临时选择值。 |
| entryGroups | array | 固定分组 | schema | 控制按钮标题、描述、徽标。 |

# 组件结构

1. `page-shell`
2. 个人身份卡片
3. 等级摘要卡片
4. 控制台入口按钮组
5. 列表入口组
6. 数据管理入口卡片
7. 头像选择弹层

# 交互表

| action | condition | state change | UI feedback | persistence |
| --- | --- | --- | --- | --- |
| 点击头像 | 页面可用 | `showAvatarModal=true` | 打开底部弹层 | 否 |
| 选择预设头像 | 弹层已打开 | 更新 `selectedAvatar` | 高亮当前头像 | 否 |
| 确认头像 | 已选择头像 | `currentAvatar=selectedAvatar` | 关闭弹层并回显 | `profile.avatar` |
| 点击“基本信息设置” | 无 | 跳转至档案设置页 | 页面跳转 | 否 |
| 点击“岁月坐标设置” | 无 | 跳转至岁月坐标页 | 页面跳转 | 否 |
| 点击“查看日历” | 无 | 跳转至日历页 | 页面跳转 | 否 |
| 点击“任务中心设置” | 无 | 跳转至动力室 | 页面跳转 | 否 |
| 点击“加入社区/关于软件/数据管理中心” | 无 | 跳转目标页 | 页面跳转 | 否 |

# 边界情况

- 首次使用时，昵称、头像和等级摘要使用默认值，不阻断页面进入。
- 动力室尚未产生等级数据时，等级摘要展示“未开始/待累计”占位文案。
- 头像弹层被遮罩关闭时，不保存未确认选择。

# 样式约束

- 使用 `page-shell` 承担整体滚动与安全区处理。
- 入口卡片优先复用 `pp-card` 或同级 pattern，不在页面内散落重复容器样式。
- 等级预览只保留正式等级摘要，不把原型中的自动轮播写成正式需求。
- 深色数据管理入口允许使用反差背景，但颜色来源需落到主题 token。

# 验收清单

- [ ] 页面能从底部导航稳定进入。
- [ ] 头像修改后立即回显，并在重新进入页面后保持一致。
- [ ] 所有入口都映射到明确目标页面或能力。
- [ ] 等级摘要来自 `lab.progress`，未在 profile 内重复存储。
