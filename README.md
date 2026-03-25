# PayPulse

面向 AI 长期协作维护的微信小程序脚手架。

## 当前默认工作流

1. 用户把高保真原型放进 `docs/prototype/<version>/`
2. 画图程序员先把原型还原为 `miniprogram/features/` 下的静态页面
3. 产品经理基于静态页面、路由、mock 数据和少量共享代码，反推出版本 PRD：`docs/prd/<version>/`
4. 逻辑程序员只读版本 PRD 和目标 feature 最小上下文，补齐正式业务逻辑

## 三类事实来源

- `页面直接事实`：可以直接从静态页面结构、文案、局部状态和交互看出来的事实
- `跨页推理`：需要结合多个页面、路由关系和共享 mock 数据才能得出的规则
- `闭环假设`：为了让 v1 可以开发和验收，必须补齐但无法从单页直接看出的默认规则

PRD 必须显式区分这三类信息，不能把静态 mock 直接当成真实业务事实。

## 当前结构

- `docs/prototype/`：按版本存放高保真原型输入
- `docs/prd/`：按版本存放目录式 PRD
- `docs/architecture/`：全局规则和流程
- `docs/conventions/`：实现约定与模板
- `miniprogram/features/`：按 feature 组织的页面、静态模型和后续业务模型
- `miniprogram/components/`：共享 UI 组件
- `miniprogram/theme/`：单套视觉 tokens 与 Less 基础层
- `miniprogram/lib/`：工具函数与平台封装
- `miniprogram/store/`：全局应用状态

## 当前约束

- 页面文件直接平铺在 `miniprogram/features/<feature-id>/` 下，例如 `dashboard.ts`、`dashboard.wxml`
- 静态阶段只做视觉和演示级交互，不接正式业务逻辑
- 正式业务规则优先收口到版本 PRD，再进入实现
- 页面文件只保留装配层和页面局部视觉状态
- PRD 里的共享规则统一收口到 `domain-model.md`
- PRD 里的共享数据结构统一收口到 `data-model.md`

推荐从 `docs/architecture/00-system-overview.md` 开始阅读。
