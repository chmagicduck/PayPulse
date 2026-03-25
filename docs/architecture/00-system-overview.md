# 系统概览

## 目标

PayPulse 的核心目标是把 AI 协作成本降下来，让后续维护尽量接近“看少量文件就能安全干活”。

本仓库优先优化：

- 文件职责可预测
- 上下文读取成本低
- 原型到 PRD 到代码的链路简单
- 单页改动不需要全仓扫描

## 当前运行模式

1. 用户把原型放进 `docs/prototype/<version>/`
2. 产品经理输出 `docs/prd/<version>/README.md`
3. 画图程序员先还原静态页面
4. 逻辑程序员再补正式逻辑

## 最小事实源

- `docs/prototype/<version>/`：版本原型输入
- `docs/prd/<version>/`：版本 PRD 目录
- `miniprogram/features/`：业务实现
- `miniprogram/theme/`：单套视觉基础
- `miniprogram/config/`：路由与页面注册

## 默认阅读顺序

1. 本文件
2. `docs/architecture/01-directory-contract.md`
3. 当前任务对应的原型或 `docs/prd/<version>/README.md`
4. 目标 feature 的 `model/` 和 `pages/`

正常情况下，只读这些内容就应该足够开始改单页或单功能。
