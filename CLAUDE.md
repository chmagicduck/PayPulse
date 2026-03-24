# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指导。

## 项目概述

PayPulse 是一个微信小程序，使用 TypeScript + Less 构建，采用 Skyline 渲染器和 glass-easel 组件框架。项目围绕"AI 可维护性"设计——文件职责可预测、上下文读取成本低、模块边界显式。

## 构建与开发

本项目**没有 npm scripts**——完全通过**微信开发者工具**构建和预览。开发者工具内置编译器处理 TypeScript 和 Less 转译（`useCompilerPlugins: ["typescript", "less"]`）。

- 用微信开发者工具打开项目根目录（appid: `wx17bd33e979aa3dba`）
- TypeScript 由开发者工具编译，不是 tsc——没有构建命令
- `npm install` 仅用于安装类型定义（`miniprogram-api-typings`）
- 类型检查：`npx tsc --noEmit`（严格模式，target ES2020，module CommonJS）

## 架构

### 目录结构

```
docs/
  architecture/    # 稳定的全局架构规则（从这里开始阅读）
  conventions/     # 命名、分层、状态、UI 指南
  prototype/       # 按 feature 分组的高保真原型输入
  prd/             # 按 feature 切片的页面级 PRD（从原型生成）
miniprogram/
  config/          # 路由 (routes.ts)、标签栏 (tabbar.ts)、功能清单
  features/        # 按 feature 隔离的业务代码
  components/
    ui/            # 原子 UI 组件（pp-button, pp-card, pp-nav-bar）
    navigation/    # 导航组件
  theme/           # 设计 token、语义槽位、具名主题、组件配方
  store/           # 仅存放全局状态（app-store, theme-store）
  lib/             # 纯工具函数（constants, format, guards, wx 平台封装）
  styles/          # 全局共享样式
  types/           # 共享类型定义
  assets/          # 图片、图标（标签栏 SVG/PNG）
```

### Feature 目录契约

每个 feature 位于 `miniprogram/features/<feature-id>/`，遵循固定结构：

```
README.md          # Feature 概述
public.ts          # 唯一允许被其他 feature 引用的文件
model/
  types.ts         # 类型定义
  state.ts         # 状态管理
  actions.ts       # 业务逻辑 / 动作
  storage.ts       # 持久化逻辑
  schema.ts        # 数据结构定义
  static.ts        # 静态数据
components/        # Feature 私有组件
pages/             # 页面入口文件（仅负责绑定与装配）
```

### 依赖规则

- Feature → `components/ui`、`components/patterns`、`theme`、`lib`、`types`、自身文件
- 跨 Feature 引用 → 只能通过目标 feature 的 `public.ts`
- `components/ui` 和 `components/patterns` → **禁止**依赖任何 feature
- `theme` → **禁止**依赖业务 feature
- 页面入口文件 → 只做数据绑定、事件绑定、组件装配；不含业务规则

### 主题系统

分层：`tokens/` → `semantic.ts` → `themes/*.ts` → `component-recipes.ts`

默认链路：`theme/themes/ocean-default.ts` → `theme/index.ts` → 消费方

组件消费语义值，不直接使用原始色值。视觉变更统一在 `theme/` 中处理，不散落到页面样式里。

### 路由

- 路由定义在 `miniprogram/config/routes.ts`，包含 `featureId`、`pageId`、`route`、`kind`（tab/page）
- 必须与 `miniprogram/app.json` 的 pages 数组保持同步
- 4 个标签页：home（领潮中心）、report（洋流战报）、lab（动力室）、profile（个人基地）
- 全局使用自定义导航栏（`navigationStyle: "custom"`）

### 渲染

使用 Skyline 渲染器 + glass-easel 组件框架，`defaultDisplayBlock: true`。

## 关键约定

- **页面文件保持精简**——只装配组件、绑定数据和事件。业务逻辑放入 `model/`
- **新建组件前先检查现有组件**（`components/ui/` 和 `components/patterns/`）
- **主题变更只改 `theme/`**——不在页面样式中散落颜色值
- **不可变性**——创建新对象，不修改原对象
- **组件前缀**——UI 组件使用 `pp-` 前缀（pp-button, pp-card, pp-nav-bar）
- **SVG 图标**——微信小程序不支持内联 SVG，需创建 `.svg` 文件后通过 `<image>` 标签引用

## 新 AI 的阅读顺序

1. `docs/architecture/00-system-overview.md`
2. `docs/architecture/01-directory-contract.md`
3. 目标 feature 的 `README.md`
4. 目标页面对应的 PRD（`docs/prd/<feature-id>/pages/`）

## 新功能开发流程

1. 读取 `docs/prototype/` 中的原型
2. 在 `docs/prd/<feature-id>/` 中创建 PRD
3. 按 feature 契约在 `miniprogram/features/<feature-id>/` 中搭建脚手架
4. 在 `config/routes.ts` 中注册路由并在 `app.json` 中添加页面
