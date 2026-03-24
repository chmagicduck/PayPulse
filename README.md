# PayPulse

面向 AI 长期协作维护的微信小程序脚手架。

## 仓库目标

本仓库围绕“AI 可维护性”组织：

- `docs/prototype/`：按 feature 分组的高保真原型输入
- `docs/prd/`：由原型拆分出的页面级 PRD
- `docs/architecture/`：稳定的全局架构规则
- `docs/conventions/`：命名、分层、状态等约定
- `miniprogram/features/`：按 feature 组织的业务代码
- `miniprogram/components/`：全局 UI 组件与可复用模式
- `miniprogram/theme/`：主题 token 与组件视觉配方

## 默认工作流

1. 先补原型，再写 PRD。
2. 页面文件只做装配，不承载复杂业务规则。
3. 业务逻辑优先放进 `features/<feature-id>/model`。
4. 新增组件前先检查 `components/ui` 和 `components/patterns`。
5. 主题变更只改 `miniprogram/theme/`，不要散落到页面样式里。

从 [docs/architecture/00-system-overview.md](/c:/code/wx-mini/PayPulse/docs/architecture/00-system-overview.md) 开始阅读。
