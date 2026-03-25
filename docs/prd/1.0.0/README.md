---
version: 1.0.0
status: draft
prototype_dir: docs/prototype/1.0.0
---

# PayPulse 1.0.0 PRD

`docs/prd/1.0.0/` 是 1.0.0 版本唯一正式 PRD 来源。产品、设计、开发、测试都以本目录为准，不再回读旧的 `feature-*` PRD。

## 阅读顺序

1. [overview.md](overview.md)
2. [glossary.md](glossary.md)
3. [domain-model.md](domain-model.md)
4. [data-model.md](data-model.md)
5. [page-map.md](page-map.md)
6. 目标页面对应的 `pages/*.md`
7. [acceptance.md](acceptance.md)

## 文档清单

| 文件 | 职责 |
| --- | --- |
| `overview.md` | 说明版本目标、范围、非目标和页面覆盖范围。 |
| `glossary.md` | 统一术语口径，避免跨页命名漂移。 |
| `domain-model.md` | 沉淀共享业务逻辑、计算规则、跨页面依赖和占位能力边界。 |
| `data-model.md` | 沉淀共享状态、持久化 key、字段约束、派生读模型和写入责任。 |
| `page-map.md` | 描述页面路由、入口来源、跳转关系和依赖链。 |
| `acceptance.md` | 汇总版本级验收链路、关键风险和回归重点。 |
| `pages/*.md` | 页面级 PRD，只负责页面目标、信息结构、交互、局部状态和页面验收。 |

## 页面清单

| 页面 | route | prototype |
| --- | --- | --- |
| 首页 | `features/home/pages/dashboard` | `docs/prototype/1.0.0/features.home.pages.dashboard.ts` |
| 日历 | `features/calendar/pages/calendar` | `docs/prototype/1.0.0/features.calendar.pages.calendar.ts` |
| 洋流战报 | `features/report/pages/ocean-report` | `docs/prototype/1.0.0/features.report.pages.ocean-report.ts` |
| 动力室 | `features/lab/pages/lab` | `docs/prototype/1.0.0/features.lab.pages.lab.ts` |
| 个人基地 | `features/profile/pages/home` | `docs/prototype/1.0.0/features.profile.pages.home.ts` |
| 航行档案设置 | `features/profile-settings/pages/settings` | `docs/prototype/1.0.0/features.profile-settings.pages.settings.ts` |
| 岁月坐标设置 | `features/time-axis/pages/time-axis-settings` | `docs/prototype/1.0.0/features.time-axis.pages.time-axis-settings.ts` |
| 数据管理中心 | `features/data-center/pages/data-center` | `docs/prototype/1.0.0/features.data-center.pages.data-center.ts` |
| 加入社区 | `features/community/pages/join` | `docs/prototype/1.0.0/features.community.pages.join.ts` |
| 关于软件 | `features/about/pages/about` | `docs/prototype/1.0.0/features.about.pages.about.ts` |

## 使用原则

- 共享业务规则只写一次，统一收口到 `domain-model.md`。
- 共享数据结构只写一次，统一收口到 `data-model.md`。
- 页面文档不重复抄共享字段表，只声明“依赖哪些共享对象、写哪些共享 key”。
- 页面文档只保留页面局部状态，例如弹层开关、编辑草稿、当前筛选。
- 所有“敬请期待”“占位展示”“未来能力”都必须在 `domain-model.md` 标明为非本版正式能力。
