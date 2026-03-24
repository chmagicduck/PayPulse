# Prototype 目录

高保真原型按 feature 分组，不再按页面中文标题平铺存放。

## 规则

- 新原型文件放到 `feature-<feature-id>/` 下
- 文件统一使用 `page-<page-id>.ts` 命名
- 新增或移动原型时必须同步更新 `manifest.json`
- `legacy/` 只保留迁移说明，不再放实际原型

原型文件是输入产物，不参与运行时逻辑。
