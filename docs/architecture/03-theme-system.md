# 主题系统

## 分层

1. `tokens/`：原始设计 token
2. `semantic.ts`：语义槽位，例如 `surfaceCard`、`textMuted`
3. `themes/*.ts`：具名主题值
4. `component-recipes.ts`：组件级视觉变体配方

## 规则

- 组件消费语义值，不直接消费零散色值
- 页面样式优先使用语义槽位映射出来的类名或变量
- 新主题不能改变组件逻辑
- 视觉调整优先改 `theme/`，不要先扫业务页面

## 默认主题链路

`theme/themes/ocean-default.ts` -> `theme/index.ts` -> 页面或组件使用
