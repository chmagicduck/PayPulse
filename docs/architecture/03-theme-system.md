# 视觉基础层

`miniprogram/theme/` 现在只表示“单套视觉基础层”，不再承担多主题扩展概念。

## 目录

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

## 职责

- `tokens.less`：唯一一套颜色、圆角、间距、阴影、动效 token
- `foundations/`：基础 mixin、排版、动画和 reset
- `entries/core.less`：组件入口
- `entries/static-page.less`：页面入口

## 导入规则

组件：

```less
@import '../../theme/entries/core.less';
```

页面：

```less
@import '../../../theme/entries/static-page.less';
```

## 规则

- 视觉调整优先改 `miniprogram/theme/`
- 页面只处理局部差异，不自行定义一套新的基础 token
- 不再新增 `styles/` 平行目录
- 不再设计第二套主题，不做运行时换肤
