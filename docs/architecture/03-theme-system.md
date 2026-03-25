# 主题系统

## 当前结论

项目当前使用的是“以 Less 为中心的静态主题层”，不是运行时 TS 主题系统。

主题系统的目标是：

- 为高保真原型还原提供稳定的视觉入口
- 为后续第二套主题预留目录分层
- 避免页面样式各写各的 token

## 目录分层

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

### 各层职责

- `themes/ocean-default.less`：颜色、圆角、间距、阴影、动效等主题 token
- `foundations/base.less`：reset 与全局基础规则
- `foundations/mixins.less`：Less mixin
- `foundations/animation.less`：共享动画定义
- `foundations/typography.less`：文字风格基础
- `entries/core.less`：给组件使用的主题入口
- `entries/static-page.less`：给静态页面使用的主题入口

## 导入规则

### 组件

组件 Less 统一引入：

```less
@import '../../theme/entries/core.less';
```

### 页面

页面 Less 统一引入：

```less
@import '../../../../theme/entries/static-page.less';
```

## 规则

- 视觉调整优先改 `miniprogram/theme/`
- 页面只处理页面局部差异，不承担 token 定义职责
- 不再新增平行的 `miniprogram/styles/`
- 不再保留 TS 版 theme API 作为内部约定
- 新主题通过新增 Less 主题文件接入，不做运行时动态换肤

## 已废弃方案

以下方案视为旧层，不应恢复：

- `theme/index.ts`
- `theme/semantic.ts`
- `theme/themes/*.ts`
- `theme/tokens/*.ts`
- `store/theme-store.ts`

如果文档、代码或新提交再次引入这些内容，应视为偏离当前架构。

## 与高保真还原的关系

高保真原型还原阶段，主题层的职责是“统一视觉入口”，不是“重写原型视觉”。

这意味着：

- 原型已有明确视觉特征时，优先忠实还原
- 可抽到主题的公共 token 再抽，不要先抽象后还原
- 页面视觉语言如果已经稳定复用，再上提到 `theme/` 或共享组件
