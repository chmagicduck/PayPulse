# 高保真还原 Skill

## 目标

将 `docs/prototype/<version>/` 下的高保真原型还原为微信小程序静态页面。

## 输入

- 原型文件：`docs/prototype/<version>/features.<feature-id>.pages.<page-id>.ts`
- 目标目录：`miniprogram/features/<feature-id>/`
- 共享主题：`miniprogram/theme/`
- 图标工具：`miniprogram/lib/icons.ts`

## 边界

- 只做视觉还原和演示级交互
- 只使用静态数据，不接真实接口、真实存储、真实业务链路
- 以最新原型为唯一视觉基准
- 不为了抽象提前改造页面结构

## 输出约束

- 页面文件直接放在 `miniprogram/features/<feature-id>/`
- 页面层只负责结构、绑定和轻量交互
- 静态数据优先收敛到 feature 的 `model.ts`
- 样式优先复用 `miniprogram/theme/`

## 执行步骤

1. 先读目标原型文件，确认页面结构、文案、区块顺序、图标和演示交互。
2. 将标题、描述、数字、列表等静态内容提取到 `model.ts`。
3. 在页面 TS 中只处理 data URI 图标和视觉状态，不接正式业务逻辑。
4. 在 WXML / Less 中忠实还原布局、间距、颜色、阴影和点击态。
5. 原型删除的区块要同步清理页面 TS、WXML、Less 和 `model.ts` 中的对应字段。

## 实现细则

- 复杂布局优先使用 flex
- 主滚动使用自然页面滚动，不用 `scroll-view` 包整页
- 非文本容器显式声明尺寸
- 顶部沉浸式页面使用 `navigationStyle: "custom"`
- 页面底部预留 tab bar 安全区
- SVG 优先使用 `<image>` + base64 data URI
- 动效图标使用静态源与动态图源切换

## 一句话原则

高保真还原阶段优先选择“更像原型”的实现，而不是“更像正式业务”的实现。
