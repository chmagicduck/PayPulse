# Prototype 目录

## 规则

- 新原型统一放进 `docs/prototype/<version>/`
- 文件名必须直接映射代码页面路径
- `legacy/` 只保留旧结构说明

## 命名示例

```text
docs/prototype/1.0.0/features.profile.pages.home.ts
-> miniprogram/features/profile/pages/home.*
```

原型文件是输入产物，不参与运行时逻辑。
