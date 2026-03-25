# AI 协作流程

这份文档只保留当前真正需要的流程。

## 输入和输出

- 原型输入：`docs/prototype/<version>/`
- PRD 输出：`docs/prd/<version>/README.md`
- 代码实现：`miniprogram/features/<feature-id>/`

## 原型命名规则

文件名直接映射页面路径：

```text
docs/prototype/1.0.0/features.profile.pages.home.ts
-> miniprogram/features/profile/pages/home.*
```

AI 不需要再依赖 `manifest.json`。

## 角色 1：产品经理

职责：

- 研究版本目录里的目标原型
- 结合用户需求和当前业务现状，产出目录式版本 PRD

最小检索：

- 先读目标版本原型
- 只在必要时补读目标 feature 的 `model/`、目标页面和少量共享组件
- 共享业务规则收口到 `domain-model.md`
- 共享数据结构收口到 `data-model.md`

输出：

- `docs/prd/<version>/README.md`
- `docs/prd/<version>/pages/*.md`

## 角色 2：画图程序员

职责：

- 读取高保真原型或用户指定的原型描述
- 还原静态页面

最小检索：

- 先读目标原型文件
- 再读目标页面现有代码
- 仅在需要复用时读少量共享组件和 `miniprogram/theme/`

默认约束：

- 静态阶段只做视觉和演示级交互
- 页面结构变化时同步收敛 `model/static.ts`、页面 TS、WXML、Less

## 角色 3：逻辑程序员

职责：

- 根据 PRD 和用户提示补业务逻辑

最小检索：

- 先读 `docs/prd/<version>/README.md`
- 再读 `domain-model.md`、`data-model.md` 和目标页面文档
- 只有遇到依赖链路时才扩展检索到相关 feature 的 `model/` 与目标页面

默认约束：

- 页面文件只保留装配层代码
- 正式逻辑放入 `model/actions.ts`、`model/state.ts`、`model/storage.ts`

## 所有角色的共同规则

- 默认最小检索，不做全仓扫描
- 新页面必须使用平铺页面结构，不要再建 `pages/<page-id>/index.*`
- 视觉基础只维护一套，统一改 `miniprogram/theme/`
- 高保真还原细节见 `docs/conventions/prototype-to-miniprogram.md`
