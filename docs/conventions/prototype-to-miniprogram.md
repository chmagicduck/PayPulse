# 微信小程序高保真原型还原指南

## 适用场景

将 React + Tailwind 高保真原型（`docs/prototype/`）1:1 还原为微信小程序页面。只做视觉还原，不实现业务逻辑，用假数据替代。

## 核心踩坑经验

### 1. Skyline `defaultDisplayBlock: true` 是万恶之源

所有元素默认是 block，会导致：
- 本该是正方形的图标容器被拉成长方形
- flex 子元素宽度异常
- 行内元素撑满整行

**解决方案**：所有需要固定尺寸的元素必须写 `width` + `height` + `min-width`：

```less
// 错误：会被拉伸
.icon-wrap {
  padding: 16rpx;
  border-radius: 16rpx;
}

// 正确：显式约束
.icon-wrap {
  width: 64rpx;
  height: 64rpx;
  min-width: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

同理：圆点、徽章、Logo、关闭按钮等所有非文本容器都要显式尺寸。

### 2. 图标方案：Base64 Data URI

微信小程序 `<image>` 不支持 CSS `currentColor`，内联 `<svg>` 标签兼容性不稳。

**最佳方案**：`lib/icons.ts` 工具 —— JS 生成 SVG 字符串 → `wx.arrayBufferToBase64` → data URI → `<image src>`。

```typescript
// lib/icons.ts 已实现
import { icon } from '../../../../lib/icons'

// 在 onLoad 中生成所有需要的图标
this.setData({
  iconEye: icon('eye', '#bfdbfe', 14),      // 名称, 颜色, 尺寸
  iconCoffee: icon('coffee', '#ffffff', 18),
})
```

```xml
<image class="icon-sm" src="{{iconEye}}" mode="aspectFit" />
```

**图标路径数据来源**：Lucide Icons 官方 SVG path。新增图标只需在 `lib/icons.ts` 的 `PATHS` 对象中添加。

### 3. 避开微信原生胶囊按钮

自定义导航栏右侧必须留出胶囊按钮空间：

```less
.nav-badge {
  margin-right: 190rpx; // 避开胶囊
}
```

更精确的做法是用 `wx.getMenuButtonBoundingClientRect()` 动态获取。

### 4. 导航栏状态栏适配

```typescript
const { statusBarHeight } = wx.getSystemInfoSync()
```

```xml
<view style="padding-top: {{statusBarHeight}}px;">
```

### 5. 布局用 flex 不用 grid

Skyline 下 `display: grid` 的 `1fr 1fr` 可能导致子元素溢出。改用 flex：

```less
// 避免
.grid { display: grid; grid-template-columns: 1fr 1fr; }

// 推荐
.grid { display: flex; gap: 16rpx; }
.grid-item { flex: 1; }

// 2x2 网格
.grid { display: flex; flex-wrap: wrap; gap: 12rpx; }
.grid-item { width: calc(50% - 6rpx); }
```

### 6. 不要用 scroll-view 做页面主滚动

会导致灰色遮罩、弹性效果异常。直接用 `<view>` 让页面自然滚动。

### 7. 底部标签栏用纯白背景

`rgba(255,255,255,0.95)` + `backdrop-filter` 在安全区域下方会透出页面灰色背景。直接用 `#ffffff`。

### 8. `box-sizing: border-box` 必须全局设置

```less
view, text, image, input {
  box-sizing: border-box;
}
```

## 还原工作流

### 第一步：读原型，提取假数据

读 `docs/prototype/feature-xxx/page-xxx.ts`，提取所有静态文本、数字到 `model/static.ts`。不含图标路径（图标在 JS 中通过 `icon()` 生成）。

### 第二步：确认图标清单

列出原型中所有 Lucide 图标名称和使用颜色。检查 `lib/icons.ts` 的 `PATHS` 是否包含，缺的补上。

### 第三步：写页面 TS

- 导入 `static.ts` 假数据和 `icon()` 函数
- `data` 中声明所有图标变量（初始空字符串）
- `onLoad` 中批量 `setData` 所有图标 data URI
- 只写视觉交互（切换显示/隐藏），不写业务逻辑

### 第四步：写 WXML

- 导航栏直接写在页面内（不用组件），不固定
- 用 `<image src="{{iconXxx}}">` 引用图标
- 底部放 `<pp-tab-bar activeTab="xxx" />`

### 第五步：写 Less

核心原则：
- 所有非文本容器显式 `width` + `height` + `min-width`
- 用 flex 不用 grid
- 主内容区用 `<view>` 不用 `scroll-view`
- padding 底部留 `200rpx` 给标签栏

### 第六步：对照原型微调

逐区块对比：字号、间距、圆角、颜色、行高。Tailwind 到 rpx 的常用换算：

| Tailwind | rpx |
|----------|-----|
| text-[10px] | 18-20rpx |
| text-xs (12px) | 22-24rpx |
| text-sm (14px) | 26-28rpx |
| text-lg (18px) | 32-36rpx |
| text-xl (20px) | 36-40rpx |
| text-3xl (30px) | 52-56rpx |
| text-4xl (36px) | 64-72rpx |
| p-4 (16px) | 28-32rpx |
| p-5 (20px) | 36-40rpx |
| p-6 (24px) | 44-48rpx |
| rounded-2xl (16px) | 28-32rpx |
| rounded-3xl (24px) | 40-48rpx |
| gap-3 (12px) | 20-24rpx |
| gap-4 (16px) | 28-32rpx |

## 文件清单模板

```
miniprogram/
  lib/icons.ts                           # 图标工具（全局共用）
  features/<feature>/
    model/static.ts                      # 假数据
    pages/<page>/
      index.json                         # navigationStyle: custom + usingComponents
      index.ts                           # 假数据 + icon() 生成
      index.wxml                         # 视觉结构
      index.less                         # 样式
```
