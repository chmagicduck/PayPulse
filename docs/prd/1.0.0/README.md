# PayPulse v1.0.0 PRD

## 版本定位

- 版本：`1.0.0`
- 交付形态：本地优先、单用户、无登录的小程序版本
- PRD 主事实源：`miniprogram/features/` 下已还原完成的静态页面
- 原型作用：仅在静态页事实不足时作为补充

## 阅读顺序

1. `overview.md`
2. `glossary.md`
3. `page-map.md`
4. `domain-model.md`
5. `data-model.md`
6. `acceptance.md`
7. `pages/*.md`

## 事实来源标签

- `页面直接事实`：能从静态页面、局部状态和演示交互直接确认
- `跨页推理`：需要结合多个页面、路由、mock 数据和共享工具才能确认
- `闭环假设`：为了让 v1 可开发、可验收而补齐的默认规则

所有关键规则都要显式标注来源，不把静态 mock 直接当成真实业务事实。

## 版本范围

- 已注册页面共 10 个，全部纳入 v1.0.0 PRD
- 核心闭环围绕：启动门禁、用户设置、每日记录、时间轴、报表、动力舱、数据导出与清空
- 社区与关于页面纳入版本范围，但不参与核心数据闭环

## 文档清单

- `overview.md`：版本目标、范围和非目标
- `glossary.md`：统一术语
- `page-map.md`：页面路由、入口和依赖链
- `domain-model.md`：共享业务规则、计算口径、启动与重置流程
- `data-model.md`：共享实体、字段和持久化 key
- `acceptance.md`：版本级验收与回归重点
- `pages/home-dashboard.md`
- `pages/ocean-report.md`
- `pages/lab.md`
- `pages/profile-home.md`
- `pages/profile-settings.md`
- `pages/time-axis-settings.md`
- `pages/calendar.md`
- `pages/community-join.md`
- `pages/about.md`
- `pages/data-center.md`
