# 目录契约

## 稳定目录

- `docs/architecture/`：全局规则
- `docs/conventions/`：实现约定与模板
- `docs/prototype/<version>/`：版本化原型输入
- `docs/prd/<version>/`：目录式版本 PRD
- `miniprogram/config/`：路由与注册清单
- `miniprogram/features/`：按 feature 隔离的业务代码
- `miniprogram/components/`：共享组件
- `miniprogram/theme/`：单套视觉 tokens 与 Less 基础层
- `miniprogram/lib/`：纯工具与平台封装
- `miniprogram/store/`：全局状态

## 版本工作流目录契约

同一版本的三层产物必须保持可追溯：

```text
docs/prototype/1.0.0/   # 原型输入
miniprogram/features/   # 静态页面输出
docs/prd/1.0.0/         # 反推后的业务 PRD
```

要求：

- 原型负责视觉目标
- 静态页面负责页面结构、局部状态和演示交互
- PRD 负责共享规则、数据结构、启动流程和验收口径

## PRD 目录契约

每个版本 PRD 默认拥有：

```text
docs/prd/1.0.0/
  README.md
  overview.md
  glossary.md
  domain-model.md
  data-model.md
  page-map.md
  acceptance.md
  pages/
    home-dashboard.md
```

职责边界：

- `README.md`：版本入口、阅读顺序、来源标签说明
- `overview.md`：版本目标、范围、非目标
- `glossary.md`：统一术语
- `domain-model.md`：共享业务规则、计算口径、启动和重置流程
- `data-model.md`：共享状态、字段结构、持久化 key、派生关系
- `page-map.md`：页面路由、入口和跳转链路
- `acceptance.md`：版本级验收链路
- `pages/*.md`：页面级 PRD，仅记录页面目标、信息结构、交互、局部状态和边界

## 原型目录契约

原型文件统一放在版本目录中，文件名直接映射代码页面：

```text
docs/prototype/1.0.0/
  features.profile.pages.home.ts
  features.profile-settings.pages.settings.ts
```

映射规则：

```text
features.profile.pages.home.ts
-> miniprogram/features/profile/home.ts
-> miniprogram/features/profile/home.wxml
-> miniprogram/features/profile/home.less
-> miniprogram/features/profile/home.json
```

## Feature 目录契约

每个 feature 默认拥有：

- `README.md`
- `public.ts`
- `model.ts`
- `<page>.ts`
- `<page>.wxml`
- `<page>.less`
- `<page>.json`

页面文件必须直接平铺在 feature 根目录：

```text
features/profile/
  home.ts
  home.wxml
  home.less
  home.json
```

## 禁止漂移

- 不要再创建 `pages/<page-id>/index.*`
- 不要把 feature 逻辑放进 `components/`
- 不要把页面私有状态放进 `store/`
- 不要把大面积视觉常量散落到页面样式里
- 不要在页面文档里重复抄写共享业务规则和共享字段表
- 不要直接引用其他 feature 的内部文件
