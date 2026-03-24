# 依赖规则

## 允许的依赖方向

- `features/*` -> `components/ui`、`components/patterns`、`theme`、`lib`、`types`、同 feature 文件
- `components/patterns` -> `components/ui`、`theme`、`lib`、`types`
- `components/ui` -> `theme`、`lib`、`types`
- `store` -> `lib`、`types`、`theme`
- `config` -> `types`、feature 的 `public.ts`

## 禁止的依赖方向

- `components/ui` -> 任意 feature
- `components/patterns` -> 任意 feature
- `feature A` -> `feature B/internal-file`
- `theme` -> 任意业务 feature
- 页面文件 -> 其他 feature 的内部状态实现

## 跨 Feature 规则

一个 feature 需要使用另一个 feature 的能力时，只能通过对方的 `public.ts`。

## 页面规则

页面入口文件可以负责：

- 绑定数据
- 绑定事件
- 装配组件

页面入口文件不应负责：

- 业务规则判断
- 存储结构定义
- 格式化与校验逻辑复制
