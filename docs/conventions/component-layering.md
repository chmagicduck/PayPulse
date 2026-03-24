# 组件分层

## 基础 UI 层

路径：`miniprogram/components/ui`

示例：

- `pp-button`
- `pp-card`
- `pp-nav-bar`

规则：不出现业务词，不依赖 feature。

## 模式组件层

路径：`miniprogram/components/patterns`

示例：

- `page-shell`
- `section-title`

规则：可以组合基础 UI，但仍保持业务中立。

## 业务组件层

路径：`miniprogram/features/<feature-id>/components`

示例：

- `timer-card`
- `salary-summary-card`

规则：允许依赖 feature model，允许携带业务语义。
