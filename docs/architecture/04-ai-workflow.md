# AI 协作流程

这份文档只保留当前真正需要的流程。

## 输入和输出

- 原型输入：`docs/prototype/<version>/`
- 静态页面输出：`miniprogram/features/<feature-id>/`
- PRD 输出：`docs/prd/<version>/`
- 逻辑实现：继续落在 `miniprogram/features/<feature-id>/`

## 标准流程

1. 基于原型生成静态页面
2. 审核路由、页面局部状态、现有 storage key、mock 数据和跨页入口
3. 抽取共享实体、共享规则、启动/重置流程和派生链路
4. 先输出版本级 PRD，再允许进入正式业务逻辑实现
5. 逻辑开发只读取版本 PRD 和目标 feature 最小上下文

## 角色 1：画图程序员

职责：

- 研究版本目录里的目标原型
- 在 `miniprogram/features/` 下完成静态页面还原

最小检索：

- 先读目标原型文件
- 再读目标页面现有代码
- 仅在需要复用时读少量共享组件和 `miniprogram/theme/`

默认约束：

- 静态阶段只做视觉和演示级交互
- 页面结构变化时同步收敛 `model.ts`、页面 TS、WXML、Less
- 静态阶段结束后，默认把页面交给 PRD 阶段，不直接补正式逻辑

## 角色 2：产品经理

职责：

- 基于 `miniprogram/features/` 的静态页面，反推出版本级业务闭环
- 输出目录式版本 PRD

最小检索：

- 先读目标版本已完成的静态页面
- 再读 `app.json`、`miniprogram/config/routes.ts`、已有 storage key 和少量共享工具
- 仅在页面事实不足时补读目标原型

默认约束：

- PRD 必须区分 `页面直接事实`、`跨页推理`、`闭环假设`
- 共享业务规则收口到 `domain-model.md`
- 共享数据结构收口到 `data-model.md`

## 角色 3：逻辑程序员

职责：

- 根据版本 PRD 和用户提示补业务逻辑

最小检索：

- 先读 `docs/prd/<version>/README.md`
- 再读 `domain-model.md`、`data-model.md`、`page-map.md` 和目标页面文档
- 只有遇到依赖链路时才扩展检索到相关 feature 的 `model`、页面和共享工具

默认约束：

- 页面文件只保留装配层代码
- 正式逻辑优先放入 feature model、storage 和 selector 层

## 所有角色的共同规则

- 默认最小检索，不做全仓扫描
- 页面文件直接平铺在 feature 根目录，不要再建 `pages/<page-id>/index.*`
- 视觉基础只维护一套，统一改 `miniprogram/theme/`
- 高保真还原细节见 `docs/conventions/prototype-to-miniprogram.md`
- 静态页反推 PRD 的具体方法见 `docs/conventions/static-page-to-prd-workflow.md`
