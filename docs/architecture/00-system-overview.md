# 系统概览

## 目标

PayPulse 是一个纯前端微信小程序项目，核心目标不是快速堆功能，而是建立一套可被 AI 长期稳定理解、维护和扩展的工程基础设施。

本仓库优先优化：

- 文件职责可预测
- 上下文读取成本低
- UI 风格持续稳定
- 模块边界显式
- 原型到 PRD 到代码的链路清晰

## 运行模式

1. 人工在 `docs/prototype/` 中新增或更新原型。
2. AI 在 `docs/prd/<feature-id>/` 中编写切片化 PRD。
3. AI 在 `miniprogram/features/<feature-id>/` 中实现功能。
4. 共享 UI 与主题变更只在全局层处理，不下沉到业务页面里。

## 架构形态

- `docs/` 是产品与架构事实源。
- `miniprogram/features/` 是业务实现主目录。
- `miniprogram/components/` 是共享 UI 复用层。
- `miniprogram/theme/` 是视觉系统事实源。
- `miniprogram/config/` 是路由与功能注册层。

## 新 AI 的默认阅读顺序

1. `docs/architecture/00-system-overview.md`
2. `docs/architecture/01-directory-contract.md`
3. 目标 feature 的 `README.md`
4. 目标页面对应的 PRD

正常情况下，只读这几类文件就应该能安全修改单个功能模块。
