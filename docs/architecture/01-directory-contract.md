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

- `README.md`：版本入口与阅读顺序
- `overview.md`：版本目标、范围、非目标
- `glossary.md`：统一术语
- `domain-model.md`：共享业务规则与计算口径
- `data-model.md`：共享状态与存储结构
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
-> miniprogram/features/profile/pages/home.ts
-> miniprogram/features/profile/pages/home.wxml
-> miniprogram/features/profile/pages/home.less
-> miniprogram/features/profile/pages/home.json
```

## Feature 目录契约

每个 feature 默认拥有：

- `README.md`
- `public.ts`
- `model/`
- `components/`
- `pages/`

页面文件必须平铺：

```text
pages/
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
