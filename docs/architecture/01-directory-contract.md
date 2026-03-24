# 目录契约

## 稳定目录

- `docs/architecture/`：全局架构规则，低频修改
- `docs/conventions/`：实现约定与模板
- `docs/prototype/`：按 feature 分组的原型输入
- `docs/prd/`：按 feature 和 page 切片的 PRD 输出
- `miniprogram/config/`：路由、功能注册与清单
- `miniprogram/features/`：按 feature 隔离的业务代码
- `miniprogram/components/ui/`：基础 UI 原子组件
- `miniprogram/components/patterns/`：可复用的页面模式组件
- `miniprogram/theme/`：主题 token、语义槽位与视觉配方
- `miniprogram/lib/`：纯工具与平台封装
- `miniprogram/store/`：仅存放全局状态

## Feature 目录契约

每个 feature 默认拥有：

- `README.md`
- `public.ts`
- `model/`
- `components/`
- `pages/`

理解一个 feature 时，优先只读：

1. `README.md`
2. 对应页面 PRD
3. 页面入口文件

## 禁止漂移

- 不要把 feature 逻辑放进 `components/`
- 不要把页面私有状态放进 `store/`
- 不要把主题常量写死在页面样式里
- 不要直接引用其他 feature 的内部文件
