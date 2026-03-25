# 状态与存储

## 状态分层

- 页面局部视觉状态：页面文件
- feature 业务状态：`features/<feature-id>/model/state.ts`
- feature 持久化状态：`features/<feature-id>/model/storage.ts`
- 全局应用状态：`miniprogram/store/`

## 存储规则

- 每个持久化 key 都必须在当前版本 PRD 的状态或存储章节中登记
- 存储访问逻辑放在 feature model 内，不放页面里
- 解析与校验逻辑应与存储访问放在一起

## 推荐的 Model 文件

- `types.ts`：领域类型
- `schema.ts`：结构定义与默认值
- `state.ts`：内存态派生与 selector
- `actions.ts`：业务动作
- `storage.ts`：持久化访问
