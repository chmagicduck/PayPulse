---
feature_id: profile
page_id: profile-settings
title_zh: 航行档案设置
route: features/profile/pages/settings/index
prototype: docs/prototype/feature-profile/page-profile-settings.ts
status: draft
ui_patterns:
  - page-shell
  - section-title
ui_components:
  - pp-button
  - pp-card
storage_keys:
  - profile.settings
---

# 页面目标

采集并维护用户的基础档案、薪资参数和作息配置，为首页、日历、战报和岁月坐标提供统一输入。

# 入口条件

| 来源 | 条件 |
| --- | --- |
| 个人基地“基本信息设置” | 无 |
| 首次启动引导 | 可作为默认建档页 |

# 信息结构

| 顺序 | 区块 | 说明 |
| --- | --- | --- |
| 1 | 引导 Banner | 说明档案设置的业务价值。 |
| 2 | 舵手身份识别 | 昵称、生日、性别。 |
| 3 | 航程工龄坐标 | 入行日期、退休年龄、预期寿命、月薪、发薪日。 |
| 4 | 航行排班计划 | 工作制、大小周、上下班时间、午休设置。 |
| 5 | 底部保存按钮 | 统一提交档案。 |

# 状态表

| field | type | default | source | notes |
| --- | --- | --- | --- | --- |
| formData.nickname | string | 默认昵称 | profile.settings | 必填。 |
| formData.birthday | string | 空 | profile.settings | 日期格式 `YYYY-MM-DD`。 |
| formData.gender | enum | male | profile.settings | 原型仅展示二元选项。 |
| formData.careerStartDate | string | 空 | profile.settings | 用于工龄计算。 |
| formData.retirementAge | number | 60 | profile.settings | 正整数。 |
| formData.expectedLifespan | number | 85 | profile.settings | 正整数且大于退休年龄。 |
| formData.monthlySalary | number | 0 | profile.settings | 供首页与战报计算时薪。 |
| formData.payDay | number | 10 | profile.settings | `1-31`。 |
| formData.workMode | enum | double | profile.settings | `double/single-sat/single-sun/big-small`。 |
| formData.isCurrentBigWeek | boolean | true | profile.settings | 仅在 `big-small` 模式下生效。 |
| formData.startTime | string | 09:00 | profile.settings | 工作开始时间。 |
| formData.endTime | string | 18:00 | profile.settings | 工作结束时间。 |
| formData.lunchBreakEnabled | boolean | false | profile.settings | 控制午休时间组显隐。 |
| formData.lunchStartTime | string | 12:00 | profile.settings | 启用午休后必填。 |
| formData.lunchEndTime | string | 13:30 | profile.settings | 必须晚于开始时间。 |

# 组件结构

1. `page-shell`
2. 引导 Banner
3. 身份识别表单组
4. 工龄与薪资表单组
5. 排班与作息表单组
6. 底部保存按钮

# 交互表

| action | condition | state change | UI feedback | persistence |
| --- | --- | --- | --- | --- |
| 修改文本/数字/日期/时间字段 | 输入合法 | 更新对应 `formData` | 表单实时回显 | 否 |
| 切换性别 | 无 | 更新 `formData.gender` | 激活态切换 | 否 |
| 切换工作制 | 无 | 更新 `formData.workMode` | 按钮组选中态切换 | 否 |
| 切换大小周当前周 | `workMode=big-small` | 更新 `isCurrentBigWeek` | 开关状态切换 | 否 |
| 切换午休开关 | 无 | 更新 `lunchBreakEnabled` | 显示或隐藏午休时间输入组 | 否 |
| 点击保存 | 通过校验 | 写入 `profile.settings` | 成功提示并返回或停留 | `profile.settings` |
| 点击保存 | 校验失败 | 不写入 | 字段级报错或顶部提示 | 否 |

# 边界情况

- 首次进入时若无存档，页面使用默认值渲染并允许直接保存。
- `monthlySalary <= 0`、`payDay` 超范围、结束时间早于开始时间、午休时间越界时必须阻止保存。
- `workMode` 非大小周时不展示大小周当前周开关，也不持久化其临时切换结果。

# 样式约束

- 表单分区标题统一使用 `section-title` 表达层次。
- 底部保存按钮固定于安全区内，避免与表单滚动混排。
- 使用 token 驱动的输入容器、选中态和提示色，不在页面里写零散业务色修补。
- 原型中的装饰 banner 保留为辅助说明，不替代字段级校验。

# 验收清单

- [ ] 所有字段都能编辑、校验并保存。
- [ ] 保存后的档案能被首页和其他依赖页读取。
- [ ] 大小周与午休字段的条件显隐正确。
- [ ] 失败校验不会写入无效配置。
