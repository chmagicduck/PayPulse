# 微信小程序高保真原型还原指南

## 适用场景

将 `docs/prototype/` 下的 React + Tailwind 高保真原型 1:1 还原为微信小程序页面。

本指南只覆盖“静态高保真还原阶段”：

- 只还原视觉与演示级交互
- 使用假数据，不接正式业务逻辑
- 不接真实存储，不接真实接口
- 不为了架构整洁主动偏离原型

如果原型与既有实现冲突，默认以最新高保真原型为唯一基准。

## 当前事实源

### 原型事实源

- 页面视觉结构：`docs/prototype/<version>/features.<feature-id>.pages.<page-id>.ts`
- 原型定位：按文件名直接映射页面路径，无需 manifest

### 代码事实源

- 静态数据：`miniprogram/features/<feature>/model.ts`
- 主题入口：`miniprogram/theme/`
- 图标与 SVG 生成：`miniprogram/lib/icons.ts`

## 已验证的工作模式

### 1. 先忠实还原，再考虑抽象

静态高保真阶段的优先级是：

1. 原型还原度
2. 页面结构稳定
3. 共享抽象与复用
4. 业务逻辑接入

不要为了“先设计一个完美组件”而提前改造页面结构。
只有当两个以上页面已经稳定复用同一结构时，才考虑上提为共享组件。

### 2. 页面变更时，结构和静态模型要一起收敛

如果原型更新并移除了某个区域，不能只改 WXML/LESS，必须同步清理：

- `model.ts` 中对应字段
- 页面 TS 中对应状态与图标变量
- 页面 Less 中无效样式块

目标是让代码结构与原型结构保持一致，避免“页面已经删了，但静态模型还拖着旧字段”。

### 3. 静态阶段不接正式业务

允许实现的内容：

- 显示/隐藏
- 弹层开合
- 视觉级轮播
- 点击态/按下态反馈
- SVG 静态图与动画图切换

本阶段不实现：

- 正式路由守卫
- 真实用户数据同步
- 真实计时、真实计算链路
- 正式持久化
- store 驱动的业务状态

### 4. 静态页完成后进入 PRD 阶段

静态还原完成后的默认下一步不是直接写逻辑，而是：

1. 检查页面局部状态、mock 数据、路由入口和现有 storage key
2. 基于静态页面反推版本级业务闭环
3. 输出 `docs/prd/<version>/`

具体方法见 `docs/conventions/static-page-to-prd-workflow.md`。

## 主题层规范

### 主题目录以 Less 为中心

统一使用 `miniprogram/theme/`，不再新增平行的 `miniprogram/styles/`。

当前推荐结构：

```text
miniprogram/theme/
  tokens.less
  foundations/
    base.less
    mixins.less
    animation.less
    typography.less
  entries/
    core.less
    static-page.less
```

### 导入规则

- 组件 Less：优先引入 `theme/entries/core.less`
- 页面 Less：优先引入 `theme/entries/static-page.less`

## SVG 与图标规范

### 1. 默认方案是 `<image>` + base64 SVG

当前统一方案：

- 在 `miniprogram/lib/icons.ts` 中生成 SVG 字符串
- 转成 base64 data URI
- 通过 `<image src="...">` 使用

### 2. 动效方案是双资源切换

涉及原型动态图标时，统一使用双图源：

- `staticSrc`
- `animatedSrc`

页面点击或触摸后，短暂切换到 `animatedSrc`。

## 页面实现约束

- 主滚动一律使用自然页面滚动，不用 `scroll-view` 包整页
- 非文本容器必须显式尺寸
- 复杂布局优先用 flex
- 高保真顶部区域统一使用 `navigationStyle: "custom"`
- 页面主体底部要预留 tab bar 安全区

## 推荐工作流

### 第一步：读原型，不要先看旧代码

先读 `docs/prototype/<version>/features.<feature-id>.pages.<page-id>.ts`，确认：

- 页面结构
- 区块顺序
- 文字文案
- 图标清单
- hover/active 反馈
- 弹层与演示交互

### 第二步：提取静态数据

把静态文本、数字、标签、列表项抽到 feature 的 `model.ts`。

静态数据里放：

- 标题
- 描述
- 数字
- 区块配置
- mock 列表

静态数据里不放：

- data URI
- 页面临时 pressed state
- 由 `icon()` 生成的图标字符串

### 第三步：补图标与资源

处理顺序：

1. 检查 `icons.ts` 是否已有所需图标
2. 缺失图标补 `ICON_PATHS`
3. 本地图片资源放到 `miniprogram/assets/`
4. 不直接依赖线上随机头像或远程 SVG

### 第四步：实现页面 TS

`<page-id>.ts` 负责：

- 引入静态模型
- 生成 data URI 图标
- 管理视觉交互状态
- 管理短暂点击态

不要在页面 TS 中接入正式业务模型。

### 第五步：实现 WXML / Less

WXML 只表达结构、文案绑定、class 切换和事件绑定。
Less 负责间距、圆角、阴影、色彩和点击态视觉变化。

### 第六步：交付给 PRD 阶段

完成静态页后，交付以下内容给产品经理阶段：

- 页面结构和局部状态已经稳定的静态页面
- 当前 mock 数据和演示交互
- 已登记的 storage key 与路由入口

## 一句话原则

高保真原型还原阶段，默认选择“更像原型”的实现，而不是“更像正式业务”的实现；正式业务要在版本 PRD 阶段统一收口。
