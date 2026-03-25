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

- 页面视觉结构：`docs/prototype/feature-*/page-*.ts`
- 原型清单：`docs/prototype/manifest.json`

### 代码事实源

- 静态数据：`miniprogram/features/<feature>/model/static.ts`
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

### 2. 页面变更时，结构和数据模型要一起收敛

如果原型更新并移除了某个区域，不能只改 WXML/LESS，必须同步清理：

- `model/static.ts` 中对应字段
- `index.ts` 中对应状态与图标变量
- `index.less` 中无效样式块

目标是让代码结构与原型结构保持一致，避免“页面已经删了，但数据模型还拖着旧字段”。

### 3. 静态阶段不接正式业务

允许实现的内容：

- 显示/隐藏
- 弹层开合
- 视觉级轮播
- 点击态/按下态反馈
- SVG 静态图与动画图切换

本阶段不实现：

- 正式路由流转
- 真实用户数据同步
- 真实计时、真实计算链路
- 正式持久化
- store 驱动的业务状态

## 主题层规范

### 主题目录以 Less 为中心

统一使用 `miniprogram/theme/`，不再新增平行的 `miniprogram/styles/`。

当前推荐结构：

```text
miniprogram/theme/
  themes/
    ocean-default.less
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

不要再新增：

- `styles/variables.less`
- `styles/static-page.less`
- TS 版 theme API

### 视觉修改原则

- 视觉 token 优先改 `theme/`
- 页面局部差异再落到页面 Less
- 不要把大面积颜色、圆角、阴影常量散落到多个页面

## SVG 与图标规范

### 1. 默认方案是 `<image>` + base64 SVG

微信小程序里，以下方案都不可靠或维护成本过高：

- 依赖 `currentColor` 的内联 SVG
- `rich-text` 渲染 SVG
- 指望 `<animate>` 在所有场景都稳定播放

当前统一方案：

- 在 `miniprogram/lib/icons.ts` 中生成 SVG 字符串
- 转成 base64 data URI
- 通过 `<image src="...">` 使用

### 2. 动效方案是双资源切换

涉及原型动态图标时，统一使用双图源：

- `staticSrc`
- `animatedSrc`

页面点击或触摸后，短暂切换到 `animatedSrc`，而不是依赖运行时 SVG 动画。

推荐工具函数：

- `icon()`
- `animatedIconPair()`
- `animatedScenePair()`

### 3. 不再使用 `rich-text` 做 SVG

这一条是硬约束。后续如果新增原型动画图标，也继续走双 base64 方案，不要重新引入 `rich-text`。

### 4. 图标缺失时先补 `icons.ts`

如果原型中出现新图标：

1. 先确认 Lucide 名称
2. 补到 `miniprogram/lib/icons.ts`
3. 再在页面 `onLoad` 中生成对应图标

## 页面实现约束

### 1. 主滚动不用 `scroll-view`

页面主滚动一律使用自然页面滚动，不用 `scroll-view` 包整页。

### 2. 非文本容器必须显式尺寸

Skyline 下很多元素默认会被拉伸。以下元素都要显式写：

- `width`
- `height`
- `min-width`

典型对象包括：

- icon 容器
- 圆点
- badge
- logo
- 关闭按钮
- 头像容器

### 3. 复杂布局优先用 flex

优先使用 `flex`，谨慎使用 `grid`。
特别是双列卡片、2x2 看板这类区域，优先用 `flex + wrap`。

### 4. 页面导航采用自定义导航

需要高保真顶部区域时：

- 页面 `index.json` 使用 `navigationStyle: "custom"`
- `index.ts` 中读取 `statusBarHeight`
- WXML 顶部留出状态栏高度

### 5. tab bar 预留底部安全区

页面主体底部要预留足够 padding，避免内容压到 `pp-tab-bar`。

## 交互还原规则

### 1. 原型 hover/active 要翻译成小程序点击态

React 原型里常见的：

- `hover:scale-*`
- `active:scale-*`
- `hover:border-*`
- `group-hover:*`

在小程序里要翻译成：

- 页面 `data` 中的短暂 pressed state
- `bind:tap` 触发
- 200ms 到 300ms 的短反馈
- WXML class 切换

### 2. 点击态不只换图标

如果原型有明显反馈，至少应联动以下一项或多项：

- 边框颜色
- 阴影强度
- icon 容器背景
- 缩放
- 箭头位移
- 覆盖层透明度

不要只做“图标亮一下”，那不算完成高保真还原。

### 3. 自动播放和演示轮播可以保留

如果原型有明显演示属性，例如：

- 等级自动轮播
- 自动预览提示
- 演示用切换效果

静态阶段可以保留，但应明确这是“视觉交互”，不是正式业务。

## 推荐工作流

### 第一步：读原型，不要先看旧代码

先读 `docs/prototype/feature-*/page-*.ts`，确认：

- 页面结构
- 区块顺序
- 文字文案
- 图标清单
- hover/active 反馈
- 弹层与演示交互

### 第二步：提取静态数据

把静态文本、数字、标签、列表项抽到：

`miniprogram/features/<feature>/model/static.ts`

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

`index.ts` 负责：

- 引入 `static.ts`
- 生成 data URI 图标
- 管理视觉交互状态
- 管理短暂点击态

不要在 `index.ts` 中接入正式业务模型。

### 第五步：实现 WXML

WXML 只表达：

- 结构
- 文案绑定
- class 切换
- 事件绑定

避免把复杂判断堆成难以维护的模板逻辑。

### 第六步：实现 Less

Less 负责：

- 间距
- 圆角
- 阴影
- 色彩
- 点击态视觉变化

优先贴近原型，不要擅自“优化成另一套设计”。

### 第七步：做逐区块对照

至少逐区块检查：

- 顺序是否一致
- 留白是否一致
- 圆角是否一致
- 阴影是否一致
- 字号和字重是否一致
- 点击态是否一致
- 弹层是否一致

## 还原验收清单

提交前至少确认以下项目：

- [ ] 页面主结构与最新原型一致
- [ ] 已删除原型中的废弃区域没有残留在代码里
- [ ] 静态数据模型已同步收敛
- [ ] 页面与组件都走 `miniprogram/theme/` 入口
- [ ] 未重新引入 `miniprogram/styles/`
- [ ] SVG 使用 `<image>` + base64 方案
- [ ] 动态图标使用 `staticSrc / animatedSrc`
- [ ] 主滚动未使用 `scroll-view`
- [ ] 非文本容器已显式尺寸
- [ ] 只实现视觉交互，没有混入正式业务逻辑

## 文件模板

```text
miniprogram/
  lib/icons.ts
  theme/
    themes/
    foundations/
    entries/
  features/<feature>/
    model/static.ts
    pages/<page>/
      index.json
      index.ts
      index.wxml
      index.less
```

## 一句话原则

高保真原型还原阶段，默认选择“更像原型”的实现，而不是“更像正式业务”的实现。
