# PayPulse

面向 AI 长期协作维护的微信小程序脚手架。

## 仓库目标

本仓库围绕“AI 可维护性”组织：

- `docs/prototype/`：按 feature 分组的高保真原型输入
- `docs/prd/`：由原型拆分出的页面级 PRD
- `docs/architecture/`：稳定的全局架构规则
- `docs/conventions/`：命名、分层、状态、原型还原等约定
- `miniprogram/features/`：按 feature 组织的业务代码
- `miniprogram/components/`：全局 UI 组件与可复用模式
- `miniprogram/theme/`：Less 主题入口、token 与视觉配方

## 默认工作流

1. 先更新或确认 `docs/prototype/`
2. 如处于静态阶段，先做高保真还原
3. 再写页面 PRD
4. 最后接正式业务逻辑

## 默认高保真还原模式

这是当前项目的默认实现方式：

- 最新高保真原型是唯一视觉基准
- 静态阶段只做视觉与演示级交互，不接正式业务
- 页面结构变更时，必须同步收敛 `model/static.ts`、页面 TS、WXML、Less
- 页面和组件统一走 `miniprogram/theme/`，不再新增 `miniprogram/styles/`
- SVG 一律走 `image + base64` 方案，动态图标使用 `staticSrc / animatedSrc`
- 原型中的 hover/active 要翻译成小程序点击态，而不是只做静态截图

详细规则见：

- [高保真原型还原指南](/e:/coding/PayPulse/docs/conventions/prototype-to-miniprogram.md)
- [主题系统](/e:/coding/PayPulse/docs/architecture/03-theme-system.md)
- [AI 协作流程](/e:/coding/PayPulse/docs/architecture/04-ai-workflow.md)

## 约束

- 页面文件只做装配，不承载复杂业务规则
- 业务逻辑优先放进 `features/<feature-id>/model`
- 新增组件前先检查 `components/ui` 与共享模式
- 主题变更优先改 `miniprogram/theme/`

从 [系统总览](/e:/coding/PayPulse/docs/architecture/00-system-overview.md) 开始阅读。
