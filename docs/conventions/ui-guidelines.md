# UI 约定

## 风格方向

- 使用语义化颜色槽位
- 间距尽量落在 token 刻度上
- 圆角选择保持有限集合
- 优先复用共享组件变体，避免局部临时样式

## 组件复用顺序

1. `components/ui`
2. `components/patterns`
3. `features/<feature-id>/components`

## 组件上提条件

只有满足以下条件时，才把组件上提到更高层：

- 至少被两个 feature 实际复用
- props 已经脱离具体业务语义
- 组件名称不再包含明显领域词
