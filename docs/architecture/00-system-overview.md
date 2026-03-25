# 系统概览

## 目标

PayPulse 的核心目标是把 AI 协作成本降下来，让后续维护尽量接近“看少量文件就能安全干活”。

本仓库优先优化：

- 文件职责可预测
- 上下文读取成本低
- 原型到静态页到 PRD 到逻辑的链路简单
- 单页改动不需要全仓扫描

## 当前运行模式

1. 用户把原型放进 `docs/prototype/<version>/`
2. 画图程序员先生成 `miniprogram/features/` 下的静态页面
3. 产品经理基于静态页面反推版本 PRD
4. 逻辑程序员根据版本 PRD 补正式业务逻辑

## 最小事实源

- `docs/prototype/<version>/`：视觉输入源
- `miniprogram/features/`：静态页面与页面局部状态事实源
- `docs/prd/<version>/`：业务规则、数据结构和验收事实源
- `miniprogram/theme/`：单套视觉基础
- `miniprogram/config/`：路由与页面注册

## 默认阅读顺序

1. 本文件
2. `docs/architecture/01-directory-contract.md`
3. 当前任务对应的事实源
4. 目标 feature 的最小代码上下文

正常情况下，只读这些内容就应该足够开始改单页、补 PRD 或开发单功能。
