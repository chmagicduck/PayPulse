# AI 协作流程

## 新功能开发

1. 读取 `docs/prototype/manifest.json`
2. 确认目标页面对应的高保真原型文件
3. 如需先做静态还原，优先落地 `model/static.ts + page`
4. 再补 `docs/prd/<feature-id>/overview.md` 与页面 PRD
5. 最后再进入正式业务实现

## 高保真原型还原

默认工作模式如下：

1. 先读最新原型，再看现有代码
2. 以原型为唯一视觉基准，不用旧实现反推页面结构
3. 静态阶段只做视觉与演示级交互，不接正式业务
4. 页面变更时同步收敛 `static.ts`、`index.ts`、`index.wxml`、`index.less`
5. SVG 一律走 `image + base64`，动态效果使用 `staticSrc / animatedSrc` 双资源切换
6. 页面和组件统一走 `miniprogram/theme/` 入口，不新增 `styles/`

详细规则见：

- `docs/conventions/prototype-to-miniprogram.md`

## UI 调整

1. 先确认是“原型还原问题”还是“正式需求变更”
2. 先检查是否能复用现有 `components/ui` 或共享页面结构
3. 只有当原型已经在多个页面稳定复用时，再抽象为共享组件
4. 不要为了抽象牺牲当前页面还原度

## 主题调整

1. 优先改 `miniprogram/theme/`
2. 组件改 `theme/entries/core.less`
3. 页面改 `theme/entries/static-page.less`
4. 避免在单页里散落主题级颜色和阴影修补

## 交互逻辑调整

### 静态阶段

- 允许：弹层、轮播、按下态、显隐、演示切换
- 不允许：正式存储、正式同步、真实业务链路

### 正式业务阶段

1. 先更新页面 PRD 中的状态与交互描述
2. 再修改 `model/actions.ts`、`model/state.ts`、`model/storage.ts`
3. 页面文件只保留装配层代码与事件绑定
