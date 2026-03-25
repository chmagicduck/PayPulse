# PayPulse

面向 AI 长期协作维护的微信小程序脚手架。

## 现在的最小工作流

1. 用户把高保真原型放进 `docs/prototype/<version>/`
2. 文件名直接映射代码页面路径，例如：
   `features.profile.pages.home.ts` -> `miniprogram/features/profile/pages/home.*`
3. 产品经理只读版本目录内的必要原型和少量现状代码，产出目录式版本 PRD：`docs/prd/<version>/README.md`
4. 画图程序员只读目标原型、目标页面和少量共享样式，先还原静态页面
5. 逻辑程序员只读 `README.md`、`domain-model.md`、`data-model.md` 和目标页面文档，补齐业务逻辑

## 当前结构

- `docs/prototype/`：按版本存放高保真原型输入
- `docs/prd/`：按版本存放目录式 PRD，目录内按“版本入口 / 共享规则 / 页面文档”组织
- `docs/architecture/`：稳定的全局规则
- `docs/conventions/`：实现约定和模板
- `miniprogram/features/`：按 feature 组织的业务代码
- `miniprogram/components/`：共享 UI 组件
- `miniprogram/theme/`：单套视觉 tokens 与 Less 基础层

## 当前约束

- `miniprogram/features/<feature-id>/pages/` 只允许页面平铺：`pages/home.ts`、`pages/home.wxml`、`pages/home.less`、`pages/home.json`
- 页面文件只做装配，不承载复杂业务规则
- 业务逻辑优先放进 `features/<feature-id>/model`
- 视觉基础只维护一套，不再设计多主题扩展
- 静态还原阶段只做视觉和演示级交互，不接正式业务
- PRD 中的共享业务规则统一收口到 `domain-model.md`
- PRD 中的共享数据结构统一收口到 `data-model.md`

从 `docs/architecture/00-system-overview.md` 开始阅读。
